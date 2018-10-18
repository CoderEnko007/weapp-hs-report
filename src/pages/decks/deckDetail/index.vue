<template>
  <div class="container">
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
          <div class="desc-item" v-show="deckDetail.win_rate">
            <p class="item-name">胜率</p>
            <p class="item-meta font-bold color-light-green" :class="{'color-red': deckDetail.win_rate<50}">{{deckDetail.win_rate}}%</p>
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
    <div class="btn-group">
      <FooterMenu showCollectBtn="true" :collected="deckCollected" @collectClick="handleCollection" ref="btnGroup"></FooterMenu>
    </div>
    <div class="card-list">
      <div class="headline"><span class="title">套牌组成</span></div>
      <DeckCards :cards="deckDetail.card_list" @cardClick="handleCardClick"></DeckCards>
      <div class="rarity-panel">
        <div class="capsule" v-for="(item, index) in rarityChartData" :key="index" v-if="item.value>0">
          <div class="icons" :style="{'background-color': item.color}"></div>
          <span class="name">{{item.cname}}</span>
          <span class="value">{{item.value}}</span>
        </div>
      </div>
      <div class="type-panel">
        <div class="capsule" v-for="(item, index) in typeChartData" :key="index" v-if="item.value>0">
          <span class="name">{{item.cname}}</span>
          <span class="value">{{item.value}}</span>
        </div>
      </div>
      <div class="deck-code">
        <div class="code"><span>{{deckDetail.deck_code}}</span></div>
        <button @click="copyDeckCode">复制神秘代码</button>
      </div>
      <div class="data-chart">
        <div class="headline"><span class="title">对阵各职业胜率</span></div>
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
        <div class="headline"><span class="title">费用分布</span></div>
        <BarChart :chartData="costChartData" canvasId="costBar"></BarChart>
      </div>
    </div>
    <div class="safe-panel" :style="{'height': 60+'rpx'}"></div>
    <_toast />
  </div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import {getDeckDetail, setUserCollection, cancelUserCollection, getArchetypeDetail} from "@/api/dbapi";
import {getComponentByTag} from "@/utils";
import DeckCards from '@/components/DeckCards'
import BarChart from '@/components/BarChart'
import PieChart from '@/components/PieChart'
import FooterMenu from '@/components/FooterMenu'
import ZanToast from '@/components/toast'

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
    DeckCards,
    BarChart,
    PieChart,
    FooterMenu,
    _toast: ZanToast
  },
  data() {
    return {
      recordID : '5bc2f3c5b5aa5821082c76b8',
      deckID: '',
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
      deckCollected: false,
      showArchetype: false
    }
  },
  computed: {
    ...mapGetters([
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
      this.deckCollected = false
    },
    genDeckData() {
      wx.showNavigationBarLoading();
      let params = {}
      if (this.recordID) {
        params = {recordID: this.recordID}
      } else if (this.deckID) {
        params = {deckID: this.deckID}
      }
      console.log(this.recordID, this.deckID)
      getDeckDetail(params, this.trending).then(res => {
        this.checkDeckCollected()
        this.deckDetail = res
        this.getArchetype()
        this.bannerImg = utils.faction[this.deckDetail['faction']].bgImage1
        this.costChartData.yAxis = JSON.parse(this.deckDetail.statistic)
        let costMax = Math.max.apply(null, this.costChartData.yAxis)
        this.costChartData.max = 5-costMax%10>0?costMax+5-costMax%10:costMax+10-costMax%10
        this.costChartData = JSON.stringify(this.costChartData)

        // 卡牌类型数据
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
        let rarity = JSON.parse(this.deckDetail.rarityCount)
        this.rarityColor = []
        for (let index in rarity) {
          if (rarity.hasOwnProperty(index)) {
            this.rarityChartData.push({
              name: index.toLowerCase(),
              cname: utils.rarity[index.toLowerCase()].name,
              value: rarity[index],
              color: utils.rarity[index.toLowerCase()].color
            })
          }
        }
        // 对阵各职业胜率数据
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
    getArchetype() {
      if (this.deckDetail.deck_name) {
        getArchetypeDetail({name: this.deckDetail.deck_name}).then(res => {
          if (res) {
            this.showArchetype = true
          }
        }).catch(err => {
          this.showArchetype = false
          console.log(err)
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
    },
    gotoArchetypeDetail() {
      wx.navigateTo({
        url: `/pages/decks/archetypeDetail/main?name=${this.deckDetail.deck_name}`
      })
    },
  },
  onReady() {
    this.toast = getComponentByTag(this, '_toast')
    this.resetPageData()
    this.recordID = this.$root.$mp.query.id
    // this.recordID = '5bc2f3c5b5aa5821082c76b8'
    this.deckID = this.$root.$mp.query.deckID
    this.decksName = this.$store.state.cards.decksName
    this.trending = !!this.$root.$mp.query.trending
    this.genDeckData()
  },
  onUnload() {
    this.resetPageData()
    // this.deckCollected = false
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
    margin: 0 30rpx;
    .capsule {
      position: relative;
      display:inline-block;
      width: 128rpx;
      height: 48rpx;
      line-height: 48rpx;
      padding:0 15rpx;
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
        width: 16rpx;
        height: 16rpx;
        top:50%;
        transform:translateY(-50%);
        border-radius: 8rpx;
      }
      .name {
        margin:0 5rpx 0 20rpx;
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
}
</style>
