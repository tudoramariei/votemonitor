import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { notesKeys } from "../queries.service";
import { upsertNote, UpsertNotePayload } from "../definitions.api";
import { Note } from "../../common/models/note";

export const useAddNoteMutation = (
  electionRoundId: string | undefined,
  pollingStationId: string | undefined,
  formId: string | undefined,
  scopeId: string,
) => {
  const queryClient = useQueryClient();

  // this is the GET notes key - we need it in order to invalidate that query after adding the new note
  const getNotesQK = useMemo(
    () => notesKeys.notes(electionRoundId, pollingStationId, formId),
    [electionRoundId],
  );

  return useMutation({
    mutationKey: notesKeys.addNote(),
    scope: {
      id: scopeId,
    },
    mutationFn: async (payload: UpsertNotePayload) => {
      return upsertNote(payload);
    },
    onMutate: async (payload: UpsertNotePayload) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: getNotesQK });

      // Snapshot the previous value
      const previousNotes = queryClient.getQueryData(getNotesQK);

      // Optimistically update to the new value
      queryClient.setQueryData<Note[]>(getNotesQK, (old: Note[] = []) => [
        ...old,
        {
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isNotSynched: true,
        },
      ]);

      // Return a context object with the snapshotted value
      return { previousNotes };
    },
    onError: (err) => {
      console.log("🔴🔴🔴 ERROR IN ADD NOTE MUTATION 🔴🔴🔴", err);
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: getNotesQK });
    },
  });
};
