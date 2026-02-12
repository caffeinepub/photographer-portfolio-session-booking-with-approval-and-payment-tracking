import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PortfolioItem, BookingRequest, UserProfile, BookingStatus, PaymentStatus } from '../backend';

// Portfolio Queries
export function useGetAllPortfolioItems() {
  const { actor, isFetching } = useActor();

  return useQuery<PortfolioItem[]>({
    queryKey: ['portfolioItems'],
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
    queryKey: ['portfolioItem', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPortfolioItem(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Booking Queries (Public)
export function useCreateBookingRequest() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { client: any; session: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBookingRequest(data.client, data.session);
    },
  });
}

// Admin Booking Queries
export function useGetAllBookingRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<BookingRequest[]>({
    queryKey: ['bookingRequests'],
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
    queryKey: ['bookingRequest', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.retrieveBookingRequest(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAcceptBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; proposedDateTime: string | null; notes: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptBooking(data.id, data.proposedDateTime, data.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['bookingRequest'] });
    },
  });
}

export function useDenyBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; notes: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.denyBooking(data.id, data.notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['bookingRequest'] });
    },
  });
}

export function useConfirmBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; confirmedDateTime: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.confirmBooking(data.id, data.confirmedDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['bookingRequest'] });
    },
  });
}

export function useSetBookingPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; price: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setBookingPrice(data.id, data.price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['bookingRequest'] });
    },
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; status: PaymentStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePaymentStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['bookingRequest'] });
    },
  });
}

export function useMarkBookingAsPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markBookingAsPaid(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['bookingRequest'] });
    },
  });
}

// Portfolio Admin Mutations
export function useCreatePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description: string; imageUrl: string; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPortfolioItem(data.title, data.description, data.imageUrl, data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
    },
  });
}

export function useUpdatePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; title: string; description: string; imageUrl: string; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePortfolioItem(data.id, data.title, data.description, data.imageUrl, data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioItem'] });
    },
  });
}

export function useDeletePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePortfolioItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
    },
  });
}
