export default function StorageBar() {
  const used = 937 // KB
  const total = 5 * 1024 * 1024 // 5 GB in KB
  const percent = (used / total) * 100

  return (
    <div className="px-3 mt-2 mb-2">
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${Math.max(percent, 0.5)}%`, minWidth: '2px' }}
        />
      </div>
      <p className="text-xs text-gray-600">{used} KB of 5 GB used</p>
    </div>
  )
}

