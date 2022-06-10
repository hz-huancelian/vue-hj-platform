<template>
  <div style="position:relative;">
    <div id="topPieChart" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
export default {
  props: {
    pieDatas: {
      type: Array,
      required: true
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
      default: '220px'
    }
  },
  data() {
    return {
      chart: {}
      // pieDatas: [
      //   {
      //     value: 30,
      //     name: '站前1标'
      //   },
      //   {
      //     value: 40,
      //     name: '站前2标'
      //   },
      //   {
      //     value: 48,
      //     name: '站前3标'
      //   },
      //   {
      //     value: 28,
      //     name: '站前4标'
      //   },
      //   {
      //     value: 49,
      //     name: '站前5标'
      //   },
      //   {
      //     value: 58,
      //     name: '站前6标'
      //   },
      //   {
      //     value: 45,
      //     name: '站前7标'
      //   }
      // ]
    }
  },
  watch: {
    pieDatas: {
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
      this.chart = echarts.init(document.getElementById('topPieChart'))
      this.setOptions(this.pieDatas)
    },
    setOptions(pieDatas) {
      var totalNum = 0
      pieDatas.forEach(i => {
        totalNum = parseInt(totalNum) + parseInt(i.value)
      })

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '地区分布 <br/>{b} : {c} ({d}%)'
        },
        legend: {
          right: 40,
          top: 40,
          itemGap: 20,
          itemWidth: 14,
          orient: 'vertical',
          textStyle: { fontSize: 14, color: '#333333' }
        },
        title: {
          text: totalNum,
          top: '40%',
          left: '19%',
          subtext: '总数',
          itemGap: 5,
          textStyle: {
            color: '#45a0e8',
            fontSize: 18
          },
          subtextStyle: {
            color: '#61bbff',
            fontSize: 20
          },
          textAlign: 'center'
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['20%', '50%'],
            itemStyle: {
              borderRadius: 0
            },
            data: pieDatas,
            label: {
              show: false,
              // formatter: function(params) {
              //   return `{normal|${params.name}：}\r\r\n{value|${params.data.value}}`
              // },
              rich: {
                normal: {
                  //   color: "#8A8A8A",
                  fontSize: 14,
                  align: 'left'
                },
                value: {
                  fontSize: 12,
                  //   color: "#8A8A8A",
                  fontWeight: 600,
                  padding: [5, 0, 0, 0]
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.clearfix {
  line-height: 50px;
  padding-left: 15px;
}

.box-card-component {
  .box-card-header {
    position: relative;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    ::v-deep .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 35px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
