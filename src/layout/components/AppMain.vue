<template>
  <section class="app-main">
    <el-card shadow="never" :body-style="{padding: '0px'}">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </el-card>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    /*  50 = navbar的 50高度 */
    min-height: calc(100vh - 50px);
    width: 100%;
    margin: 8px 0;
    padding: 0px 10px;
    position: relative;
    overflow: hidden;
    background: rgb(240, 242, 245);
  }

  .fixed-header+.app-main{
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      // min-height: calc(100vh - 84px);
      min-height: calc(100vh);
    }

    .fixed-header+.app-main {
      padding-top: 92px;
    }
  }
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 1px;
  }
}
</style>

