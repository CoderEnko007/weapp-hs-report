import {login, getUserInfo, logout} from "@/api/login";

const user = {
  state: {
    openID: null,
    userInfo: {
      avatar: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1fyBVjNlIfqzYgwy.png'
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
          return {
            logged: logged,
            data: res
          }
        }).then(res => {
          let MyUser = new wx.BaaS.User()
          MyUser.get(res.data.id).then(res => {
            if (res.data.is_authorized) {
              commit('SET_USERINFO', res.data)
            }
          })
          resolve({
            'logged': res.logged,
            'result': res
          })
        }).catch(err => {
          reject(err)
        })
      })
    },

    getUserInfo({ commit, state}, data) {
      return new Promise((resolve, reject) => {
        getUserInfo(data).then(res => {
          return res.id
        }).then(id => {
          let MyUser = new wx.BaaS.User()
          MyUser.get(id).then(res => {
            commit('SET_USERINFO', res.data)
            resolve(res)
          })
        }).catch(err => {
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
