<template>
<div class="container" v-show='show'>
  <ul class="menu-list">
    <li :class="{'menu-item': true, 'menu-item-action': selectedItem===item.id, 'menu-item-empty': !item.name}"
        v-for="(item, index) in filter.items"
        :key="index"
        @click="handleClick(item)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  name: 'FilterMenu',
  props: ['filter', 'show'],
  data() {
    return {
      selectedItem: 'all'
    }
  },
  methods: {
    handleClick(item) {
      if (!item.name) return
      this.selectedItem = item.id
      this.$emit('filterMenuClick', {name: this.filter.name, item})
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.container {
  .menu-list {
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    padding: 2rpx;
    font-size: 12px;
    background-color: $palette-bg-gray;
    .menu-item {
      width: 45%;
      height: 22px;
      line-height: 22px;
      margin: 10rpx;
      border: 1px solid black;
      border-radius: 5px;
      text-align: center;
    }
    .menu-item-action {
      color: #fff;
      background-color: $palette-blue-normal;
      border: 1px solid $palette-blue-normal;
    }
    .menu-item-empty {
      border: none
    }
  }
}
</style>
