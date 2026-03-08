'use client'

import { useState, useEffect } from 'react'
import { Sword, CheckSquare, BookOpen, Flame, Calendar, LogOut, Loader2 } from 'lucide-react'
import ProblemBrowser from '@/components/ProblemBrowser'
import TodoList from '@/components/TodoList'
import SchemaViewer from '@/components/SchemaViewer'
import AuthScreen from '@/components/AuthScreen'
import { useAuth } from '@/components/AuthProvider'
import { PROBLEMS } from '@/lib/problems'

type Tab = 'dojo' | 'todos' | 'schema'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('dojo')
  const [today, setToday] = useState('')
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const d = new Date()
    setToday(d.toISOString().split('T')[0])
    const s = parseInt(localStorage.getItem('dojo_streak') || '0')
    setStreak(s)
  }, [])

  if (loading) {
    return (
      <div className="min-h-dvh bg-dojo-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin text-dojo-red mx-auto mb-3" />
          <p className="text-dojo-dim text-sm font-mono">Loading dojo...</p>
        </div>
      </div>
    )
  }

  if (!user) return <AuthScreen />

  const dateLabel = today
    ? new Date(today + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : ''

  const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: 'dojo',   label: 'Dojo',    Icon: Sword },
    { id: 'todos',  label: 'Todos',   Icon: CheckSquare },
    { id: 'schema', label: 'Schema',  Icon: BookOpen },
  ]

  return (
    <div className="min-h-dvh bg-dojo-bg flex flex-col max-w-2xl mx-auto">
      <header className="sticky top-0 z-40 bg-dojo-bg/95 backdrop-blur-sm border-b border-dojo-border safe-pt">
        <div className="px-4 pt-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-display text-2xl font-bold gradient-text tracking-tight">SQL Dojo</h1>
              <p className="text-dojo-dim text-xs font-mono mt-0.5 flex items-center gap-1.5">
                <Calendar size={10} /> {dateLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-dojo-surface border border-dojo-border rounded-lg px-3 py-1.5">
                <Flame size={14} className="text-dojo-orange" />
                <span className="font-mono text-sm font-semibold text-dojo-text">{streak}</span>
              </div>
              <button
                onClick={signOut}
                title="Sign out"
                className="p-2 rounded-lg bg-dojo-surface border border-dojo-border text-dojo-muted hover:text-dojo-red hover:border-dojo-red/40 transition-all"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-3 text-xs font-mono">
            <span className="text-dojo-dim truncate max-w-[160px]">{user.email}</span>
            <span className="text-dojo-border">·</span>
            <span className="text-dojo-dim">{PROBLEMS.length} problems</span>
            <span className="text-dojo-border">·</span>
            <span className="text-dojo-dim">5 tables</span>
          </div>

          <nav className="flex gap-0">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-all -mb-px ${
                  tab === id ? 'tab-active' : 'border-transparent text-dojo-dim hover:text-dojo-text'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 animate-fade-in">
        {tab === 'dojo'   && <ProblemBrowser today={today} userId={user.id} onStreakUpdate={setStreak} />}
        {tab === 'todos'  && <TodoList today={today} userId={user.id} />}
        {tab === 'schema' && <SchemaViewer />}
      </main>

      <div className="safe-pb" />
    </div>
  )
}
