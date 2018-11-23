<template>
  <div class="rank-board">
    <div class="faction-block" v-for="(item, index) in list" :key="index">
      <div class="number"><span>{{item.rank_no}}</span></div>
      <img :src="item.name?factions[item.name].image:''">
      <div class="faction"><span>{{item.name?factions[item.name].name:''}}</span></div>
      <div class="winrate" :class="{'color-green': item.winrate>=50, 'color-red': item.winrate<50}">
        <span v-if="item.winrate">{{item.winrate}}%</span>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'RankBoard',
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
    .winrate {
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
