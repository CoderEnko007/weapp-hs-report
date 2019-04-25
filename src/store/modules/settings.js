import { getSetting, getArenaConfig } from "../../api/dbapi";

const settings = {
  state: {
    navHeight: null,
    isIphoneX: false,
    winWidth: null,
    winHeight: null,
    showBubble: true,
    fbiVersion: null,
    fbiKey: null,
    fbiFlag: true,
    arenaTableID: null,
  },
  mutations: {
    SET_NAV_HEIGHT: (state, navHeight) => {
      state.navHeight = navHeight
    },
    IS_IPHONE_X: (state) => {
      state.isIphoneX = true
    },
    SET_WIN_WIDTH: (state, val) => {
      state.winWidth = val
    },
    SET_WIN_HEIGHT: (state, val) => {
      state.winHeight = val
    },
    SET_FBI_VERSION: (state, val) => {
      state.fbiVersion = val
    },
    SET_FBI_KEY: (state, val) => {
      state.fbiKey = val
    },
    SET_FBI_FLAG: (state, val) => {
      state.fbiFlag = val
    },
    setShowBubbleFlag: (state, val) => {
      state.showBubble = val
    },
    SET_ARENA_TABLEID: (state, val) => {
      state.arenaTableID = val
    }
  },
  actions: {
    setNavHeight({commit, state}) {
      return new Promise((resolve, reject) => {
        wx.getSystemInfo({
          success: res => {
            //导航高度
            let navHeight = res.statusBarHeight + 46;
            // let navHeight = res.statusBarHeight*2+25
            commit('SET_NAV_HEIGHT', navHeight)
            if (res.model === 'iPhone X') {
              commit('IS_IPHONE_X')
            }
            resolve(navHeight)
          }, fail(err) {
            console.log(err);
            reject(err)
          }
        })
      })
    },
    setWinWidthHeight({commit, state}) {
      return new Promise((resolve, reject) => {
        wx.getSystemInfo({
          success: res => {
            commit('SET_WIN_WIDTH', res.windowWidth)
            commit('SET_WIN_HEIGHT', res.windowHeight)
            resolve()
          }, fail(err) {
            console.log(err)
            reject(err)
          }
        })
      })
    },
    setSystemSetting({commit, state}) {
      return new Promise((resolve, reject) => {
        getSetting().then(res => {
          commit('SET_FBI_VERSION', res.objects[0].fbi_version)
          commit('SET_FBI_KEY', res.objects[0].fbi_key)
          commit('SET_FBI_FLAG', res.objects[0].fbi_card_switch)
          commit('SET_ARENA_TABLEID', res.objects[0].arena_table_id)
          resolve(res.objects)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
  }
}

export default settings
