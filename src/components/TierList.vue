<template>
  <div class="container">
    <div class="tier-header" @click="handleHeaderClick">
      <span class="tier-fade-title grad-header-light-blue"></span>
      <div class="tier-title">
        <span v-if="showListFlag" class="icon iconfont">&#xe602;</span>
        <span v-else class="icon iconfont">&#xe624;</span>
        <span>{{tierData.cname}}</span>
      </div>
    </div>
    <div class="tier-block" v-if="showList">
      <div class="tier-item"
           v-for="(item, index) in genTierList" :key="index"
           :style="{'background-image': 'url('+item.bgImage+')'}"
           @click="handleItemClick(item)">
        <div class="tier-desc">
          <img :src="item.image" mode="aspectFit">
          <span class="deck-name">{{item.cname}}</span>
          <div class="deck-winrate">胜率：
            <span class="color-green" :class="{'color-red': item.win_rate<50}">{{item.win_rate}}%</span>
          </div>
          <span class="iconfont">&#xe600;</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'TierList',
  props: ['tierData'],
  data() {
    return {
      bgImage: 'https://art.hearthstonejson.com/v1/256x/HERO_04b.jpg',
      showListFlag: true,
    }
  },
  computed: {
    genTierList() {
      let val = this.tierData
      let deckName = this.$store.state.cards.decksName
        for (let index in val.list) {
          if(val.list.hasOwnProperty(index)) {
            let deck = deckName.filter(deck => {
              return deck.ename === val.list[index].archetype_name
            })[0]
            if(deck && deck.cname) {
              val.list[index].cname = deck.cname
            }
            if (val.list[index].faction) {
              val.list[index].image = utils.faction[val.list[index].faction].image
              val.list[index].bgImage = utils.faction[val.list[index].faction].bgImage
            }
          }
      }
      return this.tierData.list
    },
    showList() {
      return this.showListFlag
    }
  },
  methods: {
    handleItemClick(item) {
      this.$emit('itemClick', item)
    },
    handleHeaderClick() {
      this.showListFlag = !this.showListFlag
    }
  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.container {
  padding: 0 15rpx 15rpx;
  .tier-header {
    position: relative;
    width: 100%;
    height: 30px;
    font-size: 14px;
    overflow: hidden;
    .tier-fade-title {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
    .tier-title {
      position: absolute;
      width: 100%;
      height: 100%;
      line-height: 30px;
      font-weight: 700;
      left: 14px;
      color: white;
      .icon {
        float: right;
        font-size: 20px;
        font-weight: 200;
        margin-right: 32px;
        color: #000;
      }
    }
  }
  .tier-block {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    padding: 5px 0;
    transition: all .5m;
    .tier-item {
      position: relative;
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 14px;
      background: no-repeat 125px -42px;
      border-bottom: 1px solid #eee;
      img {
        position: absolute;
        width: 70rpx;
        height: 70rpx;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
      .deck-name {
        margin-left: 50px;
      }
      .deck-winrate {
        position: absolute;
        display: inline-block;
        right: 100px;
        span {
          font-weight: 700;
        }
      }
      .tier-desc {
        background: linear-gradient(-90deg, #fbf7f6 1%,hsla(12,38%,97%,.7) 110px,#fbf7f6 245px);
        .iconfont {
          float: right;
          margin-right: 20px;
        }
      }
    }
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>
