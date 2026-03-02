import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStore } from '../store/useStore'

export default function Login(){
  const router = useRouter()
  const { role: queryRole } = router.query
  const [role,setRole] = useState('patient')
  const [name,setName] = useState('')
  const [id,setId] = useState('')
  const setUser = useStore(s=>s.setUser)

  // if query param requests staff area, default to chosen role (doctor/staff)
  useEffect(()=>{
    if(queryRole === 'doctor' || queryRole === 'staff') setRole(queryRole)
  },[queryRole])

  const submit = (e)=>{
    e.preventDefault()
    const payload = { id: id || undefined, name: name || 'Guest Patient' }
    if(role === 'patient'){
      // if id provided, check whether it exists and whether the name matches
      const tryPersist = async ()=>{
        try{
          if(id){
            const res = await fetch('/api/patients')
            const list = await res.json()
            const existing = list.find(p=>p.id === id)
            if(existing && existing.name && existing.name !== payload.name){
              const okay = window.confirm(`Patient ID ${id} already exists for "${existing.name}". Overwrite name with "${payload.name}"? Click Cancel to create a new patient instead.`)
              if(!okay){
                // create new patient instead of overwriting
                delete payload.id
              }
            }
          }

          const r = await fetch('/api/patients', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
          const data = await r.json()
          const user = { id: data.id, name: data.name, role }
          setUser(user)
          router.push('/patient')
        }catch(err){
          const user = {id: id || `p_${Math.floor(Math.random()*9000)}`, name: name || 'Guest Patient', role}
          setUser(user)
          router.push('/patient')
        }
      }
      tryPersist()
      return
    }
    const user = {id: id || `p_${Math.floor(Math.random()*9000)}`, name: name || 'Guest Patient', role}
    setUser(user)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-white">
      <form onSubmit={submit} className="w-full max-w-md bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-extrabold mb-6 text-center">Sign in to <span className="text-primary">MediFlow Hub</span></h2>
        <label className="block text-sm text-gray-600 mb-1">Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full p-2 border rounded mb-3">
          {/* when in staff flow only show doctor & staff, otherwise include patient */}
          {!(queryRole === 'doctor' || queryRole === 'staff') && <option value="patient">Patient</option>}
          <option value="doctor">Doctor</option>
          <option value="staff">Staff</option>
        </select>

        <label className="block text-sm text-gray-600 mb-1">
          {role === 'patient' ? 'Patient ID' : `${role.charAt(0).toUpperCase() + role.slice(1)} ID`}
        </label>
        <input
          value={id}
          onChange={e=>setId(e.target.value)}
          placeholder={
            role === 'patient'
              ? 'e.g. p1 or p123'
              : 'e.g. s1 or st123'
          }
          className="w-full p-2 border rounded mb-3"
        />

        <label className="block text-sm text-gray-600 mb-1">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 border rounded mb-4" />

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Enter</button>
        </div>
      </form>
    </div>
  )
}
