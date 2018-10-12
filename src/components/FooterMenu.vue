<template>
  <div class="footer-menu">
    <button open-type="share" class="share">
      <span class="icon iconfont">&#xe63b;</span>
      <span>点击分享</span>
    </button>
    <div class="like-block" v-if="showCollectBtn">
      <div class="separator" :style="{left: 125+'px'}"></div>
      <button class="like" @click="handleCollect">
        <span class="active icon iconfont" v-if="collected">&#xe601;</span>
        <span class="icon iconfont" v-else>&#xe603;</span>
        <span>收藏</span>
      </button>
      <div class="separator" :style="{right: 125+'px'}"></div>
    </div>
    <div v-else>
      <div class="separator"></div>
    </div>
    <button @click="backToHome">
      <span class="icon iconfont">&#xe615;</span>
      <span>返回首页</span>
    </button>
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
  width: 750rpx;
  border-top: 2px solid $palette-bg-gray;
  .like-block {
    width: 240rpx;
  }
  button {
    width: 240rpx;
    height: 80rpx;
    padding: 0;
    display: inline-block;
    background-color: white;
    border-radius: 0;
    font-size: 14px;
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
      border-radius: none;
    }
  }
  .separator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 40rpx;
    border-left: 2px solid $palette-bg-gray;
    z-index: 1;
  }
}
</style>
