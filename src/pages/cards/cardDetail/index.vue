<template>
  <div class="card-detail">
    <NavBar :showCapsule="true" navTitle="单卡详情"></NavBar>
    <div class="header" @click="previewCard">
      <!--<img :src="cardDetail.bgImg" class="bg-img" mode="aspectFiit">-->
      <img :src="cardDetail.cardImg" class="card-img" mode="aspectFit">
      <!--<img :src="cardDetail.heroIcon" class="icon-img" mode="aspectFit">-->
    </div>
    <div class="detail">
      <p class="name" @click="handleCopyBtn(cardDetail.name)">{{cardDetail.name}}<span class="headline-meta">点击复制</span></p>
      <p class="normal" @click="handleCopyBtn(cardDetail.ename)"><span class="f3">英文名</span>：{{cardDetail.ename}}</p>
      <p v-show="cardDetail.series" class="normal"><span class="f4">所属系列</span>：{{cardDetail.series}}</p>
      <p v-show="cardDetail.type" class="normal"><span class="f2">类型</span>：{{cardDetail.type}}</p>
      <p v-show="cardDetail.flavor" class="flavor" @click="handleCopyBtn(cardDetail.flavor)">{{cardDetail.flavor}}</p>
      <p v-show="cardDetail.eflavor" class="flavor" @click="handleCopyBtn(cardDetail.eflavor)">{{cardDetail.eflavor}}</p>
    </div>
    <div class="audio-list">
      <div v-show="showEnAudio">
        <div class="title">英文音效</div>
        <div class="en-audio">
          <!--<div class="audio-type-block" v-for="(item, index) in getEnAudio" :key="index" v-show="item.src">-->
            <div class="audio-item" v-for="(item, index) in getEnAudio" :key="index" @click="handleAudioPlay(item)">
              <!--<img src="/static/icons-v2/audio-3.png">-->
              <div class="play-img" :class="{'audio-play': selectedAudio === item.src}"></div>
              <span v-if="index>0">{{item.cname}}</span>
              <span v-else>{{item.cname}}</span>
            </div>
          <!--</div>-->
        </div>
      </div>
      <div v-show="showZhAudio">
        <div class="title">中文音效</div>
        <div class="zh-audio">
          <!--<div class="audio-type-block" v-for="(item, index) in getZhAudio" :key="index" v-show="item.src">-->
            <div class="audio-item" v-for="(item, index) in getZhAudio" :key="index" @click="handleAudioPlay(item)">
              <!--<img src="/static/icons-v2/audio-3.png">-->
              <div class="play-img" :class="{'audio-play': selectedAudio === item.src}"></div>
              <span v-if="index>0">{{item.cname}}</span>
              <span v-else>{{item.cname}}</span>
            </div>
          <!--</div>-->
        </div>
      </div>
    </div>
    <div class="ads">
      <ad unit-id="adunit-038fb5d0b45f4699"></ad>
    </div>
    <div style="height: 80rpx"></div>
    <div class="footer">
      <FooterMenu></FooterMenu>
    </div>
    <!--<floatBtnGroup></floatBtnGroup>-->
  </div>
</template>
<script>
import { getCardPicture } from "@/utils";
import { mapGetters } from 'vuex'
import utils from '@/utils'
import {genOrigImageURL, genCardsImageURL, gen512CardsImageURL} from '@/utils'
import {getCardDetail} from "@/api/dbapi";
import FooterMenu from '@/components/FooterMenu'
import floatBtnGroup from '@/components/floatBtnGroup'
import NavBar from '@/components/NavBar'

