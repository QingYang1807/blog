'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FiChevronRight, FiGrid, FiList } from 'react-icons/fi'
import ForceGraph3D from '3d-force-graph'
import * as THREE from 'three'
import { ForceGraph3DInstance } from '3d-force-graph'

// 定义类型以避免使用 any
interface GraphNode {
  id: string
  name: string
  val: number
  color: string
}

interface GraphLink {
  source: string
  target: string
}

interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
  count?: number
  color?: string
}

const categoryData: CategoryNode = {
  id: 'root',
  name: '全部分类',
  children: [
    {
      id: 'frontend',
      name: '前端开发',
      color: '#3b82f6',
      children: [
        { id: 'react', name: 'React', count: 8, color: '#61dafb' },
        { id: 'vue', name: 'Vue', count: 6, color: '#42b883' },
        { id: 'typescript', name: 'TypeScript', count: 4, color: '#3178c6' },
      ]
    },
    {
      id: 'backend',
      name: '后端技术',
      color: '#8b5cf6',
      children: [
        { id: 'nodejs', name: 'Node.js', count: 5, color: '#68a063' },
        { id: 'python', name: 'Python', count: 3, color: '#ffd43b' },
      ]
    },
    {
      id: 'engineering',
      name: '工程实践',
      color: '#f97316',
      children: [
        { id: 'devops', name: 'DevOps', count: 7, color: '#fc6d26' },
        { id: 'testing', name: 'Testing', count: 4, color: '#8bc34a' },
      ]
    },
  ]
}

// 将树形数据转换为图谱数据
const convertToGraphData = (tree: CategoryNode) => {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []
  
  const traverse = (node: CategoryNode, parent?: string) => {
    nodes.push({
      id: node.id,
      name: node.name,
      val: node.count || 10,
      color: node.color || '#666',
    })
    
    if (parent) {
      links.push({
        source: parent,
        target: node.id,
      })
    }
    
    node.children?.forEach(child => traverse(child, node.id))
  }
  
  traverse(tree)
  return { nodes, links }
}

export default function CategoryView() {
  const [viewMode, setViewMode] = useState<'tree' | '3d'>('tree')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']))
  const graphRef = useRef<HTMLDivElement>(null)
  const graphInstanceRef = useRef<ForceGraph3DInstance>(null)

  // 处理节点展开/收起
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  // 渲染树形节点
  const renderTreeNode = (node: CategoryNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <FiChevronRight
              className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
          <div
            className={`w-2 h-2 rounded-full`}
            style={{ backgroundColor: node.color }}
          />
          <span className="flex-1">{node.name}</span>
          {node.count && (
            <span className="text-sm text-muted-foreground">{node.count}</span>
          )}
        </div>
        {isExpanded && node.children && (
          <div className="animate-slideDown">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  // 修改3D图谱初始化逻辑
  useEffect(() => {
    if (viewMode === '3d' && graphRef.current) {
      const graphData = convertToGraphData(categoryData)
      
      // 创建图谱实例
      const Graph = new ForceGraph3D()(graphRef.current)
        .graphData(graphData)
        .nodeLabel((node: GraphNode) => node.name)
        .nodeColor((node: GraphNode) => node.color)
        .linkColor(() => 'rgba(255, 255, 255, 0.2)')
        .backgroundColor('rgba(0,0,0,0)')
        .width(graphRef.current.clientWidth)
        .height(300)

      // 添加窗口大小变化监听
      const handleResize = () => {
        if (graphRef.current) {
          Graph.width(graphRef.current.clientWidth)
        }
      }

      window.addEventListener('resize', handleResize)

      // 清理函数
      return () => {
        window.removeEventListener('resize', handleResize)
        Graph.dispose()
      }
    }
  }, [viewMode])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">文章分类</h3>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'tree' ? 'bg-primary text-white' : 'hover:bg-secondary'
            }`}
            onClick={() => setViewMode('tree')}
          >
            <FiList size={18} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${
              viewMode === '3d' ? 'bg-primary text-white' : 'hover:bg-secondary'
            }`}
            onClick={() => setViewMode('3d')}
          >
            <FiGrid size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'tree' ? (
        <div key="tree" className="space-y-1">
          {renderTreeNode(categoryData)}
        </div>
      ) : (
        <div key="3d" ref={graphRef} className="w-full h-[300px]" />
      )}
    </div>
  )
} 