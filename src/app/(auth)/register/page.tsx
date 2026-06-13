'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  Stethoscope,
  ArrowLeft,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

const steps = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Credentials' },
  { id: 3, label: 'Documents' },
]

const personalInfoSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Enter a valid mobile number'),
})

const credentialsSchema = z.object({
  specialization: z.string().min(1, 'Select your specialization'),
  qualification: z.string().min(2, 'Enter your qualification'),
  experience: z.coerce.number().min(0, 'Enter valid experience'),
  hospital: z.string().min(2, 'Enter hospital name'),
  clinic_address: z.string().min(5, 'Enter clinic address'),
  consultation_fee: z.coerce.number().min(0, 'Enter valid fee'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const documentSchema = z.object({
  _files: z.any().optional(),
})

type PersonalInfo = z.infer<typeof personalInfoSchema>
type Credentials = z.infer<typeof credentialsSchema>

interface FileUploadItem {
  label: string
  key: string
  required: boolean
}

const documentFields: FileUploadItem[] = [
  { label: 'MBBS Degree Certificate', key: 'mbbs_certificate', required: true },
  { label: 'MD/MS Degree Certificate', key: 'md_certificate', required: false },
  { label: 'Medical Council Registration', key: 'council_registration', required: true },
  { label: 'Aadhaar / PAN Card', key: 'id_proof', required: true },
  { label: 'Profile Photo', key: 'profile_photo', required: true },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fileNames, setFileNames] = useState<Record<string, string>>({})
  const router = useRouter()
  const supabase = createClient()

  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
  })

  const credentialsForm = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
  })

  const canProceedStep1 =
    personalForm.formState.isValid &&
    Object.keys(personalForm.formState.dirtyFields).length >= 3

  const canProceedStep2 =
    credentialsForm.formState.isValid &&
    Object.keys(credentialsForm.formState.dirtyFields).length >= 6

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileNames((prev) => ({ ...prev, [key]: file.name }))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const personal = personalForm.getValues()
      const credentials = credentialsForm.getValues()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: personal.email,
        password: credentials.password,
        options: {
          data: {
            full_name: personal.full_name,
            role: 'doctor',
          },
        },
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create account')

      const { error: dbError } = await supabase.from('doctors').insert({
        doctor_id: authData.user.id,
        full_name: personal.full_name,
        email: personal.email,
        mobile: personal.mobile,
        specialization: credentials.specialization,
        qualification: credentials.qualification,
        experience: credentials.experience,
        hospital: credentials.hospital,
        clinic_address: credentials.clinic_address,
        consultation_fee: credentials.consultation_fee,
        verification_status: 'pending',
      })
      if (dbError) throw dbError

      setSubmitted(true)
      toast.success('Application submitted successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted</h2>
          <p className="text-gray-500 mb-2">
            Your application is under review. We will verify your credentials and notify you
            via email within 2-3 business days.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            You&apos;ll receive an email at <strong>{personalForm.getValues().email}</strong> once verified.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-[480px] relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">VitaliQ</h1>
              <p className="text-emerald-200 text-sm">Doctor Registration</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Join Our Network of<br />
            <span className="text-emerald-300">Healthcare Professionals</span>
          </h2>
          <p className="text-emerald-100/80 leading-relaxed">
            Complete your registration in three simple steps to start managing your
            practice digitally.
          </p>
          <div className="mt-12 space-y-6">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-4">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                    step > s.id
                      ? 'bg-emerald-400 text-emerald-900'
                      : step === s.id
                      ? 'bg-white text-emerald-700'
                      : 'bg-white/10 text-white/50'
                  )}
                >
                  {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <span
                  className={cn(
                    'text-sm',
                    step >= s.id ? 'text-white' : 'text-white/50'
                  )}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center p-8 pt-16 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VitaliQ</span>
          </div>

          <div className="lg:hidden flex justify-center gap-2 mb-8">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold',
                    step > s.id
                      ? 'bg-emerald-500 text-white'
                      : step === s.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  )}
                >
                  {step > s.id ? <Check className="h-3 w-3" /> : s.id}
                </div>
                {s.id < steps.length && (
                  <div
                    className={cn(
                      'h-0.5 w-8',
                      step > s.id ? 'bg-emerald-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Personal Information</h2>
              <p className="text-gray-500 mb-8">Tell us about yourself</p>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...personalForm.register('full_name')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      personalForm.formState.errors.full_name &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="Dr. John Doe"
                  />
                  {personalForm.formState.errors.full_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {personalForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...personalForm.register('email')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      personalForm.formState.errors.email &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="doctor@hospital.com"
                  />
                  {personalForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {personalForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    {...personalForm.register('mobile')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      personalForm.formState.errors.mobile &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="+91 98765 43210"
                  />
                  {personalForm.formState.errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">
                      {personalForm.formState.errors.mobile.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className={cn(
                    'w-full py-2.5 rounded-xl font-medium text-sm transition-all',
                    'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
                    'hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  )}
                >
                  Next Step
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Professional Credentials</h2>
              <p className="text-gray-500 mb-8">Your medical practice details</p>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Specialization
                  </label>
                  <select
                    {...credentialsForm.register('specialization')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      credentialsForm.formState.errors.specialization &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                  >
                    <option value="">Select specialization</option>
                    {[
                      'Cardiology',
                      'Dermatology',
                      'Endocrinology',
                      'Gastroenterology',
                      'General Medicine',
                      'Neurology',
                      'Obstetrics & Gynecology',
                      'Ophthalmology',
                      'Orthopedics',
                      'Pediatrics',
                      'Psychiatry',
                      'Pulmonology',
                      'Radiology',
                      'Urology',
                    ].map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  {credentialsForm.formState.errors.specialization && (
                    <p className="text-red-500 text-xs mt-1">
                      {credentialsForm.formState.errors.specialization.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Qualification
                  </label>
                  <input
                    type="text"
                    {...credentialsForm.register('qualification')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      credentialsForm.formState.errors.qualification &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="MBBS, MD in Cardiology"
                  />
                  {credentialsForm.formState.errors.qualification && (
                    <p className="text-red-500 text-xs mt-1">
                      {credentialsForm.formState.errors.qualification.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    {...credentialsForm.register('experience')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      credentialsForm.formState.errors.experience &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="10"
                  />
                  {credentialsForm.formState.errors.experience && (
                    <p className="text-red-500 text-xs mt-1">
                      {credentialsForm.formState.errors.experience.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Hospital / Clinic Name
                  </label>
                  <input
                    type="text"
                    {...credentialsForm.register('hospital')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      credentialsForm.formState.errors.hospital &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="City Hospital"
                  />
                  {credentialsForm.formState.errors.hospital && (
                    <p className="text-red-500 text-xs mt-1">
                      {credentialsForm.formState.errors.hospital.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Clinic Address
                  </label>
                  <textarea
                    {...credentialsForm.register('clinic_address')}
                    rows={2}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm resize-none',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      credentialsForm.formState.errors.clinic_address &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="123, Medical Complex, Main Road, City - 600001"
                  />
                  {credentialsForm.formState.errors.clinic_address && (
                    <p className="text-red-500 text-xs mt-1">
                      {credentialsForm.formState.errors.clinic_address.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    {...credentialsForm.register('consultation_fee')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      credentialsForm.formState.errors.consultation_fee &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="500"
                  />
                  {credentialsForm.formState.errors.consultation_fee && (
                    <p className="text-red-500 text-xs mt-1">
                      {credentialsForm.formState.errors.consultation_fee.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    {...credentialsForm.register('password')}
                    className={cn(
                      'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                      credentialsForm.formState.errors.password &&
                        'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    )}
                    placeholder="Create a password"
                  />
                  {credentialsForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {credentialsForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl font-medium text-sm transition-all',
                      'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
                      'hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-200',
                      'disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    )}
                  >
                    Next Step
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Upload Documents</h2>
              <p className="text-gray-500 mb-8">Submit your verification documents</p>
              <div className="space-y-4">
                {documentFields.map((field) => (
                  <label
                    key={field.key}
                    className="block cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-emerald-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Upload className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </p>
                            {fileNames[field.key] ? (
                              <p className="text-xs text-emerald-600">{fileNames[field.key]}</p>
                            ) : (
                              <p className="text-xs text-gray-400">Click to upload</p>
                            )}
                          </div>
                        </div>
                        {fileNames[field.key] && (
                          <Check className="h-5 w-5 text-emerald-500" />
                        )}
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileChange(field.key, e)}
                    />
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl font-medium text-sm transition-all',
                    'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
                    'hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-200',
                    'disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
