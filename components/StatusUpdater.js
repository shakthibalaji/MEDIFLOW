import { useState } from 'react'
import { useStore } from '../store/useStore'

export default function StatusUpdater({request}){
  const update = useStore(s=>s.updateStatus)
  const [status,setStatus] = useState(request?.status||'Received')
  const [note,setNote] = useState('')
  const handle = async ()=>{
    await update(request.id, {status, note, dept: request.currentDept})
  }
  return (
    <div className="p-4 bg-white dark:bg-gray-700 border rounded-lg shadow-sm">
      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Update Status</div>
      <div className="flex flex-col md:flex-row gap-2 mt-3">
        <select value={status} onChange={e=>setStatus(e.target.value)} className="p-2 border rounded focus:ring-primary focus:border-primary">
          <option>Received</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Escalated</option>
        </select>
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add note" className="p-2 border rounded flex-1" />
        <button onClick={handle} className="px-4 py-2 bg-success text-white rounded hover:bg-green-600 transition">Save</button>
      </div>
    </div>
  )
}
