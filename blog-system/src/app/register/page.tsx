'use client'

import React from 'react'
import Link from 'next/link'
import { useCallback } from 'react'
import type { Container, Engine } from 'tsparticles-engine'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function RegisterPage() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#ffffff",
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 3,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 40,
            },
            opacity: {
              value: 0.4,
              random: true,
            },
            shape: {
              type: ["circle", "star", "triangle"],
            },
            size: {
              value: { min: 1, max: 3 },
              random: true,
            },
            twinkle: {
              particles: {
                enable: true,
                frequency: 0.05,
                opacity: 0.8,
              },
            },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 -z-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-sm relative">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 relative overflow-hidden hover:shadow-2xl transition-all duration-300">
          {/* 悬浮效果装饰 */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 rounded-full blur-2xl"></div>

          <div className="text-center mb-6 relative">
            <Link 
              href="/" 
              className="text-2xl font-bold text-white hover:text-pink-200 transition-colors"
            >
              <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
                TechBlog
              </span>
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-white">
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
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                placeholder="为自己取个酷名字吧"
              />
            </div>

            <div className="group">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                placeholder="输入你的邮箱"
              />
            </div>

            <div className="group">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                placeholder="设置一个安全的密码"
              />
            </div>

            <div className="group">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                placeholder="再次确认密码"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl text-white font-medium hover:opacity-90 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg"
            >
              立即开启 🚀
            </button>
          </form>

          <div className="mt-6 text-center relative">
            <p className="text-white/70">
              已经有账号了？
              <Link href="/" className="ml-1 font-medium text-pink-300 hover:text-pink-200 transition-colors">
                马上登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 