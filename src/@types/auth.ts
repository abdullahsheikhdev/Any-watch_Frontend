export interface LoginFormData {
  name: string
  email: string
  password: string
}

export interface FormErrors {
  name?: string
  email?: string
  password?: string
  general?: string
}