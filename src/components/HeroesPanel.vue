<template>
<div class="container">
  <ul class="hero-panel-list">
    <li :class="{'panel-item': true, 'panel-item-active': selected===item.id}"
        v-for="(item, index) in dataList"
        :key="index"
        @click="itemClick(item)">
      <img :src="item.image" mode="aspectFit">
    </li>
  </ul>
</div>
</template>
<script>
export default {
  name: 'HeroesPanel',
  props: ['dataList', 'selected'],
  data() {
    return {
      selectedFaction: 'Druid'
    }
  },
  methods: {
    itemClick(item) {
      this.selectedFaction = item.id
      this.$emit('itemClick', item)
    }
  },
  watch: {
    selected(val) {
      this.selectedFaction = val
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.container {
  position: relative;
  width: 100%;
  height: 76rpx;
  .hero-panel-list {
    position:absolute;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 100%;
    top:50%;
    transform:translateY(-50%);
    padding:0 8rpx;
    box-sizing: border-box;
    .panel-item {
      position: relative;
      width: 54rpx;
      height: 54rpx;
      font-size: 12px;
      color: white;
      text-align: center;
      opacity: 0.5;
      transition: opacity 0.5s;
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
      opacity: 1;
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
