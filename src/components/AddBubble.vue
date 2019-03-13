<template>
<div class="bubble">
  <p class="text">点击</p>
  <img src="/static/icons-v2/setting.png" mode="aspectFit">
  <p class="text">添加到我的小程序，可快捷访问</p>
</div>
</template>

<script>
export default {
  name: "AddBubble",
  data() {
    return {

    }
  }
};
</script>

<style lang="scss" scoped>
.bubble {
  height: 23px;
  line-height: 23px;
  background-color: #ffffffbb;
  border-radius: 10px;
  padding: 0 8px;
  overflow: hidden;
  p {
    line-height: 23px;
    display: inline-block;
    font-size: 12px;
    vertical-align:middle;
  }
  img {
    display: inline-block;
    width: 32rpx;
    height: 32rpx;
    margin:0 5px;
    vertical-align:middle;
  }
  &:after {
    position: absolute;
    top: -36rpx;
    right: 60px;
    content: '';
    border-style: solid;
    border-width: 19rpx;
    border-color: transparent transparent #ffffffbb transparent;
    width: 0;
    height: 0;
    overflow: hidden;
  }
}
</style>
