<template>
<div class="container">
  <NavBar :showCapsule="true"></NavBar>
  <div v-if="collectionList.length>0">
    <div class="deck-list" v-for="(item, index) in collectionList" :key="index">
      <div class="header"><p class="date">{{item.format_time}}</p></div>
      <DeckList :list="item.list" @itemClick="handleDeckClick"></DeckList>
    </div>
  </div>
  <div class="tips" v-else>
    <h1 class="noData">还没有收藏的卡组哦</h1>
  </div>
</div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import DeckList from '@/components/DeckList';
import NavBar from '@/components/NavBar'

export default {
  components: {
    DeckList,
    NavBar
  },
  data() {
    return {
      deckList: [],
      collectionList: []
    }
  },
  computed: {
    ...mapGetters([
      'collectedDecks',
      'navHeight',
      'userInfo',
      'decksName'
    ]),
  },
  methods: {
    formatDeckList() {
      this.collectionList = []
      for (let index in this.deckList) {
        if (this.deckList.hasOwnProperty(index)) {
          this.deckList[index].image = utils.faction[this.deckList[index].faction].image
          let temp = this.decksName.filter(item => {
            return item.ename === this.deckList[index].deck_name
          })
          if (temp[0] && temp[0].cname) {
            this.deckList[index].cname = temp[0].cname
          } else {
            this.deckList[index].cname = this.deckList[index].deck_name
          }
        }

        let temp = this.collectionList.filter(val => {
          return parseInt(this.deckList[index].created_at/10000) === parseInt(val.created_at/10000)
        })
        if (temp.length <= 0) {
          console.log(this.deckList[index].created_at)
          this.collectionList.push({
            created_at: this.deckList[index].created_at,
            format_time: utils.formatTime(new Date(this.deckList[index].created_at*1000)),
            list: [this.deckList[index]]
          })
        } else {
          temp[0].list.push(this.deckList[index])
        }
      }
    },
    genUserCollection() {
      wx.showNavigationBarLoading();
      this.$store.dispatch('getCollectedDecks', this.userInfo.id).then(res => {
        this.deckList = res.list.filter(val => {
          return !(!val || val === "");
        })
        console.log(this.deckList)
        this.formatDeckList()
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      }).catch(err => {
        console.log(err)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      })
    },
    handleDeckClick(item) {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/main?id=${item.id}&collected=1`
      })
    },
  },
  mounted() {
    // this.decksName = this.$store.state.cards.decksName
  },
  onShow() {
    this.genUserCollection()
  },
  onPullDownRefresh() {
    this.genUserCollection()
  },
}
</script>
<style lang="scss" scoped>
.container {
  .deck-list {
    margin:0 30rpx;
    box-sizing:border-box;
    .header {
      .date {
        height: 39rpx;
        font-size: 13px;
        color: #999999;
        margin: 20rpx 0;
      }
    }
  }
  .tips {
    position: relative;
    .noData {
      position: absolute;
      top: 120rpx;
      left:50%;
      transform:translateX(-50%);
      font-size: 16px;
      color: #ddd;
    }
  }
}
</style>
