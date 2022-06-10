<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待确认样品" name="1">
        <master-approve-list :samp-task-id="sampTaskId" />
      </el-tab-pane>
      <el-tab-pane label="已确认样品" name="2">
        <master-his-approve-list :samp-task-id="sampTaskId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MasterApproveList from './approve/masterApproveList.vue'
import MasterHisApproveList from './approve/masterHisApproveList.vue'
export default {
  components: { MasterApproveList, MasterHisApproveList },
  data() {
    return {
      activeName: '1',
      sampTaskId: ''
    }
  },
  created() {
    if (this.$route.params.sampTaskId) {
      this.sampTaskId = this.$route.params.sampTaskId
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>
