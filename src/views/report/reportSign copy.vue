<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待审核报告" name="1">
        <signTask />
      </el-tab-pane>
      <el-tab-pane label="已审核报告" name="2">
        <hisSignTask />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import signTask from './components/signTask.vue'
import hisSignTask from './components/hisSignTask.vue'
export default {
  components: { signTask, hisSignTask },
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
