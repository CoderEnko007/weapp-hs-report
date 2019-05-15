<template>
  <div class="container">
    <NavBar></NavBar>
    <div class="swiper">
      <div class="notice-bar" v-show="noticeContent.display">
        <NoticeBar v-on:ref="setRef" v-bind="noticeText" @close="handleCloseNoticeBar" @barClick="handleNoticeClick" :componentId="'noticeText'"/>
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
        <span class="title">标准模式强度排行</span>
        <!--<span class="headline-meta">标准模式</span>-->
        <div class="head-picker">
          <picker mode="selector" :value="rangePicker.selectedItem" :range="rangePickerList" @change="handleRankRangeChange">
            <span class='selector-item'>{{rangePicker.list[rangePicker.selectedItem].text}}</span>
            <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
          </picker>
        </div>
        <div class="head-btn" @click="handleExport">
          <span class="icon iconfont">&#xe69c;&nbsp</span>
          <span>导出日报</span>
        </div>
      </div>
      <div class="tier-content">
        <div class="tier-block" v-for="(tier, index) in tierList" :key="index">
          <TierList :tierData="tier" @itemClick="handleTierClick"></TierList>
          <div class="ads" v-if="index===0 && adsOpenFlag">
            <ad unit-id="adunit-900bbac5f4c50939"></ad>
          </div>
        </div>
      </div>
    </div>
    <div style="position: fixed; top: 9999999999999px; overflow: hidden">
      <canvas :style="{width: canvasWidth+'px', height: canvasHeight+'px'}" canvas-id="dailyReport"></canvas>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import {gradientColor} from '@/utils'
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
      canvasWidth: 375,
      canvasHeight: 200
    }
  },
  computed: {
    ...mapGetters([
      'winWidth',
      'winHeight',
      'navHeight',
      'noticeContent',
    ]),
    adsOpenFlag() {
      return utils.adsOpenFlag
    },
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
        for (let index in this.tierList) {
          if (this.tierList.hasOwnProperty(index)) {
            this.tierList[index].list = res.filter(item => {
              return item.tier === this.tierList[index].name
            })
          }
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
    handleNoticeClick() {
      wx.showModal({
        content: this.noticeText.text,
        showCancel: false,
        confirmText: '朕知道了',
        confirmColor: '#433e88',
      })
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
    },
    handleExport() {
      console.log('handleExport')
      wx.showLoading({
        title: '日报生成中',
        mask: true
      })
      this.saveImageToPhotos()
    },
    saveImageToPhotos () {
      let _this = this
      // 相册授权
      wx.getSetting({
        success(res) {
          // 进行授权检测，未授权则进行弹层授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {
                _this.drawRankCanvas()
              },
              fail() {
                wx.hideLoading()
                wx.showModal({
                  content: '您尚未打开相册使用权限，是否去设置打开？',
                  confirmColor: '#433e88',
                  success (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(res) {
                          console.log(res.authSetting)
                        }
                      })
                    }
                  }
                })
              }
            })
          } else {
            // 已授权则直接进行保存图片
            console.log('PhotosAlbum已授权')
            _this.drawRankCanvas()
          }
        },
        fail(res) {
          wx.hideLoading()
          wx.showToast({
            title: '图片保存失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    drawRankCanvas() {
      let ctx = wx.createCanvasContext('dailyReport')
      let canvasMargin = 0
      this.canvasWidth = 300+canvasMargin
      this.canvasHeight = 720
      let headHeight = 120
      ctx.save()
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, this.canvasWidth, headHeight)
      ctx.restore()
      ctx.save()
      ctx.font = 'normal bold 12px sans-serif';
      ctx.setFillStyle('#433e88')
      ctx.textAlign = 'center'
      ctx.fillText('微信小程序：炉石传说情报站', this.canvasWidth/2, 20)
      ctx.setFillStyle('#000')
      ctx.font = 'normal bold 16px sans-serif';
      ctx.fillText('卡组强度排行', this.canvasWidth/2, 45)
      ctx.restore()
      let rankRange = this.rangePicker.list[this.rangePicker.selectedItem].text
      ctx.font = 'normal normal 12px sans-serif';
      ctx.textAlign = 'left'
      ctx.fillText('分段：', canvasMargin+30, 70)
      ctx.save()
      ctx.font = 'normal bold 13px sans-serif';
      ctx.setFillStyle('red')
      ctx.fillText(rankRange, canvasMargin+65, 70)
      ctx.restore()
      ctx.save()
      ctx.font = 'normal normal 12px sans-serif';
      ctx.setFillStyle('#000')
      ctx.textAlign = 'right'
      let date = new Date()
      ctx.fillText('时间：'+utils.formatNowTime(date), this.canvasWidth-canvasMargin-30, 70)
      ctx.restore()

      ctx.textAlign = 'center'
      ctx.font = 'normal normal 13px sans-serif';
      let colWidth = (this.canvasWidth-canvasMargin*2)/4
      ctx.fillText('强 度', colWidth/2+canvasMargin, 95)
      ctx.fillText('卡 组', colWidth+colWidth/2+canvasMargin, 95)
      ctx.fillText('胜 率', colWidth*2+colWidth/2+canvasMargin, 95)
      ctx.fillText('热 度', colWidth*3+colWidth/2+canvasMargin, 95)

      let rankPower = [
        {name: '第1梯队', height:0, num: 0},
        {name: '第2梯队', height:0, num: 0},
        {name: '第3梯队', height:0, num: 0},
        {name: '第4梯队', height:0, num: 0},
      ]
      let factionColor = {'Druid': '#f79647', 'Hunter': '#9bbb56', 'Mage': '#b8dee9', 'Paladin': '#e6b8b8',
                          'Priest': '#e5e5e5', 'Rogue': '#ffff01', 'Shaman': '#538dd6', 'Warlock': '#cdc0da', 'Warrior': '#c5bd98'}
      let listHeight = 0
      let itemHeight = 25
      let winrateGColor = gradientColor('#239c15', '#297607', this.tierList[0].list.length+this.tierList[1].list.length)
      let winrateRColor = gradientColor('#889400', '#ff5630', this.tierList[2].list.length+this.tierList[3].list.length)
      let winrateColor = [...winrateGColor, ...winrateRColor]
      let itemNums = 0
      for (let tierIndex in this.tierList) {
        if (this.tierList.hasOwnProperty(tierIndex)) {
          if (tierIndex === '__proto__') {
            continue
          }
          rankPower[tierIndex].height=this.tierList[tierIndex].list.length*itemHeight+1 // 每个梯队后面加1px的分割线
          rankPower[tierIndex].num = this.tierList[tierIndex].list.length
          let prevTierHeight = 0
          if (tierIndex > 0) {
            prevTierHeight =  listHeight
          }
          listHeight += rankPower[tierIndex].height
          ctx.save()
          ctx.setFillStyle('#fbf3e8')
          ctx.fillRect(canvasMargin, headHeight+prevTierHeight-17, colWidth, rankPower[tierIndex].height)
          ctx.restore()
          ctx.save()
          ctx.font = 'normal bold 12px sans-serif'
          ctx.setFillStyle('#34383b')
          ctx.fillText(rankPower[tierIndex].name, colWidth/2+canvasMargin, headHeight+prevTierHeight)
          ctx.restore()
          let list = this.tierList[tierIndex].list
          for (let itemIndex in list) {
            if (list.hasOwnProperty(itemIndex)) {
              if (itemIndex === '__proto__') {
                continue
              }
              ctx.save()
              ctx.setFillStyle(factionColor[list[itemIndex].faction])
              ctx.fillRect(canvasMargin+colWidth, headHeight+prevTierHeight+itemIndex*itemHeight-17, colWidth, itemHeight)
              ctx.setFillStyle('#000')
              ctx.font = 'normal normal 12px sans-serif'
              ctx.fillText(list[itemIndex].cname, colWidth/2+canvasMargin+colWidth, headHeight+prevTierHeight+itemIndex*itemHeight)
              ctx.restore()
              ctx.save()
              if (itemNums%2 === 0) {
                ctx.setFillStyle('#fff')
              } else {
                ctx.setFillStyle('#faf8f9')
              }
              ctx.fillRect(canvasMargin+2*colWidth, headHeight+prevTierHeight+itemIndex*itemHeight-17, 2*colWidth, itemHeight)
              ctx.setFillStyle('#faf8f9')
              ctx.restore()
              ctx.save()
              ctx.font = 'normal bold 12px sans-serif'
              ctx.setFillStyle(winrateColor[itemNums++])
              ctx.fillText(list[itemIndex].win_rate+'%', colWidth/2+canvasMargin+colWidth*2, headHeight+prevTierHeight+itemIndex*itemHeight)
              ctx.restore()
              if (list[itemIndex].popularity1) {
                ctx.fillText(list[itemIndex].popularity1.toFixed(1)+'%', colWidth/2+canvasMargin+colWidth*3, headHeight+prevTierHeight+itemIndex*itemHeight)
              } else {
                ctx.fillText('暂无', colWidth/2+canvasMargin+colWidth*3, headHeight+prevTierHeight+itemIndex*itemHeight)
              }
            }
          }
          ctx.save()
          ctx.setStrokeStyle('#ccc')
          ctx.moveTo(canvasMargin, headHeight+prevTierHeight-17)
          ctx.lineTo(this.canvasWidth-canvasMargin, headHeight+prevTierHeight-17)
          ctx.stroke()
          ctx.restore()
        }
      }
      ctx.setStrokeStyle('#ccc')
      ctx.moveTo(canvasMargin, headHeight+listHeight-17)
      ctx.lineTo(this.canvasWidth-canvasMargin, headHeight+listHeight-17)
      ctx.stroke()
      ctx.save()
      ctx.setFillStyle('#fff')
      ctx.fillRect(0, headHeight+listHeight-17, this.canvasWidth, 30)
      ctx.setFillStyle('#433e88')
      ctx.font = 'normal bold 12px sans-serif';
      ctx.textAlign = 'right'
      ctx.fillText('数据源：HSReplay', this.canvasWidth-canvasMargin-10, headHeight+listHeight)
      ctx.restore()
      this.canvasHeight = headHeight+listHeight+10

      let _this = this
      ctx.draw(false, function(e) {
        setTimeout(function() {
          _this.saveCanvasImg()
        }, 1000)
      })
    },
    saveCanvasImg() {
      let pages = getCurrentPages();
      if (pages[pages.length-1].route !== 'pages/index/main') {
        return
      }
      let destWidth = 375 * 750 / wx.getSystemInfoSync().windowWidth
      let destHeight = (this.canvasHeight * 375 / this.canvasWidth) * 750 / wx.getSystemInfoSync().windowWidth
      wx.canvasToTempFilePath({
        canvasId: 'dailyReport',
        destWidth: destWidth,
        destHeight: destHeight,
        fileType: 'jpg',
        quality: 1,
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.hideLoading()
              wx.showToast({
                title: '图片已保存到相簿',
                duration: 2000
              })
            },
            fail(err) {
              wx.hideLoading()
              wx.showToast({
                title: '图片保存失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        },
        fail(err) {
          console.log('error', err)
          wx.hideLoading()
          wx.showToast({
            title: '图片生成失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
  },
  mounted() {
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
.head-btn {
  position:absolute;
  top:50%;
  right: 55rpx;
  transform:translateY(-50%);
  line-height:30px;
  font-size: 12px;
  color: $palette-blue;
}
</style>
