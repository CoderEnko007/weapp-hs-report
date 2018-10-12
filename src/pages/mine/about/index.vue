<template>
<div class="container">
  <div class="banner">
    <img :src="bannerImg" mode="aspectFill">
    <h1>炉石传说情报站</h1>
  </div>
  <div class="content">
    <div class="panel">
      <div class="panel-header">
        <h1><span class="icon iconfont">&#xe604;</span>关于炉石情报站</h1>
      </div>
      <div class="desc">
        <p class="indent_2">本小程序中的卡组及数据均来自HSReplay，由于HSReplay每隔1小时就会更新全站数据，而爬取数据需要一定时间，因此小程序中的数据可能会与HSReplay有所偏差，但是一天内的变化不会太大，大家放心食用。目前仅提供标准模式卡组和数据，祝大家早日上传说。</p>
        <p class="indent_2">如果使用中发现什么bug或者有什么建议，欢迎大家联系我。</p>
        <p>邮箱：yf381966217@163.com</p>
      </div>
    </div>
    <div class="panel code">
      <img :src="codeImg" mode="aspectFill" @click="handleClickCodeImg">
    </div>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      bannerImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g7yChfIyViFMUoB.jpg',
      codeImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1g9oGSrxprEojAfB.jpg'
    }
  },
  methods: {
    handleClickCodeImg() {
      wx.previewImage({
        urls: [this.codeImg]
      })
    }
  },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/index/main'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';

.container {
  .banner {
    position: relative;
    height: 200rpx;
    img {
      height: 100%;
      width: 100%;
    }
    h1 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-weight: 700;
      font-size: 1.4em;
    }
  }
  .content {
    .panel{
      padding: 6px 8px;
      .panel-header {
        width: 100%;
        font-size: 16px;
        .icon {
          font-size: 16px;
          padding-right: 4px;
          color: $palette-red;
        }
      }
      .desc {
        margin: 5px 7px;
        font-size: 14px;
        .indent_2 {
          text-indent: 2em;
        }
      }
    }
    .code {
      text-align: center;
      img {
        width: 220px;
      }
    }
  }
}
</style>
