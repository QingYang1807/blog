'use client'

import React from 'react'
import Link from 'next/link'

export default function LoginCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">账号登录</h3>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <input 
            type="email" 
            placeholder="邮箱" 
            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm"
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="密码" 
            className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm"
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
        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          登录
        </button>
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