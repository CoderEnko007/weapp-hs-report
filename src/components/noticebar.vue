<template>
  <div class="zan-noticebar">
    <div class="icon-left"><i class="iconfont">&#xe605;</i></div>
    <div class="notice-text" :id="componentId + '__content-wrap'" @click="onBarClick">
      <div :animation="animationData" :id="componentId + '__content'" style="position: absolute; white-space: nowrap;">
        {{ text }}
      </div>
    </div>
    <div class="icon-right" @click="handleClose"><i class="iconfont">&#xe637;</i></div>
  </div>
</template>


<script>
  export default {
    mounted () {
      this.$emit('ref', { [this.componentId]: this })
    },
    props: ['componentId', 'animationData', 'text'],
    watch: {
      animationData: function () {
        // console.log('asd', this.animationData)
      }
    },
    methods: {
      handleClose() {
        this.$emit('close')
      },
      onBarClick() {
        this.$emit('barClick')
      },
      initZanNoticeBarScroll (that, componentId) {
        // console.log('initZanNoticeBarScroll')
        that.zanNoticeBarNode = that.zanNoticeBarNode || {}
        that.zanNoticeBarNode[`${componentId}`] = {
          width: undefined,
          wrapWidth: undefined,
          animation: null,
          resetAnimation: null,
          timerSwitch: true
        }

        // console.log(`#${componentId}__content`)
        let query = wx.createSelectorQuery().select(`#${componentId}__content`).boundingClientRect()
        query.exec(function (res) {
          // var backImageRect = res[0]
          // var screenWidth = backImageRect.width
          // console.log(screenWidth + '  ' + JSON.stringify(res))
        })

        const currentComponent = that.zanNoticeBarNode[`${componentId}`]
        wx.createSelectorQuery().select(`#${componentId}__content`).boundingClientRect().exec((rect) => {
          if (!rect[0] || !rect[0].width) {
            console.log('no content rect')
            return
          }
          currentComponent.width = rect[0].width
          wx.createSelectorQuery().select(`#${componentId}__content-wrap`).boundingClientRect().exec((rect) => {
            if (!rect[0] || !rect[0].width) {
              console.log('no __content rect')
              return
            }
            currentComponent.wrapWidth = rect[0].width
            // console.log('aaa', currentComponent)
            if (currentComponent.wrapWidth < currentComponent.width) {
              var mstime = currentComponent.width / 40 * 1000
              currentComponent.animation = wx.createAnimation({
                duration: mstime,
                timingFunction: 'linear'
              })
              currentComponent.resetAnimation = wx.createAnimation({
                duration: 1,
                timingFunction: 'linear'
              })
              that.scrollZanNoticeBar(that, componentId, mstime)
            }
          })
        })
      },

      scrollZanNoticeBar (that, componentId, mstime) {
        // console.log('scrollZanNoticeBar')
        const currentComponent = that.zanNoticeBarNode[`${componentId}`]
        const aninationData = currentComponent.animation.translateX((-mstime * 40 / 1000)).step()
        setTimeout(() => {
          that[componentId].animationData = aninationData.export()
        }, 500)
        const resetAnimationData = currentComponent.resetAnimation.translateX(currentComponent.wrapWidth).step()
        setTimeout(() => {
          that[componentId].animationData = resetAnimationData.export()
        }, mstime+300)

        if (currentComponent.timerSwitch) {
          setTimeout(() => {
            that.scrollZanNoticeBar(that, componentId, mstime)
          }, mstime+300)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .zan-noticebar {
    position: relative;
    height: 18px;
    background: transparent;
    color: #f4f7fc;
    letter-spacing:1px;
    .icon-left {
      position: absolute;
      left: 18rpx;
    }
    .icon-right {
      position: absolute;
      right: 20rpx;
    }
    .notice-text {
      position: absolute;
      height: 18px;
      /*width: 100%;*/
      overflow: hidden;
      left: 25px;
      right: 30px
    }
  }
</style>
