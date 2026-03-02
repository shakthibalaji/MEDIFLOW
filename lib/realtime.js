// Simple in-memory pub/sub to simulate real-time updates.
class Realtime {
  constructor(){
    this.subs = new Map()
  }
  on(channel, cb){
    if(!this.subs.has(channel)) this.subs.set(channel, new Set())
    this.subs.get(channel).add(cb)
    return ()=> this.subs.get(channel).delete(cb)
  }
  emit(channel, data){
    const s = this.subs.get(channel)
    if(!s) return
    for(const cb of s) cb(data)
  }
}

export const realtime = new Realtime()
