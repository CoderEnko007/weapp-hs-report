<template>
  <div class="container">
    <NavBar></NavBar>
    <div class="swiper">
      <Swiper :banners="banners" :date="report_date" @swiperClick="swiperClick" v-if="banners"></Swiper>
    </div>
    <div class="rank-panel">
      <div class="headline">
        <span class="title">职业胜率</span>
        <div class="btn-group">
          <div class="btn-block"
               v-for="(item, index) in rankMode"
               :key="index"
               @click="modeBtnClick(item)">
            <img class="btn-img" :src="selectedMode===item.mode?item.active_icon:item.icon" mode="aspectFit">
            <button class="c-button" :class="selectedMode===item.mode?'btn-active':''">{{item.text}}</button>
            <div class="separator" v-if="index !== 2">|</div>
          </div>
        </div>
      </div>
      <div class="content">
        <RankBoard :list="winrate[selectedMode]"></RankBoard>
      </div>
    </div>
    <div class="tier-panel">
      <div class="headline">
        <span class="title">职业形态排行</span>
        <span class="headline-meta">标准模式</span>
      </div>
      <div class="tier-content">
        <div class="tier-block" v-for="(tier, index) in tierList" :key="index">
          <TierList :tierData="tier" @itemClick="handleTierClick"></TierList>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getRankData, getArchetypeList, getBanners} from "@/api/dbapi";
import {formatNowTime, ShadeColor} from "@/utils";
import mpvueEcharts from 'mpvue-echarts'
import TierList from '@/components/TierList'
import Swiper from '@/components/Swiper'
import NavBar from '@/components/NavBar'
import RankBoard from '@/components/RankBoard'

// let chart = null

export default {
  components: {
    Swiper,
    mpvueEcharts,
    TierList,
    NavBar,
    RankBoard
  },
  data () {
    return {
      banners: [],
      winrate: {
        'standard': [],
        'wild': [],
        'arena': []
      },
      selectedMode: 'standard',
      report_date: '',
      rankMode: [
        {mode: 'standard', icon: '/static/icons-v2/standard.png', active_icon: '/static/icons-v2/standard_active.png', text: '标准'},
        {mode: 'wild', icon: '/static/icons-v2/wild.png', active_icon: '/static/icons-v2/wild_active.png', text: '狂野'},
        {mode: 'arena', icon: '/static/icons-v2/arena.png', active_icon: '/static/icons-v2/arena_active.png', text: '竞技场'}
      ],
      tierList: [
        {name: 'Tier 1', cname: '第1梯队', icon: '/static/icons-v2/tierlist-t1.png', list: []},
        {name: 'Tier 2', cname: '第2梯队', icon: '/static/icons-v2/tierlist-t2.png', list: []},
        {name: 'Tier 3', cname: '第3梯队', icon: '/static/icons-v2/tierlist-t3.png', list: []},
        {name: 'Tier 4', cname: '第4梯队', icon: '/static/icons-v2/tierlist-t4.png', list: []},
      ],
      refreshFlag: 0,
    }
  },
  computed: {
    ...mapGetters([
      'navHeight'
    ]),
  },
  methods: {
    compareFunction(key) {
      return function(obj1, obj2) {
        return obj1[key]-obj2[key]
      }
    },
    initWinrateArray() {
      this.winrate = {
        'standard': [],
        'wild': [],
        'arena': []
      }
    },
    Login() {
      this.$store.dispatch('Login').then(res => {
        console.log('success', res)
      }).catch(err => {
        console.log('fail', err)
      })
    },
    modeBtnClick(item) {
      this.selectedMode = item.mode
    },
    genRankData() {
      let date = formatNowTime(new Date())
      getRankData(date, null, 27).then(res => {
        this.initWinrateArray()
        this.report_date = res.date
        for (let index in this.winrate) {
          if (this.winrate.hasOwnProperty(index)) {
            this.winrate[index] = res.list.filter(item => {
              return item.mode.toLowerCase() === index.toLowerCase()
            })
            this.winrate[index].sort(this.compareFunction('rank_no'))
            this.winrate[index].map(val => {
              val.winrate = parseFloat(val.winrate.replace('%', '')).toFixed(1)
            })
            this.winrate[index].push({})
          }
        }
        this.stopPullDown(true)
      }).catch(err => {
        this.stopPullDown(false)
        console.log(err)
      })
    },
    genArchetypeList() {
      this.$store.dispatch('getArchetypeList').then(res => {
        for (let tier of this.tierList) {
          tier.list = res.filter(item => {
            return item.tier === tier.name
          })
        }
        this.stopPullDown(true)
      }).catch(err => {
        console.log(err)
        this.stopPullDown(false)
      })
    },
    genBanners() {
      getBanners().then(res => {
        this.banners = res.objects
        this.stopPullDown(true)
      }).catch(err => {
        this.stopPullDown(false)
        console.log(err)
      })
    },
    handleTierClick(item) {
      wx.navigateTo({
        url: `/pages/decks/archetypeDetail/main?name=${item.archetype_name}`
      })
    },
    stopPullDown(success) {
      // if (success) {
      //   this.refreshFlag += 1;
      //   if (this.refreshFlag >= 3) {
      //     wx.stopPullDownRefresh();
      //     wx.hideNavigationBarLoading()
      //   }
      // } else {
      //   wx.stopPullDownRefresh();
      //   wx.hideNavigationBarLoading()
      // }
    }
  },
  mounted() {
    this.Login()
    this.genBanners()
    this.genRankData()
    this.genArchetypeList()
  },
  // onPullDownRefresh() {
  //   this.genBanners()
  //   this.genRankData()
  //   this.genArchetypeList()
  // },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/index/main'
    }
  }
}
</script>
<style scoped lang="scss">
@import '../../style/color';
.container {
  .rank-panel {
    padding: 0 15px;
    .headline {
      height: 96rpx;
      .btn-group {
        position: absolute;
        height: 100%;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        .btn-block {
          position: relative;
          height: 100%;
          display:flex;
          justify-content:space-between;
          flex-wrap:nowrap;
          .btn-img {
            position: absolute;
            width: 32rpx;
            height: 32rpx;
            top: 50%;
            transform: translateY(-50%);
          }
          button {
            height: 100%;
            line-height: 96rpx;
            margin-left: 40rpx;
            font-size: 14px;
            font-weight: normal;
            color: #999;
          }
          .btn-active {
            color: $palette-blue;
            font-weight: bold;
          }
          .separator {
            width: 25rpx;
            height: 16px;
            line-height:96rpx;
            text-align: center;
            font-size: 14px;
            color: #EEEEEE;
          }
        }
      }
    }
  }
  .tier-panel {
    padding: 10px 15px 0;
    .headline {
      .headline-meta {
        height: 24rpx;
        line-height: 24rpx;
        margin-left:8px;
        font-size: 19rpx;
        color: #999;
        border: 1rpx solid #ddd;
        border-radius: 12px;
        padding: 3rpx 10rpx;
      }
    }
  }
}
</style>
