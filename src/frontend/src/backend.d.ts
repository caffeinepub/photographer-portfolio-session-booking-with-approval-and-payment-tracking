import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
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
export interface ClientDetails {
    additionalNotes: string;
    name: string;
    email: string;
    phone: string;
}
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmBooking(id: bigint, confirmedDateTime: string): Promise<void>;
    createBookingRequest(client: ClientDetails, session: SessionDetails): Promise<bigint>;
    createPortfolioItem(title: string, description: string, imageUrl: string, category: string): Promise<bigint>;
    deletePortfolioItem(id: bigint): Promise<void>;
    denyBooking(id: bigint, notes: string): Promise<void>;
    getAllPortfolioItems(): Promise<Array<PortfolioItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPortfolioItem(id: bigint): Promise<PortfolioItem | null>;
    getReminders(): Promise<Array<[bigint, BookingRequest]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markBookingAsPaid(id: bigint): Promise<void>;
    retrieveAllBookingRequests(): Promise<Array<BookingRequest>>;
    retrieveBookingRequest(id: bigint): Promise<BookingRequest | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setBookingPrice(id: bigint, price: bigint): Promise<void>;
    updatePaymentStatus(id: bigint, status: PaymentStatus): Promise<void>;
    updatePortfolioItem(id: bigint, title: string, description: string, imageUrl: string, category: string): Promise<void>;
}
