import { useCallback, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import {
  deleteFileThunk,
  moveToTrashThunk,
  restoreFromTrashThunk,
} from "@/lib/store/thunks/driveThunks";
import { useToast } from "@/lib/hooks/useToast";
import type { ToastPayload } from "@/components/ui/ToastProvider";

type TrashAction = "move" | "restore" | "delete";

const normalizeIds = (ids: string | string[]): string[] =>
  Array.isArray(ids) ? ids : [ids];

export function useFileTrashActions() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [pendingAction, setPendingAction] = useState<TrashAction | null>(null);

  const runAction = useCallback(
    async (
      action: TrashAction,
      executor: () => Promise<unknown>,
      successToast?: ToastPayload
    ) => {
      setPendingAction(action);
      try {
        await executor();
        if (successToast) {
          showToast({
            variant: "success",
            ...successToast,
          });
        }
      } catch (error: any) {
        showToast({
          title: "Something went wrong",
          description: error?.message || "Please try again.",
          variant: "error",
        });
        throw error;
      } finally {
        setPendingAction(null);
      }
    },
    [showToast]
  );

  const moveToTrash = useCallback(
    async (ids: string | string[]) => {
      const fileIds = normalizeIds(ids);
      await runAction(
        "move",
        () => dispatch(moveToTrashThunk(fileIds)).unwrap(),
        {
          title:
            fileIds.length > 1
              ? `${fileIds.length} items moved to trash`
              : "Item moved to trash",
          description: "Items remain available in Trash for recovery.",
        }
      );
    },
    [dispatch, runAction]
  );

  const restoreFromTrash = useCallback(
    async (ids: string | string[]) => {
      const fileIds = normalizeIds(ids);
      await runAction(
        "restore",
        () => dispatch(restoreFromTrashThunk(fileIds)).unwrap(),
        {
          title:
            fileIds.length > 1
              ? `${fileIds.length} items restored`
              : "Item restored",
          description: "Files are back in their original location.",
        }
      );
    },
    [dispatch, runAction]
  );

  const deleteForever = useCallback(
    async (ids: string | string[]) => {
      const fileIds = normalizeIds(ids);
      await runAction(
        "delete",
        async () => {
          await Promise.all(
            fileIds.map((id) => dispatch(deleteFileThunk(id)).unwrap())
          );
        },
        {
          title:
            fileIds.length > 1
              ? `${fileIds.length} items deleted forever`
              : "Item deleted forever",
          description: "This action cannot be undone.",
        }
      );
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

