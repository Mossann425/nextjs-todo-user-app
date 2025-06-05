import { createClient } from '@/utils/supabase/server'
import TodoList from './components/TodoList'
import Auth from './components/Auth'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  if (!user) {
    return <Auth />
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 px-4">
          <h1 className="text-2xl font-bold">Todoリスト</h1>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm text-gray-600 hover:text-gray-900">
              ログアウト
            </button>
          </form>
        </div>
        <TodoList initialTodos={todos || []} />
      </div>
    </main>
  )
}
