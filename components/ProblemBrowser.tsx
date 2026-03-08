'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle2, Circle, Lightbulb, Code2, Copy, Check, Flame, Filter, X } from 'lucide-react'
import { Problem, PROBLEMS, DIFFICULTY_COLOR, CATEGORY_COLOR, getDailyProblem, Difficulty, Category } from '@/lib/problems'
import { supabase } from '@/lib/supabase'
import clsx from 'clsx'

type Props = {
  today: string
  userId: string
  onStreakUpdate: (n: number) => void
}

type CompletedMap = Record<number, boolean>

const DIFFICULTIES: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
const CATEGORIES: Category[] = ['SELECT', 'WHERE', 'JOIN', 'GROUP BY', 'SUBQUERY', 'CTE', 'WINDOW', 'AGGREGATE', 'DATE', 'STRING']

export default function ProblemBrowser({ today, userId, onStreakUpdate }: Props) {
  const [completed, setCompleted] = useState<CompletedMap>({})
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null)
  const [filterDiff, setFilterDiff] = useState<Difficulty | null>(null)
  const [filterCat, setFilterCat] = useState<Category | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState<'list' | 'problem'>('list')

  const dailyProblem = today ? getDailyProblem(today) : null

  useEffect(() => { loadCompleted() }, [userId])

  async function loadCompleted() {
    try {
      const { data } = await supabase
        .from('problem_attempts')
        .select('problem_id, completed')
        .eq('user_id', userId)
        .eq('completed', true)
      if (data) {
        const map: CompletedMap = {}
        data.forEach(r => { map[r.problem_id] = true })
        setCompleted(map)
      }
    } catch (_) {}
  }

  function openProblem(p: Problem) {
    setActiveProblem(p)
    setView('problem')
  }

  function goBack() {
    setView('list')
    setActiveProblem(null)
    loadCompleted() // refresh checkmarks
  }

  function handleStreakUpdate(n: number) {
    onStreakUpdate(n)
    loadCompleted()
  }

  const filtered = PROBLEMS.filter(p => {
    if (filterDiff && p.difficulty !== filterDiff) return false
    if (filterCat && p.category !== filterCat) return false
    return true
  })

  const totalDone = Object.keys(completed).length
  const hasFilters = filterDiff || filterCat

  // ── PROBLEM DETAIL VIEW ───────────────────────
  if (view === 'problem' && activeProblem) {
    return (
      <ProblemDetail
        problem={activeProblem}
        today={today}
        userId={userId}
        isDaily={dailyProblem?.id === activeProblem.id}
        initialCompleted={!!completed[activeProblem.id]}
        onBack={goBack}
        onStreakUpdate={handleStreakUpdate}
      />
    )
  }

  // ── LIST VIEW ─────────────────────────────────
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Progress header */}
      <div className="bg-dojo-surface border border-dojo-border rounded-xl p-4 glow-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-lg font-bold text-dojo-text">All Problems</h2>
          <span className="text-xs font-mono text-dojo-dim">{totalDone}/{PROBLEMS.length} solved</span>
        </div>
        <div className="h-1.5 bg-dojo-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-dojo-red to-dojo-orange rounded-full transition-all duration-700"
            style={{ width: `${(totalDone / PROBLEMS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Daily problem callout */}
      {dailyProblem && (
        <button
          onClick={() => openProblem(dailyProblem)}
          className="w-full bg-dojo-red/10 border border-dojo-red/40 rounded-xl p-4 text-left hover:bg-dojo-red/15 transition-all active:scale-[0.99] group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame size={13} className="text-dojo-red" />
            <span className="text-xs font-mono text-dojo-red font-semibold">TODAY'S CHALLENGE</span>
            {completed[dailyProblem.id] && <CheckCircle2 size={13} className="text-dojo-green ml-auto" />}
          </div>
          <p className="font-display font-bold text-dojo-text group-hover:text-white transition-colors">
            {dailyProblem.title}
          </p>
          <div className="flex gap-2 mt-1.5">
            <span className={clsx('text-xs font-mono', DIFFICULTY_COLOR[dailyProblem.difficulty].split(' ')[0])}>
              {dailyProblem.difficulty}
            </span>
            <span className={clsx('text-xs font-mono', CATEGORY_COLOR[dailyProblem.category])}>
              #{dailyProblem.category}
            </span>
          </div>
        </button>
      )}

      {/* Filter bar */}
      <div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={clsx(
            'flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-lg border transition-all',
            hasFilters
              ? 'bg-dojo-red/10 border-dojo-red/30 text-dojo-red'
              : 'border-dojo-border text-dojo-dim hover:text-dojo-text'
          )}
        >
          <Filter size={11} />
          {hasFilters ? 'Filtered' : 'Filter'}
          {hasFilters && (
            <span
              onClick={e => { e.stopPropagation(); setFilterDiff(null); setFilterCat(null) }}
              className="ml-1 hover:text-white"
            >
              <X size={11} />
            </span>
          )}
        </button>

        {showFilters && (
          <div className="mt-3 space-y-3 animate-slide-up">
            <div>
              <p className="text-xs font-mono text-dojo-dim mb-1.5">Difficulty</p>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setFilterDiff(filterDiff === d ? null : d)}
                    className={clsx(
                      'text-xs font-mono px-2.5 py-1 rounded border transition-all',
                      filterDiff === d
                        ? DIFFICULTY_COLOR[d]
                        : 'border-dojo-border text-dojo-dim hover:text-dojo-text'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-dojo-dim mb-1.5">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setFilterCat(filterCat === c ? null : c)}
                    className={clsx(
                      'text-xs font-mono px-2.5 py-1 rounded border transition-all',
                      filterCat === c
                        ? `${CATEGORY_COLOR[c]} border-current bg-current/10`
                        : 'border-dojo-border text-dojo-dim hover:text-dojo-text'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Problem list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-dojo-dim text-sm py-8">No problems match the filter.</p>
        )}
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => openProblem(p)}
            className={clsx(
              'w-full flex items-center gap-3 bg-dojo-surface border rounded-xl px-4 py-3 text-left hover:border-dojo-border/80 hover:bg-white/[0.02] transition-all active:scale-[0.99] group',
              p.id === dailyProblem?.id ? 'border-dojo-red/20' : 'border-dojo-border'
            )}
          >
            {/* Check */}
            <div className="flex-shrink-0">
              {completed[p.id]
                ? <CheckCircle2 size={18} className="text-dojo-green" />
                : <Circle size={18} className="text-dojo-muted" />
              }
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dojo-text group-hover:text-white transition-colors truncate">
                {p.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={clsx('text-xs font-mono', DIFFICULTY_COLOR[p.difficulty].split(' ')[0])}>
                  {p.difficulty}
                </span>
                <span className="text-dojo-border text-xs">·</span>
                <span className={clsx('text-xs font-mono', CATEGORY_COLOR[p.category])}>
                  {p.category}
                </span>
              </div>
            </div>

            {/* Daily badge */}
            {p.id === dailyProblem?.id && (
              <span className="flex-shrink-0 text-xs font-mono text-dojo-red bg-dojo-red/10 px-2 py-0.5 rounded">
                TODAY
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── PROBLEM DETAIL ────────────────────────────
function ProblemDetail({
  problem, today, userId, isDaily, initialCompleted, onBack, onStreakUpdate
}: {
  problem: Problem
  today: string
  userId: string
  isDaily: boolean
  initialCompleted: boolean
  onBack: () => void
  onStreakUpdate: (n: number) => void
}) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [completed, setCompleted] = useState(initialCompleted)
  const [notes, setNotes] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { loadAttempt() }, [])

  async function loadAttempt() {
    try {
      const { data } = await supabase
        .from('problem_attempts')
        .select('*')
        .eq('problem_id', problem.id)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
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

      if (next && isDaily) {
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
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-xs font-mono text-dojo-dim hover:text-dojo-text transition-colors flex items-center gap-1 bg-dojo-surface border border-dojo-border px-3 py-1.5 rounded-lg"
        >
          ← All Problems
        </button>
        {isDaily && (
          <span className="text-xs font-mono text-dojo-red flex items-center gap-1">
            <Flame size={11} /> Today's Challenge
          </span>
        )}
      </div>

      {/* Problem card */}
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
            <h2 className="font-display text-xl font-bold text-dojo-text">{problem.title}</h2>
          </div>
          <button
            onClick={toggleComplete}
            disabled={saving}
            className={clsx('flex-shrink-0 p-1 rounded-lg transition-all', completed ? 'text-dojo-green' : 'text-dojo-muted hover:text-dojo-text')}
          >
            {completed
              ? <CheckCircle2 size={28} className="drop-shadow-[0_0_8px_#00ff8888]" />
              : <Circle size={28} />
            }
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {problem.tables.map(t => (
            <span key={t} className="text-xs font-mono bg-dojo-bg border border-dojo-border text-dojo-blue px-2 py-0.5 rounded">{t}</span>
          ))}
        </div>

        <p className="text-dojo-text text-sm leading-relaxed">{problem.description}</p>

        <div className="mt-3 pt-3 border-t border-dojo-border">
          <p className="text-xs text-dojo-dim font-mono mb-1">Expected columns:</p>
          <div className="flex flex-wrap gap-1">
            {problem.expectedColumns.map(col => (
              <span key={col} className="text-xs font-mono text-dojo-yellow bg-dojo-yellow/5 border border-dojo-yellow/20 px-2 py-0.5 rounded">{col}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      {loaded && (
        <div className="bg-dojo-surface border border-dojo-border rounded-xl p-4">
          <label className="text-xs font-mono text-dojo-dim block mb-2 flex items-center gap-1.5">
            <Code2 size={12} /> Your SQL attempt / notes
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
            <Lightbulb size={14} /> Hint
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
          <p className="text-dojo-green font-display font-bold text-lg">✓ Solved!</p>
          <p className="text-dojo-dim text-xs mt-1 font-mono">
            {isDaily ? 'Daily challenge complete 🔥' : 'Keep going — pick another problem'}
          </p>
        </div>
      )}
    </div>
  )
}
