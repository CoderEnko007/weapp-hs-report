<template>
  <div class="container">
    <NavBar></NavBar>
    <div class="panel-tab">
      <block v-for="(item,index) in tabbar" :key="index">
        <div :id="index" :class="{'tab-item': true, 'tab-item-active': activeIndex==index}" @click="tabBarClick">
          {{item.text}}
        </div>
      </block>
    </div>
    <div class="tab-container">
      <swiper class="content" :duration="50" :style="'height:'+contentHeight" @change="swiperChange" :current="currentTab" @animationfinish="onAnimationfinish">
        <swiper-item>
          <ArchetypeList></ArchetypeList>
        </swiper-item>
        <swiper-item>
          <DecksList></DecksList>
        </swiper-item>
      </swiper>
      <!--<div :hidden="activeIndex != 0"><ArchetypeList></ArchetypeList></div>-->
      <!--<div :hidden="activeIndex != 1"><DecksList></DecksList></div>-->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getWinRateData} from "@/api/dbapi";
import NavBar from '@/components/NavBar'
import DecksList from './components/DecksList'
import ArchetypeList from './components/ArchetypeList'

export default {
  components: {
    NavBar,
    DecksList,
    ArchetypeList
  },
  data() {
    return {
      // swiper需要的参数
      tabbar: [
        {id: 'archetype', text: '卡组形态'},
        {id: 'faction', text: '职业卡组'}
      ],
      activeIndex: 0,
      currentTab: 0,
    }
  },
  computed: {
    ...mapGetters([
      'winWidth',
      'winHeight',
    ]),
    contentHeight() {
      return this.winHeight + "px";
    }
  },
  methods: {
    tabBarClick(e) {
      this.activeIndex = e.currentTarget.id;
      this.currentTab =this.activeIndex;
    },
    swiperChange(e) {
      this.currentTab = e.mp.detail.current;
      this.activeIndex = this.currentTab;
    },
    // onAnimationfinish() {
    //   console.log("滑动完成.....")
    // },
  },
  // onPullDownRefresh() {
  //   this.$store.dispatch('getDecksName')
  // },
  onShareAppMessage(res) {
    return {
      title: '炉石传说情报站',
      path: '/pages/index/main'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/color';
.container {
  .panel-tab {
    position: fixed;
    width: 100%;
    height: 89rpx;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    background-color: #fff;
    border-bottom: 1rpx solid #eee;
    z-index: 2;
    .tab-item {
      position: relative;
      height: 100%;
      width: 232rpx;
      line-height: 89rpx;
      font-size: 16px;
      color: #666;
      text-align: center;
      &:after {
        display: none;
        content: '';
        position: absolute;
        width: 53rpx;
        height: 4rpx;
        bottom: 16rpx;
        left: 50%;
        transform: translateX(-50%);
        background-color: $palette-blue;
      }
    }
    .tab-item-active {
      color: $palette-blue;
      font-weight: bold;
      &:after {
        display: block;
        animation: tabBottomIn .4s;
      }
    }
  }
  .tab-container {
    position: fixed;
    width: 100%;
    margin-top: 89rpx;
    z-index: 1;
  }
}
@keyframes tabBottomIn {
   from {width: 100%; opacity: 0}
   to {width: 53rpx; opacity: 1}
 }
</style>
