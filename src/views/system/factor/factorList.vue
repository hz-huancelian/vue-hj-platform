<template>
  <div class="app-container">
    <div>
      <el-form :model="searchForm" :inline="true">
        <el-row>
          <el-col :span="18">
            <el-form-item label="检测对象:">
              <el-select v-model="searchForm.classId" clearable style="width:175px" filterable placeholder="检测对象">
                <el-option
                  v-for="item in classArray"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="检测因子:">
              <el-input v-model="searchForm.factorName" style="width:175px" placeholder="检测因子" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="search-right">
            <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
            <el-button type="text" icon="el-icon-upload" @click="handleUpload">上传</el-button>
            <el-button type="text" icon="el-icon-download" @click="handleDownload">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        stripe
        :data="factorData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        border
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无因子
              </span>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="className" label="检测对象" align="center" />
        <el-table-column prop="factorName" label="检测因子" align="center" />
        <el-table-column prop="standardNo" label="标准号" align="center" />
        <el-table-column prop="standardName" label="检测标准" min-width="220px" align="center" />
        <el-table-column prop="analysisMethod" label="分析方法" min-width="80px" align="center" />
        <el-table-column label="标准状态" min-width="80px" align="center">
          <template slot-scope="{row}">
            {{ row.methodStatus === '0'?"现行":"废弃" }}
          </template>
        </el-table-column>

        <el-table-column prop="factorUnit" label="因子单位" width="80px" align="center" />
        <el-table-column prop="price" label="检测费用" align="center" />
        <el-table-column prop="cmaFlg" label="CMA" width="60px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.cmaFlg==='1'?'success':'danger'">{{ row.cmaFlg==='1'?'Y':'N' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cnasFlg" label="CNAS" width="60px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.cnasFlg==='1'?'success':'danger'">{{ row.cnasFlg==='1'?'Y':'N' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="extAssistFlg" label="检测能力" width="80px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="(row.cmaFlg==='1'|| row.cnasFlg==='1')?'success':'danger'">{{ (row.cmaFlg==='1'|| row.cnasFlg==='1')?'有':'无' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row)"> 编辑</el-button>
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

      <el-dialog title="因子编辑" :visible.sync="factorDialogVisible" width="50%">
        <div style="width: 550px;margin:0 auto;">
          <el-form ref="factorForm" :model="factorForm" :rules="factorRules" label-width="130px">
            <el-form-item prop="price" label="检测费用:">
              <el-input v-model="factorForm.price" placeholder="检测费用" maxlength="10" style="width: 70%;" />
            </el-form-item>
            <el-form-item label="检测能力:">
              <el-select v-model="extAssistFlg" default-first-option placeholder="检测能力" @change="handleChange">
                <el-option value="0" label="有能力" />
                <el-option value="1" label="无能力" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="extAssistFlg === '0'" prop="cmaFlg" label="CMA:">
              <el-radio-group v-model="factorForm.cmaFlg">
                <el-radio label="0">无</el-radio>
                <el-radio label="1">有</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="extAssistFlg === '0'" prop="cnasFlg" label="CNAS:">
              <el-radio-group v-model="factorForm.cnasFlg">
                <el-radio label="0">无</el-radio>
                <el-radio label="1">有</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="factorDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmDialog">确认</el-button>
        </div>
      </el-dialog>

      <el-dialog title="能力表上传" :visible.sync="uploadVisible">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/api/factor/importExcel"
          :on-change="onUploadChange"
          :on-exceed="onExceed"
          :limit="1"
          :file-list="fileList"
          :http-request="uploadSectionFile"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" />
        </el-upload>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import * as factorServer from '@/api/factor'
import * as dictServer from '@/api/dict'
import axios from 'axios'
export default {
  components: { Pagination },
  data() {
    return {
      searchForm: {
        classId: '',
        factorName: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      factorData: [],
      factorDialogVisible: false,
      categoryArray: [],
      factorForm: {
        id: '',
        price: '',
        cmaFlg: '',
        cnasFlg: ''
      },
      extAssistFlg: '1',
      factorRules: {
        price: [{ required: true, message: '单价信息不能不空', trigger: 'blur' }]
      },
      uploadVisible: false,
      fileList: [],
      classArray: []
    }
  },
  created() {
    this.getClassList()
    this.handleSearch()
  },
  methods: {
    getClassList() {
      dictServer.findFstClasses().then(res => {
        this.classArray = res.result || []
      })
    },
    handleSearch() {
      factorServer.getFactorListForPage(this.searchForm).then(res => {
        if (res.code === 200) {
          this.factorData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    handleUpdate(row) {
      this.factorForm.id = row.id
      this.factorForm.price = row.price
      this.factorForm.cmaFlg = row.cmaFlg
      this.factorForm.cnasFlg = row.cnasFlg
      if (this.factorForm.cmaFlg === '1' || this.factorForm.cnasFlg === '1') {
        this.extAssistFlg = '0'
      } else {
        this.extAssistFlg = '1'
      }
      this.factorDialogVisible = true
    },
    handleUpload() {
      this.fileList = []
      this.uploadVisible = true
    },
    handleDownload() {
      var url = '/api/factor/export?sheetName='
      window.open(url)
    },
    confirmDialog() {
      this.$refs.factorForm.validate(valid => {
        if (valid) {
          factorServer.updateStandard(this.factorForm).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.factorDialogVisible = false
            this.$refs.factorForm.resetFields()
          })
        } else {
          return false
        }
      })
    },
    handleChangeCMA(val) {
      if (val === '0') {
        this.factorForm.cnasFlg = '1'
      } else {
        this.factorForm.cnasFlg = '0'
      }
    },
    handleChangeCNAS(val) {
      if (val === '0') {
        this.factorForm.cmaFlg = '1'
      } else {
        this.factorForm.cmaFlg = '0'
      }
    },
    handleChange(val) {
      if (val === '1') {
        this.factorForm.cmaFlg = '0'
        this.factorForm.cnasFlg = '0'
      }
    },
    onUploadChange(file) {
      if (file.status === 'ready') return
      if (file.status === 'success') {
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
        this.uploadVisible = false
      } else {
        this.$message.error('上传失败!')
      }
    },
    onExceed() {
      this.$message.error('最多上传一个文件')
    },
    uploadSectionFile(params) {
      const form = new FormData()
      form.append('file', params.file)
      axios.post('/api/factor/importExcel', form,
        { responseType: 'arraybuffer' }).then((res) => {
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
        this.handleSearch()
        if (res.data.byteLength > 0) {
          const a = document.createElement('a')
          const blob = new Blob([res.data])
          const objectUrl = URL.createObjectURL(blob)
          a.setAttribute('href', objectUrl)
          a.setAttribute('download', '异常处理返回.xls')
          a.click()
          // console.log(objectUrl);
          URL.revokeObjectURL(objectUrl) // 释放内存
        }
        this.uploadVisible = false
      }).catch((res) => {
        console.log(res)
      })
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
