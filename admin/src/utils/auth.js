import Cookies from 'js-cookie'

const TokenKey = 'LWT_token'
const NameKey = 'LWT_name'
const PowerKey = 'LWT_power'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getName() {
  return Cookies.get(NameKey)
}

export function getPower() {
  return Cookies.get(PowerKey)
}

export function setToken(token, name, power) {
  Cookies.set(NameKey, name)
  Cookies.set(TokenKey, token)
  Cookies.set(PowerKey, power)
}

export function removeToken() {
  Cookies.remove(NameKey)
  Cookies.remove(TokenKey)
  Cookies.remove(PowerKey)
}
