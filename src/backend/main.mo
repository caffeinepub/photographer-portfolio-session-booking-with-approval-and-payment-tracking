import Map "mo:core/Map";
import Array "mo:core/Array";
import Timer "mo:core/Timer";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // Storage
  let portfolioItems = Map.empty<Nat, PortfolioItem>();
  var nextPortfolioId : Nat = 0;

  let bookings = Map.empty<Nat, BookingRequest>();
  var nextBookingId : Nat = 0;

  let scheduledReminders = List.empty<(Nat, BookingRequest)>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Portfolio Management Functions (Admin-only)
  public shared ({ caller }) func createPortfolioItem(
    title : Text,
    description : Text,
    imageUrl : Text,
    category : Text
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
      id = id;
      title = title;
      description = description;
      imageUrl = imageUrl;
      category = category;
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
    category : Text
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
          title = title;
          description = description;
          imageUrl = imageUrl;
          category = category;
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
    session : SessionDetails
  ) : async Nat {
    if (session.sessionType != "sports" and session.sessionType != "concert") {
      Runtime.trap("Invalid session type: Only sports and concert sessions are allowed");
    };

    let id = nextBookingId;
    nextBookingId += 1;

    let booking : BookingRequest = {
      id = id;
      client = client;
      session = session;
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
    notes : Text
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
          proposedDateTime = proposedDateTime;
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

  // Reminder system (internal)
  func addReminder(id : Nat, booking : BookingRequest) {
    scheduledReminders.add((id, booking));
  };

  func sendReminders() {
    // Implementation for sending reminders
    // This would typically integrate with external notification systems
  };

  // Admin-only: Get reminders
  public query ({ caller }) func getReminders() : async [(Nat, BookingRequest)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only photographer can view reminders");
    };
    scheduledReminders.toArray();
  };
};
