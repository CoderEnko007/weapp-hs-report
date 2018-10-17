<script>
export default {
  data() {
    return {
      clientId: 'ec59002ba0fc4c74bf50'
    }
  },
  methods: {
    initDecksName() {
      this.$store.dispatch('getDecksName').then(res => {
        // console.log('decksname', res)
      })
    },
    initCardSeries() {
      this.$store.dispatch('getSeriesData').then(res => {
        // console.log('series', res)
      })
    }
  },
  created () {
    require('./utils/sdk-v1.8.1')
    wx.BaaS.init(this.clientId)
    // wx.BaaS = requirePlugin('sdkPlugin')
    // wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    // wx.BaaS.init(this.clientId)
    this.initDecksName()
    this.initCardSeries()
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
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.m-30 {
  margin: 0 30rpx;
}
.p-30 {
  padding: 0 30rpx;
}
.color-green {
  color: $palette-green;
}
.color-light-green {
  color: $palette-light-green;
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
.font-bold {
  font-weight: 700;
}
.clear {
  &:after {
    content:"";
    display:block;
    clear: both;
  }
}
.ads {
  ad {
    transform: scale(0.9) !important;
  }
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
.headline {
  position: relative;
  height: 21px;
  line-height: 21px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  .title {
    margin-left: 6px;
  }
  &:before {
    position: absolute;
    height: 16px;
    width: 2px;
    border-radius: 12px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    content: '';
    background: $palette-blue;
  }
}
.c-button {
  background-color: white;
  border-radius: 0;
  margin: 0;
  padding: 0;
  &:after {
    border: none;
  }
}
.grad-header-light-blue {
  background: linear-gradient(65deg,#1d3657,#bed6ff calc(100% - 120px),rgba(49,49,49,0) calc(100% - 50px),rgba(49,49,49,0));
}
.grad-header-gray {
  background: linear-gradient(65deg,#555,#eee calc(100% - 120px),rgba(49,49,49,0) calc(100% - 50px),rgba(49,49,49,0));
}
</style>
