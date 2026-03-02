import Link from 'next/link'
import clsx from 'clsx'

export default function RequestCard({req}){
  return (
    <Link href={`/requests/${req.id}`} className={clsx('p-4 rounded-lg shadow-lg glass block hover:scale-[1.02] transition-transform')}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{req.type} • {req.priority}</div>
          <div className="font-semibold text-lg">{req.patientName} <span className="text-xs text-gray-400 dark:text-gray-500">{req.id}</span></div>
        </div>
        <div className="text-sm text-right">
          <div className="text-gray-600 dark:text-gray-300">{req.currentDept}</div>
          <div className="text-xs mt-1">
            <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{req.status}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
