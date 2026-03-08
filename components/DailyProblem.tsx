'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle2, Circle, Lightbulb, Code2, Copy, Check } from 'lucide-react'
import { Problem, DIFFICULTY_COLOR, CATEGORY_COLOR } from '@/lib/problems'
import { supabase } from '@/lib/supabase'
import clsx from 'clsx'

type Props = {
  problem: Problem
  today: string
  userId: string
  onStreakUpdate: (n: number) => void
}

export default function DailyProblem({ problem, today, userId, onStreakUpdate }: Props) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [notes, setNotes] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setCompleted(false)
    setNotes('')
    loadAttempt()
  }, [today, problem.id, userId])

  async function loadAttempt() {
    try {
      const { data } = await supabase
        .from('problem_attempts')
        .select('*')
        .eq('problem_id', problem.id)
        .eq('date', today)
        .eq('user_id', userId)
        .maybeSingle()
      if (data) {
        setCompleted(data.completed)
        setNotes(data.notes || '')
      }
    } catch (_) {}
    setLoaded(true)
  }

  async function toggleComplete() {
    const next = !completed
    setCompleted(next)
    setSaving(true)
    try {
      await supabase.from('problem_attempts').upsert({
        problem_id: problem.id,
        date: today,
        user_id: userId,
        completed: next,
        notes,
      }, { onConflict: 'problem_id,date,user_id' })

      if (next) {
        const streak = parseInt(localStorage.getItem('dojo_streak') || '0')
        const lastDate = localStorage.getItem('dojo_last_complete')
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        const newStreak = lastDate === yesterday ? streak + 1 : lastDate === today ? streak : 1
        localStorage.setItem('dojo_streak', String(newStreak))
        localStorage.setItem('dojo_last_complete', today)
        onStreakUpdate(newStreak)
      }
    } catch (_) {}
    setSaving(false)
  }

  async function saveNotes(value: string) {
    setNotes(value)
    try {
      await supabase.from('problem_attempts').upsert({
        problem_id: problem.id,
        date: today,
        user_id: userId,
        completed,
        notes: value,
      }, { onConflict: 'problem_id,date,user_id' })
    } catch (_) {}
  }

  function copySQL(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Problem Header */}
      <div className="bg-dojo-surface border border-dojo-border rounded-xl p-4 glow-border">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={clsx('text-xs font-mono font-semibold px-2 py-0.5 rounded border', DIFFICULTY_COLOR[problem.difficulty])}>
                {problem.difficulty}
              </span>
              <span className={clsx('text-xs font-mono font-medium', CATEGORY_COLOR[problem.category])}>
                #{problem.category}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-dojo-text leading-tight">
              {problem.title}
            </h2>
          </div>

          <button
            onClick={toggleComplete}
            disabled={saving}
            className={clsx(
              'flex-shrink-0 p-1 rounded-lg transition-all',
              completed ? 'text-dojo-green' : 'text-dojo-muted hover:text-dojo-text'
            )}
          >
            {completed
              ? <CheckCircle2 size={28} className="drop-shadow-[0_0_8px_#00ff8888]" />
              : <Circle size={28} />
            }
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {problem.tables.map(t => (
            <span key={t} className="text-xs font-mono bg-dojo-bg border border-dojo-border text-dojo-blue px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>

        <p className="text-dojo-text text-sm leading-relaxed">{problem.description}</p>

        <div className="mt-3 pt-3 border-t border-dojo-border">
          <p className="text-xs text-dojo-dim font-mono mb-1">Expected columns:</p>
          <div className="flex flex-wrap gap-1">
            {problem.expectedColumns.map(col => (
              <span key={col} className="text-xs font-mono text-dojo-yellow bg-dojo-yellow/5 border border-dojo-yellow/20 px-2 py-0.5 rounded">
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      {loaded && (
        <div className="bg-dojo-surface border border-dojo-border rounded-xl p-4">
          <label className="text-xs font-mono text-dojo-dim block mb-2 flex items-center gap-1.5">
            <Code2 size={12} />
            Your SQL attempt / notes
          </label>
          <textarea
            value={notes}
            onChange={e => saveNotes(e.target.value)}
            placeholder={`-- Write your SQL here\nSELECT ...`}
            rows={6}
            className="sql-editor w-full rounded-lg p-3 text-sm"
          />
        </div>
      )}

      {/* Hint */}
      <div className="bg-dojo-surface border border-dojo-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowHint(!showHint)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-dojo-yellow">
            <Lightbulb size={14} />Hint
          </span>
          {showHint ? <ChevronUp size={14} className="text-dojo-dim" /> : <ChevronDown size={14} className="text-dojo-dim" />}
        </button>
        {showHint && (
          <div className="px-4 pb-4 text-sm text-dojo-dim border-t border-dojo-border pt-3 animate-slide-up">
            {problem.hint}
          </div>
        )}
      </div>

      {/* Solution */}
      <div className="bg-dojo-surface border border-dojo-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-dojo-orange">
            {showSolution ? <EyeOff size={14} /> : <Eye size={14} />}
            {showSolution ? 'Hide Solution' : 'Reveal Solution'}
          </span>
          {showSolution ? <ChevronUp size={14} className="text-dojo-dim" /> : <ChevronDown size={14} className="text-dojo-dim" />}
        </button>
        {showSolution && (
          <div className="border-t border-dojo-border animate-slide-up">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <span className="text-xs font-mono text-dojo-dim">solution.sql</span>
              <button
                onClick={() => copySQL(problem.solution)}
                className="flex items-center gap-1 text-xs text-dojo-dim hover:text-dojo-text transition-colors"
              >
                {copied ? <Check size={12} className="text-dojo-green" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="px-4 pb-4 text-sm font-mono text-dojo-green leading-relaxed overflow-x-auto">
              {problem.solution}
            </pre>
          </div>
        )}
      </div>

      {completed && (
        <div className="bg-dojo-green/10 border border-dojo-green/30 rounded-xl p-4 text-center animate-slide-up">
          <p className="text-dojo-green font-display font-bold text-lg">✓ Problem Solved!</p>
          <p className="text-dojo-dim text-xs mt-1 font-mono">Come back tomorrow for a new challenge</p>
        </div>
      )}
    </div>
  )
}
