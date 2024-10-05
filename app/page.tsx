import Link from 'next/link'

import { TodoListView } from '@/components/todo-list'

export const metadata = {
  title: 'HCU Todo App',
}

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <Link href="/">
          <h1 className="text-3xl font-bold">Todo App</h1>
        </Link>

        <TodoListView />
      </main>

      <footer className="row-start-3">
        <p>
          by{' '}
          <a
            target="_blank"
            referrerPolicy="no-referrer"
            href="https://github.com/lai-dai/hcu-todo"
            className="font-semibold"
          >
            laidai
          </a>
        </p>
      </footer>
    </div>
  )
}
