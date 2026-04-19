export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export interface otpResponse {
  success: boolean
  message: string
  otp?: string
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  expired?: boolean;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  expired?: boolean;
}

export interface Errors {
  general?: string;
}