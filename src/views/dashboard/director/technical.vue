<template>
  <div class="dashboard-editor-container">
    <el-card header="待办事项" style="margin-bottom:32px;">
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="dpspd" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待评审判定数
              </div>
              <count-to :start-val="0" :end-val="manageForm.contacts" :duration="2600" class="card-panel-num" />
            </div>
            <div class="card-panel-button">
              <el-button type="primary" @click="goApprovelFlag">处理</el-button>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="dhtps" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待合同评审数
              </div>
              <count-to :start-val="0" :end-val="manageForm.contactTotal" :duration="3000" class="card-panel-num" />

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
                  任务数
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>总任务：当月/年首日至当前时间调度负责人所分配的任务数总计；</p>
                    <p>正在进行：当前处于已调度至报告签发前状态的任务数总计；</p>
                    <p>已完成：当月/年首日至当前时间完成报告签发的任务数总计。</p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="taskInfoRadio" size="mini" @change="findTaskList">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <task-card :form="cardForm" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20">
                <span>
                  报告数
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>报告总数：当月/年首日至当前时间所生成的报告总数（多次生成报告只计1次）；</p>
                    <p>报告签发数：当月/年首日至当前时间所签发的报告总数（包含历史未签发但在统计时间内签发的报告）。</p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="reportRadio" size="mini" @change="findReportList">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <samll-box-chart :chart-form="reportData" box-name="report" />
        </el-card>

      </el-col>
    </el-row>

  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import TaskCard from '../components/TaskCard.vue'
import SamllBoxChart from '../components/SamllBoxChart.vue'

import * as statisServer from '@/api/statistics'

export default {
  components: {
    CountTo,
    TaskCard,
    SamllBoxChart
  },
  data() {
    return {
      boxChartData: {
        xNameData: ['报告总数', '报告签发'],
        xValData: [100, 50]
      },
      manageForm: {
        contacts: 0,
        contactTotal: 0
      },
      taskInfoRadio: '0',
      reportRadio: '0',
      reportData: {},
      cardForm: {
        total_num: 0, // 采样任务百分比 （完成/总数量）
        total_name: '总任务',
        completed_num: 0,
        completed_name: '正在进行任务',
        incompleted_num: 0,
        incompleted_name: '已完成任务'
      }
    }
  },
  created() {
    this.findTaskInfo()
    // this.findTaskList()
    // this.findReportList()
  },
  methods: {
    findTaskInfo() {
      statisServer.findTdToDoList().then(res => {
        if (res.code === 200) {
          res.result.forEach(i => {
            if (i.name === '待评审判定数') {
              this.manageForm.contacts = i.value
            }
            if (i.name === '待合同评审数') {
              this.manageForm.contactTotal = i.value
            }
          })
        }
      })
    },
    findTaskList() {
      statisServer.findOfferDispatchInfoCnt({ type: this.taskInfoRadio }).then(res => {
        if (res.code === 200) {
          res.result.forEach(i => {
            if (i.name === '总任务') {
              this.cardForm.total_num = i.value
            }
            if (i.name === '正在进行') {
              this.cardForm.completed_num = i.value
            }
            if (i.name === '已完成') {
              this.cardForm.incompleted_num = i.value
            }
          })
        }
      })
    },

    findReportList() {
      statisServer.findIssueReport({ type: this.reportRadio }).then(res => {
        if (res.code === 200) {
          this.reportData = res.result || {}
        }
      })
    },

    goApprovelFlag() {
      this.$router.push(`/contract/techApprove`)
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
    max-width: 70%;
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
      margin: 26px;
      margin-left: 30px;

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
      margin: 40px;
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
