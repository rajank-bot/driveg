import NewMenuItem from './NewMenuItem'
import { NewMenuGroup as NewMenuGroupType } from '@/types/newMenuItems'

interface NewMenuGroupProps {
  group: NewMenuGroupType
}

export default function NewMenuGroup({ group }: NewMenuGroupProps) {
  return (
    <div>
      {group.items.map((item, index) => (
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
        <div className="border-t border-gray-200 my-1" />
      )}
    </div>
  )
}

