<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待审核报告" name="1">
        <approvelTask />
      </el-tab-pane>
      <el-tab-pane label="已审核报告" name="2">
        <hisApprovelTask />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import approvelTask from './components/approvel'
import hisApprovelTask from './components/hisApprovel'
export default {
  components: { approvelTask, hisApprovelTask },
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
