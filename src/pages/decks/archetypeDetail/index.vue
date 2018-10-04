<template>
  <div class="container">
    <div class="banner" :style="{'background-image': bannerImg?'url('+bannerImg+')':''}">
      <div class="overview">
        <div class="archetype-name">
          <p>{{genArchetypeName}}</p>
        </div>
        <div class="desc">
          <div class="desc-item"><p>总对局数：</p><p>{{archetypeDetail.game_count}}</p></div>
          <div class="desc-item"><p>总体胜率：</p>
            <p class="color-green" :class="{'color-red': archetypeDetail.win_rate<50}">{{archetypeDetail.win_rate}}%</p>
          </div>
        </div>
      </div>
    </div>
    <div class="panel card-list">
      <div class="core-cards">
        <div class="core-cards-header header-title grad-header-light-blue">
          <h1 class="float-left">核心卡牌</h1>
          <button class="header-btn zan-btn zan-btn--small zan-btn--plain" @click="gotoDecks">查看相关卡组</button>
        </div>
        <DeckCards :cards="archetypeDetail.core_cards" @cardClick="handleCardClick"></DeckCards>
      </div>
      <div class="pop-cards" v-show="archetypeDetail.pop_cards.length>2">
        <h1 class="header-title grad-header-light-blue">热门卡牌</h1>
        <DeckCards :cards="archetypeDetail.pop_cards" @cardClick="handleCardClick"></DeckCards>
      </div>
    </div>
    <div class="panel matchup">
      <h1 class="header-title grad-header-gray">对抗情况</h1>
      <div class="panel-block">
        <ul class="faction-list">
          <li :class="{'faction-item': true, 'faction-item-action': selectedFaction.id===item.id}"
              v-for="(item, index) in factionIcons"
              :key="index"
              @click="handleIconsClick(item)">
            <img :src="item.image" mode="aspectFit">
          </li>
        </ul>
      </div>
      <div class="panel-block">
        <DeckTable :tableName="'vs.'+selectedFaction.name" :date="updateDate" :tableTitle="tableTitle" :tableData="selectedFaction.data"
                   @cellClick="handleDeckNameClick" ref="deckTable"></DeckTable>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import {getArchetypeDetail} from "@/api/dbapi";
import DeckCards from '@/components/DeckCards'
import DeckTable from '@/components/DeckTable'

const defaultDetail = {
  faction: '',
  archetype_name: '',
  game_count: null,
  win_rate: null,
  core_cards: [],
  pop_cards: [],
  best_matchup: [],
  worst_matchup: [],
  matchup: []
}

export default {
  components: {
    DeckCards,
    DeckTable
  },
  data() {
    return {
      archetypeId: '5ba893085c1e040c8792477f',
      archetypeName: '',
      archetypeDetail: Object.assign({}, defaultDetail),
      bannerImg: null,
      decksName: [],
      factionIcons: [],
      updateDate: null,
      selectedFaction: {id: 'Druid', name: '德鲁伊', data: []},
      tableTitle: [
        {id: 'winrate', name: '胜率'},
        {id: 'popularity', name: '热度'},
        {id: 'games', name: '对局总数'}
      ],
      factions: ['Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'],
      matchupDetail: {
        'Druid': [], 'Hunter': [], 'Mage': [], 'Paladin': [], 'Priest': [], 'Rogue': [], 'Shaman': [], 'Warlock': [], 'Warrior': [],
      },
    }
  },
  computed: {
    genArchetypeName() {
      return this.getDeckCName(this.archetypeDetail.archetype_name)
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
    },
    getDeckCName(name) {
      for (let item of this.decksName) {
        if (item.ename === name) {
          return item.cname
        }
      }
      return name
    },
    genArchetypeDetail() {
      getArchetypeDetail({recordID: this.archetypeId, name: this.archetypeName}).then(res => {
        this.archetypeDetail = res
        this.updateDate = res.update_time
        this.bannerImg = utils.faction[this.archetypeDetail.faction].bgImage.replace('256x', '512x')
        let matchupData = JSON.parse(res.matchup)
        for (let index in matchupData) {
          if (matchupData.hasOwnProperty(index)) {
            this.matchupDetail[this.factions[index]] = matchupData[index]
          }
        }
        this.genTableData(this.matchupDetail[this.selectedFaction.id])
      }).catch(err => {
        console.log(err)
      })
    },
    genFactionIcons() {
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image1})
        }
      }
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
          winrate: parseFloat(data[1].replace('%', '')),
          popularity: parseFloat(data[2].replace('%', ''))
        }
        array.push(formatData)
      }
      this.selectedFaction.data = array
    },
    handleCardClick(item) {
      wx.navigateTo({
        url: `/pages/cards/cardDetail/main?id=${item.dbfId}`
      })
    },
    handleIconsClick(item) {
      this.selectedFaction = {id: item.id, name: item.name, data: []}
      this.genTableData(this.matchupDetail[item.id])
      this.$refs.deckTable.sortTableData()
    },
    handleDeckNameClick(item) {
      let queryId = item.ename
      wx.navigateTo({
        url: `/pages/decks/decksList/main?id=${this.selectedFaction.id}&name=${queryId}`
      })
    },
    gotoDecks() {
      wx.navigateTo({
        url: `/pages/decks/decksList/main?id=${this.archetypeDetail.faction}&name=${this.archetypeDetail.archetype_name}`
      })
    }
  },
  mounted() {
    this.resetPageData()
    this.archetypeId = this.$root.$mp.query.id
    this.archetypeName = this.$root.$mp.query.name
    this.decksName = this.$store.state.cards.decksName
    this.genFactionIcons()
    this.genArchetypeDetail()
  },
  onUnload() {
    this.resetPageData()
  },
  onShareAppMessage(res) {
    return {
      title: this.archetypeName,
      path: `/pages/decks/archetypeDetail/main?id=${this.archetypeId}`
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';
.container {
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
      .archetype-name {
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
        width: 75%;
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        margin: 8px auto 0;
        .desc-item {
          position: relative;
          width: 300rpx;
          color: white;
          font-size: 14px;
          p {
            display: inline-block;
            height: 20px;
            line-height: 20px;
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
  .card-list {
    .card-type {
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      border-radius: 5px;
      margin: 5px 0;
      padding-left: 14px;
    }
  }
  .matchup {
    .panel-block {
      width: 100%;
      margin-top: 8px;
      .faction-list {
        display: flex;
        justify-content: space-around;
        flex-wrap: nowrap;
        width: 100%;
        box-sizing: border-box;
        .faction-item {
          position: relative;
          width: 32px;
          height: 32px;
          font-size: 12px;
          color: white;
          text-align: center;
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            box-sizing: border-box;
            border: 2px solid transparent;
          }
        }
        .faction-item-action {
          img {
            border: 2px solid $palette-orange!important;
          }
        }
      }
    }
  }
  .panel {
    margin: 10px 10px 15px;
  }
}
</style>
