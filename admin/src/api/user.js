import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/backstage/power/login',
    method: 'post',
    data
  })
}



