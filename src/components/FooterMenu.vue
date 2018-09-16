<template>
  <div class="footer-menu">
    <button open-type="share" class="share"><span class="icon iconfont">&#xe63b;</span>点击分享</button>
    <div class="separator"></div>
    <button @click="backToHome"><span class="icon iconfont">&#xe615;</span>返回首页</button>
  </div>
</template>
<script>
export default {
  name: 'FooterMenu',
  data() {
    return {

    }
  },
  methods: {
    backToHome() {
      wx.switchTab({
        url: '/pages/index/main'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style/color";
.footer-menu {
  position: relative;
  display: flex;
  justify-content: space-around;
  width: 750rpx;
  border-top: 2px solid $palette-bg-gray;
  button {
    width: 100%;
    height: 80rpx;
    display: inline-block;
    background-color: white;
    border-radius: none;
    font-size: 14px;
    .icon {
      color: $palette-blue;
      margin-right: 20rpx;
    }
    &:after {
      border: none;
      border-radius: none;
    }
  }
  .separator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 40rpx;
    border-left: 2px solid $palette-bg-gray;
  }
}
</style>
