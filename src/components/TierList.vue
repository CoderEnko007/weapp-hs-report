<template>
  <div class="container">
    <div class="tier-header" @click="handleHeaderClick">
      <div class="tier-title">
        <div class="title-block">
          <img :src="tierData.icon">
          <span class="title">{{tierData.cname}}</span>
          <span v-if="showListFlag" class="icon iconfont">&#xe602;</span>
          <span v-else class="icon iconfont">&#xe624;</span>
        </div>
      </div>
    </div>
    <div class="tier-block" v-if="showList">
      <div class="tier-item"
           v-for="(item, index) in genTierList" :key="index"
           @click="handleItemClick(item)">
        <div class="icon">
          <img :src="item.image" mode="aspectFit">
        </div>
        <div class="tier-desc">
          <div class="desc-left">
            <p class="name">{{item.cname}}</p>
            <p class="desc-meta">对局数 {{item.game_count}}</p>
          </div>
          <div class="desc-right">
            <p class="name">胜率</p>
            <p class="desc-meta color-green" :class="{'color-red': item.win_rate<50}">{{item.win_rate}}%</p>
          </div>
        </div>
        <span class="iconfont">&#xe600;</span>
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
  .tier-header {
    position: relative;
    width: 100%;
    height: 40px;
    overflow: hidden;
    .tier-title {
      position: absolute;
      width: 100%;
      height: 100%;
      line-height: 40px;
      .title-block {
        font-size: 14px;
        font-weight: 700;
        color: #333;
        .title {
          margin-left:26px;
        }
      }
      .icon {
        float: right;
        font-size: 20px;
        font-weight:100;
        color: #999;
      }
      img {
        position:absolute;
        width: 20px;
        height: 15px;
        top:50%;
        transform:translateY(-50%);
      }
    }
  }
  .tier-block {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    .tier-item {
      position: relative;
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 14px;
      background: #fff;
      &:active  {
        background: #eee;
      }
      .icon {
        position: relative;
        float: left;
        width: 70rpx;
        height: 100%;
        img {
          position: absolute;
          width: 70rpx;
          height: 70rpx;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .tier-desc {
        position: relative;
        height: 100%;
        margin-left: 90rpx;
        border-bottom: 1rpx solid #eee;
        padding: 27rpx 0;
        box-sizing:border-box;
        .desc-left {
          float: left;
          .name {
            height: 37rpx;
            line-height: 37rpx;
            font-size: 13px;
            color: #333;
          }
          .desc-meta {
            height: 30rpx;
            line-height: 30rpx;
            margin-top: 4rpx;
            font-size: 11px;
            color: #999;
          }
        }
        .desc-right {
          float: right;
          margin-right: 40rpx;
          text-align: right;
          .name {
            height: 22rpx;
            line-height: 22rpx;
            font-size: 11px;
            color: #999;
          }
          .desc-meta {
            height: 32rpx;
            line-height: 32rpx;
            margin-top: 10rpx;
            font-size: 14px;
            font-weight: bold;
            /*color: #333;*/
          }
        }
      }
      .iconfont {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        color: #999;
        font-size: 14px;
      }
    }
  }
}
</style>
