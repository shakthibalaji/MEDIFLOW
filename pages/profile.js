import { useStore } from '../store/useStore'
import { useRouter } from 'next/router'
import Sidebar from '../components/Sidebar'

export default function Profile(){
  const user = useStore(s=>s.user)
  const logout = useStore(s=>s.logout)
  const router = useRouter()

  const handleLogout = ()=>{
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen">
      <div className="md:flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow max-w-md">
            <div className="mb-4"><strong>Name:</strong> {user?.name || '—'}</div>
            <div className="mb-4"><strong>ID:</strong> {user?.id || '—'}</div>
            <div className="mb-4"><strong>Role:</strong> {user?.role || '—'}</div>
            <div className="mt-6">
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
