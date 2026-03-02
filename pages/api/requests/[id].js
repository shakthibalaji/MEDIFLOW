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
  const { id } = req.query
  if(req.method === 'GET'){
    const list = readRequests()
    const r = list.find(x=>x.id === id)
    if(!r) return res.status(404).json({error:'not found'})
    return res.status(200).json(r)
  }

  if(req.method === 'PATCH'){
    const body = req.body || {}
    const list = readRequests()
    const idx = list.findIndex(x=>x.id === id)
    if(idx === -1) return res.status(404).json({error:'not found'})
    const r = list[idx]
    if(body.status) r.status = body.status
    if(body.currentDept) r.currentDept = body.currentDept
    if(body.note) r.timeline = r.timeline || []
    if(body.note) r.timeline.push({status: r.status, dept: r.currentDept, at: Date.now(), note: body.note})
    list[idx] = r
    const ok = writeRequests(list)
    if(!ok) return res.status(500).json({error:'failed to write'})
    return res.status(200).json(r)
  }

  res.setHeader('Allow', ['GET','PATCH'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
