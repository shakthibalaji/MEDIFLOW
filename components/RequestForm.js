import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useRouter } from 'next/router'

export default function RequestForm(){
  const create = useStore(s=>s.createRequest)
  const user = useStore(s=>s.user)
  const [type,setType] = useState('Lab Test')
  const [priority,setPriority] = useState('Normal')
  const router = useRouter()

  useEffect(()=>{
    if(!user || !user.id || user.role !== 'patient'){
      // redirect to login if not a patient
      router.push('/login')
    }
  },[user, router])

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!user || !user.id) return
    await create({
      patientId: user.id,
      patientName: user.name,
      type,
      priority,
      path:['OPD','Lab','Pharmacy'],
      currentDept:'OPD',
      status:'Received'
    })
    setType('Lab Test')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md" aria-label="New request form">
      <h3 className="font-semibold text-lg">Create a New Request</h3>
      <div className="text-sm text-gray-600 dark:text-gray-400">Patient: {user?.name || '—' } <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">{user?.id}</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select value={type} onChange={e=>setType(e.target.value)} className="p-2 border rounded focus:ring-primary focus:border-primary" aria-label="Request type">
          <option>Lab Test</option>
          <option>Radiology</option>
          <option>Specialist Consult</option>
          <option>Prescription Refill</option>
        </select>
        <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-2 border rounded focus:ring-primary focus:border-primary" aria-label="Priority">
          <option>Normal</option>
          <option>High</option>
          <option>Urgent</option>
        </select>
      </div>
      <div>
        <button type="submit" className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition">Submit</button>
      </div>
    </form>
  )
}
