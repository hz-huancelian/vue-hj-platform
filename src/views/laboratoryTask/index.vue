<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待分配任务" name="1">
        <laborTaskList />
      </el-tab-pane>
      <el-tab-pane label="已分配任务" name="2">
        <hisLaborTask />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import laborTaskList from './components/laborTaskList'
import hisLaborTask from './components/hisLaborTaskList'
export default {
  components: { laborTaskList, hisLaborTask },
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
