const getters = {
  openID: state => state.user.openID,
  userInfo: state => state.user.userInfo,
  series: state => state.cards.series,
  decksName: state => state.cards.decksName,
  collectedDecks: state => state.cards.collectedDecks,
  archetypeList: state => state.cards.archetypeList,
  navHeight: state => state.settings.navHeight,
  isIphoneX: state => state.settings.isIphoneX
}

export default getters
