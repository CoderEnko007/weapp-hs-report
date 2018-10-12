const getters = {
  openID: state => state.user.openID,
  userInfo: state => state.user.userInfo,
  series: state => state.cards.series,
  decksName: state => state.cards.decksTableID,
  collectedDecks: state => state.cards.collectedDecks,
  archetypeList: state => state.cards.archetypeList
}

export default getters
