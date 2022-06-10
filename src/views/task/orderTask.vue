<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待调度列表" name="1">
        <processTask />
      </el-tab-pane>
      <el-tab-pane label="历史调度列表" name="2">
        <hisTask />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import processTask from './orderReportTask.vue'
import hisTask from './orderHisReportTask.vue'
export default {
  components: { processTask, hisTask },
  data() {
    return {
      activeName: '1'
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>
