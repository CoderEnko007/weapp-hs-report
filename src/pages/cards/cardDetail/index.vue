<template>
  <div class="card-detail">
    <div class="header" @click="previewCard">
      <img :src="cardDetail.bgImg" class="bg-img" mode="aspectFiit">
      <img :src="cardDetail.cardImg" class="card-img" mode="aspectFit">
      <img :src="cardDetail.heroIcon" class="icon-img" mode="aspectFit">
    </div>
    <div class="detail">
      <p class="name">{{cardDetail.name}}</p>
      <p class="normal"><span class="f3">英文名</span>：{{cardDetail.ename}}</p>
      <p v-show="cardDetail.series" class="normal"><span class="f4">所属系列</span>：{{cardDetail.series}}</p>
      <p v-show="cardDetail.type" class="normal"><span class="f2">类型</span>：{{cardDetail.type}}</p>
      <p v-show="cardDetail.flavor" class="flavor">{{cardDetail.flavor}}</p>
    </div>
    <div class="footer">
      <FooterMenu></FooterMenu>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import {genOrigImageURL, genCardsImageURL, gen512CardsImageURL} from '@/utils'
import {getCardDetail} from "@/api/dbapi";
import FooterMenu from '@/components/FooterMenu'

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
    FooterMenu
  },
  data() {
    return {
      cardId: null,
      cardDetail: Object.assign({}, defaultCardDetail),
    }
  },
  methods: {
    initCardDetail() {
      getCardDetail(parseInt(this.cardId)).then(res => {
        this.cardDetail = res[0]
        this.cardDetail.bgImg = genOrigImageURL(this.cardDetail.hsId)
        this.cardDetail.cardImg = gen512CardsImageURL(this.cardDetail.hsId)
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
        wx.stopPullDownRefresh();
      }).catch(err => {
        console.log(err)
        wx.stopPullDownRefresh();
      })
    },
    previewCard() {
      wx.previewImage({
        urls: [gen512CardsImageURL(this.cardDetail.hsId)] // 需要预览的图片http链接列表
      })
    }
  },
  mounted() {
    this.cardId = this.$root.$mp.query.id
    this.initCardDetail()
  },
  onPullDownRefresh() {
    this.initCardDetail()
  },
  onUnload() {
    this.cardId = null
    this.cardDetail = Object.assign({}, defaultCardDetail)
  },
  onShareAppMessage(res) {
    return {
      title: this.cardDetail.name,
      path: `/pages/cards/cardDetail/main?id=${this.cardId}`
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
    }
    .normal {
      height: 25px;
      font-size: 14px;
    }
    .flavor {
      height: 25px;
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
  .footer {
    position: fixed;
    bottom: 0;
  }
}
</style>
