<template>
  <div class="head-tab">
    <div class="tab-item"
         :class="{'tab-item-active': selectedItem===item.id}"
         @click="handleItemClick(item)"
         v-for="item in tabList"
         :key="item.id">
      <span>{{item.text}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeadTab',
  props: ['tabList', 'selectedItem'],
  methods: {
    handleItemClick(item) {
      // this.selectedItem = item.id
      // console.log(item, this.selectedItem)
      this.$emit('itemClick', item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.head-tab {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  width: 692rpx;
  height: 54rpx;
  box-sizing: border-box;
  border: 1rpx solid $palette-blue;
  border-radius: 20rpx;
  overflow: hidden;
  .tab-item {
    width: 50%;
    height: 100%;
    color: $palette-blue;
    background-color: #fff;
    padding: 9rpx 16rpx;
    box-sizing: border-box;
    font-size: 13px;
    display: flex;
    text-align: center;
    span {
      margin: auto;
    }
  }
  .tab-item-active {
    color: #fff;
    background-color: $palette-blue;
  }
}
</style>
