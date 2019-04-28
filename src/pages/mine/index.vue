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
    <div class="panel" @click="handleCollectionClick">
      <span class="text">我的收藏</span>
      <span class="iconfont arrowIcon">&#xe600;</span>
    </div>
    <div class="panel" @click="handleAboutClick">
      <span class="text">关于小程序</span>
      <span class="iconfont arrowIcon">&#xe600;</span>
    </div>
    <div class="panel" @click="handleVideoClick">
      <span class="iconfont playIcon">&#xe697;</span>
      <span class="text" style="margin-left:5px;">点击播放激励视频给作者加鸡腿（6～15秒）</span>
    </div>
    <div class="code">
      <h1 class="text">赞赏作者</h1>
      <div class="capsule" @click="handleCopyBtn"><span>支付宝推广红包</span></div>
      <div class="content" @click="handleClickCodeImg">
        <p>「炉石传说情报站」小程序由个人独立开发，源于兴趣，旨在免费为大家提供及时的卡组数据。</p>
        <p>您的赞赏和每一次广告点击获得的收入将用于支付昂贵的服务器费用，结余部分就当各位请我吃辣条了，嘿嘿。</p>
        <p style="font-weight: bold">点击此处打开赞赏码，长按扫描即可</p>
      </div>
    </div>
    <div class="feedback">
      <button open-type="feedback">问题反馈 | 意见建议</button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getDeckList, getUserCollectionDecks, addCustomerSetting, getCustomerSetting, updateCustomerSetting} from "@/api/dbapi";
import DecksBoard from '@/components/DecksBoard';
import NavBar from '@/components/NavBar'

export default {
  components: {
    DecksBoard,
    NavBar,
  },
  data() {
    return {
      videoAd: null,
      showVideoAdBtn: true,
      deckList: [],
      logo: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9QyXTPpyOMVypO.png',
      codeImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9oGSrxprEojAfB.jpg',
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
            title: '打开支付宝，首页搜索栏中直接粘贴，即可领取每日红包，金额随机',
            icon: 'none',
            duration: 2500,
          })
        }
      })
    },
    async handleVideoClick() {
      let videoAdUseable = true//wx.canIUse('createRewardedVideoAd')
      if (videoAdUseable) {
        if (this.videoAd) {
          this.videoAd.show().catch(() => {
            // 失败重试
            this.videoAd.load()
              .then(() => videoAd.show())
              .catch(err => {
                console.log('激励视频 广告显示失败', err)
              })
          })
        }
      } else {
        wx.showToast({
          title: '微信版本过低，无法播放激励视频',
          icon: 'none',
          duration: 2500
        })
      }
    }
  },
  onLoad() {
    if (wx.createRewardedVideoAd) {
      this.videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-e8e54c4290dbf4ad'
      })
      this.videoAd.onClose(async (status) => {
        console.log('激励视频关闭', status)
        if (status && status.isEnded || status === undefined) {
          let res = await getCustomerSetting(this.userInfo.id)
          console.log(res)
          let temp = ''
          if (res.meta.total_count > 0) {
            let ad_click_num = res.objects[0].ad_click_num + 1
            temp = await updateCustomerSetting({
              ad_click_num: ad_click_num,
            }, res.objects[0].id)
          } else {
            temp = await addCustomerSetting({}, this.userInfo.id)
          }
          console.log(temp)
          let now = new Date()
          try {
            wx.setStorageSync('ads_video_date', new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()/1000)
          } catch (e) {
            console.log(e)
          }
          wx.showToast({
            title: '感谢！',
            icon: 'none',
            duration: 2500
          })
        } else {
          wx.showToast({
            title: '没有完整播放视频哦，喵。。。',
            icon: 'none',
            duration: 2500
          })
        }
      })
      this.videoAd.onError((res) => {
        console.log('激励视频错误', res)
      })
    }
  },
  onShow() {
    // console.log('onShow', this.$store.state.cards.collectedDecks)
    // this.deckList = this.$store.state.cards.collectedDecks
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
@import '../../style/color';
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
  .arrowIcon {
    float: right;
    line-height:120rpx
  }
  .playIcon {
    font-size: 20px;
    line-height: 120rpx;
    vertical-align: middle;
    display: inline-block;
    /*margin-left: 5px;*/
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
  margin: 30rpx 30rpx 0;
  box-sizing: border-box;
  border-radius: 24rpx;
  background: #f8f8fc;
  padding: 30rpx;
  p {
    font-size: 24rpx;
    line-height:22px;
  }
  h1 {
    display:inline-block;
    /*margin-top: 38rpx;*/
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
    display: inline-block;
    /*float: right;*/
    /*right: 0;*/
    width: 200rpx;
    height: 40rpx;
    line-height: 40rpx;
    padding:0 15rpx;
    margin-left:300rpx;
    font-size: 12px;
    border-radius: 20rpx;
    box-sizing: border-box;
    border: 1rpx solid red;
    text-align: center;
    /*margin-top:13rpx;*/
    color: red;
  }
}
.feedback {
  margin: 5px 5px 10px;
  button {
    font-size: 12px;
    color: $palette-blue-normal;
    text-align:center;
    background-color: transparent;
    border: none;
    &:after {
      border: none;
    }
  }
}
</style>
