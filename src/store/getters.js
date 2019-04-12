const getters = {
  openID: state => state.user.openID,
  userInfo: state => state.user.userInfo,
  series: state => state.cards.series,
  decksName: state => state.cards.decksName,
  collectedDecks: state => state.cards.collectedDecks,
  archetypeList: state => state.cards.archetypeList,
  noticeContent: state => state.cards.noticeContent,
  deckTabFilter: state => state.cards.deckTabFilter,
  navHeight: state => state.settings.navHeight,
  isIphoneX: state => state.settings.isIphoneX,
  winWidth: state => state.settings.winWidth,
  winHeight: state => state.settings.winHeight,
  showBubble: state => state.settings.showBubble,
  fbiVersion: state => state.settings.fbiVersion,
  fbiKey: state => state.settings.fbiKey,
  fbiFlag: state => state.settings.fbiFlag
}

export default getters
