import AuthForm from '@/app/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm type="login" />
    </div>
  )
}
