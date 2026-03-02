import Link from 'next/link'
import Head from 'next/head'

export default function Home(){
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>MediFlow Hub — Demo</title>
      </Head>
      <main className="max-w-3xl w-full text-center bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl">
        <h1 className="text-5xl font-extrabold mb-4" style={{color:'#0ea5e9'}}>MediFlow Hub</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">A demo inter-department workflow automation platform for hospitals.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/login" className="px-6 py-3 rounded-md bg-primary text-white hover:bg-blue-600 transition">Open Patient Portal</Link>
          <Link href="/login?role=staff" className="px-6 py-3 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition">Open Staff Dashboard</Link>
        </div>
      </main>
    </div>
  )
}
