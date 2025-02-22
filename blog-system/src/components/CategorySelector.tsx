'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FiChevronRight, FiList, FiGrid } from 'react-icons/fi'
import * as d3 from 'd3'

// 定义类型
interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
  count?: number
  color?: string
}

interface CategorySelectorProps {
  onCategorySelect: (categories: string[]) => void
  selectedCategories: string[]
}

// 分类数据
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

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  count: number
  color: string
  x?: number
  y?: number
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode
  target: string | GraphNode
}

export default function CategorySelector({ onCategorySelect, selectedCategories }: CategorySelectorProps) {
  const [viewMode, setViewMode] = useState<'tree' | 'graph'>('tree')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']))
  const svgRef = useRef<SVGSVGElement>(null)

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

  // 处理分类选择
  const HandleCategorySelect = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    onCategorySelect(newSelected)
  }

  // 渲染树形节点
  const renderTreeNode = (node: CategoryNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const isSelected = selectedCategories.includes(node.id)

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer
            ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id)
            }
            HandleCategorySelect(node.id)
          }}
        >
          {hasChildren && (
            <FiChevronRight
              className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: node.color }}
          />
          <span className="flex-1">{node.name}</span>
          {node.count && (
            <span className="text-sm text-gray-500">{node.count}</span>
          )}
          {isSelected && (
            <span className="text-blue-500">✓</span>
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

  // 将树形数据转换为图谱数据
  const convertToGraphData = (tree: CategoryNode) => {
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []
    
    const traverse = (node: CategoryNode, parent?: string) => {
      nodes.push({
        id: node.id,
        name: node.name,
        count: node.count || 10,
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
    
    traverse(categoryData)
    return { nodes, links }
  }

  // 渲染知识图谱
  useEffect(() => {
    if (viewMode !== 'graph' || !svgRef.current) return

    // 清除旧的内容
    d3.select(svgRef.current).selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = isFullscreen ? window.innerHeight - 100 : 500
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom)

    const container = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const graphData = convertToGraphData(categoryData)

    const simulation = d3.forceSimulation<GraphNode>(graphData.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(graphData.links)
        .id(d => d.id)
        .distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    const links = container.append('g')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 1)

    // 创建节点组
    const nodes = container.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(graphData.nodes)
      .join('g')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.stopPropagation()
        // 固定被点击的节点位置
        d.fx = d.x
        d.fy = d.y
        HandleCategorySelect(d.id)
      })

    // 添加节点背景
    nodes.append('rect')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', 'white')
      .attr('stroke', d => selectedCategories.includes(d.id) ? '#3b82f6' : d.color)
      .attr('stroke-width', d => selectedCategories.includes(d.id) ? 3 : 2)
      .attr('width', d => d.name.length * 14 + 20)
      .attr('height', 28)
      .attr('x', d => -(d.name.length * 14 + 20) / 2)
      .attr('y', -14)

    // 添加节点文本
    nodes.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#1a1a1a')
      .attr('font-size', '14px')
      .attr('font-weight', d => selectedCategories.includes(d.id) ? '600' : '400')

    simulation.on('tick', () => {
      links
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!)

      nodes.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [viewMode, selectedCategories, isFullscreen])

  // 全屏预览模态框
  const FullscreenModal = () => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={() => setIsFullscreen(false)}
    >
      <div 
        className="bg-white rounded-lg p-6 w-[90vw] h-[90vh] relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsFullscreen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="w-full h-full">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* 视图切换按钮 */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium">分类</h3>
        <div className="flex gap-2">
          <button
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'tree' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setViewMode('tree')}
          >
            <FiList size={18} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'graph' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setViewMode('graph')}
          >
            <FiGrid size={18} />
          </button>
          {viewMode === 'graph' && (
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsFullscreen(true)}
              title="全屏查看"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5m-7 11h4m-4 0v4m0 0l5-5m5 5v-4m0 4h-4m0 0l-5-5" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 视图内容 */}
      {viewMode === 'tree' ? (
        <div className="space-y-1 h-[500px] overflow-auto">
          {renderTreeNode(categoryData)}
        </div>
      ) : (
        <div className="w-full h-[500px] border rounded-lg overflow-hidden">
          <svg ref={svgRef} className="w-full" />
        </div>
      )}

      {/* 全屏预览模态框 */}
      {isFullscreen && <FullscreenModal />}
    </div>
  )
} 