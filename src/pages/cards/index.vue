<template>
  <div class="container">
    <div class="search-bar">
      <SearchBar @handleConfirm="handleSearch" placeholder="请输入卡牌名称、规则或者属性"></SearchBar>
    </div>
    <div class="cost_filter">
      <ul class="cards_cost">
        <li v-for="i in costList" :key="i.cost">
          <a :class="{type_icon: true, type_icon_active: i.cost===filter.cost}" @click="handleCostClick(i.cost)">
            <img class="cost_num" :src="i.icon" mode="aspectFit">
          </a>
        </li>
      </ul>
    </div>
    <div class="filter_tabbar">
      <ul class="filter_tab_list">
        <li v-for="(item, index) in filterTabBar"
            :key="index"
            @click="handleFilterBarClick(item)"
            :class="{active_item: selectedFilterTabItem===item.name}">
          <span class="filter_tab_item">{{filterTabBar[index].selected}}</span>
        </li>
      </ul>
      <div class="filter_item_menu">
        <div class="menu_block" v-show="selectedFilterTabItem!==null">
          <FilterMenu v-for="(filter, index) in filterTabBar"
                      :filter="filter"
                      :key="index"
                      :show="selectedFilterTabItem===filter.name"
                      @filterMenuClick="handleFilterMenuClick"
          ></FilterMenu>
        </div>
      </div>
    </div>
    <div class="cards_list" :style="{height:600+'px'}">
      <div class="cards_list">
        <div :class="{mask: true, gray_bgc: selectedFilterTabItem!==null}"></div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import SearchBar from '@/components/SearchBar'
import FilterMenu from '@/components/FilterMenu'
import {getSeriesData} from "@/api/dbapi";

const defaultFilter = {
  cost: null,
  faction: null,
  mode: null,
  rarity: null,
  series: null,
}
export default {
  components: {
    SearchBar,
    FilterMenu
  },
  data() {
    return {
      filter: defaultFilter,
      costList: [
        {cost: 0, icon: '/static/mana/0.png'},
        {cost: 1, icon: '/static/mana/1.png'},
        {cost: 2, icon: '/static/mana/2.png'},
        {cost: 3, icon: '/static/mana/3.png'},
        {cost: 4, icon: '/static/mana/4.png'},
        {cost: 5, icon: '/static/mana/5.png'},
        {cost: 6, icon: '/static/mana/6.png'},
        {cost: 7, icon: '/static/mana/7+.png'}
      ],
      filterTabBar: [
        {name: 'faction', text: '职业', items: [], selected: '职业'},
        {name: 'mode', text: '游戏模式', items: [], selected: '游戏模式'},
        {name: 'rarity', text: '稀有度', items: [], selected: '稀有度'},
        {name: 'series', text: '扩展包', items: [], selected: '扩展包'}
      ],
      selectedFilterTabItem: null,
    }
  },
  computed: {
    showMenu() {
      return this.selectedFilterTabItem != null
    }
  },
  methods: {
    genFilterMenuItems() {
      let array = utils.faction
      array.unshift({id: 'all', name: '全部职业'})
      this.filterTabBar[0].items = array
      array = utils.mode
      array.unshift({id: 'all', name: '全部模式'})
      this.filterTabBar[1].items = utils.mode
      array = utils.rarity
      array.unshift({id: 'all', name: '全部稀有度'})
      this.filterTabBar[2].items = array
      this.filterTabBar[3].items = array
      for (let filter of this.filterTabBar) {
        if (filter.items.length % 2) {
          filter.items.push({})
        }
      }
    },
    handleFilterBarClick(item) {
      this.selectedFilterTabItem = this.selectedFilterTabItem === item.name?null:item.name
    },
    handleCostClick(item) {
      this.filter.cost = this.filter.cost === item?null:item
    },
    handleSearch(value) {
      console.log(value)
    },
    handleFilterMenuClick(filter) {
      this.selectedFilterTabItem = null
      switch(filter.name) {
        case 'faction': this.filter.faction = filter.item; this.filterTabBar[0].selected=filter.item.name; break
        case 'mode': this.filter.mode = filter.item; this.filterTabBar[1].selected=filter.item.name; break
        case 'rarity': this.filter.rarity = filter.item; this.filterTabBar[2].selected=filter.item.name; break
        case 'series': this.filter.series = filter.item; this.filterTabBar[3].selected=filter.item.name; break
        default: console.log(filter.name+' not found');
      }
      console.log(this.filter)
    },
  },
  mounted() {
    this.genFilterMenuItems()
  }
}
</script>
<style lang="scss" scoped>
.cost_filter {
  position: relative;
  padding: 0 15rpx;
  .cards_cost {
    display: flex;
    justify-content: space-around;
    width: 100%;
    li {
      .type_icon {
        position: relative;
        width: 27px;
        height: 27px;
        display: inline-block;
        background: url('../../../static/mana/mana.png') no-repeat;
        background-size: 100% 100%;
      }
      .type_icon_active {
        position: relative;
        width: 27px;
        height: 27px;
        display: inline-block;
        background: url('../../../static/mana/mana_active.png') no-repeat;
        background-size: 100% 100%;
      }
      .cost_num {
        position: absolute;
        width: 22px;
        height: 17px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
.filter_tabbar {
  position: relative;
  width: 100%;
  .filter_tab_list {
    display: flex;
    justify-content: space-around;
    width: 100%;
    font-size: 12px;
    box-shadow: 0 3px 2px -3px #000;
    li {
      width: 25%;
      height: 60rpx;
      text-align: center;
      transition: all 0.3s;
      .filter_tab_item {
        display: inline-block;
        height: 60rpx;
        line-height: 60rpx;
      }
    }
    .active_item {
      background-color: #eee;
    }
  }
}
.cards_list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.mask {
  position:absolute;
  left: 0;
  top:0;
  display: block;
  width:100%;
  height: 100%;
  transition: all .2s;
}
.gray_bgc {
  background-color: rgba(0, 0, 0, 0.3);
}

.filter_item_menu {
  overflow: hidden;
  .menu_block {
    position: absolute;
    width: 100%;
    z-index: 1;
  }
}
@keyframes slidown{
  from{
    transform:  translateY(-100%);
  }
  to{
    transform:  translateY(0%);
  }
}
.slidown{
  display: block;
  animation: slidown .5s ease-out both;
}
@keyframes slidup{
  from{
    transform:  translateY(0%);
  }
  to{
    transform:  translateY(-100%);
  }
}
.slidup{
  display: block;
  animation: slidup .3s linear both;
}
</style>
