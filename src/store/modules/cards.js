const cards = {
  state: {
    series: []
  },
  mutations: {
    setSeries: (state, series) => {
      console.log(series)
      state.series = series
    }
  },
}

export default cards
