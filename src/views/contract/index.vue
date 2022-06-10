<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待处理合同" name="1">
        <contractList />
      </el-tab-pane>
      <el-tab-pane label="历史合同" name="2">
        <hisContractList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import contractList from './components/contractList'
import hisContractList from './components/hisContractList'
export default {
  components: { contractList, hisContractList },
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
