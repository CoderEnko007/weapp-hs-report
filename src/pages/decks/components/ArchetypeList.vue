<template>
  <div class="archetype-container">
    <div class="headline">
      <span class="title">职业形态</span>
      <div class="head-picker">
        <picker mode="selector" :value="rangePicker.selectedItem" :range="rangePickerList" @change="handleRankRangeChange">
          <span class='selector-item'>{{rangePicker.list[rangePicker.selectedItem].text}}</span>
          <span class="iconfont" :style="{'vertical-align': 'middle'}">&#xe668;</span>
        </picker>
      </div>
      <span class="right-meta">标准模式</span>
    </div>
    <div class="panel-faction">
      <HeroesPanel :dataList="factionIcons" :selected="selectedFaction.id" @itemClick="handleIconsClick"></HeroesPanel>
    </div>
    <div class="panel-block">
      <div class="filter-item">
        <div class="table-td table-name"><span>{{selectedFaction.name}}形态</span></div>
      </div>
      <div class="filter-item" v-for="(item, index) in orderFilter" :key="index" @click="handleOrderChange(item)">
        <div class="order-item">
          <span>{{item.name}}</span>
          <img v-if="orderBy && orderBy === item.id" :src="upOrder" mode="aspectFit">
          <img v-else-if="orderBy === '-'+item.id" :src="downOrder" mode="aspectFit">
          <img v-else :src="normalOrder" mode="aspectFit">
        </div>
      </div>
    </div>
    <div class="panel-list">
      <scroll-view scroll-y='true'
                   @scrolltolower='scrollToBottom'
                   @scrolltoupper="scrollToTop"
                   :style="{height: winHeight-navHeight-194+'px'}">
        <div class="table">
          <div class="table-tr content" v-for="(item, index) in genTableData" :key="index" @click="handleItemClick(item)">
            <div class="table-td col-1st">
              <img :src="genFactionIcon" mode="aspectFit">
              <div class="deckName">
                <p class="cname">{{item.deckName}}</p>
                <p class="ename">{{item.ename}}</p>
              </div>
            </div>
            <div class="table-td text-center col-other"><span>{{item.games}}</span></div>
            <div class="table-td text-center col-other"><span>{{item.popularity}}%</span></div>
            <div class="table-td text-center col-other col-last color-green" :class="{'color-red': item.winrate<50}">
              <span :style="{'font-weight': 'bold'}">{{item.winrate}}%</span>
            </div>
          </div>
        </div>
        <ZanLoadmore v-if="loading" v-bind="{ loading: true }" />
        <ZanLoadmore v-else v-bind="{ nomore: true }" />
      </scroll-view>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import HeroesPanel from '@/components/HeroesPanel'
import DeckTable from '@/components/DeckTable'
import {getWinRateData} from "@/api/dbapi";
import ZanLoadmore from '@/components/loadmore'

