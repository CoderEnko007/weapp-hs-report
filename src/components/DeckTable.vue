<template>
<div class="data-table" :style="{'min-height': 350+'px'}">
  <div class="table">
    <div class="table-tr header">
      <div class="table-td vs-name"><span>对阵{{selectedFaction.name}}</span></div>
      <div class="table-td text-center col-other order"
           v-for="(item, index) in tableTitle"
           :key="index"
           @click="handleOrderClick(item)">
        <span>{{item.name}}</span>
        <img v-if="orderBy !== '' && orderBy === item.id" :src="upOrder" mode="aspectFit">
        <img v-else-if="orderBy === '-'+item.id" :src="downOrder" mode="aspectFit">
        <img v-else :src="normalOrder" mode="aspectFit">
      </div>
    </div>
    <div class="table-tr content" v-for="(item, index) in genTableData" :key="index" @click="handleItemClick(item)">
      <div class="table-td text-center col-1st">
        <img :src="genFactionIcon" mode="aspectFit">
        <div class="deckName">
          <p class="cname">{{item.deckName}}</p>
          <p class="ename">{{item.ename}}</p>
        </div>
      </div>
      <div class="table-td text-center col-other"><span>{{item.games}}</span></div>
      <div class="table-td text-center col-other"><span>{{item.popularity}}%</span></div>
      <div class="table-td text-center col-other color-green" :class="{'color-red': item.winrate<50}">
        <span :style="{'font-weight': 'bold'}">{{item.winrate}}%</span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import utils from '@/utils'

export default {
  name: 'DeckTable',
  props: ['selectedFaction', 'date', 'tableTitle', 'tableData'],
  data() {
    return {
      orderBy: '',
      normalOrder: '/static/icons-v2/rank-normal.png',
      upOrder: '/static/icons-v2/rank-up.png',
      downOrder: '/static/icons-v2/rank-down.png'
    }
  },
  computed: {
    genTableData() {
      this.sortTableData()
      return this.tableData
    },
    genFactionIcon() {
      console.log(this.selectedFaction)
      return utils.faction[this.selectedFaction.id].image
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
    handleOrderClick(item) {
      if (this.orderBy.indexOf(item.id)>=0) {
        this.orderBy = this.orderBy.split('')[0]==='-'?item.id:'-'+item.id
      } else {
        this.orderBy = '-'+item.id
      }
      this.sortTableData()
    },
    handleItemClick(item) {
      this.$emit('itemClick', item)
    },
    sortTableData() {
      if (this.orderBy) {
        this.tableData.sort(this.compareFunction(this.orderBy))
      }
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../style/color';
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
          height: 30rpx;
          line-height: 30rpx;
          font-size: 11px;
          color: #999;
        }
      }
    }
    .col-other {
      width: 120rpx;
    }
  }
  .header {
    height: 86rpx;
    line-height: 86rpx;
    border-bottom: 1rpx solid #eee;
    .vs-name {
      color: #999;
      margin-left: 3rpx;
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
        right:7rpx;
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
    .separator {
      width: 100%;
      height: 1px;
      background-color: red;
      margin-left: 90rpx;
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
</style>
