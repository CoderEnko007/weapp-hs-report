import {login, getUserInfo, logout} from "@/api/login";

const user = {
  state: {
    openID: null,
    userInfo: {
      avatarUrl: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1fyBVjNlIfqzYgwy.png'
    }
  },

  mutations: {
    SET_OPENID: (state, id) => {
      state.openID = id
    },
    SET_USERINFO: (state, userinfo) => {
      state.userInfo = userinfo
    }
  },

  actions: {
    Login({ commit, state }) {
      return new Promise((resolve, reject) => {
        login().then(res => {
          let logged = res.openid === state.openID
          if (state.openID === null) {
            commit('SET_OPENID', res.openid)
          }
          resolve({
            'logged': logged,
            'result': res
          })
        }, err => {
          reject(err)
        })
      })
    },

    getUserInfo({ commit, state}, data) {
      return new Promise((resolve, reject) => {
        getUserInfo(data).then(res => {
          commit('SET_USERINFO', res)
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },

    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          commit('SET_OPENID', '')
          commit('SET_USERINFO', '')
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    }
  }
}

export default user
