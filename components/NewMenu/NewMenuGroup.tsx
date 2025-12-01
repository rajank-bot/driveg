import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import NewMenuItem from './NewMenuItem'
import { NewMenuGroup as NewMenuGroupType } from '@/types/newMenuItems'

interface NewMenuGroupProps {
  group: NewMenuGroupType
}

export default function NewMenuGroup({ group }: NewMenuGroupProps) {
  return (
    <>
      {group.items.map((item) => (
        <NewMenuItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          shortcut={item.shortcut}
          hasChevron={item.hasChevron}
          onClick={item.onClick}
        />
      ))}
      {group.id === 'create-upload' && (
        <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
      )}
    </>
  )
}
