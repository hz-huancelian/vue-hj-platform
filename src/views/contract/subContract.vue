<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="合同编号:">
            <el-input v-model="searchForm.contCode" style="width:180px" placeholder="合同编号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.contName" style="width:180px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="search-right">
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table
        stripe
        border
        :data="contractData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无合同信息
              </span>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" label="序号" fixed="left" align="center" />
        <el-table-column prop="contCode" label="合同编号" width="190px" align="center" />
        <el-table-column prop="offerId" label="报价单号" width="170px" align="center" />
        <el-table-column prop="projectName" label="项目名称" min-width="140px" align="center" />
        <el-table-column prop="judgeOrganName" label="分包机构名称" min-width="120px" align="center" />
        <el-table-column prop="signDate" label="签订时间" width="160px" align="center" />
        <!-- <el-table-column prop="makeUserId" label="合同制作人" width="110" align="center" /> -->

        <el-table-column fixed="right" align="center" label="操作" width="160px">
          <template slot-scope="{row}">
            <!-- <el-button v-if="row.signDate && row.signDate.length > 0" type="text" @click="handleDetail(row)"> 查看</el-button>
            <div v-if="row.signDate && row.signDate.length > 0" class="erc-divider-vertical" /> -->
            <el-button v-if="row.signDate && row.signDate.length" type="text" @click="handleDwonload(row)"> 下载</el-button>
            <div v-if="row.signDate && row.signDate.length > 0" class="erc-divider-vertical" />
            <el-button type="text" @click="handleUpload(row)">合同上传</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="searchForm.pageNumber"
        :limit.sync="searchForm.pageSize"
        @pagination="handleSearch"
      />
    </div>
    <el-dialog title="合同信息上传" :visible.sync="contractVisible" top="5vh">
      <el-form :model="contarctUploadForm" label-width="110px">
        <el-form-item prop="signDate" label="签订时间:">
          <el-date-picker
            v-model="contarctUploadForm.signDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="签订日期"
            style="width: 260px;"
          />
        </el-form-item>
        <el-form-item label="有效期(年):">
          <el-input-number v-model="contarctUploadForm.validity" controls-position="right" style="width: 260px;" :min="1" :step="1" :precision="0" />
        </el-form-item>
        <el-form-item label="合同附件上传:">
          <el-upload
            ref="upload"
            drag
            class="upload-demo"
            :data="{'id':contarctUploadForm.contId,'signDate':contarctUploadForm.signDate, 'validity':contarctUploadForm.validity}"
            action="/api/cont/uploadSubContFile"
            :on-change="onUploadChange"
            :on-exceed="onExceed"
            :on-remove="onUploadRemove"
            accept=".doc,.docx,.pdf"

            :auto-upload="false"
            :limit="1"
            :file-list="fileList"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip" />
            <div slot="tip" class="el-upload__tip" style="color:red">注:您只能上传.doc,.docx,.pdf格式的文件</div>
          </el-upload>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="contractVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as contractServer from '@/api/contract'
