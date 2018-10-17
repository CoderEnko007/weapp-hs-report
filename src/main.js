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
    pages: ['^pages/index/main'],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '炉石传说情报站',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      selectedColor: "#433e88",
      list: [{
        pagePath: "pages/index/main",
        text: '首页',
        iconPath: "static/icons-v2/tabicon-1b.png",
        selectedIconPath: "static/icons-v2/tabicon-1a.png"
      }, {
        pagePath: "pages/trending/main",
        text: '最热套牌',
        iconPath: "static/icons-v2/tabicon-2b.png",
        selectedIconPath: "static/icons-v2/tabicon-2a.png"
      }, {
        pagePath: "pages/decks/main",
        text: '套牌',
        iconPath: "static/icons-v2/tabicon-3b.png",
        selectedIconPath: "static/icons-v2/tabicon-3a.png"
      }, {
        pagePath: "pages/cards/main",
        text: '单卡',
        iconPath: "static/icons-v2/tabicon-4b.png",
        selectedIconPath: "static/icons-v2/tabicon-4a.png"
      }, {
        pagePath: "pages/mine/main",
        text: '我的',
        iconPath: "static/icons-v2/tabicon-5b.png",
        selectedIconPath: "static/icons-v2/tabicon-5a.png"
      }]
    }
  }
}
