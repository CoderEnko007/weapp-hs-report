import utils from '@/utils'

const compare = {
  state: {
    compareDeck1: null,
    compareDeck2: null
  },
  mutations:{
    setFirstDeck(state, deck) {
      state.compareDeck1 = utils.deepCopy(deck)
    },
    setSecondDeck(state, deck) {
      state.compareDeck2 = utils.deepCopy(deck)
    },
    clearDecks(state) {
      console.log('clearDecks')
      state.compareDeck1 = null
      state.compareDeck2 = null
    }
  }
}

export default compare