import * as cusServer from '@/api/customer'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const CONTRACT_STATUS = {
  '0': '待完善',
  '1': '待审核',
  '2': '审核失败',
  '3': '待制作',
  '4': '已制作',
  '5': '已作废'
}
export default {
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      if (status === '0' || status === '2') {
        return ''
      } else if (status === '3' || status === '1') {
        return 'info'
      } else if (status === '4') {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      CONTRACT_STATUS,
      contractData: [],
      searchForm: {
        contCode: '',
        contName: '',
        contStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      contractVisible: false,
      contractForm: {
        contId: '',
        contractInfoTdo: {
          signDate: '',
          signLocation: '',
          payMethod: '0',
          payMethodDesc: '',
          validity: ''
        },
        cusContBaseInfoId: '',
        addTdo: {
          companyName: '',
          address: '',
          postCode: '',
          jurPerson: '',
          agentPerson: '',
          telFax: '',
          bankName: '',
          bankNo: '',
          taxNumber: ''
        }
      },
      contractStatus: 'create',
      contractRules: {
        contractInfoTdo: {
          validity: [{ required: true, message: '请录入有效期', trigger: 'blur' }],
          signDate: [{ required: true, message: '请录入签订日期', trigger: 'blur' }],
          signLocation: [{ required: true, message: '请录入地址', trigger: 'blur' }],
          payMethod: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
          payMethodDesc: [{ required: true, message: '请录支付说明', trigger: 'blur' }]
        },
        addTdo: {
          companyName: [{ required: true, message: '请录入客户名称', trigger: 'blur' }],
          address: [{ required: true, message: '请录入单位地址', trigger: 'blur' }],
          postCode: [{ required: true, message: '请录入电话/传真', trigger: 'blur' }],
          jurPerson: [{ required: true, message: '请录入邮政编码', trigger: 'blur' }],
          agentPerson: [{ required: true, message: '请录入法定代表人', trigger: 'blur' }],
          telFax: [{ required: true, message: '请录入委托代理人', trigger: 'blur' }],
          bankName: [{ required: true, message: '请录入开户银行', trigger: 'blur' }],
          bankNo: [{ required: true, message: '请录入银行账号', trigger: 'blur' }],
          taxNumber: [{ required: true, message: '请录入税号', trigger: 'blur' }]
        }
      },

      restaurants: [],
      contarctUploadForm: {
        contId: '',
        contFileId: '',
        signDate: '',
        validity: 1
      },
      fileList: [],
      activeName: 'maker',
      companyMap: {},
      approveVisible: false,
      currentItem: {},
      approveForm: {
        contId: '',
        auditFlag: '1',
        auditReason: ''
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      contractServer.findSubContInfosByCondition(this.searchForm).then(res => {
        if (res.code === 200 && res.result) {
          this.contractData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants

      if (queryString) {
        // 调用远程接口获取数据信息
        cusServer.fuzzyQuery(queryString).then(res => {
          if (res.result) {
            this.companyMap = res.result || {}
            cb(Object.keys(res.result))
          } else {
            cb([])
          }
        }).catch(() => {
          cb([])
        })
      } else {
        cb(restaurants)
      }
    },
    confirmDialog() {
      // 合同上传
      if (!this.contarctUploadForm.signDate) {
        this.$message.warning('完成日期不能为空')
        return
      }
      this.$refs.upload.submit()
      setTimeout(function() {
        this.handleSearch()
      }, 1500)
      // if (this.contarctUploadForm.signDate && this.contarctUploadForm.validity) {
      //   contractServer.saveLocalContract(this.contarctUploadForm).then(result => {
      //     if (result.code === 200) {
      //       this.$notify({
      //         title: '成功',
      //         message: result.message,
      //         type: 'success'
      //       })
      //       this.contractVisible = false
      //       this.handleSearch()
      //     } else {
      //       this.$notify({
      //         title: '失败',
      //         message: result.message,
      //         type: 'error'
      //       })
      //     }
      //   })
      // } else {
      //   this.$message.error('签订时间和周期不能为空')
      // }
    },
    handleDetail(row) {
      if (row.contFileId !== '' || row.contFileId !== '--') {
        this.$router.push({ name: 'sysPdfView', params: { path: row.contFileId, type: 1 }})
      } else {
        this.$message.error('合同文件还未上传')
      }
    },

    onUploadChange(file) {
      if (file.status === 'ready') return
      if (file.status === 'success') {
        const res = file.response || {}
        if (res && res.code === 200) {
          this.contarctUploadForm.contFileId = file.response.result
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
          this.contractVisible = false
        } else {
          this.$message.error('上传失败!')
        }
      } else {
        this.$message.error('上传失败!')
      }
    },
    onExceed() {
      this.$message.error('最多上传一个文件')
    },
    onUploadRemove() {
      this.contarctUploadForm.contFileId = ''
    },

    handleDwonload(row) {
      var url = this.$store.getters.sysBaseUrl + '/file/ht/upload/' + row.contFileId
      window.open(url)
    },
    handleUpload(row) {
      this.contarctUploadForm.contId = row.id
      this.contractVisible = true
    },

    confirmApproveDialog() {
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contractServer.auditCont(this.approveForm).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
            this.approveVisible = false
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {})
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
  .item {
    font-size: 16px;
  }
  ::v-deep .el-card .el-card__header {
    padding: 5px 20px;
    background: #F3F2F2;
  }
</style>
