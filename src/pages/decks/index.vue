<template>
  <div class="container">
    <div class="panel">
      <div class="panel-header">
        <h1><span class="icon iconfont">&#xe729;</span>职业套牌</h1>
      </div>
      <div class="panel-block">
        <ul class="faction">
          <li class="faction-item" v-for="(item, index) in factionFrames" :key="index" @click="handleFactionClick(item)">
            <img :src="item.image" alt="item.id" mode="aspectFit">
          </li>
        </ul>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        <h1><span class="icon iconfont">&#xe729;</span>卡组胜率与热度</h1>
      </div>
      <div class="panel-block">
        <ul class="winrate">
          <li :class="{'winrate-item': true, 'winrate-item-action': selectedFaction.id===item.id}"
              v-for="(item, index) in factionIcons"
              :key="index"
              @click="handleIconsClick(item)">
            <div class="icon">
              <img :src="item.image" mode="aspectFit">
              <p>{{item.name}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="panel-block">
        <DeckTable :tableName="selectedFaction.name" :date="updateDate" :tableTitle="tableTitle" :tableData="factionDeckData"
                   @cellClick="handleDeckNameClick" ref="deckTable"></DeckTable>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import {getWinRateData} from "@/api/dbapi";
import DeckTable from '@/components/DeckTable'

export default {
  components: {
    DeckTable
  },
  data() {
    return {
      factionFrames: null,
      factionIcons: null,
      selectedFaction: {id: 'Druid', name: '德鲁伊'},
      factionDeckData: [],
      tableTitle: [
        {id: 'winrate', name: '胜率'},
        {id: 'popularity', name: '热度'},
        {id: 'games', name: '对局总数'}
      ],
      updateDate: null,
    }
  },
  methods: {
    genFactionIcons() {
      this.factionFrames = []
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionFrames.push({id: key, image: utils.faction[key].deckIcon})
          this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image1})
        }
      }
    },
    genWinRateData(orderBy='games') {
      getWinRateData({faction: this.selectedFaction.id}, orderBy).then(res => {
        let otherDeckIndex = 0
        let decksName = this.$store.state.cards.decksName
        this.factionDeckData = []
        this.updateDate = res[0].create_time
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
            this.factionDeckData.push(formatData)
          }
        }
        // 默认排序下将'其他'放到最后
        let temp = this.factionDeckData[otherDeckIndex]
        temp.deckName = '其他'
        this.factionDeckData.splice(otherDeckIndex, 1)
        this.factionDeckData.push(temp)
        wx.stopPullDownRefresh();
      }).catch(err => {
        console.log(err)
        wx.stopPullDownRefresh();
      })
    },
    handleFactionClick(item) {
      wx.navigateTo({
        url: `/pages/decks/decksList/main?id=${item.id}`
      })
    },
    handleIconsClick(item) {
      this.selectedFaction = {id: item.id, name: item.name}
      this.genWinRateData()
      this.$refs.deckTable.sortTableData()
    },
    handleDeckNameClick(item) {
      let queryId = item.ename
      if(item.ename.toLowerCase() === 'other') {
        queryId = this.selectedFaction.id
      }
      wx.navigateTo({
        url: `/pages/decks/decksList/main?id=${this.selectedFaction.id}&name=${queryId}`
      })
    }
  },
  mounted() {
    this.genFactionIcons()
    this.genWinRateData()
  },
  onPullDownRefresh() {
    this.genWinRateData()
  },
}
</script>
<style lang="scss" scoped>
@import '../../style/color';
.container {
  position: relative;
  width: 100%;
  height: 100%;
  .panel{
    padding: 6px 8px;
    .panel-header {
      width: 100%;
      font-size: 14px;
      .icon {
        padding-right: 4px;
        color: $palette-red;
      }
    }
  }
  .panel-block {
    width: 100%;
    margin-top: 8px;
    ul {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;
    }
    .faction-item {
      width: 33%;
      img {
        width: 100%;
        height: 105rpx;
      }
    }
    .winrate {
      .winrate-item {
        position: relative;
        width: 20%;
        height: 120rpx;
        font-size: 12px;
        color: white;
        text-align: center;
        .icon{
          position: absolute;
          width: 100rpx;
          height: 100rpx;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            box-sizing: border-box;
            border: 2px solid transparent;
          }
          p {
            position: absolute;
            width: 92%;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 0 0 6px 6px;
            background-color: rgba(0, 0, 0, .6);
          }
        }
      }
      .winrate-item-action {
        img {
          border: 2px solid $palette-orange!important;
        }
      }
    }
  }
  .color-green {
    color: green;
  }
  .color-red {
    color: $palette-orange;
  }
  .table-icon {
    font-size: 12px;
    margin-left: 5px;
  }
}
</style>
