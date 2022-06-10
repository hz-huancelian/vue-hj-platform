<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="样品编号:">
            <el-input v-model="searchForm.smapItemId" style="width:165px" placeholder="样品编号" />
          </el-form-item>
          <el-form-item label="检测因子:">
            <el-input v-model="searchForm.factorName" style="width:165px" placeholder="因子名称" />
          </el-form-item>
          <el-form-item label="检测状态:">
            <el-select
              v-model="searchForm.checkStatus"
              clearable
              filterable
              style="width:165px"
              placeholder="检测状态"
            >
              <el-option
                v-for="item in Object.keys(CHECK_STATUS)"
                :key="item"
                :label="CHECK_STATUS[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
            <el-button type="primary" class="iconfont icon-fanhui" @click="goBack"> 返回</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="search-right">
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="checkData"
      stripe
      highlight-current-row
      :header-cell-style="{background:'#ECF3FC'}"
      style="width: 100%"
    >
      <template slot="empty">
        <div class="table_empty">
          <div class="empty_tips">
            <span>
              暂无信息
            </span>
          </div>
        </div>
      </template>
      <el-table-column type="index" width="50" align="center" label="序号" />
      <el-table-column prop="factorName" label="检测因子" width="140px" align="center" />
      <el-table-column prop="sampleNo" label="样品编号" width="160px" align="center" />
      <el-table-column prop="factorPoint" label="采样点位" width="110px" align="center" />
      <el-table-column prop="dayAndCount" label="频次(次/天)" width="120px" align="center" />
      <el-table-column prop="standardName" label="检测标准" width="200px" align="center" />
      <el-table-column prop="checkRes" label="检测结果" min-width="150px" align="center">
        <template slot-scope="{row}">
          <template v-if="row.checkRes && row.checkRes.length >0">
            {{ row.masterRes }}
            <template v-if="row.exponRes!==''&&row.exponRes!==0">×10<sup>{{ row.exponRes }}</sup></template>
            {{ row.unitName && row.unitName!=='无量纲'?' ' + row.unitName:'' }}
          </template>
          <template v-else />
        </template>
      </el-table-column>
      <el-table-column prop="assignUser" label="分析员" align="center" />
      <el-table-column prop="collectTime" label="采样时间" width="160" align="center">
        <template slot-scope="{row}">
          {{ row.collectTime&&row.collectTime.length>0?row.collectTime:row.collectDate }}
        </template>
      </el-table-column>

      <el-table-column prop="storeTime" label="入库时间" width="160" align="center" />
      <el-table-column prop="endDate" label="任务截止时间" width="120px" align="center" />
      <el-table-column prop="dataEntryStep" label="样品归类" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.sampleType ==='1'?'danger':''">
            {{ row.sampleType ==='1'?"样品分包":"样品自检" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="checkStatus" label="检测状态" width="120px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.checkStatus|statusQualityFilter">
            {{ CHECK_STATUS[row.checkStatus] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="190" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.checkStatus>2" type="text" @click="handleDetail(row)">查看</el-button>
          <div v-if="row.checkStatus>2" class="erc-divider-vertical" />
          <el-button type="text" @click="handleLocalDetail(row)">采样记录</el-button>
          <div v-if="row.assignUserId === userId && row.checkStatus==='0'" class="erc-divider-vertical" />
          <el-button v-if="row.assignUserId === userId && row.checkStatus==='0' && row.secdClassName !=='噪声'" type="text" @click="handleApply(row)">申请领样</el-button>
          <div v-if="row.assignUserId === userId && (row.checkStatus==='2' ||row.checkStatus==='6')" class="erc-divider-vertical" />
          <el-button v-if="row.assignUserId === userId && (row.checkStatus==='2' ||row.checkStatus==='6')" type="text" @click="handleSetResult(row)">结果录入</el-button>
          <div v-if="row.assignUserId === userId && row.checkStatus==='3'" class="erc-divider-vertical" />
          <el-button v-if="row.assignUserId === userId && row.checkStatus==='3' " type="text" @click="handleApprove(row.checkFactorId)">提交审核</el-button>
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

    <el-dialog title="检测详情" :visible.sync="detailVisible" width="70%" center top="5vh">
      <div style="width: 700px;margin:0 auto;">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="样品编号:">{{ sampleForm.smapItemId }}</el-form-item>
          <el-form-item label="检测因子:">{{ sampleForm.factorName }}</el-form-item>
          <el-form-item label="检测标准:">{{ sampleForm.standardName }}</el-form-item>
          <el-form-item label="备注:">{{ sampleForm.remark }}</el-form-item>
          <el-form-item label="检测结果:">
            <template v-if="sampleForm.checkRes && sampleForm.checkRes.length > 0">
              {{ sampleForm.factorInfo&&sampleForm.factorInfo.v1?sampleForm.factorInfo.v1:0 }}
              <template v-if="sampleForm.factorInfo&&sampleForm.factorInfo.v2!==''&&sampleForm.factorInfo.v2!==0">
                ×10<sup>{{ sampleForm.factorInfo.v2?Number(sampleForm.factorInfo.v2):0 }}</sup>
              </template>
              {{ sampleForm.unitName && sampleForm.unitName!=='无量纲'?' ' + sampleForm.unitName:'' }}
            </template>
            <template v-else>暂无检测结果</template>
          </el-form-item>
        </el-form>
        <div v-if="sampleForm.subFactors && sampleForm.subFactors.length > 0">
          <el-table
            :data="sampleForm.subFactors"
            border
            style="width:100%;"
            :header-cell-style="{background:'#ECF3FC'}"
          >
            <el-table-column prop="name" label="检测因子" width="130" align="center" />
            <el-table-column prop="name" label="检测结果" align="center">
              <template slot-scope="{row}">
                <template v-if="row.v1">
                  {{ row.v1?row.v1:0 }}×10<sup>{{ row.v2?Number(row.v2):0 }}</sup>{{ sampleForm.unitName }}
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="样品结果录入" :visible.sync="testResultVisible" width="70%" center top="5vh">
      <div style="width: 650px;margin:0 auto;">
        <el-form label-width="100px" label-position="left">
          <el-form-item label="样品编号:">{{ testResultForm.smapItemId }}</el-form-item>
          <el-form-item label="检测因子:">{{ testResultForm.factorName }}</el-form-item>
          <el-form-item label="检测标准:">{{ testResultForm.standardName }}</el-form-item>
          <el-form-item label="检测结果:">
            <el-row>
              <el-col :span="12">
                <el-input v-model="testResultForm.masterRes" placeholder="结果值" oninput="value=value.replace(/[^\d\.]/g,'')">
                  <template slot="append">E</template>
                </el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="testResultForm.subRes" placeholder="幂数" oninput="value=value.replace(/[^\d\-]/g, '')">
                  <template slot="append">{{ testResultForm.unitName }}</template>
                </el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="height:24px;font-size:14px;">
                <span style="color:red">例:3.45E2=3.45×10²  ;  234E0=234 ; 1.62E-3=1.62×10⁻³</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="height:24px;font-size:14px;">
                <span style="color:red">无子因子的：输入0代表未检出</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="height:24px;font-size:14px;">
                <span style="color:red">有子因子的：输入0代表未检出，不填代表未检查此项</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="testResultForm.remark" type="textarea" maxlength="50" show-word-limit placeholder="备注信息" :rows="3" />
          </el-form-item>
        </el-form>
        <div v-if="subFactorData && subFactorData.length > 0">
          <el-table
            :data="subFactorData"
            border
            highlight-current-row
            :header-cell-style="{background:'#ECF3FC'}"
          >
            <el-table-column prop="name" label="检测因子" width="130" align="center" />
            <el-table-column label="检测结果" align="center">
              <template slot-scope="{row}">
                <el-row>
                  <el-col :span="12">

                    <el-input v-model="row.v1" placeholder="结果值" oninput="value=value.replace(/[^\d\.]/g,'')">
                      <template slot="append">E</template>
                    </el-input>
                  </el-col>
                  <el-col :span="12">

                    <el-input v-model="row.v2" placeholder="幂数" oninput="value=value.replace(/[^\d\-]/g,'')">
                      <template slot="append">{{ testResultForm.unitName }}</template>
                    </el-input>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="testResultVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmChecks">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="currentSample + '-详情'" :visible.sync="sampleVisible" width="85%" center top="5vh">
      <el-form :model="sampleDetailForm" label-width="180px" label-position="right">
        <el-card style="margin-top: 5px;padding-bottom: 20px;">
          <div slot="header" class="clearfix">
            <div style="width: 3px;margin:auto 3px; height: 20px;background-color:steelblue;" />
            <span>基础信息</span>
          </div>
          <el-col :span="16" style="height:32px;">
            <el-form-item label-width="100" label="检测因子:">
              <span class="showTile">{{ sampleDetailForm.factorName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="height:32px;">
            <el-form-item label-width="100" label="点位:">
              <span class="showTile">{{ sampleDetailForm.factorPoint }}</span>
            </el-form-item>
          </el-col>
          <!--动态二级类别信息-->
        </el-card>
        <el-card v-for="item in sampleSecInfo" :key="item.groupKey" style="margin-top: 5px;padding-bottom: 20px;">
          <div v-if="item.groupName && item.groupName != ''" slot="header" class="clearfix">
            <div style="width: 3px;margin:auto 3px; height: 20px;background-color:steelblue;" />
            <span>{{ item.groupName }}</span>
          </div>
          <el-col v-for="(sitem,index) in item.params" :key="index" :span="8" style="height:32px;">
            <el-form-item label-width="100">
              <span slot="label">{{ sitem.name }}:</span>
              <span class="showTile">{{ sitem.value?sitem.value.toString():'' }}</span>
            </el-form-item>
          </el-col>
        </el-card>

        <el-card v-if="sampleDataInfo && sampleDataInfo.length > 0" style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <div style="width: 3px;margin:auto 3px; height: 20px;background-color:steelblue;" />
            <span>现场检测因子信息</span>
          </div>
          <el-table :data="sampleDataInfo" stripe>
            <el-table-column prop="factorName" label="检测因子项目" />
            <el-table-column label="因子结果集">
              <template slot-scope="{row}">
                <template v-if="row.measuredForm">
                  {{ '第一值: ' +row.measuredForm.firstVal + ' 第二值: ' + row.measuredForm.secondVal + " 均值: " + row.measuredForm.avgVal }}
                </template>
                <template v-else>
                  {{ row.factorData?row.factorData:'' }}
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="checkEquipment" label="检测设备">
              <template slot-scope="{row}">
                {{ row.checkEquipment&&row.checkEquipment.length>0?row.checkEquipment.replaceAll('^_^',' '):'' }}
              </template>
            </el-table-column>
            <el-table-column prop="theoreticalVal" label="理论值" />
            <el-table-column prop="groundConditions" label="测定值" />
          </el-table>
        </el-card>

        <el-card style="margin-top: 5px">
          <div slot="header" class="clearfix">
            <div style="width: 3px;margin:auto 3px; height: 20px;background-color:steelblue;" />
            <span>现场信息</span>
          </div>
          <el-col :span="12">
            <el-form-item label-width="100" label="采样地址:">
              <span class="showTile">{{ sampleDetailForm.sampleDataVo.collectLocation }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="100" label="采样日期:">
              <span class="showTile">{{ sampleDetailForm.sampleDataVo.collectDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="100" label="现场图片:">
              <div v-if="sampleImageList && sampleImageList.length > 0" class="demo-image__lazy">
                <el-image v-for="(url, index) in sampleImageList" :key="index" :src="url" :preview-src-list="sampleImageList" style="width: 100px; height: 100px;margin-left: 10px;" />
              </div>
            </el-form-item>
          </el-col>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sampleVisible=false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as stockServer from '@/api/stock'
import * as checkServer from '@/api/check'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import qs from 'qs'
const CHECK_STATUS = {
  '0': '待领样',
  '1': '领样已申请',
  '2': '待检测',
  '3': '已录入',
  '4': '待审核',
  '5': '审核通过',
  '6': '审核失败'
}
export default {
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      if (status === '0') {
        return 'info'
      } else if (status === '2') {
        return ''
      } else if (status === '1' || status === '4') {
        return ''
      } else if (status === '3' || status === '5') {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      CHECK_STATUS,
      checkData: [],
      searchForm: {
        smapItemId: '',
        factorName: '',
        checkStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      detailVisible: false,
      sampleForm: {
        factorInfo: {},
        subFactors: {}
      },
      subSampleData: [],
      testResultVisible: false,
      testResultForm: {
        checkFactorId: '',
        checkRes: '',
        checkSubRes: '',
        remark: ''
      },
      subFactorData: [],
      sampleVisible: false,
      sampleDetails: [],
      sampleDetailForm: {
        factorName: '',
        factorPoint: '',
        secdClassName: '',
        factorDataVos: [],
        sampleDataVo: {
          collectDate: '',
          collectLocation: '',
          imageList: [],
          sampleData: [],
          specialNote: ''
        },
        sampleJobVo: {
          projectName: '',
          jobRemark: ''
        }
      },
      currentSample: '',
      sampleImageList: [],
      sampleImage: '',
      sampleDataInfo: [],
      sampleSecInfo: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created() {
    if (this.$route.params.checkTaskId) {
      this.searchForm.checkTaskId = this.$route.params.checkTaskId
      this.handleSearch()
    }
  },
  methods: {
    handleSearch() {
      if (this.searchForm.checkTaskId) {
        checkServer.findCheckTaskDetailByCondition(this.searchForm).then(res => {
          if (res.code === 200) {
            this.checkData = res.result.records.map(i => {
              if (i.checkRes && i.checkRes !== '') {
                const ob = JSON.parse(i.checkRes)
                this.$set(i, 'masterRes', ob.v1 ? ob.v1 : '')
                this.$set(i, 'exponRes', ob.v2 ? ob.v2 : '')
              } else {
                this.$set(i, 'masterRes', '')
                this.$set(i, 'exponRes', '')
              }
              return i
            }) || []
            this.total = res.result.total
          }
        })
      }
    },
    handleDetail(row) {
      this.sampleForm = { ...row }
      if (row.checkSubRes && row.checkSubRes.length > 0) {
        const subArray = JSON.parse(row.checkSubRes)
        this.$set(this.sampleForm, 'subFactors', subArray)
      }
      if (row.checkRes && row.checkRes.length > 0) {
        const factorInfo = JSON.parse(row.checkRes)
        this.$set(this.sampleForm, 'factorInfo', factorInfo)
      }
      this.detailVisible = true
    },
    handleLocalDetail(row) {
      this.currentSample = row.sampleNo
      this.sampleImageList = []
      this.sampleDataInfo = []
      this.sampleSecInfo = []
      this.sampleImage = ''
      var baseUrl = this.$store.getters.sysBaseUrl + '/cyImg/'
      stockServer.getSampleDataBySampItemId(row.smapItemId).then(res => {
        if (res.code === 200 && res.result) {
          this.sampleDetailForm = res.result || {}
          this.$nextTick(() => {
            // 提取图片
            this.sampleImageList = res.result.sampleDataVo.imageList.map(i => {
              return baseUrl + i
            })
            // 二级类别
            this.sampleSecInfo = res.result.sampleDataVo.sampleData || []

            var nfactorDataVos = res.result.factorDataVos.filter(i => (i.dataEntryStep === '1' && !i.checkStandardId.indexOf('100004-') > -1)) || []
            // 因子
            this.sampleDataInfo = nfactorDataVos.map(i => {
              if (i.measuredFormVal && i.measuredFormVal.length > 0) {
                this.$set(i, 'measuredForm', JSON.parse(i.measuredFormVal))
              }
              return i
            })
          })
          this.sampleVisible = true
        }
      })
    },
    handleApply(row) {
      this.$confirm('确定申请领样?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkServer.sampDrawApply(qs.stringify({ checkFactorId: row.checkFactorId })).then(res => {
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
    handleSetResult(row) {
      this.testResultForm = { ...row }
      checkServer.findSubFactorByCheckStandId(row.checkStandardId).then(res => {
        this.subFactorData = []
        if (res.code === 200 && res.result) {
          this.subFactorData = res.result.map(i => {
            return {
              name: i,
              v1: '',
              v2: ''
            }
          }) || []
        }
        this.testResultVisible = true
      })
    },
    handleApprove(id) {
      this.$confirm('确认提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkServer.submitCheckFactor({ 'checkFactorId': id }).then(res => {
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
      })
    },
    confirmChecks() {
      this.$confirm('确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data
        if (this.subFactorData && this.subFactorData.length > 0) {
          data = {
            checkFactorId: this.testResultForm.checkFactorId,
            checkRes: JSON.stringify({ 'v1': this.testResultForm.masterRes, 'v2': this.testResultForm.subRes }),
            checkSubRes: JSON.stringify(this.subFactorData),
            remark: this.testResultForm.remark
          }
        } else {
          data = {
            checkFactorId: this.testResultForm.checkFactorId,
            checkRes: JSON.stringify({ 'v1': this.testResultForm.masterRes, 'v2': this.testResultForm.subRes }),
            remark: this.testResultForm.remark
          }
        }
        checkServer.saveCheckFactorData(data).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
            this.testResultVisible = false
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: res.message,
              type: 'error'
            })
          }
        })
      })
    },

    goBack() {
      this.$router.back()
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
  .block-flex {
    position: relative;
    display: flex;
    &>div{
      border: 1px solid #B7B7B7;
      width: 100px;
      margin: 0;
      line-height: 30px;
      text-align: center;
    }
    &>div:first-child {
      background: #B7B7B7;
    }
  }
  .card-left {
    width: 100%;
    min-height: 200px;
    max-height: 400px;
  }
  .card-right {
    width: 100%;
    min-height: 200px;
    max-height: 400px;
  }
  .el-card {
    overflow: auto;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    color:unset
  }
    .demo-image__lazy {
    height: 300px;
    overflow-y: auto;
  }
  .demo-image__lazy .el-image {
    display: block;
    max-height: 300px;
    width: 100%;
    margin-bottom: 10px;
  }
  .clearfix {
    line-height: 40px;
    display: flex;
  }
</style>
