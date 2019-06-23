import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cards from './modules/cards'
import settings from './modules/settings'
import compare from './modules/compare'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    cards,
    settings,
    compare
  },
  getters
})

export default store
