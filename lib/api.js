import { realtime } from './realtime'

const delay = (ms=200)=>new Promise(r=>setTimeout(r,ms))

async function apiFetch(path, opts){
  const res = await fetch(path, opts)
  if(!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export async function fetchRequests(){
  await delay()
  return apiFetch('/api/requests')
}

export async function fetchRequest(id){
  await delay()
  return apiFetch(`/api/requests/${id}`)
}

export async function createRequest(payload){
  const created = await apiFetch('/api/requests', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
  // emit local realtime event so other tabs/components update
  realtime.emit('requests', {type:'created', request: created})
  return created
}

export async function updateStatus(id, {status, dept, note}){
  const body = {}
  if(status) body.status = status
  if(dept) body.currentDept = dept
  if(note) body.note = note
  const updated = await apiFetch(`/api/requests/${id}`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
  realtime.emit('requests', {type:'updated', request: updated})
  return updated
}

export async function searchRequests(q=''){
  const all = await fetchRequests()
  if(!q) return all
  return all.filter(r=>r.id.includes(q) || (r.patientName||'').toLowerCase().includes(q.toLowerCase()))
}
