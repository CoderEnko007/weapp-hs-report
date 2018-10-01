<template>
  <div class="card-list">
    <div class="zan-panel">
      <div class="zan-card" v-for="item in list" :key="item.id" @click="handleClick(item)">
        <div class="zan-card__thumb">
          <img class="zan-card__img" :src="item.background_img" mode="aspectFit">
        </div>
        <div class="zan-card__detail">
          <div class="zan-card__detail-row">
            <h2>{{item.deck_name}}</h2>
          </div>
          <div class="zan-card__detail-row zan-c-gray-darker">
            <div class="desc">
              <div class="detail-item dust-cost"><img :src="dustImage" mode="aspectFit"><span>{{item.dust_cost}}</span></div>
              <div class="detail-item win-rate">胜率：{{item.win_rate}}%</div>
              <div class="detail-item games">对局数：{{item.game_count}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'DecksBoard',
  props: ['list'],
  data() {
    return {
      deckName: [],
      dustImage: utils.image.dustImage
    }
  },
  methods: {
    handleClick(item) {
      this.$emit('itemClick', item)
    },
    translateDeckName() {
      for (let index in this.list) {
        if (this.list.hasOwnProperty(index)) {
          let temp = this.decksName.filter(item => {
            return item.ename === this.list[index].deck_name
          })
          if (temp[0] && temp[0].cname) {
            this.list[index].deck_name = temp[0].cname
          }
        }
      }
    }
  },
  watch: {
    'list': function(val) {
      console.log(val)
      this.decksName = this.$store.state.cards.decksName
      this.translateDeckName()
    }
  }
}
</script>
<style lang="scss" scoped>
.zan-card {
  border-bottom: 1px solid #EEE;
  .zan-card__thumb {
    width: 90rpx;
    height: 90rpx;
  }
  .zan-card__detail {
    margin-left: 110rpx;
  }
  .desc {
    display: flex;
    justify-content: space-between;
    .detail-item {
      display: inline-block;
      position: relative;
      font-size: 12px;
      img{
        position: absolute;
        width: 24rpx;
        height: 24rpx;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .dust-cost {
      width: 100rpx;
      span {
        margin-left: 24rpx;
      }
    }
    .win-rate {
      width: 150rpx;
    }
    .games {
      width: 185rpx;
    }
  }
}
</style>
