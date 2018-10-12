<template>
  <div class="container">
    <!--<div class="banner">-->
      <!--<img :src="banner" mode="aspectFill">-->
      <!--&lt;!&ndash;<h1>释放你的潜能吧</h1>&ndash;&gt;-->
    <!--</div>-->
    <Swiper :banners="banners" @swiperClick="swiperClick" v-if="banners"></Swiper>
    <div class="rank-panel">
      <div class="content">
        <div class="rank-mode-btn">
          <div class="feature-btn" v-for="(item, index) in rankMode" :key="index" @click="modeBtnClick(item)">
            <img class="btn-img" :src="selectedMode===item.mode?item.active_icon:item.icon" mode="aspectFit">
            <p :class="selectedMode===item.mode?'active':''">{{item.text}}</p>
          </div>
        </div>
        <div class="chart">
          <img :src="bgImg" class="bg-img" mode="aspectFill">
          <div class="echarts">
            <p class="selected-data" >{{report_date}}&nbsp;&nbsp;&nbsp;&nbsp;{{getSelectData}}</p>
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
      <div class="tier-title"><span>标准模式套牌排行榜</span></div>
      <div class="tier-block" v-for="(tier, index) in tierList" :key="index">
        <TierList :tierData="tier" @itemClick="handleTierClick"></TierList>
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
      banner: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9hNfJeRwXbBrTe.jpg',
      selectedMode: 'standard',
      modeChangeDisabled: false,
      selectedData: null,
      report_date: '',
      rankMode: [
        {mode: 'standard', icon: '/static/icons/Mode_Standard.png', active_icon: '/static/icons/Mode_Standard_active.png', text: '标准模式'},
        {mode: 'wild', icon: '/static/icons/Mode_Wild.png', active_icon: '/static/icons/Mode_Wild_active.png', text: '狂野模式'},
        {mode: 'arena', icon: '/static/icons/Mode_Arena.png', active_icon: '/static/icons/Mode_Arena_active.png', text: '竞技场'}
      ],
      bgImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1fyuymPfaqGcpxdT.jpg',
      btnBgImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g5R2tFfwpRtajax.jpg',
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
        {name: 'Tier 1', cname: '第1梯队', list: []},
        {name: 'Tier 2', cname: '第2梯队', list: []},
        {name: 'Tier 3', cname: '第3梯队', list: []},
        {name: 'Tier 4', cname: '第4梯队', list: []},
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
      let colors = ['#ff7d0a', '#abd473', '#69ccf0', '#f58cba', '#fff', '#fff569', '#0070de', '#9482c9', '#c79c6e']
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
          animationDuration: 500,
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
    .title {
      padding: 0 20rpx;
      font-size: 14px;
      font-weight: 400;
    }
    .content {
      .rank-mode-btn {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-around;
        font-size: 12px;
        padding: 15rpx 40rpx;
        background: $palette-text-yellow linear-gradient(65deg, #fbf7f6 1%, hsla(12, 38%, 97%, .5) 750rpx, #fbf7f6 245px);
        box-sizing:border-box;
        .feature-btn {
          width: 120rpx;
          text-align: center;
          .btn-img {
            width: 30px;
            height: 30px;
            margin: 0 auto;
            text-align: center;
          }
        }
      }
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
    .tier-title {
      position: relative;
      margin: 20rpx;
      font-size: 14px;
      text-align: center;
      &:after, &:before {
        position: absolute;
        top: 50%;
        background: #ddd;
        content: "";
        height: 1px;
        width: 30%
      }
      &:before {
        left: 0
      }
      &:after {
        right: 0;
      }
      .icon {
        font-size: 16px;
        font-weight: 300;
        color: $palette-blue;
        padding-right: 5px;
      }
    }
  }
}
</style>
