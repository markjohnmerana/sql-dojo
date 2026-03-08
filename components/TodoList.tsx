'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, CalendarDays } from 'lucide-react'
import { supabase, Todo } from '@/lib/supabase'

type Props = { today: string; userId: string }

export default function TodoList({ today, userId }: Props) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'today' | 'all'>('today')

  useEffect(() => { loadTodos() }, [filter, userId])

  async function loadTodos() {
    setLoading(true)
    try {
      let q = supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      if (filter === 'today') q = q.eq('date', today)
      const { data } = await q
      setTodos(data || [])
    } catch (_) {}
    setLoading(false)
  }

  async function addTodo() {
    const text = input.trim()
    if (!text) return
    setInput('')
    const optimistic: Todo = {
      id: 'tmp-' + Date.now(),
      text,
      completed: false,
      created_at: new Date().toISOString(),
      date: today,
      user_id: userId,
    }
    setTodos(prev => [...prev, optimistic])
    try {
      const { data } = await supabase
        .from('todos')
        .insert({ text, completed: false, date: today, user_id: userId })
        .select()
        .single()
      if (data) setTodos(prev => prev.map(t => t.id === optimistic.id ? data : t))
    } catch (_) {
      setTodos(prev => prev.filter(t => t.id !== optimistic.id))
    }
  }

  async function toggleTodo(todo: Todo) {
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t))
    try {
      await supabase.from('todos').update({ completed: !todo.completed }).eq('id', todo.id).eq('user_id', userId)
    } catch (_) {
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t))
    }
  }

  async function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
    try {
      await supabase.from('todos').delete().eq('id', id).eq('user_id', userId)
    } catch (_) {}
  }

  const completed = todos.filter(t => t.completed).length
  const total = todos.length

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="bg-dojo-surface border border-dojo-border rounded-xl p-4 glow-border">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg font-bold text-dojo-text">Today's Tasks</h2>
          <div className="text-xs font-mono text-dojo-dim">{completed}/{total} done</div>
        </div>
        <div className="h-1.5 bg-dojo-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-dojo-green to-dojo-blue rounded-full transition-all duration-500"
            style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex gap-2 mt-3">
          {(['today', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all ${
                filter === f
                  ? 'bg-dojo-red/10 border-dojo-red/30 text-dojo-red'
                  : 'border-dojo-border text-dojo-dim hover:text-dojo-text'
              }`}
            >
              {f === 'today' ? 'Today' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
          className="flex-1 bg-dojo-surface border border-dojo-border rounded-xl px-4 py-3 text-sm text-dojo-text placeholder:text-dojo-muted outline-none focus:border-dojo-red transition-colors font-body"
        />
        <button
          onClick={addTodo}
          disabled={!input.trim()}
          className="bg-dojo-red text-white rounded-xl px-4 py-3 disabled:opacity-40 hover:bg-dojo-red/80 transition-all active:scale-95"
        >
          <Plus size={18} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-14 bg-dojo-surface border border-dojo-border rounded-xl shimmer" />)}
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-10 text-dojo-dim">
          <CalendarDays size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tasks {filter === 'today' ? 'for today' : 'yet'}.</p>
          <p className="text-xs mt-1 opacity-60">Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 bg-dojo-surface border rounded-xl px-4 py-3 transition-all group ${
                todo.completed ? 'border-dojo-border opacity-60' : 'border-dojo-border'
              }`}
            >
              <button onClick={() => toggleTodo(todo)} className="flex-shrink-0">
                {todo.completed
                  ? <CheckCircle2 size={20} className="text-dojo-green" />
                  : <Circle size={20} className="text-dojo-muted hover:text-dojo-text transition-colors" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${todo.completed ? 'line-through text-dojo-dim' : 'text-dojo-text'}`}>
                  {todo.text}
                </p>
                {filter === 'all' && todo.date !== today && (
                  <p className="text-xs font-mono text-dojo-muted mt-0.5">{todo.date}</p>
                )}
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-dojo-muted hover:text-dojo-red"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
