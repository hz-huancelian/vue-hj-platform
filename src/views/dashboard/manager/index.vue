<template>
  <div class="dashboard-editor-container">
    <panel-group />

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
                <el-radio-group v-model="taskRadio" size="mini" @change="findTasks">
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
                  任务区域统计
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>当月/年首日至当前时间的任务所在区域统计，以任务调度分配的地址（统计到市）为统计维度</p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>

                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="taskRegionRadio" size="mini" @change="findRegionTask">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row></div>
          <task-region :pie-datas="regionData" />
        </el-card>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-card class="box-card-component" shadow="never" style="height: 420px;">
        <div slot="header" class="clearfix">
          <span>
            全部合同统计
            <el-popover
              placement="top-start"
              title=""
              width="450"
              content="公司在过去12个月（含本月）里，签订的合同总数和合同总额统计"
              trigger="hover"
            >
              <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
            </el-popover>
          </span>
        </div>
        <line-chart :chart-data="lineChartData" />
      </el-card>

    </el-row>

    <el-row :gutter="20" style="margin-bottom:32px;">
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
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20">
                <span>
                  人员流动情况
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>入职员工数：当月/年首日至当前时间平台新增员工人数统计；</p>
                    <p>离职员工数：当月/年首日至当前时间平台注销员工人数统计。</p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="staffRadio" size="mini" @change="findStaffTurnover">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>

          </div>
          <samll-box-chart :chart-form="staffData" box-name="people" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from '../components/PanelGroup'
import LineChart from '../components/LineChart'
import TaskCard from '../components/TaskCard'
import TaskRegion from '../components/TaskRegion'
import SamllBoxChart from '../components/SamllBoxChart.vue'

import * as statisServer from '@/api/statistics'

// 采集样品数据 - 根据一级归类
const lineChartData = {
  title: '全部合同统计',
  xNameData: ['水', '气', '土壤、底泥', '噪音', '固废', '污泥和生活垃圾'],
  contactNum: [100, 120, 161, 134, 105, 160, 165],
  contactMoney: [1, 200, 130, 154, 95, 30, 115]
}
// 任务完成数 - 公司整体- 只有一个

// 任务完成数 - 公司整体- 只有一个
const perChartData = {
  yNameData: ['业务部', '调度部', '采样部', '分析部', '样品部', '报告部'],
  factorData: [15, 2, 12, 4, 22, 13]
}

const pieChartData = [
  {
    'value': 80,
    'name': '待签发'
  },
  {
    'value': 20,
    'name': '已签发'
  }
]

const demo = {
  xNameData: ['报告总数', '报告签发'],
  xValData: [100, 50]
}
const demo_1 = {
  xNameData: ['入职人员数', '离职员工数'],
  xValData: [34, 150]
}

export default {
  components: {
    PanelGroup,
    LineChart,
    TaskCard,
    TaskRegion,
    SamllBoxChart
  },
  data() {
    return {
      lineChartData: {},
      pieChartData: {},
      perChartData: [],
      taskForm: {
        total_num: 0, // 采样任务百分比 （完成/总数量）
        total_name: '总任务',
        completed_num: 0,
        completed_name: '正在进行',
        incompleted_num: 0,
        incompleted_name: '已完成'
      },
      boxChartData: demo,
      boxChartData_1: demo_1,
      taskRadio: '0',
      taskRegionRadio: '0',
      regionData: [],
      reportRadio: '0',
      reportData: {},
      staffRadio: '1',
      staffData: {}
    }
  },
  created() {
    // this.findTasks()
    // this.findRegionTask()
    this.findContactList()
    // this.findReportList()
    this.findStaffTurnover()
  },
  methods: {
    // 头部合同信息
    findTasks() {
      statisServer.findCompleteTask({ type: this.taskRadio }).then(res => {
        if (res.code === 200) {
          const taskForm = res.result.find(i => i.name === '报告编制任务')
          this.taskForm.total_num = taskForm.totalCnt
          this.taskForm.completed_num = Number(taskForm.totalCnt - taskForm.completeCnt).toFixed(0)
          this.taskForm.incompleted_num = taskForm.completeCnt
        }
      })
    },
    findRegionTask() {
      // 获取区域分布信息
      statisServer.findTaskCity({ type: this.taskRegionRadio }).then(res => {
        if (res.code === 200) {
          this.regionData = res.result.map(i => {
            return {
              name: i.city,
              value: i.taskNum
            }
          }) || []
        }
      })
    },
    findContactList() {
      statisServer.findValidContractsForPass11Month().then(res => {
        if (res.code === 200) {
          this.lineChartData = res.result || []
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
    findStaffTurnover() {
      statisServer.findStaffTurnover({ type: this.staffRadio }).then(res => {
        if (res.code === 200) {
          this.staffData = res.result || {}
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
