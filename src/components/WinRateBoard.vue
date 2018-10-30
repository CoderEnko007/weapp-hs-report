<template>
  <div class="winrate-board">
    <div class="faction-block" v-for="(item, index) in list" :key="index">
      <img :src="factions[item.faction].image">
      <div class="desc">
        <p class="faction">{{factions[item.faction].name}}</p>
        <p class="winrate color-green" :class="{'color-red': item.win_rate<50}">{{item.win_rate}}%</p>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'WinRateBoard',
  props: ['list'],
  data() {
    return {

    }
  },
  computed: {
    factions() {
      return utils.faction
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.winrate-board {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .faction-block {
    display:flex;
    width: 220rpx;
    height: 116rpx;
    margin-bottom: 15rpx;
    border: 1rpx solid #DDDDDD;
    border-radius: 20rpx;
    box-sizing: border-box;
    img {
      width: 68rpx;
      height: 68rpx;
      margin: 24rpx 0 24rpx 20rpx;
    }
    .desc {
      margin: 25rpx 0 25rpx 13rpx;
      font-size: 13px;
      p.faction {
        color: #999999;
        line-height: 30rpx;
      }
      p.winrate {
        margin-top: 10rpx;
        font-weight: bold;
        line-height: 26rpx;
      }
    }
  }
}
</style>
