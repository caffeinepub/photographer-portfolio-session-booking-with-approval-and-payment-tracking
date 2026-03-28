import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookingRequest,
  BookingStatus,
  ClientAlbum,
  PaymentStatus,
  PortfolioItem,
  PublicAlbumView,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Portfolio Queries
export function useGetAllPortfolioItems() {
  const { actor, isFetching } = useActor();

  return useQuery<PortfolioItem[]>({
    queryKey: ["portfolioItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPortfolioItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPortfolioItem(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PortfolioItem | null>({
    queryKey: ["portfolioItem", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getPortfolioItem(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Admin Check — keyed by identity principal so it re-checks on every login
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const principalKey = identity?.getPrincipal().toString() ?? "anonymous";

  return useQuery<boolean>({
    queryKey: ["isAdmin", principalKey],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

// Booking Queries (Public)
export function useCreateBookingRequest() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { client: any; session: any }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBookingRequest(data.client, data.session);
    },
  });
}

// Admin Booking Queries
export function useGetAllBookingRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<BookingRequest[]>({
    queryKey: ["bookingRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.retrieveAllBookingRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingRequest(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<BookingRequest | null>({
    queryKey: ["bookingRequest", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.retrieveBookingRequest(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAcceptBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      proposedDateTime: string | null;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.acceptBooking(data.id, data.proposedDateTime, data.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["bookingRequest"] });
    },
  });
}

export function useDenyBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; notes: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.denyBooking(data.id, data.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["bookingRequest"] });
    },
  });
}

export function useConfirmBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; confirmedDateTime: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.confirmBooking(data.id, data.confirmedDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["bookingRequest"] });
    },
  });
}

export function useSetBookingPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; price: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setBookingPrice(data.id, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["bookingRequest"] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; status: PaymentStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePaymentStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["bookingRequest"] });
    },
  });
}

export function useMarkBookingAsPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markBookingAsPaid(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["bookingRequest"] });
    },
  });
}

// Portfolio Admin Mutations
export function useCreatePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      imageUrl: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPortfolioItem(
        data.title,
        data.description,
        data.imageUrl,
        data.category,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioItems"] });
    },
  });
}

export function useUpdatePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      imageUrl: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePortfolioItem(
        data.id,
        data.title,
        data.description,
        data.imageUrl,
        data.category,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioItems"] });
      queryClient.invalidateQueries({ queryKey: ["portfolioItem"] });
    },
  });
}

export function useDeletePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePortfolioItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioItems"] });
    },
  });
}

// ---- Album Queries ----

export function useListAlbums() {
  const { actor, isFetching } = useActor();

  return useQuery<PublicAlbumView[]>({
    queryKey: ["albums"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAlbums();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAlbums() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const principalKey = identity?.getPrincipal().toString() ?? "anonymous";

  return useQuery<ClientAlbum[]>({
    queryKey: ["allAlbums", principalKey],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAlbums();
    },
    enabled: !!actor && !isFetching && principalKey !== "anonymous",
  });
}

export function useVerifyAlbumPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { albumId: bigint; password: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.verifyAlbumPassword(data.albumId, data.password);
    },
  });
}

export function useCreateAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      clientName: string;
      description: string;
      password: string;
      coverPhotoUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createAlbum(
        data.name,
        data.clientName,
        data.description,
        data.password,
        data.coverPhotoUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAlbums"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}

export function useUpdateAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      clientName: string;
      description: string;
      password: string;
      coverPhotoUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAlbum(
        data.id,
        data.name,
        data.clientName,
        data.description,
        data.password,
        data.coverPhotoUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAlbums"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}

export function useDeleteAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAlbum(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAlbums"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}

export function useAddPhotoToAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { albumId: bigint; photoUrl: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPhotoToAlbum(data.albumId, data.photoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAlbums"] });
    },
  });
}

export function useRemovePhotoFromAlbum() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { albumId: bigint; photoUrl: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removePhotoFromAlbum(data.albumId, data.photoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAlbums"] });
    },
  });
}

// ---- Hero Background ----

export function useGetHeroBackground() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["heroBackground"],
    queryFn: async () => {
      if (!actor) return "";
      return (actor as any).getHeroBackground();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetHeroBackground() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).setHeroBackground(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroBackground"] });
    },
  });
}

// ---- Availability ----

export function useGetUnavailableDates() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["unavailableDates"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getUnavailableDates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetUnavailableDates() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dates: string[]) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).setUnavailableDates(dates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unavailableDates"] });
    },
  });
}
