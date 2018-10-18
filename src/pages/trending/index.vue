<template>
  <div class="container">
    <div class="banner">
      <div class="meta">
        <h1>热门套牌</h1>
        <p class="date">{{updateDate}}</p>
        <p class="desc">最近48小时内热度持续上升的精选套牌</p>
      </div>
    </div>
    <div class="deck-list">
      <DeckList :list="deckList" @itemClick="handleDeckClick"></DeckList>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import {getTrendingList} from "@/api/dbapi";
import DeckList from '@/components/DeckList';

export default {
  components: {
    DeckList
  },
  data() {
    return {
      deckList: [],
      report_date: '',
      decksName: []
    }
  },
  computed: {
    updateDate() {
      if (this.report_date) {
        let formatDate = new Date(this.report_date)
        return formatDate.getMonth()+1 + '月' + formatDate.getDate() + '日更新'
      }
    },
  },
  methods: {
    formatDeckList() {
      for (let index in this.deckList) {
        if (this.deckList.hasOwnProperty(index)) {
          this.deckList[index].image = utils.faction[this.deckList[index].faction].image
          let temp = this.decksName.filter(item => {
            return item.ename === this.deckList[index].deck_name
          })
          if (temp[0] && temp[0].cname) {
            this.deckList[index].cname = temp[0].cname
          }
        }
      }
    },
    genTrendingList() {
      wx.showNavigationBarLoading();
      getTrendingList().then(res => {
        this.deckList = res.list
        this.formatDeckList()
        this.report_date = res.date
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }).catch(err => {
        console.log(err)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      })
    },
    handleDeckClick(item) {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/main?id=${item.id}&trending=1`
      })
    }
  },
  mounted() {
    this.decksName = this.$store.state.cards.decksName
    this.genTrendingList()
  },
  onPullDownRefresh() {
    this.genTrendingList()
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
@import '../../style/color';
.banner {
  position: relative;
  width: 100%;
  height: 325rpx;
  overflow: hidden;
  background: url("https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gBxG4I1yASfPkMn.jpg") no-repeat 0 0;
  background-size: 100%;
  .meta {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 64rpx;
    padding-left: 30rpx;
    color: #fff;
    box-sizing:border-box;
    h1 {
      height: 56rpx;
      line-height: 56rpx;
      font-size: 28px;
      font-weight: bold;
    }
    p.date {
      height: 44rpx;
      line-height: 44rpx;
      font-size: 13px;
      margin-top: 9rpx;
    }
    p.desc {
      position: absolute;
      height: 44rpx;
      right: 30rpx;
      bottom: 30rpx;
      font-size: 13px;
    }
  }
}
.deck-list {
  width: 100%;
  padding: 0 30rpx;
  box-sizing:border-box;
  overflow: hidden;
  z-index: -1;
}
</style>
