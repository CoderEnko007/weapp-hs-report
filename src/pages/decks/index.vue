<template>
  <div class="container">
    <NavBar></NavBar>
    <div class="panel faction-frame">
      <div class="headline">
        <span class="title">职业套牌</span>
        <div class="more-btn" @click="gotoDecks">
          <span class="name">查看全部套牌</span>
          <span class="iconfont">&#xe600;</span>
        </div>
      </div>
      <div class="panel-block">
        <ul class="faction">
          <li class="faction-item" v-for="(item, index) in factionFrames" :key="index" @click="handleFactionClick(item)">
            <img :src="item.image" mode="aspectFit">
            <div class="faction">
              <p class="cname">{{item.cname}}</p>
              <p class="ename">{{item.id}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="panel-list">
      <div class="headline">
        <span class="title">卡组胜率与热度</span>
        <span class="headline-meta">标准模式</span>
      </div>
      <div class="m-30">
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/utils'
import {getWinRateData} from "@/api/dbapi";
import DeckTable from '@/components/DeckTable'
import HeroesPanel from '@/components/HeroesPanel'
import NavBar from '@/components/NavBar'

export default {
  components: {
    DeckTable,
    HeroesPanel,
    NavBar
  },
  data() {
    return {
      factionFrames: null,
      factionIcons: null,
      selectedFaction: {id: 'Druid', name: '德鲁伊', data: []},
      tableTitle: [
        {id: 'games', name: '对局数'},
        {id: 'popularity', name: '热度'},
        {id: 'winrate', name: '胜率'},
      ],
      updateDate: null,
    }
  },
  computed: {
    ...mapGetters([
      'navHeight'
    ]),
  },
  methods: {
    genFactionIcons() {
      this.factionFrames = []
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionFrames.push({id: key, image: utils.faction[key].image1, cname: utils.faction[key].name})
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
    handleFactionClick(item) {
      wx.navigateTo({
        url: `/pages/decks/decksList/main?id=${item.id}`
      })
    },
    handleIconsClick(item) {
      this.selectedFaction.id = item.id
      this.selectedFaction.name = item.name
      this.genWinRateData()
    },
    handleDeckItemClick(item) {
      let queryId = item.ename
      if(item.ename.toLowerCase() === 'other') {
        queryId = this.selectedFaction.id
      }
      wx.navigateTo({
        url: `/pages/decks/decksList/main?id=${this.selectedFaction.id}&name=${queryId}`
      })
    },
    gotoDecks() {
      wx.navigateTo({
        url: `/pages/decks/decksList/main`
      })
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
  position: relative;
  width: 100%;
  height: 100%;
  .panel-block {
    ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;
    }
    .faction-item {
      position: relative;
      width: 220rpx;
      height: 110rpx;
      border: 1rpx solid #DDDDDD;
      border-radius: 20rpx;
      margin-bottom: 15rpx;
      img {
        position: absolute;
        left: 20rpx;
        top: 50%;
        width: 68rpx;
        height: 68rpx;
        transform: translateY(-50%);
        border-radius: 50%;
      }
      .faction {
        position: absolute;
        left: 101rpx;
        top: 50%;
        transform: translateY(-50%);
        .cname {
          font-size: 13px;
          color: #333333;
          line-height: 30rpx;
        }
        .ename {
          margin-top: 11rpx;
          font-size: 13px;
          color: #999999;
          line-height: 26rpx;
        }
      }
    }
  }
  .panel-list {
    .headline {
      margin: 0 30rpx;
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
  .faction-frame {
    padding: 0 30rpx;
    .headline {
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
  }
}
</style>
