<template>
  <div class="decks-container">
    <div class="panel-filter">
      <!--<div class="head-tab">-->
        <!--<HeadTab :tabList="tabList.list" :selectedItem="tabList.selectedItem" @itemClick="handleHeadTabClick"></HeadTab>-->
      <!--</div>-->
      <div class="headline">
        <span class="title">职业套牌</span>
        <div class="head-picker">
          <picker mode="selector" :value="tabList.selectedItem" :range="timePickerList" @change="handleHeadTabClick">
            <span class='selector-item'>{{tabList.list[tabList.selectedItem].text}}</span>
            <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
          </picker>
        </div>
        <div class="btn-group">
          <div class="btn-block"
               v-for="(item, index) in deckMode"
               :key="index"
               @click="modeBtnClick(item)">
            <img class="btn-img" :src="decksFilter.mode===item.mode?item.active_icon:item.icon" mode="aspectFit">
            <button class="c-button" :class="decksFilter.mode===item.mode?'btn-active':''">{{item.text}}</button>
            <div class="separator" v-if="index !== 1">|</div>
          </div>
        </div>
      </div>
      <div class="faction-filter">
        <HeroesPanel :selected="selectedFaction" :dataList="factionIcons" @itemClick="handleIconsClick"></HeroesPanel>
      </div>
      <div class="panel-block">
        <div class="filter-item">
          <picker mode="selector" :value="selectedDeckIndex" :range="pickerList" @change="handlePickerChange">
            <span class='selector-item'>{{pickerList[selectedDeckIndex]}}</span>
            <img class="picker-icon" :src="filterIcon" mode="aspectFit">
          </picker>
        </div>
        <div class="filter-item" v-for="(item, index) in genOrderFilter" :key="index" @click="handleOrderChange(item)">
          <div class="order-item">
            <span>{{item.name}}</span>
            <img v-if="decksFilter.order && decksFilter.order === item.id" :src="upOrder" mode="aspectFit">
            <img v-else-if="decksFilter.order === '-'+item.id" :src="downOrder" mode="aspectFit">
            <img v-else :src="normalOrder" mode="aspectFit">
          </div>
        </div>
      </div>
    </div>
    <div class="panel panel-list">
        <DecksBoard :list="deckList"
                    :last_30_days="decksFilter.last_30_days"
                    @itemClick="handleDeckClick"
                    @scrollToBottom="scrollToBottom"
                    :loading="more"
                    :nodata="!deckList.length"></DecksBoard>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import { getDeckList } from "@/api/dbapi";
import HeadTab from '@/components/HeadTab'
import HeroesPanel from '@/components/HeroesPanel'
import DecksBoard from '@/components/DecksBoard-v2';

