<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card class="card-left" shadow="never" style="min-height: 400px;">
          <div>
            <el-tree
              ref="tree"
              class="filter-tree"
              :data="factorTreeData"
              :props="defaultProps"
              highlight-current
              default-expand-all
              :expand-on-click-node="true"
              style="height: 100%;"
              @node-click="handleTreeFactorSearch"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-container>
          <el-header height="45px">
            <el-input v-model="factorForm.factorName" style="width:200px" placeholder="输入检测因子名称" @change="handleFactorSearch" />
            <el-button type="primary" style="margin-left: 10px" @click="handleFactorSearch">查询</el-button>
          </el-header>
          <el-main class="main-body">
            <el-table
              ref="multipleTable"
              :data="showChoseData"
              stripe
              border
              max-height="450px"
              :header-cell-style="{background:'#ECF3FC'}"
              @select="handleSelectChange"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column prop="className" label="检测对象" width="100px" align="center" />
              <el-table-column prop="factorName" label="检测因子" align="center" />
              <el-table-column prop="standardNo" label="标准号" align="center" />
              <el-table-column prop="standardName" label="检测标准" min-width="130px" align="center" />
              <el-table-column prop="analysisMethod" label="分析方法" align="center" />
              <el-table-column prop="MoneyFormat" label="价格" align="center">
                <template slot-scope="{row}">
                  {{ row.price|MoneyFormat }} 元
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer height="45px">
            <pagination
              v-show="factTotal>0"
              :total="factTotal"
              :page.sync="factorForm.pageNumber"
              :limit.sync="factorForm.pageSize"
              @pagination="handleFactorSearch"
            />
          </el-footer>
        </el-container>

      </el-col>
    </el-row>
    <el-divider content-position="left">已选因子</el-divider>
    <el-row style="min-height:36px;line-height: 30px">
      <el-col :span="2">
        <span>已选中因子:</span>
      </el-col>
      <el-col :span="22">
        <template v-if="choseFatcors && choseFatcors.length > 0">
          <el-tag
            v-for="item in choseFatcors"
            :key="item.id"
            closable
            :disable-transitions="false"
            style="margin:2px 3px"
            @close="handleClose(item)"
          >
            {{ item.factorName }}
          </el-tag>
        </template>
        <template v-else>
          无
        </template>
      </el-col>
    </el-row>
    <el-divider content-position="left">因子配置</el-divider>
    <el-form>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item v-if="currentNodeId === '002001'" label="均值类型:" label-width="100px">
            <el-select v-model="meanType" placeholder="请选择均值类型" @change="changeMeanType">
              <el-option value="0" label="日均值" />
              <el-option value="1" label="时均值" />
              <el-option value="2" label="八小时均值" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="天数:" label-width="100px">
            <el-input-number v-model="setDay" controls-position="right" :min="1" :step="1" :precision="0" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="频次(次/天):" label-width="110px">
            <el-input-number v-model="frequency" controls-position="right" :max="maxTotal" :min="1" :step="1" :precision="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="addressArray && addressArray.length >0 ?'检测位置1:':'检测位置:'" label-width="100px">
            <el-input v-model="lookPosition" placeholder="检测位置" style="width: 250px;margin-right:3px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-for="(item, index) in addressArray" :key="item.key" :span="24">
          <el-form-item :label="'检测位置'+(index+2)+':'" label-width="100px">
            <el-input v-model="item.value" placeholder="检测位置" style="width: 250px;margin-right:3px" />
            <el-button v-if="currentNodeId !== '002001' && currentNodeId !== '002003'" type="text" size="small" @click.prevent="removeAddDomain(item)">删除</el-button>
          </el-form-item>
        </el-col>
        <el-col v-if="currentNodeId !== '002003' && currentNodeId !== '002001'" :span="24" style="padding-left:20px">
          <el-form-item>
            <el-button type="primary" @click="addAddress">添加位置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider />
    <el-row>
      <el-col :span="24" style="text-align: right;">
        <el-button type="" @click="cancelComfig">取 消</el-button>
        <el-button type="primary" @click="confirmChoseFactor">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const MEAN_STATUS = {
  '0': '日均值',
  '1': '时均值',
  '2': '八小时均值'
}
import Pagination from '@/components/Pagination' // Secondary
import * as factorServer from '@/api/factor'
import { uuid } from 'vue-uuid'
import * as dictServer from '@/api/dict'
export default {
  name: 'FactorChoseList',
  components: { Pagination },
  props: {
    clearType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      MEAN_STATUS,
      factorTreeData: [],
      addressArray: [],
      currentNodeId: '',
      currentNodeName: '',
      lookPosition: '',
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      factTotal: 0,
      factorForm: {
        classId: '',
        factorName: '',
        pageNumber: 1,
        pageSize: 10
      },
      choseFatcors: [],
      showChoseData: [],
      multipleSelection: [],
      maxTotal: 10,
      setDay: 1,
      frequency: 1, // 频次
      meanType: '0'

    }
  },
  watch: {
    clearType() {
      this.factorForm.factorName = ''
      this.showChoseData = []
      this.addressArray = []
      this.choseFatcors = []
      this.multipleSelection = []
      this.setDay = 1
      this.frequency = 1
      this.lookPosition = ''
    }
  },
  created() {
    this.getTreeClassList()
  },
  methods: {
    getTreeClassList() {
      dictServer.findTreeClasses().then(res => {
        this.factorTreeData = res.result || []
      })
    },
    handleTreeFactorSearch(val, node) {
      if (!val.children || val.children == null) {
        // if (!this.currentNodeId || this.currentNodeId !== val.id) {
        this.addressArray = []
        this.currentNodeId = val.id
        this.currentNodeName = val.name
        this.factorForm.classId = node.parent.data.id
        this.factorForm.factorName = ''
        this.factorForm.pageNumber = 1
        this.handleFactorSearch()
        // 清空已经选择的信息
        this.choseFatcors = []
        this.multipleSelection = []

        if (val.id === '002001' && this.meanType === '0') {
          this.maxTotal = 1
        } else if (val.id === '004001') {
          this.maxTotal = 2
        } else {
          this.maxTotal = 10
        }
        if (val.id === '002003') { // 厂界无组织/ 环境空气 自动生成5个点位
          this.$nextTick(() => {
            for (var i = 0; i < 4; i++) {
              this.addressArray.push({
                value: '',
                windNum: 3,
                key: Date.now() + i
              })
            }
          })
        } else if (val.id === '002001') {
          this.$nextTick(() => {
            for (var i = 0; i < 3; i++) {
              this.addressArray.push({
                value: '',
                windNum: 3,
                key: Date.now() + i
              })
            }
          })
        }
        // }
        // 为底层的时候
      }
    },
    handleFactorSearch() {
      if (this.currentNodeId && this.currentNodeId.length > 0) {
        factorServer.getFactorListForPage(this.factorForm).then(res => {
          if (res.code === 200) {
            this.showChoseData = res.result.records || []
            this.factTotal = res.result.total
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val) {
        val.forEach(i => {
          const ob = this.choseFatcors.find(j => j.id === i.id)
          if (!ob) {
            this.choseFatcors.push(i)
          }
        })
      }
    },
    handleSelectChange(val, row) {
      // 先判定是否取消
      if (val) {
        if (val.indexOf(row) === -1) {
          const index = this.choseFatcors.findIndex(i => i.id === row.id)
          this.choseFatcors.splice(index, 1)
        }
      }
    },
    changeMeanType(val) {
      let curTotal = 0
      if (val === '0') {
        this.maxTotal = curTotal = 1
      } else if (val === '1') {
        this.maxTotal = curTotal = 4
      } else if (val === '2') {
        this.maxTotal = curTotal = 2
      }
      if (this.frequency > curTotal) {
        this.frequency = curTotal
      }
    },
    addAddress() {
      this.$nextTick(() => {
        this.addressArray.push({
          value: '',
          windNum: 3,
          key: Date.now()
        })
      })
    },
    handleClose(item) {
      // 移除存储的因子
      this.choseFatcors.splice(this.choseFatcors.indexOf(item), 1)
      this.$refs.multipleTable.toggleRowSelection(item, false)
    },
    confirmChoseFactor() {
      if (!this.choseFatcors || this.choseFatcors.length <= 0) {
        this.$message.warning('因子不能为空')
        return
      }
      if (!this.lookPosition || this.lookPosition.length <= 0) {
        this.$message.warning('初始检测位置不能为空')
        return
      }
      const dynamic = {}
      if (this.currentNodeId === '002001') {
        this.$set(dynamic, 'meanType', this.meanType)
        this.$set(dynamic, 'meanName', this.MEAN_STATUS[this.meanType])
      }
      let groupId = ''
      if (this.currentNodeId === '002001' || this.currentNodeId === '002003') {
        groupId = this.currentNodeId
      }
      const retListArray = this.choseFatcors.map(i => {
        const { standardCode, className, dataEntryStep, standardNo, standardName, factorName, price } = i
        const cost = parseFloat(price * this.frequency * this.setDay).toFixed(2)
        const n_UUid = uuid.v4().replaceAll('-', '')
        this.$set(i, 'factorGroupKey', n_UUid)
        return {
          checkStandardId: standardCode,
          className,
          standardName,
          factorName,
          fbFlag: '0',
          isFactor: '0',
          factorFlag: '0',
          standardNo,
          dataEntryStep,
          secdClassId: this.currentNodeId,
          secdClassName: this.currentNodeName,
          frequency: this.frequency,
          dayCount: this.setDay,
          totalNum: Number(this.frequency * this.setDay).toFixed(0),
          costPerTime: price,
          totalCost: cost,
          meanName: this.currentNodeId === '002001' ? this.MEAN_STATUS[this.meanType] : undefined,
          factorPoint: this.lookPosition.trim(),
          groupClassId: groupId !== '' ? (groupId + '/' + standardCode) : '',
          dynamicParam: JSON.stringify(dynamic),
          factorGroupKey: n_UUid // 每次添加因子，同组的归为一类
        }
      })
      if (this.addressArray && this.addressArray.length > 0) {
        this.addressArray.forEach(item => {
          if (item.value && item.value.length > 0) {
            this.choseFatcors.forEach(j => {
              const { standardCode, className, standardNo, dataEntryStep, standardName, factorName, price, factorGroupKey } = j
              const cost = parseFloat(price * this.frequency * this.setDay).toFixed(2)
              retListArray.push({
                checkStandardId: standardCode,
                className,
                standardName,
                factorName,
                fbFlag: '0',
                isFactor: '0',
                factorFlag: '0',
                standardNo,
                dataEntryStep,
                secdClassId: this.currentNodeId,
                secdClassName: this.currentNodeName,
                frequency: this.frequency,
                dayCount: this.setDay,
                totalNum: Number(this.frequency * this.setDay).toFixed(0),
                costPerTime: price,
                totalCost: cost,
                factorPoint: item.value,
                remark: '',
                meanName: this.currentNodeId === '002001' ? this.MEAN_STATUS[this.meanType] : undefined,
                groupClassId: groupId !== '' ? (groupId + '/' + standardCode) : '',
                dynamicParam: JSON.stringify(dynamic),
                factorGroupKey // 每次添加因子，同组的归为一类
              })
            })
          }
        })
      }
      this.formComfig(retListArray)
    },
    formComfig(items) {
      debugger
      this.$emit('handleConfim', items)
    },
    cancelComfig() {
      this.$emit('handleCancel', false)
    }
  }
}
</script>
