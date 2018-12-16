<template>
  <div class="rank-board">
    <div class="faction-block" v-for="(item, index) in list" :key="index">
      <div class="number" v-if="item.faction"><span>{{index+1}}</span></div>
      <img :src="item.faction?factions[item.faction].image:''">
      <div class="faction"><span>{{item.faction?factions[item.faction].name:''}}</span></div>
      <div class="data-rate" v-if="mode==='win_rate'">
        <span :class="{'color-green': item.win_rate>=50, 'color-red': item.win_rate<50}" v-if="item.win_rate">{{item.win_rate}}%</span>
      </div>
      <div class="data-rate" v-if="mode==='popularity'">
        <span v-if="item.popularity">{{item.popularity}}%</span>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'RankBoard',
  props: ['list', 'mode'],
  data() {
    return {

    }
  },
  computed: {
    factions() {
      return utils.faction
    },
  },
  watch: {
    // list(val) {
    //   console.log(val.map(item=>{
    //     return {
    //       'win_rate': item.win_rate,
    //       'popularity': item.popularity
    //     }
    //   }))
    // }
  }
}
</script>
<style lang="scss" scoped>
.rank-board {
  height: 390rpx;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
  background: #FAFAFA;
  border-radius: 24rpx;
  .faction-block {
    position: relative;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    align-items:center;
    width: 345rpx;
    height: 74rpx;
    .number {
      width: 30rpx;
      height: 30rpx;
      margin-left: 29rpx;
      font-size: 13px;
      color: #999999;
      line-height: 30rpx;
    }
    img {
      width: 40rpx;
      height: 40rpx;
      margin-left: 5rpx;
    }
    .faction {
      font-size: 13px;
      color: #333333;
      line-height: 30rpx;
      margin-left: 14.5rpx;
    }
    .data-rate {
      position: absolute;
      right: 30rpx;
      line-height: 26rpx;
      font-size: 13px;
      font-weight: bold;
      /*color: #333333;*/
      text-align: right;
    }
  }
}
</style>
