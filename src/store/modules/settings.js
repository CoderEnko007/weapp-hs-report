const settings = {
  state: {
    navHeight: null,
    isIphoneX: false,
    winWidth: null,
    winHeight: null,
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
    }
  }
}

export default settings
