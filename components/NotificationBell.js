import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function NotificationBell(){
  const notifications = useStore(s=>s.notifications)
  const clear = useStore(s=>s.clearNotifications)
  const [open,setOpen] = useState(false)
  return (
    <div className="relative">
      <button aria-label="Notifications" className="p-2 rounded-md hover:bg-gray-100" onClick={()=>setOpen(!open)}>
        <Bell />
        {notifications.length>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{notifications.length}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-md p-3 z-50">
          <div className="flex justify-between items-center mb-2"><strong>Notifications</strong><button onClick={clear} className="text-sm text-primary">Clear</button></div>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {notifications.length===0 && <li className="text-sm text-gray-500">No notifications</li>}
            {notifications.map(n=> (
              <li key={n.id} className="text-sm">{n.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