const defaultFilter = {
  faction: '',
  archetype: 'all',
  mode: 'Standard',
  last_30_days: false,
  order: '-game_count'
}
const defaultOrder = [
  {id: 'game_count', name: '对局数'},
  {id: 'dust_cost', name: '合成花费'},
  {id: 'win_rate', name: '胜率'},
]
const last30dOrder = [
  {id: 'real_game_count', name: '对局数'},
  {id: 'dust_cost', name: '合成花费'},
  {id: 'real_win_rate', name: '胜率'},
]
export default {
  name: 'DecksList',
  components: {
    HeadTab,
    HeroesPanel,
    DecksBoard,
  },

  data() {
    return {
      deckList: [],
      //其他参数
      normalOrder: '/static/icons-v2/rank-normal.png',
      upOrder: '/static/icons-v2/rank-up.png',
      downOrder: '/static/icons-v2/rank-down.png',
      filterIcon: '/static/icons-v2/filter-active.png',
      //过滤器参数
      tabList: {
        selectedItem: 0,
        list: [
          {text: '当前赛季卡组', last_30_days: false},
          {text: '最近30天卡组', last_30_days: true}
        ]
      },
      deckMode: utils.rankMode,
      decksFilter: Object.assign({}, defaultFilter),
      //职业选择组件参数
      selectedFaction: '',
      factionIcons: null,
      //卡组选择栏参数
      selectedDeckIndex: 0,
      deckPickerList: [],
      //列表参数
      more: true,
      page: 0,
    }
  },
  computed: {
    ...mapGetters([
      'decksName',
      'winWidth',
      'winHeight'
    ]),
    timePickerList() {
      return this.tabList.list.map(item => {
        return item.text
      })
    },
    pickerList() {
      return this.deckPickerList.map(item => {
        return item.name
      })
    },
    genOrderFilter() {
      if (this.decksFilter.last_30_days) {
        return last30dOrder
      } else {
        return defaultOrder
      }
    }
  },
  methods: {
    resetPageData() {
      this.tabList.selectedItem = 0
      this.decksFilter = Object.assign({}, defaultFilter)
      // this.selectedFaction = 'Druid'
      this.selectedDeckIndex = 0
      this.deckList = []
    },
    handleHeadTabClick(e) {
      this.deckList = []
      this.tabList.selectedItem = e.mp.detail.value
      this.decksFilter.last_30_days = this.tabList.list[this.tabList.selectedItem].last_30_days
      this.decksFilter.archetype = 'all'
      this.genDeckList(true)
      this.genPickerList()
    },
    modeBtnClick(item) {
      this.decksFilter.mode = item.mode
      this.decksFilter.archetype = 'all'
      this.genPickerList()
      this.genDeckList(true)
    },
    handleIconsClick(item) {
      if (this.selectedFaction === item.id) {
        this.selectedFaction = ''
      } else {
        this.selectedFaction = item.id
      }
      this.decksFilter.faction = this.selectedFaction
      this.decksFilter.archetype = 'all'
      this.genPickerList()
      this.genDeckList(true)
    },
    handleOrderChange(item) {
      if (this.decksFilter.order.indexOf(item.id)>=0) {
        this.decksFilter.order = this.decksFilter.order.split('')[0]==='-'?item.id:'-'+item.id
      } else {
        this.decksFilter.order = '-'+item.id
      }
      this.genDeckList(true)
    },
    handlePickerChange(e) {
      this.selectedDeckIndex = e.mp.detail.value
      this.decksFilter.archetype = this.deckPickerList[this.selectedDeckIndex].id
      this.genDeckList(true)
    },
    handleDeckClick(item) {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/main?id=${item.id}&mode=${this.decksFilter.mode}`
      })
    },

    genFactionIcons() {
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image})
        }
      }
    },
    genPickerList() {
      this.selectedDeckIndex = 0
      console.log(this.decksFilter.mode, this.decksFilter.last_30_days, this.selectedFaction)
      let filterDecksName = this.decksName.filter(v => {
        if (this.selectedFaction!=='' && v.faction !== this.selectedFaction) {
          return false
        }
        if (v.ename === v.faction) {
          return false
        }
        if (this.decksFilter.mode === 'Standard' && this.decksFilter.last_30_days === false) {
          return v.std_ld
        } else if (this.decksFilter.mode === 'Standard' && this.decksFilter.last_30_days === true) {
          return v.std_l30
        } else if (this.decksFilter.mode === 'Wild' && this.decksFilter.last_30_days === false) {
          return v.wild_ld
        } else if (this.decksFilter.mode === 'Wild' && this.decksFilter.last_30_days === true) {
          return v.wild_l30
        }
      })
      this.deckPickerList = filterDecksName.map(v => {
        return {
          id: v.ename,
          name: v.cname
        }
      })
      this.deckPickerList.unshift({id: 'all', name: '全部类型'})
      this.deckPickerList.push({id: this.selectedFaction, name: '其他'})
      console.log(this.deckPickerList)
    },
    genDeckList(init) {
      if (init) {
        this.page = 0
        this.more = true
        this.deckList = []
      }
      wx.showNavigationBarLoading();
      let order = this.decksFilter.order.replace('-', '')
      if (this.decksFilter.last_30_days) {
        for (let index in defaultOrder) {
          if (defaultOrder.hasOwnProperty(index)) {
            if (defaultOrder[index].id === order) {
              this.decksFilter.order = this.decksFilter.order.replace(order, last30dOrder[index].id)
            }
          }
        }
      } else {
        for (let index in last30dOrder) {
          if (last30dOrder.hasOwnProperty(index)) {
            if (last30dOrder[index].id === order) {
              this.decksFilter.order = this.decksFilter.order.replace(order, defaultOrder[index].id)
            }
          }
        }
      }
      getDeckList(this.decksFilter, 12, this.page, this.decksFilter.order).then(res => {
        if (init) {
          this.deckList = utils.translateDeckName(res.objects, this.$store.state.cards.decksName)
          wx.stopPullDownRefresh();
        } else {
          let temp = utils.translateDeckName(res.objects, this.$store.state.cards.decksName)
          this.deckList = this.deckList.concat(temp)
        }
        this.deckList.map(item => {
          item.win_rate = parseFloat(item.win_rate).toFixed(1)
          item.real_win_rate = parseFloat(item.real_win_rate).toFixed(1)
          return item
        })
        if (this.deckList.length >= res.meta.total_count) {
          this.more = false
        }
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      }).catch(err => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
        console.log(err)
      })
    },
    scrollToBottom() {
      if (!this.more) return false
      this.page += 1
      this.genDeckList(false)
    },
  },
  mounted() {
    this.resetPageData()
    this.genFactionIcons()
    this.genPickerList()
    this.genDeckList(true)
  },
}
</script>
<style lang="scss" scoped>
  @import '../../../style/color';
  .container {
    width: 100%;
    .head-tab {
      margin: 30rpx 30rpx 18rpx;
    }
    .panel-filter {
      position: fixed;
      width: 100%;
      background-color: white;
      z-index: 1;
      .headline {
        margin: 0 30rpx;
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
      .faction-filter {
        margin: 0 30rpx 20rpx;
      }
      .panel-block {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 86rpx;
        padding: 0 30rpx;
        /*box-shadow: 0 3px 2px -3px #000;*/
        border-bottom: 1rpx solid #eee;
        box-sizing: border-box;
        .filter-item {
          position: relative;
          height: 100%;
          line-height: 86rpx;
          font-size: 13px;
          .picker-icon {
            position:absolute;
            top:50%;
            transform:translateY(-50%);
            width: 25rpx;
            height: 25rpx;
            margin-left: 10rpx;
          }
          .selector-item {
            text-align: center;
            font-size: 13px;
            color: $palette-blue;
          }
          .order-item {
            position: relative;
            width: 134rpx;
            text-align: center;
            img {
              position:absolute;
              width: 22rpx;
              height: 36rpx;
              margin-left: 5rpx;
              top:48%;
              transform:translateY(-50%);
            }
          }
          ._picker {
            width: 285rpx;
          }
        }
      }
    }
    .panel-list {
      /*padding-top: 370rpx;*/
      padding-top: 275rpx;
      z-index: -1;
      /*scroll-view {*/
        /*height: 100%;*/
      /*}*/
    }
  }
</style>
