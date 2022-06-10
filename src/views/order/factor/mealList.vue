<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="套餐名称:">
            <el-input v-model="searchForm.groupName" style="width:180px" placeholder="套餐名称" />
          </el-form-item>
          <el-form-item label="套餐类型:">
            <el-select v-model="searchForm.groupType" clearable style="width: 100%;" placeholder="套餐类型">
              <el-option value="0" label="自由因子套餐" />
              <el-option value="1" label="同系因子套餐" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="search-right">
          <el-button type="text" icon="el-icon-plus" @click="handleCreate">新增</el-button>
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      stripe
      :data="factorGroupData"
      highlight-current-row
      :header-cell-style="{background:'#ECF3FC'}"
      border
      style="width: 100%"
    >
      <template slot="empty">
        <div class="table_empty">
          <div class="empty_tips">
            <span>
              暂无套餐,
            </span>
            <el-button type="text" size="small" style="font-size:14px;" @click="handleCreate">新建因子套餐</el-button>
          </div>
        </div>
      </template>
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column prop="groupName" label="套餐名称" align="center" />
      <el-table-column label="套餐类型" align="center" width="130px">
        <template slot-scope="{row}">
          {{ row.groupType === '0'?"自由因子套餐":"同系因子套餐" }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="套餐说明" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="groupDesc" label="检测因子" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="160" align="center" />

      <el-table-column fixed="right" align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row.groupId)"> 查看</el-button>
          <div class="erc-divider-vertical" />
          <el-button type="text" @click="handleUpdate(scope.row)"> 编辑</el-button>
          <div class="erc-divider-vertical" />
          <el-button type="text" @click="handleDelete(scope.row.groupId)">删除</el-button>
          <div class="erc-divider-vertical" />
          <el-button type="text" @click="handleCopy(scope.row.groupId)">复制</el-button>
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

    <el-dialog :visible.sync="choseMealVisible" top="35vh" width="400px">

      <span slot="title">
        选择新增套餐类型
        <el-popover
          placement="top-start"
          title=""
          width="500"
          trigger="hover"
        >
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同系因子套餐：可以将某个检测标准中可同时检测的多个因子进行打包（要求标准号相同）
            如： 苯系物、挥发性卤代烃、有机氯农药等，并可对该同系因子套餐进行总价设定，
            若该同系因子套餐中所含因子单价合计大于等于设定的总价，则以设定的总价作为该套餐的报价，
            若小于则以所含因子单价合计作为该套餐的报价。同时报价时可以选择该套餐内的部分或全部因子作为一个单因子属性进行点位和频次的设置，
            在采样分配时该套餐内的因子无需进行合样操作，实验室分析时该套餐内的因子作为一组进行实验室数据录入。
            <br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;自由因子套餐：该类型套餐可用于具有固定或相似监测方案的项目，可自由选择因子库中的因子进行组合，后续套餐内所选因子会分拆独立出来，后续流程与因子库中的其他因子无异。
          </div>
          <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
        </el-popover>
      </span>
      <ul class="icon-list">
        <li @click="handleSameCreate">
          <span>
            <svg-icon icon-class="dcqrs" />
            <span class="icon-name">同系因子套餐</span>
          </span>
        </li>
        <li @click="handleFreeCreate">
          <span>
            <svg-icon icon-class="ddrw" />
            <span class="icon-name">自由因子套餐</span>
          </span>
        </li>
      </ul>
    </el-dialog>

    <el-dialog :title="titleMap[factorGroupDialogStatus]" :visible.sync="factorGroupDialogVisible" fullscreen :modal-append-to-body="false" :before-close="handleDialogClose" center>
      <el-card shadow="never">
        <div slot="header">
          <span>套餐基础信息<i class="el-input__icon" /></span>
        </div>
        <el-form ref="factorGroupForm" :model="factorGroupForm" inline label-width="90px">
          <el-form-item prop="groupName" label="套餐名称:">
            <el-input v-model="factorGroupForm.groupName" placeholder="套餐名称" style="width: 250px;" maxlength="10" show-word-limit />
          </el-form-item>
          <el-form-item prop="authType" label="认证类型:">
            <el-select v-model="factorGroupForm.authType" style="width: 250px;" placeholder="检测类型" :disabled="factorGroupDialogStatus==='edit'" @change="checkAutype">
              <el-option value="0" label="CMA" />
              <el-option value="1" label="CNAS" />
            </el-select>
          </el-form-item>
          <el-form-item prop="remark" label="套餐说明:">
            <el-input v-model="factorGroupForm.remark" placeholder="套餐说明" type="textarea" :rows="3" maxlength="50" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never" style="margin-top: 10px">
        <div slot="header">
          <span>待选因子<i class="el-input__icon" /></span>
        </div>
        <factor-list :auth-type="factorGroupForm.authType" :chose-row="currentRow" @pageChose="handleChose" />
      </el-card>
      <el-card shadow="never" style="margin-top: 10px">
        <div slot="header">
          <span>已选因子<i class="el-input__icon" /></span>
        </div>
        <el-table
          :data="factorChoseData"
          size="small"
          stripe
          highlight-current-row
          max-height="400"
          :header-cell-style="{background:'#ECF3FC'}"
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
          <el-table-column prop="className" label="检测对象" min-width="100" align="center" />
          <el-table-column prop="factorName" label="检测因子" align="center" />
          <el-table-column prop="standardNo" label="标准号" align="center" />
          <el-table-column prop="standardName" label="标准名称" min-width="160" align="center" />
          <el-table-column prop="analysisMethod" label="分析方法" align="center" />
          <el-table-column prop="analysisMethod" label="标准有效性" align="center">
            <template slot-scope="{row}">
              {{ STOKEN_STUTS[row.methodStatus] }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="检测费用" align="center" />
          <el-table-column prop="cmaFlg" label="CMA" width="60" align="center">
            <template slot-scope="{row}">
              <el-tag :type="row.cmaFlg==='1'?'success':'danger'">{{ row.cmaFlg==='1'?'Y':'N' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cnasFlg" label="CNAS" width="60" align="center">
            <template slot-scope="{row}">
              <el-tag :type="row.cnasFlg==='1'?'success':'danger'">{{ row.cnasFlg==='1'?'Y':'N' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="extAssistFlg" label="检测能力" width="80" align="center">
            <template slot-scope="{row}">
              <el-tag :type="(row.extAssistFlg&&row.extAssistFlg==='0')?'success':'danger'">{{ (row.extAssistFlg&&row.extAssistFlg==='0')?'有':'无' }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRowDel(scope.row,scope.$index)"> 删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="factorGroupDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="同系因子套餐" :visible.sync="factorSameVisible" fullscreen :modal-append-to-body="false" :before-close="handleSameDialogClose" center>
      <el-card shadow="never">
        <div slot="header">
          <span>套餐基础信息<i class="el-input__icon" /></span>
        </div>
        <el-form ref="factorGroupForm" :model="factorGroupForm" inline label-width="90px">
          <el-form-item prop="groupName" label="套餐名称:">
            <el-input v-model="factorGroupForm.groupName" placeholder="同系套餐名称" style="width: 250px;" maxlength="10" show-word-limit />
          </el-form-item>
          <el-form-item prop="groupCost" label="套餐价格:">
            <el-input v-model="factorGroupForm.groupCost" type="number" placeholder="套餐价格" style="width: 250px;" />
          </el-form-item>

          <el-form-item prop="remark" label="套餐说明:">
            <el-input v-model="factorGroupForm.remark" placeholder="套餐说明" type="textarea" :rows="3" maxlength="50" show-word-limit />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never" style="margin-top: 10px">
        <div slot="header">
          <span>待选因子<i class="el-input__icon" /></span>
        </div>
        <factor-same-list :clear-type="cleanAttr" :chose-row="currentRow" @pageChose="handleSameChose" />
      </el-card>
      <el-card shadow="never" style="margin-top: 10px">
        <div slot="header">
          <span>已选因子<i class="el-input__icon" /></span>
        </div>
        <el-table
          :data="factorChoseData"
          size="small"
          stripe
          highlight-current-row
          max-height="400"
          :header-cell-style="{background:'#ECF3FC'}"
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
          <el-table-column prop="className" label="检测对象" width="80" align="center" />
          <el-table-column prop="factorName" label="检测因子" align="center" />
          <el-table-column prop="standardNo" label="标准号" align="center" />
          <el-table-column prop="standardName" label="标准名称" min-width="160" align="center" />
          <el-table-column prop="analysisMethod" label="分析方法" align="center" />
          <el-table-column prop="analysisMethod" label="标准有效性" align="center">
            <template slot-scope="{row}">
              {{ STOKEN_STUTS[row.methodStatus] }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="检测费用" align="center" />
          <el-table-column prop="cmaFlg" label="CMA" width="60" align="center">
            <template slot-scope="{row}">
              <el-tag :type="row.cmaFlg==='1'?'success':'danger'">{{ row.cmaFlg==='1'?'Y':'N' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cnasFlg" label="CNAS" width="60" align="center">
            <template slot-scope="{row}">
              <el-tag :type="row.cnasFlg==='1'?'success':'danger'">{{ row.cnasFlg==='1'?'Y':'N' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="extAssistFlg" label="检测能力" width="80" align="center">
            <template slot-scope="{row}">
              <el-tag :type="(row.extAssistFlg&&row.extAssistFlg==='0')?'success':'danger'">{{ (row.extAssistFlg&&row.extAssistFlg==='0')?'有':'无' }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRowDel(scope.row,scope.$index)"> 删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="factorSameVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="套餐详情" :visible.sync="factorGroupVisible" width="75%" top="5vh">
      <el-table :data="showGroupData" stripe highlight-current-row>
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="className" label="检测对象" align="center" />
        <el-table-column prop="secdClassName" label="检测类别" align="center" />
        <el-table-column prop="factorName" label="检测因子" align="center" />
        <el-table-column prop="standardName" label="检测标准" min-width="160" align="center" />
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
            <el-tag :type="(row.extAssistFlg&&row.extAssistFlg==='0')?'success':'danger'">{{ (row.extAssistFlg&&row.extAssistFlg==='0')?'有':'无' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import * as factorServer from '@/api/factor'
import * as dictServer from '@/api/dict'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import FactorList from '@/components/FactorList'
import FactorSameList from '@/components/FactorSameList'
import { uuid } from 'vue-uuid'
const STOKEN_STUTS = {
  '0': '现行',
  '1': '自定义标准',
  '2': '试行'
}
export default {
  components: { Pagination, FactorList, FactorSameList },
  data() {
    debugger
    return {
      STOKEN_STUTS,
      factorGroupData: [],
      searchForm: {
        groupName: '',
        groupType: '',
        authType: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      titleMap: {
        edit: '修改套餐',
        create: '新增套餐'
      },
      factorGroupForm: {
        groupId: '',
        groupName: '',
        authType: '0',
        groupType: '',
        groupCost: '',
        remark: '',
        factorStandardIds: []
      },
      factorGroupRules: {
        groupName: [{ required: true, message: '套餐名称', trigger: 'blur' }]
      },
      factorGroupDialogStatus: 'create',
      factorGroupDialogVisible: false,
      factorGroupVisible: false,
      factorChoseData: [],
      showGroupData: [],
      secdItems: {},
      currentRow: {},
      choseMealVisible: false,
      factorSameVisible: false,
      cleanAttr: ''
    }
  },
  created() {
    this.getFactorDict()
    this.handleSearch()
  },
  methods: {
    getFactorDict() {
      dictServer.findTreeClasses().then(res => {
        if (res.code === 200 && res.result) {
          var resMap = new Map()
          res.result.forEach(i => {
            resMap.set(i.id, i.children)
          })
          console.log(resMap)

          this.secdItems = resMap
        }
      })
    },
    handleSearch() {
      factorServer.findPageByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.factorGroupData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    // 重置
    handleCreate() {
      this.choseMealVisible = true
    },
    // 重置
    handleFreeCreate() {
      this.choseMealVisible = false
      this.clearForm()
      this.cleanAttr = uuid.v4().replaceAll('-', '')
      this.factorGroupForm.groupType = '0'
      this.factorGroupDialogStatus = 'create'
      this.factorGroupDialogVisible = true
      Object.assign({ classId: '', factorName: '', authType: '', pageNumber: 1, pageSize: 10 }, this.$options.data().innerSearchForm)
    },
    handleSameCreate() {
      this.clearForm()
      this.factorGroupDialogStatus = 'create'
      this.cleanAttr = uuid.v4().replaceAll('-', '')
      this.factorGroupForm.groupType = '1'
      this.factorSameVisible = true
      Object.assign({ classId: '', factorName: '', authType: '', pageNumber: 1, pageSize: 10 }, this.$options.data().innerSearchForm)
    },
    handleUpdate(row) {
      this.factorGroupDialogStatus = 'edit'
      this.factorGroupForm.groupId = row.groupId
      this.factorGroupForm.groupName = row.groupName
      this.factorGroupForm.groupType = row.groupType
      this.factorGroupForm.groupCost = row.groupCost ? row.groupCost : ''
      this.factorGroupForm.authType = row.authType
      this.factorGroupForm.remark = row.remark
      if (row.groupType === '0') { // 自由套餐
        this.getFactorChoses(row.groupId)
      } else { // 同系套餐
        this.getFactorSameChoses(row.groupId)
      }
      this.$store.dispatch('user/resetCompForm', '1')
    },
    getFactorChoses(groupId) {
      factorServer.findCheckStandardsByGroupId(groupId).then(res => {
        if (res.code === 200) {
          this.factorChoseData = res.result || []
        }
        this.factorGroupDialogVisible = true
      })
    },
    getFactorSameChoses(groupId) {
      factorServer.findCheckStandardsByGroupId(groupId).then(res => {
        if (res.code === 200) {
          this.factorChoseData = res.result || []
        }
        this.factorSameVisible = true
      })
    },
    confirmDialog() {
      if (!this.factorGroupForm.groupName || this.factorChoseData.length <= 0) {
        this.$message.warning('套餐名称、因子项不能为空')
        return
      }
      const oo = this.factorChoseData.find(i => i.secdClassId)
      if (!oo) {
        this.$message.warning('二级类别不能为空')
        return
      }
      if (this.factorGroupForm.groupType === '1') {
        const checks = []
        this.factorChoseData.forEach(e => {
          const fas = checks.find(f => f.standardNo === e.standardNo)
          if (!fas) {
            checks.push(e)
          }
        })
        if (checks.length > 1) {
          this.$message.error('同系套餐只能针对一个标准号配置')
          return
        }
      }
      if (this.factorChoseData.length <= 1) {
        this.$message.error('同系套餐因子必须超过1个')
        return
      }
      if (this.factorGroupDialogStatus === 'create') {
        this.confirmCreate()
      } else {
        this.confirmUpdate()
      }
    },
    confirmCreate() {
      var totalPrice = 0
      const data = {
        groupName: this.factorGroupForm.groupName,
        remark: this.factorGroupForm.remark,
        authType: this.factorGroupForm.authType,
        groupType: this.factorGroupForm.groupType,
        groupCost: this.factorGroupForm.groupCost !== '' ? this.factorGroupForm.groupCost : '',
        factorStandardIds: this.factorChoseData.map(i => {
          totalPrice = parseFloat(totalPrice + i.price)
          return {
            checkStandardId: i.standardCode,
            secdClassId: i.secdClassId,
            factorName: i.factorName
          }
        })
      }
      if (this.factorGroupForm.groupType === '1') {
        if (totalPrice <= this.factorGroupForm.groupCost) {
          data.groupCost = totalPrice
        }
      }

      factorServer.saveFactorGroup(data).then(request => {
        this.$notify({
          title: '成功',
          message: request.message,
          type: 'success'
        })
        this.handleSearch()
        this.factorGroupDialogVisible = false
        this.factorSameVisible = false
      }).catch(() => {})
    },
    confirmUpdate() {
      var totalPrice = 0
      const data = {
        groupId: this.factorGroupForm.groupId,
        groupName: this.factorGroupForm.groupName,
        authType: this.factorGroupForm.authType,
        remark: this.factorGroupForm.remark,
        groupType: this.factorGroupForm.groupType,
        groupCost: this.factorGroupForm.groupCost !== '' ? this.factorGroupForm.groupCost : '',
        factorStandardIds: this.factorChoseData.map(i => {
          totalPrice = parseFloat(totalPrice + i.price)
          return {
            checkStandardId: i.standardCode,
            secdClassId: i.secdClassId,
            factorName: i.factorName
          }
        })
      }
      if (this.factorGroupForm.groupType === '1') {
        if (totalPrice <= this.factorGroupForm.groupCost) {
          data.groupCost = totalPrice
        }
      }
      factorServer.modifyFactorGroupByGroupId(data).then(request => {
        this.$notify({
          title: '成功',
          message: request.message,
          type: 'success'
        })
        this.handleSearch()
        this.factorGroupDialogVisible = false
        this.factorSameVisible = false
      }).catch(() => {})
    },
    handleDelete(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        factorServer.delByGroupId(id).then(result => {
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
    handleCopy(id) {
      this.$confirm('确定复制?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        factorServer.copyByGroupId(id).then(result => {
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
      this.factorGroupForm = {
        groupId: '',
        groupName: '',
        authType: '0',
        groupType: '',
        groupCost: '',
        remark: '',
        factorStandardIds: []
      }
      this.factorChoseData = []
    },

    handleChose(val) {
      if (val) {
        val.forEach(i => {
          const obj = this.factorChoseData.find(j => j.id === i.id && i.secdClassId && j.secdClassId === i.secdClassId)
          debugger
          if (!obj && i.secdClassId) {
            this.factorChoseData.push(i)
          }
        })
      }
    },
    handleSameChose(val) {
      if (val) {
        val.forEach(i => {
          const obj = this.factorChoseData.find(j => j.id === i.id && i.secdClassId && j.secdClassId === i.secdClassId && i.standardNo === j.standardNo)
          debugger
          if (!obj && i.secdClassId) {
            this.factorChoseData.push(i)
          }
        })
      }
    },
    checkAutype() {
      this.factorChoseData = []
    },
    handleRowDel(row, index) {
      this.factorChoseData.splice(index, 1)
      this.currentRow = row
    },
    handleDetail(groupId) {
      factorServer.findCheckStandardsByGroupId(groupId).then(res => {
        this.showGroupData = res.result || []
        this.factorGroupVisible = true
      })
    },
    handleDialogClose(done) {
      this.factorGroupDialogVisible = false
      this.$store.dispatch('user/resetCompForm', '')
      done()
    },
    handleSameDialogClose(done) {
      this.factorGroupDialogVisible = false
      this.$store.dispatch('user/resetCompForm', '')
      done()
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
  ::v-deep .el-card .el-card__header {
    padding: 5px 20px;
    background: #F3F2F2;
  }
  .el-card {
    overflow: auto;
  }
  ::v-deep .el-tooltip__popper {
    max-width: 800px;
  }
  .icon-list {
    overflow: hidden;
    list-style: none;
    padding: 0!important;
    li {
      float: left;
      width: 50%;
      text-align: center;
      color: #666;
      font-size: 13px;
      height: 90px;
      padding: 15px auto;
      margin-right: -1px;
      margin-bottom: -1px;
      cursor: pointer;
      span {
        display: inline-block;
        vertical-align: middle;
        svg {
          display: block;
          font-size: 45px;
          color: #606266;
          width: 100%;
          transition: color .15s linear;
        }
        .icon-name {
          display: inline-block;
          padding: 5px 3px;
          height: 1em;
        }
      }
    }
    li:hover {
      color: rgba($color: #409EFF, $alpha: 0.7);
    }
  }

  ::v-deep .el-table__header-wrapper  .el-checkbox{
    display:none
  }
</style>
