import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'requests.json')

function readRequests(){
  try{
    const raw = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(raw)
  }catch(e){
    return []
  }
}

function writeRequests(list){
  try{
    fs.mkdirSync(path.dirname(dataPath), {recursive:true})
    fs.writeFileSync(dataPath, JSON.stringify(list, null, 2), 'utf8')
    return true
  }catch(e){
    return false
  }
}

export default function handler(req, res){
  if(req.method === 'GET'){
    const list = readRequests()
    return res.status(200).json(list)
  }

  if(req.method === 'POST'){
    const payload = req.body || {}
    const list = readRequests()
    const newReq = {
      id: payload.id || `REQ-${Math.floor(Math.random()*9000)+1000}`,
      createdAt: Date.now(),
      timeline: payload.timeline || [{status: payload.status || 'Received', dept: payload.currentDept || (payload.path?.[0]||'OPD'), at: Date.now()}],
      ...payload
    }
    list.unshift(newReq)
    const ok = writeRequests(list)
    if(!ok) return res.status(500).json({error:'failed to write'})
    return res.status(201).json(newReq)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
