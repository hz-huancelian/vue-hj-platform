<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="上传" placement="top">
        <el-button size="mini" circle icon="el-icon-upload2" @click="upload()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="模板下载" placement="top">
        <el-button size="mini" circle icon="el-icon-download" @click="downloadTem()" />
      </el-tooltip>
      <!-- <el-tooltip v-if="columns" class="item" effect="dark" content="显隐列" placement="top">
        <el-button size="mini" circle icon="el-icon-menu" @click="showColumn()" />
      </el-tooltip> -->
    </el-row>
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-transfer
        v-model="value"
        :titles="['显示', '隐藏']"
        :data="columns"
        @change="dataChange"
      />
    </el-dialog>

    <el-dialog title="文件上传" :visible.sync="uploadVisible" append-to-body center>
      <div class="block">
        <el-timeline>
          <el-timeline-item size="large">
            <span slot="dot" class="time-dot">
              1
            </span>
            <el-row>
              <el-col :span="24">
                下载模板，批量填写客户信息
              </el-col>
            </el-row>
            <el-row style="padding-top:10px;">
              <el-col :span="24">
                <el-button size="mini" type="primary" @click="downloadTem()">模板下载</el-button>
              </el-col>
            </el-row>
          </el-timeline-item>
          <el-timeline-item size="large">
            <span slot="dot" class="time-dot">
              2
            </span>
            <el-row>
              <el-col :span="24">
                下载模板，批量填写客户信息
              </el-col>
            </el-row>
            <el-row style="padding-top:10px;">
              <el-col :span="24">
                <el-upload
                  class="upload-demo"
                  action="/api/dataImport/uploadEmployee"
                  :on-change="uploadChange"
                  :file-list="excelFileList"
                  accept=".xlsx,.xls"
                  :limit="1"
                  style="width: 300px;"
                >
                  <el-button size="mini" type="primary">点击上传</el-button>
                  <!-- <div class="el-upload__text"><em>点击上传</em></div> -->
                  <div slot="tip" class="el-upload__tip" style="color:red;">您只能上传.xlsx,.xls格式的文件</div>
                </el-upload>
              </el-col>
            </el-row>
          </el-timeline-item>
        </el-timeline>
        <el-row>
          <el-col :span="24" style="">
            <span style="color:red; font-size: 13px">备注：批量导入员工功能，只会将上传的员工信息列表内的员工新增到系统内，不对原有员工信息做任何替换或修改</span>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- <el-dialog title="文件上传" :visible.sync="uploadVisible" append-to-body center>
      <el-form>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="/api/dataImport/uploadEmployee"
            :on-change="customUploadChange"
            :file-list="excelFileList"
            accept=".xlsx,.xls"
            :limit="1"
            style="width: 300px;"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" style="color:red;">您只能上传.xlsx,.xls格式的文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible=false">关闭</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  name: 'RightToolbar',
  props: {
    showSearch: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: '显示/隐藏',
      // 是否显示弹出层
      open: false,
      excelFileList: [],
      uploadVisible: false
    }
  },
  created() {
    // 显隐列初始默认隐藏列
    for (const item in this.columns) {
      if (this.columns[item].visible === false) {
        this.value.push(parseInt(item))
      }
    }
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit('update:showSearch', !this.showSearch)
    },
    // 刷新
    refresh() {
      this.$emit('queryTable')
    },
    // 右侧列表元素变化
    dataChange(data) {
      for (var item in this.columns) {
        const key = this.columns[item].key
        this.columns[item].visible = !data.includes(key)
      }
    },
    // 打开显隐列dialog
    showColumn() {
      this.open = true
    },

    downloadTem() {
      const url = this.$store.getters.sysBaseUrl + '/api/dataImport/downloadEmployeeExcel'
      window.open(url)
    },
    uploadChange(file) {
      if (file.status === 'ready') return
      if (file.status === 'success') {
        const res = file.response || {}
        if (res && res.code === 200) {
          this.fileResult = file.response.result
          this.$message({
            type: 'success',
            message: file.response.message
          })
          this.handleSearch()
          this.uploadVisible = false
        } else {
          this.$message.error('上传失败!')
          this.excelFileList = []
        }
      } else {
        this.$message.error('上传失败!')
        this.excelFileList = []
      }
    },
    upload() {
      this.uploadVisible = true
      this.excelFileList = []
    }
  }
}
</script>
<style lang="scss" scoped>
.time-dot {
  text-align: center;
  justify-content: center;
  padding-top: 4px;
  position: relative;
  border-radius: 50%;
  background: #dfe4ed;
  height: 25px;
  width: 25px;
  left: -7px;
}
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>
