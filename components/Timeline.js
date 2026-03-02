export default function Timeline({timeline=[]}){
  return (
    <div className="space-y-3">
      {timeline.map((t, idx)=>(
        <div key={idx} className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full mt-1 bg-primary" />
          <div>
            <div className="text-sm font-medium">{t.status} <span className="text-xs text-gray-400">• {t.dept}</span></div>
            <div className="text-xs text-gray-500">{new Date(t.at).toLocaleString()}</div>
            {t.note && <div className="text-sm mt-1">{t.note}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
