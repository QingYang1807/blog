'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiFeather, FiGithub, FiTwitter, FiEdit, FiSettings, FiUser, FiLogOut, FiDatabase } from 'react-icons/fi'
import CategoryView from '@/components/CategoryView'
import Announcement from '@/components/Announcement'
import Cookies from 'js-cookie'

export default function HomePage() {
  const [user, setUser] = useState<{ username: string; avatar?: string } | null>(null)

  useEffect(() => {
    const userInfo = Cookies.get('userInfo')
    if (userInfo) {
      setUser(JSON.parse(userInfo))
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove('userInfo')
    setUser(null)
    window.location.reload() // 刷新页面以更新所有组件
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-4 h-14 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <FiFeather className="text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
              QingYang`s Blog
            </span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/articles" className="hover:text-primary transition-colors">文章</Link>
            <Link href="/categories" className="hover:text-primary transition-colors">分类</Link>
            <Link href="/about" className="hover:text-primary transition-colors">关于</Link>
            
            {user ? (
              <div className="relative group">
                <button 
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors"
                >
                  <img 
                    src={user.avatar || "/avatar-placeholder.jpg"}
                    alt="用户头像" 
                    className="w-full h-full object-cover"
                  />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg py-2 border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 hover:opacity-100 hover:visible">
                  {/* 添加欢迎提示语 */}
                  <div className="px-4 py-2 border-b border-border">
                    <div className="text-sm text-gray-500 dark:text-gray-400">你好，</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{user.username}</div>
                  </div>
                  
                  <Link 
                    href="/write" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:text-white transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                    发表文章
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:text-white transition-colors"
                  >
                    <FiDatabase className="w-4 h-4" />
                    后台管理
                  </Link>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:text-white transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    个人资料
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:text-white transition-colors"
                  >
                    <FiSettings className="w-4 h-4" />
                    设置
                  </Link>
                  <hr className="my-2 border-border" />
                  <button 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors w-full text-left"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-1.5 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6 py-8">
          <div className="flex-1 min-w-0">
            <Announcement />
            {/* 最新文章列表 */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="i-mdi-clock-outline w-5 h-5"></span>
                最新文章
              </h2>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <article key={i} className="group bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-lg transition-all">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/40 to-purple-500/40" />
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">技术</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">React</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 truncate group-hover:text-primary transition-colors">
                          构建现代化的Web应用：从设计到部署的最佳实践
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          探索最新的前端技术栈，包括React、Next.js、TypeScript等，了解如何构建高性能的Web应用。
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">2024-03-21</span>
                          <Link href={`/article/${i}`} className="text-primary hover:text-primary/80 transition-colors text-sm">
                            阅读更多 →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <CategoryView userInfo={user} onLogout={handleLogout} />

            {/* 订阅卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4">订阅更新</h3>
              <p className="text-sm text-muted-foreground mb-4">
                获取最新的技术文章和见解
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="输入邮箱" 
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
                  订阅
                </button>
              </div>
            </div>

            {/* 关于卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4">关于博主</h3>
              <p className="text-sm text-muted-foreground mb-4">
                全栈开发者，热爱技术，专注于Web开发和工程实践
              </p>
              <div className="flex gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <FiGithub size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <FiTwitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 简化的页脚 */}
      <footer className="border-t border-border/40 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 QingYang`s Blog. 保留所有权利.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">隐私政策</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">使用条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
