<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待检测列表" name="1">
        <outLaborList />
      </el-tab-pane>
      <el-tab-pane label="历史检测列表" name="2">
        <hisOutLaborList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import outLaborList from './components/outLaborList'
import hisOutLaborList from './components/hisOutLaborList'
export default {
  components: { outLaborList, hisOutLaborList },
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
