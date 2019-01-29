import request from '@/utils/request'

export function fetchList(api, query) {
  return request({
    url: api,
    method: 'get',
    params: query
  })
}

export function createData(api, data) {
  return request({
    url: api,
    method: 'post',
    data
  })
}

export function updateData(api, data) {
  return request({
    url: api,
    method: 'put',
    data
  })
}

export function deleteData(api, data) {
  return request({
    url: api,
    method: 'delete',
    data
  })
}
