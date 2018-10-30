<template>
  <div class="container">
    <div class="panel-tab">
      <div :class="{'tab-btn': true, 'tab-btn-active': selectedTabID===item.id}"
           v-for="(item, index) in tabbar"
           :key="index"
           @click="tabBarClick(item)">
        {{item.text}}
      </div>
    </div>
    <div class="panel-faction">
      <HeroesPanel :dataList="factionIcons" @itemClick="handleIconsClick"></HeroesPanel>
    </div>
    <div class="panel-list">
      <DeckTable :selectedFaction="selectedFaction"
                 :tableTitle="tableTitle"
                 :tableName="selectedFaction.name+'形态'"
                 :tableData="selectedFaction.data"
                 @itemClick="handleDeckItemClick"></DeckTable>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import HeroesPanel from '@/components/HeroesPanel'
import DeckTable from '@/components/DeckTable'
import {getWinRateData} from "@/api/dbapi";
export default {
  components: {
    HeroesPanel,
    DeckTable
  },
  data() {
    return {
      tabbar: [
        {id: 'archetype', text: '按形态'},
        {id: 'faction', text: '按职业'}
      ],
      selectedTabID: 'archetype',
      factionIcons: [],
      selectedFaction: {id: 'Druid', name: '德鲁伊', data: []},
      tableTitle: [
        {id: 'games', name: '对局数'},
        {id: 'popularity', name: '热度'},
        {id: 'winrate', name: '胜率'},
      ],
    }
  },
  computed: {

  },
  methods: {
    tabBarClick(item) {
      this.selectedTabID = item.id
    },
    genFactionIcons() {
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image})
        }
      }
    },
    genWinRateData() {
      wx.showNavigationBarLoading();
      getWinRateData({faction: this.selectedFaction.id}).then(res => {
        let otherDeckIndex = 0
        let decksName = this.$store.state.cards.decksName
        this.selectedFaction.data = []
        for (let index in res) {
          if (res.hasOwnProperty(index)) {
            let ename = res[index].archetype
            if (ename.toLowerCase() === 'other') {
              otherDeckIndex = index //记录other信息的序号，后面将其放置到最后
              ename = this.selectedFaction.id
            }
            let name = decksName.filter(item => {
              return item.ename === ename && item.faction === this.selectedFaction.id
            })[0]
            let formatData = {
              deckName: name?name.cname:res[index].archetype,
              ename: res[index].archetype,
              games: res[index].games,
              winrate: res[index].winrate.toFixed(1),
              popularity: res[index].popularity.toFixed(1)
            }
            this.selectedFaction.data.push(formatData)
          }
        }
        // 默认排序下将'其他'放到最后
        let temp = this.selectedFaction.data[otherDeckIndex]
        temp.deckName = '其他'
        this.selectedFaction.data.splice(otherDeckIndex, 1)
        this.selectedFaction.data.push(temp)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }).catch(err => {
        console.log(err)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      })
    },
    handleIconsClick(item) {
      this.selectedFaction = {id: item.id, name: item.name, data: []}
      this.genWinRateData()
    },
    handleDeckItemClick(item) {
      console.log(item)
    }
  },
  mounted() {
    this.genFactionIcons()
    this.genWinRateData()
  },
  onPullDownRefresh() {
    this.genWinRateData()
    this.$store.dispatch('getDecksName')
  },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/index/main'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/color';
.container {
  .panel-tab {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    height: 89rpx;
    border-bottom: 1rpx solid #eee;
    .tab-btn {
      position: relative;
      height: 100%;
      width: 232rpx;
      line-height: 89rpx;
      font-size: 16px;
      color: #666;
      text-align: center;
      &:after {
        display: none;
        content: '';
        position: absolute;
        width: 53rpx;
        height: 4rpx;
        bottom: 11rpx;
        left: 50%;
        transform: translateX(-50%);
        background-color: $palette-blue;
      }
    }
    .tab-btn-active {
      color: $palette-blue;
      font-weight: bold;
      &:after {
        display: block;
        animation: tabBottomIn .4s;
      }
    }
  }
  .panel-faction {
    margin: 20rpx 30rpx;
  }
}
@keyframes tabBottomIn {
   from {width: 100%; opacity: 0}
   to {width: 53rpx; opacity: 1}
 }
</style>
