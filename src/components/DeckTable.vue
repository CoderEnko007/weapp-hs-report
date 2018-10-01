<template>
<div class="data-table" :style="{'min-height': 350+'px'}">
  <div class="table">
    <div class="table-tr faction"><span>{{tableName}}</span><span class="float-right">更新于：{{date}}</span></div>
    <div class="table-tr header">
      <div class="table-td text-center col-1st"><span>套牌类型</span></div>
      <div class="table-td text-center col-other"
           v-for="(item, index) in tableTitle"
           :key="index"
           @click="handleOrderClick(item)">
        <span>{{item.name}}</span><span class="table-icon iconfont">&#xe6c0;</span>
      </div>
    </div>
    <div class="table-tr content" v-for="(item, index) in tableData" :key="index">
      <div class="table-td text-center col-1st" @click="handleCellNameClick(item)"><p>{{item.deckName}}</p></div>
      <div class="table-td text-center col-other color-green" :class="{'color-red': item.winrate<50}"><span>{{item.winrate}}%</span></div>
      <div class="table-td text-center col-other"><span>{{item.popularity}}%</span></div>
      <div class="table-td text-center col-other"><span>{{item.games}}</span></div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'DeckTable',
  props: ['tableName', 'date', 'tableTitle', 'tableData'],
  data() {
    return {
      orderBy: ''
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
    handleCellNameClick(item) {
      this.$emit('cellClick', item)
    },
    sortTableData() {
      this.tableData.sort(this.compareFunction(this.orderBy))
    }
  },
  watch: {
    tableData: {
      handler: function (val) {
        this.sortTableData()
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
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
  .float-right {
    float: right;
    margin-right: 20px;
  }
}
</style>
