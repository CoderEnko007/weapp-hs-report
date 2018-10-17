<template>
<div class="container">
  <ul class="panel-list">
    <li :class="{'panel-item': true, 'panel-item-active': selectedFaction===index}"
        v-for="(item, index) in dataList"
        :key="index"
        @click="itemClick(index, item)">
      <img :src="item.image" mode="aspectFit">
    </li>
  </ul>
</div>
</template>
<script>
export default {
  name: 'HeroesPanel',
  props: ['dataList'],
  data() {
    return {
      selectedFaction: 0
    }
  },
  methods: {
    itemClick(index, item) {
      this.selectedFaction = index
      this.$emit('itemClick', item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.container {
  position: relative;
  width: 100%;
  height: 124rpx;
  .panel-list {
    position:absolute;
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
    width: 100%;
    top:50%;
    transform:translateY(-50%);
    box-sizing: border-box;
    .panel-item {
      position: relative;
      width: 32px;
      height: 32px;
      font-size: 12px;
      color: white;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-sizing: border-box;
        border: 3rpx solid transparent;
        &:after {
          display: none;
          position: absolute;
          content: '';
          width: 0;
          top: 90%;
          left: 50%;
          transform: translateX(-50%);
          border: 15rpx solid transparent;
          border-bottom-color: $palette-blue;
        }
      }
    }
    .panel-item-active {
      img {
        border: 3rpx solid $palette-blue!important;
        &:after {
          display: block !important;
        }
      }
    }
  }
}
</style>
