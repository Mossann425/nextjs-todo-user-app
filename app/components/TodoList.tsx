'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Todo = {
  id: string
  title: string
  completed: boolean
  user_id: string
}

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTodo, setNewTodo] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('ユーザーが認証されていません')
        return
      }

      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          title: newTodo.trim(),
          user_id: user.id,
          completed: false
        }])
        .select()
        .single()

      if (error) {
        console.error('Supabaseエラー:', error.message)
        return
      }

      if (!data) {
        console.error('データが返されませんでした')
        return
      }

      setTodos([...todos, data])
      setNewTodo('')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding todo:', error.message)
      } else {
        console.error('Unknown error:', error)
      }
    }
  }

  const toggleTodo = async (todo: Todo) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id)

      if (error) throw error

      setTodos(
        todos.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      )
      router.refresh()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id)

      if (error) throw error

      setTodos(todos.filter((t) => t.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="新しいタスク"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
              className="h-4 w-4"
            />
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-gray-400' : ''
              }`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
