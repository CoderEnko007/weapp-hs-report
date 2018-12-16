<template>
  <div class="container">
    <NavBar :showCapsule="true" navTitle="职业形态"></NavBar>
    <div class="banner" :style="{'background-image': bannerImg?'url('+bannerImg+')':''}">
      <div class="overview">
        <div class="archetype-name">
          <div class="icon">
            <img :src="genFactionIcon" mode="aspectFit">
          </div>
          <div class="name">
            <p class="cname">{{genArchetypeName}}</p>
            <p class="ename">{{archetypeDetail.archetype}}</p>
          </div>
        </div>
        <div class="desc">
          <div class="desc-item" v-show="archetypeDetail.real_winrate">
            <p class="item-name">总胜率</p>
            <p class="item-meta color-light-green" :class="{'color-red': archetypeDetail.win_rate<50}">{{archetypeDetail.real_winrate}}%</p>
          </div>
          <div class="desc-item" v-show="archetypeDetail.real_games">
            <p class="item-name">总对局数</p>
            <p class="item-meta">{{archetypeDetail.real_games}}</p>
          </div>
          <div class="desc-item" v-show="archetypeDetail.popularity">
            <p class="item-name">热度</p>
            <p class="item-meta">{{archetypeDetail.popularity}}%</p>
          </div>
          <div class="desc-item" v-show="archetypeDetail.faction_popularity">
            <p class="item-name">职业占比</p>
            <p class="item-meta">{{archetypeDetail.faction_popularity}}%</p>
          </div>
        </div>
      </div>
    </div>
    <div class="pop-deck">
      <div class="headline">
        <span class="title">最热门套牌</span>
        <div class="more-btn" @click="gotoDecks">
          <span class="name">全部相关套牌</span>
          <span class="iconfont">&#xe600;</span>
        </div>
      </div>
      <div class="deck-item" @click="handlePopDeckClick" v-if="bestDeck.show">
        <div class="icon">
          <img :src="genFactionIcon" mode="aspectFit">
        </div>
        <div class="tier-desc">
          <div class="desc-left">
            <p class="name">{{bestDeck.cname}}</p>
            <p class="desc-meta">对局数 {{bestDeck.game_count}}</p>
          </div>
          <div class="desc-right">
            <p class="name">胜率</p>
            <p class="desc-meta" :style="{color: '#000'}">{{bestDeck.win_rate}}</p>
          </div>
        </div>
        <span class="iconfont">&#xe600;</span>
      </div>
      <div class="no-data" v-else><h1>样本过少，暂无数据</h1></div>
    </div>
    <div class="bw-game-panel">
      <div class="headline"><span class="title">优劣对局</span></div>
      <div class="board-panel" v-if="bestMatchup.show || worstMatchup.show">
        <div class="board" v-show="bestMatchup.show">
          <div class="deck-item" @click="handleBestMatchupClick">
            <div class="icon">
              <img :src="bestMatchup.image" mode="aspectFit">
            </div>
            <div class="tier-desc">
              <div class="desc-left">
                <p class="name">
                  <span>{{bestMatchup.cname}}</span>
                  <span class="name-meta">最优势对局</span>
                </p>
                <p class="desc-meta">对局数 {{bestMatchup.game_count}}</p>
              </div>
              <div class="desc-right">
                <p class="name">胜率</p>
                <p class="desc-meta" :class="{'color-green': bestMatchup.win_rate>50, 'color-red': bestMatchup.win_rate<50}">{{bestMatchup.win_rate}}%</p>
              </div>
            </div>
            <span class="iconfont">&#xe600;</span>
          </div>
        </div>
        <div class="board" v-show="worstMatchup.show">
          <div class="deck-item" @click="handleWorstMatchupClick">
            <div class="icon">
              <img :src="worstMatchup.image" mode="aspectFit">
            </div>
            <div class="tier-desc">
              <div class="desc-left">
                <p class="name">
                  <span>{{worstMatchup.cname}}</span>
                  <span class="name-meta">最劣势对局</span>
                </p>
                <p class="desc-meta">对局数 {{worstMatchup.game_count}}</p>
              </div>
              <div class="desc-right">
                <p class="name">胜率</p>
                <p class="desc-meta" :class="{'color-green': worstMatchup.win_rate>50, 'color-red': worstMatchup.win_rate<50}">{{worstMatchup.win_rate}}%</p>
              </div>
            </div>
            <span class="iconfont">&#xe600;</span>
          </div>
        </div>
      </div>
      <div class="board-panel" v-else>
        <div class="no-data"><h1>样本过少，暂无数据</h1></div>
      </div>
    </div>
    <!--<div class="separator"></div>-->
    <div class="headline"><span class="title">形态构筑</span></div>
    <div class="panel card-list">
      <div class="core-cards">
        <div class="title"><span>核心组件</span></div>
        <DeckCards :cards="archetypeDetail.core_cards" @cardClick="handleCardClick"></DeckCards>
      </div>
      <div class="pop-cards" v-show="archetypeDetail.pop_cards.length>2">
        <div class="title"><span>热门卡牌</span></div>
        <DeckCards :cards="archetypeDetail.pop_cards" @cardClick="handleCardClick"></DeckCards>
      </div>
    </div>
    <div class="ads" v-if="adsOpenFlag">
      <ad unit-id="adunit-5507cac6947d0ea4"></ad>
    </div>
    <div class="matchup">
      <div class="headline"><span class="title">对抗情况</span></div>
      <div class="panel"><HeroesPanel :dataList="factionIcons"  :selected="selectedFaction.id" @itemClick="handleIconsClick"></HeroesPanel></div>
      <div class="panel-block">
        <DeckTable :selectedFaction="selectedFaction" :date="updateDate" :tableTitle="tableTitle" :tableData="selectedFaction.data"
                   :tableName="'对阵'+selectedFaction.name" @itemClick="handleDeckItemClick"></DeckTable>
      </div>
      <ZanLoadmore v-bind="{ nomore: true }" />
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import {getArchetypeDetail} from "@/api/dbapi";
import DeckCards from '@/components/DeckCards'
import DeckTable from '@/components/DeckTable'
import TierList from '@/components/TierList'
import HeroesPanel from '@/components/HeroesPanel'
import NavBar from '@/components/NavBar'
import ZanLoadmore from '@/components/loadmore'

