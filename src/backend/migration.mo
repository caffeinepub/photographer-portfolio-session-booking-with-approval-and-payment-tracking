import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type PortfolioItem = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
    category : Text;
    timestamp : Time.Time;
  };

  type SessionDetails = {
    sessionType : Text;
    location : Text;
    description : Text;
    date : Text;
    time : Text;
  };

  type ClientDetails = {
    name : Text;
    email : Text;
    phone : Text;
    additionalNotes : Text;
  };

  type BookingStatus = {
    #pending;
    #accepted;
    #denied;
    #confirmed;
  };

  type PaymentStatus = {
    #unpaid;
    #paid;
    #refunded;
  };

  type BookingRequest = {
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

  type ClientAlbum = {
    id : Nat;
    name : Text;
    clientName : Text;
    description : Text;
    password : Text;
    photoUrls : [Text];
    coverPhotoUrl : Text;
    createdAt : Time.Time;
  };

  type Testimonial = {
    id : Nat;
    clientName : Text;
    quote : Text;
    sport : ?Text;
    approved : Bool;
    createdAt : Time.Time;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    portfolioItems : Map.Map<Nat, PortfolioItem>;
    bookings : Map.Map<Nat, BookingRequest>;
    clientAlbums : Map.Map<Nat, ClientAlbum>;
    nextPortfolioId : Nat;
    nextBookingId : Nat;
    nextAlbumId : Nat;
    scheduledReminders : List.List<(Nat, BookingRequest)>;
    heroBackgroundUrl : Text;
    unavailableDates : [Text];
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    portfolioItems : Map.Map<Nat, PortfolioItem>;
    bookings : Map.Map<Nat, BookingRequest>;
    clientAlbums : Map.Map<Nat, ClientAlbum>;
    testimonials : Map.Map<Nat, Testimonial>;
    nextPortfolioId : Nat;
    nextBookingId : Nat;
    nextAlbumId : Nat;
    nextTestimonialId : Nat;
    scheduledReminders : List.List<(Nat, BookingRequest)>;
    heroBackgroundUrl : Text;
    unavailableDates : [Text];
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      testimonials = Map.empty<Nat, Testimonial>();
      nextTestimonialId = 0;
    };
  };
};
