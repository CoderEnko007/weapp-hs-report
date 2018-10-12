<template>
  <div class="container">
    <div class="banner" :style="{'background-image': bannerImg?'url('+bannerImg+')':''}">
      <div class="overview">
        <div class="deck-name"><p>{{genDeckName}}</p></div>
        <div class="desc">
          <div class="desc-item"><p>合成花费：</p><img :src="dustImage" mode="aspectFit"><p style="margin-left: 11px">{{deckDetail.dust_cost}}</p></div>
          <div class="desc-item"><p>对局时长：</p><p>{{deckDetail.duration}}分钟</p></div>
          <div class="desc-item"><p>胜率：</p><p class="font-bold color-light-green" :class="{'color-red': deckDetail.win_rate<50}">{{deckDetail.win_rate}}%</p></div>
          <div class="desc-item"><p>回合数：</p><p>{{deckDetail.turns}}</p></div>
          <div class="desc-item"><p>对局数：</p><p>{{gameCount}}</p></div>
          <div class="desc-item"></div>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <FooterMenu showCollectBtn="true" :collected="deckCollected" @collectClick="handleCollection" ref="btnGroup"></FooterMenu>
    </div>
    <div class="card-list">
      <div class="header-title grad-header-light-blue">
        <h1 class="float-left">卡组组成</h1>
      </div>
      <DeckCards :cards="deckDetail.card_list" @cardClick="handleCardClick"></DeckCards>
      <div class="deck-code">
        <button @click="copyDeckCode">复制神秘代码</button>
        <span>{{deckDetail.deck_code}}</span>
      </div>
      <div class="data-chart">
        <div class="title"><img src="/static/mana/mana.png" mode="aspectFit"><span>对阵各职业胜率</span></div>
        <BarChart :chartData="winrateChartData" canvasId="factionBar" :colors="factionColors" @barClick="handleWinRateBarClick"></BarChart>
        <div class="chart-text" v-if="selectWinRate.name">
          对阵{{selectWinRate.name}}胜率为：
          <span class="color-green" :class="{'color-red': selectWinRate.value<50}" :style="{'font-weight': 700}">
            {{selectWinRate.value}}%
          </span>
        </div>
        <div class="chart-text" v-else>点一下柱状图看看</div>
      </div>
      <div class="ads" v-if="adsOpenFlag">
        <ad unit-id="adunit-5507cac6947d0ea4"></ad>
      </div>
      <div class="data-chart">
        <div class="title"><img src="/static/mana/mana.png" mode="aspectFit"><span>费用分布</span></div>
        <BarChart :chartData="costChartData" canvasId="costBar"></BarChart>
      </div>
      <div class="data-chart">
        <div class="title"><img src="/static/mana/mana.png" mode="aspectFit"><span>类型分布</span></div>
        <PieChart :chartData="typeChartData" canvasId="typePie"></PieChart>
      </div>
      <div class="data-chart">
        <div class="title"><img src="/static/mana/mana.png" mode="aspectFit"><span>稀有度分布</span></div>
        <PieChart :chartData="rarityChartData" canvasId="rarityPie" :colors="rarityColor"></PieChart>
      </div>
    </div>
    <_toast />
  </div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import {getDeckDetail, setUserCollection, cancelUserCollection} from "@/api/dbapi";
import {getComponentByTag} from "@/utils";
import DeckCards from '@/components/DeckCards'
import BarChart from '@/components/BarChart'
import PieChart from '@/components/PieChart'
import FooterMenu from '@/components/FooterMenu'
import ZanToast from '@/components/toast'

