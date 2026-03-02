import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import Timeline from '../../components/Timeline'
import StatusUpdater from '../../components/StatusUpdater'
import { useEffect, useState } from 'react'
import { fetchRequest } from '../../lib/api'

export default function RequestPage(){
  const router = useRouter()
  const { id } = router.query
  const [req,setReq] = useState(null)
  useEffect(()=>{
    if(!id) return
    fetchRequest(id).then(r=>setReq(r))
  },[id])

  return (
    <div className="min-h-screen">
      <div className="md:flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Header title={req? `${req.id} • ${req.patientName}`:'Request'} />
          {!req && <div>Loading…</div>}
          {req && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="mb-3">Type: {req.type}</div>
                <div className="mb-3">Priority: {req.priority}</div>
                <div className="mb-3">Current Dept: {req.currentDept}</div>
                <h4 className="font-semibold mt-4 mb-2">Timeline</h4>
                <Timeline timeline={req.timeline} />
              </div>
              <div className="bg-white p-4 rounded shadow space-y-3">
                <StatusUpdater request={req} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
