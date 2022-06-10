<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ xNameData, title, xTitle, xValData } = {}) {
      const color = [
        '#99CCCC',
        '#36CE9E',
        '#FFC005',
        '#FF515A',
        '#8B5CFF',
        '#00CA69'
      ]
      this.chart.setOption({
        tile: '1',
        legend: {
          right: 10,
          top: 10
        },
        tooltip: {
        },
        grid: {
          top: 50,
          left: 10,
          right: 10,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          // boundaryGap: false,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#333'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#D9D9D9'
            }
          },
          data: xNameData
        }],
        yAxis: [{
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#666'
            }
          },
          nameTextStyle: {
            color: '#666',
            fontSize: 12,
            lineHeight: 40
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#E9E9E9'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: xTitle,
          type: 'line',
          smooth: true,
          symbolSize: 8,
          zlevel: 3,
          label: {
            show: true,
            formatter: (params) => {
              return `${params.value}` + ''
            },
            textStyle: { fontSize: 16, color: color[4] }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [{
                  offset: 0,
                  color: color[0]
                },
                {
                  offset: 1,
                  color: color[0]
                }
                ],
                false
              )
            }
          },
          data: xValData
        }]
      })
    }
  }
}
</script>
