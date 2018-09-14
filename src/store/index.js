import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cards from './modules/cards'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    cards
  },
  getters
})

export default store
