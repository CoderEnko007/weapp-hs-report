<template>
  <div class="container">
    <div class="wrap">
      <mpvue-echarts :echarts="echarts" :onInit="handleInit" ref="echarts" :canvasId="canvasId"/>
    </div>
  </div>
</template>
<script>
import * as echarts from '../libs/echarts.simple.min'
import mpvueEcharts from 'mpvue-echarts'
let pieChart = null
const defaultColors = '#555'
export default {
  name: 'PieChart',
  props: ['chartData', 'canvasId', 'colors'],
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
        series: [{
          animation: false,
          label: {
            show: true,
            normal: {
              fontSize: 14,
              color: defaultColors,
              formatter:'{b}x{c}',
            }
          },
          labelLine: {
            show: true,
            lineStyle: {
              color: defaultColors
            }
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: [0, '60%'],
          data: this.chartData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 2, 2, 0.3)'
            },
          }
        }]
      }
      if (this.colors) {
        this.option['color'] = this.colors
      }
      this.$refs.echarts.init()
    },
    handleInit(canvas, width, height) {
      pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(pieChart)
      if (this.option) {
        pieChart.setOption(this.option)
      }
      return pieChart
    }
  },
  watch: {
    // 父组件将data转换为json字符串传递进来，否则无法触发watch
    chartData: {
      handler: function (val) {
        if (typeof(val) === 'string') {
          this.chartData = JSON.parse(val).filter(item => {
            return item.value > 0
          })
          this.initChart()
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 180px;
}
</style>
