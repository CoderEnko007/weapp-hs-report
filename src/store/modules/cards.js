import {getDeckName} from "@/api/dbapi";

const cards = {
  state: {
    series: [],
    decksName: []
  },
  mutations: {
    setSeries: (state, series) => {
      state.series = series
    },
    SET_DECKSNAME: (state, names) => {
      state.decksName = names
    }
  },

  actions: {
    getDecksName({commit, state}) {
      return new Promise((resolve, reject) => {
        getDeckName().then(res => {
          let decksName = []
          for (let item of res) {
            decksName.push({
              'faction': item.faction,
              'ename': item.ename,
              'cname': item.cname
            })
          }
          commit('SET_DECKSNAME', decksName)
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    }
  }
}

export default cards
