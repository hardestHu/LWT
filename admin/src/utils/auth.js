import Cookies from 'js-cookie'

const TokenKey = 'LWT_token'
const NameKey = 'LWT_name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getName() {
  return Cookies.get(NameKey)
}

export function setToken(token, name) {
  Cookies.set(NameKey, name)
  Cookies.set(TokenKey, token)
}

export function removeToken() {
  Cookies.remove(NameKey)
  Cookies.remove(TokenKey)
}