const heroes = {
  Druid: {name: '德鲁伊', image: '/static/heroIcons/druid.png'},
  Hunter: {name: '猎人', image: '/static/heroIcons/hunter.png'},
  Mage: {name: '法师', image: '/static/heroIcons/mage.png'},
  Paladin: {name: '圣骑士', image: '/static/heroIcons/paladin.png'},
  Priest: {name: '牧师', image: '/static/heroIcons/priest.png'},
  Rogue: {name: '潜行者', image: '/static/heroIcons/rogue.png'},
  Shaman: {name: '萨满', image: '/static/heroIcons/shaman.png'},
  Warlock: {name: '术士', image: '/static/heroIcons/warlock.png'},
  Warrior: {name: '战士', image: '/static/heroIcons/warrior.png'},
  Neutral: {name: '中立', image: ''}
}
const defaultCardDetail = {
  name: '',
  ename: '',
  series: '',
  flavor: '',
  type: '',
  bgImg: null,
  cardImg: null,
  heroIcon: null,
}
export default {
  components: {
    FooterMenu,
    floatBtnGroup,
    NavBar
  },
  data() {
    return {
      cardId: null,
      cardDetail: Object.assign({}, defaultCardDetail),
      myAudio: null,
      showEnAudio: false,
      showZhAudio: false,
      selectedAudio: '',
      audioPlaying: false,
    }
  },
  computed: {
    ...mapGetters([
      'navHeight',
      'fbiVersion',
      'fbiKey',
      'fbiFlag'
    ]),
    getEnAudio() {
      if (this.cardDetail.audios) {
        return this.cardDetail.audios.filter(item => {
          return item.type === 'en'
        })
      }
    },
    getZhAudio() {
      if (this.cardDetail.audios) {
        return this.cardDetail.audios.filter(item => {
          return item.type === 'zh'
        })
      }
    },
  },
  methods: {
    genCardImage(hsId) {
      return getCardPicture(this, hsId, false, this.fbiFlag, this.fbiVersion, this.fbiKey)
    },
    initCardDetail() {
      this.showEnAudio = false
      this.showZhAudio = false
      wx.showNavigationBarLoading();
      getCardDetail(parseInt(this.cardId)).then(res => {
        this.cardDetail = res[0]
        this.cardDetail.bgImg = genOrigImageURL(this.cardDetail.hsId)
        // this.cardDetail.cardImg = gen512CardsImageURL(this.cardDetail.hsId)
        // this.cardDetail.cardImg = this.cardDetail.img_card_link
        this.cardDetail.cardImg = this.genCardImage(this.cardDetail.hsId)
          this.cardDetail.heroIcon = heroes[this.cardDetail.cardClass].image
        for (let item of this.$store.state.cards.series) {
          if(this.cardDetail.set_id === item.id) {
            this.cardDetail.series = item.name
            if (item.mode === 'Standard') {
              this.cardDetail.series += '（标准）'
            } else if (item.mode === 'Wild') {
              this.cardDetail.series += '（狂野）'
            }
          }
        }
        this.cardDetail.type = heroes[this.cardDetail.cardClass].name+'-'+utils.type[this.cardDetail.type].name
        if (this.cardDetail.race) {
          this.cardDetail.type += '-'+utils.race[this.cardDetail.race].name
        }
        this.cardDetail.audios = [
          {type: 'en', ename: 'audio_play_en', cname: '出场', src: JSON.parse(this.cardDetail.audio_play_en)},
          {type: 'en', ename: 'audio_attack_en', cname: '攻击', src: JSON.parse(this.cardDetail.audio_attack_en)},
          {type: 'en', ename: 'audio_trigger_en', cname: '触发', src: JSON.parse(this.cardDetail.audio_trigger_en)},
          {type: 'en', ename: 'audio_death_en', cname: '阵亡', src: JSON.parse(this.cardDetail.audio_death_en)},
          {type: 'zh', ename: 'audio_play_zh', cname: '出场', src: JSON.parse(this.cardDetail.audio_play_zh)},
          {type: 'zh', ename: 'audio_attack_zh', cname: '攻击', src: JSON.parse(this.cardDetail.audio_attack_zh)},
          {type: 'zh', ename: 'audio_trigger_zh', cname: '触发', src: JSON.parse(this.cardDetail.audio_trigger_zh)},
          {type: 'zh', ename: 'audio_death_zh', cname: '阵亡', src: JSON.parse(this.cardDetail.audio_death_zh)},
        ]
        let audiosList = []
        for (let item of this.cardDetail.audios) {
          if (item.src) {
            for (let index in item.src) {
              if (item.src.hasOwnProperty(index)) {
                let cname = index>0?item.cname+index:item.cname
                audiosList.push({type: item.type, ename: item.ename, cname: cname, src:item.src[index]})
              }
            }
          }
        }
        this.cardDetail.audios = audiosList

        if (this.cardDetail.audio_play_en || this.cardDetail.audio_attack_en
          || this.cardDetail.audio_trigger_en || this.cardDetail.audio_death_en) {
          this.showEnAudio = true
        }
        if (this.cardDetail.audio_play_zh || this.cardDetail.audio_attack_zh
          || this.cardDetail.audio_trigger_zh || this.cardDetail.audio_death_zh) {
          this.showZhAudio = true
        }
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      }).catch(err => {
        console.log(err)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
      })
    },
    previewCard() {
      wx.previewImage({
        // urls: [gen512CardsImageURL(this.cardDetail.hsId)] // 需要预览的图片http链接列表
        urls: [this.cardDetail.img_card_link]
      })
    },
    handleAudioPlay(item) {
      this.selectedAudio = item.src
      if (this.myAudio) {
        if (this.audioPlaying) {
          this.myAudio.stop()
        }
        this.myAudio.autoplay = true
        this.myAudio.src = encodeURI(item.src)
        this.myAudio.play()
      }
    },
    handleCopyBtn(text) {
      wx.setClipboardData({
        data: text,
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    }
  },
  mounted() {
    this.cardId = this.$root.$mp.query.id
    this.myAudio = wx.createInnerAudioContext()
    this.myAudio.onPlay(() => {
      console.log('start')
      this.audioPlaying = true
    })
    this.myAudio.onCanplay(() => {
      console.log('Canplay')
    })
    this.myAudio.onEnded(() => {
      console.log('end')
      this.selectedAudio = ''
    })
    this.myAudio.onWaiting(() => {
      console.log('waiting...')
      this.audioPlaying = true
    })
    this.myAudio.onError(res => {
      console.log(res.errMsg)
      console.log(res.errCode)
      console.log(res)
    })
    this.initCardDetail()
  },
  onPullDownRefresh() {
    this.initCardDetail()
  },
  onUnload() {
    if (this.myAudio) {
      this.myAudio.stop()
      this.myAudio.destroy()
    }
    this.selectedAudio = ''
    this.cardId = null
    this.cardDetail = Object.assign({}, defaultCardDetail)
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        title: this.cardDetail.name,
        path: `/pages/cards/cardDetail/main?id=${this.cardId}`
      }
    } else {
      return {
        title: '炉石传说情报站',
        path: '/pages/index/main'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.card-detail{
  .header {
    position: relative;
    width: 100%;
    height: 700rpx;
    overflow: hidden;
    .bg-img {
      position: absolute;
      width: 100%;
      height: 100%;
      filter: blur(20px);
      transform: scale(1.2);
      overflow: hidden;
      z-index: -999;
    }
    .card-img {
      position: absolute;
      width: 100%;
      height: 800rpx;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .icon-img {
      position: absolute;
      width: 90rpx;
      height: 90rpx;
      top: 40rpx;
      left: 30rpx;
    }
  }
  .detail {
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    .name {
      font-size: 18px;
      font-weight: 700;
      height: 38px;
      .headline-meta {
        height: 24rpx;
        line-height: 24rpx;
        margin-left:8px;
        font-size: 19rpx;
        color: #999;
        border: 1rpx solid #ddd;
        border-radius: 12px;
        padding: 3rpx 10rpx;
      }
    }
    .normal {
      height: 25px;
      font-size: 14px;
    }
    .flavor {
      font-size: 14px;
      font-style: italic;
      color: rgba(0, 0, 0, .5);
    }
    .f2 {
      letter-spacing: 2em;
      margin-right: -2em;
    }
    .f3 {
      letter-spacing: 0.5em;
      margin-right: -0.5em;
    }
    .f4 {
      text-align: center;
      width: 4em;
    }
  }
  .audio-list {
    margin: 0 30rpx 15rpx;
    .title {
      font-size: 14px;
      color: #333333;
      line-height: 36px;
      font-weight: bold;
    }
    .en-audio, .zh-audio {
      width: 100%;
      .title {
        font-size: 14px;
        color: #333333;
        line-height: 26px;
      }
      .audio-item {
        display: inline-block;
        width: 150rpx;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        box-sizing:border-box;
        border-radius: 25px;
        background: #eee;
        padding-left: 15rpx;
        margin-bottom: 10px;
        .play-img {
          display: inline-block;
          width: 30rpx;
          height: 30rpx;
          vertical-align:middle;
          background-size:contain;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIyNTMwMTIxNUQzQTExRTU4RTMyOTYyRTE3MjkwRDc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjIyNTMwMTIyNUQzQTExRTU4RTMyOTYyRTE3MjkwRDc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjI1MzAxMUY1RDNBMTFFNThFMzI5NjJFMTcyOTBENzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjI1MzAxMjA1RDNBMTFFNThFMzI5NjJFMTcyOTBENzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6TOvvbAAABxUlEQVR42ryXTSiEQRzGd+06ECmRRNRekIOLNyQHRVy4KKX2YkuSz5uLslLKiXxcpD2J2rIXF8rHSYiLkrgo2ZJC+WiVLJ6p573tzHrfxvzr1zPtzOzT/N//OzOv12pq8WgMP/j6y8AMjaaTYJPmxowLwCDoBEsmjR9BB0iAftBjMtUnYJRtsepCU8YiVsEuyAfTJo1FDIMkCIEyncYinaWK/isQBZlgQJdxL5gHMZClGGdXdlDm4dQ4xhVZYEwx7gjcMDOWDuMXrvoHjLOIUoXo32G7WdczPgZ7IC/N+3pIrXVjLOuPUtsVcy+pFU6Nxd47I+nbp9Yo5t9Si50YC9Mw6JP031GLFMbv1Fwnxl7PP4fsCAtTZe+qvYE8KP47h/rmxNg2l2WkkXqumG9vl/duqvpb8nuQuq2YW0291vUe14NWbiYbinF2Vs50GItNI8LimwXPiuJsY/tAh3EXqAIXPCxk0QACIA5OnRZXqohw1VvgQzFuiLomqxO/i2c8l6a/EnSDT7Bs8gayAHzMTtyUcYgV/wQmTN256sAi2yM0N3KhFwWXDVbAeroJvpLygA7jBE1feUNJuj0k3MSUk4+2XwEGAPeSTVRGzJ3zAAAAAElFTkSuQmCC);
        }
        span {
          margin-left: 8rpx;
          font-size: 12px;
          vertical-align:middle;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
  }
}
.audio-play {
  position:relative;
  background-repeat:no-repeat;
  background-size:contain;
  animation:audioPlay 2s linear infinite;
}
@keyframes audioPlay {
  0% {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM0NEQ3RDg1NUQzQTExRTU4NkE2ODlDNENFMTkyNjMzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM0NEQ3RDg2NUQzQTExRTU4NkE2ODlDNENFMTkyNjMzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzQ0RDdEODM1RDNBMTFFNTg2QTY4OUM0Q0UxOTI2MzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzQ0RDdEODQ1RDNBMTFFNTg2QTY4OUM0Q0UxOTI2MzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7APQCsAAAAW0lEQVR42mL8//8/g5mdKwO9ARPDAIFRi0ctHrV41OLhZzHTQFhcD8Rt9LYYZGkDEKfS22JGWscxCw7xBijNSW+LYZYzDVSq/jdagIxaPGrxqMWjFg+4xQABBgABTAhrvxCDdAAAAABJRU5ErkJggg==);}
  33% {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJGMjUxRDc2NUQzQTExRTU4QjA2QUQ3Q0E5NEY2QkRCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJGMjUxRDc3NUQzQTExRTU4QjA2QUQ3Q0E5NEY2QkRCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkYyNTFENzQ1RDNBMTFFNThCMDZBRDdDQTk0RjZCREIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkYyNTFENzU1RDNBMTFFNThCMDZBRDdDQTk0RjZCREIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6aWLOjAAAA1klEQVR42mI0tXVhGAjAxDBAYNTiUYsHlcX5QCxDb4sTgXgCEK8DYk56Wgyy8AYQmwJxAT0t/gj19X8gLgdiIXrG8Qkg3gvE/EAcSSuLccmvgtIetLC4HojbcMjtg9L61LYYZGkDEKfikH8MpcWpbTEjrQsQFhziDVAaV16FFSAvqW0xzHJcIWINpS/SKlX/wyEeA6V30DMfWwCxK7QwWU4vi0GFxjxo4usE4nf0sjgYiDWB+Aq0smCgReLCBuZBfb0ZiL/T02IQ6B9t+oxaPGoxNgAQYADwcB2Sjvx+hgAAAABJRU5ErkJggg==);}
  66% {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjIyNTMwMTIxNUQzQTExRTU4RTMyOTYyRTE3MjkwRDc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjIyNTMwMTIyNUQzQTExRTU4RTMyOTYyRTE3MjkwRDc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjI1MzAxMUY1RDNBMTFFNThFMzI5NjJFMTcyOTBENzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjI1MzAxMjA1RDNBMTFFNThFMzI5NjJFMTcyOTBENzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6TOvvbAAABxUlEQVR42ryXTSiEQRzGd+06ECmRRNRekIOLNyQHRVy4KKX2YkuSz5uLslLKiXxcpD2J2rIXF8rHSYiLkrgo2ZJC+WiVLJ6p573tzHrfxvzr1zPtzOzT/N//OzOv12pq8WgMP/j6y8AMjaaTYJPmxowLwCDoBEsmjR9BB0iAftBjMtUnYJRtsepCU8YiVsEuyAfTJo1FDIMkCIEyncYinaWK/isQBZlgQJdxL5gHMZClGGdXdlDm4dQ4xhVZYEwx7gjcMDOWDuMXrvoHjLOIUoXo32G7WdczPgZ7IC/N+3pIrXVjLOuPUtsVcy+pFU6Nxd47I+nbp9Yo5t9Si50YC9Mw6JP031GLFMbv1Fwnxl7PP4fsCAtTZe+qvYE8KP47h/rmxNg2l2WkkXqumG9vl/duqvpb8nuQuq2YW0291vUe14NWbiYbinF2Vs50GItNI8LimwXPiuJsY/tAh3EXqAIXPCxk0QACIA5OnRZXqohw1VvgQzFuiLomqxO/i2c8l6a/EnSDT7Bs8gayAHzMTtyUcYgV/wQmTN256sAi2yM0N3KhFwWXDVbAeroJvpLygA7jBE1feUNJuj0k3MSUk4+2XwEGAPeSTVRGzJ3zAAAAAElFTkSuQmCC);}
  100% {background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM0NEQ3RDg1NUQzQTExRTU4NkE2ODlDNENFMTkyNjMzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM0NEQ3RDg2NUQzQTExRTU4NkE2ODlDNENFMTkyNjMzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzQ0RDdEODM1RDNBMTFFNTg2QTY4OUM0Q0UxOTI2MzMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzQ0RDdEODQ1RDNBMTFFNTg2QTY4OUM0Q0UxOTI2MzMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7APQCsAAAAW0lEQVR42mL8//8/g5mdKwO9ARPDAIFRi0ctHrV41OLhZzHTQFhcD8Rt9LYYZGkDEKfS22JGWscxCw7xBijNSW+LYZYzDVSq/jdagIxaPGrxqMWjFg+4xQABBgABTAhrvxCDdAAAAABJRU5ErkJggg==);}
}
</style>
