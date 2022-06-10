<template>
  <div :id="'smallBoxChart' + boxName" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    chartForm: {
      type: Object,
      default() {
        return {
          xNameData: [],
          xValData: []
        }
      }
    },
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
      default: '270px'
    },
    boxName: {
      type: String,
      default: ''
    }
  },
  watch: {
    chartForm: {
      deep: true,
      handler(val) {
        this.setOption(val)
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
      this.chart = echarts.init(document.getElementById('smallBoxChart' + this.boxName))
      this.setOption(this.chartForm)
    },
    setOption({ xNameData, xValData, inv } = {}) {
      this.chart.setOption({
        tooltip: {
          show: true,
          backgroundColor: '#fff',
          borderColor: '#ddd',
          borderWidth: 1,
          textStyle: {
            color: '#3c3c3c',
            fontSize: 16
          },
          formatter: function(p) {
            return (
              '完成：' +
                p.value +
                '<br>'
            )
          },
          extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)'
        },
        grid: {
          containLabel: true,
          top: 0,
          left: 0,
          right: 15,
          bottom: 30
        },
        xAxis: {
          show: false,
          type: 'value',
          inverse: inv, // 使横向柱状图靠右侧y轴显示
          splitLine: {
            show: false
          },
          max: function(value) {
            return value.max * 1.2
          },
          axisLine: {
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            color: '#000'
          }
        },
        yAxis: [{
          type: 'category',
          position: inv ? 'right' : 'left',
          axisLabel: {
            fontSize: 12,
            color: '#000'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: xNameData
        }],
        series: [
          {
            name: '数值',
            stack: '2',
            legendHoverLink: false,
            type: 'bar',
            barWidth: 28,
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: !inv ? [0, 7, 7, 0] : [7, 0, 0, 7],
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  1,
                  [
                    {
                      offset: 0,
                      color: inv ? '#1782FB' : '#fff'
                    },
                    {
                      offset: 1,
                      color: inv ? '#fff' : '#1782FB'
                    }
                  ],
                  false
                ),
                label: {
                  show: true,
                  color: '#000',
                  position: !inv ? 'right' : 'left',
                  formatter: function(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: xValData
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.clearfix {
  line-height: 50px;
  padding-left: 15px;
}
</style>
