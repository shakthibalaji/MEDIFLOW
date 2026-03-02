import Link from 'next/link'
import { Home, Inbox, ClipboardList, PlusCircle, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useRouter } from 'next/router'

export default function Sidebar(){
  const user = useStore(s=>s.user)
  const sidebarOpen = useStore(s=>s.sidebarOpen)
  const toggleSidebar = useStore(s=>s.toggleSidebar)
  const router = useRouter()

  // patient see only basic navigation; staff see full menu
  const isPatient = user && user.role === 'patient'

  const links = isPatient ? [
    { href:'/patient', label:'Home', icon:Home },
    { href:'/patient', label:'New Request', icon:PlusCircle }
  ] : [
    { href:'/dashboard', label:'Home', icon:Home },
    { href:'/dashboard', label:'My Department', icon:Inbox },
    { href:'/requests/REQ-1001', label:'All Requests', icon:ClipboardList }
  ]

  const LinkItem = ({href,label,Icon})=>{
    const active = router.pathname === href || router.asPath.startsWith(href)
    return (
      <Link href={href} className={`flex items-center gap-2 p-2 rounded ${active?'bg-primary text-white':'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
        <Icon size={16}/> {label}
      </Link>
    )
  }

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r transform ${sidebarOpen?'translate-x-0':'-translate-x-full'} md:translate-x-0 transition-transform duration-200 z-40`}>
      <div className="p-4 flex items-center justify-between md:hidden">
        <div className="text-2xl font-bold" style={{color:'#0ea5e9'}}>MediFlow</div>
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <X size={20}/>        
        </button>
      </div>
      <div className="p-4 hidden md:block">
        <div className="mb-6">
          <div className="text-2xl font-bold" style={{color:'#0ea5e9'}}>MediFlow Hub</div>
          <div className="text-sm text-gray-500">Inter-department Workflow</div>
        </div>
      </div>
      <nav className="space-y-2 px-4">
        {links.map(l=> <LinkItem key={l.href} href={l.href} label={l.label} Icon={l.icon} />)}
      </nav>
    </aside>
  )
}
