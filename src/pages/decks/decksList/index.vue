<template>
  <div class="container">
    <div class="panel panel-filter">
      <ul class="panel-block factions">
        <li :class="{'factions-item': true, 'factions-item-action': selectedFaction===item.id}"
            v-for="(item, index) in factionIcons"
            :key="index"
            @click="handleIconsClick(item)">
          <div class="icon">
            <img :src="item.image" alt="item.id" mode="aspectFit">
          </div>
        </li>
      </ul>
      <div class="panel-block">
        <div class="filter-item">
          <picker mode="selector" :value="selectedDeckIndex" :range="pickerList" @change="handlePickerChange">
            <span>{{pickerList[selectedDeckIndex]}}</span>
          </picker>
        </div>
        <div class="filter-item" v-for="(item, index) in orderFilter" :key="index" @click="handleOrderChange(item)">
          <p>{{item.name}} <span class="iconfont">&#xe6c0</span></p>
        </div>
      </div>
    </div>
    <div class="panel panel-list">
      <DecksBoard :list="deckList" @itemClick="handleDeckClick"></DecksBoard>
      <ZanLoadmore v-if="!deckList.length" v-bind="{ nodata: true }" />
      <ZanLoadmore v-else-if="more" v-bind="{ loading: true }" />
      <ZanLoadmore v-else v-bind="{ nomore: true }" />
    </div>
  </div>
</template>
<script>
import {getDeckList} from "@/api/dbapi";
import DecksBoard from '@/components/DecksBoard';
import ZanLoadmore from '@/components/loadmore'
import utils from '@/utils'

const defaultFilter = {
  faction: 'Druid',
  archetype: 'all',
  order: '-game_count'
}
export default {
  components: {
    DecksBoard,
    ZanLoadmore
  },
  data() {
    return {
      selectedFaction: '',
      factionIcons: null,
      selectedDeckIndex: 0,
      deckPickerList: [],
      decksName: [],
      deckList: [],
      orderFilter: [
        {id: 'dust_cost', name: '合成花费'},
        {id: 'win_rate', name: '胜率'},
        {id: 'game_count', name: '对局数'}
      ],
      decksFilter: Object.assign({}, defaultFilter),
      page: 0,
      more: true
    }
  },
  computed: {
    pickerList() {
      return this.deckPickerList.map(item => {
        return item.name
      })
    }
  },
  methods: {
    genDeckList(init) {
      if (init) {
        this.page = 0
        this.more = true
      }
      wx.showNavigationBarLoading();
      getDeckList(this.decksFilter, 12, this.page, this.decksFilter.order).then(res => {
        if (init) {
          this.deckList = res.objects
          wx.stopPullDownRefresh();
        } else {
          this.deckList = this.deckList.concat(res.objects)
        }
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
    genPickerList() {
      this.selectedDeckIndex = 0
      this.deckPickerList = [{id: 'all', name: '全部类型'}]
      for (let item of this.decksName) {
        if (item.faction === this.selectedFaction && item.ename !== item.faction) {
          this.deckPickerList.push({id: item.ename, name: item.cname})
        }
      }
      this.deckPickerList.push({id: this.selectedFaction, name: '其他'})
    },
    genFactionIcons() {
      this.factionIcons = []
      for (let key in utils.faction) {
        if (utils.faction.hasOwnProperty(key)) {
          this.factionIcons.push({id: key, name: utils.faction[key].name, image: utils.faction[key].image1})
        }
      }
    },
    handleIconsClick(item) {
      this.selectedFaction = item.id
      this.decksFilter.faction = item.id
      this.decksFilter.archetype = 'all'
      this.genPickerList()
      this.genDeckList(true)
    },
    handlePickerChange(e) {
      this.selectedDeckIndex = e.mp.detail.value
      this.decksFilter.archetype = this.deckPickerList[this.selectedDeckIndex].id
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
    handleDeckClick(item) {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/main?id=${item.id}`
      })
    }
  },
  mounted() {
    if (this.$root.$mp.query.name) {
      this.decksFilter.archetype = this.$root.$mp.query.name
    }
    this.selectedFaction = this.$root.$mp.query.id
    this.decksFilter.faction = this.$root.$mp.query.id
    this.decksName = this.$store.state.cards.decksName
    this.genFactionIcons()
    this.genPickerList()
    this.genDeckList(true)
  },
  onUnload() {
    this.decksFilter = Object.assign({}, defaultFilter)
    this.deckList = []
  },
  onPullDownRefresh() {
    this.genDeckList(true)
  },
  onReachBottom() {
    if (!this.more) return false
    this.page += 1
    this.genDeckList(false)
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
@import '../../../style/color';
.container {
  width: 100%;
  .panel-filter {
    position: fixed;
    width: 100%;
    background-color: white;
    z-index: 1;
    ul.factions {
      padding: 0 12rpx;
      box-shadow: none;
      .factions-item {
        position: relative;
        width: 8%;
        height: 80rpx;
        .icon {
          position: absolute;
          width: 70rpx;
          height: 70rpx;
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
        }
      }
      .factions-item-action img {
        border: 2px solid $palette-orange!important;
      }
    }
    .panel-block {
      display: flex;
      justify-content: space-around;
      width: 100%;
      box-shadow: 0 3px 2px -3px #000;
      box-sizing: border-box;
      .filter-item {
        width: 25%;
        height: 60rpx;
        font-size: 12px;
        ._picker{
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
        }
        p {
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
          font-size: 12px;
        }
      }
    }
  }
  .panel-list {
    padding-top: 125rpx;
    z-index: -1;
  }
}
</style>
