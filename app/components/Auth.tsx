'use client'

import { createClient } from '@/utils/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthComponent() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Todoアプリ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            サインインまたは新規登録してください
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4F46E5',
                  brandAccent: '#4338CA'
                }
              }
            }
          }}
          providers={['github']}
          view="sign_in"
          showLinks={true}
          localization={{
            variables: {
              sign_in: {
                email_label: 'メールアドレス',
                password_label: 'パスワード',
                button_label: 'サインイン',
                loading_button_label: '送信中...',
                email_input_placeholder: 'メールアドレスを入力',
                password_input_placeholder: 'パスワードを入力',
                link_text: 'すでにアカウントをお持ちの方はこちら'
              },
              sign_up: {
                email_label: 'メールアドレス',
                password_label: 'パスワード',
                button_label: '新規登録',
                loading_button_label: '登録中...',
                email_input_placeholder: 'メールアドレスを入力',
                password_input_placeholder: 'パスワードを入力',
                link_text: 'アカウントをお持ちでない方はこちら'
              },
              forgotten_password: {
                link_text: 'パスワードをお忘れの方',
                button_label: 'パスワードをリセット',
                loading_button_label: '送信中...',
                email_input_placeholder: 'メールアドレスを入力'
              }
            }
          }}
        />
      </div>
    </div>
  )
} 