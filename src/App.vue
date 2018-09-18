<script>
export default {
  data() {
    return {
      clientId: 'ec59002ba0fc4c74bf50'
    }
  },
  methods: {
    initDecksName() {
      this.$store.dispatch('getDecksName')
    }
  },
  created () {
    require('./utils/sdk-v1.7.0')
    wx.BaaS.init(this.clientId)
    this.initDecksName()
  },
}
</script>

<style lang="scss">
@import "style/zanui.wxss";

.container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
