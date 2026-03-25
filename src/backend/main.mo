
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Timer "mo:core/Timer";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  // Mixins for storage and authorization
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Types
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  // Portfolio Types
  public type PortfolioItem = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
    category : Text;
    timestamp : Time.Time;
  };

  // Booking Types
  public type SessionDetails = {
    sessionType : Text;
    location : Text;
    description : Text;
    date : Text;
    time : Text;
  };

  public type ClientDetails = {
    name : Text;
    email : Text;
    phone : Text;
    additionalNotes : Text;
  };

  public type BookingStatus = {
    #pending;
    #accepted;
    #denied;
    #confirmed;
  };

  public type PaymentStatus = {
    #unpaid;
    #paid;
    #refunded;
  };

  public type BookingRequest = {
    id : Nat;
    client : ClientDetails;
    session : SessionDetails;
    timestamp : Time.Time;
    status : BookingStatus;
    photographerNotes : Text;
    proposedDateTime : ?Text;
    price : ?Nat;
    paymentStatus : PaymentStatus;
  };

  // Client Album Types
  public type ClientAlbum = {
    id : Nat;
    name : Text;
    clientName : Text;
    description : Text;
    password : Text;
    photoUrls : [Text];
    coverPhotoUrl : Text;
    createdAt : Time.Time;
  };

  public type PublicAlbumView = {
    id : Nat;
    name : Text;
    clientName : Text;
    description : Text;
    coverPhotoUrl : Text;
    photoCount : Nat;
  };

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let portfolioItems = Map.empty<Nat, PortfolioItem>();
  let bookings = Map.empty<Nat, BookingRequest>();
  let clientAlbums = Map.empty<Nat, ClientAlbum>();
  var nextPortfolioId : Nat = 0;
  var nextBookingId : Nat = 0;
  var nextAlbumId : Nat = 0;
  let scheduledReminders = List.empty<(Nat, BookingRequest)>();

  // Hero Background URL (settable by admin)
  var heroBackgroundUrl : Text = "";

  // Hero Background Functions
  public query func getHeroBackground() : async Text {
    heroBackgroundUrl;
  };

  public shared ({ caller }) func setHeroBackground(url : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can set hero background");
    };
    heroBackgroundUrl := url;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can access or save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only authorized users can access user profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can access or save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Portfolio Management Functions (Admin-only)
  public shared ({ caller }) func createPortfolioItem(
    title : Text,
    description : Text,
    imageUrl : Text,
    category : Text,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can create portfolio items");
    };

    if (category != "sports" and category != "concert") {
      Runtime.trap("Invalid category: Only sports and concert categories are allowed");
    };

    let id = nextPortfolioId;
    nextPortfolioId += 1;

    let item : PortfolioItem = {
      id;
      title;
      description;
      imageUrl;
      category;
      timestamp = Time.now();
    };

    portfolioItems.add(id, item);
    id;
  };

  public shared ({ caller }) func updatePortfolioItem(
    id : Nat,
    title : Text,
    description : Text,
    imageUrl : Text,
    category : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can update portfolio items");
    };

    if (category != "sports" and category != "concert") {
      Runtime.trap("Invalid category: Only sports and concert categories are allowed");
    };

    switch (portfolioItems.get(id)) {
      case (null) { Runtime.trap("Portfolio item not found") };
      case (?existing) {
        let updated : PortfolioItem = {
          id = id;
          title;
          description;
          imageUrl;
          category;
          timestamp = existing.timestamp;
        };
        portfolioItems.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deletePortfolioItem(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can delete portfolio items");
    };

    switch (portfolioItems.get(id)) {
      case (null) { Runtime.trap("Portfolio item not found") };
      case (?_) { portfolioItems.remove(id) };
    };
  };

  // Public portfolio viewing (no auth required)
  public query func getPortfolioItem(id : Nat) : async ?PortfolioItem {
    portfolioItems.get(id);
  };

  public query func getAllPortfolioItems() : async [PortfolioItem] {
    let iter = portfolioItems.values();
    iter.toArray();
  };

  // Booking Request Functions
  // Public users can create booking requests (no auth check)
  public shared ({ caller }) func createBookingRequest(
    client : ClientDetails,
    session : SessionDetails,
  ) : async Nat {
    if (session.sessionType != "sports" and session.sessionType != "concert") {
      Runtime.trap("Invalid session type: Only sports and concert sessions are allowed");
    };

    let id = nextBookingId;
    nextBookingId += 1;

    let booking : BookingRequest = {
      id;
      client;
      session;
      timestamp = Time.now();
      status = #pending;
      photographerNotes = "";
      proposedDateTime = null;
      price = null;
      paymentStatus = #unpaid;
    };

    bookings.add(id, booking);
    addReminder(id, booking);
    id;
  };

  // Admin-only: View specific booking
  public query ({ caller }) func retrieveBookingRequest(id : Nat) : async ?BookingRequest {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can view booking details");
    };
    bookings.get(id);
  };

  // Admin-only: View all bookings
  public query ({ caller }) func retrieveAllBookingRequests() : async [BookingRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can view all bookings");
    };
    let iter = bookings.values();
    iter.toArray();
  };

  // Admin-only: Accept booking
  public shared ({ caller }) func acceptBooking(
    id : Nat,
    proposedDateTime : ?Text,
    notes : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can accept bookings");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?existing) {
        let updated : BookingRequest = {
          id = existing.id;
          client = existing.client;
          session = existing.session;
          timestamp = existing.timestamp;
          status = #accepted;
          photographerNotes = notes;
          proposedDateTime;
          price = existing.price;
          paymentStatus = existing.paymentStatus;
        };
        bookings.add(id, updated);
      };
    };
  };

  // Admin-only: Deny booking
  public shared ({ caller }) func denyBooking(id : Nat, notes : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can deny bookings");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?existing) {
        let updated : BookingRequest = {
          id = existing.id;
          client = existing.client;
          session = existing.session;
          timestamp = existing.timestamp;
          status = #denied;
          photographerNotes = notes;
          proposedDateTime = existing.proposedDateTime;
          price = existing.price;
          paymentStatus = existing.paymentStatus;
        };
        bookings.add(id, updated);
      };
    };
  };

  // Admin-only: Confirm booking
  public shared ({ caller }) func confirmBooking(id : Nat, confirmedDateTime : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can confirm bookings");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?existing) {
        let updated : BookingRequest = {
          id = existing.id;
          client = existing.client;
          session = existing.session;
          timestamp = existing.timestamp;
          status = #confirmed;
          photographerNotes = existing.photographerNotes;
          proposedDateTime = ?confirmedDateTime;
          price = existing.price;
          paymentStatus = existing.paymentStatus;
        };
        bookings.add(id, updated);
      };
    };
  };

  // Admin-only: Set price/quote
  public shared ({ caller }) func setBookingPrice(id : Nat, price : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can set booking prices");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?existing) {
        let updated : BookingRequest = {
          id = existing.id;
          client = existing.client;
          session = existing.session;
          timestamp = existing.timestamp;
          status = existing.status;
          photographerNotes = existing.photographerNotes;
          proposedDateTime = existing.proposedDateTime;
          price = ?price;
          paymentStatus = existing.paymentStatus;
        };
        bookings.add(id, updated);
      };
    };
  };

  // Admin-only: Update payment status
  public shared ({ caller }) func updatePaymentStatus(id : Nat, status : PaymentStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can update payment status");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?existing) {
        let updated : BookingRequest = {
          id = existing.id;
          client = existing.client;
          session = existing.session;
          timestamp = existing.timestamp;
          status = existing.status;
          photographerNotes = existing.photographerNotes;
          proposedDateTime = existing.proposedDateTime;
          price = existing.price;
          paymentStatus = status;
        };
        bookings.add(id, updated);
      };
    };
  };

  // Admin-only: Mark as paid
  public shared ({ caller }) func markBookingAsPaid(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can mark bookings as paid");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?existing) {
        let updated : BookingRequest = {
          id = existing.id;
          client = existing.client;
          session = existing.session;
          timestamp = existing.timestamp;
          status = existing.status;
          photographerNotes = existing.photographerNotes;
          proposedDateTime = existing.proposedDateTime;
          price = existing.price;
          paymentStatus = #paid;
        };
        bookings.add(id, updated);
      };
    };
  };

  // Reminder system
  func addReminder(id : Nat, booking : BookingRequest) {
    let iter = scheduledReminders.values();
    let remindersArray = iter.toArray();
    let newRemindersArray = remindersArray.concat([(id, booking)]);
    scheduledReminders.clear();
    scheduledReminders.addAll(newRemindersArray.values());
  };

  // Admin-only: Get reminders
  public query ({ caller }) func getReminders() : async [(Nat, BookingRequest)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can view reminders");
    };
    scheduledReminders.toArray();
  };

  // Client Album Functions
  // Admin-only: Create album
  public shared ({ caller }) func createAlbum(
    name : Text,
    clientName : Text,
    description : Text,
    password : Text,
    coverPhotoUrl : Text,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can create albums");
    };

    let id = nextAlbumId;
    nextAlbumId += 1;

    let album : ClientAlbum = {
      id;
      name;
      clientName;
      description;
      password;
      photoUrls = [];
      coverPhotoUrl;
      createdAt = Time.now();
    };

    clientAlbums.add(id, album);
    id;
  };

  // Admin-only: Update album
  public shared ({ caller }) func updateAlbum(
    id : Nat,
    name : Text,
    clientName : Text,
    description : Text,
    password : Text,
    coverPhotoUrl : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can update albums");
    };

    switch (clientAlbums.get(id)) {
      case (null) { Runtime.trap("Album not found") };
      case (?existing) {
        let updated : ClientAlbum = {
          id = id;
          name;
          clientName;
          description;
          password;
          photoUrls = existing.photoUrls;
          coverPhotoUrl;
          createdAt = existing.createdAt;
        };
        clientAlbums.add(id, updated);
      };
    };
  };

  // Admin-only: Delete album
  public shared ({ caller }) func deleteAlbum(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can delete albums");
    };

    switch (clientAlbums.get(id)) {
      case (null) { Runtime.trap("Album not found") };
      case (?_) { clientAlbums.remove(id) };
    };
  };

  // Admin-only: Add photo to album
  public shared ({ caller }) func addPhotoToAlbum(albumId : Nat, photoUrl : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can add photos to albums");
    };

    switch (clientAlbums.get(albumId)) {
      case (null) { Runtime.trap("Album not found") };
      case (?existing) {
        let updated : ClientAlbum = {
          id = existing.id;
          name = existing.name;
          clientName = existing.clientName;
          description = existing.description;
          password = existing.password;
          photoUrls = existing.photoUrls.concat([photoUrl]);
          coverPhotoUrl = existing.coverPhotoUrl;
          createdAt = existing.createdAt;
        };
        clientAlbums.add(albumId, updated);
      };
    };
  };

  // Admin-only: Remove photo from album
  public shared ({ caller }) func removePhotoFromAlbum(albumId : Nat, photoUrl : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can remove photos from albums");
    };

    switch (clientAlbums.get(albumId)) {
      case (null) { Runtime.trap("Album not found") };
      case (?existing) {
        let updated : ClientAlbum = {
          id = existing.id;
          name = existing.name;
          clientName = existing.clientName;
          description = existing.description;
          password = existing.password;
          photoUrls = existing.photoUrls.filter(func(url) { url != photoUrl });
          coverPhotoUrl = existing.coverPhotoUrl;
          createdAt = existing.createdAt;
        };
        clientAlbums.add(albumId, updated);
      };
    };
  };

  // Admin-only: Get all albums
  public query ({ caller }) func getAllAlbums() : async [ClientAlbum] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can view all albums");
    };
    let iter = clientAlbums.values();
    iter.toArray();
  };

  // Public: List albums (no passwords)
  public query func listAlbums() : async [PublicAlbumView] {
    let iter = clientAlbums.values();
    iter.map(
      func(album) {
        {
          id = album.id;
          name = album.name;
          clientName = album.clientName;
          description = album.description;
          coverPhotoUrl = album.coverPhotoUrl;
          photoCount = album.photoUrls.size();
        };
      }
    ).toArray();
  };

  // Public: Verify album password
  public query func verifyAlbumPassword(albumId : Nat, password : Text) : async ?[Text] {
    switch (clientAlbums.get(albumId)) {
      case (null) { null };
      case (?album) {
        if (album.password == password) {
          ?album.photoUrls;
        } else {
          null;
        };
      };
    };
  };
};
