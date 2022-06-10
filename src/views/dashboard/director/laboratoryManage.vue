<template>
  <div class="dashboard-editor-container">

    <el-card header="待办事项" style="margin-bottom:32px;">
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="dfpjcrw" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待分配检测任务数
              </div>
              <count-to :start-val="0" :end-val="manageForm.taskNum" :duration="2600" class="card-panel-num" />
            </div>
            <div class="card-panel-button">
              <el-button type="primary" @click="goTask">处理</el-button>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="dshyzs" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待审核因子数
              </div>
              <count-to :start-val="0" :end-val="manageForm.approvelFactorNum" :duration="3000" class="card-panel-num" />

            </div>
            <div class="card-panel-button">
              <el-button type="primary" @click="goApprovelFactor">处理</el-button>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="dhtps" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待评审任务数
              </div>
              <count-to :start-val="0" :end-val="manageForm.approvelTaskNum" :duration="3000" class="card-panel-num" />

            </div>
            <div class="card-panel-button">
              <el-button type="primary" @click="goApprovelTask">处理</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20" style="margin-bottom:32px;">
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20">
                <span>
                  全部检测任务数
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>待分配：当月/年首日至当前时间实验室负责人待分配的任务数总计；</p>
                    <p>正在进行：当前处于检测任务分配完成至检测结果审核通过状态的任务数总计；</p>
                    <p>已完成：当月/年首日至当前时间完成检测的任务数总计（该任务检测结果全部审核通过为完成检测）</p>
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
          <task-card :form="taskForm" />
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
import TaskCard from '../components/TaskCard'
import BarChart from './components/BarChart'
import SamllBoxChart from '../components/SamllBoxChart'
import * as statisServer from '@/api/statistics'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo,
    TaskCard,
    BarChart,
    SamllBoxChart

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
      manageForm: {
        taskNum: 0,
        approvelFactorNum: 0,
        approvelTaskNum: 0
      },
      taskRadio: '0',
      taskForm: {
        total_num: 0, // 采样任务百分比 （完成/总数量）
        total_name: '待分配',
        completed_num: 0,
        completed_name: '正在进行',
        incompleted_num: 0,
        incompleted_name: '已完成'
      },
      barRadio: '0',
      barData: {
        title: '',
        xNameData: [],
        xValData: []
      },
      reportSampleData: {},
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
    // this.findTaskInfo()
    // this.findSampleInfo()
    // this.findSampleClass()
    // this.findSortSampledNum()
  },
  methods: {
    findTaskInfo() {
      statisServer.findCheckManagerToDoList().then(res => {
        if (res.code === 200) {
          res.result.forEach(i => {
            if (i.name === '待分配检测任务数') {
              this.manageForm.taskNum = i.value
            }
            if (i.name === '待审核因子数') {
              this.manageForm.approvelFactorNum = i.value
            }
            if (i.name === '待评审任务数') {
              this.manageForm.approvelTaskNum = i.value
            }
          })
        }
      })
    },
    findSampleInfo() {
      statisServer.findCheckTaskCnt({ type: this.taskRadio }).then(res => {
        if (res.code === 200) {
          res.result.forEach(i => {
            if (i.name === '待分配') {
              this.taskForm.total_num = i.value
            }
            if (i.name === '正在进行') {
              this.taskForm.completed_num = i.value
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
      this.reportSampleData = {}
      statisServer.findSortCheckedSample({ type: this.sampleCalssRadio, limit: 5 }).then(res => {
        if (res.code === 200) {
          this.reportSampleData.xNameData = res.result.xNameData.reverse()
          this.reportSampleData.xValData = res.result.xValData.reverse()
          this.$set(this.reportSampleData, 'inv', false)
        }
      })
    },

    goTask() {
      this.$router.push(`/check/laboratoryTask`)
    },
    goApprovelFactor() {
      this.$router.push(`/check/labApprover`)
    },
    goApprovelTask() {
      this.$router.push(`/contract/techContApprove`)
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

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
    text-align: -webkit-center;
  }

  .card-panel {
    max-width: 100%;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 5px;;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px 10px;
      margin-left: 10px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
      .el-button {
        float: right;
      }
    }
    .card-panel-button {
      float: left;
      font-weight: bold;
      margin: 40px 0px 0;
      margin-left: 0px;
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
