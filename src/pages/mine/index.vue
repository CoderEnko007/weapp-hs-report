<template>
  <div class="container">
    <NavBar></NavBar>
    <div class="userinfo">
      <img :src="userInfo.avatar">
      <button v-if="!userInfo.openid" open-type="getUserInfo" @getuserinfo="userInfoHandler">点击登录</button>
      <p v-else>{{userInfo.nickname}}</p>
    </div>
    <div class="panel nga-block">
      <div class="left-block">
        <p class="text">NGA炉石专区</p>
        <p class="desc">更专业的原创内容，更全面的炉石资讯</p>
      </div>
      <div class="logo">
        <img :src="logo" mode="aspectFill">
      </div>
    </div>
    <div class="panel" @click="handleAboutClick">
      <span class="text">关于小程序</span>
      <span class="iconfont">&#xe600;</span>
    </div>
    <div class="panel" @click="handleCollectionClick">
      <span class="text">我的收藏</span>
      <span class="iconfont">&#xe600;</span>
    </div>
    <div class="code">
      <div>
        <h1 class="text">打赏作者</h1>
        <div class="capsule" @click="handleCopyBtn"><span>支付宝推广红包</span></div>
      </div>
      <img :src="codeImg" mode="aspectFill" @click="handleClickCodeImg">
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getDeckList, getUserCollectionDecks} from "@/api/dbapi";
import DecksBoard from '@/components/DecksBoard';
import NavBar from '@/components/NavBar'

export default {
  components: {
    DecksBoard,
    NavBar,
  },
  data() {
    return {
      deckList: [],
      logo: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9QyXTPpyOMVypO.png',
      codeImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9oGSrxprEojAfB.jpg',
      myAudio: null,
      audioSrc: 'http://47.98.187.217/media/sound/VO_AT_021_PLAY_01.wav'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'navHeight'
    ]),
    getDeckList() {
      return this.deckList
    }
  },
  methods: {
    userInfoHandler(data) {
      this.$store.dispatch('getUserInfo', data).then(res => {
        this.genUserCollection()
      }).catch(err => {
        console.log(err)
      })
    },
    genUserCollection() {
      if (this.userInfo.id) {
        wx.showNavigationBarLoading();
        this.$store.dispatch('getCollectedDecks', this.userInfo.id).then(res => {
          this.deckList = res.list.filter(val => {
            return !(!val || val === "");
          })
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
        }).catch(err => {
          console.log(err)
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
        })
      } else {
        wx.stopPullDownRefresh();
      }
    },
    handleDeckClick(item) {
      let url = ''
      if (item.trending) {
        url = `/pages/decks/deckDetail/main?id=${item.id}&trending=1`
      } else {
        url = `/pages/decks/deckDetail/main?id=${item.id}`
      }
      wx.navigateTo({
        url: url
      })
    },
    handleAboutClick() {
      wx.navigateTo({
        url: `/pages/mine/about/main`
      })
    },
    handleCollectionClick() {
      if (this.userInfo.id) {
        wx.navigateTo({
          url: `/pages/mine/collection/main`
        })
      } else {
        wx.showToast({
          title: '请登录',
          icon: 'none'
        })
      }
    },
    handleClickCodeImg() {
      wx.previewImage({
        urls: [this.codeImg]
      })
    },
    handleCopyBtn() {
      wx.setClipboardData({
        data: '558391916',
        success: function (res) {
          wx.showToast({
            title: '打开支付宝，首页搜索栏中直接粘贴，即可领取每日红包',
            icon: 'none',
            duration: 2500,
          })
        }
      })
      // this.myAudio.play()
    }
  },
  mounted() {
    this.myAudio = wx.createInnerAudioContext()
    this.myAudio.src = this.audioSrc
    this.myAudio.onPlay(() => {
      console.log('开始播放')
    })
    this.myAudio.onEnded(() => {
      console.log('播放结束')
    })
    this.myAudio.onError(res => {
      console.log(res.errMsg)
      console.log(res.errCode)
      console.log(res)
    })
  },
  onShow() {
    // console.log('onShow', this.$store.state.cards.collectedDecks)
    // this.deckList = this.$store.state.cards.collectedDecks
    console.log('bbb', this.userInfo)
    this.genUserCollection()
  },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/index/main'
    }
  },
  onPullDownRefresh() {
    this.genUserCollection()
  },
}
</script>
<style lang="scss" scoped>
.banner {
  position: relative;
  height: 40px;
  width: 100%;
  padding: 10rpx 0;
  background-color: #fff0cd;
  img {
    width: 100px;
    height: 100%;
    margin-left: 12px;
  }
  .desc {
    position: absolute;
    bottom: 5px;
    left: 45px;
    right: 5px;
    color: #591804;
    font-size: 12px;
    font-weight: 700;
    text-align: right;
  }
}
.userinfo {
  position: relative;
  background-color: #fff;
  button, p {
    font-size: 15px;
    height: 60rpx;
    line-height: 60rpx;
    padding: 0;
    text-align: center;
    background-color: transparent;
    border: none;
  }
  button::after{
    border: none;
  }
  img {
    display: block;
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    margin: 50rpx auto 20rpx;
  }
}
.panel {
  height: 120rpx;
  margin: 0 30rpx;
  box-sizing: border-box;
  border-bottom:1rpx solid #eee;
  .text {
    height: 42rpx;
    line-height: 120rpx;
    font-size: 15px;
  }
  .iconfont {
    float: right;
    line-height:120rpx
  }
}
.nga-block {
  position: relative;
  .left-block {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    .text {
      height: 42rpx;
      line-height: 42rpx;
      font-size: 15px;
      color: #333;
    }
    .desc {
      height: 22rpx;
      line-height: 22rpx;
      margin-top: 13rpx;
      font-size: 11px;
      color: #999;
    }
  }
  .logo {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 200rpx;
    height: 90rpx;
    background-color: #FFEFCD;
    border-radius: 12px;
    img {
      position:absolute;
      top:0;
      right:0;
      left:0;
      bottom:0;
      margin:auto;
      width: 160rpx;
      height: 63rpx;
    }
  }
}
.code {
  margin: 0 30rpx;
  box-sizing: border-box;
  h1 {
    display:inline-block;
    margin-top: 38rpx;
    margin-bottom: 24rpx;
    font-size: 15px;
    color: #333333;
  }
  img {
    display: block;
    width: 220px;
    margin: 0 auto;
  }
  .capsule {
    float: right;
    right: 0;
    height: 40rpx;
    line-height: 40rpx;
    width: 200rpx;
    padding:0 15rpx;
    font-size: 12px;
    border-radius: 20rpx;
    box-sizing: border-box;
    border: 1rpx solid red;
    text-align: center;
    margin-top:40rpx;
    color: red;
  }
}
</style>
