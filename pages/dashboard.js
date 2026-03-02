import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import RequestCard from '../components/RequestCard'
import { useStore } from '../store/useStore'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard(){
  const user = useStore(s=>s.user)
  const setUser = useStore(s=>s.setUser)
  const requests = useStore(s=>s.requests)
  const [q,setQ] = useState('')

  // if a patient somehow hits /dashboard, send them to the patient portal
  const router = useRouter()
  useEffect(()=>{
    if(user && user.role === 'patient'){
      router.push('/patient')
    }
  },[user, router])

  // if no staff (doctor or general staff) is logged in, show login
  if(!user || (user.role !== 'doctor' && user.role !== 'staff')){
    const [id,setId] = useState('')
    const [name,setName] = useState('')
    const handleSubmit = (e)=>{
      e.preventDefault()
      const payload = { id: id || undefined, name: name || 'Staff' }
      const newUser = { id: payload.id || `s_${Math.floor(Math.random()*9000)}`, name: payload.name, role: 'doctor' }
      setUser(newUser)
    }
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Staff Login</h2>

          <label className="block text-sm text-gray-600 mb-1">Staff ID</label>
          <input value={id} onChange={e=>setId(e.target.value)} placeholder="e.g. s1 or st123" className="w-full p-2 border rounded mb-3" />

          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded mb-4" />

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Login</button>
          </div>
        </form>
      </div>
    )
  }

  const filtered = q? requests.filter(r=>r.id.includes(q)||r.patientName.toLowerCase().includes(q.toLowerCase())) : requests
  const counts = {pending: requests.filter(r=>r.status==='Received').length, inProgress: requests.filter(r=>r.status==='In Progress').length, completed: requests.filter(r=>r.status==='Completed').length}

  return (
    <div className="min-h-screen">
      <div className="md:flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Header title="Staff Dashboard" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-4">
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow">Pending<br/><div className="text-3xl font-bold">{counts.pending}</div></div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow">In Progress<br/><div className="text-3xl font-bold">{counts.inProgress}</div></div>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow">Completed<br/><div className="text-3xl font-bold">{counts.completed}</div></div>
          </div>

          <div className="mb-4 flex gap-2">
            <input placeholder="Search by ID or patient" value={q} onChange={e=>setQ(e.target.value)} className="p-3 border rounded flex-1 focus:ring-primary focus:border-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.slice(0,9).map(r=> <RequestCard key={r.id} req={r} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
