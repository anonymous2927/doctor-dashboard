'use client'

import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Stethoscope, ShieldCheck, Heart, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils/cn'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginFormInner() {
  const [isOtpMode, setIsOtpMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const setUser = useAuthStore((s) => s.setUser)
  const setSession = useAuthStore((s) => s.setSession)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true)
    try {
      if (isOtpMode) {
        const { error } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: { shouldCreateUser: false },
        })
        if (error) throw error
        toast.success('OTP sent to your email')
        router.push(`/verify?email=${encodeURIComponent(data.email)}`)
        return
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error
      if (!authData.session) throw new Error('No session returned')

      setUser(authData.user)
      setSession(authData.session)
      toast.success('Welcome back!')
      const redirect = searchParams.get('redirect') || '/dashboard'
      router.push(redirect)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-md text-white">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="4"/>
                <path d="M8 8h8M8 12h8M8 16h6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Carenium</h1>
              <p className="text-emerald-200 text-[11px] tracking-[3px] font-semibold">DOCTOR HUB</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Your Practice,<br />
            <span className="text-emerald-300">Intelligently Managed</span>
          </h2>
          <p className="text-emerald-100/80 mb-12 leading-relaxed">
            Streamline appointments, manage patient records, and grow your practice
            with Carenium's all-in-one healthcare platform.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, label: '500+', sub: 'Active Doctors' },
              { icon: Heart, label: '10K+', sub: 'Patients Served' },
              { icon: Users, label: '99.9%', sub: 'Uptime' },
              { icon: Stethoscope, label: '4.8★', sub: 'Avg Rating' },
            ].map((stat) => (
              <div key={stat.sub} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <stat.icon className="h-5 w-5 text-emerald-300 mb-2" />
                <p className="text-xl font-bold">{stat.label}</p>
                <p className="text-emerald-200/70 text-sm">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8 8h8M8 12h8M8 16h6" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-gray-900">Carenium</span>
              <span className="ml-2 text-[9px] font-semibold text-gray-400 tracking-[2px]">DOCTOR HUB</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                {...register('email')}
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                  'placeholder:text-gray-400 transition-shadow',
                  errors.email && 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                )}
                placeholder="doctor@hospital.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                  'placeholder:text-gray-400 transition-shadow',
                  errors.password && 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                )}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full py-2.5 rounded-xl font-medium text-sm transition-all',
                'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
                'hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-200',
                'disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOtpMode(!isOtpMode)}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isOtpMode ? 'Sign in with password' : 'Sign in with OTP'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-emerald-600 font-medium hover:text-emerald-700">
              Register as doctor
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <LoginFormInner />
    </Suspense>
  )
}
