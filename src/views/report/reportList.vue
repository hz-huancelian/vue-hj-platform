<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待审核报告" name="1">
        <reportTask />
      </el-tab-pane>
      <el-tab-pane label="已审核报告" name="2">
        <hisReportTask />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import reportTask from './components/reportTaskList'
import hisReportTask from './components/hisReportTaskList'
export default {
  components: { reportTask, hisReportTask },
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
