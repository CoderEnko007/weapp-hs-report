const getters = {
  openID: state => state.user.openID,
  userInfo: state => state.user.userInfo,
  series: state => state.cards.series,
  decksName: state => state.cards.decksName,
  collectedDecks: state => state.cards.collectedDecks,
  archetypeList: state => state.cards.archetypeList,
  deckTabFilter: state => state.cards.deckTabFilter,
  navHeight: state => state.settings.navHeight,
  isIphoneX: state => state.settings.isIphoneX,
  winWidth: state => state.settings.winWidth,
  winHeight: state => state.settings.winHeight,
}

export default getters
