<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20" style="margin-bottom:32px;">
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20">
                <span>
                  我的检测任务数
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>正在进行：我个人正在进行的检测任务数总计（该任务状态为检测任务分配完成至检测结果审核通过）</p>
                    <p>已完成：当月/年首日至当前时间我个人完成的检测任务数（该任务检测结果全部审核通过为完成检测）</p>

                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="taskRadio" size="mini" @change="findSampleInfo">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <task-card-two :form="taskForm" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20">
                <span>
                  各类已检测样品数
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>当月/年首日至当前时间，所有分析员检测的各类样品的累计数量。</p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>

                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="barRadio" size="mini" @change="findSampleClass">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row></div>
          <BarChart :chart-data="barData" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:32px;">
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20">
                <span>
                  检测样品数排名
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>当月/年首日至当前时间，检测样品数排名前五的分析员及其检测样品数</p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="sampleCalssRadio" size="mini" @change="findSortSampledNum">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <samll-box-chart :chart-form="reportSampleData" box-name="report" />
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script>
import BarChart from './components/BarChart'
import SamllBoxChart from '../components/SamllBoxChart'
import * as statisServer from '@/api/statistics'
import TaskCardTwo from '../components/TaskCardTwo.vue'

export default {
  components: {
    BarChart,
    SamllBoxChart,
    TaskCardTwo

  },
  data() {
    return {
      lineChartData: {},
      contarctData: {},
      contarctNumData: {},
      contRadio: '0',
      contNumRadio: '0',
      sampleForm: {
        leftName: '待分配采样任务数',
        leftNum: 0,
        middName: '待审核样品数',
        middNum: 0,
        rightName: '待评审任务数',
        rightNum: 0
      },
      taskRadio: '0',
      taskForm: {
        total_num: 0, // 采样任务百分比 （完成/总数量）
        total_name: '正在进行',
        incompleted_num: 0,
        incompleted_name: '已完成'
      },
      barRadio: '0',
      barData: {
        title: '',
        xNameData: [],
        xValData: []
      },
      reportSampleData: {
        xNameData: [],
        xValData: [],
        inv: false
      },
      sampleCalssRadio: '0',
      sampleNumData: {},
      sampleNumRadio: '0',
      sampleChartData: {
        xTitle: '采集样品数(个)',
        xNameData: [],
        xValData: []
      }
    }
  },
  created() {
    // this.findSampleInfo()
    // this.findSampleClass()
    // this.findSortSampledNum()
  },
  methods: {
    findSampleInfo() {
      statisServer.findOwnerCheckFactorCnt({ type: this.taskRadio }).then(res => {
        if (res.code === 200) {
          res.result.forEach(i => {
            if (i.name === '正在进行') {
              this.taskForm.total_num = i.value
            }
            if (i.name === '已完成') {
              this.taskForm.incompleted_num = i.value
            }
          })
        }
      })
    },
    findSampleClass() {
      statisServer.findCheckedSampleClassificationCnt({ type: this.barRadio, limit: 6 }).then(res => {
        if (res.code === 200) {
          this.barData = res.result || {}
        }
      })
    },
    findSortSampledNum() {
      this.reportSampleData = {
        xNameData: [],
        xValData: [],
        inv: false
      }
      statisServer.findSortCheckedSample({ type: this.sampleCalssRadio, limit: 5 }).then(res => {
        if (res.code === 200) {
          this.reportSampleData.xNameData = res.result.xNameData.reverse()
          this.reportSampleData.xValData = res.result.xValData.reverse()
          this.$set(this.reportSampleData, 'inv', false)
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
