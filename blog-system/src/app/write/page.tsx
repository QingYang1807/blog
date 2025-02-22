'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { 
  FiSave, 
  FiEye, 
  FiClock, 
  FiGlobe, 
  FiCalendar,
  FiMessageSquare
} from 'react-icons/fi'
import CategorySelector from '@/components/CategorySelector'

const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), {
  ssr: false
})

interface PostStatus {
  type: 'draft' | 'published' | 'scheduled'
  visibility: 'public' | 'private' | 'password'
  scheduledTime?: Date
  password?: string
}

export default function WritePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [status, setStatus] = useState<PostStatus>({
    type: 'draft',
    visibility: 'public'
  })
  const [allowComments, setAllowComments] = useState(true)
  const [requireModeration, setRequireModeration] = useState(false)

  const HandleSaveDraft = async () => {
    // 保存草稿逻辑
  }

  const HandlePublish = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          categories: selectedCategories,
          tags,
          status,
          allowComments,
          requireModeration
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        throw new Error('发布失败')
      }
    } catch (error) {
      console.error('发布文章时出错:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 主编辑区 */}
      <div className="flex-1 p-4">
        <input
          type="text"
          placeholder="在此输入标题..."
          className="w-full text-4xl font-bold mb-8 p-4 border-0 bg-transparent focus:outline-none focus:ring-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <MarkdownEditor 
          value={content}
          onChange={setContent}
        />
      </div>

      {/* 右侧控制面板 */}
      <div className="w-80 border-l bg-white p-4 space-y-6">
        {/* 发布面板 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">发布</h3>
            <div className="flex gap-2">
              <button
                onClick={HandleSaveDraft}
                className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-100"
              >
                <FiSave size={14} />
                保存草稿
              </button>
              <button
                onClick={() => {}}
                className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-100"
              >
                <FiEye size={14} />
                预览
              </button>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FiClock size={14} />
                状态
              </span>
              <select
                value={status.type}
                onChange={(e) => setStatus({ ...status, type: e.target.value as 'draft' | 'published' | 'scheduled' })}
                className="border rounded px-2 py-1"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="scheduled">计划发布</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FiGlobe size={14} />
                可见性
              </span>
              <select
                value={status.visibility}
                onChange={(e) => setStatus({ ...status, visibility: e.target.value as 'public' | 'private' | 'password' })}
                className="border rounded px-2 py-1"
              >
                <option value="public">公开</option>
                <option value="private">私密</option>
                <option value="password">密码保护</option>
              </select>
            </div>

            {status.type === 'scheduled' && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FiCalendar size={14} />
                  发布时间
                </span>
                <input
                  type="datetime-local"
                  className="border rounded px-2 py-1"
                  onChange={(e) => setStatus({ ...status, scheduledTime: new Date(e.target.value) })}
                />
              </div>
            )}
          </div>

          <button
            onClick={HandlePublish}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <FiSave size={16} />
            {status.type === 'scheduled' ? '计划发布' : '立即发布'}
          </button>
        </div>

        {/* 分类面板 */}
        <div className="border rounded-lg p-4">
          <CategorySelector 
            onCategorySelect={(categories) => setSelectedCategories(categories)}
            selectedCategories={selectedCategories}
          />
        </div>

        {/* 标签面板 */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">标签</h3>
          <input
            type="text"
            placeholder="输入标签，按回车添加"
            className="w-full p-2 border rounded mb-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                setTags([...tags, e.currentTarget.value])
                e.currentTarget.value = ''
              }
            }}
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 评论设置面板 */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <FiMessageSquare size={14} />
            评论设置
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
              />
              允许评论
            </label>
            {allowComments && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requireModeration}
                  onChange={(e) => setRequireModeration(e.target.checked)}
                />
                评论需要审核
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 