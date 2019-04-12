<template>
  <scroll-view scroll-y='true'
               @scrolltolower='scrollToBottom'
               @scrolltoupper="scrollToTop"
               :style="{height: winHeight-177+'px'}">
    <div class="card-list">
      <div class="card" v-for="(item, index) in list" :key="index" @click="handleClick(item)">
        <img :src="item.image" mode="aspectFit">
        <p>{{item.name}}</p>
      </div>
    </div>
    <div class="load-panel" style="margin-top:-20px; margin-bottom:5vh;">
      <ZanLoadmore v-if="loading" v-bind="{ loading: true }" />
      <ZanLoadmore v-else-if="nodata" v-bind="{ nodata: true }" />
      <ZanLoadmore v-else v-bind="{ nomore: true }" />
    </div>
  </scroll-view>
</template>
<script>
import { mapGetters } from 'vuex'
import ZanLoadmore from '@/components/loadmore'
export default {
  name: 'CardList',
  props: ['list', 'loading', 'nodata'],
  components: {
    ZanLoadmore
  },
  computed: {
    ...mapGetters([
      'winWidth',
      'winHeight'
    ]),
  },
  methods: {
    handleClick(item) {
      this.$emit('cardClick', item)
    },
    scrollToBottom(e) {
      // console.log('scroll to bottom', e)
      this.$emit('scrollToBottom')
    },
    scrollToTop(e) {
      // console.log('scroll to top', e)
      this.$emit('scrollToTop')
    },
  },
}
</script>
<style lang="scss" scoped>
.card-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 18rpx 18rpx 0;
  margin-top: 15rpx;
  overflow: hidden;
  .card {
    width: 30%;
    height: 260rpx;
    padding: 0 0 8rpx;
    margin-bottom: 65rpx;
    text-align: center;
    font-size: 12px;
    img {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transform:scale(1.3);
    }
    p {
      width: 100%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

</style>
