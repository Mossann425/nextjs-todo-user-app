import AuthForm from '@/app/components/AuthForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm type="signup" />
    </div>
  )
}
