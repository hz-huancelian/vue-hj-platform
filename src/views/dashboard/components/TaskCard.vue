<template>
  <div style="position:relative;">
    <el-row>
      <el-col :span="8">
        <div class="task-div">
          <div>{{ form.total_num }}</div>
        </div>
        <div class="task-div-span">
          {{ form.total_name }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="task-div">
          <div>{{ form.completed_num }}</div>
        </div>
        <div class="task-div-span">
          {{ form.completed_name }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="task-div">
          <div>{{ form.incompleted_num }}</div>
        </div>
        <div class="task-div-span">
          {{ form.incompleted_name }}
        </div>
      </el-col>
    </el-row>
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
    form: {
      type: Object,
      default() {
        return {
          total_num: 10, // 采样任务百分比 （完成/总数量）
          total_name: '总任务',
          completed_num: 20,
          completed_name: '正在进行',
          incompleted_num: 30,
          incompleted_name: '已完成'
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
  .task-div {
    position: relative;
    width: 100%;
    height: 170px;
    text-align: center;        /*文字水平居中对齐*/
    line-height: 170px;        /*设置文字行距等于div的高度 即实现垂直居中*/
    overflow:hidden;
    background: url('../../../assets/image/work_rec.png') center no-repeat;
    background-size: contain;

  }
  .task-div-span {
      position: relative;
      text-align: center;        /*文字水平居中对齐*/
      margin-top: 15px;
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
</style>
