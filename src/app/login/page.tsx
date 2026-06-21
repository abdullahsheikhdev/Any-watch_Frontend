'use client'

import React, { useState, FormEvent, ChangeEvent, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LoginFormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
  otp?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // OTP verification state
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [pendingToken, setPendingToken] = useState('')
  const [pendingUser, setPendingUser] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.message || 'Invalid email or password' })
        return
      }

      if (data.success && data.token) {
        // User not verified — show OTP screen
        if (data.user && !data.user.isVerified) {
          setPendingToken(data.token)
          setPendingUser(data.user)
          setShowOtpInput(true)
          return
        }

        // Fully verified — save and redirect
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
        router.refresh()
      } else {
        setErrors({ general: data.message || 'Login failed. Please try again.' })
      }
    } catch (err) {
      console.error('Login fetch error:', err)
      setErrors({ general: 'Unable to connect to server. Please check if the server is running.' })
    } finally {
      setIsLoading(false)
    }
  }

  // OTP input handling
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (paste.length === 6) {
      setOtp(paste.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' })
      return
    }

    setIsVerifying(true)
    setErrors({})

    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pendingToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ code: otpCode }),
      })

      const data = await response.json()

      if (data.success) {
        const updatedUser = { ...pendingUser, isVerified: true, ...data.user }
        localStorage.setItem('token', pendingToken)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        router.push('/')
        router.refresh()
      } else {
        setErrors({ otp: data.message || 'Invalid verification code' })
      }
    } catch (err) {
      console.error('OTP verify error:', err)
      setErrors({ otp: 'Failed to verify code. Please try again.' })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await fetch('http://localhost:4000/api/auth/resend-verification-code', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${pendingToken}` },
        credentials: 'include',
      })
      setErrors({ otp: '' })
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } catch {
      setErrors({ otp: 'Failed to resend code. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-linear-to-r from-[#F84565] via-purple-500 to-blue-500" />

          <div className="p-8 sm:p-10">
            {!showOtpInput ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F84565]/10 border border-[#F84565]/20 mb-4">
                    <svg className="w-7 h-7 text-[#F84565]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                  <p className="text-gray-400 mt-1 text-sm">Sign in to your Any Watch account</p>
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F84565]/50 focus:border-[#F84565] outline-none transition`}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-gray-800 border ${
                          errors.password ? 'border-red-500' : 'border-gray-700'
                        } rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#F84565]/50 focus:border-[#F84565] outline-none transition pr-12`}
                        placeholder="••••••••"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 014.132-5.411m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
                  </div>

                  {/* Forgot password */}
                  <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-xs text-[#F84565] hover:text-[#d83550] transition">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    id="btn-login"
                    disabled={isLoading}
                    className="w-full py-3 bg-linear-to-r from-[#F84565] to-[#d83550] hover:from-[#d83550] hover:to-[#c02d45] text-white rounded-lg font-semibold shadow-lg hover:shadow-[#F84565]/25 transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-[#F84565] hover:text-[#d83550] font-medium transition">
                      Sign up
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* OTP Verification */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
                  <p className="text-gray-400 mt-2 text-sm">
                    We sent a 6-digit code to{' '}
                    <span className="text-white font-medium">{formData.email}</span>
                  </p>
                </div>

                {errors.otp && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.otp}
                  </div>
                )}

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-8" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      id={`otp-${i}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  id="btn-verify-otp"
                  disabled={isVerifying || otp.join('').length !== 6}
                  className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Sign In'
                  )}
                </button>

                <div className="mt-5 text-center space-y-3">
                  <p className="text-sm text-gray-500">
                    Didn&apos;t receive the code?{' '}
                    <button
                      onClick={handleResendOtp}
                      className="text-[#F84565] hover:text-[#d83550] font-medium transition"
                    >
                      Resend
                    </button>
                  </p>
                  <button
                    onClick={() => { setShowOtpInput(false); setOtp(['','','','','','']); setErrors({}) }}
                    className="text-xs text-gray-600 hover:text-gray-400 transition"
                  >
                    ← Back to login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}