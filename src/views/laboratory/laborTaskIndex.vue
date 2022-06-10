<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="分析原始记录表" name="1">
        <laborList />
      </el-tab-pane> -->
      <el-tab-pane label="待录入因子列表" name="2">
        <laborList :check-task-id="checkTaskId" />
      </el-tab-pane>
      <el-tab-pane label="已录入因子列表" name="3">
        <hisLaborList :check-task-id="checkTaskId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import laborList from './components/laborList'
import hisLaborList from './components/hisLaborList'
export default {
  components: { laborList, hisLaborList },
  data() {
    return {
      activeName: '2',
      checkTaskId: ''
    }
  },
  created() {
    if (this.$route.params.checkTaskId) {
      this.checkTaskId = this.$route.params.checkTaskId
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>
