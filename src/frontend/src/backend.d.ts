import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Testimonial {
    id: bigint;
    clientName: string;
    createdAt: Time;
    quote: string;
    sport?: string;
    approved: boolean;
}
export type Time = bigint;
export interface BookingRequest {
    id: bigint;
    status: BookingStatus;
    client: ClientDetails;
    paymentStatus: PaymentStatus;
    session: SessionDetails;
    timestamp: Time;
    photographerNotes: string;
    proposedDateTime?: string;
    price?: bigint;
}
export interface PublicAlbumView {
    id: bigint;
    clientName: string;
    name: string;
    description: string;
    photoCount: bigint;
    coverPhotoUrl: string;
}
export interface PortfolioItem {
    id: bigint;
    title: string;
    description: string;
    imageUrl: string;
    timestamp: Time;
    category: string;
}
export interface SessionDetails {
    sessionType: string;
    date: string;
    time: string;
    description: string;
    location: string;
}
export interface ClientAlbum {
    id: bigint;
    photoUrls: Array<string>;
    clientName: string;
    password: string;
    name: string;
    createdAt: Time;
    description: string;
    coverPhotoUrl: string;
}
export interface ClientDetails {
    additionalNotes: string;
    name: string;
    email: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum BookingStatus {
    pending = "pending",
    denied = "denied",
    confirmed = "confirmed",
    accepted = "accepted"
}
export enum PaymentStatus {
    paid = "paid",
    refunded = "refunded",
    unpaid = "unpaid"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptBooking(id: bigint, proposedDateTime: string | null, notes: string): Promise<void>;
    addPhotoToAlbum(albumId: bigint, photoUrl: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmBooking(id: bigint, confirmedDateTime: string): Promise<void>;
    createAlbum(name: string, clientName: string, description: string, password: string, coverPhotoUrl: string): Promise<bigint>;
    createBookingRequest(client: ClientDetails, session: SessionDetails): Promise<bigint>;
    createPortfolioItem(title: string, description: string, imageUrl: string, category: string): Promise<bigint>;
    createTestimonial(clientName: string, quote: string, sport: string | null): Promise<bigint>;
    deleteAlbum(id: bigint): Promise<void>;
    deletePortfolioItem(id: bigint): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    denyBooking(id: bigint, notes: string): Promise<void>;
    getAllAlbums(): Promise<Array<ClientAlbum>>;
    getAllPortfolioItems(): Promise<Array<PortfolioItem>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getApprovedTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHeroBackground(): Promise<string>;
    getPortfolioItem(id: bigint): Promise<PortfolioItem | null>;
    getReminders(): Promise<Array<[bigint, BookingRequest]>>;
    getTestimonial(id: bigint): Promise<Testimonial | null>;
    getUnavailableDates(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAlbums(): Promise<Array<PublicAlbumView>>;
    markBookingAsPaid(id: bigint): Promise<void>;
    removePhotoFromAlbum(albumId: bigint, photoUrl: string): Promise<void>;
    retrieveAllBookingRequests(): Promise<Array<BookingRequest>>;
    retrieveBookingRequest(id: bigint): Promise<BookingRequest | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setBookingPrice(id: bigint, price: bigint): Promise<void>;
    setHeroBackground(url: string): Promise<void>;
    setUnavailableDates(dates: Array<string>): Promise<void>;
    submitTestimonial(clientName: string, quote: string, sport: string | null): Promise<bigint>;
    toggleTestimonialApproval(id: bigint): Promise<void>;
    updateAlbum(id: bigint, name: string, clientName: string, description: string, password: string, coverPhotoUrl: string): Promise<void>;
    updatePaymentStatus(id: bigint, status: PaymentStatus): Promise<void>;
    updatePortfolioItem(id: bigint, title: string, description: string, imageUrl: string, category: string): Promise<void>;
    updateTestimonial(id: bigint, clientName: string, quote: string, sport: string | null): Promise<void>;
    verifyAlbumPassword(albumId: bigint, password: string): Promise<Array<string> | null>;
}
