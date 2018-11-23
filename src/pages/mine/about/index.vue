<template>
<div class="container">
  <NavBar :showCapsule="true" navTitle="关于"></NavBar>
  <div class="banner">
    <img :src="bannerImg" mode="aspectFill">
    <div class="text">
      <h1>炉石传说情报站</h1>
      <p>祝大家早日上传说</p>
    </div>
  </div>
  <div class="content">
    <div class="panel">
      <div class="headline">
        <span class="title">数据说明</span>
      </div>
      <div class="desc">
        <p>· 本小程序中的卡组及数据均来自HSReplay，每天早上8点更新</p>
        <p>· HSReplay会实时更新全站数据，而爬取数据需要一定时间，因此小程序中的数据可能会与实时数据有所偏差，但是一天内的变化不会太大，大家放心食用。</p>
        <p>· 持续更新，更多功能敬请期待。</p>
      </div>
      <div class="separator"></div>
    </div>
  </div>
  <div class="contact">
    <div class="headline">
      <span class="title">联系作者</span>
    </div>
    <p class="text">在使用中发现什么bug或者有什么建议，欢迎大家联系我。</p>
    <div class="email">
      <span class="text">发邮件</span>
      <div class="capsule" @click="handleCopyBtn"><span>复制</span></div>
      <span class="desc">{{email}}</span>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import NavBar from '@/components/NavBar'

export default {
  components: {
    NavBar
  },
  data() {
    return {
      bannerImg: 'https://cloud-minapp-18282.cloud.ifanrusercontent.com/1gDPyMJP8arlwMXm.png',
      email: 'yf381966217@163.com'
    }
  },
  ...mapGetters([
    'navHeight',
  ]),
  methods: {
    handleCopyBtn() {
      wx.setClipboardData({
        data: this.email,
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
        }
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
    height: 325rpx;
    img {
      height: 100%;
      width: 100%;
    }
    .text {
      position: absolute;
      left: 30rpx;
      top: 64rpx;
      h1 {
        font-size: 28px;
        color: #FFFFFF;
        line-height: 28px;
      }
      p {
        margin-top: 9rpx;
        font-size: 13px;
        color: #FFFFFF;
        line-height: 44rpx;
      }
    }
  }
  .content {
    margin: 0 30rpx;
    .panel{
      .headline {
        &:before {
          display: none;
        }
        .title {
          margin: 0;
        }
      }
      .desc {
        font-size: 13px;
        color: #666666;
        line-height: 40rpx;
        margin-bottom: 10rpx;
        p {
          margin-bottom: 1em;
        }
      }
      .separator {
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1rpx solid #eee;
        margin: 20rpx 0;
      }
    }
  }
  .contact {
    margin: 0 30rpx;
    .headline {
      &:before {
        display: none;
      }
      .title {
        margin: 0;
      }
    }
    p.text {
      font-size: 13px;
      color: #666666;
      line-height: 40px;
    }
    .email {
      height: 120rpx;
      box-sizing:border-box;
      border-bottom:1rpx solid #eee;
      .text {
        line-height:120rpx;
        font-size: 15px;
        color: #333333;
      }
      .desc {
        float: right;
        right: 101rpx;
        height: 40rpx;
        font-size: 13px;
        color: #999999;
        margin-right:13rpx;
        margin-top:40rpx;
      }
      .capsule {
        float: right;
        right: 0;
        height: 40rpx;
        width: 88rpx;
        padding:0 15rpx;
        font-size: 12px;
        border-radius: 20rpx;
        box-sizing: border-box;
        border: 1rpx solid #ddd;
        text-align: center;
        margin-top:40rpx;
        color: #999999;
      }
    }
  }
}
</style>
