<template>
  <image
    :mode="node.attr.mode"
    :lazy-load="node.attr.lazyLoad"
    :class="node.classStr"
    :style="newStyleStr || node.styleStr"
    :data-src="node.attr.src"
    :src="node.attr.src"
    @tap="wxParseImgTap"
    @load="wxParseImgLoad"
    />
</template>

<script>
export default {
  name: 'wxParseImg',
  data() {
    return {
      newStyleStr: '',
      preview: true,
    };
  },
  props: {
    node: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    wxParseImgTap(e) {
      if (!this.preview) return;
      const { src } = e.target.dataset;
      if (!src) return;
      this.node.$host.preview(src, e);
    },
    // 图片视觉宽高计算函数区
    wxParseImgLoad(e) {
      const { src } = e.target.dataset;
      if (!src) return;
      const { width, height } = e.mp.detail;
      const recal = this.wxAutoImageCal(width, height);
      const { imageheight, imageWidth } = recal;
      // 图片容器有30rpx左右边距时需要对宽度进行处理，否则图片会超出边界
      // const tempWidth = (imageWidth>imageheight)&&imageWidth>=375?(imageWidth-30):imageWidth
      // const tempHeight = imageWidth>imageheight&&imageWidth>=375?(imageheight-20):imageheight
      let tempWidth = imageWidth
      let tempHeight = imageheight
      if (imageWidth>=375) {
        tempWidth = (imageWidth-30)
        tempHeight = 345*imageheight/imageWidth
      }
      if (tempHeight>500) {
        tempHeight = 500
        tempWidth = 500*tempWidth/imageheight
      }
      const { padding, mode } = this.node.attr;
      const { styleStr } = this.node;
      const imageHeightStyle = mode === 'widthFix' ? '' : `height: ${tempHeight}px;`;
      this.newStyleStr = `${styleStr}; ${imageHeightStyle}; width: ${tempWidth}px; padding: 0 ${+padding}px;`;
      // console.log(imageWidth, imageheight, tempWidth, tempHeight)
    },
    // 计算视觉优先的图片宽高
    wxAutoImageCal(originalWidth, originalHeight) {
      // 获取图片的原始长宽
      const { padding } = this.node.attr;
      const windowWidth = this.node.$screen.width - (2 * padding);
      const results = {};

      if (originalWidth < 60 || originalHeight < 60) {
        const { src } = this.node.attr;
        this.node.$host.removeImageUrl(src);
        this.preview = false;
      }

      // 判断按照那种方式进行缩放
      if (originalWidth > windowWidth) {
        // 在图片width大于手机屏幕width时候
        results.imageWidth = windowWidth;
        results.imageheight = windowWidth * (originalHeight / originalWidth);
      } else {
        // 否则展示原来的数据
        results.imageWidth = originalWidth;
        results.imageheight = originalHeight;
      }

      return results;
    },
  },
};
</script>
