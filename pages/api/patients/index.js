import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'patients.json')

function readPatients(){
  try{
    const raw = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(raw)
  }catch(e){
    return []
  }
}

function writePatients(list){
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
    const list = readPatients()
    return res.status(200).json(list)
  }

  if(req.method === 'POST'){
    const { id, name } = req.body || {}
    if(!name) return res.status(400).json({error:'name required'})
    const patients = readPatients()
    // if id provided, check exists
    let existing = null
    if(id) existing = patients.find(p=>p.id === id)
    if(existing){
      // update name if different
      existing.name = name
      writePatients(patients)
      return res.status(200).json(existing)
    }

    // create new id if not provided
    const newId = id || `p${Math.floor(Math.random()*9000)+100}`
    const newPatient = { id: newId, name }
    patients.push(newPatient)
    const ok = writePatients(patients)
    if(!ok) return res.status(500).json({error:'failed to write'})
    return res.status(201).json(newPatient)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
