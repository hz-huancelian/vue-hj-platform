<template>
  <div class="dashboard-editor-container">

    <el-card header="待办事项" style="margin-bottom:32px;">
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="drkyp" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待入库样品数
              </div>
              <count-to :start-val="0" :end-val="taskInfoForm.inStockNum" :duration="2600" class="card-panel-num" />
            </div>
            <div class="card-panel-button">
              <el-button type="primary" @click="goInStock">处理</el-button>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="dckyp" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                待出库样品数
              </div>
              <count-to :start-val="0" :end-val="taskInfoForm.outStockNum" :duration="3000" class="card-panel-num" />

            </div>
            <div class="card-panel-button">
              <el-button type="primary" @click="goOutStock">处理</el-button>
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
                  样品总数统计
                  <el-popover
                    placement="top-start"
                    title=""
                    width="450"
                    trigger="hover"
                  >
                    <p>库存样品数：当前已入库但未出库的样品数，库存样品数=本期入库样品数-本期出库样品数+上期库存样品数；</p>
                    <p>入库样品数：当月/年首日至当前时间入库的样品数；</p>
                    <p>出库样品数：当月/年首日至当前时间出库的样品数。  </p>
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                </span>
              </el-col>
              <el-col :span="4">
                <el-radio-group v-model="sampleRadio" size="mini" @change="findSampleInfo">
                  <el-radio-button label="0">月</el-radio-button>
                  <el-radio-button label="1">年</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <task-card :form="stockForm" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 330px;">
          <div slot="header" class="clearfix">
            <span>
              在库各类样品数统计
              <el-popover
                placement="top-start"
                title=""
                width="450"
                trigger="hover"
              >
                <p>当前已入库但未出库的各类样品数</p>
                <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
              </el-popover>
            </span>
          </div>
          <BarChart :chart-data="barData" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TaskCard from '../components/TaskCard'
import BarChart from './components/BarChart'
import * as statisServer from '@/api/statistics'

import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo,
    TaskCard,
    BarChart
  },
  data() {
    return {
      sampleRadio: '0',
      taskInfoForm: {
        inStockNum: 0,
        outStockNum: 0
      },
      stockForm: {
        total_num: 0, // 采样任务百分比 （完成/总数量）
        total_name: '库存样品数',
        completed_num: 0,
        completed_name: '入库样品数',
        incompleted_num: 0,
        incompleted_name: '出库样品数'
      },
      barRadio: '0',
      barData: {
        title: '',
        xNameData: [],
        xValData: []
      }
    }
  },
  created() {
    // this.fingStockskInfo()
    // this.findSampleInfo()
    // this.findSampleClass()
  },
  methods: {
    fingStockskInfo() {
      statisServer.findSampleManagerToDoList().then(res => {
        if (res.code === 200) {
          res.result.forEach(i => {
            if (i.name === '待入库样品数') {
              this.taskInfoForm.inStockNum = i.value
            }
            if (i.name === '待出库样品数') {
              this.taskInfoForm.outStockNum = i.value
            }
          })
        }
      })
    },
    findSampleInfo() {
      statisServer.findSampleManagementCnt({ type: this.sampleRadio }).then(res => {
        if (res.code === 200) {
          res.result.forEach(i => {
            if (i.name === '库存样品数') {
              this.stockForm.total_num = i.value
            }
            if (i.name === '入库样品数') {
              this.stockForm.completed_num = i.value
            }
            if (i.name === '出库样品数') {
              this.stockForm.incompleted_num = i.value
            }
          })
        }
      })
    },
    findSampleClass() {
      statisServer.findStoredSampleClassificationCnt({ limit: 6 }).then(res => {
        if (res.code === 200) {
          this.barData = res.result || {}
        }
      })
    },
    goInStock() {
      this.$router.push(`/stock/inStock`)
    },

    goOutStock() {
      this.$router.push(`/stock/outStockList`)
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
