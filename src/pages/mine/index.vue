<template>
  <div class="container">
    <div class="userinfo">
      <img :src="userInfo.avatarUrl" alt="">
      <button v-if="!userInfo.openid" open-type="getUserInfo" @getuserinfo="userInfoHandler">请登录</button>
      <p v-else>{{userInfo.nickName}}</p>
    </div>
    <div class="about zan-panel">
      <div class="zan-cell zan-cell--access">
        <div class="zan-cell__bd">关于小程序</div>
        <div class="zan-cell__ft"></div>
      </div>
    </div>
    <div class="collection zan-panel">
      <div class="zan-cell">
        <div class="zan-cell__bd">我的收藏</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    userInfoHandler(data) {
      this.$store.dispatch('getUserInfo', data).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    console.log(this.userInfo)
  }
}
</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
}
.userinfo {
  position: relative;
  padding: 50rpx 20rpx;
  background-color: #fff;
  button, p {
    position: absolute;
    left: 160rpx;
    top:0;
    bottom: 0;
    margin:auto;
    font-size: 14px;
    width: 150rpx;
    height: 50rpx;
    line-height: 50rpx;
    padding: 0;
    text-align: left;
    background-color: transparent;
    border: none;
  }
  button::after{
    border: none;
  }
  img {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-left: 20rpx;
  }
}
</style>
