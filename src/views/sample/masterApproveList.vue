<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待审核样品" name="1">
        <approve-list :samp-task-id="sampTaskId" />
      </el-tab-pane>
      <el-tab-pane label="已审核样品" name="2">
        <approve-his-list :samp-task-id="sampTaskId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ApproveList from './approve/approveList.vue'
import ApproveHisList from './approve/approveHisList.vue'
export default {
  components: { ApproveList, ApproveHisList },
  data() {
    return {
      activeName: '1',
      sampTaskId: ''
    }
  },
  created() {
    if (this.$route.params.sampTaskId) {
      debugger
      this.sampTaskId = this.$route.params.sampTaskId
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>
