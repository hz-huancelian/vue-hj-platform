<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="19">
          <el-form-item label="任务单号:">
            <el-input v-model="searchForm.jobId" style="width:165px" placeholder="任务单号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="报告状态:">
            <el-select v-model="searchForm.reportStatus" clearable style="width:165px" filterable placeholder="报告状态">
              <el-option
                v-for="item in Object.keys(REPORT_STATUS)"
                :key="item"
                :label="REPORT_STATUS[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="5" class="search-right">
          <el-button type="text" icon="el-icon-plus" @click="handleUphold">报告基础信息</el-button>
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      border
      :data="reportData"
      stripe
      highlight-current-row
      :header-cell-style="{background:'#ECF3FC'}"
    >
      <el-table-column type="index" width="50" label="序号" align="center" />
      <el-table-column prop="reportCode" label="报告编号" width="140px" align="center" />
      <el-table-column prop="jobId" label="任务单号" width="140px" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="consignorName" label="委托单位" align="center" />
      <el-table-column prop="inspectionName" label="受检单位" align="center" />
      <el-table-column prop="reportStatus" label="报告状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.reportStatus|statusQualityFilter">
            {{ REPORT_STATUS[row.reportStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reportMakeTime" label="生成时间" width="160px" align="center" />
      <el-table-column label="操作" align="center" width="185px">
        <template slot-scope="{row}">
          <el-button v-if="row.reportStatus > 1" type="text" @click="handleDetail(row)">查看</el-button>

          <el-button v-if="row.reportStatus === '1'" v-loading.fullscreen.lock="downloadLoading" type="text" @click="handleAddReport(row)">报告生成</el-button>

          <div v-if="row.reportStatus === '2' || row.reportStatus === '3' || row.reportStatus === '7'" class="erc-divider-vertical" />
          <el-button v-if="row.reportStatus === '2' || row.reportStatus === '3' || row.reportStatus === '7'" type="text" @click="handleUpload(row)">上传报告</el-button>

          <div v-if="row.reportStatus === '3'" class="erc-divider-vertical" />
          <el-button v-if="row.reportStatus === '3'" type="text" @click="handleSubApprove(row)">提交审核</el-button>

          <div v-if="row.reportStatus > 1" class="erc-divider-vertical" />
          <el-dropdown v-if="row.reportStatus > 1">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-link v-if="row.reportStatus>1" :underline="false" @click="handleDownload(row)">
                <el-dropdown-item>最新报告下载</el-dropdown-item>
              </el-link>
              <el-link v-if="row.reportStatus>1" :underline="false" @click="handleOldDownload(row)">
                <el-dropdown-item>原始报告下载</el-dropdown-item>
              </el-link>
            </el-dropdown-menu>
          </el-dropdown>

          <!-- <div v-if="row.reportStatus === '2'" class="erc-divider-vertical" />
          <el-button v-if="row.reportStatus>1 && row.reportStatus<6" type="text" @click="handleUpload(row)">上传报告</el-button> -->

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

    <el-dialog title="报告审核信息确认" :visible.sync="approveVisible" center>
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
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="报告审核信息确认" :visible.sync="issueVisible" center>
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
        <el-button @click="issueVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmIssueDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="报告基础配置信息" :visible.sync="basicVisible" center top="5vh" width="80%">
      <el-form ref="basicForm" :model="basicForm" :rules="basicRules" label-width="110px">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item prop="cmaNumber" label="CMA证书号:">
              <el-input v-model="basicForm.cmaNumber" maxlength="20" placeholder="请录入CMA证书号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CNAS证书号:">
              <el-input v-model="basicForm.cnasNumber" maxlength="20" placeholder="请录入CNAS证书号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item prop="tel" label="电话:">
              <el-input v-model="basicForm.tel" maxlength="13" placeholder="请录入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fax" label="传真:">
              <el-input v-model="basicForm.fax" maxlength="13" placeholder="请录入传真" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item prop="postCode" label="邮政编码:">
              <el-input v-model="basicForm.postCode" maxlength="6" placeholder="请录入邮政编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="website" label="网址:">
              <el-input v-model="basicForm.website" maxlength="20" placeholder="请录入网址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item prop="address" label="详细地址:">
              <el-input v-model="basicForm.address" maxlength="30" style="width: 100%;" placeholder="请录入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item prop="explains" label="说明内容:">
              <el-input v-model="basicForm.explains" type="textarea" maxlength="1000" :rows="5" style="width: 100%;" placeholder="请录入报告说明信息" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item prop="logoImageId" label="企业Logo:">
              <el-upload
                ref="logoImage"
                action="/api/reportBase/uploadReportImg"
                list-type="picture-card"
                :on-change="onUploadChange"
                accept=".jpg,.jpeg,.png"
                :file-list="logoFileList"
                :before-upload="beforeAvatarUpload"
                :limit="1"
                :class="{hide:hideLogoUploadEdit}"
              >
                <i slot="default" class="el-icon-plus" />
                <div slot="file" slot-scope="{file}">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  >
                  <span class="el-upload-list__item-actions">
                    <!-- <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in" />
                    </span> -->
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </div>
                <div slot="tip" class="el-upload__tip" style="color:red">注：您最多只能上传1张图片，图片尺寸为500px*160px，并且图片大小不能超过1M</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="watermarkImageId" label="报告水印:">
              <el-upload
                ref="waterImage"
                action="/api/reportBase/uploadReportImg"
                list-type="picture-card"
                :on-change="onWaterUploadChange"
                accept=".jpg,.jpeg,.png,.gif"
                :file-list="waterFileList"
                :before-upload="beforeAvatarUpload"
                :limit="1"
                :class="{hide:hideUploadEdit}"
              >
                <i slot="default" class="el-icon-plus" />
                <div slot="file" slot-scope="{file}">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  >
                  <span class="el-upload-list__item-actions">
                    <!-- <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in" />
                    </span> -->
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleWaterRemove(file)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </div>
                <div slot="tip" class="el-upload__tip" style="color:red">注：您最多只能上传1张图片，图片尺寸为600px*300px，并且图片大小不能超过1M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="basicVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmBasicDialog">确认</el-button>
      </div>
      <el-dialog append-to-body :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-dialog>

    <el-dialog title="报告上传" :visible.sync="uploadVisible" top="5vh">
      <div style="width: 500px;margin:0 auto">

        <el-form ref="uploadForm" :model="uploadForm" :rules="uploadRules" label-width="110px">
          <el-form-item label="报告编号:">
            <el-input v-model="uploadForm.reportCode" style="width: 300px;" disabled />
          </el-form-item>
          <el-form-item prop="reportFile" label="报告文档:">
            <el-upload
              class="upload-demo"
              drag
              :data="{'reportId': uploadForm.id}"
              action="/api/report/uploadReportFile"
              :on-change="onReportUploadChange"
              :file-list="fileList"
              accept=".doc,.docx"
              :limit="1"
              style="width: 300px;"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text"><em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip" style="color:red;">您只能上传.doc,.docx格式的文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible=false">关 闭</el-button>
        <!-- <el-button type="primary" @click="confirmReportDialog">确认</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
const REPORT_STATUS = {
  // '0': '待分配',
  '1': '未生成',
  '2': '制作中',
  '3': '待提交审批',
  '4': '待审核',
  '5': '待签发',
  '6': '完成',
  '7': '已驳回'

}
import Pagination from '@/components/Pagination'
import * as reportServer from '@/api/report'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import checkPermission from '@/utils/permission' // 权限判断函数
import qs from 'qs'
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusQualityFilter(status) {
      if (status < 3) {
        return 'info'
      } else if (status < 6) {
        return ''
      } else if (status === '6') {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      REPORT_STATUS,
      searchForm: {
        jobId: '',
        reportCode: '',
        projectName: '',
        reportStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      reportData: [],
      approveVisible: false,
      approveForm: {
        id: '',
        auditFlag: '1',
        remark: ''
      },
      issueVisible: false,
      issueForm: {
        id: '',
        auditFlag: '1',
        remark: ''
      },
      basicForm: {
        cmaNumber: '',
        cnasNumber: '',
        tel: '',
        fax: '',
        address: '',
        website: '',
        postCode: '',
        logoImageId: '',
        explains: '',
        watermarkImageId: ''
      },
      basicRules: {
        cmaNumber: [{ required: true, message: '请录入CMA证书号', trigger: 'blur' }],
        cnasNumber: [{ required: true, message: '请录入CNAS证书号', trigger: 'blur' }],
        tel: [{ required: true, message: '请录入电话', trigger: 'blur' }],
        fax: [{ required: true, message: '请录入传真', trigger: 'blur' }],
        postCode: [{ required: true, message: '请录入邮政编码', trigger: 'blur' }],
        website: [{ required: true, message: '请录入网址', trigger: 'blur' }],
        address: [{ required: true, message: '请录入详细地址', trigger: 'blur' }],
        logoImageId: [{ required: true, message: '请上传企业Logo图片', trigger: 'blur' }],
        watermarkImageId: [{ required: true, message: '请上传报告水印图片', trigger: 'blur' }]
      },
      logoImageList: [],
      waterImageList: [],
      dialogImageUrl: '',
      basicVisible: false,
      dialogVisible: false,
      logoFileList: [],
      waterFileList: [],
      uploadVisible: false,
      uploadForm: {
        id: '',
        reportCode: '',
        reportFile: ''
      },
      uploadRules: {
        reportFile: [{ required: true, message: '请上传报告信息', trigger: 'blur' }]
      },
      fileList: [],
      hideLogoUploadEdit: false,
      hideUploadEdit: false,
      downloadLoading: false

    }
  },
  computed: {
    ...mapGetters(['platformPositionId', 'userId'])
  },
  created() {
    this.handleSearch()
  },
  methods: {
    checkPermission,
    handleSearch() {
      reportServer.findReportInfosByCondition(this.searchForm).then(res => {
        if (res.code === 200 && res.result) {
          this.reportData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    handleAddReport(row) {
      this.downloadLoading = true
      reportServer.genReport(row.reportCode).then(result => {
        if (result.code === 200) {
          this.$notify({
            title: '成功',
            message: result.message,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: result.message,
            type: 'error'
          })
        }
        this.handleSearch()
        this.downloadLoading = false
      }).catch(() => {
        this.handleSearch()
        this.downloadLoading = false
      }).finally(() => {
        this.handleSearch()
        this.downloadLoading = false
      })
    },
    handleDetail(row) {
      const path = row.reportCode + '.pdf'
      // this.$router.push(`/report/pdfView/${path}/2`)
      this.$router.push({ name: 'sysPdfView', params: { path: path, type: 2 }})
      // if (row.reportFileId && row.reportFileId.split('.')) {
      //   const path = row.reportFileId.split('.')[0] + '.pdf'
      //   this.$router.push(`/report/pdfView/${path}/2`)
      // } else {
      //   const path = row.reportCode + '.pdf'
      //   this.$router.push(`/report/pdfView/${path}/2`)
      // }
    },
    handleDownload(row) {
      var url = this.$store.getters.sysBaseUrl + '/file/report/' + row.reportFileId
      window.open(url)
    },
    handleOldDownload(row) {
      var url = this.$store.getters.sysBaseUrl + '/file/report/' + row.reportCode + '.docx'
      window.open(url)
    },
    handleUpload(row) {
      this.uploadForm.id = row.id
      this.uploadForm.reportCode = row.reportCode
      this.uploadForm.reportFile = ''
      this.fileList = []
      this.uploadVisible = true
    },
    handleSubApprove(row) {
      this.$confirm('确定提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reportServer.reportApproveForUp(qs.stringify({ id: row.id })).then(result => {
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
    handleApprove(row) {
      this.approveForm.id = row.id
      this.approveForm.auditFlag = '1'
      this.approveForm.remark = ''
      this.approveVisible = true
    },
    handleIssue(row) {
      this.issueForm.id = row.id
      this.issueForm.auditFlag = '1'
      this.issueForm.remark = ''
      this.issueVisible = true
    },
    confirmDialog() {
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reportServer.reportApprove(this.approveForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.approveVisible = false
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
    handleUphold() {
      this.logoFileList = []
      this.waterFileList = []
      if (this.$refs.logoImage) {
        this.$refs.logoImage.clearFiles()
      }
      if (this.$refs.waterImage) {
        this.$refs.waterImage.clearFiles()
      }
      this.basicForm = {
        cmaNumber: '',
        cnasNumber: '',
        tel: '',
        fax: '',
        address: '',
        website: '',
        postCode: '',
        logoImageId: '',
        explains: '',
        watermarkImageId: ''
      }
      // TODO 报告基础信息维护
      reportServer.getByOrganId().then(res => {
        if (res.code === 200 && res.result) {
          this.basicForm = res.result
          if (this.basicForm.logoImageId) {
            const img = this.$store.getters.sysBaseUrl + '/reportImg/' + this.basicForm.logoImageId
            this.logoFileList.push({ name: this.basicForm.logoImageId, url: img })
            this.hideLogoUploadEdit = true
          }
          if (this.basicForm.watermarkImageId) {
            const img = this.$store.getters.sysBaseUrl + '/reportImg/' + this.basicForm.watermarkImageId
            this.waterFileList.push({ name: this.basicForm.watermarkImageId, url: img })
            this.hideUploadEdit = true
          }
        }
        this.basicVisible = true
      })
    },
    confirmIssueDialog() {
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reportServer.reportIssue(this.issueForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.issueVisible = false
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
    onUploadChange(file) {
      if (file.status === 'ready') return
      if (file.status === 'success') {
        const res = file.response || {}
        if (res && res.code === 200) {
          this.basicForm.logoImageId = file.response.result
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
          this.hideLogoUploadEdit = true
        } else {
          this.$message.error('上传失败!')
        }
      } else {
        this.$message.error('上传失败!')
      }
    },
    onReportUploadChange(file) {
      if (file.status === 'ready') return
      if (file.status === 'success') {
        const res = file.response || {}
        if (res && res.code === 200) {
          this.uploadForm.reportFile = file.response.result
          this.$message({
            type: 'success',
            message: file.response.message
          })
          this.handleSearch()
          this.uploadVisible = false
        } else {
          this.$message.error('上传失败!')
        }
      } else {
        this.$message.error('上传失败!')
      }
    },
    onWaterUploadChange(file) {
      if (file.status === 'ready') return
      if (file.status === 'success') {
        const res = file.response || {}
        if (res && res.code === 200) {
          this.basicForm.watermarkImageId = file.response.result
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
          this.hideUploadEdit = true
        } else {
          this.$message.error('上传失败!')
        }
      } else {
        this.$message.error('上传失败!')
      }
    },
    handleRemove(file) {
      this.$refs.logoImage.uploadFiles.splice(0, 1)
      this.hideLogoUploadEdit = false
      this.basicForm.logoImage = ''
    },
    handleWaterRemove(file) {
      this.$refs.waterImage.uploadFiles.splice(0, 1)
      this.basicForm.watermarkImageId = ''
      this.hideUploadEdit = false
    },
    handlePictureCardPreview(file) {
      debugger
      this.dialogImageUrl = this.$store.getters.sysBaseUrl + '/reportImg/' + file.name
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isLt1M
    },
    confirmBasicDialog() {
      this.$refs.basicForm.validate(valid => {
        if (valid) {
          reportServer.saveReportBasic(this.basicForm).then(result => {
            if (result.code === 200) {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.basicVisible = false
              this.$refs.logoImage.clearFiles()
              this.$refs.waterImage.clearFiles()
            } else {
              this.$notify({
                title: '失败',
                message: result.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    confirmReportDialog() {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          reportServer.uploadReport(this.uploadForm).then(result => {
            if (result.code === 200) {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.handleSearch()
              this.uploadVisible = false
            } else {
              this.$notify({
                title: '失败',
                message: result.message,
                type: 'error'
              })
            }
          })
        }
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
  .item {
    font-size: 16px;
  }
  ::v-deep .el-card .el-card__header {
    padding: 5px 20px;
    background: #F3F2F2;
  }
   .info-table-new {
    font-size: 14px;
    width: 100%;
    text-align: center;
    margin-top: 10px;
    border-top: 1px solid #ececec;
    border-left: 1px solid #ececec;
    line-height: 35px;
    td {
      border-bottom: 1px solid #ececec;
      border-right: 1px solid #ececec;
      width: 25%;
      height: 35px;
      // &:nth-child(2n + 1) {
      //   width: 25%;
      //   background: #f5f5f5;
      // }
    }
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  /deep/.hide .el-upload--picture-card {
    display: none;
  }
</style>
