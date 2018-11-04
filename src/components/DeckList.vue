<template>
<div class="container">
  <div class="panel-item" v-for="(item, index) in list" :key="index" @click="handleItemClick(item)">
    <div class="icon">
      <img :src="item.image" mode="aspectFit">
    </div>
    <div class="tier-desc">
      <div class="desc-left">
        <p class="name">{{item.cname}}</p>
        <div class="desc-meta">
          <div class="dust-cost" v-show="item.dust_cost">
            <img :src="dustImage" mode="aspectFit">
            <p>{{item.dust_cost}}</p>
          </div>
          <span class="separator">|</span>
          <span class="count">对局数 {{item.game_count}}</span>
        </div>
      </div>
      <div class="desc-right">
        <p class="name">胜率</p>
        <p class="desc-meta color-green" :class="{'color-red': item.win_rate<50}">{{item.win_rate}}%</p>
      </div>
      <span class="iconfont">&#xe600;</span>
    </div>
  </div>
</div>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'DeckList',
  props: ['list'],
  data() {
    return {
      dustImage: utils.image.dustImage
    }
  },
  methods: {
    handleItemClick(item) {
      this.$emit('itemClick', item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.container {
  .panel-item {
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
          .dust-cost {
            display: inline-block;
            position: relative;
            height:32rpx;
            line-height:32rpx;
            font-size: 11px;
            img {
              position: absolute;
              width: 23rpx;
              height: 32rpx;
              top: 50%;
              transform: translateY(-50%);
            }
            p {
              height: 100%;
              line-height: 30rpx;
              display: inline-block;
              margin-left: 33rpx;
            }
          }
          .separator {
            display: inline-block;
            width: 34rpx;
            color: #EEEEEE;
            text-align: center;
          }
          /*.count {*/
            /*margin-left: 10rpx;*/
          /*}*/
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
