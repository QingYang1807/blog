import axios from 'axios'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('开始注册...')
  try {
    const body = await request.json()
    console.log('注册信息:', body)

    // 添加基本的输入验证
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { code: 400, message: '请填写所有必需的字段' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.linqingyang.com/blog/api/v1/db/users/add', {  
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    console.log(response)
    // return NextResponse.json(response.data)
    return NextResponse.json({
      code: 200,
      message: '注册成功',
      data: response.message
    })
  } catch (error) {
    console.error('注册处理错误:', error)
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: error.response?.data?.message || '注册服务暂时不可用，请稍后重试',
          details: error.message
        },
        { status: error.response?.status || 503 }
      )
    }
    
    return NextResponse.json(
      { error: '注册服务暂时不可用，请稍后重试' },
      { status: 503 }
    )
  }
} 