const defaultDetail = {
  faction: '',
  archetype_name: '',
  game_count: '',
  win_rate: '',
  popularity: '',
  core_cards: [],
  pop_cards: [],
  best_matchup: [],
  worst_matchup: [],
  matchup: []
}
const defaultBestDeck = {
  show: false,
  deck_id: '',
  cname: '',
  win_rate: '',
  game_count: ''
}
const defaultBWGame = {
  show: false,
  ename: '',
  cname: '',
  win_rate: '',
  game_count: '',
  image: ''
}

export default {
  components: {
    DeckCards,
    DeckTable,
    TierList,
    HeroesPanel,
    NavBar,
    ZanLoadmore
  },
  data() {
    return {
      archetypeId: '5bc4333d02eed116ab1d4a84',
      archetypeName: '',
      archetypeDetail: Object.assign({}, defaultDetail),
      bannerImg: null,
      decksName: [],
      factionIcons: [],
      updateDate: null,
      selectedFaction: {id: 'Druid', name: '德鲁伊', data: []},
      tableTitle: [
        {id: 'games', name: '对局数'},
        {id: 'popularity', name: '热度'},
        {id: 'winrate', name: '胜率'},
      ],
      factions: ['Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'],
      matchupDetail: {
        'Druid': [], 'Hunter': [], 'Mage': [], 'Paladin': [], 'Priest': [], 'Rogue': [], 'Shaman': [], 'Warlock': [], 'Warrior': [],
      },
      bestDeck: Object.assign({}, defaultBestDeck),
      bestMatchup: Object.assign({}, defaultBWGame),
      worstMatchup: Object.assign({}, defaultBWGame)
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'archetypeList',
    ]),
    genArchetypeName() {
      return this.getDeckCName(this.archetypeDetail.archetype)
    },
    genFactionIcon() {
      if (this.archetypeDetail.faction) {
        return utils.faction[this.archetypeDetail.faction].image
      }
    },
    adsOpenFlag() {
      return utils.adsOpenFlag
    },
  },
  methods: {
    resetPageData() {
      this.archetypeDetail = Object.assign({}, defaultDetail)
      this.bannerImg = null
      this.selectedFaction = {id: 'Druid', name: '德鲁伊', data: []}
      this.matchupDetail = {
        'Druid': [], 'Hunter': [], 'Mage': [], 'Paladin': [], 'Priest': [], 'Rogue': [], 'Shaman': [], 'Warlock': [], 'Warrior': [],
      }
      this.bestDeck = Object.assign({}, defaultBestDeck)
      this.bestMatchup = Object.assign({}, defaultBWGame),
      this.worstMatchup = Object.assign({}, defaultBWGame)
    },
    getDeckCName(name) {
      for (let item of this.decksName) {
        if (item.ename === name) {
          return item.cname
        }
      }
      return name
    },
    async genArchetypeDetail() {
      wx.showLoading({
        title: '加载中',
        mask: false
      })
      wx.showNavigationBarLoading();
      let params={}
      if (this.archetypeId) {
        params = {recordID: this.archetypeId}
      } else if (this.archetypeName) {
        params = {name: this.archetypeName}
      } else {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
        return
      }
      const res = await getArchetypeDetail(params)
      console.log('aaa',res)
      if (!res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '抱歉，暂无该卡组详情',
          showCancel: false,
          success (res) {
            wx.navigateBack()
          }
        })
      } else {
        this.archetypeDetail = res
        this.updateDate = this.archetypeDetail.update_time
        this.bannerImg = utils.faction[this.archetypeDetail.faction].bgImage.replace('256x', '512x')
        let matchupData = JSON.parse(this.archetypeDetail.matchup)
        for (let index in matchupData) {
          if (matchupData.hasOwnProperty(index)) {
            this.matchupDetail[this.factions[index]] = matchupData[index]
          }
        }
        this.genTableData(this.matchupDetail[this.selectedFaction.id])

        let bestDeckData = JSON.parse(this.archetypeDetail.pop_deck)
        console.log('bestDeckData', bestDeckData)
        if (bestDeckData.length>0) {
          this.bestDeck.cname = this.getDeckCName(this.archetypeDetail.archetype)
          this.bestDeck.deck_id = bestDeckData[0]
          this.bestDeck.win_rate = bestDeckData[1]
          this.bestDeck.game_count = bestDeckData[2]
          this.bestDeck.show = true
        }

        let bestMatchupData = JSON.parse(this.archetypeDetail.best_matchup)
        if (bestMatchupData.length>0) {
          this.bestMatchup.ename = bestMatchupData[0]
          this.bestMatchup.cname = this.getDeckCName(bestMatchupData[0])
          this.bestMatchup.win_rate = parseFloat(bestMatchupData[1]).toFixed(2)
          this.bestMatchup.game_count = bestMatchupData[2]
          let bestMatchupFaction = bestMatchupData[0].split(' ')
          bestMatchupFaction = bestMatchupFaction[bestMatchupFaction.length - 1]
          this.bestMatchup.image = utils.faction[bestMatchupFaction].image
          this.bestMatchup.faction = bestMatchupFaction
          this.bestMatchup.show = true
        }

        let worstMatchupData = JSON.parse(this.archetypeDetail.worst_matchup)
        if (worstMatchupData.length>0) {
          this.worstMatchup.ename = worstMatchupData[0]
          this.worstMatchup.cname = this.getDeckCName(worstMatchupData[0])
          this.worstMatchup.win_rate = parseFloat(worstMatchupData[1]).toFixed(2)
          this.worstMatchup.game_count = worstMatchupData[2]
          let worstMatchupFaction = worstMatchupData[0].split(' ')
          worstMatchupFaction = worstMatchupFaction[worstMatchupFaction.length - 1]
          this.worstMatchup.image = utils.faction[worstMatchupFaction].image
          this.worstMatchup.faction = worstMatchupFaction
          this.worstMatchup.show = true
        }

        console.log('hideLoading')
        wx.hideLoading()
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }
    },
    genFactionIcons() {
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image})
        }
      }
    },
    handleCardClick(item) {
      wx.navigateTo({
        url: `/pages/cards/cardDetail/main?id=${item.dbfId}`
      })
    },
    genTableData(tableData) {
      let array = []
      for(let data of tableData) {
        let name = this.decksName.filter(item => {
          return item.ename === data[0] && item.faction === this.selectedFaction.id
        })[0]
        let formatData = {
          deckName: name?name.cname:data[0],
          ename: data[0],
          games: parseInt(data[3].replace(',', '')),
          winrate: parseFloat(data[1].replace('%', '')).toFixed(1),
          popularity: parseFloat(data[2].replace('%', ''))
        }
        array.push(formatData)
      }
      this.selectedFaction.data = array
    },
    handleIconsClick(item) {
      this.selectedFaction = {id: item.id, name: item.name, data: []}
      this.genTableData(this.matchupDetail[item.id])
    },
    handleDeckItemClick(item) {
      wx.navigateTo({
        url: `/pages/decks/archetypeDetail/main?name=${item.ename}`
      })
    },
    handlePopDeckClick() {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/main?deckID=${this.bestDeck.deck_id}`
      })
    },
    gotoDecks() {
      wx.navigateTo({
        url: `/pages/decks/decksList/main?id=${this.archetypeDetail.faction}&name=${this.archetypeDetail.archetype}`
      })
    },
    handleWorstMatchupClick() {
      wx.navigateTo({
        url: `/pages/decks/archetypeDetail/main?name=${this.worstMatchup.ename}`
      })
    },
    handleBestMatchupClick() {
      wx.navigateTo({
        url: `/pages/decks/archetypeDetail/main?name=${this.bestMatchup.ename}`
      })
    }
  },
  async mounted() {
    this.archetypeId = this.$root.$mp.query.id
    this.archetypeName = this.$root.$mp.query.name
    this.decksName = this.$store.state.cards.decksName
    await Promise.all([
      this.genFactionIcons(),
      this.genArchetypeDetail()
    ])
  },
  onShareAppMessage(res) {
    // return {
    //   title: this.archetypeName,
    //   path: `/pages/decks/archetypeDetail/main?id=${this.archetypeId}`
    // }
    return {
      title: '炉石传说情报站',
      path: '/pages/index/main'
    }
  },
  onPullDownRefresh() {
    this.genArchetypeDetail()
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';
@import '../../../style/common';
.container {
  width: 100%;
  overflow: hidden;
  .banner {
    position: relative;
    width: 100%;
    height: 400rpx;
    overflow: hidden;
    background-size: 100%;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,.1), rgba(0,0,0,.4));
      z-index: 1;
    }
    .overview {
      width: 100%;
      padding: 97rpx 0 40rpx;
      box-sizing: border-box;
      .archetype-name {
        position: relative;
        width: 100%;
        margin-left: 40rpx;
        z-index: 2;
        .icon {
          float: left;
          width: 88rpx;
          img {
            position: absolute;
            width: 88rpx;
            height: 88rpx;
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
          .ename {
            height:24rpx;
            line-height:24rpx;
            margin-top: 19rpx;
            font-size: 12px;
          }
        }
      }
      .desc {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        padding: 0 30rpx;
        margin-top:40rpx;
        box-sizing: border-box;
        .desc-item {
          position: relative;
          width: 172rpx;
          height: 130rpx;
          color: white;
          text-align: center;
          z-index: 2;
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
    }
  }
  .pop-deck, .board-panel {
    .no-data {
      padding:0 30rpx;
      font-size:13px;
      color:#999;
      height:80rpx;
      text-align: center;
      line-height:80rpx;
    }
    .tier-desc {
      border: none;
    }
  }
  .bw-game-panel {
    .board-panel {
      margin-bottom: 10rpx;
      .board {
        .deck-item .tier-desc .desc-left .name {
          display: flex;
          align-items: center;
          .name-meta{
            height: 24rpx;
            line-height: 24rpx;
            margin-left:8px;
            font-size: 19rpx;
            color: #666;
            border: 1rpx solid #ddd;
            border-radius: 12px;
            padding: 3rpx 10rpx;
          }
        }
      }
    }
  }
  .card-list {
    margin-bottom: 40rpx !important;
    .core-cards, .pop-cards{
      .title {
        position: relative;
        height: 33rpx;
        line-height: 33rpx;
        margin-bottom: 20rpx;
        font-size: 12px;
        color: #999;
        text-align: center;
        &:after, &:before {
          position: absolute;
          top: 50%;
          background: #ddd;
          content: "";
          height: 1px;
          width: 64rpx
        }
        &:before {
          left: 420rpx;
        }
        &:after {
          right: 420rpx;
        }
      }
    }
    .pop-cards {
      margin-top: 30rpx;
    }
  }
  .headline {
    margin: 0 30rpx;
    .more-btn {
      position: relative;
      float: right;
      height: 100%;
      line-height: 96rpx;
      font-weight:normal;
      .name {
        margin-right: 10rpx;
        color: $palette-blue;
        font-size: 13px;
      }
      .iconfont {
        color: $palette-blue;
      }
    }
  }
  .panel {
    margin: 0 15px;
  }
  .separator {
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1rpx solid #eee;
    margin: 20rpx 0;
  }

  .deck-item {
    padding:0 30rpx;
    box-sizing:border-box;
    background-color: #fff;
    &:active {
      background-color: #eee;
    }
    .iconfont {
      right: 30rpx
    }
  }
}
</style>
