<template>

  <div style="position:relative;">
    <div style="padding-top:15px;" class="progress-item">
      <span>采样任务(已完成: 52)</span>
      <el-progress style="padding-top:8px" :percentage="sampleNum" />

    </div>
    <div class="progress-item">
      <span>检测任务(已完成: 38)</span>
      <el-progress style="padding-top:8px" :percentage="testNum" color="#e6a23c" />
    </div>
    <div class="progress-item">
      <span>报告编织任务(已完成: 38)</span>
      <el-progress style="padding-top:8px" :percentage="reportNum" color="#6f7ad3" />
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    taskForm: {
      type: Object,
      default() {
        return {
          sampleNum: 0, // 采样任务百分比 （完成/总数量）
          testNum: 0, // 检测任务百分比 （完成/总数量）
          reportNum: 0 // 报告任务百分比 （完成状态/报告记录数据已生成的记录信息）
        }
      }
    },
    sampleNum: {
      type: Number,
      default: 10
    },
    testNum: {
      type: Number,
      default: 20
    },
    reportNum: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
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
