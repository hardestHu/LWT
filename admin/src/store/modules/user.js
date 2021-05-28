import { login } from '@/api/user'
import { getToken, setToken, removeToken, getName } from '@/utils/auth'
import { encrypt } from '@/utils/index'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getName()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const {Phone, passWord} = userInfo
    return new Promise((resolve, reject) => {
      login({phone: Phone, passWord: encrypt(passWord)}).then(res => {
        const {name} = res.data
        commit('SET_TOKEN', Phone)
        commit('SET_NAME', name)
        setToken(Phone, name)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}

