'use client'

import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'

export default function Announcement() {
  const [show, setShow] = useState(true)

  if (!show) return null

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          📢 公告
        </h2>
        <button 
          onClick={() => setShow(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <p>这里是公告内容，可以放置重要信息、个人介绍等。</p>
      </div>
    </div>
  )
} 