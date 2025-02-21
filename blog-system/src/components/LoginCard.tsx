'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface LoginCardProps {
  onLogin: (form: { username: string; password: string }) => Promise<void>
  isLoading: boolean
}

export default function LoginCard({ onLogin, isLoading }: LoginCardProps) {
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onLogin(form)
  }

  const handleDemoLogin = async () => {
    await onLogin({ username: 'demo', password: 'password' })
  }

  return (
    <div className="mb-4 p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">账号登录</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <input 
            type="text"
            placeholder="用户名" 
            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm"
            value={form.username}
            onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
            disabled={isLoading}
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="密码" 
            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm"
            value={form.password}
            onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-muted-foreground">记住我</span>
          </label>
          <Link href="/forgot-password" className="text-primary hover:text-primary/80">
            忘记密码？
          </Link>
        </div>
        <div className="space-y-2">
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
          <button 
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '使用演示账号'}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        还没有账号？
        <Link href="/register" className="text-primary hover:text-primary/80 ml-1">
          立即注册
        </Link>
      </div>
    </div>
  )
} 