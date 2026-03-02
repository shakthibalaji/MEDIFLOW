export const sampleUsers = [
  { id: 'p1', name: 'Asha Rao', role: 'patient' },
  { id: 'p2', name: 'Rahul Menon', role: 'patient' },
  { id: 'p3', name: 'Meera Iyer', role: 'patient' },
  { id: 'p4', name: 'Karan Singh', role: 'patient' },
  { id: 'd1', name: 'Dr. Naveen', role: 'doctor' },
  { id: 'n1', name: 'Nurse Priya', role: 'nurse' },
]

const patients = [
  {id: 'p1', name: 'Asha Rao'},
  {id: 'p2', name: 'Rahul Menon'},
  {id: 'p3', name: 'Meera Iyer'},
  {id: 'p4', name: 'Karan Singh'},
]

export const sampleRequests = [
  {
    id: 'REQ-1001',
    patientId: 'p2',
    patientName: 'Rahul Menon',
    type: 'Lab Test',
    priority: 'Normal',
    path: ['OPD','Lab','Pharmacy'],
    currentDept: 'OPD',
    status: 'Received',
    createdAt: Date.now() - 1000*60*60*24*3,
    timeline: []
  },
  {
    id: 'REQ-1002',
    patientId: 'p3',
    patientName: 'Meera Iyer',
    type: 'Radiology',
    priority: 'Urgent',
    path: ['OPD','Radiology','Specialist'],
    currentDept: 'Radiology',
    status: 'In Progress',
    createdAt: Date.now() - 1000*60*60*24*2,
    timeline: []
  },
  {
    id: 'REQ-1003',
    patientId: 'p1',
    patientName: 'Asha Rao',
    type: 'Specialist Consult',
    priority: 'High',
    path: ['OPD','Specialist','Pharmacy'],
    currentDept: 'Specialist',
    status: 'Escalated',
    createdAt: Date.now() - 1000*60*60*24*1,
    timeline: []
  },
  // generate 7 more demo requests with variation and distributed patients
  ...Array.from({length:7}).map((_,i)=>{
    const pid = patients[i % patients.length]
    return {
      id: `REQ-10${10+i}`,
      patientId: pid.id,
      patientName: pid.name,
      type: ['Prescription Refill','Follow-up','Lab Test','Pharmacy'][i%4],
      priority: ['Normal','High','Urgent'][i%3],
      path: ['OPD','Lab','Pharmacy'].slice(0,2+(i%2)),
      currentDept: ['OPD','Lab','Pharmacy'][i%3],
      status: ['Received','In Progress','Completed'][i%3],
      createdAt: Date.now() - (i+1)*1000*60*60,
      timeline: []
    }
  })
]
