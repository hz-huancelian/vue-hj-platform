<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="18">
          <el-form-item label="文件名称:">
            <el-input v-model="searchForm.fileName" style="width:165px" placeholder="文件名称" />
          </el-form-item>
          <el-form-item label="文件类型:">
            <el-input v-model="searchForm.fileType" style="width:165px" placeholder="文件类型" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
            <el-button type="primary" icon="el-icon-download" @click="downLoadAll"> 模板下载</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="search-right">
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      stripe
      :data="fileData"
      highlight-current-row
      :header-cell-style="{background:'#ECF3FC'}"
      style="width: 100%"
    >
      <template slot="empty">
        <div class="table_empty">
          <div class="empty_tips">
            <span>
              暂无数据
            </span>
          </div>
        </div>
      </template>
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column prop="fileType" label="文件类型" align="center" />
      <el-table-column prop="fileName" label="文件名称" align="center" />
      <el-table-column prop="fileNo" label="文件控制编号" align="center" />

      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)"> 编辑</el-button>
          <el-button type="text" @click="handleDownload(scope.row)"> 模板下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        @pagination="handleSearch"
      />
    </div>

    <el-dialog title="控制编号修改" :visible.sync="fileDialogVisible" width="65%" center>
      <div style="width: 500px;margin:0 auto">

        <el-form ref="fileForm" :model="fileForm" :rules="fileRules" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="文件类型:">
                <el-input v-model="fileForm.fileType" placeholder="文件类型" disabled style="width: 80%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文件名称:">
                <el-input v-model="fileForm.fileName" placeholder="文件名称" disabled style="width: 80%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文件控制编号:">
                <el-input v-model="fileForm.fileNo" placeholder="文件控制编号" style="width: 80%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fileDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import * as fileServer from '@/api/fileResource'
const DEV_STATUS = {
  '0': '采样',
  '1': '检测'
}
const USE_STATUS = {
  '0': '闲置中',
  '1': '使用中',
  '2': '维修中'
}
const CHECK_STATUS = {
  '0': '月',
  '1': '季度',
  '2': '半年',
  '3': '年',
  '4': '两年',
  '5': '三年'
}
export default {
  components: { Pagination },
  data() {
    return {
      CHECK_STATUS,
      DEV_STATUS,
      USE_STATUS,
      searchForm: {
        fileType: '',
        fileName: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      fileData: [],
      fileDialogVisible: false,
      fileForm: {
        id: '',
        fileType: '',
        fileName: '',
        fileNo: ''
      },
      fileRules: {
        fileNo: [{ required: true, message: '请录入控制编号', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      fileServer.findByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.fileData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    handleUpdate(row) {
      this.clearForm()
      this.fileForm.id = row.id
      this.fileForm.fileType = row.fileType
      this.fileForm.fileName = row.fileName
      this.fileForm.fileNo = row.fileNo
      this.fileDialogVisible = true
    },
    handleDownload(row) {
      const downUrl = this.$store.getters.sysBaseUrl + '/download/' + row.fileType + '-' + row.fileName + '.doc'
      window.open(downUrl)
    },
    clearForm() {
      this.fileForm = {
        id: '',
        fileType: '',
        fileName: '',
        fileNo: ''
      }
    },
    confirmDialog() {
      this.$refs.fileForm.validate(valid => {
        if (valid) {
          const data = {
            id: this.fileForm.id,
            fileNo: this.fileForm.fileNo
          }
          fileServer.updateById(data).then(result => {
            if (result.code === 200) {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.handleSearch()
              this.fileDialogVisible = false
            } else {
              this.$notify({
                title: '失败',
                message: result.message,
                type: 'error'
              })
            }
          })
        }
      }).catch(() => {})
    },
    downLoadAll() {
      const downUrl = this.$store.getters.sysBaseUrl + '/api/download/downloadControlFile'
      window.open(downUrl)
    }
  }
}
</script>

<style scoped lang="scss" type="text/scss">
  .search_div {
    >div {
      &:nth-child(1){
        margin-right: 10px;
      }
      display: inline-block;
    }
  }

  .search_input {
    width: 200px;
    margin-bottom: 5px;
  }
  .search-right {
    text-align: right;
    padding-right: 25px;
  }
</style>
