import Vue from 'vue'
import App from './App'
import store from '@/store'

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/cards/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '炉石传说情报站',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      selectedColor: "#910302",
      list: [{
        pagePath: "pages/index/main",
        text: '首页',
        iconPath: "static/icons/main.png",
        selectedIconPath: "static/icons/main_active.png"
      }, {
        pagePath: "pages/rank/main",
        text: '排行榜',
        iconPath: "static/icons/rank.png",
        selectedIconPath: "static/icons/rank_active.png"
      }, {
        pagePath: "pages/decks/main",
        text: '套牌',
        iconPath: "static/icons/decks.png",
        selectedIconPath: "static/icons/decks_active.png"
      }, {
        pagePath: "pages/cards/main",
        text: '单卡',
        iconPath: "static/icons/cards.png",
        selectedIconPath: "static/icons/cards_active.png"
      }, {
        pagePath: "pages/mine/main",
        text: '我的',
        iconPath: "static/icons/mine.png",
        selectedIconPath: "static/icons/mine_active.png"
      }]
    },
    "plugins": {
      "sdkPlugin": {
        "version": "0.1.0",
        "provider": "wxc6b86e382a1e3294"
      }
    }
  }
}