export default {
  name: 'ArchetypeList',
  props: ['listData'],
  components: {
    HeroesPanel,
    DeckTable,
    ZanLoadmore
  },
  data() {
    return {
      orderBy: '',
      normalOrder: '/static/icons-v2/rank-normal.png',
      upOrder: '/static/icons-v2/rank-up.png',
      downOrder: '/static/icons-v2/rank-down.png',
      factionIcons: [],
      selectedFaction: {id: 'Druid', name: '德鲁伊', data: []},
      orderFilter: [
        {id: 'games', name: '对局数'},
        {id: 'popularity', name: '热度'},
        {id: 'winrate', name: '胜率'},
      ],
      rangePicker: {
        selectedItem: 0,
        list: [
          {text: '全分段', rank_range: 'All'},
          {text: 'R5-R1分段', rank_range: 'One_Through_Five'},
          {text: '传说分段', rank_range: 'Legend_Only'}
        ]
      },
      loading: true,
    }
  },
  computed: {
    ...mapGetters([
      'decksName',
      'navHeight',
      'winWidth',
      'winHeight'
    ]),
    genTableData() {
      this.sortTableData()
      return this.selectedFaction.data
    },
    genFactionIcon() {
      return utils.faction[this.selectedFaction.id].image
    },
    rangePickerList() {
      return this.rangePicker.list.map(item => {
        return item.text
      })
    }
  },
  methods: {
    compareFunction(key) {
      return function(obj1, obj2) {
        let formatKey = key.replace('-', '')
        if (key.indexOf('-') !== -1) {
          return obj2[formatKey]-obj1[formatKey]
        } else {
          return obj1[formatKey]-obj2[formatKey]
        }
      }
    },
    swapItems(arr, index) {
      arr.push(arr[index]);
      arr.splice(index,1);
      return arr;
    },
    sortTableData() {
      if (this.orderBy) {
        this.selectedFaction.data.sort(this.compareFunction(this.orderBy))
        let dataList = this.selectedFaction.data
        let otherIndex = null
        for (let index in dataList) {
          if (dataList.hasOwnProperty(index)) {
            if (dataList[index].ename === 'Other') {
              otherIndex = index
            }
          }
        }
        if (otherIndex) {
          this.swapItems(this.selectedFaction.data, otherIndex)
        }
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
    genWinRateData() {
      wx.showNavigationBarLoading();
      let params = {
        faction: this.selectedFaction.id,
        rankRange: this.rangePicker.list[this.rangePicker.selectedItem].rank_range
      }
      getWinRateData(params).then(res => {
        let otherDeckIndex = null
        this.selectedFaction.data = []
        for (let index in res) {
          if (res.hasOwnProperty(index)) {
            let ename = res[index].archetype
            if (ename.toLowerCase() === 'other') {
              otherDeckIndex = index //记录other信息的序号，后面将其放置到最后
              ename = this.selectedFaction.id
            }
            let name = this.decksName.filter(item => {
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
        if (otherDeckIndex) {
          let temp = this.selectedFaction.data[otherDeckIndex]
          temp.deckName = '其他'
          this.selectedFaction.data.splice(otherDeckIndex, 1)
          this.selectedFaction.data.push(temp)
        }
        this.loading = false
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }).catch(err => {
        this.loading = false
        console.log(err)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      })
    },
    handleIconsClick(item) {
      this.selectedFaction = {id: item.id, name: item.name, data: []}
      this.genWinRateData()
    },
    handleOrderChange(item) {
      if (this.orderBy.indexOf(item.id)>=0) {
        this.orderBy = this.orderBy.split('')[0]==='-'?item.id:'-'+item.id
      } else {
        this.orderBy = '-'+item.id
      }
      this.sortTableData()
    },
    handleItemClick(item) {
      if (item.ename === 'Other') {
        wx.showToast({
          title: '还没有套牌的详细数据。',
          icon: 'none',
          duration: 2000
        })
      } else{
        wx.navigateTo({
          url: `/pages/decks/archetypeDetail/main?name=${item.ename}`
        })
      }
    },
    handleRankRangeChange(e) {
      this.rangePicker.selectedItem = e.mp.detail.value
      this.genWinRateData()
    },
  },
  mounted() {
    this.genFactionIcons()
    this.genWinRateData()
  },
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';
.archetype-container {
  .headline {
    margin: 0 30rpx;
  }
  .panel-faction {
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
      .table-name {
        width: 265rpx;
        color: #999;
        box-sizing: border-box;
        padding-left: 33rpx;
      }
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
    }
  }
  .panel-list {
    .table {
      display: table;
      width: 100%;
      border-collapse: collapse;
      .table-tr {
        display: table-row;
        width: 100%;
        font-size: 13px;
        .table-td {
          display: table-cell;
          span {
            height: 60rpx;
            line-height: 60rpx;
          }
        }
        .col-1st {
          position: relative;
          width: 265rpx;
          text-align: left;
          box-sizing: border-box;
          padding-left: 30rpx;
          img {
            position: absolute;
            width: 64rpx;
            height: 64rpx;
            top: 50%;
            transform: translateY(-50%);
          }
          .deckName {
            position: absolute;
            display: inline-block;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 90rpx;
            p.cname {
              height: 37rpx;
              line-height: 37rpx;
            }
            p.ename {
              width:180rpx;
              height: 30rpx;
              line-height: 30rpx;
              font-size: 11px;
              color: #999;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
            }
          }
        }
        .col-last {
          padding-right: 30rpx;
        }
        .col-other {
          width: 120rpx;
        }
      }
      .header {
        height: 86rpx;
        line-height: 86rpx;
        border-bottom: 1rpx solid #eee;
        .table-name {
          width: 265rpx;
          color: #999;
          box-sizing: border-box;
          padding-left: 33rpx;
        }
        .order {
          position: relative;
          font-size: 13px;
          color: #333;
          img {
            position:absolute;
            width: 22rpx;
            height: 36rpx;
            line-height:26rpx;
            margin-left: 5rpx;
            /*right:7rpx;*/
            top:50%;
            transform:translateY(-50%);
          }
        }
      }
      .content {
        background-color: #fff;
        border-bottom:1rpx solid #eee;
        &:active  {
          background: #eee;
        }
        .table-td {
          height: 120rpx;
          line-height: 120rpx;
        }
      }
      .text-center {
        text-align: center;
      }
      .float-right {
        float: right;
        margin-right: 20px;
      }
    }
  }
}
</style>
