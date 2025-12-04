"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import NewMenuItem from "./NewMenuItem";
import { NewMenuGroup as NewMenuGroupType } from "@/types/newMenuItems";
import { useNewFolderDialog } from "@/components/NewFolderDialog";
import { useCallback } from "react";

interface NewMenuGroupProps {
  group: NewMenuGroupType;
}

export default function NewMenuGroup({ group }: NewMenuGroupProps) {
  const { openDialog } = useNewFolderDialog();

  const handleItemClick = useCallback(
    (itemId: string) => {
      // Only handle 'new-folder' click - do nothing for other items
      if (itemId === "new-folder") {
        // Open dialog after a small delay to ensure menu closes first
        setTimeout(() => {
          openDialog();
        }, 200);
      }
    },
    [openDialog]
  );

  return (
    <>
      {group.items.map((item) => {
        // Only attach onClick for 'new-folder', others get undefined or their own onClick
        const onClick =
          item.id === "new-folder"
            ? () => handleItemClick(item.id)
            : item.onClick || undefined;

        return (
          <NewMenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            shortcut={item.shortcut}
            hasChevron={item.hasChevron}
            onClick={onClick}
            shouldCloseMenu={item.id === "new-folder"}
          />
        );
      })}
      {group.id === "create-upload" && (
        <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
      )}
    </>
  );
}
