<template>
<div class="container" v-show="detail">
  <NavBar :showCapsule="true"></NavBar>
  <div class="banner" v-if="detail&&detail.main_article===null">
    <img :src="detail&&detail.cover" mode="aspectFill">
  </div>
  <div class="article-detail">
    <div class="title">{{detail&&detail.title}}</div>
    <div class="meta">
      <div class="author">
        <img :src="detail&&detail.logo.path" mode="aspectFit">
        <span class="name">{{detail&&detail.author}}</span>
      </div>
      <div class="date">
        {{detail&&detail.date}}
      </div>
    </div>
    <div class="separator"></div>
    <div class="content">
      <wxParse :content="detail&&detail.content" :imageProp="{lazyLoad:'true', mode:'aspectFit'}"/>
    </div>
    <div class="sub-article">
      <div v-for="(item, index) in subList" :key="index" @click="handleSubArticleClick(item)">
        <p>{{item.title}}</p>
      </div>
    </div>
  </div>
  <copyRight></copyRight>
</div>
</template>
<script>
import wxParse from '@/components/mpvue-wxparse/src/wxParse'
import { getArticleDetail, getArticleList } from "../../../api/dbapi";
import utils from '@/utils'
import NavBar from '@/components/NavBar'
import copyRight from '@/components/copyRight'

export default {
  name: 'articleDetail',
  components: {
    NavBar,
    wxParse,
    copyRight
  },
  data() {
    return {
      contentID: null,
      groupID: null,
      detail: null,
      subList: null,
      mainArticleId: null,
      date: null,
    }
  },
  methods: {
    async genArticleDetal() {
      let params = {
        groupID: this.groupID,
        contentID: this.contentID
      }
      this.detail = await getArticleDetail(params)
      this.detail.date = utils.formatTime(new Date(this.detail.created_at*1000), true)
      this.mainArticleId = this.detail.id
    },
    async genSubArticle() {
      let params = {
        contentGroupID: 1533090852072321,
        groupID: this.groupID,
        contentID: this.contentID,
        mainArticleId: this.mainArticleId,
      }
      let res = await getArticleList(params, 10, 0, 'created_at')
      this.subList = res.objects
    },
    handleSubArticleClick(item) {
      wx.navigateTo({
        url: `/pages/index/articleDetail/main?group_id=${item.group_id}&id=${item.id}`
      })
    },
    preview(src, e) {
      console.log('preview', src, e)
    },
    navigate(href, e) {
      console.log('navigate', href, e)
    }
  },
  async mounted() {
    // this.contentID = 1561880472705483
    // this.groupID = 1533090852072321
    this.contentID = this.$root.$mp.query.id
    this.groupID = this.$root.$mp.query.group_id
    await this.genArticleDetal()
    await this.genSubArticle()
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/color';
.banner {
  width: 100%;
  height: 335rpx;
  img {
    width: 100%;
    height: 100%;
  }
}
.article-detail {
  padding: 20rpx 30rpx;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin: 18rpx 0 0;
  }
  .meta {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 100%;
    margin: 20rpx 2rpx 0;
    .author {
      position: relative;
      height: 40rpx;
      width:200rpx;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        width: 40rpx;
        height: 40rpx;
      }
      .name {
        position:absolute;
        left:50rpx;
        width: 220rpx;
        line-height: 40rpx;
        font-size: 10px;
        color: #000;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .date {
      line-height: 40rpx;
      font-size: 10px;
      color: $palette-text-gray;
    }
  }
  .content {
    padding: 20rpx 0 0;
  }
  .sub-article {
    color: #0e67fa;
    font-size:16px;
    line-height:30px;
    text-decoration:underline;
    margin: 10rpx 0;
  }
}
.separator {
  width: 100%;
  height: 1rpx;
  margin-top: 15rpx;
  background-color: #eee;
}
</style>
