<template>
  <div class="container">
    <Swiper :banners="banners" :date="report_date" @swiperClick="swiperClick" v-if="banners"></Swiper>
    <div class="rank-panel">
      <div class="headline">
        <span class="title">职业胜率</span>
        <div class="btn-group">
          <div class="btn-block"
               v-for="(item, index) in rankMode"
               :key="index"
               @click="modeBtnClick(item)">
            <button class="c-button" :class="selectedMode===item.mode?'btn-active':''">{{item.text}}</button>
            <div class="separator" v-if="index !== 2">|</div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="chart">
          <img :src="bgImg" class="bg-img" mode="aspectFill">
          <div class="echarts">
            <p class="selected-data" >{{getSelectData}}</p>
            <mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleInit" ref="echarts" />
            <div class="hero-icons">
              <div class="icons" v-for="(item, index) in heroes" :key="index">
                <img :src="item.icon" :alt="item.name" mode="aspectFit">
              </div>
            </div>
          </div>
        </div>
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
import {getRankData, getArchetypeList, getBanners} from "@/api/dbapi";
import {formatNowTime, ShadeColor} from "@/utils";
import * as echarts from '../../libs/echarts.simple.min'
import mpvueEcharts from 'mpvue-echarts'
import TierList from '@/components/TierList'
import Swiper from '@/components/Swiper'

let chart = null

