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
    setOptions({ xNameData, title, contactNum, contactMoney } = {}) {
      this.chart.setOption({
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
        },
        legend: {
          data: ['合同数(份)', '合同金额(元)']
        },
        xAxis: [
          {
            type: 'category',
            data: xNameData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '合同金额(元)',
            min: 0,
            interval: 10000,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '合同数(份)',
            min: 0,
            interval: 3,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '合同金额(元)',
            barWidth: 35,
            temStyle: {
              color: '#00b3f4',
              borderColor: '#fff',
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0,179,244,0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(0,179,244,0)'
                }
                ], false),
                shadowColor: 'rgba(0,179,244, 0.9)',
                shadowBlur: 20
              }
            },
            lineStyle: {
            // normal: {
            //   color: '#00b3f4',
            //   shadowColor: 'rgba(0, 0, 0, .3)',
            //   shadowBlur: 0,
            //   shadowOffsetY: 5,
            //   shadowOffsetX: 5
            // }
            },
            label: {
              show: true,
              position: 'top'
            },
            smooth: true,
            type: 'bar',
            data: contactMoney
          },
          {
            name: '合同数(份)',
            type: 'line',
            yAxisIndex: 1,
            data: contactNum
          }
        ]
      })
    }
  }
}
</script>
