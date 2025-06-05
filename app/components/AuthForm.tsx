'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (type === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      }

      router.refresh()
      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[300px]">
      <h1 className="text-2xl font-bold mb-4">
        {type === 'login' ? 'ログイン' : '新規登録'}
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
      )}
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {type === 'login' ? 'ログイン' : '登録'}
      </button>
    </form>
  )
}
