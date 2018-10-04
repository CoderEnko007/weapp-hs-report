<template>
  <div class="container">
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
          this.deckList = res.list
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
        }).catch(err => {
          console.log(err)
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh();
        })
      }
    },
    handleDeckClick(item) {
      console.log('handleDeckClick', item.id)
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
    console.log(this.deckList)
    this.genUserCollection()
  },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/index/main'
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
}
.userinfo {
  position: relative;
  padding: 50rpx 20rpx;
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
