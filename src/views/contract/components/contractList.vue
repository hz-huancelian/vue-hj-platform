<template>
  <div>
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="合同编号:">
            <el-input v-model="searchForm.contCode" style="width:180px" placeholder="合同编号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.contName" style="width:180px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="合同状态:">
            <el-select v-model="searchForm.contStatus" clearable style="width:170px" filterable placeholder="合同状态">
              <el-option
                v-for="item in Object.keys(CONTRACT_STATUS)"
                :key="item"
                :label="CONTRACT_STATUS[item]"
                :value="item"
              />
            </el-select>
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
        <el-table-column prop="contCode" label="合同编号" width="185px" align="center" />
        <el-table-column prop="offerId" label="报价单号" width="170px" align="center" />
        <el-table-column prop="projectName" label="项目名称" min-width="120px" align="center" />
        <el-table-column prop="partA" label="客户名称" width="120px" align="center" />
        <el-table-column prop="signDate" label="签订日期" width="120px" align="center" />
        <el-table-column prop="validity" label="有效期(年)" width="100px" align="center" />
        <el-table-column prop="contStatus" label="合同状态" width="110px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.contStatus|statusQualityFilter">
              {{ CONTRACT_STATUS[row.contStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="auditReason" label="驳回原因" :show-overflow-tooltip="true" width="100px" align="center" /> -->

        <el-table-column fixed="right" align="center" label="操作" width="210px">
          <template slot-scope="{row}">

            <el-button v-if="row.contStatus>0" type="text" @click="handleDetail(row)"> 查看</el-button>
            <div v-if="row.contStatus==='6' || row.contStatus==='2'" class="erc-divider-vertical" />

            <el-button v-if="row.contStatus==='0'" v-hasPermi="['contract:list:add']" type="text" @click="handleEdit(row)"> 完善</el-button>
            <el-button v-if="row.contStatus==='6' || row.contStatus==='2'" v-hasPermi="['contract:list:update']" type="text" @click="handleEdit(row)"> 编辑</el-button>

            <div v-if="row.signDate && row.contStatus>= 1" class="erc-divider-vertical" />
            <el-button v-if="row.signDate && row.contStatus>= 1" type="text" @click="handleDwonload(row)"> 下载</el-button>

            <div v-if="row.signDate && row.contStatus==='6'" v-hasPermi="['contract:list:update']" class="erc-divider-vertical" />
            <el-button v-if="row.signDate && row.contStatus==='6' " v-hasPermi="['contract:list:update']" type="text" @click="handleApprove(row)"> 提交审核</el-button>

            <div v-if="row.contStatus==='0'|| row.contStatus==='2'" v-hasPermi="['contract:list:del']" class="erc-divider-vertical" />
            <el-button v-if="row.contStatus==='0'|| row.contStatus==='2'" v-hasPermi="['contract:list:del']" type="text" @click="handleDelete(row)"> 作废</el-button>

            <div v-if="row.contStatus==='2'" class="erc-divider-vertical" />
            <el-button v-if="row.contStatus==='2'" type="text" @click="handleApproveDetail(row)"> 审核历史</el-button>

            <!-- <div v-if="row.contStatus==='1'" class="erc-divider-vertical" />
            <el-button v-if="row.contStatus==='1'" type="text" @click="handleApproveRes(row)"> 审核</el-button> -->

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
    <el-dialog title="合同信息完善" :visible.sync="contractVisible" width="85%" top="5vh" :close-on-click-modal="false">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="maker" label="在线制作">
          <el-form ref="contractForm" :model="contractForm" :rules="contractRules" label-width="120px" label-position="right">
            <el-divider content-position="left">合同信息</el-divider>
            <el-row>
              <el-col :span="8">
                <el-form-item prop="contractInfoTdo.validity" label="有效期(年):">
                  <el-input-number v-model="contractForm.contractInfoTdo.validity" controls-position="right" style="width: 90%;" :min="1" :step="1" :precision="0" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="contractInfoTdo.signDate" label="签订日期:">
                  <el-date-picker
                    v-model="contractForm.contractInfoTdo.signDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="签订日期"
                    style="width: 90%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="contractInfoTdo.signLocation" label="签订地址:">
                  <el-input v-model="contractForm.contractInfoTdo.signLocation" style="width: 90%;" placeholder="签订地址" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item prop="contractInfoTdo.payMethod" label="支付方式:">
                  <el-select v-model="contractForm.contractInfoTdo.payMethod" style="width: 90%;" placeholder="支付方式">
                    <el-option value="1" label="一次付清">一次付清</el-option>
                    <el-option value="2" label="分期支付">分期支付</el-option>
                    <el-option value="3" label="其他方式">其他方式</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item prop="contractInfoTdo.payMethodDesc" label="支付说明:">
                  <el-input v-model="contractForm.contractInfoTdo.payMethodDesc" style="width: 90%;" placeholder="支付说明" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">客户信息</el-divider>
            <el-row>
              <el-col :span="8">
                <el-form-item label="合同属性:">
                  <el-switch
                    v-model="masterSwitch"
                    active-text="子合同"
                    inactive-text="主合同"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="masterSwitch" :span="16">
                <el-form-item label="关联主合同:">
                  <el-input v-model="contractForm.addTdo.supContCode" placeholder="合同编号" style="width: 200px;" />
                  <el-button type="primary" size="mini" style="margin-left: 10px;" @click="checkContractInfo">验证</el-button>
                  <span v-if="checkFlag" style="color:green;margin-left: 10px;">
                    {{ checkText }}
                  </span>
                  <span v-if="!checkFlag" style="color:red;margin-left: 10px;">
                    {{ checkText }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item prop="addTdo.companyName" label="单位名称:">
                  <!-- <el-autocomplete
                    v-model="contractForm.addTdo.companyName"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    style="width: 90%;"
                    @select="handleSelectCom"
                  >
                    <i
                      slot="suffix"
                      class="el-icon-edit el-input__icon"
                    />
                    <template slot-scope="{ item }">
                      <div class="name">{{ companyMap[item] }}</div>
                    </template>
                  </el-autocomplete> -->

                  <el-select
                    v-model="contractForm.addTdo.companyName"
                    filterable
                    remote
                    placeholder="请输入客户"
                    :remote-method="querySearchAsync"
                    style="width: 90%;"
                    @change="handleSelectCom"
                  >
                    <el-option
                      v-for="item in Object.keys(companyMap)"
                      :key="item"
                      :label="companyMap[item]"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="addTdo.address" label="通讯地址:">
                  <el-input v-model="contractForm.addTdo.address" style="width: 90%;" maxlength="35" placeholder="通讯地址" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="addTdo.postCode" label="邮政编码:">
                  <el-input v-model="contractForm.addTdo.postCode" style="width: 90%;" :maxlength="6" placeholder="邮政编码" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item prop="addTdo.jurPerson" label="法定代表人:">
                  <el-input v-model="contractForm.addTdo.jurPerson" style="width: 90%;" maxlength="40" placeholder="法定代表人" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="addTdo.agentPerson" label="委托代理人:">
                  <el-input v-model="contractForm.addTdo.agentPerson" style="width: 90%;" maxlength="40" placeholder="委托代理人" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="addTdo.telFax" label="电话/传真:">
                  <el-input v-model="contractForm.addTdo.telFax" style="width: 90%;" maxlength="15" placeholder="电话/传真" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item prop="addTdo.bankName" label="开户银行:">
                  <el-input v-model="contractForm.addTdo.bankName" style="width: 90%;" maxlength="15" placeholder="开户银行" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="addTdo.bankNo" label="银行账号:">
                  <el-input v-model="contractForm.addTdo.bankNo" style="width: 90%;" maxlength="20" placeholder="银行账号" @input="bankNumCheck" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="addTdo.taxNumber" label="税号:">
                  <el-input v-model="contractForm.addTdo.taxNumber" style="width: 90%;" maxlength="20" placeholder="税号" />
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-tab-pane>
        <el-tab-pane name="upload" label="合同上传">
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
            <el-form-item label="合同属性:">
              <el-switch
                v-model="masterUpSwitch"
                active-text="子合同"
                inactive-text="主合同"
              />
            </el-form-item>
            <el-form-item v-if="masterUpSwitch" label="关联主合同:">
              <el-input v-model="contarctUploadForm.supContCode" placeholder="合同编号" style="width: 200px;" />
              <el-button type="primary" size="mini" style="margin-left: 10px;" @click="checkUpContractInfo">验证</el-button>
              <span v-if="checkUpFlag" style="color:green;margin-left: 10px;">
                {{ checkUpText }}
              </span>
              <span v-if="!checkUpFlag" style="color:red;margin-left: 10px;">
                {{ checkUpText }}
              </span>
            </el-form-item>
            <el-form-item label="有效期(年):">
              <el-input-number v-model="contarctUploadForm.validity" controls-position="right" style="width: 260px;" :min="1" :step="1" :precision="0" />
            </el-form-item>
            <el-form-item label="合同附件上传:">
              <el-upload
                ref="upload"
                drag
                class="upload-demo"
                action="/api/cont/uploadContFile"
                :on-change="onUploadChange"
                :on-exceed="onExceed"
                :on-remove="onUploadRemove"
                :limit="1"
                :file-list="fileList"
                accept=".doc,.docx,.pdf"
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
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="contractVisible=false">取消</el-button>
        <el-button v-loading.fullscreen.lock="processLoading" type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="合同审核" :visible.sync="approveVisible" center>
      <div style="width: 400px;margin:0 auto">
        <el-form :model="approveForm" label-width="100px">
          <el-form-item label="审核结果:">
            <el-radio-group v-model="approveForm.auditFlag">
              <el-radio label="1">通过</el-radio>
              <el-radio label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="approveForm.auditFlag === '2'" label="审核意见:">
            <el-input v-model="approveForm.auditReason" type="textarea" :rows="3" maxlength="50" show-word-limit placeholder="审核意见" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmApproveDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="审核历史" :visible.sync="appHisVisible" width="75%">
      <el-table :data="approveDetails" border stripe>
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.auditFlag==='1'?'success':'danger'">{{ row.auditFlag==='1'?'通过':'不通过' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="auditReason" label="审核说明" align="center" />
        <el-table-column prop="auditUserName" label="审批用户" align="center" />
        <el-table-column prop="createTime" label="审批时间" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as contractServer from '@/api/contract'
import * as cusServer from '@/api/customer'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const CONTRACT_STATUS = {
  '0': '待完善',
  '6': '待提交',
  '1': '待审核',
  '2': '审核驳回'
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
      masterSwitch: false,
      masterUpSwitch: false,
      checkFlag: false,
      checkText: '',
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
          supContCode: '',
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
          companyName: [{ required: true, message: '请录入单位名称', trigger: 'blur' }],
          address: [{ required: true, message: '请录入通讯地址', trigger: 'blur' }],
          postCode: [{ required: true, message: '请录入邮政编码', trigger: 'blur' }],
          jurPerson: [{ required: true, message: '请录入法定代表人', trigger: 'blur' }],
          agentPerson: [{ required: true, message: '请录入委托代理人', trigger: 'blur' }],
          telFax: [{ required: true, message: '请录入电话/传真', trigger: 'blur' }],
          bankName: [{ required: true, message: '请录入开户银行', trigger: 'blur' }],
          bankNo: [{ required: true, message: '请录入银行账号', trigger: 'blur' }],
          taxNumber: [{ required: true, message: '请录入税号', trigger: 'blur' }]
        }
      },
      uploadContractForm: {
        contId: '',
        signDate: '',
        contFileId: '',
        validity: ''
      },
      restaurants: [],
      contarctUploadForm: {
        contId: '',
        contFileId: '',
        supContCode: '',
        signDate: '',
        validity: ''
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
      },
      appHisVisible: false,
      approveDetails: [],
      processLoading: false,
      checkUpFlag: false,
      checkUpText: '',
      customerList: []
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      contractServer.findContInfosByCondition(this.searchForm).then(res => {
        if (res.code === 200 && res.result) {
          this.contractData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    querySearchAsync(queryString) {
      debugger
      if (queryString && queryString.trim().length > 0) {
        // 调用远程接口获取数据信息
        cusServer.fuzzyQuery(queryString).then(res => {
          if (res.result) {
            this.companyMap = res.result || {}
          }
        }).catch(() => {
        })
      }
    },
    confirmDialog() {
      this.processLoading = true
      if (this.activeName === 'maker') {
        if (this.masterSwitch) {
          if (this.contractForm.addTdo.supContCode.length <= 0 || !this.checkFlag) {
            this.$message.error('请录入关联主合同信息且通过验证！')
            this.processLoading = false
            return
          }
        }
        // 在线制作
        this.$refs.contractForm.validate(valid => {
          if (valid) {
            debugger
            if (this.contractForm.addTdo && this.contractForm.addTdo.id !== '') {
              this.contractForm.cusContBaseInfoId = this.contractForm.addTdo.id || ''
            }
            contractServer.saveContract(this.contractForm).then(result => {
              if (result.code === 200) {
                this.$notify({
                  title: '成功',
                  message: result.message,
                  type: 'success'
                })
                this.contractVisible = false
                this.handleSearch()
              } else {
                this.$notify({
                  title: '失败',
                  message: result.message,
                  type: 'error'
                })
              }
              this.processLoading = false
            }).catch(() => {
              this.contractVisible = false
              this.processLoading = false
              this.handleSearch()
            }).finally(() => {
              this.contractVisible = false
              this.processLoading = false
              this.handleSearch()
            })
          } else {
            this.processLoading = false
          }
        })
      } else {
        if (this.masterUpSwitch) {
          if (this.contarctUploadForm.supContCode.length <= 0 || !this.checkUpFlag) {
            this.$message.error('请录入关联主合同信息且通过验证！')
            this.processLoading = false
            return
          }
        }
        // 合同上传
        if (this.contarctUploadForm.signDate && this.contarctUploadForm.validity) {
          contractServer.saveLocalContract(this.contarctUploadForm).then(result => {
            if (result.code === 200) {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.contractVisible = false
              this.handleSearch()
            } else {
              this.$notify({
                title: '失败',
                message: result.message,
                type: 'error'
              })
            }
            this.contractVisible = false
            this.processLoading = false
            this.handleSearch()
          }).finally(() => {
            this.processLoading = false
          })
        } else {
          this.$message.error('签订时间和周期不能为空')
          this.processLoading = false
        }
      }
    },
    handleDetail(row) {
      contractServer.findContFileById(row.id).then(res => {
        if (res.code === 200 && res.result && res.result.length > 0) {
          const path = res.result // 合同文件存放地址
          // this.$router.push(`/report/pdfView/${path}/1`)
          this.$router.push({ name: 'sysPdfView', params: { path: path, type: 1 }})
        } else {
          this.$message.error('合同PDF还未生成')
        }
      })
    },
    handleEdit(row) {
      this.clearForm()
      this.checkFlag = false
      this.checkUpFlag = false
      this.checkText = ''
      this.checkUpText = ''

      this.contarctUploadForm.contId = row.id
      if (row.makeType === '0') {
        this.contractForm.contId = row.id
        contractServer.findContPerfectInfoById(row.id).then(res => {
          if (res.code === 200 && res.result) {
            debugger
            this.contractForm.contractInfoTdo.signDate = res.result.signDate
            this.contractForm.contractInfoTdo.signLocation = res.result.signLocation
            this.contractForm.contractInfoTdo.payMethod = res.result.payMethod
            this.contractForm.contractInfoTdo.payMethodDesc = res.result.payMethodDesc
            this.contractForm.contractInfoTdo.validity = res.result.validity
            if (res.result.cusContBaseInfoVo && res.result.cusContBaseInfoVo.id) {
              this.contractForm.cusContBaseInfoId = res.result.cusContBaseInfoVo.id
            } else {
              this.contractForm.cusContBaseInfoId = ''
            }
            this.contractForm.addTdo = res.result.cusContBaseInfoVo || {}
            if (row.contStatus === '6') {
              this.currentItem = res.result.cusContBaseInfoVo || {}
            }
            this.contractVisible = true
          }
        })
      } else {
        // 文件上传信息 通过列表获取
        // TODO
        this.contarctUploadForm.contFileId = row.contFileId
        this.contarctUploadForm.signDate = row.signDate
        this.contarctUploadForm.validity = row.validity
        this.contarctUploadForm.supContCode = row.supContCode
        this.contractVisible = true
      }
    },
    clearForm() {
      this.contractForm = {
        contId: '',
        contractInfoTdo: {
          signDate: '',
          signLocation: '',
          payMethod: '0',
          payMethodDesc: '',
          validity: '1'
        },
        cusContBaseInfoId: '',
        addTdo: {
          id: '',
          organId: '',
          companyName: '',
          address: '',
          postCode: '',
          jurPerson: '',
          agentPerson: '',
          telFax: '',
          bankName: '',
          bankNo: '',
          taxNumber: '',
          supContCode: ''
        }
      }
      this.contarctUploadForm = {
        contId: '',
        contFileId: '',
        supContCode: '',
        signDate: '',
        validity: '1'
      }
      this.masterSwitch = false
      this.masterUpSwitch = false
    },
    bankNumCheck(val) {
      this.contractForm.addTdo.bankNo = val.replace(/[^\d]/g, '')
    },
    handleSelectCom(item) {
      cusServer.findById(item).then(res => {
        if (res.code === 200 && res.result) {
          this.currentItem = { ...res.result }
          this.contractForm.cusContBaseInfoId = res.result.id
          this.contractForm.addTdo = res.result
        }
      })
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
    handleApprove(row) {
      this.$confirm('确定提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contractServer.submitCont(row.id).then(result => {
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
    handleDwonload(row) {
      if (row.contFileId && row.contFileId.length > 0) {
        var url = this.$store.getters.sysBaseUrl + '/file/ht/upload/' + row.contFileId
        window.open(url)
      } else {
        this.$message.warning('合同生成异常，请联系管理员')
      }
    },
    handleApproveDetail(row) {
      contractServer.findAuditRecordsByContId(row.id).then(res => {
        this.approveDetails = res.result || []
      })
      this.appHisVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contractServer.invalidCont(row.id).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
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
    },
    handleApproveRes(row) {
      this.approveForm.contId = row.id
      this.approveForm.auditFlag = '1'
      this.approveForm.auditReason = ''
      this.approveVisible = true
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
    },
    checkContractInfo() {
      if (this.contractForm.addTdo.supContCode && this.contractForm.addTdo.supContCode.length > 0) {
        contractServer.checkSupContCode({ supContCode: this.contractForm.addTdo.supContCode }).then(res => {
          debugger
          if (res.code === 200) {
            this.checkFlag = true
            this.checkText = '校验通过'
          } else {
            this.checkFlag = false
            this.checkText = '校验不通过'
          }
        }).catch(() => {
          this.checkFlag = false
          this.checkText = '校验不通过'
        })
      }
    },
    checkUpContractInfo() {
      if (this.contarctUploadForm.supContCode && this.contarctUploadForm.supContCode.length > 0) {
        contractServer.checkSupContCode({ supContCode: this.contarctUploadForm.supContCode }).then(res => {
          if (res.code === 200) {
            this.checkUpFlag = true
            this.checkUpText = '校验通过'
          } else {
            this.checkUpFlag = false
            this.checkUpText = '校验不通过'
          }
        }).catch(() => {
          this.checkUpFlag = false
          this.checkUpText = '校验不通过'
        })
      }
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
