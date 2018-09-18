<template>
  <div class="container">
    <div class="wrap">
      <mpvue-echarts :echarts="echarts" :onInit="handleInit" ref="echarts"/>
    </div>
  </div>
</template>
<script>
import * as echarts from '../libs/echarts.simple.min'
import mpvueEcharts from 'mpvue-echarts'

export default {
  name: 'PieChart',
  props: ['list'],
  components: {
    mpvueEcharts
  },
  data() {
    return {
      option: null,
      echarts,
    }
  },
  methods: {
    initChart() {
      this.option = {
        backgroundColor: '#ffffff',
        color: ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
        series: [{
          label: {
            normal: {
              fontSize: 14
            }
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: [0, '60%'],
          data: [{
            value: 55,
            name: '北京'
          }, {
            value: 20,
            name: '武汉'
          }, {
            value: 10,
            name: '杭州'
          }, {
            value: 20,
            name: '广州'
          }, {
            value: 38,
            name: '上海'
          }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 2, 2, 0.3)'
            }
          }
        }]
      }
      this.$refs.echarts.init()
    },
    handleInit(canvas, width, height) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      chart.setOption(this.option)
      return chart
    }
  },
  mounted() {
    this.initChart()
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 300px;
}
</style>
