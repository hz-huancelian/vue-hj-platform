<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="bjds" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ manageForm.leftName }}
          </div>
          <count-to :start-val="0" :end-val="manageForm.leftNum" :duration="2600" class="card-panel-num" />
        </div>
        <div class="card-panel-button">
          <el-button type="primary" @click="goToApprovel">处理</el-button>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="spht" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ manageForm.middName }}
          </div>
          <count-to :start-val="0" :end-val="manageForm.middNum " :duration="3000" class="card-panel-num" />
        </div>
        <div class="card-panel-button">
          <el-button type="primary" @click="goToContact">处理</el-button>
        </div>
      </div>
    </el-col>
    <!-- <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ manageForm.rightName }}
          </div>
          <count-to :start-val="0" :end-val="manageForm.rightNum" :duration="3200" class="card-panel-num" />
        </div>
        <div class="card-panel-button">
          <el-button type="primary" @click="goApprovelFlag">处理</el-button>
        </div>
      </div>
    </el-col> -->
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  props: {
    manageForm: {
      type: Object,
      default() {
        return {
          leftName: '',
          leftNum: 0,
          middName: '',
          middNum: 0,
          rightName: '',
          rightNum: 0
        }
      }
    }
  },
  data() {
    return {

    }
  },
  created() {
  },
  methods: {
    goToApprovel() {
      this.$router.push(`/sale/approveList`)
    },

    goToContact() {
      this.$router.push(`/contract/approve`)
    },

    goApprovelFlag() {
      this.$router.push(`/contract/techApprove`)
    }
  }
}
</script>

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
      margin: 40px 10px 0;
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
