<template>
  <div class="container">
    <div class="modalMask" :class="{'maskFadeIn': changeModel, 'maskFadeOut': !changeModel && isModel}"></div>
    <div class="modalDialog" :class="{'fadeIn': changeModel, 'fadeOut': !changeModel && isModel}">
      <!--<div class="modalHeader">-->
        <!--<p class="title"></p>-->
      <!--</div>-->
      <div class="modalContent">
        <div class="contentLine">
          <input type="text" class="deckCode" :value="deck1Code" disabled="disabled">
          <div class="btn" @click="addCompareDeck1">加入对比</div>
        </div>
        <div class="contentLine">
          <input type="text" class="deckCode" :value="deck2Code" disabled="disabled">
          <div class="btn" @click="addCompareDeck2">加入对比</div>
        </div>
      </div>
      <div class="modalFooter">
        <div class="btn btnCancel" @tap="tapCancel">{{cancelBtnText}}</div>
        <div class="btn btnClear" @tap="tapClear">清空</div>
        <div class="btn btnConfirm" :class="{'btnConfirmDisable': disableCompare, 'btnConfirmEnable': !disableCompare}" @tap="confirmSend">开始对比</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'compareDeckModal',
  data() {
    return {
      changeModel: false,
      isModel: false,
    };
  },
  computed: {
    ...mapGetters([
      'compareDeck1',
      'compareDeck2'
    ]),
    deck1Code() {
      return this.compareDeck1?this.compareDeck1.deck_code:""
    },
    deck2Code() {
      return this.compareDeck2?this.compareDeck2.deck_code:""
    },
    disableCompare() {
      return this.compareDeck1 === null || this.compareDeck2 === null;
    },
    cancelBtnText() {
      // if (this.deck1Code === "" || this.deck2Code === "") {
      //   return '下一个'
      // } else {
      //   return '取消'
      // }
      return '确定'
    }
  },
  methods: {
    //  弹框取消
    tapCancel() {
      this.changeModel = false;
      this.$emit('cancel')
    },
    tapClear() {
      console.log('tabClear')
      this.$emit('clear')
    },
    //  确认
    confirmSend() {
      if (!this.disableCompare) {
        this.changeModel = false;
        this.$emit('confirm')
      }
    },
    showModal() {
      this.changeModel = true;
      this.isModel = true;
    },
    addCompareDeck1() {
      this.$emit('addCompareDeck1')
    },
    addCompareDeck2() {
      this.$emit('addCompareDeck2')
    }
  }
}
</script>
<style lang="scss" scoped>
/* 弹窗开始 */
.modalMask {
  display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 9000;
  color: #fff;
}
.modalDialog {
  display: none;
  box-sizing: border-box;
  width: 560rpx;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 9999;
  background: #fff;
  margin: -180rpx 95rpx;
  border-radius: 8rpx;
}
.modalContent {
  box-sizing: border-box;
  display: flex;
  padding: 50rpx 20rpx 30rpx;
  font-size: 32rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .contentLine {
    display:flex;
    flex-wrap:nowrap;
    justify-content:space-between;
    margin-bottom: 20rpx;
    width: 100%;
    height: 60rpx;
    .deckCode {
      width:70%;
      height: 100%;
      line-height: 60rpx;
      border-radius:32rpx;
      padding:0 10rpx;
      font-size: 28rpx;
      color: #666;
      background-color: #f8f8f8;
      border:1rpx solid #eee;
      box-sizing:border-box;
    }
    .btn {
      width: 30%;
      height: 100%;
      line-height: 60rpx;
      margin-left:20rpx;
      box-sizing:border-box;
      text-align:center;
      border-radius:32rpx;
      font-size:12px;
      background-color:#433e88;
      color:#fff;
      padding:0 10rpx;
      border: 1rpx solid #ccc;
    }
  }
}
.contentTip {
  text-align: center;
  font-size: 36rpx;
  color: #333333;
}
.modalFooter {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 80rpx;
  border-top: 1px solid #e5e5e5;
  font-size: 32rpx;
  line-height: 80rpx;
}
.btn {
  font-size: 32rpx;
  width: 33%;
  color: #333;
  text-align: center;
}
.btnClear {
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
}
.btnConfirmDisable {
  color: #aaa;
}
.btnConfirmEnable {
  color: #508cee;
}
.fadeOut {
  display: block;
  animation: fadeOut .5s forwards;
}
.fadeIn {
  display: block;
  animation:fadeIn .5s forwards;
}
.maskFadeOut {
  display: block;
  animation: maskFadeOut .5s forwards;
}
.maskFadeIn {
  display: block;
  animation:maskFadeIn .5s forwards;
}
@keyframes fadeIn {
  0%    {opacity: 0}
  100%  {opacity: 1; display: block;}
}
@keyframes fadeOut {
  0%    {opacity: 1}
  100%  {opacity: 0; visibility: hidden}
}
@keyframes maskFadeIn {
  0%    {opacity: 0}
  100%  {opacity: 0.5; display: block;}
}
@keyframes maskFadeOut {
  0%    {opacity: 0.5}
  100%  {opacity: 0; visibility: hidden}
}
/* 弹窗结束 */
</style>
