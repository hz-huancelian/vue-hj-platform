<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
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
      default: '260px'
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
    setOptions({ xNameData, title, xValData } = {}) {
      const markArr = []
      xValData.forEach(function(v, i) {
        markArr.push({
          value: v,
          xAxis: i,
          yAxis: v
        })
      })

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
        xAxis: [
          {
            type: 'category',
            data: xNameData,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        grid: {
          containLabel: true,
          top: 15,
          left: 0,
          right: 10,
          bottom: 16
        },
        yAxis: [
          {
            type: 'value',
            min: 0,
            interval: 10000,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            data: xValData,
            type: 'bar',
            smooth: true,
            barWidth: 28,
            markPoint: {
              itemStyle: {
                color: '#7B73FE'
              },
              data: markArr
            },
            itemStyle: {
              color: '#7B73FE'
            }
          }
        ]
      })
    }
  }
}
</script>

