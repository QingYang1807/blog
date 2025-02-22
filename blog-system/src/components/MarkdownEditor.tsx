'use client'

import { useEffect, useRef } from 'react'
import 'cherry-markdown/dist/cherry-markdown.css'
import Cherry from 'cherry-markdown/dist/cherry-markdown.core'
import 'cherry-markdown/dist/cherry-markdown.css';
import CherryMermaidPlugin from 'cherry-markdown/dist/addons/cherry-code-block-mermaid-plugin';
import mermaid from 'mermaid';


interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const editorRef = useRef<Cherry | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return

    // 初始化 Cherry 编辑器
    editorRef.current = new Cherry({
      id: 'cherry-markdown',
      value: value,
      editor: {
        defaultModel: 'edit&preview',
        height: '500px',
      },
      toolbars: {
        // 定义顶部工具栏
        toolbar: ['undo', 'redo', '|', 'bold','italic','strikethrough', 'size', '|','color','header','ruby','|','list', 'checklist', 'panel', 'justify', 'detail', '|', 'formula', 'insert', 'graph', 'switchModel', 'export', '|', 'publish', 'h1', 'h2', 'h3', '|', 'link', 'image', 'audio', 'video', 'formula', 'detail', '|', 'toc', '|', 'quote', 'table', 'code', 'drawIo', '|', 'fullScreen', '|', 'wordCount', '|', 'settings', '|', 'togglePreview', '|', 'mobilePreview'],
        // 定义选中文字时弹出的“悬浮工具栏”，默认为 ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color']
        bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color'],
        // 定义光标出现在行首位置时出现的“提示工具栏”，默认为 ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'table', 'code']
        float: ['h1', 'h2', 'h3', '|', 'list', 'panel', 'quote', 'table', 'code', '|', 'formula', 'detail', '|', 'undo', 'redo']
      },
      engine: {
        global: {
          urlProcessor: (url: string) => url,
        },
        syntax: {
          codeBlock: {
            lineNumber: true,
            copyCode: true,
          },
          table: {
            enableChart: false,  // 暂时禁用图表功能
          },
        }
      },
      callback: {
        afterChange: (markdown: string) => {
          onChange(markdown)
        },
      },
      fileUpload: (file: File, callback: (urls: string) => void) => {
        // TODO: 实现图片上传
        console.log('上传图片:', file)
        callback('https://example.com/image.png')
      },
      previewer: {
        dom: false,
        className: 'cherry-markdown'
      },
      locale: 'zh_CN',
    })

    return () => {
      editorRef.current?.destroy()
      editorRef.current = null
    }
  })

  // 更新编辑器内容
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value)
    }
  }, [value])

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
      <div ref={containerRef} id="cherry-markdown" className="min-h-[500px]" />
      <div className="border-t p-2 text-sm text-gray-500 bg-gray-50">
        字数统计: {value.length} | 预计阅读时间: {Math.max(1, Math.ceil(value.length / 400))} 分钟
      </div>
    </div>
  )
} 