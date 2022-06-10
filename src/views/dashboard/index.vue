<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import manageDashboard from './manager'
import technicalDashboard from './director/technical'
import saleManageDashboard from './director/saleManage'
import saleDashboard from './director/sale'
import sampleManageDashboard from './director/sampleManage'
import sampleDashboard from './director/sample'
import dispatchDashboard from './director/dispatch'
import equipmentDashboard from './director/equipment'
import stockDashboard from './director/stock'
import LaboratoryManageDashboard from './director/laboratoryManage'
import LaboratoryDashboard from './director/laboratory'
import blankDashboard from './black'

export default {
  components: { manageDashboard, blankDashboard,
    technicalDashboard, dispatchDashboard,
    saleManageDashboard, sampleManageDashboard,
    saleDashboard, sampleDashboard, equipmentDashboard,
    stockDashboard, LaboratoryManageDashboard,
    LaboratoryDashboard },
  data() {
    return {
      currentRole: 'manageDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // this.currentRole = 'blankDashboard'
    if (this.roles.indexOf('admin') > -1 || this.roles.indexOf('zjl') > -1) { // 总经理
      // this.currentRole = 'manageDashboard'
      this.currentRole = 'manageDashboard'
    } else if (this.roles.indexOf('Tm') > -1) { // 技术负责人
      this.currentRole = 'technicalDashboard'
    } else if (this.roles.indexOf('RS') > -1) { // 调度
      this.currentRole = 'dispatchDashboard'
    } else if (this.roles.indexOf('SMa') > -1 || this.roles.indexOf('yw') > -1) { // 业务负责人
      this.currentRole = 'saleManageDashboard'
    } else if (this.roles.indexOf('SA') > -1) { // 业务员
      this.currentRole = 'saleDashboard'
    } else if (this.roles.indexOf('Pm') > -1) { // 采样负责人
      this.currentRole = 'sampleManageDashboard'
    } else if (this.roles.indexOf('Po') > -1 || this.roles.indexOf('KS') > -1) { // 采样组长+采样员
      this.currentRole = 'sampleDashboard'
    } else if (this.roles.indexOf('LMa') > -1) { // 实验室负责人
      this.currentRole = 'LaboratoryManageDashboard'
    } else if (this.roles.indexOf('TeA') > -1) { // 分析员
      this.currentRole = 'LaboratoryDashboard'
    } else if (this.roles.indexOf('sbcj') > -1) { // 设备管理
      this.currentRole = 'equipmentDashboard'
    } else if (this.roles.indexOf('SMP') > -1) { // 设备管理
      this.currentRole = 'stockDashboard'
    } else {
      this.currentRole = 'blankDashboard'
    }
  }
}
</script>

<style scoped>
.dashboard-container-local {
  height: 100vh;
  background: url("../../assets/image/index.png");
  opacity:0.8;
  background-size: cover;
  position: relative;
  background-repeat:no-repeat;
  background-size:100% 100%;
  -moz-background-size:100% 100%;
  padding: 10px;
}
</style>
