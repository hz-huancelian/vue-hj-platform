<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20" style="margin-bottom:10px;">
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 400px;">
          <div slot="header" class="clearfix">
            <span>
              设备数量
              <el-popover
                placement="top-start"
                title=""
                width="450"
                content="各类别设备的数量统计（包含状态为正常、检修和停用的设备）"
                trigger="hover"
              >
                <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
              </el-popover>
            </span>
          </div>
          <task-region :pie-datas="regionData" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card-component" shadow="never" style="height: 400px;">
          <div slot="header" class="clearfix">
            <span>
              设备状态
              <el-popover
                placement="top-start"
                title=""
                width="450"
                content="各类别设备的状态统计。"
                trigger="hover"
              >
                <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
              </el-popover>
            </span>
          </div>
          <LeftBarChart :chart-form="barChartData" box-name="leftBar" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LeftBarChart from './components/LeftBarChart.vue'
import TaskRegion from '../components/TaskRegion.vue'
import * as statisServer from '@/api/statistics'
export default {
  components: {
    LeftBarChart,
    TaskRegion
  },
  data() {
    return {
      lineChartData: {},
      contarctData: {},
      contarctNumData: {},
      contRadio: '0',
      contNumRadio: '0',
      saleForm: {
        leftName: '待审批报价单数',
        leftNum: 0,
        middName: '待审批合同数',
        middNum: 0,
        rightName: '待评审合同数',
        rightNum: 0
      },
      regionData: [],
      barChartData: {}
    }
  },
  created() {
    this.findContactList()
    this.findEquipmentCnt()
  },
  methods: {

    findContactList() {
      statisServer.findEquipmentStatus().then(res => {
        if (res.code === 200) {
          this.barChartData = res.result || {}
        }
      })
    },

    findEquipmentCnt() {
      // 获取区域分布信息
      statisServer.findEquipmentCnt().then(res => {
        if (res.code === 200) {
          this.regionData = res.result || []
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
