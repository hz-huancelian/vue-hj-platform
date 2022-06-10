<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待处理报价单" name="1">
        <processOrder />
      </el-tab-pane>
      <el-tab-pane label="历史报价单" name="2">
        <hisOrder />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import processOrder from './components/orderList'
import hisOrder from './components/hisOrderList'
export default {
  components: { processOrder, hisOrder },
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
