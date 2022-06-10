<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="18">
          <el-form-item label="设备编号:">
            <el-input v-model="searchForm.equipmentNumber" style="width:165px" placeholder="设备编号" />
          </el-form-item>
          <el-form-item label="设备名称:">
            <el-input v-model="searchForm.equipmentName" style="width:165px" placeholder="设备名称" />
          </el-form-item>
          <el-form-item label="设备类别:">
            <el-select v-model="searchForm.equipmentFirstType" clearable style="width:160px" filterable placeholder="设备类别" @change="getSearchSecdInfo">
              <el-option
                v-for="item in devTypeArray"
                :key="item.dictKey"
                :label="item.dictVal"
                :value="item.dictKey"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="searchForm.equipmentFirstType != '100404'" label="检测类别:">
            <el-select v-model="searchForm.equipmentSecondType" clearable style="width:160px" filterable placeholder="检测类别">
              <el-option
                v-for="item in secOtherArray"
                :key="item.dictKey"
                :label="item.dictVal"
                :value="item.dictKey"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch"> 查询</el-button>
            <!-- <el-button type="primary" @click="handleDownload"> 导出</el-button> -->
          </el-form-item>
        </el-col>
        <el-col :span="6" class="search-right">
          <el-button type="text" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          <el-button type="text" size="small" icon="el-icon-upload2" @click="handleUpload">批量导入</el-button>
          <el-button type="text" size="small" icon="el-icon-download" @click="handleDownload">导出</el-button>
          <el-button type="text" size="small" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      stripe
      border
      :data="devData"
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
      <el-table-column prop="equipmentNumber" label="设备编号" align="center" />
      <el-table-column prop="equipmentName" label="设备名称" align="center" />
      <el-table-column prop="equipmentFirstTypeVal" label="设备类别" align="center" />
      <el-table-column prop="equipmentSecondTypeVal" label="检测类别" align="center" />
      <el-table-column prop="equipmentBrand" label="设备品牌" align="center" />
      <el-table-column prop="equipmentModel" label="设备型号" align="center" />
      <el-table-column prop="checkDate" label="上次检定日期" align="center" />
      <el-table-column prop="checkCircle" label="检定周期" align="center">
        <template slot-scope="{row}">
          {{ CHECK_STATUS[row.checkCircle] }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center" />

      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)"> 编辑</el-button>
          <div class="erc-divider-vertical" />
          <el-button type="text" @click="handleDelete(scope.row.id)"> 删除</el-button>
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

    <el-dialog :title="titleMap[devDialogStatus]" :visible.sync="devDialogVisible" width="65%" center :close-on-click-modal="false">
      <el-form ref="devForm" :model="devForm" :rules="devRules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="equipmentNumber" label="设备编号:">
              <el-input v-model="devForm.equipmentNumber" placeholder="设备编号" maxlength="25" style="width: 80%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="equipmentName">
              <span slot="label">
                设备名称
                <el-popover
                  placement="top-start"
                  title=""
                  width="300"
                  trigger="hover"
                  content="检测机构内部对该设备的命名：如气相色谱仪、液相色谱仪、便携式PH仪"
                >
                  <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                </el-popover>
                :
              </span>
              <el-input v-model="devForm.equipmentName" placeholder="设备名称不能为空" style="width: 80%;" maxlength="25" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="equipmentFirstType" label="设备类别:">
              <el-select v-model="devForm.equipmentFirstType" placeholder="设备类别不能为空" style="width: 80%;" @change="getSecdEquipment">
                <el-option
                  v-for="item in devTypeArray"
                  :key="item.dictKey"
                  :label="item.dictVal"
                  :value="item.dictKey"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="devForm.equipmentFirstType !== '100404'" prop="equipmentSecondType" label="检测类别:">
              <el-select v-model="devForm.equipmentSecondType" placeholder="检测类别不能为空" style="width: 80%;">
                <el-option
                  v-for="item in secOtherArray"
                  :key="item.dictKey"
                  :label="item.dictVal"
                  :value="item.dictKey"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="equipmentBrand" label="设备品牌:">
              <el-input v-model="devForm.equipmentBrand" placeholder="设备品牌" style="width: 80%;" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="equipmentModel" label="设备型号:">
              <el-input v-model="devForm.equipmentModel" placeholder="设备型号" style="width: 80%;" maxlength="10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="checkDate" label="上次检定日期:">
              <el-date-picker
                v-model="devForm.checkDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="上次检定日期"
                style="width: 80%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="checkCircle" label="检定周期:">
              <el-select v-model="devForm.checkCircle" clearable style="width:80%;" filterable placeholder="检定周期">
                <el-option
                  v-for="item in Object.keys(CHECK_STATUS)"
                  :key="item"
                  :label="CHECK_STATUS[item]"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="remark" label="备注:">
              <el-input v-model="devForm.remark" type="textarea" :rows="3" placeholder="备注" style="width: 92%;" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="devDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog title="文件上传" :visible.sync="uploadVisible" center>
      <el-form>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="/api/dataImport/uploadEquipent"
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

    <el-dialog title="批量导入设备" :visible.sync="uploadVisible" append-to-body width="53%">
      <div class="block">
        <el-timeline>
          <el-timeline-item size="large">
            <span slot="dot" class="time-dot">
              1
            </span>
            <el-row>
              <el-col :span="24">
                下载模板，批量填写设备信息
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
                上传填写好的设备信息表格
              </el-col>
            </el-row>
            <el-row style="padding-top:10px;">
              <el-col :span="24">
                <el-upload
                  class="upload-demo"
                  action="/api/dataImport/uploadEquipent"
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
            <span style="color:red; font-size: 13px">备注：批量导入设备功能，只会将上传的设备信息列表内的设备新增到系统内，不对原有设备信息做任何替换或修改。

            </span>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import * as eqServer from '@/api/equipment'
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
  '5': '三年',
  '6': '无需检定'
}
import * as dictServer from '@/api/dict'
export default {
  components: { Pagination },
  data() {
    return {
      CHECK_STATUS,
      DEV_STATUS,
      USE_STATUS,
      searchForm: {
        equipmentNumber: '',
        equipmentName: '',
        equipmentFirstType: '',
        equipmentSecondType: '',
        equipmentStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      devData: [],
      devDialogStatus: 'create',
      devDialogVisible: false,
      titleMap: {
        edit: '修改设备',
        create: '新增设备'
      },
      devForm: {
        id: '',
        equipmentNumber: '',
        equipmentName: '',
        equipmentFirstType: '',
        equipmentSecondType: '',
        equipmentBrand: '',
        equipmentModel: '',
        checkCircle: '',
        lastTime: '',
        remark: ''
      },
      devRules: {
        equipmentNumber: [{ required: true, message: '请录入设备编号', trigger: 'blur' }],
        equipmentName: [{ required: true, message: '请录入设备名称', trigger: 'blur' }],
        equipmentFirstType: [{ required: true, message: '请选择检测对象', trigger: 'change' }],
        equipmentSecondType: [{ required: true, message: '请选择检测类别', trigger: 'change' }],
        equipmentBrand: [{ required: true, message: '请录入设备品牌', trigger: 'blur' }],
        equipmentModel: [{ required: true, message: '请录入设备型号', trigger: 'blur' }],
        checkCircle: [{ required: true, message: '请选择检定周期', trigger: 'change' }]
      },
      classArray: [],
      secClassArray: [],
      secOtherArray: [],
      devTypeArray: [], // 查询一类
      classId: '',
      uploadVisible: false,
      excelFileList: [],
      fileResult: ''
    }
  },
  created() {
    // this.getDicKey('devTypeArray', 1004)
    // this.getDicKey('secOtherArray', 1005)
    this.getFirstEquipment()
    this.getClassList()
    this.handleSearch()
  },
  methods: {
    getDicKey(type, code) {
      dictServer.getDicKey(code).then(result => {
        if (result.code === 200) {
          this[type] = result.result
        }
      })
    },
    getFirstEquipment() {
      eqServer.findEquipmentFirstType().then(result => {
        this.devTypeArray = result.result || []
        this.classArray = result.result || []
      })
    },
    getSecdEquipment(val) {
      this.secOtherArray = []
      this.secClassArray = []
      this.devForm.equipmentSecondType = ''
      if (val && val !== '100404') {
        eqServer.findEquipmentSecondType(val).then(result => {
          this.secOtherArray = result.result || []
          this.secClassArray = result.result || []
        })
      }
    },
    getSearchSecdInfo(val) {
      this.secOtherArray = []
      this.searchForm.equipmentSecondType = ''
      if (this.searchForm.equipmentFirstType !== '100404' && val) {
        eqServer.findEquipmentSecondType(val).then(result => {
          this.secOtherArray = result.result || []
        })
      }
    },
    getClassList() {
      dictServer.findFstClasses().then(res => {
        this.classArray = res.result || []
      })
    },
    findSecClass(val) {
      this.secdClassId = ''
      dictServer.findSecdClassByClassId(val).then(res => {
        this.secClassArray = res.result || []
      })
    },
    handleSearch() {
      eqServer.findByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.devData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    handleAdd() {
      this.clearForm()
      this.secOtherArray = []
      this.devDialogStatus = 'create'
      this.devDialogVisible = true
    },
    handleUpdate(row) {
      this.clearForm()
      this.devForm.id = row.id
      this.devForm.equipmentNumber = row.equipmentNumber
      this.devForm.equipmentName = row.equipmentName
      this.devForm.equipmentFirstType = row.equipmentFirstType
      this.devForm.equipmentSecondType = row.equipmentSecondType
      this.devForm.equipmentBrand = row.equipmentBrand
      this.devForm.equipmentModel = row.equipmentModel
      this.devForm.checkCircle = row.checkCircle
      this.devForm.checkDate = row.checkDate
      this.devForm.remark = row.remark
      // 获取二级类别字典
      if (row.equipmentFirstType && row.equipmentFirstType !== '100404') {
        eqServer.findEquipmentSecondType(row.equipmentFirstType).then(result => {
          this.secOtherArray = result.result || []
          this.secClassArray = result.result || []
          this.$nextTick(() => {
            this.devForm.equipmentSecondType = row.equipmentSecondType
          })
        })
      }

      this.devDialogStatus = 'edit'
      this.devDialogVisible = true
    },
    clearForm() {
      this.devForm = {
        id: '',
        equipmentNumber: '',
        equipmentName: '',
        equipmentFirstType: '',
        equipmentSecondType: '',
        equipmentBrand: '',
        equipmentModel: '',
        checkCircle: '',
        checkDate: '',
        remark: ''
      }
    },
    confirmDialog() {
      if (this.devDialogStatus === 'create') {
        eqServer.saveEquipment(this.devForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.devDialogVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      } else {
        eqServer.updateEquipment(this.devForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.devDialogVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      }
    },
    handleDelete(id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        eqServer.delEquipment(id).then(result => {
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

    handleDownloadTep() {
      const url = this.$store.getters.sysBaseUrl + '/api/dataImport/downloadEquipmentExcel'
      window.open(url)
    },
    handleDownload() {
      const url = this.$store.getters.sysBaseUrl + '/api/dataImport/exportEquipment?equipmentNumber=&equipmentName=&equipmentFirstType=&equipmentSecondType='
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
</style>
