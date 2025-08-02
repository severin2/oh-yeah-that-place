import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { placeNoteApi } from "../api/placeNotes";
import type {
  CreatePlaceNoteInput,
  UpdatePlaceNoteInput,
} from "@shared/api/placeNote";

// Query keys
export const placeNoteKeys = {
  all: ["placeNotes"] as const,
  lists: () => [...placeNoteKeys.all, "list"] as const,
  list: (filters: string) => [...placeNoteKeys.lists(), { filters }] as const,
  details: () => [...placeNoteKeys.all, "detail"] as const,
  detail: (id: string) => [...placeNoteKeys.details(), id] as const,
};

/**
 * Hook to get all place notes
 */
export function usePlaceNotes() {
  return useQuery({
    queryKey: placeNoteKeys.lists(),
    queryFn: () => placeNoteApi.getPlaceNotes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new place note
 */
export function useCreatePlaceNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePlaceNoteInput) =>
      placeNoteApi.createPlaceNote(input),
    onSuccess: () => {
      // Invalidate and refetch place notes
      queryClient.invalidateQueries({ queryKey: placeNoteKeys.lists() });
    },
  });
}

/**
 * Hook to update a place note
 */
export function useUpdatePlaceNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePlaceNoteInput }) =>
      placeNoteApi.updatePlaceNote(id, input),
    onSuccess: () => {
      // Invalidate and refetch place notes
      queryClient.invalidateQueries({ queryKey: placeNoteKeys.lists() });
    },
  });
}

/**
 * Hook to delete a place note
 */
export function useDeletePlaceNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => placeNoteApi.deletePlaceNote(id),
    onSuccess: () => {
      // Invalidate and refetch place notes
      queryClient.invalidateQueries({ queryKey: placeNoteKeys.lists() });
    },
  });
}
