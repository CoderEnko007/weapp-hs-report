const settings = {
  state: {
    navHeight: null,
    isIphoneX: false
  },
  mutations: {
    SET_NAV_HEIGHT: (state, navHeight) => {
      state.navHeight = navHeight
    },
    IS_IPHONE_X: (state) => {
      state.isIphoneX = true
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
            console.log(res)
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
    }
  }
}

export default settings