export default {
  components: {
    Swiper,
    mpvueEcharts,
    TierList
  },
  data () {
    return {
      banners: [],
      option: null,
      echarts,
      winrate: {
        'standard': [],
        'wild': [],
        'arena': []
      },
      selectedMode: 'standard',
      modeChangeDisabled: false,
      selectedData: null,
      report_date: '',
      rankMode: [
        {mode: 'standard', icon: '/static/icons/Mode_Standard.png', active_icon: '/static/icons/Mode_Standard_active.png', text: '标准'},
        {mode: 'wild', icon: '/static/icons/Mode_Wild.png', active_icon: '/static/icons/Mode_Wild_active.png', text: '狂野'},
        {mode: 'arena', icon: '/static/icons/Mode_Arena.png', active_icon: '/static/icons/Mode_Arena_active.png', text: '竞技场'}
      ],
      bgImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1fyuymPfaqGcpxdT.jpg',
      heroes: [
        {name: 'druid', icon: '/static/heroIcons/druid-1.png'},
        {name: 'hunter', icon: '/static/heroIcons/hunter-1.png'},
        {name: 'mage', icon: '/static/heroIcons/mage-1.png'},
        {name: 'paladin', icon: '/static/heroIcons/paladin-1.png'},
        {name: 'priest', icon: '/static/heroIcons/priest-1.png'},
        {name: 'rogue', icon: '/static/heroIcons/rogue-1.png'},
        {name: 'shaman', icon: '/static/heroIcons/shaman-1.png'},
        {name: 'warlock', icon: '/static/heroIcons/warlock-1.png'},
        {name: 'warrior', icon: '/static/heroIcons/warrior-1.png'},
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
    getSelectData() {
      let mode = ''
      switch(this.selectedMode) {
        case this.rankMode[0].mode: mode=this.rankMode[0].text; break;
        case this.rankMode[1].mode: mode=this.rankMode[1].text; break;
        case this.rankMode[2].mode: mode=this.rankMode[2].text; break;
        default: mode='';break
      }
      if (this.selectedData) {
        return this.selectedData.hero+' '+mode+' 胜率'+': '+this.selectedData.winrate
      } else {
        return mode+'职业胜率'
      }
    }
  },
  methods: {
    initWinrateArray() {
      this.winrate = {
        'standard': [],
        'wild': [],
        'arena': []
      }
    },
    initChart() {
      let colors = ['#ff7d0a', '#abd473', '#69ccf0', '#f58cba', '#ddd', '#fff569', '#0070de', '#9482c9', '#c79c6e']
      this.option = {
        grid: {x: 20, y: -25, x2: 20, y2: 10},
        xAxis: {
          show: false,
          data: ['德鲁伊', '猎人', '法师', '骑士', '牧师', '潜行者', '萨满', '术士', '战士'],
        },
        yAxis: {
          show: false,
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [{
          animationDuration: 200,
          type: 'bar',
          data: this.winrate[this.selectedMode],
          itemStyle: {
            normal: {
              // 定制显示（按顺序）
              color: function (params) {
                return colors[params.dataIndex]
              },
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: 'auto',
                  fontSize: 12
                },
                formatter: '{c}%'
              }
            }
          }
        }]
      }
      let min = Math.min.apply(null, this.winrate[this.selectedMode])
      this.option.yAxis.min = Math.floor(min/10)*10
      let max = Math.max.apply(null, this.winrate[this.selectedMode])
      this.option.yAxis.max = Math.ceil(max/10)*10
      this.option.yAxis.max = this.option.yAxis.max-2>max?this.option.yAxis.max-2:this.option.yAxis.max
      console.log(min, this.option.yAxis.min, max, this.option.yAxis.max)
      this.$refs.echarts.init()
    },
    handleInit (canvas, width, height) {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      chart.setOption(this.option)
      let _this = this
      chart.on('finished', function () {
        _this.modeChangeDisabled = false
      });
      chart.on('click', function (params) {
        _this.selectedData = {
          'hero': params.name,
          'winrate': params.data+'%'
        }
      });
      return chart
    },
    Login() {
      this.$store.dispatch('Login').then(res => {
        console.log('success', res)
      }).catch(err => {
        console.log('fail', err)
      })
    },
    modeBtnClick(item) {
      if (!this.modeChangeDisabled) {
        this.modeChangeDisabled = true
        this.selectedMode = item.mode
        this.selectedData = null
        this.initChart()
      }
    },
    genRankData() {
      let date = formatNowTime(new Date())
      getRankData(date, null, 27).then(res => {
        this.initWinrateArray()
        this.report_date = res.date
        res.list.forEach(item => {
          if (item['mode'].toLowerCase() === 'standard') {
            this.winrate['standard'].push(item['winrate'].replace('%', ''))
          } else if (item['mode'].toLowerCase() === 'wild') {
            this.winrate['wild'].push(item['winrate'].replace('%', ''))
          } else if (item['mode'].toLowerCase() === 'arena') {
            this.winrate['arena'].push(item['winrate'].replace('%', ''))
          }
        })
        this.initChart()
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
        url: `/pages/decks/archetypeDetail/main?id=${item.id}`
      })
    },
    stopPullDown(success) {
      if (success) {
        this.refreshFlag += 1;
        if (this.refreshFlag >= 3) {
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading()
        }
      } else {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }
    }
  },
  mounted() {
    this.Login()
    this.genBanners()
    this.genRankData()
    this.genArchetypeList()
  },
  onPullDownRefresh() {
    this.genBanners()
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
    padding: 15px;
    .headline {
      .btn-group {
        position: absolute;
        width: 125px;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        .btn-block {
          display:flex;
          justify-content:space-between;
          flex-wrap:nowrap;
          button {
            height: 16px;
            line-height: 16px;
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
            line-height: 16px;
            text-align: center;
            font-size: 14px;
            color: #EEEEEE;
          }
        }
      }
    }
    .content {
      margin-top: 15px;
      .chart {
        position: relative;
        width: 100%;
        height: 540rpx;
        overflow:hidden;
        .bg-img {
          position: absolute;
          width: 100%;
          height: 100%;
          filter: blur(3px);
          transform: scale(1.2);
          overflow: hidden;
          z-index: -999;
        }
        .echarts {
          height: 400rpx;
          width: 100%;
          .selected-data {
            height: 40rpx;
            padding-top: 35rpx;
            padding-left: 45rpx;
            font-size: 14px;
            color: #fff;
          }
          .hero-icons {
            display: flex;
            justify-content: space-around;
            padding: 0 35rpx;
            .icons {
              width: 65rpx;
              text-align: center;
              img {
                width: 45rpx;
                height: 45rpx;
              }
            }
          }
        }
      }
    }
  }
  .tier-panel {
    padding: 0 15px;
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
    .tier-content {
      margin-top: 9px;
    }
  }
}
</style>
