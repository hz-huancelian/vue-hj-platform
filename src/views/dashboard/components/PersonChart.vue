<template>
  <el-card class="box-card-component" shadow="never" style="height: 316px;">
    <div slot="header" class="clearfix">
      <span>本月度-部门员工数</span>
    </div>
    <div id="personChart" :class="className" :style="{height:height,width:width}" />
  </el-card>
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
      default: '250px'
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
      this.chart = echarts.init(document.getElementById('personChart'))
      this.setOptions(this.chartData)
    },
    setOptions({ yNameData, factorData } = {}) {
      this.chart.setOption({

        xAxis: {
          show: false,
          type: 'value'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          show: true,
          axisLabel: {
            textStyle: {
              color: '#000',
              fontSize: '12'
            }
          },
          data: yNameData
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            stack: 'total',
            label: {
              color: '#fff',
              show: true
            },
            itemStyle: {
              color: '#00CED1'
            },
            emphasis: {
              focus: 'series'
            },
            data: factorData
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
