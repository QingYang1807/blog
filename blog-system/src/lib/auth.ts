import Cookies from 'js-cookie'

interface AuthInfo {
  token: string
  userId: string
  username: string
}

export async function getAuth(): Promise<AuthInfo | null> {
  const userInfoStr = Cookies.get('userInfo')
  if (!userInfoStr) return null

  try {
    const userInfo = JSON.parse(userInfoStr)
    const token = Cookies.get('token')
    
    if (!token) return null

    return {
      token,
      userId: userInfo.id || '',
      username: userInfo.username
    }
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return null
  }
}

export async function setAuth(token: string, userInfo: string) {
  Cookies.set('token', token)
  Cookies.set('userInfo', JSON.stringify(userInfo))
}

export async function removeAuth() {
  Cookies.remove('token')
  Cookies.remove('userInfo')
} 