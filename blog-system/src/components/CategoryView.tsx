'use client'

import React, { useEffect, useRef } from 'react'
import { FiChevronRight, FiGrid, FiList } from 'react-icons/fi'
import * as d3 from 'd3'
import LoginCard from './LoginCard'
import Cookies from 'js-cookie'

// 定义类型
interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
  count?: number
  color?: string
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

interface User {
  name: string
  avatar: string
  badges: {
    id: string
    name: string
    icon: string
  }[]
}

interface LoginForm {
  username: string
  password: string
}

interface RegisterForm extends LoginForm {
  email: string
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

// 添加示例用户数据
const mockUser: User = {
  name: "张三",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  badges: [
    { id: "1", name: "精选作者", icon: "🏆" },
    { id: "2", name: "活跃用户", icon: "⭐" }
  ]
}

// 在 mockUser 后添加模拟 API 函数
const mockApi = {
  login: async (form: LoginForm): Promise<User | null> => {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (form.username === 'demo' && form.password === 'password') {
      return mockUser
    }
    return null
  },
  
  register: async (form: RegisterForm): Promise<User | null> => {
    // 模拟 API 调用
    console.log(form)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockUser
  }
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
  
  traverse(tree)
  return { nodes, links }
}

// 知识图谱组件
function KnowledgeGraph({ data }: { data: { nodes: GraphNode[], links: GraphLink[] } }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // 清除旧的内容
    d3.select(svgRef.current).selectAll('*').remove()

    // 设置画布尺寸和边距
    const width = svgRef.current.clientWidth
    const height = 400
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    // 创建SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // 创建缩放和平移行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom)

    // 创建容器组
    const container = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // 创建力导向模拟
    const simulation = d3.forceSimulation<GraphNode>(data.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(data.links)
        .id(d => d.id)
        .distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    // 绘制连线
    const links = container.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 1)

    // 创建节点组
    const nodes = container.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // 添加节点背景
    nodes.append('rect')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', 'white')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
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
      .attr('font-weight', '500')

    // 更新力导向布局
    simulation.on('tick', () => {
      links
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!)

      nodes.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    // 拖拽函数
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

    // 清理函数
    return () => {
      simulation.stop()
    }
  }, [data])

  return <svg ref={svgRef} className="w-full" />
}

// 修改 CategoryView 组件接收 props
interface CategoryViewProps {
  userInfo: { username: string; avatar?: string } | null;
  onLogout: () => void;
}

export default function CategoryView({ userInfo, onLogout }: CategoryViewProps) {
  const [viewMode, setViewMode] = React.useState<'tree' | 'graph'>('tree')
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set(['root']))
  const [isLoading, setIsLoading] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)

  // 处理登录
  const HandleLogin = async (form: LoginForm) => {
    try {
      setIsLoading(true)
      const userData = await mockApi.login(form)
      if (userData) {
        // 保存登录状态到 Cookie
        Cookies.set('userInfo', JSON.stringify({
          username: form.username,
          avatar: userData.avatar
        }))
        setUser(userData)
        window.location.reload() // 刷新页面以更新所有组件
      }
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 更新 useEffect，使用传入的 userInfo
  useEffect(() => {
    if (userInfo) {
      setUser({
        name: userInfo.username,
        avatar: userInfo.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        badges: [
          { id: "1", name: "精选作者", icon: "🏆" },
          { id: "2", name: "活跃用户", icon: "⭐" }
        ]
      })
    }
  }, [userInfo])

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
            className="w-2 h-2 rounded-full"
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

  // 准备图谱数据
  const graphData = convertToGraphData(categoryData)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      {user ? (
        <div className="mb-4 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-primary cursor-pointer"
                onClick={onLogout}
                title="点击退出登录"
              />
              <div>
                <h4 className="font-medium text-lg">{user.name}</h4>
                <div className="flex gap-2 mt-1">
                  {user.badges.map(badge => (
                    <span 
                      key={badge.id}
                      className="inline-flex items-center gap-1 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {badge.icon} {badge.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoginCard onLogin={HandleLogin} isLoading={isLoading} />
      )}

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
              viewMode === 'graph' ? 'bg-primary text-white' : 'hover:bg-secondary'
            }`}
            onClick={() => setViewMode('graph')}
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
        <div key="graph" className="w-full h-[400px]">
          <KnowledgeGraph data={graphData} />
        </div>
      )}
    </div>
  )
} 