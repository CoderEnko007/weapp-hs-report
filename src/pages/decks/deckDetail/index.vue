<template>
  <div class="container">
    <NavBar :showCapsule="true" navTitle="套牌详情"></NavBar>
    <div class="banner" :style="{'background-image': bannerImg?'url('+bannerImg+')':''}">
      <div class="overview">
        <div class="deck-name">
          <div class="icon">
            <img :src="genFactionIcon" mode="aspectFit">
          </div>
          <div class="name">
            <p class="cname">{{genDeckName}}</p>
            <div class="dust-cost" v-show="deckDetail.dust_cost">
              <img :src="dustImage" mode="aspectFit">
              <p>{{deckDetail.dust_cost}}</p>
            </div>
          </div>
        </div>
        <div class="archeBtn" @click="gotoArchetypeDetail" v-if="showArchetype">
          <span>职业形态</span>
          <span class="iconfont">&#xe600;</span>
        </div>
        <div class="desc">
          <div class="desc-item" v-show="deckDetail.real_win_rate">
            <p class="item-name">胜率</p>
            <p class="item-meta font-bold color-light-green" :class="{'color-red': deckDetail.real_win_rate<50}">{{deckDetail.real_win_rate}}%</p>
          </div>
          <div class="desc-item" v-show="deckDetail.game_count">
            <p class="item-name">对局数</p>
            <p class="item-meta">{{gameCount}}</p>
          </div>
          <div class="desc-item" v-show="deckDetail.duration">
            <p class="item-name">对局时长</p>
            <p class="item-meta">{{deckDetail.duration}}分钟</p>
          </div>
          <div class="desc-item" v-show="deckDetail.turns">
            <p class="item-name">回合数</p>
            <p class="item-meta">{{deckDetail.turns}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-group" :style="{display: deckChecked?'block':'none'}">
      <FooterMenu showExportBtn="true" showCollectBtn="true"
                  :collected="deckCollected"
                  @collectClick="handleCollection"
                  @exportClick="handleExport"
                  ref="btnGroup"></FooterMenu>
    </div>
    <div class="card-list">
      <div class="headline m-30"><span class="title">套牌组成</span></div>
      <div class="m-30">
        <DeckCards :cards="deckDetail.card_list" @cardClick="handleCardClick"></DeckCards>
      </div>
      <div class="rarity-panel m-30">
        <div class="capsule" v-for="(item, index) in rarityChartData" :key="index" v-if="item.value>0">
          <div class="icons" :style="{'background-color': item.color}"></div>
          <span class="name">{{item.cname}}</span>
          <span class="value">{{item.value}}</span>
        </div>
      </div>
      <div class="type-panel m-30">
        <div class="capsule" v-for="(item, index) in typeChartData" :key="index" v-if="item.value>0">
          <span class="name">{{item.cname}}</span>
          <span class="value">{{item.value}}</span>
        </div>
      </div>
      <div class="deck-code m-30">
        <div class="code"><span>{{deckDetail.deck_code}}</span></div>
        <button @click="copyDeckCode">复制神秘代码</button>
      </div>
      <div class="ads" v-if="adsOpenFlag">
        <ad unit-id="adunit-d6bb528c4e28a808"></ad>
      </div>
      <div class="separator"></div>
      <div class="winrate-block m-30">
        <div class="headline"><span class="title">对阵各职业胜率</span></div>
        <WinRateBoard :list="winrateChartData"></WinRateBoard>
      </div>
      <div class="m-30">
        <div class="separator"></div>
        <div class="data-chart">
          <div class="headline"><span class="title">费用分布</span></div>
          <BarChart :chartData="costChartData" canvasId="costBar"></BarChart>
        </div>
      </div>
    </div>
    <div class="safe-panel" :style="{'height': 60+'rpx'}"></div>
    <_toast />
    <div style="position: fixed; top: 9999999999999px; overflow: hidden">
      <canvas :style="{width: canvasWidth+'px', height: canvasHeight+'px', 'margin-left': '30rpx'}" canvas-id="deck-pic"></canvas>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import {getDeckDetail, setUserCollection, cancelUserCollection, getArchetypeDetail} from "@/api/dbapi";
import {getComponentByTag, iFanrTileImageURL, getImageInfoAsync} from "@/utils";
import DeckCards from '@/components/DeckCards'
import BarChart from '@/components/BarChart'
import PieChart from '@/components/PieChart'
import FooterMenu from '@/components/FooterMenu'
import ZanToast from '@/components/toast'
import NavBar from '@/components/NavBar'
import WinRateBoard from '@/components/WinRateBoard'

const defaultDetail = {
  background_img: '',
  deck_name: '',
  cname: '',
  dust_cost: null,
  win_rate: null,
  game_count: null,
  real_game_count: null,
  duration: null,
  turns: null,
  card_list: '',
  clazzCount: '',
  rarityCount: '',
  statistic: '',
  faction_win_rate: ''
}

export default {
  components: {
    NavBar,
    DeckCards,
    BarChart,
    PieChart,
    FooterMenu,
    WinRateBoard,
    _toast: ZanToast
  },
  data() {
    return {
      recordID : '5c7ee1b5421bd1177dc0657a',
      deckID: '',
      trending: false,
      collected: false,
      handleCollecting: false,
      deckMode: 'Standard',
      decksName: '',
      bannerImg: null,
      deckDetail: Object.assign({}, defaultDetail),
      dustImage: utils.image.dustImage,
      costChartData: {
        xAxis: ['0', '1', '2', '3', '4', '5', '6', '7+'],
        yAxis: [],
        min: 0,
        max: 15
      },
      typeChartData: [],
      rarityChartData: [],
      rarityColor: [],
      winrateChartData: [],
      selectWinRate: {name: '', value: ''},
      deckCollected: false,
      deckChecked: false,
      showArchetype: false,
      canvasHeight: 270,
      canvasWidth: 165,
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'userInfo'
    ]),
    genFactionIcon() {
      if (this.deckDetail.faction) {
        return utils.faction[this.deckDetail.faction].image
      }
    },
    gameCount() {
      return this.deckDetail.real_game_count?this.deckDetail.real_game_count:this.deckDetail.game_count
    },
    adsOpenFlag() {
      return utils.adsOpenFlag
    },
    genDeckName() {
      for (let item of this.decksName) {
        if (item.ename === this.deckDetail.deck_name) {
          this.deckDetail.cname = item.cname
          return item.cname
        }
      }
      return this.deckDetail.deck_name
    },
    factionColors() {
      return utils.factionColors
    },
    genSelectedWinrate() {
      if (!this.selectWinRate.name) {
        return '点一下柱状图看看'
      } else {
        return `对阵${this.selectWinRate.name}胜率为：${this.selectWinRate.value}%`
      }
    },
  },
  methods: {
    resetPageData() {
      this.deckDetail = Object.assign({}, defaultDetail)
      this.bannerImg = null
      this.costChartData = {
        xAxis: ['0', '1', '2', '3', '4', '5', '6', '7+'],
        yAxis: []
      }
      this.typeChartData = []
      this.rarityChartData = []
      this.winrateChartData = []
      this.selectWinRate = {name: '', value: ''}
      this.deckCollected = false
      this.showArchetype = false
    },
    async genDeckData() {
      wx.showLoading({
        title: '加载中',
        mask: false
      })
      wx.showNavigationBarLoading();
      let params = {}
      if (this.recordID) {
        params = {recordID: this.recordID}
      } else if (this.deckID) {
        params = {deckID: this.deckID}
      }
      params.mode = this.deckMode
      const res = await getDeckDetail(params, this.trending, this.collected)
      // getDeckDetail(params, this.trending, this.collected).then(res => {
      if (!res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '抱歉，暂未收录该卡组',
          showCancel: false,
          success (res) {
            wx.navigateBack()
          }
        })
      } else {
        this.checkDeckCollected()
        this.deckDetail = res
        this.getArchetype()
        this.bannerImg = utils.faction[this.deckDetail['faction']].bgImage1
        this.costChartData.yAxis = JSON.parse(this.deckDetail.statistic)
        let costMax = Math.max.apply(null, this.costChartData.yAxis)
        this.costChartData.max = 5-costMax%10>0?costMax+5-costMax%10:costMax+10-costMax%10
        this.costChartData = JSON.stringify(this.costChartData)

        // 卡牌类型数据
        this.typeChartData = []
        let clazz = JSON.parse(this.deckDetail.clazzCount)
        for (let index in clazz) {
          if (clazz.hasOwnProperty(index)) {
            this.typeChartData.push({
              name: index.toLowerCase(),
              cname: utils.type[index.toUpperCase()].name,
              value: clazz[index]
            })
          }
        }
        // 卡牌稀有度数据
        this.rarityChartData = []
        let rarity = JSON.parse(this.deckDetail.rarityCount)
        let commonCards = {name: '', cname: '基础/普通', value: 0, color: utils.rarity['free'].color}
        this.rarityColor = []
        for (let index in rarity) {
          if (rarity.hasOwnProperty(index)) {
            if (index.toLowerCase() === 'free' || index.toLowerCase() === 'common') {
              commonCards.value += rarity[index]
            } else {
              this.rarityChartData.push({
                name: index.toLowerCase(),
                cname: utils.rarity[index.toLowerCase()].name,
                value: rarity[index],
                color: utils.rarity[index.toLowerCase()].color
              })
            }
          }
        }
        this.rarityChartData.unshift(commonCards)
        // 对阵各职业胜率数据
        this.winrateChartData = JSON.parse(this.deckDetail.faction_win_rate)
        this.winrateChartData = this.winrateChartData.map(item => {
          item.win_rate = parseFloat(item.win_rate).toFixed(1)
          return item
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      }
    },
    getArchetype() {
      if (this.deckDetail.deck_name) {
        getArchetypeDetail({name: this.deckDetail.deck_name}).then(res => {
          if (res) {
            this.showArchetype = true
          } else {
            this.showArchetype = false
          }
        })
      }
    },
    handleCardClick(item) {
      wx.navigateTo({
        url: `/pages/cards/cardDetail/main?id=${item.dbfId}`
      })
    },
    copyDeckCode() {
      wx.setClipboardData({
        data: this.deckDetail.deck_code,
        success: function(res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    },
    handleWinRateBarClick(bar) {
      for(let index in utils.faction) {
        if (utils.faction.hasOwnProperty(index)) {
          if (utils.faction[index].shortName === bar.name) {
            this.selectWinRate.name = utils.faction[index].name
          }
        }
      }
      this.selectWinRate.value = bar.value
    },
    handleCollection() {
      this.handleCollecting = true
      if (this.deckCollected) {
      //  如果已收藏则取消收藏
        let data = {
            collection_id: this.deckDetail.id,
            user_id: this.userInfo.id
        }
        this.$store.dispatch('cancelCollectedDeck', data).then(res => {
          this.$refs.btnGroup.deactiveCollectIcon()
          this.deckCollected = false
          this.handleCollecting = false
        }).catch(err => {
          console.log(err)
          this.handleCollecting = false
        })
      } else {
        if (this.userInfo.id) {
          let data = {
            query: {deck_id: this.deckDetail.deck_id, user_id: this.userInfo.id, trending: this.trending},
            deckDetail: this.deckDetail
          }
          this.$store.dispatch('addCollectedDeck', data).then(res => {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
            this.$refs.btnGroup.activeCollectIcon()
            this.deckCollected = true
            this.handleCollecting = false
          }).catch(err => {
            this.handleCollecting = false
            console.log(err)
          })
        } else {
          this.toast.showZanToast({
            title: '请登录',
            icon: 'fail'
          })
          this.handleCollecting = false
        }
      }
    },
    handleExport() {
      wx.showLoading({
        title: '图片生成中',
        mask: true
      })
      this.saveImageToPhotos()
    },
    checkDeckCollected() {
    //  检查当前卡组是否已收藏
      if (this.userInfo.id) {
        let res = this.$store.state.cards.collectedDecks.filter(item => {
          return item.id === this.recordID
        })
        this.deckCollected = res.length > 0;
      }
      this.deckChecked = true
    },
    gotoArchetypeDetail() {
      wx.navigateTo({
        url: `/pages/decks/archetypeDetail/main?name=${this.deckDetail.deck_name}`
      })
    },
    saveCanvasImg() {
      let pages = getCurrentPages();
      if (pages[pages.length-1].route !== 'pages/decks/deckDetail/main') {
        return
      }
      wx.canvasToTempFilePath({
        canvasId: 'deck-pic',
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
    saveImageToPhotos () {
      let _this = this
      // 相册授权
      wx.getSetting({
        success(res) {
          console.log('getSetting', res)
          // 进行授权检测，未授权则进行弹层授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {
                _this.drawDeckCanvas()
              },
              fail() {
                wx.hideLoading()
                wx.showToast({
                  title: '请点击右上角·●·->关于炉石传说情报站->右上角·●·->设置->授权访问相册',
                  icon: 'none',
                  duration: 5000
                })
              }
            })
          } else {
            // 已授权则直接进行保存图片
            _this.drawDeckCanvas()
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
    async drawDeckCanvas() {
      let rarityColor = {
        common: '#5e5e5e',
        rare: '#1768c6',
        epic: '#705dc7',
        legendary: '#f5a623'
      }
      let formatData = {}
      if(this.deckDetail.card_list) {
        formatData = JSON.parse(this.deckDetail.card_list)
        for (let card of formatData) {
          card['img'] = iFanrTileImageURL(card.tile)
          if (card.rarity === 'LEGENDARY') {
            card['count'] = '★'
          }
        }
      }
      let ctx = wx.createCanvasContext('deck-pic')
      // 每张tile高29px，间隔1px
      let tileHeight=30
      let headHeight = 52
      let bRectHeight = 26
      let cardListHeight = tileHeight*formatData.length-1
      this.canvasHeight = cardListHeight+headHeight+bRectHeight+2

      // 绘制头部图片背景
      ctx.save()
      ctx.setFillStyle('#2C3E50')
      ctx.fillRect(0, 0, this.canvasWidth, headHeight-2)
      ctx.restore()
      ctx.drawImage(utils.faction[this.deckDetail.faction].image, 7, 7, 38, 38)
      // 绘制头部描述
      ctx.save()
      ctx.font = 'normal bold 15px sans-serif';
      ctx.textAlign = 'left'
      ctx.setFillStyle('#fff')
      ctx.fillText(this.genDeckName, 52, 23)
      ctx.restore()
      ctx.save()
      ctx.drawImage(this.dustImage, 52, 30, 10, 14)
      ctx.font = 'normal normal 12px sans-serif';
      ctx.setFillStyle('#fff')
      ctx.fillText(this.deckDetail.dust_cost, 64, 42)
      ctx.drawImage(utils.deckModeImg(this.deckDetail.mode), this.canvasWidth-50, 30, 15, 15)
      let mode = ''
      if (this.deckDetail.mode.toLowerCase() === 'standard') {
        mode = '标准'
      } else if (this.deckDetail.mode.toLowerCase() === 'wild') {
        mode = '狂野'
      }
      ctx.fillText(mode, this.canvasWidth-32, 42)
      ctx.restore()

      // 绘制卡牌主体部分
      let grd=ctx.createLinearGradient(27,0,136,0);
      grd.addColorStop(0, "#313109")
      grd.addColorStop(.2, "#313131")
      grd.addColorStop(.83, "rgba(49,49,49,00)")
      grd.addColorStop(1, "rgba(49,49,49,00)")
      let pages = getCurrentPages();
      for (let index in formatData) {
        if (formatData.hasOwnProperty(index)) {
          // 绘制费用和稀有度
          ctx.save()
          ctx.beginPath()
          let color = rarityColor.common
          switch(formatData[index].rarity) {
            case 'RARE': color = rarityColor.rare; break;
            case 'EPIC': color = rarityColor.epic; break;
            case 'LEGENDARY': color = rarityColor.legendary; break
            default: color = rarityColor.common;
          }
          ctx.setFillStyle(color)
          ctx.fillRect(0, headHeight+index*tileHeight, 27, 29)
          // 费用
          ctx.font = 'normal bold 14px sans-serif';
          ctx.textAlign = 'center'
          ctx.setFillStyle('#fff')
          ctx.fillText(formatData[index].cost, 14, headHeight+index*tileHeight+20)
          ctx.closePath()
          ctx.restore()
          // 绘制卡牌tile图片
          let res = await getImageInfoAsync(formatData[index].img)
          console.log(pages[pages.length-1].route)
          if (pages[pages.length-1].route !== 'pages/decks/deckDetail/main') {
            console.log('not canvas page')
            return
          }
          console.log(res)
          let tileRatio = res.height/29
          if (formatData[index].count !== 1) {
            ctx.drawImage(res.path, 30, 0, 100*tileRatio, res.height, 43, headHeight+index*tileHeight, 100, 29) //27+13,费用框占27px，间隔13px，宽度100
          } else {
            ctx.drawImage(res.path, 0, 0, 122*tileRatio, res.height, 43, headHeight+index*tileHeight, 122, 29)
          }
          // 绘制卡牌张数
          if (formatData[index].count !== 1) {
            ctx.save()
            ctx.setFillStyle('#313131')
            ctx.fillRect(143, headHeight+index*tileHeight, 22, 29)
            ctx.font = 'normal bolder 13px sans-serif';
            ctx.textAlign = 'center'
            ctx.setFillStyle('#f4d442')
            ctx.fillText(formatData[index].count, 154, headHeight+index*tileHeight+19)
            ctx.restore()
          }
          // 绘制卡牌蒙版
          ctx.fillStyle = grd
          ctx.fillRect(27, headHeight+index*tileHeight, 136, 29)
          // 绘制卡牌名
          ctx.save()
          ctx.font = 'normal bold 12px sans-serif';
          ctx.textAlign = 'left'
          ctx.setFillStyle('#fff')
          ctx.fillText(formatData[index].cname, 32, headHeight+index*tileHeight+19)
          ctx.restore()
        }
      }
      // 绘制底部
      ctx.save()
      ctx.setFillStyle('#2C3E50')
      ctx.fillRect(0, cardListHeight+headHeight+2, this.canvasWidth, bRectHeight)
      ctx.font = 'normal normal 12px sans-serif';
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.setFillStyle('#fff')
      ctx.fillText('微信小程序：炉石传说情报站', this.canvasWidth/2, cardListHeight+headHeight+bRectHeight/2+2)
      ctx.restore()
      ctx.draw()
      let destWidth = 219
      let destHeight = this.canvasHeight*219/this.canvasWidth
      this.saveCanvasImg()
    },
  },
  async mounted() {
    this.toast = getComponentByTag(this, '_toast')
    this.recordID = this.$root.$mp.query.id
    this.deckID = this.$root.$mp.query.deckID
    this.deckMode = this.$root.$mp.query.mode?this.$root.$mp.query.mode:'Standard'
    this.decksName = this.$store.state.cards.decksName
    if (this.decksName.length === 0) {
      this.decksName = await this.$store.dispatch('getDecksName')
    }
    this.trending = !!this.$root.$mp.query.trending
    this.collected = !!this.$root.$mp.query.collected
    await this.genDeckData()
  },
  onPullDownRefresh() {
    // 下拉刷新要把json字符串转换为对象，否则getDeckData时操作对象会报错
    this.costChartData = JSON.parse(this.costChartData)
    this.genDeckData()
  },
  onShareAppMessage(res) {
    let sharePath = ''
    if (this.recordID) {
      sharePath: `/pages/decks/deckDetail/main?recordID=${this.recordID}`
    } else if (this.deckID) {
      sharePath: `/pages/decks/deckDetail/main?deckID=${this.deckID}`
    }
    if (res.from === 'button') {
      return {
        title: this.genDeckName,
        path: sharePath
      }
    } else {
      return {
        title: '炉石传说情报站',
        path: '/pages/index/main'
      }
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';

.container {
  width: 100%;
  overflow: hidden;
  .banner {
    width: 100%;
    height: 400rpx;
    overflow: hidden;
    background-size: 100%;
    .overview {
      position: relative;
      width: 100%;
      padding: 95rpx 0 34rpx;
      box-sizing: border-box;
      z-index: 1;
      .deck-name {
        position: relative;
        width: 100%;
        margin-left: 40rpx;
        .icon {
          position: relative;
          float: left;
          width: 88rpx;
          height: 88rpx;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .name {
          height: 100%;
          margin-left: 107rpx;
          color: #fff;
          .cname {
            height:50rpx;
            line-height:50rpx;
            font-size: 25px;
          }
          .dust-cost {
            position: relative;
            height:44rpx;
            line-height:44rpx;
            margin-top: 5rpx;
            font-size: 12px;
            img {
              position: absolute;
              width: 23rpx;
              height: 32rpx;
              top: 50%;
              transform: translateY(-50%);
            }
            p {
              height: 100%;
              line-height: 44rpx;
              display: inline-block;
              margin-left: 28rpx;
            }
          }
        }
      }
      .desc {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        padding: 0 30rpx;
        margin-top:34rpx;
        box-sizing: border-box;
        .desc-item {
          position: relative;
          width: 172rpx;
          height: 130rpx;
          color: white;
          text-align: center;
          .item-name {
            margin-top: 21rpx;
            font-size: 13px;
          }
          .item-meta {
            margin-top: 7rpx;
            font-weight: bold;
            font-size: 16px;
          }
        }
      }
      .archeBtn {
        position: absolute;
        width: 154rpx;
        height: 54rpx;
        line-height: 54rpx;
        right: 30rpx;
        top: 123rpx;
        padding-left: 20rpx;
        color: #fff;
        border: 1rpx solid rgba(255,255,255,0.50);
        border-radius: 27px;
        font-size: 13px;
        background: rgba(0,0,0,0.20);
      }
    }
  }
  .card-list {
    /*margin: 0 30rpx;*/
    .capsule {
      position: relative;
      display:inline-block;
      /*width: 128rpx;*/
      height: 48rpx;
      line-height: 48rpx;
      padding:0 18rpx;
      margin-right: 10rpx;
      text-align: center;
      font-size: 13px;
      color: #666;
      border: 1rpx solid #ddd;
      border-radius: 32rpx;
      box-sizing: border-box;
      .icons {
        position:absolute;
        display: inline-block;
        width: 18rpx;
        height: 18rpx;
        top:50%;
        transform:translateY(-50%);
        border-radius: 9rpx;
      }
      .name {
        margin:0 5rpx 0 25rpx;
      }
      .value {
        color: #000;
        font-weight: bold;
      }
    }
    .rarity-panel {
      margin-top: 30rpx;
    }
    .type-panel {
      margin-top: 15rpx;
      .capsule {
        .name {
          margin: 0 5rpx;
        }
      }
    }
    .deck-code {
      position: relative;
      height: 64rpx;
      margin-top: 20rpx;
      margin-bottom: 10rpx;
      border-radius: 32rpx;
      box-sizing: border-box;
      button {
        float: right;
        height: 100%;
        line-height: 64rpx;
        width: 207rpx;
        padding: 0;
        font-size: 13px;
        color: white;
        background-color: $palette-blue;
        border-radius: 37px;
        margin-left: 18rpx;
        &:after {
          border: none;
        }
      }
      .code {
        height: 100%;
        line-height: 64rpx;
        display: inline-block;
        width: 467rpx;
        color: #666;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 32px;
        background-color: #f8f8f8;
        padding: 0 21rpx 0 13rpx;
        box-sizing: border-box;
        text-align: center;
        span {
          width: 433rpx;
        }
      }
    }
  }
  .data-chart {
    width: 100%;
    overflow: hidden;
    /*margin: 20rpx;*/
    .chart-text {
      height:27px;
      line-height:27px;
      font-size:14px;
    }
  }
  .separator {
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1rpx solid #eee;
    margin: 30rpx 0;
  }
}
</style>
