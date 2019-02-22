<template>
  <div class="container">
    <NavBar></NavBar>
    <div class="swiper">
      <div class="notice-bar" v-show="noticeContent.display">
        <NoticeBar v-on:ref="setRef" v-bind="noticeText" @close="handleCloseNoticeBar" :componentId="'noticeText'"/>
      </div>
      <Swiper :banners="banners" :date="report_date" @swiperClick="swiperClick" v-if="banners"></Swiper>
    </div>
    <div class="rank-panel">
      <div class="headline">
        <span class="title">职业排名</span>
        <div class="mode-filter">
          <picker mode="selector" :value="modeFilter.selectedItem" :range="modePickerList" @change="handleModeChange">
            <span class='selector-item'>{{modeFilter.list[modeFilter.selectedItem].text}}</span>
            <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
          </picker>
        </div>
        <div class="btn-group">
          <div class="btn-block"
               v-for="(item, index) in rankMode"
               :key="index"
               @click="modeBtnClick(item)">
            <img class="btn-img" :src="selectedGameType===item.mode?item.active_icon:item.icon" mode="aspectFit">
            <button class="c-button" :class="selectedGameType===item.mode?'btn-active':''">{{item.text}}</button>
            <div class="separator" v-if="index !== 2">|</div>
          </div>
        </div>
      </div>
      <div class="content">
        <RankBoard :list="rankData[selectedGameType]" :mode="modeFilter.list[modeFilter.selectedItem].value"></RankBoard>
      </div>
    </div>
    <div class="tier-panel">
      <div class="headline">
        <span class="title">职业形态排行</span>
        <!--<span class="headline-meta">标准模式</span>-->
        <div class="head-picker">
          <picker mode="selector" :value="rangePicker.selectedItem" :range="rangePickerList" @change="handleRankRangeChange">
            <span class='selector-item'>{{rangePicker.list[rangePicker.selectedItem].text}}</span>
            <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
          </picker>
        </div>
        <span class="right-meta">标准模式</span>
      </div>
      <div class="tier-content">
        <div class="tier-block" v-for="(tier, index) in tierList" :key="index">
          <TierList :tierData="tier" @itemClick="handleTierClick"></TierList>
          <div class="ads" v-if="index===0">
            <ad unit-id="adunit-900bbac5f4c50939"></ad>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import {getRankData, getArchetypeList, getBanners, getNotice} from "@/api/dbapi";
import {formatNowTime, ShadeColor} from "@/utils";
import TierList from '@/components/TierList'
import Swiper from '@/components/Swiper'
import NavBar from '@/components/NavBar'
import RankBoard from '@/components/RankBoard'
import NoticeBar from '@/components/noticebar'