const defaultDetail = {
  background_img: '',
  deck_name: '',
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

const defaultChartColor = {
  'FREE': '#e7e5e4',
  'COMMON': '#d2d0cf',
  'RARE': '#315376',
  'EPIC': '#644c82',
  'LEGENDARY': '#fc990b'
}

export default {
  components: {
    DeckCards,
    BarChart,
    PieChart,
    FooterMenu,
    _toast: ZanToast
  },
  data() {
    return {
      recordID : '5ba5febd17ae230c5b1b3da1',
      trending: false,
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
      winrateChartData: {xAxis: [], yAxis: []},
      selectWinRate: {name: '', value: ''},
      deckCollected: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    gameCount() {
      return this.deckDetail.real_game_count?this.deckDetail.real_game_count:this.deckDetail.game_count
    },
    adsOpenFlag() {
      return utils.adsOpenFlag
    },
    genDeckName() {
      for (let item of this.decksName) {
        if (item.ename === this.deckDetail.deck_name) {
          this.deckDetail.deck_name = item.cname
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
    }
  },
  methods: {
    resetPageData() {
      this.recordID = ''
      this.deckDetail = Object.assign({}, defaultDetail)
      this.bannerImg = null
      this.costChartData = {
        xAxis: ['0', '1', '2', '3', '4', '5', '6', '7+'],
        yAxis: []
      }
      this.typeChartData = []
      this.rarityChartData = []
      this.winrateChartData ={xAxis: [], yAxis: []}
      this.selectWinRate = {name: '', value: ''}
    },
    genDeckData() {
      wx.showNavigationBarLoading();
      getDeckDetail(this.recordID, this.trending).then(res => {
        this.checkDeckCollected()
        this.deckDetail = res
        this.bannerImg = this.deckDetail["background_img"].replace('256x', '512x')
        this.costChartData.yAxis = JSON.parse(this.deckDetail.statistic)
        let costMax = Math.max.apply(null, this.costChartData.yAxis)
        this.costChartData.max = 5-costMax%10>0?costMax+5-costMax%10:costMax+10-costMax%10
        this.costChartData = JSON.stringify(this.costChartData)

        let clazz = JSON.parse(this.deckDetail.clazzCount)
        for (let index in clazz) {
          if (clazz.hasOwnProperty(index)) {
            this.typeChartData.push({
              name: utils.type[index].name,
              value: clazz[index]
            })
          }
        }
        this.typeChartData = JSON.stringify(this.typeChartData)

        let rarity = JSON.parse(this.deckDetail.rarityCount)
        this.rarityColor = []
        for (let index in rarity) {
          if (rarity.hasOwnProperty(index)) {
            this.rarityChartData.push({
              name: utils.rarity.filter(item => {
                return item.id === index.toLowerCase()
              })[0].name,
              value: rarity[index]
            })
            if (rarity[index] > 0) {
              this.rarityColor.push(defaultChartColor[index])
            }
          }
        }
        this.rarityChartData = JSON.stringify(this.rarityChartData)

        let winrate = JSON.parse(this.deckDetail.faction_win_rate)
        for (let item of winrate) {
          this.winrateChartData.xAxis.push(utils.faction[item.faction].shortName)
          this.winrateChartData.yAxis.push(parseFloat(item.win_rate))
        }
        let min = Math.min.apply(null, this.winrateChartData.yAxis)
        this.winrateChartData.min = Math.floor(min/10)*10-10
        let max = Math.max.apply(null, this.winrateChartData.yAxis)
        this.winrateChartData.max = Math.ceil(max/10)*10+10
        this.winrateChartData.unit = '%'
        this.winrateChartData = JSON.stringify(this.winrateChartData)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      }).catch(err => {
        console.log(err)
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      })
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
      if (this.deckCollected) {
      //  如果已收藏则取消收藏
        let data = {
            deck_id: this.deckDetail.deck_id,
            user_id: this.userInfo.id
        }
        this.$store.dispatch('cancelCollectedDeck', data).then(res => {
          this.$refs.btnGroup.deactiveCollectIcon()
          this.deckCollected = false
        }).catch(err => {
          console.log(err)
        })
      } else {
        if (this.userInfo.id) {
          let data = {
            query: {deck_id: this.deckDetail.deck_id, user_id: this.userInfo.id, trending: this.trending},
            deckDetail: this.deckDetail
          }
          this.$store.dispatch('addCollectedDeck', data).then(res => {
            this.toast.showZanToast({
              title: '收藏成功',
              image: 'https://b.yzcdn.cn/v2/image/dashboard/secured_transaction/suc_green@2x.png'
            })
            this.$refs.btnGroup.activeCollectIcon()
            this.deckCollected = true
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.toast.showZanToast({
            title: '请登录',
            icon: 'fail'
          })
        }
      }
    },
    checkDeckCollected() {
    //  检查当前卡组是否已收藏
      if (this.userInfo.id) {
        let res = this.$store.state.cards.collectedDecks.filter(item => {
          return item.id === this.recordID
        })
        this.deckCollected = res.length > 0;
      }
    }
  },
  mounted() {
    this.toast = getComponentByTag(this, '_toast')
    this.resetPageData()
    this.recordID = this.$root.$mp.query.id
    this.decksName = this.$store.state.cards.decksName
    this.trending = !!this.$root.$mp.query.trending
    this.genDeckData()
  },
  onUnload() {
    this.resetPageData()
    this.deckCollected = false
    this.toast.clearZanToast()
  },
  onPullDownRefresh() {
    this.genDeckData()
  },
  onShareAppMessage(res) {
    return {
      title: this.genDeckName,
      path: `/pages/decks/deckDetail/main?id=${this.recordID}`
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';

.container {
  width: 100%;
  overflow: hidden;
  .banner {
    position: relative;
    width: 100%;
    height: 220rpx;
    overflow: hidden;
    background: no-repeat 0 -45px;
    background-size: 100%;
    .overview {
      position: absolute;
      width: 100%;
      top: 6px;
      z-index: 2;
      .deck-name {
        width: 100%;
        height: 35px;
        p {
          width: 100%;
          text-align: center;
          color: white;
          font-size: 24px;
          letter-spacing: 10px;
          font-weight: 700;
        }
      }
      .desc {
        width: 70%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 3px auto 0;
        .desc-item {
          position: relative;
          width: 240rpx;
          color: white;
          font-size: 12px;
          p {
            display: inline-block;
            height: 20px;
            line-height: 20px;
          }
          img{
            position: absolute;
            width: 24rpx;
            height: 24rpx;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0,0,0,.4);
      z-index: 1;
    }
  }
  .btn-group {
    border-bottom: 1px solid $palette-bg-gray;
  }
  .card-list {
    margin: 0 20rpx 46px;
    .deck-code {
      position: relative;
      height: 55rpx;
      margin-top: 20rpx;
      margin-bottom: 10rpx;
      font-size: 12px;
      border: 1px solid $palette-blue;
      box-sizing: border-box;
      button {
        float: left;
        height: 100%;
        line-height: 55rpx;
        width: 220rpx;
        padding: 0;
        font-size: 12px;
        color: white;
        background-color: $palette-blue;
        border-radius: 0;
        &:after {
          border: none;
        }
      }
      span {
        height: 100%;
        line-height: 55rpx;
        display: inline-block;
        width: calc(100% - 240rpx);
        margin-left: 12rpx;
        color: $palette-text-gray;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
  .title {
    position: relative;
    width: 100%;
    height: 28px;
    font-size: 14px;
    font-weight: 700;
    img {
      position: absolute;
      width: 18px;
      height: 18px;
      top: 50%;
      transform: translateY(-50%);
    }
    span {
      height: 100%;
      line-height: 28px;
      margin-left: 20px;
    }
  }
}
</style>
