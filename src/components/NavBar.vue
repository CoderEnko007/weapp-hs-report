<template>
  <div class="nav-container" :style="{'min-height': isIphoneX?90+'px':66+'px'}">
    <div class="nav-bar" :style="{height: navHeight+'px'}">
      <div class="nav-title" >
        <span class="title" v-if="navTitle">{{navTitle}}</span>
        <span class="title" v-else>{{defaultTitle}}</span>
      </div>
      <div class="btn-group" v-if="showCapsule">
        <div class="nav-capsule">
          <div class="nav-back" @click="handleBack">
            <img :src="backImg" mode='aspectFill'>
          </div>
          <div class="separator"></div>
          <div class="nav-home" @click="handleHome">
            <img :src="homeImg" mode='aspectFill'>
          </div>
        </div>
      </div>
    </div>
    <div :style="{'height': navHeight+'px'}"></div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'NavBar',
  props: ['showCapsule', 'navTitle'],
  data() {
    return {
      defaultTitle: '炉石传说情报站',
      backImg: '/static/icons-v2/back.png',
      homeImg: '/static/icons-v2/home.png'
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'isIphoneX'
    ])
  },
  methods: {
    handleBack() {
      let pages = getCurrentPages(); // 当前页面
      let beforePage = pages[pages.length - 2]; // 前一个页面
      // if (beforePage.route === 'pages/decks/archetypeDetail/main') {
      //   console.log('aaa', beforePage.options)
      //   beforePage.setData({
      //     archetypeName: beforePage.options.name
      //   })
      // } else if (beforePage.route === 'pages/decks/deckDetail/main') {
      //   console.log('bb', beforePage.options)
      //   beforePage.setData({
      //     deckID: beforePage.options.deckID
      //   })
      // }
      // console.log(beforePage)
      let _this = this
      if (beforePage === undefined) {
        wx.switchTab({
          url: '/pages/index/main',
          success: function() {
            _this.$emit('navBackHome')
          }
        })
      } else {
        wx.navigateBack({
          success: function() {
            _this.$emit('navBack')
            if (beforePage.route === 'pages/decks/archetypeDetail/main'
              || beforePage.route === 'pages/decks/deckDetail/main') {
              // beforePage.onReady()
            }
          }
        })
      }
    },
    handleHome() {
      let _this = this
      wx.switchTab({
        url: '/pages/index/main',
        success: function() {
          _this.$emit('navBackHome')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-bar {
  position: fixed !important;
  min-height: 46px;
  width: 100%;
  top: 0;
  background: #fff;
  color: #000000;
  z-index: 999;
  .nav-title {
    position: absolute;
    /*position:relative;*/
    height:100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 400rpx;
    text-align: center;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 12px;
      display: inline;
    }
  }
  .btn-group {
    position: relative;
    height: 100%;
    width: 174rpx;
    animation: fadeIn 0.5s;
    .nav-capsule {
      position: absolute;
      left: 15rpx;
      bottom: 18rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 64rpx;
      border: 1rpx solid #ECECEC;
      border-radius: 16px;
      padding:0 12rpx;
      box-sizing:border-box;
    }
    .separator {
      width: 1px;
      height: 32rpx;
      background-color: #e5e5e5;
    }
    .nav-back, .nav-home {
      display: flex;
      width:56rpx;
      height:56rpx;
      text-align: center;
      img {
        width: 32rpx;
        height: 36rpx;
        margin: auto;
      }
    }
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
