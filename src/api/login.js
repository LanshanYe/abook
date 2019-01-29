import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/info',
    method: 'get'
  })
}

