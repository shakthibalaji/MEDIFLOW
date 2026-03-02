import Link from 'next/link'
import { Menu, Sun, Moon } from 'lucide-react'
import NotificationBell from './NotificationBell'
import { useStore } from '../store/useStore'
import { useState, useEffect } from 'react'

export default function Header({title}){
  const toggleSidebar = useStore(s=>s.toggleSidebar)
  const user = useStore(s=>s.user)
  const [dark, setDark] = useState(false)

  useEffect(()=>{
    setDark(document.documentElement.classList.contains('dark'))
  },[])

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    setDark(prev => !prev)
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
      <div className="flex items-center gap-2">
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden">
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold" aria-live="polite">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggleDark} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <NotificationBell />
        {user?.name && (
          <Link href="/profile" className="px-3 py-1 rounded-md bg-primary text-white text-sm">
            {user.name}
          </Link>
        )}
      </div>
    </header>
  )
}
