import {getDeckName, getSeriesData, getArchetypeList} from "@/api/dbapi";
import {getDeckList, getUserCollectionDecks, setUserCollection, cancelUserCollection} from "@/api/dbapi";

const cards = {
  state: {
    series: [],
    decksName: [],
    collectedDecks: [],
    archetypeList: [],
    activeTab: 0,
  },
  mutations: {
    SET_SERIES: (state, series) => {
      state.series = series
    },
    SET_DECKSNAME: (state, names) => {
      state.decksName = names
    },
    SET_COLLECTED_DECKS: (state, decks) => {
      state.collectedDecks = decks
    },
    ADD_COLLECTED_DECKS: (state, deck) => {
      state.collectedDecks.unshift(deck)
    },
    REMOVE_COLLECTED_DECKS: (state, deckID) => {
      for (let index in state.collectedDecks) {
        if (state.collectedDecks.hasOwnProperty(index)) {
          if (state.collectedDecks[index].deck_id === deckID) {
            state.collectedDecks.splice(index, 1)
          }
        }
      }
    },
    SET_ARCHETYPE_LIST: (state, list) => {
      state.archetypeList = list
    },
  },

  actions: {
    getSeriesData({commit, state}) {
      return new Promise((resolve, reject) => {
        getSeriesData().then(res => {
          let array = res.map(item => {
            return {
              id: item.setId,
              name: item.cname,
              mode: item.mode
            }
          })
          commit('SET_SERIES', array)
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },
    getDecksName({commit, state}) {
      return new Promise((resolve, reject) => {
        getDeckName().then(res => {
          let decksName = []
          for (let item of res) {
            decksName.push({
              'faction': item.faction,
              'ename': item.ename,
              'cname': item.cname,
              'mode': item.mode
            })
          }
          commit('SET_DECKSNAME', decksName)
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },
    getCollectedDecks({commit, state}, userID) {
      return new Promise((resolve, reject) => {
        getUserCollectionDecks(userID).then(res => {
          commit('SET_COLLECTED_DECKS', res.objects)
          resolve({list: res.objects})
        }, err => {
          reject(err)
        })
      })
    },
    addCollectedDeck({commit, state}, data) {
      return new Promise((resolve, reject) => {
        setUserCollection(data).then(res => {
          commit('ADD_COLLECTED_DECKS', data.deckDetail)
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },
    cancelCollectedDeck({commit, state}, data) {
      return new Promise((resolve, reject) => {
        cancelUserCollection(data).then(res => {
          commit('REMOVE_COLLECTED_DECKS', data.deck_id)
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    },
    getArchetypeList({commit, state}) {
      return new Promise((resolve, reject) => {
        getArchetypeList().then(res => {
          commit('SET_ARCHETYPE_LIST', res.objects)
          resolve(res.objects)
        }, err => {
          reject(err)
        })
      })
    },
  }
}

export default cards
