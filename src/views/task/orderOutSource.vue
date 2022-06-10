<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="报价单号:">
            <el-input v-model="searchForm.offerId" style="width:165px" placeholder="报价单号" />
          </el-form-item>
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="分包状态:">
            <el-select v-model="searchForm.status" placeholder="分包状态">
              <el-option label="全部" value="" />
              <el-option label="未处理" value="0" />
              <el-option label="已处理" value="1" />
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
        :data="orderData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无分包信息
              </span>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" label="序号" fixed="left" align="center" />
        <el-table-column prop="projectName" label="项目名称" fixed="left" min-width="120px" align="center" />
        <el-table-column prop="offerId" label="报价单号" width="180px" align="center" />
        <el-table-column prop="checkType" label="检测类型" width="90px" align="center">
          <template slot-scope="{row}">
            {{ row.checkType === '0'?"委托检测":"样品送检" }}
          </template>
        </el-table-column>
        <el-table-column prop="consignorName" label="客户名称" min-width="120px" align="center" />
        <el-table-column prop="finishDate" label="完成时间" width="120" align="center" />
        <el-table-column prop="createUserId" label="报价人" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.status | statusQualityFilter">
              {{ ACCOUNT_STATUS[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)"> 查看</el-button>
            <div v-if="scope.row.status === '0'" class="erc-divider-vertical" />
            <el-button v-if="scope.row.status === '0'" type="text" @click="handleApprove(scope.row)"> 分包判定</el-button>
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

    <el-dialog :title="currentRow.projectName+ '-详情'" :visible.sync="detailVisible" top="5vh" width="85%">
      <el-form label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="委托单位:">{{ currentRow.consignorName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间:">{{ currentRow.finishDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报价人:">{{ currentRow.createUserId }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注:">{{ currentRow.remark?currentRow.remark:'-' }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-card v-if="showJudgeArray && showJudgeArray.length > 0" shadow="never">
        <el-card v-for="(item,index) in showJudgeArray" :key="index" style="margin-top:5px">
          <div slot="header" class="clearfix">
            <span>{{ item.organName==='-1'?'自处理':item.organName }}<i class="el-input__icon" /></span>
          </div>
          <el-table
            :data="item.factorVos"
            :header-cell-style="{background:'#ECF3FC'}"
            max-height="400px"
          >
            <el-table-column type="index" width="55" label="序号" align="center" />
            <el-table-column prop="secdClassName" label="类别" align="center" />
            <el-table-column prop="factorName" label="因子" align="center" />
            <el-table-column prop="standardNo" label="标准号" min-width="110px" align="center" />
            <el-table-column prop="standardName" label="检测标准" min-width="130px" align="center" />
            <el-table-column prop="factorPoint" label="检测位置" align="center" />
            <el-table-column prop="frequency" label="频次(次/天)" align="center" />
            <el-table-column prop="dayCount" label="天数" align="center" />
            <el-table-column prop="totalCost" label="检测费用" align="center">
              <template slot-scope="{row}">
                {{ parseFloat(row.costPerTime * row.dayCount * row.dayCount).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-card>
    </el-dialog>

    <el-dialog :title="currentRow.projectName + '-调度'" :visible.sync="approveVisible" center fullscreen>
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item label="委托单位:">{{ currentRow.consignorName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间:">{{ currentRow.finishDate }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报价人:">{{ currentRow.createUserId }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注:">{{ currentRow.remark?currentRow.remark:'-' }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-row :gutter="3">
            <el-col :span="6">
              <span>检测因子<i class="el-input__icon" /></span>
            </el-col>
            <el-col :span="8" style="text-align:right;padding-top:13px;">
              <span style="color:red;">若直接点击确认，则默认不分包，全部由本机构自行检测</span>
            </el-col>
            <el-col :span="7">
              <el-select
                v-model="judgeId"
                placeholder="机构选择"
                style="float: right; margin:4px 2px;"
              >
                <el-option
                  v-for="item in judgeArray"
                  :key="item.id"
                  :label="item.judgeOrganName"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-button style="float: left; margin:4px 2px;" type="primary" plain @click="addJudge">确定分包</el-button>
            </el-col>
          </el-row>

        </div>
        <el-row style="height:45px;">
          <el-col :span="4">
            <el-input v-model="ableFactor" placeholder="请录入因子" />
          </el-col>
          <el-col :span="16" style="text-align:center;font-size: 16px;padding-top:10px;color:#1890FF">有能力</el-col>
          <el-col :span="4" style="text-align:center;font-size: 16px;color:#1890FF" />
        </el-row>
        <el-row style="margin-top: 10px">

          <el-table
            :data="ableFactorDt"
            :header-cell-style="{background:'#ECF3FC'}"
            max-height="400px"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="secdClassName" label="类别" align="center" />
            <el-table-column prop="factorName" label="因子" align="center" />
            <el-table-column prop="standardNo" label="标准号" min-width="100px" align="center" />
            <el-table-column prop="standardName" label="检测标准" min-width="130px" align="center" />
            <el-table-column prop="factorPoint" label="检测位置" align="center" />
            <el-table-column prop="frequency" label="频次(次/天)" align="center" />
            <el-table-column prop="dayCount" label="天数" align="center" />
            <el-table-column prop="totalCost" label="检测费用" align="center">
              <template slot-scope="{row}">
                {{ parseFloat(row.costPerTime * row.dayCount * row.dayCount).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-divider />
        <el-row style="height:45px;padding-top:8px;">
          <el-col :span="4" style="text-align:center;font-size: 16px;color:#1890FF">
            <el-input v-model="unAbleFactor" placeholder="请录入因子" />
          </el-col>
          <el-col :span="16" style="text-align:center;font-size: 16px;padding-top:10px;color:#1890FF">无能力</el-col>
          <el-col :span="4" style="text-align:center;font-size: 16px;color:#1890FF" />
        </el-row>
        <el-row style="margin-top: 10px">
          <el-table
            :data="unAbleFactorDt"
            :header-cell-style="{background:'#ECF3FC'}"
            max-height="400px"
            border
            @selection-change="handleSelectionEnableChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="secdClassName" label="类别" align="center" />
            <el-table-column prop="factorName" label="因子" align="center" />
            <el-table-column prop="standardNo" label="标准号" min-width="100px" align="center" />
            <el-table-column prop="standardName" label="检测标准" min-width="130px" align="center" />
            <el-table-column prop="factorPoint" label="检测位置" align="center" />
            <el-table-column prop="frequency" label="频次(次/天)" align="center" />
            <el-table-column prop="dayCount" label="天数" align="center" />
            <el-table-column prop="totalCost" label="检测费用" align="center">
              <template slot-scope="{row}">
                {{ parseFloat(row.costPerTime * row.dayCount * row.dayCount).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-card>
      <el-card v-if="outFactorData && outFactorData.length > 0" shadow="never">
        <el-card v-for="(item,index) in outFactorData" :key="index" style="margin-top:3px">
          <div slot="header" class="clearfix">
            <span>分包机构:{{ item.judgeName }}<i class="el-input__icon" /></span>
            <el-button style="float: right; margin:4px 2px;" type="primary" plain size="mini" @click="delJudge(item,index)">删除</el-button>
          </div>
          <el-table
            :data="item.facotrs"
            :header-cell-style="{background:'#ECF3FC'}"
            max-height="400px"
          >
            <el-table-column type="index" width="55" label="序号" align="center" />
            <el-table-column prop="secdClassName" label="类别" align="center" />
            <el-table-column prop="factorName" label="因子" align="center" />
            <el-table-column prop="standardName" label="检测标准" min-width="130px" align="center" />
            <el-table-column prop="factorPoint" label="检测位置" align="center" />
            <el-table-column prop="frequency" label="频次(次/天)" align="center" />
            <el-table-column prop="dayCount" label="天数" align="center" />
            <el-table-column prop="totalCost" label="检测费用" align="center">
              <template slot-scope="{row}">
                {{ parseFloat(row.costPerTime * row.dayCount * row.dayCount).toFixed(2) }}
              </template>
            </el-table-column>

          </el-table>

        </el-card>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as orderServer from '@/api/offer'
import * as appvoerServer from '@/api/approve'
import { findValidList } from '@/api/dict'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const ACCOUNT_STATUS = {
  '0': '待处理',
  '1': '已处理'
}
const CHECK_STATUS = {
  '0': '单次',
  '1': '周',
  '2': '月',
  '3': '季度',
  '4': '半年',
  '5': '年'
}
export default {
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      const statusMap = {
        '0': '',
        '1': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      ACCOUNT_STATUS,
      CHECK_STATUS,
      orderData: [],
      searchForm: {
        offerId: '',
        projectName: '',
        status: '0',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      approveVisible: false,
      approveForm: {
        result: '0',
        remark: ''
      },
      orderDetailForm: {
        offerId: '',
        offerBaseVo: {
          consignorName: '',
          consignorLinker: '',
          consignorLinkerPhone: '',
          createUserName: '',
          finishDate: '',
          remark: '',
          checkCircle: '',
          checkTaskCount: ''
        },
        factorTdos: [],
        costVo: {},
        oncePrice: '',
        selfCostVos: []
      },
      detailVisible: false,
      factorData: [],
      enableFactorData: [], // 无能力
      ableFactorData: [], // 有能力
      outFactorData: [],
      multipleSelection: [],
      multipleEnableSelection: [],
      judgeId: '',
      judgeArray: [],
      showJudgeArray: [],
      currentRow: {},
      ableFactor: '',
      unAbleFactor: ''
    }
  },
  computed: {
    ableFactorDt() {
      const search = this.ableFactor.trim()
      if (search) {
        return this.ableFactorData.filter(i => i.factorName.indexOf(search) > -1)
      }
      return this.ableFactorData
    },
    unAbleFactorDt() {
      const search = this.unAbleFactor.trim()
      if (search) {
        return this.enableFactorData.filter(i => i.factorName.indexOf(search) > -1)
      }
      return this.enableFactorData
    }
  },
  created() {
    this.getOutSourceCom()
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      appvoerServer.findOfferJudgeByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.orderData = res.result.records
          this.total = res.result.total
        }
      })
    },
    getOutSourceCom() {
      findValidList().then(res => {
        this.judgeArray = res.result
      })
    },
    handleDetail(row) {
      this.currentRow = Object.assign({}, row)
      // 获取数据
      orderServer.findJudgeOfferFactorQryVoByOfferId(row.offerId).then(res => {
        this.showJudgeArray = res.result
        this.detailVisible = true
      })
    },
    handleApprove(row) {
      this.currentRow = Object.assign({}, row)
      this.enableFactorData = []
      this.ableFactorData = []
      this.outFactorData = []
      this.judgeId = ''
      orderServer.getOrderOutSourceInfos(row.offerId).then(res => {
        if (res.code === 200 && res.result) {
          this.factorData = res.result || []
          res.result.forEach(i => {
            if (i.extAssistFlg === '1') {
              this.enableFactorData.push(i)
            } else {
              this.ableFactorData.push(i)
            }
          })

          this.approveVisible = true
        }
      })
    },
    addJudge() {
      if (this.ableFactorData.length - this.multipleSelection.length <= 0) {
        this.$message.error('有能力检测因子项不能全部分包')
        return
      }
      if (this.judgeId && (this.multipleSelection || this.multipleEnableSelection)) {
        const evel = this.outFactorData.find(i => i.judgeId === this.judgeId)
        const jevel = this.judgeArray.find(i => i.id === this.judgeId)
        let factorInfos = this.multipleSelection
        factorInfos = factorInfos.concat(this.multipleEnableSelection)
        if (!evel) {
          this.outFactorData.push({
            judgeId: this.judgeId,
            judgeName: jevel.judgeOrganName,
            facotrs: factorInfos
          })
        } else {
          evel.facotrs = evel.facotrs.concat(factorInfos)
        }
        // 处理成功移除 选中的记录
        this.multipleSelection.forEach(i => {
          var index = this.ableFactorData.indexOf(i)
          if (index !== -1) {
            this.ableFactorData.splice(index, 1)
          }
        })
        this.multipleEnableSelection.forEach(i => {
          var index = this.enableFactorData.indexOf(i)
          if (index !== -1) {
            this.enableFactorData.splice(index, 1)
          }
        })
        this.multipleSelection = []
        this.multipleEnableSelection = []
      } else {
        this.$message.warning('请先选择分包机构,且因子不能为空')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionEnableChange(val) {
      this.multipleEnableSelection = val
    },
    delJudge(item, index) {
      if (item.facotrs) {
        const local = [...item.facotrs]
        this.outFactorData.splice(index, 1)
        debugger
        local.forEach(i => {
          if (i.extAssistFlg === '1') {
            this.enableFactorData.push(i)
          } else {
            this.ableFactorData.push(i)
          }
        })
      }
    },
    confirmDialog() {
      if (this.enableFactorData.length > 0) {
        this.$message.error('无能力检测因子需要全部分包')
        return
      }
      var tdoList = this.ableFactorData.map(i => {
        return {
          planFactorId: i.planFactorId,
          organId: ''
        }
      })
      this.outFactorData.forEach(i => {
        if (i.facotrs) {
          i.facotrs.forEach(j => {
            tdoList.push({
              planFactorId: j.planFactorId,
              organId: i.judgeId
            })
          })
        }
      })

      this.$confirm('确定提交分包信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          offerId: this.currentRow.offerId,
          itemTdoList: tdoList
        }
        appvoerServer.offerJudge(data).then(result => {
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
    background: #D3D3D3;
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
  /deep/.el-table__header-wrapper  .el-checkbox{
    display:none
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
</style>

<style scoped>

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
