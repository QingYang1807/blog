import { NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const auth = await getAuth()
    if (!auth) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { title, content, category, tags } = await request.json()

    // 验证必填字段
    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 })
    }

    // 调用 Cloudflare D1 数据库 API 存储文章
    const response = await fetch(`${process.env.WORKER_API}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        title,
        content,
        category,
        tags,
        authorId: auth.userId
      })
    })

    if (!response.ok) {
      throw new Error('保存文章失败')
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('发布文章时出错:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 