export default {
  components: {
    Swiper,
    TierList,
    NavBar,
    RankBoard,
    NoticeBar
  },
  data () {
    return {
      banners: [],
      origRankList: [],
      rankData: {
        'standard': [],
        'wild': [],
        'arena': []
      },
      modeFilter: {
        selectedItem: 0,
        list: [
          {text: '按胜率', value: 'win_rate'},
          {text: '按热度', value: 'popularity'}
        ]
      },
      selectedGameType: 'standard',
      report_date: '',

      rangePicker: {
        selectedItem: 0,
        list: [
          {text: '全分段', rank_range: 'All'},
          {text: 'R5-R1分段', rank_range: 'One_Through_Five'},
          {text: '传说分段', rank_range: 'Legend_Only'}
        ]
      },

      rankMode: utils.gameMode,
      tierList: [
        {name: 'Tier 1', cname: '第1梯队', icon: '/static/icons-v2/tierlist-t1.png', list: []},
        {name: 'Tier 2', cname: '第2梯队', icon: '/static/icons-v2/tierlist-t2.png', list: []},
        {name: 'Tier 3', cname: '第3梯队', icon: '/static/icons-v2/tierlist-t3.png', list: []},
        {name: 'Tier 4', cname: '第4梯队', icon: '/static/icons-v2/tierlist-t4.png', list: []},
      ],
      refreshFlag: 0,
      noticeText: {
        text: '',
        animationData: []
      },
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'noticeContent',
    ]),
    modePickerList() {
      return this.modeFilter.list.map(item => {
        return item.text
      })
    },
    rangePickerList() {
      return this.rangePicker.list.map(item => {
        return item.text
      })
    }
    // 通知栏数据不能用computed属性，因为animationData每次都会被清空，可以在mounted时获取text
    // noticeText() {
    //   return {
    //     text: this.noticeContent.content,
    //     animationData: []
    //   }
    // }
  },
  methods: {
    ...NoticeBar.methods,
    setRef(payload) {
      console.log(payload)
      setTimeout(() => {
        let that = this
        this.initZanNoticeBarScroll(that, 'noticeText')
      }, 1500)
    },
    compareFunction(key) {
      return function(obj1, obj2) {
        let formatKey = key.replace('-', '')
        if (key.indexOf('-') !== -1) {
          return obj2[formatKey]-obj1[formatKey]
        } else {
          return obj1[formatKey]-obj2[formatKey]
        }
      }
    },
    sortRankData(data) {
      for (let index in this.rankData) {
        if (this.rankData.hasOwnProperty(index)) {
          this.rankData[index] = data.filter(item => {
            return item.game_type.toLowerCase() === index.toLowerCase()
          })
          if (this.modeFilter.list[this.modeFilter.selectedItem].value === 'win_rate') {
            this.rankData[index].sort(this.compareFunction('-win_rate'))
          } else if (this.modeFilter.list[this.modeFilter.selectedItem].value === 'popularity'){
            this.rankData[index].sort(this.compareFunction('-popularity'))
          }
          this.rankData[index].map(val => {
            val.win_rate = parseFloat(val.win_rate).toFixed(1)
            val.popularity = parseFloat(val.popularity).toFixed(1)
          })
          this.rankData[index].push({})
        }
      }
    },
    initRankDataArray() {
      this.rankData = {
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
      this.selectedGameType = item.mode
    },
    handleModeChange(e) {
      this.modeFilter.selectedItem = e.mp.detail.value
      this.sortRankData(this.origRankList)
    },
    handleRankRangeChange(e) {
      this.rangePicker.selectedItem = e.mp.detail.value
      this.genArchetypeList()
    },
    genRankData() {
      let date = formatNowTime(new Date())
      getRankData(date, null, 27).then(res => {
        this.initRankDataArray()
        this.report_date = res.date
        this.origRankList = res.list
        this.sortRankData(this.origRankList)
        this.stopPullDown(true)
      }).catch(err => {
        this.stopPullDown(false)
        console.log(err)
      })
    },
    genArchetypeList() {
      let params = {rankRange: this.rangePicker.list[this.rangePicker.selectedItem].rank_range}
      getArchetypeList(params).then(res => {
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
    handleCloseNoticeBar() {
      this.$store.commit('SHOW_NOTICE_BAR', false)
    },
    stopPullDown(success) {
      if (success) {
        this.refreshFlag += 1;
        if (this.refreshFlag >= 2) {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading()
        }
      } else {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }
    },
    genNotice() {
      if (this.noticeContent.hasOwnProperty('content') && this.noticeContent.content.length>0) {
        this.noticeText.text = this.noticeContent.content
      } else {
        this.$store.dispatch('getNotice').then(res => {
          this.noticeText.text = res.content
        })
      }
    }
  },
  mounted() {
    this.Login()
    this.genBanners()
    this.genRankData()
    this.genArchetypeList()
    this.genNotice()
  },
  onPullDownRefresh() {
    // this.genBanners()
    this.genRankData()
    this.genArchetypeList()
  },
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
      .mode-filter {
        display: inline-block;
        height: 24rpx;
        line-height: 24rpx;
        margin-left:8px;
        font-size: 19rpx;
        color: #999;
        border: 1rpx solid #ddd;
        border-radius: 12px;
        padding: 3rpx 10rpx;
      }
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
    padding: 10px 0;
    .headline {
      padding:0 30rpx;
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
