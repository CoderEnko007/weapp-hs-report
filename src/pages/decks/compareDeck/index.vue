<template>
  <div class="container">
    <NavBar :showCapsule="true" navTitle="卡组对比"></NavBar>
    <div class="header-container">
      <div class="banner" v-if="!checkSameFaction">
        <div class="deck-bgi left" :style="{'background-image': deckBGImage1}"></div>
        <div class="deck-bgi right" :style="{'background-image': deckBGImage2}"></div>
      </div>
      <div class="banner" v-else>
        <div class="single-deck-bgi" :style="{'background-image': deckBGImage1}"></div>
      </div>
      <div class="overviews">
        <div class="meta-block" v-for="(deck, index) in decksInfo" :key="index" :class="{'left': index===0, 'right': index===1}">
          <div class="deck-name">
            <div class="icon">
              <img :src="deck.factionIcon" mode="aspectFit">
            </div>
            <div class="name">
              <p class="cname">{{deck.cname}}</p>
              <div class="dust-cost" v-show="deck.dust_cost">
                <img :src="dustImage" mode="aspectFit">
                <p>{{deck.dust_cost}}</p>
              </div>
            </div>
          </div>
          <div class="desc">
            <div class="desc-item" v-show="deck.real_win_rate">
              <span class="item-name">胜率：</span>
              <span class="item-meta font-bold color-light-green" :class="{'color-red': deck.real_win_rate<50}">{{deck.real_win_rate}}%</span>
            </div>
            <div class="desc-item" v-show="deck.game_count">
              <span class="item-name">对局数：</span>
              <span class="item-meta">{{deck.game_count}}</span>
            </div>
            <div class="desc-item" v-show="deck.duration">
              <span class="item-name">对局时长：</span>
              <span class="item-meta">{{deck.duration}}分钟</span>
            </div>
            <div class="desc-item" v-show="deck.turns">
              <span class="item-name">回合数：</span>
              <span class="item-meta">{{deck.turns}}</span>
            </div>
          </div>
          <!--<div class="detailBtn" @click="gotoDeckDetail(deck)">-->
            <!--<span>查看详情</span>-->
            <!--<span class="iconfont">&#xe600;</span>-->
          <!--</div>-->
        </div>
      </div>
      <div class="vs-icon">
        <img src="/static/icons-v2/VS.png" mode="aspectFit">
      </div>
    </div>
    <div class="card-list" v-if="compareDeck1 && compareDeck2">
      <div class="list-panel" v-for="(deck, index) in decksInfo" :key="index">
        <DeckCards :cards="deck.card_list" :colNum="1" @cardClick="handleCardClick"></DeckCards>
      </div>
    </div>
    <div class="card-list" style="min-height: 600px;" v-else>
      <LoadingCard showFlag="true"></LoadingCard>
    </div>
    <div class="copyCode">
      <div class="deck-code m-30" v-show="compareDeck1.card_list.length>0">
        <div class="code"><span>{{compareDeck1.deck_code}}</span></div>
        <div class='btn' @click="copyDeckCode(compareDeck1.deck_code)">复制代码（左）</div>
      </div>
      <div class="deck-code m-30" v-show="compareDeck2.card_list.length>0">
        <div class="code"><span>{{compareDeck2.deck_code}}</span></div>
        <div class='btn'  @click="copyDeckCode(compareDeck2.deck_code)">复制代码（右）</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/utils'
import NavBar from '@/components/NavBar'
import DeckCards from '@/components/DeckCards'
import LoadingCard from '@/components/LoadingCard'

