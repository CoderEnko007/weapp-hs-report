const getters = {
  openID: state => state.user.openID,
  userInfo: state => state.user.userInfo,
  series: state => state.cards.series
}

export default getters
