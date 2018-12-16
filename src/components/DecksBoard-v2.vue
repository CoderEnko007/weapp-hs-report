<template>
<scroll-view class="container"
     scroll-y='true'
     @scrolltolower='scrollToBottom'
     @scrolltoupper="scrollToTop"
     :style="{height: winHeight-navHeight-184+'px'}">
  <div class="table">
    <div class="table-tr" v-for="(item, index) in list" :key="index" @click="handleItemClick(item)">
      <div class="table-td col-1st">
        <img :src="factions[item.faction].image2" mode="aspectFit">
        <div class="deckName">
          <p class="cname">{{item.cname}}</p>
          <p class="ename">{{item.deck_name}}</p>
        </div>
      </div>
      <div class="table-td" v-if="last_30_days"><span>{{item.real_game_count}}</span></div>
      <div class="table-td" v-else><span>{{item.game_count}}</span></div>
      <div class="table-td icons">
        <img :src="dustImage" mode="aspectFit">
        <span>{{item.dust_cost}}</span>
      </div>
      <div v-if="last_30_days && item.real_win_rate" class="table-td col-last" :class="{'color-green': item.real_win_rate>50, 'color-red': item.real_win_rate<50}">
        <span>{{item.real_win_rate}}%</span>
      </div>
      <div v-else class="table-td col-last" :class="{'color-green': item.win_rate>50, 'color-red': item.win_rate<50}">
        <span>{{item.win_rate}}%</span>
      </div>
    </div>
  </div>
  <ZanLoadmore v-if="loading" v-bind="{ loading: true }" />
  <ZanLoadmore v-else-if="nodata" v-bind="{ nodata: true }" />
  <ZanLoadmore v-else v-bind="{ nomore: true }" />
</scroll-view>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/utils'
import ZanLoadmore from '@/components/loadmore'

export default {
  name: 'DecksBoard',
  props: ['list', 'last_30_days', 'loading', 'nodata'],
  components: {
    ZanLoadmore
  },
  data() {
    return {
      deckName: [],
      dustImage: utils.image.dustImage,
      scrollTop: 0
    }
  },
  computed: {
    ...mapGetters([
      'decksName',
      'winWidth',
      'winHeight',
      'navHeight'
    ]),
    factions() {
      return utils.faction
    }
  },
  methods: {
    handleItemClick(item) {
      this.$emit('itemClick', item)
    },
    scrollToBottom(e) {
      // console.log('scroll to bottom', e)
      this.$emit('scrollToBottom')
    },
    scrollToTop(e) {
      // console.log('scroll to top', e)
      this.$emit('scrollToTop')
    },
  },
  watch: {
    last_30_days(val1, val2) {
      // console.log(val1, val2)
    },
  }
}
</script>
<style lang="scss" scoped>
.container{
  overflow:scroll;
}
.table {
  display: table;
  width: 100%;
  border-collapse: collapse;
  .table-tr {
    display: table-row;
    width: 100%;
    background-color: #fff;
    border-bottom:1rpx solid #eee;
    &:active  {
      background: #eee;
    }
    .table-td {
      display: table-cell;
      position: relative;
      width: 130rpx;
      height: 120rpx;
      line-height: 120rpx;
      text-align: center;
      span {
        font-size: 13px;
      }
    }
    .col-1st {
      position: relative;
      width: 300rpx;
      text-align: left;
      box-sizing: border-box;
      padding-left: 30rpx;
      img {
        position: absolute;
        width: 70rpx;
        height: 70rpx;
        top: 50%;
        transform: translateY(-50%);
      }
      .deckName {
        position: absolute;
        display: inline-block;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 90rpx;
        p.cname {
          font-size: 13px;
          color: #333333;
          height: 37rpx;
          line-height: 37rpx;
        }
        p.ename {
          width:180rpx;
          height: 30rpx;
          line-height: 30rpx;
          font-size: 11px;
          color: #999;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
      }
    }
    .icons {
      img {
        position: absolute;
        width: 23rpx;
        height: 32rpx;
        top: 50%;
        transform: translateY(-50%);
      }
      span {
        margin-left: 28rpx;
      }
    }
    .col-last {
      font-weight: bold;
      padding-right: 30rpx;
    }
  }
}
</style>
