'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { 
  BiBold, BiItalic, BiStrikethrough, BiHeading, 
  BiLink, BiImage, BiListUl, BiListOl, BiCode
} from 'react-icons/bi'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [selectedText, setSelectedText] = useState('')

  const HandleToolbarAction = (type: string) => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    let newText = ''

    switch (type) {
      case 'bold':
        newText = `${text.slice(0, start)}**${text.slice(start, end) || '粗体文字'}**${text.slice(end)}`
        break
      case 'italic':
        newText = `${text.slice(0, start)}_${text.slice(start, end) || '斜体文字'}_${text.slice(end)}`
        break
      case 'heading':
        newText = `${text.slice(0, start)}### ${text.slice(start, end) || '标题'}${text.slice(end)}`
        break
      case 'link':
        newText = `${text.slice(0, start)}[${text.slice(start, end) || '链接文字'}](url)${text.slice(end)}`
        break
      case 'image':
        newText = `${text.slice(0, start)}![${text.slice(start, end) || '图片描述'}](url)${text.slice(end)}`
        break
      case 'list':
        newText = `${text.slice(0, start)}\n- ${text.slice(start, end) || '列表项'}\n${text.slice(end)}`
        break
      case 'code':
        newText = `${text.slice(0, start)}\`\`\`\n${text.slice(start, end) || '代码块'}\n\`\`\`${text.slice(end)}`
        break
    }

    onChange(newText)
  }

  const HandleQuickCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.endsWith('\n[[AI]]')) {
      e.preventDefault()
      // 调用 AI 续写功能
      HandleAIComplete()
    }
  }

  const HandleAIComplete = async () => {
    try {
      const response = await fetch('/api/ai/complete', {
        method: 'POST',
        body: JSON.stringify({ content: value.replace('\n[[AI]]', '') })
      })
      const data = await response.json()
      onChange(value.replace('\n[[AI]]', '') + '\n' + data.completion)
    } catch (error) {
      console.error('AI 续写失败:', error)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="flex justify-between border-b p-2 bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={() => HandleToolbarAction('bold')}
            className="p-2 hover:bg-gray-200 rounded"
            title="粗体 (Ctrl+B)"
          >
            <BiBold />
          </button>
          <button
            onClick={() => HandleToolbarAction('italic')}
            className="p-2 hover:bg-gray-200 rounded"
            title="斜体 (Ctrl+I)"
          >
            <BiItalic />
          </button>
          <button
            onClick={() => HandleToolbarAction('heading')}
            className="p-2 hover:bg-gray-200 rounded"
            title="标题"
          >
            <BiHeading />
          </button>
          <div className="border-r mx-2" />
          <button
            onClick={() => HandleToolbarAction('link')}
            className="p-2 hover:bg-gray-200 rounded"
            title="链接"
          >
            <BiLink />
          </button>
          <button
            onClick={() => HandleToolbarAction('image')}
            className="p-2 hover:bg-gray-200 rounded"
            title="图片"
          >
            <BiImage />
          </button>
          <button
            onClick={() => HandleToolbarAction('list')}
            className="p-2 hover:bg-gray-200 rounded"
            title="列表"
          >
            <BiListUl />
          </button>
          <button
            onClick={() => HandleToolbarAction('code')}
            className="p-2 hover:bg-gray-200 rounded"
            title="代码块"
          >
            <BiCode />
          </button>
        </div>
        <div className="flex">
          <button
            className={`px-4 py-1 rounded ${!isPreview ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setIsPreview(false)}
          >
            编辑
          </button>
          <button
            className={`px-4 py-1 rounded ml-2 ${isPreview ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setIsPreview(true)}
          >
            预览
          </button>
        </div>
      </div>

      <div className="relative">
        {!isPreview ? (
          <textarea
            className="w-full h-[500px] p-4 focus:outline-none resize-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={HandleQuickCommand}
            placeholder="在这里用 Markdown 写作...

快捷指令:
[[AI]] - AI 续写
>toc - 生成目录
@date - 插入当前日期
"
          />
        ) : (
          <div className="prose max-w-none p-4 min-h-[500px]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {value}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="border-t p-2 text-sm text-gray-500 bg-gray-50">
        字数统计: {value.length} | 预计阅读时间: {Math.max(1, Math.ceil(value.length / 400))} 分钟
      </div>
    </div>
  )
} 