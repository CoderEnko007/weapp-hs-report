<template>
  <div class="card-list">
    <div class="card" v-for="(item, index) in list" :key="index" @click="handleClick(item)">
      <img :src="item.image" mode="aspectFit">
      <p>{{item.name}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardList',
  props: ['list'],
  methods: {
    handleClick(item) {
      this.$emit('cardClick', item)
    }
  },
}
</script>
<style lang="scss" scoped>
.card-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 18rpx 18rpx 0;
  margin-top: 15rpx;
  overflow: hidden;
  .card {
    width: 33%;
    height: 260rpx;
    padding: 0 0 8rpx;
    margin-bottom: 65rpx;
    text-align: center;
    font-size: 12px;
    img {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transform:scale(1.3);
    }
    p {
      width: 100%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
