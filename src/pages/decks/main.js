import Vue from 'vue'
import App from './index-v2'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    enablePullDownRefresh: true
  }
}