export default {
  components: {
    NavBar,
    DeckCards,
    LoadingCard
  },
  data() {
    return {
      dustImage: utils.image.dustImage,
    }
  },
  computed: {
    ...mapGetters([
      'compareDeck1',
      'compareDeck2'
    ]),
    deckBGImage1() {
      return this.compareDeck1?'url('+utils.faction[this.compareDeck1['faction']].bgImage+')':''
    },
    deckBGImage2() {
      return this.compareDeck2?'url('+utils.faction[this.compareDeck2['faction']].bgImage+')':''
    },
    checkSameFaction() {
      return this.compareDeck1.faction === this.compareDeck2.faction
    },
    decksInfo() {
      return [this.compareDeck1, this.compareDeck2]
    },
  },
  methods: {
    handleCardClick(item) {
      wx.navigateTo({
        url: `/pages/cards/cardDetail/main?id=${item.dbfId}`
      })
    },
    gotoDeckDetail(item) {
      wx.navigateTo({
        url: `/pages/decks/deckDetail/main?id=${item.id}`
      })
    },
    copyDeckCode(code) {
      wx.setClipboardData({
        data: code,
        success: function(res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    }
  },
  mounted() {
    this.compareDeck1.factionIcon = utils.faction[this.compareDeck1.faction].image;
    this.compareDeck2.factionIcon = utils.faction[this.compareDeck2.faction].image;
    this.compareDeck1.card_list = typeof this.compareDeck1.card_list === 'string'?JSON.parse(this.compareDeck1.card_list):this.compareDeck1.card_list;
    this.compareDeck2.card_list = typeof this.compareDeck2.card_list === 'string'?JSON.parse(this.compareDeck2.card_list):this.compareDeck2.card_list;
    for (let card of this.compareDeck1.card_list) {
      if (!card.dbfId) {
        continue
      }
      let res = this.compareDeck2.card_list.filter(v => {
        return v.dbfId === card.dbfId && v.count === card.count
      });
      card['diffFlag'] = res.length <= 0;
    }
    for (let card of this.compareDeck2.card_list) {
      if (!card.dbfId) {
        continue
      }
      let res = this.compareDeck1.card_list.filter(v => {
        return v.dbfId === card.dbfId && v.count === card.count
      });
      card['diffFlag'] = res.length <= 0;
    }
  }
}
</script>
<style scoped lang="scss">
@import '../../../style/color';

.container {
  width: 100%;
  overflow: hidden;
  .header-container {
    position: relative;
    width: 100%;
    height: 400rpx;
    overflow: hidden;
    .banner {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,.1), rgba(0,0,0,.4));
      }
      .single-deck-bgi {
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: 100%;
      }
      .deck-bgi {
        position: absolute;
        flex: 1 1 0;
        width: 100%;
        height: 100%;
        background-position-x:50rpx;
        background-size:90%;
      }
      .left {
        right: 25%;
      }
      .right {
        left: 25%;
        -webkit-mask-image: -webkit-gradient(linear,left top,right top,color-stop(0,transparent),color-stop(15%,transparent),color-stop(35%,#000),color-stop(100%,#000));
      }
    }
    .overviews {
      position: absolute;
      width: 100%;
      height: 100%;
      .meta-block {
        position: absolute;
        width: 50%;
        height: 100%;
        padding: 30rpx 40rpx;
        box-sizing: border-box;
        .deck-name {
          width: 240rpx;
          margin: 0 auto;
          box-sizing:border-box;
          .icon {
            float: left;
            width: 88rpx;
            height: 88rpx;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .name {
            max-width: 150rpx;
            margin-left: 107rpx;
            color: #fff;
            .cname {
              height:50rpx;
              line-height:50rpx;
              font-size: 35rpx;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
            }
            .dust-cost {
              position: relative;
              height:44rpx;
              line-height:44rpx;
              font-size: 12px;
              img {
                position: absolute;
                width: 23rpx;
                height: 32rpx;
                top: 50%;
                transform: translateY(-50%);
              }
              p {
                height: 100%;
                line-height: 44rpx;
                display: inline-block;
                margin-left: 28rpx;
              }
            }
          }
        }
        .desc {
          display: flex;
          height:240rpx;
          justify-content: space-between;
          flex-direction: column;
          box-sizing: border-box;
          padding: 20rpx 20rpx 0;
          .desc-item {
            line-height: 45rpx;
            color: white;
            font-size: 13px;
            text-align: center;
          }
        }
        .detailBtn {
          width: 154rpx;
          height: 50rpx;
          line-height: 50rpx;
          padding-left: 30rpx;
          margin:20rpx auto 0;
          color: #fff;
          border: 1rpx solid rgba(255,255,255,0.50);
          border-radius: 27px;
          font-size: 13px;
          background: rgba(0,0,0,0.20);
        }
      }
      .left {
        left: 0;
      }
      .right {
        right: 0;
      }
    }
    .vs-icon {
      position: absolute;
      width: 50rpx;
      height: 50rpx;
      color: #fff;
      left: 0;
      right: 0;
      top: -60%;
      bottom: 0;
      margin: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .card-list {
    position: relative;
    padding:30rpx 30rpx 0;
    display:flex;
    justify-content:space-between;
    box-sizing: border-box;
    width: 100%;
    .list-panel {
      width: 320rpx;
    }
  }
  .copyCode {
    margin: 30rpx 0;
    .deck-code {
      position: relative;
      height: 64rpx;
      margin-top: 20rpx;
      margin-bottom: 10rpx;
      border-radius: 32rpx;
      box-sizing: border-box;
      .btn {
        float: right;
        height: 100%;
        line-height: 64rpx;
        width: 207rpx;
        font-size: 13px;
        color: white;
        background-color: $palette-blue;
        border-radius: 37px;
        margin-left: 18rpx;
        text-align:center;
        padding-left:15rpx;
        box-sizing:border-box;
      }
      .code {
        height: 100%;
        line-height: 64rpx;
        display: inline-block;
        width: 467rpx;
        color: #666;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 32px;
        background-color: #f8f8f8;
        padding: 0 21rpx 0 13rpx;
        box-sizing: border-box;
        text-align: center;
        span {
          width: 433rpx;
        }
      }
    }
  }
}
</style>
