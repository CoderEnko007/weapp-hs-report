<template>
  <div class="container">
    <div class="banner">
      <img :src="logo" mode="aspectFill">
      <div class="desc">
        <p>更专业的原创内容，更全面的新闻资讯</p>
        <p>就在NGA炉石专区</p>
      </div>
    </div>
    <div class="userinfo">
      <img :src="userInfo.avatarUrl">
      <button v-if="!userInfo.openid" open-type="getUserInfo" @getuserinfo="userInfoHandler">请登录</button>
      <p v-else>{{userInfo.nickName}}</p>
    </div>
    <div class="about zan-panel">
      <div class="zan-cell zan-cell--access" @click="handleAboutClick">
        <div class="zan-cell__bd">关于小程序</div>
        <div class="zan-cell__ft"></div>
      </div>
    </div>
    <div class="collection zan-panel">
      <div class="zan-cell">
        <div class="zan-cell__bd">我的收藏</div>
      </div>
      <div class="panel panel-list">
        <DecksBoard :list="getDeckList" @itemClick="handleDeckClick"></DecksBoard>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getDeckList, getUserCollectionDecks} from "@/api/dbapi";
import DecksBoard from '@/components/DecksBoard';

export default {
  components: {
    DecksBoard,
  },
  data() {
    return {
      deckList: [],
      logo: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9QyXTPpyOMVypO.png'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
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
          console.log(res.list)
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
.container {
  background-color: #f7f7f7;
}
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
  padding: 20rpx 20rpx;
  background-color: #fff;
  button, p {
    position: absolute;
    left: 160rpx;
    top:0;
    bottom: 0;
    margin:auto;
    font-size: 14px;
    width: 150rpx;
    height: 50rpx;
    line-height: 50rpx;
    padding: 0;
    text-align: left;
    background-color: transparent;
    border: none;
  }
  button::after{
    border: none;
  }
  img {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-left: 20rpx;
  }
}
</style>
