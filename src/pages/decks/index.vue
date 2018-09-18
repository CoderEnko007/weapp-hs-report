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
              <img :src="item.image" alt="item.id" mode="aspectFit">
              <p>{{item.name}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="panel-block">
        <div class="table">
          <div class="table-tr faction"><span>{{selectedFaction.name}}</span><span class="float-right">更新于：{{updateDate}}</span></div>
          <div class="table-tr header">
            <div class="table-td text-center col-1st"><span>套牌类型</span></div>
            <div class="table-td text-center col-other"
                 v-for="(item, index) in tableTitle"
                 :key="index"
                 @click="handleOrderClick(item)">
              <span>{{item.name}}</span><span class="table-icon iconfont">&#xe6c0;</span>
            </div>
          </div>
          <div class="table-tr content" v-for="(item, index) in factionDeckData" :key="index">
            <div class="table-td text-center col-1st"><p>{{item.deckName}}</p></div>
            <div class="table-td text-center col-other color-green" :class="{'color-red': item.winrate<50}"><span>{{item.winrate}}%</span></div>
            <div class="table-td text-center col-other"><span>{{item.popularity}}%</span></div>
            <div class="table-td text-center col-other"><span>{{item.games}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import PieChart from '@/components/PieChart'
import {getWinRateData} from "@/api/dbapi";

export default {
  components: {
    PieChart
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
      orderBy: '',
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
            if (res[index].archetype.toLowerCase() === 'other') {
              otherDeckIndex = index //记录other信息的序号，后面将其放置到最后
            }
            let name = decksName.filter(item => {
              return item.ename === res[index].archetype && item.faction === this.selectedFaction.id
            })[0]
            let formatData = {
              deckName: name.cname?name.cname:res[index].archetype,
              games: res[index].games,
              winrate: res[index].winrate.toFixed(1),
              popularity: res[index].popularity.toFixed(1)
            }
            this.factionDeckData.push(formatData)
          }
        }
        if (!this.orderBy) {
          let temp = this.factionDeckData[otherDeckIndex]
          this.factionDeckData.splice(otherDeckIndex, 1)
          this.factionDeckData.push(temp)
        }
        wx.stopPullDownRefresh();
      }).catch(err => {
        console.log(err)
        wx.stopPullDownRefresh();
      })
    },
    handleFactionClick(item) {
      console.log(item)
      wx.navigateTo({
        url: `/pages/decksList/main?id=${item.id}`
      })
    },
    handleIconsClick(item) {
      this.selectedFaction = {id: item.id, name: item.name}
      this.orderBy = ''
      this.genWinRateData()
    },
    handleOrderClick(item) {
      if (this.orderBy.indexOf(item.id)>=0) {
        this.orderBy = this.orderBy.split('')[0]==='-'?item.id:'-'+item.id
      } else {
        this.orderBy = '-'+item.id
      }
      this.genWinRateData(this.orderBy)
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
    .table {
      display: table;
      width: 100%;
      font-size: 12px;
      font-weight: 700;
      border-collapse: collapse;
      .table-tr {
        display: table-row;
        width: 100%;
        .table-td {
          display: table-cell;
          border: 1px solid gray;
          span {
            height: 60rpx;
            line-height: 60rpx;
          }
        }
        .col-1st {
          width: 220rpx;
          p {
            width: 200rpx;
            overflow:hidden;
            word-break:keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .col-other {
          width: 176rpx;
        }
      }
      .faction {
        display: table-caption;
        color: white;
        background-color: $palette-blue;
        span {
          margin-left: 40rpx;
          height: 55rpx;
          line-height: 55rpx;
        }
      }
      .text-center {
        text-align: center;
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
  .float-right {
    float: right;
    margin-right: 20px;
  }
}
</style>
