<template>
  <div class="container">
    <div class="wrap">
      <mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleInit" ref="echarts" :canvasId="canvasId"/>
    </div>
  </div>
</template>
<script>
import * as echarts from '../libs/echarts.simple.min'
import mpvueEcharts from 'mpvue-echarts'
let barChart = null
const defaultColors = '#433E88'
export default {
  name: 'BarChart',
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
      let colors = []
      if (!this.colors || this.colors.length <= 0) {
        colors = [defaultColors]
      } else {
        colors = this.colors
      }
      this.option = {
        grid: {x: 0, y: 5, x2: 0, y2: 30},
        xAxis: {
          show: true,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: this.chartData.xAxis,
          axisLine: {
            lineStyle: {
              color: defaultColors,
            }
          },
          axisLabel: {
            fontSize: 14,
            fontWeight: 'bold',
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          type: 'value',
          min: 0,
          max: 100,
        },
        series: [{
          animation: false,
          type: 'bar',
          barWidth: 15,
          data: this.chartData.yAxis,
          itemStyle: {
            normal: {
              // 定制显示（按顺序）
              color: function (params) {
                if (colors.length > 1) {
                  return colors[params.dataIndex]
                } else {
                  return colors[0]
                }
              },
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: 'auto',
                  fontSize: 12,
                  fontWeight: 'bold'
                },
                formatter: `{c}${this.chartData.unit?this.chartData.unit:''}`
              }
            }
          }
        }]
      }
      this.option.yAxis.min = this.chartData.min?this.chartData.min:0
      this.option.yAxis.max = this.chartData.max?this.chartData.max:Math.max.apply(null, this.chartData.yAxis)+5
      this.$refs.echarts.init()
    },
    handleInit (canvas, width, height) {
      barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(barChart)
      barChart.setOption(this.option)
      let _this = this
      barChart.on('click', function (params) {
        _this.$emit('barClick', params)
      });
      return barChart
    },
  },
  watch: {
    chartData: {
      handler(val) {
        if (typeof(val) === 'string') {
          this.chartData = JSON.parse(val)
          this.initChart()
        }
      },
      deep: true
    },
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 150px;
}
</style>
