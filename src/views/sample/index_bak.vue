<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待处理样品" name="1">
        <sample />
      </el-tab-pane>
      <el-tab-pane label="历史样品列表" name="2">
        <hisSample />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import sample from './components/sampleList'
import hisSample from './components/hisSampleList'
export default {
  components: { sample, hisSample },
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
