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
@import "style/color";

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
.color-green {
  color: $palette-green;
}
.color-red {
  color: $palette-orange;
}
.float-left {
  float: left;
}
.float-right {
  float: right;
}
.header-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 5px;
  margin: 5px 0;
  padding-left: 14px;
  .header-btn {
    float: right;
    height:100%;
    line-height:60rpx;
    margin-right: 15px;
    border-radius:10px;
  }
}
.grad-header-light-blue {
  background: linear-gradient(65deg,#1d3657,#bed6ff calc(100% - 120px),rgba(49,49,49,0) calc(100% - 50px),rgba(49,49,49,0));
}
.grad-header-gray {
  background: linear-gradient(65deg,#555,#eee calc(100% - 120px),rgba(49,49,49,0) calc(100% - 50px),rgba(49,49,49,0));
}
</style>
