import { useCallback, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import {
  deleteFileThunk,
  moveToTrashThunk,
  restoreFromTrashThunk,
} from "@/lib/store/thunks/driveThunks";

type TrashAction = "move" | "restore" | "delete";

const normalizeIds = (ids: string | string[]): string[] =>
  Array.isArray(ids) ? ids : [ids];

export function useFileTrashActions() {
  const dispatch = useAppDispatch();
  const [pendingAction, setPendingAction] = useState<TrashAction | null>(null);

  const runAction = useCallback(
    async (action: TrashAction, executor: () => Promise<unknown>) => {
      setPendingAction(action);
      try {
        await executor();
      } finally {
        setPendingAction(null);
      }
    },
    []
  );

  const moveToTrash = useCallback(
    async (ids: string | string[]) => {
      const fileIds = normalizeIds(ids);
      await runAction("move", () =>
        dispatch(moveToTrashThunk(fileIds)).unwrap()
      );
    },
    [dispatch, runAction]
  );

  const restoreFromTrash = useCallback(
    async (ids: string | string[]) => {
      const fileIds = normalizeIds(ids);
      await runAction("restore", () =>
        dispatch(restoreFromTrashThunk(fileIds)).unwrap()
      );
    },
    [dispatch, runAction]
  );

  const deleteForever = useCallback(
    async (ids: string | string[]) => {
      const fileIds = normalizeIds(ids);
      await runAction("delete", async () => {
        await Promise.all(
          fileIds.map((id) => dispatch(deleteFileThunk(id)).unwrap())
        );
      });
    },
    [dispatch, runAction]
  );

  return {
    moveToTrash,
    restoreFromTrash,
    deleteForever,
    pendingAction,
    isProcessing: pendingAction !== null,
  };
}

