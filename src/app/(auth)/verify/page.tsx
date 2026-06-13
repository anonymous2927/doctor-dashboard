'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, ShieldCheck, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils/cn'

const RESEND_TIMER = 30

export default function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [timer, setTimer] = useState(RESEND_TIMER)
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const supabase = createClient()
  const setUser = useAuthStore((s) => s.setUser)
  const setSession = useAuthStore((s) => s.setSession)

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer, canResend])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`)
      prev?.focus()
    }
  }

  const handleResend = async () => {
    if (!canResend || !email) return
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })
    if (error) {
      toast.error(error.message)
      return
    }
    setCanResend(false)
    setTimer(RESEND_TIMER)
    toast.success('OTP resent successfully')
  }

  const handleVerify = useCallback(async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP')
      return
    }

    setIsVerifying(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      })
      if (error) throw error
      if (!data.session) throw new Error('No session returned')

      setUser(data.user)
      setSession(data.session)
      toast.success('Verified successfully!')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }, [otp, email, supabase, setUser, setSession, router])

  useEffect(() => {
    const isComplete = otp.every((d) => d !== '')
    if (isComplete) {
      handleVerify()
    }
  }, [otp, handleVerify])

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
        <div className="relative z-10 text-center text-white max-w-sm">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Two-Factor<br />
            <span className="text-emerald-300">Verification</span>
          </h2>
          <p className="text-emerald-100/80 leading-relaxed">
            We&apos;ve sent a one-time verification code to your email. Enter it below to
            securely access your account.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
            <Mail className="h-7 w-7 text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Check your email</h2>
          <p className="text-gray-500 mb-2">
            We sent a verification code to
          </p>
          <p className="text-sm font-medium text-gray-700 mb-8">
            {email || 'your registered email'}
          </p>

          <div className="flex gap-2 justify-center mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'h-14 w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-bold',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                  'transition-all'
                )}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying || otp.join('').length !== 6}
            className={cn(
              'w-full py-2.5 rounded-xl font-medium text-sm transition-all mb-6',
              'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
              'hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-200',
              'disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            )}
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>

          <div className="text-sm text-gray-500">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Resend code
              </button>
            ) : (
              <p>
                Resend code in <span className="font-medium text-gray-700">{timer}s</span>
              </p>
            )}
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mt-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
