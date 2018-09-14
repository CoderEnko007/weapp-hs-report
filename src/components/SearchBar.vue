<template>
<div class="search-bar">
  <div class="search-bar-form">
    <div class="serach-bar-box">
      <div class="zan-icon zan-icon-search"></div>
      <input type="text" :placeholder="placeholder" @confirm="handleConfirm">
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'SearchBar',
  props: ["placeholder"],
  methods: {
    handleConfirm(e) {
      this.$emit('handleConfirm', e.mp.detail.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.search-bar {
  position: relative;
  display: flex;
  padding: 8rpx 14rpx;
  .search-bar-form {
    position: relative;
    background-color: #fff;
    flex: auto;
    border: 1rpx solid #4f4f4f;
    border-radius: 25px;
    .serach-bar-box {
      padding-left: 60rpx;
      font-size: 12px;
      color: #ccc;
      .zan-icon {
        position: absolute;
        left: 20rpx;
        top: 50%;
        transform: translateY(-50%);
      }
      input {
        height: 50rpx;
        line-height: 50rpx;
      }
    }
  }
}
</style>
