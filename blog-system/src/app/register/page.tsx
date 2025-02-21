'use client'

import React, { useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSun, FiMoon } from 'react-icons/fi'
import type { Engine } from '@tsparticles/engine'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function RegisterPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  
  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 120,
    particles: {
      color: {
        value: '#ffffff',
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          value_area: 800,
        },
        value: 40,
      },
      opacity: {
        value: 0.4,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
        },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
        },
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 1,
        },
      },
    },
  }

  return (
    <div className={`min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 
      ${theme === 'dark' 
        ? 'bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800' 
        : 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
      }`}
    >
      {/* 主题切换按钮 */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 
          hover:bg-white/20 transition-all duration-300 text-white z-50"
        aria-label="切换主题"
      >
        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 -z-10"
      />

      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 -z-5">
        <div className={`absolute top-20 left-20 w-32 h-32 
          ${theme === 'dark' ? 'bg-pink-500/20' : 'bg-indigo-500/20'} 
          rounded-full blur-3xl animate-pulse`}
        ></div>
        <div className={`absolute bottom-20 right-20 w-40 h-40 
          ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-violet-500/20'} 
          rounded-full blur-3xl animate-pulse delay-1000`}
        ></div>
        <div className={`absolute top-1/2 left-1/3 w-24 h-24 
          ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-pink-500/20'} 
          rounded-full blur-2xl animate-pulse delay-700`}
        ></div>
      </div>

      <div className="w-full max-w-sm relative">
        <div className={`${theme === 'dark' ? 'bg-white/10' : 'bg-white/60'} 
          backdrop-blur-lg rounded-3xl shadow-xl p-8 border 
          ${theme === 'dark' ? 'border-white/20' : 'border-white/40'} 
          relative overflow-hidden hover:shadow-2xl transition-all duration-300`}
        >
          {/* 悬浮效果装饰 */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 rounded-full blur-2xl"></div>

          <div className="text-center mb-6 relative">
            <Link 
              href="/" 
              className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} 
                hover:text-pink-500 transition-colors`}
            >
              <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
                TechBlog
              </span>
            </Link>
            <h2 className={`mt-4 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              开启你的博客之旅 ✨
            </h2>
          </div>

          <form className="space-y-4 relative" onSubmit={(e) => e.preventDefault()}>
            <div className="group">
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`w-full px-4 py-2.5 
                  ${theme === 'dark' ? 'bg-white/5 text-white placeholder-white/50' : 'bg-white/40 text-gray-800 placeholder-gray-500'} 
                  border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} 
                  rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent 
                  transition-all duration-300 group-hover:bg-white/10`}
                placeholder="为自己取个酷名字吧"
              />
            </div>

            <div className="group">
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`w-full px-4 py-2.5 
                  ${theme === 'dark' ? 'bg-white/5 text-white placeholder-white/50' : 'bg-white/40 text-gray-800 placeholder-gray-500'} 
                  border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} 
                  rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent 
                  transition-all duration-300 group-hover:bg-white/10`}
                placeholder="输入你的邮箱"
              />
            </div>

            <div className="group">
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`w-full px-4 py-2.5 
                  ${theme === 'dark' ? 'bg-white/5 text-white placeholder-white/50' : 'bg-white/40 text-gray-800 placeholder-gray-500'} 
                  border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} 
                  rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent 
                  transition-all duration-300 group-hover:bg-white/10`}
                placeholder="设置一个安全的密码"
              />
            </div>

            <div className="group">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`w-full px-4 py-2.5 
                  ${theme === 'dark' ? 'bg-white/5 text-white placeholder-white/50' : 'bg-white/40 text-gray-800 placeholder-gray-500'} 
                  border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} 
                  rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent 
                  transition-all duration-300 group-hover:bg-white/10`}
                placeholder="再次确认密码"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-violet-500 
                rounded-xl text-white font-medium hover:opacity-90 transform 
                hover:scale-[1.02] transition-all duration-300 hover:shadow-lg"
            >
              立即开启 🚀
            </button>
          </form>

          <div className="mt-6 text-center relative">
            <p className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'}>
              已经有账号了？
              <Link href="/" className="ml-1 font-medium text-pink-500 hover:text-pink-400 transition-colors">
                马上登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 