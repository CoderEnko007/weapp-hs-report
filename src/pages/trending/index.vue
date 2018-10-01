<template>
  <div class="container">
    <div class="banner">
      <h1>热门套牌</h1>
      <p>下列是最近48小时内热度持续上升的精选套牌</p>
    </div>
    <div class="deck-list">
      <div class="deck-item">
        <DecksBoard :list="deckList" @itemClick="handleDeckClick"></DecksBoard>
      </div>
    </div>
  </div>
</template>
<script>
import {getTrendingList} from "@/api/dbapi";
import DecksBoard from '@/components/DecksBoard';

export default {
  components: {
    DecksBoard
  },
  data() {
    return {
      banner: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g5tQ1SlvhLFoEyg.jpg',
      deckList: []
    }
  },
  methods: {
    genTrendingList() {
      getTrendingList().then(res => {
        this.deckList = res.objects
        wx.stopPullDownRefresh();
      }).catch(err => {
        console.log(err)
        wx.stopPullDownRefresh();
      })
    },
    handleDeckClick(item) {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/main?id=${item.id}&trending=1`
      })
    }
  },
  mounted() {
    this.genTrendingList()
  },
  onPullDownRefresh() {
    this.genTrendingList()
  },
}
</script>
<style lang="scss" scoped>
@import '../../style/color';
.banner {
  position: fixed;
  width: 100%;
  height: 220rpx;
  overflow: hidden;
  background: url("https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g5tQ1SlvhLFoEyg.jpg") no-repeat 0 0;
  background-size: 100%;
  z-index: 1;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,.4);
    z-index: 1;
  }
  h1 {
    position: absolute;
    right: 20rpx;
    top: 75rpx;
    color: #fff;
    font-weight: 700;
    font-size: 1.4em;
    z-index: 2;
  }
  p {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    color: #fff;
    font-weight: 700;
    font-size: 0.8em;
    z-index: 2;
  }
}
.deck-list {
  width: 100%;
  padding-top: 220rpx;
  overflow: hidden;
  z-index: -1;
}
</style>
