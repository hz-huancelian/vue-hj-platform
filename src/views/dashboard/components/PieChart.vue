<template>
  <el-card class="box-card-component" shadow="never" style="height: 316px;">
    <div slot="header" class="clearfix">
      <span>本月度-发放报告数</span>
    </div>
    <div id="pieChart" :class="className" :style="{height:height,width:width}" />
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
      default: '230px'
    },
    pieDatas: {
      type: Array,
      required: true
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
      this.chart = echarts.init(document.getElementById('pieChart'))

      const showValue = true; const showPercent = true
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: true,
          orient: 'vertical',
          top: 'center',
          left: 5,
          textStyle: {
            align: 'left',
            verticalAlign: 'middle',
            rich: {
              name: {
                color: 'rgba(255,255,255,0.5)',
                fontSize: 10
              },
              value: {
                color: 'rgba(255,255,255,0.5)',
                fontSize: 10
              },
              rate: {
                color: 'rgba(255,255,255,0.9)',
                fontSize: 10
              }
            }
          },
          formatter: (name) => {
            var datas = this.pieDatas
            let total = 0
            datas.map(item => {
              total += (item.value - 0)
            })
            const valueIndex = datas.map(item => item.name).indexOf(name)
            return name + '  ' + (showValue ? datas[valueIndex].value + ' ' : '') + (showPercent ? '(' + ((datas[valueIndex].value / total) * 100).toFixed(2) + '%)' : '')
          }
        },
        series: [
          {
            type: 'pie',
            center: ['76%', '50%'],
            radius: ['30%', '52%'],
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{value|{c}}\n{label|{b}}',
                rich: {
                  value: {
                    padding: 5,
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 28
                  },
                  label: {
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 16
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12'
                }
              }
            },
            data: this.pieDatas
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
