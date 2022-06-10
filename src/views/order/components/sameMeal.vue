<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card shadow="never" style="height: 400px;overflow-y: auto;">
          <div v-for="(item, index) in factorGroupData" :key="index" class="text dialog-item" @click="choseItem(item)">
            {{ item.groupName }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-table
          ref="groupMultipleTable"
          :data="factorList"
          border
          height="500px"
          :header-cell-style="{background:'#ECF3FC'}"
          @selection-change="handleGroupSelectionChange"
          @select="groupSelect"
        >
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column prop="secdClassName" label="检测对象" align="center" />
          <el-table-column prop="factorName" label="检测因子" align="center" />
          <el-table-column prop="standardNo" label="标准号" align="center" />
          <el-table-column prop="standardName" label="检测标准" min-width="130px" align="center" />
          <el-table-column prop="analysisMethod" label="分析方法" align="center" />
          <el-table-column prop="price" label="价格" align="center">
            <template slot-scope="{row}">
              {{ row.price|MoneyFormat }} 元
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-divider content-position="left">已选因子</el-divider>
    <el-row style="min-height:36px;line-height: 30px">
      <el-col :span="2">
        <span>已选中因子:</span>
      </el-col>
      <el-col :span="22">
        <template v-if="choseGroupFatcors && choseGroupFatcors.length > 0">
          <el-tag
            v-for="item in choseGroupFatcors"
            :key="item.id"
            closable
            :disable-transitions="false"
            style="margin:2px 3px"
            @close="handleGroupClose(item)"
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
        <el-button type="primary" @click="confirmGroupChoseFactor">确 定</el-button>
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
import * as factorServer from '@/api/factor'
import { uuid } from 'vue-uuid'
export default {
  props: {
    clearType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      MEAN_STATUS,
      factorGroupData: [],
      currentNodeId: '',
      factorList: [],
      meanType: '',
      currentNodeName: '',
      choseGroupFatcors: [],
      maxTotal: 10,
      setDay: 1,
      frequency: 1, // 频次
      addressArray: [],
      lookPosition: '',
      currentForm: {},
      multiplGroupeSelection: []
    }
  },
  watch: {
    clearType() {
      this.factorList = []
      this.addressArray = []
      this.choseGroupFatcors = []
      this.multiplGroupeSelection = []
      this.setDay = 1
      this.frequency = 1
      this.currentForm = {}
      this.lookPosition = ''
    }
  },
  created() {
    this.getFactorGroup()
  },
  methods: {
    getFactorGroup() {
      factorServer.findHomFactorGroup().then(res => {
        if (res.code === 200) {
          this.factorGroupData = res.result || []
        }
      })
    },
    handleGroupSelectionChange(val) {
      this.multiplGroupeSelection = val
      if (val && val.length > 0) {
        var lastPrice = 0
        // 计算总价格
        val.forEach(i => {
          lastPrice = parseFloat(i.price + lastPrice)
          if (lastPrice > this.currentForm.groupCost) {
            lastPrice = this.currentForm.groupCost
          }
        })

        val.forEach(i => {
          // lastPrice = parseFloat(i.price + lastPrice)
          // if (lastPrice > this.currentForm.groupCost) {
          //   lastPrice = this.currentForm.groupCost
          // }
          const ob = this.choseGroupFatcors.find(j => j.standardCode === i.standardCode)
          if (this.choseGroupFatcors.length === 0) {
            var subs = []
            subs.push(i)
            const item = {
              standardCode: i.standardCode,
              className: i.className,
              standardNo: i.standardNo,
              standardName: i.standardName,
              isFactor: '1',
              factorName: this.getFactorName(subs),
              secdClassId: i.secdClassId,
              secdClassName: i.secdClassName,
              frequency: i.frequency,
              dayCount: i.dayCount,
              costPerTime: lastPrice,
              subCheckStandards: subs
            }
            this.choseGroupFatcors.push(item)
          } else {
            if (!ob) {
              var newSubs = this.choseGroupFatcors[0].subCheckStandards
              newSubs.push(i)
              this.choseGroupFatcors[0].factorName = this.getFactorName(newSubs)
              this.choseGroupFatcors[0].costPerTime = lastPrice
            }
          }
        })
        this.currentNodeId = this.choseGroupFatcors[0].secdClassId
      } else {
        this.currentNodeId = ''
      }
      debugger
      if (this.addressArray.length === 0) {
        if (this.currentNodeId === '002003') { // 厂界无组织/ 环境空气 自动生成5个点位
          this.$nextTick(() => {
            for (var i = 0; i < 4; i++) {
              this.addressArray.push({
                value: '',
                windNum: 3,
                key: Date.now() + i
              })
            }
          })
        } else if (this.currentNodeId === '002001') {
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
      }
    },
    getFactorName(items) {
      if (items.length === 1) {
        return this.currentForm.groupName + '(' + items[0].factorName + ')'
      } else {
        var n = ''
        items.forEach(i => { n += i.factorName + ',' })
        var fanme = this.currentForm.groupName + '(' + n.substring(0, 20) + '...)'
        return fanme
      }
    },
    groupSelect(selection, row) {
      if (selection) {
        if (selection.indexOf(row) === -1) {
          const index = this.choseGroupFatcors.findIndex(i => i.standardCode === row.standardCode)
          this.choseGroupFatcors.splice(index, 1)
        }
      }
    },
    choseItem(val) {
      this.factorList = []
      this.multiplGroupeSelection = []
      this.choseGroupFatcors = []
      this.currentForm = val
      // 清空设定值
      this.setDay = 1
      this.frequency = 1
      this.maxTotal = 10
      this.addressArray = []
      this.currentNodeId = ''
      this.currentNodeName = ''
      this.meanType = ''
      this.factorsPrice = val.groupCost
      if (val.groupId) {
        factorServer.findCheckStandardsByGroupId(val.groupId).then(result => {
          if (result.code === 200 && result.result) {
            this.factorList = result.result || []
          }
        })
      }
    },
    handleGroupClose(item) {
      // 移除存储的因子
      this.choseGroupFatcors.splice(this.choseGroupFatcors.indexOf(item), 1)
      this.$refs.groupMultipleTable.toggleRowSelection(item, false)
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
    removeAddDomain(item) {
      var index = this.addressArray.indexOf(item)
      if (index !== -1) {
        this.addressArray.splice(index, 1)
      }
    },
    confirmGroupChoseFactor() {
      if (!this.choseGroupFatcors || this.choseGroupFatcors.length <= 0) {
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

      const retListArray = this.choseGroupFatcors.map(i => {
        const { standardCode, className, standardName, secdClassId, standardNo, secdClassName, factorName, subCheckStandards } = i
        const n_UUid = uuid.v4().replaceAll('-', '')
        var usePrice = 0
        debugger
        if (subCheckStandards && subCheckStandards.length > 0) {
          subCheckStandards.forEach(j => {
            usePrice += j.price
          })
        }
        debugger
        if (this.currentForm.groupCost <= usePrice) {
          usePrice = this.currentForm.groupCost
        }

        const cost = parseFloat(usePrice * this.frequency * this.setDay).toFixed(2)
        this.$set(i, 'factorGroupKey', n_UUid)
        return {
          standardCode,
          className,
          standardName,
          factorName,
          isFactor: '1',
          secdClassId,
          standardNo,
          secdClassName,
          frequency: this.frequency,
          dayCount: this.setDay,
          totalNum: Number(this.frequency * this.setDay).toFixed(0),
          costPerTime: Number(usePrice).toFixed(2), // 单次售价
          totalCost: cost,
          meanName: this.currentNodeId === '002001' ? this.MEAN_STATUS[this.meanType] : undefined,
          factorPoint: this.lookPosition,
          groupClassId: groupId !== '' ? (groupId + '/' + standardCode) : '',
          dynamicParam: JSON.stringify(dynamic),
          subCheckStandards,
          factorGroupKey: n_UUid
        }
      })
      if (this.addressArray && this.addressArray.length > 0) {
        this.addressArray.forEach(item => {
          if (item.value && item.value.length > 0) {
            this.choseGroupFatcors.forEach(j => {
              const { standardCode, className, standardName, secdClassId, secdClassName, standardNo, factorName, costPerTime, subCheckStandards, factorGroupKey } = j
              const cost = parseFloat(costPerTime * this.frequency * this.setDay).toFixed(2)
              retListArray.push({
                standardCode,
                className,
                standardName,
                isFactor: '1',
                factorName,
                standardNo,
                secdClassId,
                secdClassName,
                frequency: this.frequency,
                dayCount: this.setDay,
                costPerTime, // 单次售价
                totalNum: Number(this.frequency * this.setDay).toFixed(0),
                totalCost: cost,
                factorPoint: item.value,
                remark: '',
                meanName: this.currentNodeId === '002001' ? this.MEAN_STATUS[this.meanType] : undefined,
                groupClassId: groupId !== '' ? (groupId + '/' + standardCode) : '',
                dynamicParam: JSON.stringify(dynamic),
                subCheckStandards,
                factorGroupKey
              })
            })
          }
        })
      }
      // 追加合并
      this.formComfig(retListArray)
      this.factorGroupVisible = false
    },
    formComfig(items) {
      this.$emit('handleConfim', items)
    },
    cancelComfig() {
      this.$emit('handleCancel', false)
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
    max-height: 450px;
  }
  .card-right {
    width: 100%;
    min-height: 200px;
    max-height: 450px;
  }
  .el-card {
    overflow: auto;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 14px;
  }
  // /deep/.main-body .el-table__header-wrapper  .el-checkbox{
  //   display:none
  // }
  .agreement_picture {
    min-height: calc(100%);
    .pdf{
      height: calc(100%);
    }
  }

  /deep/ .el-input.is-disabled .el-input__inner {
    color:unset
  }

  /deep/.i-input .el-input__inner {
    text-align: center;
  }
  /deep/.right-input .el-input__inner {
    text-align: right;
  }

  .el-header {
    line-height: 45px;
    height: 45px;
  }
  .el-footer {
    text-align: right;
    line-height: 45px;
    height: 45px;

    .pagination-container {
      padding: 0;
      margin-top: 10px;
      margin-bottom: 45px;
    }
  }
  .el-main {
    overflow-y: auto;
  }
  .el-container {
    max-height: 450px;
  }

</style>
<style scoped>
  .text {
    font-size: 14px;
  }
  .dialog-item {
    padding-left: 3px;
    line-height: 30px;
    cursor:pointer;

  }
  .dialog-item:hover {
    background: #e8f4ff;
    border-radius: 3px;
  }

table {
    background-color: transparent
}

caption {
    padding-top: 8px;
    padding-bottom: 8px;
    color: #777;
    text-align: left
}

th {
    text-align: left
}

.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px
}

.table>tbody>tr>td,.table>tbody>tr>th,.table>tfoot>tr>td,.table>tfoot>tr>th,.table>thead>tr>td,.table>thead>tr>th {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: middle;
    border-top: 1px solid #ddd
}

.table>thead>tr>th {
    vertical-align: bottom;
    border-bottom: 2px solid #ddd
}

.table>caption+thead>tr:first-child>td,.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>td,.table>thead:first-child>tr:first-child>th {
    border-left: 1px solid #F1F2F4
}

.table>tbody+tbody {
    border-top: 2px solid #ddd
}

.table .table {
    background-color: #fff
}

.table-condensed>tbody>tr>td,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>td,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>thead>tr>th {
    padding: 5px
}

.table-bordered {
    border: 1px solid #ddd
}

.table-bordered>tbody>tr>td,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>td,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>thead>tr>th {
    border: 1px solid #ddd
}

.table-bordered>thead>tr>td,.table-bordered>thead>tr>th {
    border-bottom-width: 2px
}

.table-striped>tbody>tr:nth-of-type(odd) {
    background-color: #f9f9f9
}

.table-hover>tbody>tr:hover {
    background-color: #f5f5f5
}

table col[class*=col-] {
    position: static;
    display: table-column;
    float: none
}

table td[class*=col-],table th[class*=col-] {
    position: static;
    display: table-cell;
    float: none
}

.table>tbody>tr.active>td,.table>tbody>tr.active>th,.table>tbody>tr>td.active,.table>tbody>tr>th.active,.table>tfoot>tr.active>td,.table>tfoot>tr.active>th,.table>tfoot>tr>td.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>thead>tr.active>th,.table>thead>tr>td.active,.table>thead>tr>th.active {
    background-color: #f5f5f5
}

.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr.active:hover>th,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover {
    background-color: #e8e8e8
}

.table>tbody>tr.success>td,.table>tbody>tr.success>th,.table>tbody>tr>td.success,.table>tbody>tr>th.success,.table>tfoot>tr.success>td,.table>tfoot>tr.success>th,.table>tfoot>tr>td.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>thead>tr.success>th,.table>thead>tr>td.success,.table>thead>tr>th.success {
    background-color: #dff0d8
}

.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr.success:hover>th,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover {
    background-color: #d0e9c6
}

.table>tbody>tr.info>td,.table>tbody>tr.info>th,.table>tbody>tr>td.info,.table>tbody>tr>th.info,.table>tfoot>tr.info>td,.table>tfoot>tr.info>th,.table>tfoot>tr>td.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>thead>tr.info>th,.table>thead>tr>td.info,.table>thead>tr>th.info {
    background-color: #d9edf7
}

.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr.info:hover>th,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover {
    background-color: #c4e3f3
}

.table>tbody>tr.warning>td,.table>tbody>tr.warning>th,.table>tbody>tr>td.warning,.table>tbody>tr>th.warning,.table>tfoot>tr.warning>td,.table>tfoot>tr.warning>th,.table>tfoot>tr>td.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>thead>tr.warning>th,.table>thead>tr>td.warning,.table>thead>tr>th.warning {
    background-color: #fcf8e3
}

.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr.warning:hover>th,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover {
    background-color: #faf2cc
}

.table>tbody>tr.danger>td,.table>tbody>tr.danger>th,.table>tbody>tr>td.danger,.table>tbody>tr>th.danger,.table>tfoot>tr.danger>td,.table>tfoot>tr.danger>th,.table>tfoot>tr>td.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>thead>tr.danger>th,.table>thead>tr>td.danger,.table>thead>tr>th.danger {
    background-color: #f2dede
}

.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr.danger:hover>th,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover {
    background-color: #ebcccc
}

.table-responsive {
  min-height: 3.01%;
  overflow-x: auto;
}

.table-bordered, .table-bordered > tbody > tr > td, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > td, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > thead > tr > th {
    border: 1px solid #e9ecef;
    text-align: center;
    line-height: 14px;
}

.table-bordered, td, th {
    border-radius: 0 !important;
}

.table-bordered > tbody > tr:last-child > td {
    border-bottom: 1px solid #e9ecef;
}

.bootstrap-table .fixed-table-container .fixed-table-header {
    overflow: hidden;
    background: rgba(0, 0, 0, .05);
}

.fixed-table-header .table > thead > tr {
    background: none !important;
}

.table > thead > tr {
    color: #636363;
    font-weight: 400;
    background: rgba(0, 0, 0, .05);
    /*   background: repeat-x #fafafa;
  background-image: -webkit-linear-gradient(top,#F8F8F8 0,#fafafa 100%);
  background-image: -o-linear-gradient(top,#F8F8F8 0,#fafafa 100%);
  background-image: linear-gradient(to bottom,#F8F8F8 0,#fafafa 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fff8f8f8', endColorstr='#ffececec', GradientType=0); */
}

.table > thead > tr > th {
    border-color: #e9ecef;
    font-weight: 700;
    border-right-color: transparent;
}

.table > thead > tr > th .ace-icon:first-child {
    margin-right: 2px;
}

.table > thead > tr > th:first-child {
    border-left-color: #F1F1F1;
}

.table > thead > tr > th:last-child {
    border-right-color: #F1F1F1;
}

.table.table-bordered > thead > tr > th {
    vertical-align: middle;
}

td.center, th.center {
    text-align: center;
}

td .lbl, th .lbl {
    margin-bottom: 0;
}

td .lbl:only-child, th .lbl:only-child {
    vertical-align: top;
}

.table-header {
    background-color: #307ECC;
    color: #FFF;
    font-size: 14px;
    line-height: 38px;
    padding-left: 12px;
    margin-bottom: 1px;
}

.table-header .close {
    margin-right: 8px;
    margin-top: 0;
    opacity: .45;
    filter: alpha(opacity=45);
}

.table-header .close:hover {
    opacity: .75;
    filter: alpha(opacity=75);
}

th.detail-col {
    width: 48px;
    text-align: center;
}

tr.detail-row {
    display: none;
}

tr.detail-row.open {
    display: block;
    display: table-row;
}

tr.detail-row > td {
    background-color: #f1f6f8;
    border-top: 3px solid #d1e1ea !important;
}

.table-detail {
    background-color: #fff;
    border: 1px solid #dcebf7;
    width: 100%;
    padding: 12px;
}

.table-detail td > .profile-user-info {
    width: 100%;
}

</style>
