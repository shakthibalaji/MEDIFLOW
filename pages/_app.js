import '../styles/globals.css'
import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function MyApp({ Component, pageProps }) {
  const init = useStore((s) => s.init)
  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="font-inter bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 min-h-screen">
      <Component {...pageProps} />
    </div>
  )
}
