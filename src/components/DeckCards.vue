<template>
  <div class="cards-list" :style="{width: colNum===1?300+'rpx':'100%', display: colNum===1?'block':'flex'}">
    <div :class="['card-tile', {'menu-item-empty': !card.name}]"
         v-for="(card, index) in formatData"
         :key="index"
         @click="cardClick(card)"
         :style="{width: colNum===1?'100%':'47%', 'margin-top': colNum===1?20+'rpx':5+'rpx'}">
      <div :class="['card-gem', {
        'rarity-common': card.rarity==='FREE'||card.rarity==='COMMON',
        'rarity-rare': card.rarity==='RARE',
        'rarity-epic': card.rarity==='EPIC',
        'rarity-legendary': card.rarity==='LEGENDARY',
        'display-none': !card.name}]">
        <span class="card-cost">{{card.cost}}</span>
      </div>
      <div class="card-frame" :class="{'display-none': !card.name}">
        <div v-if="card.count && card.count!==1">
          <img class="card-asset" :src="card.img" mode="aspectFill" :style="{right: 22+'px'}">
          <span class="card-fade-countbox" :style="{background: 'linear-gradient(65deg,#313109,#313131 calc(100% - 120px),rgba(49,49,49,0) calc(100% - 50px),rgba(49,49,49,0))'}"></span>
        </div>
        <div v-else>
          <img class="card-asset" :src="card.img" mode="aspectFill" :style="{right: 0}">
          <span class="card-fade-countbox" :style="{background: 'linear-gradient(65deg,#313109,#313131 calc(100% - 96px),rgba(49,49,49,0) calc(100% - 26px),rgba(49,49,49,0));'}"></span>
        </div>
        <span class="card-name">{{card.cname}}</span>
        <div class="card-countbox" v-show="card.count && card.count!==1">
          <span class="card-count">{{card.count}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {genTileImageURL} from "@/utils";

export default {
  name: 'DeckCards',
  props: ['cards', 'colNum'],
  data() {
    return {
      formatData: null
    }
  },
  methods: {
    showCount(item) {
      return item.count === '★' || item.count > 1;
    },
    genTileImage(hsId) {
      return genTileImageURL(hsId)
    },
    cardClick(item) {
      this.$emit('cardClick', item)
    }
  },
  watch: {
    cards: function(val) {
      if(this.cards) {
        if (typeof val === 'string') {
          this.formatData = JSON.parse(val)
        } else {
          this.formatData = val
        }
        for (let card of this.formatData) {
          card['img'] = this.genTileImage(card.card_hsid)
          if (card.rarity === 'LEGENDARY') {
            card['count'] = '★'
          }
        }
        if (this.formatData.length % 2 && this.colNum !== 1) {
          this.formatData.push({})
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color';
.cards-list {
  width: 100%;
  /*min-height: 279px;*/
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  color: white;
  box-sizing: border-box;
  .card-tile {
    width: 47%;
    height: 58rpx;
    line-height: 58rpx;
    font-size: 14px;
    margin-top: 5rpx;
    /*text-shadow: -1rpx -1rpx 0 #000, 1rpx -1rpx 0 #000, -1rpx 1rpx 0 #000, 1rpx 1rpx 0 #000;*/
    /*border: 1px solid transparent;*/
    border-radius: 8rpx;
    box-sizing: border-box;
    .card-gem {
      float: left;
      width: 55rpx;
      height: 100%;
      text-align: center;
      border-radius:8rpx 0 0 8rpx;
    }
    .card-frame {
      position: relative;
      height: 100%;
      font-size: 12px;
      overflow: hidden;
      border-radius:0 8rpx 8rpx 0;
      .card-asset {
        position: absolute;
        width: 200rpx;
        height: 100%;
      }
      .card-name {
        position: absolute;
        font-weight: 700;
        left: 5px;
        width: calc(100% - 27px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .card-fade-countbox {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      .card-countbox {
        position: relative;
        float: right;
        width: 22px;
        height: 100%;
        background-color: $palette-bg-black;
        .card-count {
          position: absolute;
          width: 100%;
          color: $palette-text-yellow;
          text-align: center;
          font-weight: 700;
        }
      }
    }
  }
}
.rarity-common {
  background-color: $palette-rarity-common;
}
.rarity-rare {
  background-color: $palette-rarity-rare;
}
.rarity-epic {
  background-color: $palette-rarity-epic;
}
.rarity-legendary {
  background-color: $palette-rarity-legendary;
}
.menu-item-empty {
  border: none !important;
}
.display-none {
  display: none;
}
</style>
