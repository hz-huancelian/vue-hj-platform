<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20" style="margin-bottom:10px;">
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20">
                <span>
                  签订合同额(元)排名
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>当月/年首日至当前时间，签订合同额排名前五的业务员及其合同额。</p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="contRadio" size="mini" @change="findSortContAmountList">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <samll-box-chart :chart-form="contarctData" box-name="report" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20">
                <span>
                  签订合同数(份)排名
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>当月/年首日至当前时间，签订合同数排名前五的业务员及其合同数。</p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="contNumRadio" size="mini" @change="findSortContNumList">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <samll-box-chart :chart-form="contarctNumData" box-name="contract" />
        </el-card>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-card class="box-card-component" shadow="never" style="height: 420px;">
        <div slot="header" class="clearfix">
          <span>
            我的合同统计
            <el-popover
              placement="top-start"
              title=""
              width="450"
              content="我个人在过去12个月（含本月）里，签订的合同总数和合同总额统计"
              trigger="hover"
            >
              <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
            </el-popover>
          </span>
        </div>
        <line-chart :chart-data="lineChartData" />
      </el-card>
    </el-row>
  </div>
</template>

<script>
import LineChart from '../components/LineChart'
import SamllBoxChart from '../components/SamllBoxChart'
import * as statisServer from '@/api/statistics'
export default {
  components: {
    LineChart,
    SamllBoxChart
  },
  data() {
    return {
      lineChartData: {},
      contarctData: {},
      contarctNumData: {},
      contRadio: '0',
      contNumRadio: '0'
    }
  },
  created() {
    this.findContactList()
    this.findSortContAmountList()
    this.findSortContNumList()
  },
  methods: {
    findContactList() {
      statisServer.findOwnerValidContractsForPass11Month().then(res => {
        if (res.code === 200) {
          this.lineChartData = res.result || []
        }
      })
    },
    findSortContAmountList() {
      this.contarctData = {}
      statisServer.findSortContAmount({ type: this.contRadio, limit: 5 }).then(res => {
        if (res.code === 200) {
          this.contarctData.xNameData = res.result.xNameData.reverse()
          this.contarctData.xValData = res.result.xValData.reverse()
          this.$set(this.contarctData, 'inv', false)
        }
      })
    },
    findSortContNumList() {
      this.contarctNumData = {}
      statisServer.findSortContNum({ type: this.contNumRadio, limit: 5 }).then(res => {
        if (res.code === 200) {
          this.contarctNumData.xNameData = res.result.xNameData.reverse()
          this.contarctNumData.xValData = res.result.xValData.reverse()
          this.$set(this.contarctNumData, 'inv', true)
        }
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

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

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
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 0;
    margin-bottom: 32px;
  }
  .chart-wrapper-bot {
    background: #fff;
    padding: 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
