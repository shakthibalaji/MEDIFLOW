import create from 'zustand'
import { fetchRequests, createRequest, updateStatus } from '../lib/api'
import { realtime } from '../lib/realtime'

export const useStore = create((set,get)=>({
  // start with no one logged in by default so staff must authenticate
  user: {id:'', name:'', role:''},
  requests: [],
  notifications: [],
  _subscribed: false,
  sidebarOpen: false,
  toggleSidebar: ()=> set(state=>({sidebarOpen: !state.sidebarOpen})),
  init: async ()=>{
    // prevent double subscription (React Strict Mode/dev)
    if(get()._subscribed) return
    set({ _subscribed: true })
    const data = await fetchRequests()
    set({requests:data})
    // subscribe to realtime updates
    realtime.on('requests', (ev)=>{
      const {type, request} = ev
      const user = get().user
      // if a patient is logged in, only accept realtime updates for that patient
      if(user && user.role === 'patient'){
        if(request.patientId !== user.id) return
      }
      if(type==='created') set(state=>({requests:[request,...state.requests], notifications:[{id:Date.now(), text:`New request ${request.id}`},...state.notifications]}))
      if(type==='updated') set(state=>({requests: state.requests.map(r=>r.id===request.id?request:r), notifications:[{id:Date.now(), text:`Updated ${request.id}: ${request.status}`},...state.notifications]}))
    })
  },
  createRequest: async (payload)=>{
    // call API; rely on realtime subscription to update store to avoid duplicate inserts
    const r = await createRequest(payload)
    return r
  },
  updateStatus: async (id, payload)=>{
    const r = await updateStatus(id, payload)
    return r
  },
  setUser: async (user)=>{
    // clear current requests immediately
    set({ user, requests: [] })
    // fetch only relevant requests for this user
    try{
      const data = await fetchRequests()
      if(user && user.role === 'patient'){
        const my = (data || []).filter(r=> r.patientId === user.id)
        set({ requests: my })
      }else{
        set({ requests: data })
      }
    }catch(e){
      // ignore fetch errors, keep empty requests
    }
  },
  logout: ()=> set({user: {id:'', name:'', role:''}}),
  addNotification: (n)=> set(state=>({notifications:[n,...state.notifications]})),
  clearNotifications: ()=> set({notifications:[]})
}))
