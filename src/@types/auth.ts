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