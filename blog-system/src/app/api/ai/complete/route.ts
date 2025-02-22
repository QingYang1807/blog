import { NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const auth = await getAuth()
    if (!auth) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { content } = await request.json()

    const response = await fetch(`${process.env.WORKER_API}/ai/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({ content })
    })

    if (!response.ok) {
      throw new Error('AI 续写失败')
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('AI 续写出错:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 