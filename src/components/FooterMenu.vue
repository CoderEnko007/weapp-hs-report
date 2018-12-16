<template>
  <div class="footer-menu">
    <button open-type="share" class="share" :style="{width: showCollectBtn?'240rpx':'100%'}">
      <span class="icon iconfont">&#xe63b;</span>
      <span>分享给好友</span>
    </button>
    <div class="separator" v-if="showCollectBtn"></div>
    <button class="like" v-if="showCollectBtn" @click="handleCollect">
      <span class="active icon iconfont" v-if="collected">&#xe601;</span>
      <span class="icon iconfont" v-else>&#xe603;</span>
      <span>收藏套牌</span>
    </button>
    <!--<button @click="backToHome">-->
      <!--<span class="icon iconfont">&#xe615;</span>-->
      <!--<span>返回首页</span>-->
    <!--</button>-->
  </div>
</template>
<script>
export default {
  name: 'FooterMenu',
  props: ['showCollectBtn', 'collected'],
  data() {
    return {

    }
  },
  methods: {
    backToHome() {
      wx.switchTab({
        url: '/pages/index/main'
      })
    },
    handleCollect() {
      this.$emit('collectClick')
    },
    activeCollectIcon() {
      this.collected = true
    },
    deactiveCollectIcon() {
      this.collected = false
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
  flex-wrap: nowrap;
  width: 750rpx;
  border-top: 1rpx solid $palette-bg-gray;
  background-color: #fff;
  border-bottom:1rpx solid $palette-bg-gray;
  .like-block {
    height: 80rpx;
    width: 240rpx;
  }
  button {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    padding: 0;
    display: inline-block;
    background-color: white;
    border-radius: 0;
    font-size: 13px;
    .icon {
      font-size: 16px;
      color: $palette-blue;
      margin-right: 20rpx;
    }
    .active {
      color: red;
    }
    &:after {
      border: none;
      border-radius: 0;
    }
  }
  .separator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 40rpx;
    border-left: 1rpx solid $palette-bg-gray;
    z-index: 1;
  }
}
</style>
