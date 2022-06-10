<template>
  <div :id="'leftBarChart' + boxName" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
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
      default: '300px'
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
      this.chart = echarts.init(document.getElementById('leftBarChart' + this.boxName))
      this.setOption(this.chartForm)
    },
    setOption({ xNameData, idle, use, maintain } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {
          right: 10,
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: xNameData
        },
        series: [
          {
            name: '使用中',
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            emphasis: {
              focus: 'series'
            },
            data: maintain
          },
          {
            name: '检修中',
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            emphasis: {
              focus: 'series'
            },
            data: use
          },
          {
            name: '闲置中',
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            emphasis: {
              focus: 'series'
            },
            data: idle
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
