interface Env {
  DB: D1Database
}

export async function HandleCreatePost(request: Request, env: Env) {
  const { title, content, category, tags, authorId } = await request.json()

  try {
    const { success } = await env.DB.prepare(`
      INSERT INTO posts (title, content, category, tags, author_id, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `)
    .bind(title, content, category, JSON.stringify(tags), authorId)
    .run()

    if (!success) {
      throw new Error('数据库插入失败')
    }

    return new Response(JSON.stringify({
      success: true,
      message: '文章发布成功'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: '保存文章失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 