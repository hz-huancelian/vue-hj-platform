<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="18">
          <el-form-item label="单位名称:">
            <el-input v-model="searchForm.companyName" style="width:180px" placeholder="单位名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch"> 查询</el-button>
            <!-- <el-button type="primary" @click="handleDownload"> 导出</el-button> -->
          </el-form-item>
        </el-col>
        <el-col :span="6" class="search-right">
          <el-button type="text" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
          <el-button type="text" size="small" icon="el-icon-upload2" @click="handleUpload">批量导入</el-button>
          <el-button type="text" size="small" icon="el-icon-download" @click="handleDownload">导出</el-button>
          <el-button type="text" size="small" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table
        stripe
        border
        :data="customerData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无客户,
              </span>
              <el-button type="text" size="small" style="font-size:14px;" @click="handleCreate">新建客户</el-button>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="50" label="序号" fixed="left" align="center" />
        <el-table-column prop="companyName" label="单位名称" fixed="left" align="center" />
        <el-table-column prop="jurPerson" label="法定代表人" align="center" />
        <el-table-column prop="address" label="通讯地址" align="center" />
        <el-table-column prop="agentPerson" label="委托代理人" align="center" />
        <el-table-column prop="telFax" label="电话/传真" align="center" />
        <el-table-column prop="bankName" label="开户行" width="100" align="center" />
        <el-table-column prop="bankNo" label="银行卡号" align="center" />
        <el-table-column prop="taxNumber" label="识别号/信用代码" min-width="100" align="center" />
        <el-table-column prop="createUserId" label="创建人" width="110px" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row)"> 修改</el-button>
            <div class="erc-divider-vertical" />
            <el-button type="text" @click="handleDelete(scope.row.id)"> 删除</el-button>
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

    <el-dialog :title="titleMap[customerDialogStatus]" :visible.sync="customerDialogVisible" width="65%" center :close-on-click-modal="false">
      <el-form ref="customForm" :model="customForm" :rules="customRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="companyName" label="单位名称:">
              <el-input v-model="customForm.companyName" placeholder="单位名称" maxlength="25" style="width: 80%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="address" label="单位地址:">
              <el-input v-model="customForm.address" placeholder="单位地址" style="width: 80%;" maxlength="35" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="telFax" label="电话/传真:">
              <el-input v-model="customForm.telFax" placeholder="电话/传真" style="width: 80%;" maxlength="15" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="postCode" label="邮政编码:">
              <el-input v-model="customForm.postCode" placeholder="邮政编码" style="width: 80%;" maxlength="6" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="jurPerson" label="法定代表人:">
              <el-input v-model="customForm.jurPerson" placeholder="法定代表人" style="width: 80%;" maxlength="40" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="agentPerson" label="委托代理人:">
              <el-input v-model="customForm.agentPerson" placeholder="委托代理人" style="width: 80%;" maxlength="40" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户银行:">
              <el-input v-model="customForm.bankName" placeholder="开户银行" style="width: 80%;" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行账号:">
              <el-input v-model="customForm.bankNo" placeholder="银行账号" style="width: 80%;" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="纳税人识别号/统一社会信用代码:" label-width="230px">
              <el-input v-model="customForm.taxNumber" placeholder="企业税号" style="width: 300px" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customerDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量导入客户" :visible.sync="uploadVisible" append-to-body>
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
                <el-button size="mini" type="primary" @click="handleDownloadTep()">模板下载</el-button>
              </el-col>
            </el-row>
          </el-timeline-item>
          <el-timeline-item size="large">
            <span slot="dot" class="time-dot">
              2
            </span>
            <el-row>
              <el-col :span="24">
                上传填写好的客户信息表格
              </el-col>
            </el-row>
            <el-row style="padding-top:10px;">
              <el-col :span="24">
                <el-upload
                  class="upload-demo"
                  action="/api/dataImport/uploadCustomer"
                  :on-change="customUploadChange"
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
            <span style="color:red; font-size: 13px">备注：批量导入客户功能，只会将上传的客户信息列表内的客户新增到系统内，不对原有客户信息做任何替换或修改。</span>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog title="文件上传" :visible.sync="uploadVisible" center>
      <el-form>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="/api/dataImport/uploadCustomer"
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
import * as customerServer from '@/api/customer'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getDicKey } from '@/api/dict'
const ACCOUNT_STATUS = {
  '0': '有效',
  '1': '无效'
}
export default {
  name: 'CustomerList',
  components: { Pagination },
  data() {
    return {
      ACCOUNT_STATUS,
      customerData: [],
      searchForm: {
        companyName: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      titleMap: {
        edit: '修改客户',
        create: '新增客户'
      },
      customForm: {
        cusContBaseInfoId: '',
        companyName: '',
        address: '',
        postCode: '',
        jurPerson: '',
        agentPerson: '',
        telFax: '',
        bankName: '',
        bankNo: '',
        taxNumber: ''
      },
      customRules: {
        companyName: [{ required: true, message: '请录入单位名称', trigger: 'blur' }],
        address: [{ required: true, message: '请录入单位地址', trigger: 'blur' }],
        postCode: [{ required: true, message: '请录入邮政编码', trigger: 'blur' }],
        jurPerson: [{ required: true, message: '请录入法定代表人', trigger: 'blur' }],
        agentPerson: [{ required: true, message: '请录入委托代理人', trigger: 'blur' }],
        telFax: [{ required: true, message: '请录入电话/传真', trigger: 'blur' }],
        bankName: [{ required: true, message: '请录入开户银行', trigger: 'blur' }],
        bankNo: [{ required: true, message: '请录入银行账号', trigger: 'blur' }],
        taxNumber: [{ required: true, message: '请录入企业税号', trigger: 'blur' }]
      },
      customerDialogStatus: 'create',
      customerDialogVisible: false,
      departmentArray: [],
      customerActiveName: '1',
      factorData: [],
      factorForm: {
        checkCount: 1,
        CountType: '',
        reportAmountRate: 10,
        expediteAmountRate: 0,
        laborAmount: '',
        tripAmount: '',
        taxAmountRate: 6
      },
      factorRules: {},
      priceArray: [],
      innerPriceVisible: false,
      addPriceForm: {
        selfName: '',
        amount: 0.00
      },
      uploadVisible: false,
      excelFileList: [],
      fileResult: ''
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    getDicKey(type, code) {
      getDicKey(code).then(result => {
        if (result.code === 200) {
          this[type] = result.result
        }
      })
    },
    handleSearch() {
      customerServer.getCustomerForPage(this.searchForm).then(res => {
        if (res.code === 200 && res.result) {
          this.customerData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    // 重置
    handleCreate() {
      this.clearForm()
      this.customerDialogStatus = 'create'
      this.customerDialogVisible = true
    },
    handleUpdate(row) {
      this.clearForm()
      this.customForm = Object.assign({}, row)
      this.customForm.cusContBaseInfoId = row.id
      this.customerDialogStatus = 'edit'
      this.customerDialogVisible = true
    },
    confirmDialog() {
      if (this.customerDialogStatus === 'create') {
        this.confirmCreate()
      } else {
        this.confirmUpdate()
      }
    },
    confirmCreate() {
      this.$refs.customForm.validate(valid => {
        if (valid) {
          customerServer.addCusContBase(this.customForm).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.customerDialogVisible = false
            this.$refs.customForm.resetFields()
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    confirmUpdate() {
      this.$refs.customForm.validate(valid => {
        if (valid) {
          customerServer.modifyCusContBaseById(this.customForm).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.customerDialogVisible = false
            this.$refs.customForm.resetFields()
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    handleDelete(customerId) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        customerServer.delCusContBaseById(customerId).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {})
    },
    clearForm() {
      this.customForm = {
        cusContBaseInfoId: '',
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
    handleDownloadTep() {
      const url = this.$store.getters.sysBaseUrl + '/api/dataImport/downloadCustomerExcel'
      window.open(url)
    },
    handleDownload() {
      const url = this.$store.getters.sysBaseUrl + '/api/dataImport/exportCustomer'
      window.open(url)
    },
    customUploadChange(file) {
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
    handleUpload() {
      this.uploadVisible = true
      this.excelFileList = []
      this.fileResult = ''
    }

  }
}
</script>

<style scoped lang="scss" type="text/scss">
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
