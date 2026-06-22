'use client'

import React, { useState, FormEvent, ChangeEvent, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import axiosInstance from '@/lib/axios'
import type { FormErrors } from '@/@types/auth'


export default function ForgotPasswordPage() {
  const router = useRouter()
  
  // Stages: 'email' (requesting OTP), 'reset' (entering OTP & new password)
  const [stage, setStage] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const inputRef = useRef<HTMLInputElement[]>([])

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    const pasteData: string = e.clipboardData.getData("text");
    const pasteDataArray: string[] = pasteData.split("");

    pasteDataArray.forEach((value: string, index: number) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = value;
      }
    });
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ): void => {
    const value = e.currentTarget.value;
    if (value && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ): void => {
    if (e.target instanceof HTMLInputElement) {
      if (e.key === "Backspace" && e.target.value === "" && index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate email
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await axiosInstance.post('/api/auth/password-reset-otp', { email })
      if (response.data.success) {
        setStage('reset')
      } else {
        setErrors({ general: response.data.message || 'Failed to send OTP' })
      }
    } catch (error: unknown) {
      console.error('Password reset OTP error:', error)
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || 'Failed to send OTP. Please check your email and try again.'
        setErrors({ general: msg })
      } else {
        setErrors({ general: 'An error occurred. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Collect OTP from inputs
    const otp = inputRef.current
      .filter((input): input is HTMLInputElement => input !== null)
      .map((input) => input.value)
      .join("")

    const newErrors: FormErrors = {}

    // Validation
    if (otp.length !== 6) {
      newErrors.otp = 'Please enter the 6-digit OTP'
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be 6 digits'
    }

    if (!newPassword) {
      newErrors.password = 'New password is required'
    } else if (newPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await axiosInstance.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword
      })

      if (response.data.success) {
        // Password reset successful! Redirect to login page
        router.push('/login?reset=success')
      } else {
        setErrors({ general: response.data.message || 'Reset password failed' })
      }
    } catch (error: unknown) {
      console.error('Reset password error:', error)
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || 'Password reset failed. Please check the code and try again.'
        setErrors({ general: msg })
      } else {
        setErrors({ general: 'An error occurred. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        {stage === 'email' ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
              <p className="text-gray-600 mt-2">Enter your email and we will send you a reset code</p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors({})
                  }}
                  className={`w-full px-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="john@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending code...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
              <p className="text-gray-600 mt-2">Enter the code sent to <span className="font-semibold">{email}</span> and choose a new password</p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-5">
              {/* OTP Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code (6-Digit OTP)
                </label>
                <div onPaste={handlePaste} className="flex justify-between gap-2 my-4">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <input
                        key={index}
                        required
                        type="text"
                        maxLength={1}
                        className={`w-12 h-12 text-center text-xl font-bold border-2 ${
                          errors.otp ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                        ref={(e: HTMLInputElement | null) => {
                          if (e) inputRef.current[index] = e;
                        }}
                        onChange={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        disabled={isLoading}
                      />
                    ))}
                </div>
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600 text-center">{errors.otp}</p>
                )}
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                    }}
                    className={`w-full px-4 py-3 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                  }}
                  className={`w-full px-4 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage('email')
                  setErrors({})
                }}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-center"
              >
                Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
