'use client'

import { createClient } from '@/utils/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthComponent() {
  const supabase = createClient()
  const router = useRouter()
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in')

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
            {view === 'sign_in' ? 'アカウントにログイン' : '新規アカウント登録'}
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setView('sign_in')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              view === 'sign_in'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ログイン
          </button>
          <button
            onClick={() => setView('sign_up')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              view === 'sign_up'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            新規登録
          </button>
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
          view={view}
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
                link_text: 'パスワードをお忘れの方はこちら'
              },
              sign_up: {
                email_label: 'メールアドレス',
                password_label: 'パスワード',
                button_label: '新規登録',
                loading_button_label: '登録中...',
                email_input_placeholder: 'メールアドレスを入力',
                password_input_placeholder: 'パスワードを入力',
                link_text: 'すでにアカウントをお持ちの方はこちら'
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

        {view === 'sign_up' && (
          <div className="mt-4 text-sm text-gray-600">
            <h3 className="font-medium mb-2">新規登録方法：</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>メールアドレスとパスワードで登録</li>
              <li>GitHubアカウントで登録</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
} 