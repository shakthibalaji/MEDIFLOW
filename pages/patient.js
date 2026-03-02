import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import RequestForm from '../components/RequestForm'
import RequestCard from '../components/RequestCard'
import { useStore } from '../store/useStore'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Patient(){
  const { user, requests } = useStore(s=>({ user: s.user, requests: s.requests }))
  const router = useRouter()

  useEffect(()=>{
    if(!user || user.role !== 'patient'){
      router.push('/login')
    }
  },[user, router])

  const myRequests = (requests || []).filter(r=> r.patientId === user?.id)
  return (
    <div className="min-h-screen">
      <div className="md:flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Header title={`Welcome, ${user.name}`} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="md:col-span-2">
              <h2 className="font-semibold text-xl mb-3">My Requests</h2>
              <div className="space-y-3">
                {myRequests.length === 0 && <div className="text-sm text-gray-500 dark:text-gray-400">No requests found for {user?.name}</div>}
                {myRequests.map(r=> <RequestCard key={r.id} req={r} />)}
              </div>
            </div>
            <div>
              <RequestForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
