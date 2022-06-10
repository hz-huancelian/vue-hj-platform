<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待分配任务" name="1">
        <sampleTask />
      </el-tab-pane>
      <el-tab-pane label="历史任务" name="2">
        <hisSampleTask />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import sampleTask from './components/sampleTaskList'
import hisSampleTask from './components/hisSampleTaskList'
export default {
  components: { sampleTask, hisSampleTask },
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
