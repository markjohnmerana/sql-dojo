'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sword, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

type Mode = 'login' | 'signup' | 'forgot'

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Check your email to confirm your account, then log in.')
        setMode('login')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setSuccess('Password reset link sent! Check your email.')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-dojo-bg flex flex-col items-center justify-center px-4 safe-pt safe-pb">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dojo-surface border border-dojo-border mb-4">
          <Sword size={28} className="text-dojo-red" />
        </div>
        <h1 className="font-display text-4xl font-bold gradient-text tracking-tight">SQL Dojo</h1>
        <p className="text-dojo-dim text-sm mt-2 font-mono">Daily SQL challenges. Master the craft.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-dojo-surface border border-dojo-border rounded-2xl p-6 glow-border">
        <h2 className="font-display text-lg font-bold text-dojo-text mb-5">
          {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
        </h2>

        {/* Error / success */}
        {error && (
          <div className="bg-dojo-red/10 border border-dojo-red/30 rounded-lg px-4 py-3 text-sm text-dojo-red mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-dojo-green/10 border border-dojo-green/30 rounded-lg px-4 py-3 text-sm text-dojo-green mb-4">
            {success}
          </div>
        )}

        <div className="space-y-3">
          {/* Email */}
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dojo-muted" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              className="w-full bg-dojo-bg border border-dojo-border rounded-xl pl-9 pr-4 py-3 text-sm text-dojo-text placeholder:text-dojo-muted outline-none focus:border-dojo-red transition-colors"
            />
          </div>

          {/* Password */}
          {mode !== 'forgot' && (
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dojo-muted" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="password"
                className="w-full bg-dojo-bg border border-dojo-border rounded-xl pl-9 pr-10 py-3 text-sm text-dojo-text placeholder:text-dojo-muted outline-none focus:border-dojo-red transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dojo-muted hover:text-dojo-text transition-colors"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !email || (mode !== 'forgot' && !password)}
            className="w-full bg-dojo-red hover:bg-dojo-red/80 disabled:opacity-40 text-white font-semibold rounded-xl py-3 text-sm transition-all active:scale-95 flex items-center justify-center gap-2 mt-1"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </div>

        {/* Mode switcher */}
        <div className="mt-5 pt-4 border-t border-dojo-border space-y-2 text-center text-sm">
          {mode === 'login' && (
            <>
              <p className="text-dojo-dim">
                No account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setSuccess('') }} className="text-dojo-blue hover:underline">
                  Sign up
                </button>
              </p>
              <p>
                <button onClick={() => { setMode('forgot'); setError(''); setSuccess('') }} className="text-dojo-dim hover:text-dojo-text transition-colors text-xs">
                  Forgot password?
                </button>
              </p>
            </>
          )}
          {(mode === 'signup' || mode === 'forgot') && (
            <p className="text-dojo-dim">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); setSuccess('') }} className="text-dojo-blue hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>

      <p className="text-dojo-muted text-xs mt-6 font-mono">your data · your progress · your streak</p>
    </div>
  )
}
