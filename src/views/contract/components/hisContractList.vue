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
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="contCode" label="合同编号" width="185px" align="center" />
        <el-table-column prop="offerId" label="报价单号" width="170px" align="center" />
        <el-table-column prop="projectName" label="项目名称" min-width="140px" align="center" />
        <el-table-column prop="partA" label="甲方" width="120px" align="center" />
        <el-table-column prop="signDate" label="签订日期" width="120" align="center" />
        <el-table-column prop="validity" label="有效期(年)" align="center" />
        <el-table-column prop="contStatus" label="合同状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.contStatus|statusQualityFilter">
              {{ CONTRACT_STATUS[row.contStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间" width="120" align="center" /> -->

        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="{row}">
            <el-button v-if="row.contStatus!=5" type="text" @click="handleDetail(row)"> 查看</el-button>
            <div v-if="row.contStatus!=5" class="erc-divider-vertical" />
            <el-button v-if="row.contStatus!=5" type="text" @click="handleDwonload(row)"> 下载</el-button>
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

  </div>
</template>

<script>
import * as contractServer from '@/api/contract'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const CONTRACT_STATUS = {
  '4': '完成',
  '5': '已作废'
}
export default {
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      if (status === '0' || status === '2') {
        return ''
      } else if (status === '3' || status === '1') {
        return 'success'
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
          payMethod: '',
          payMethodDesc: '',
          validity: ''
        },
        cusContBaseInfoTdo: {
          organId: '',
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
      collapNames: ['1'],
      restaurants: []
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      contractServer.findHisContInfosByCondition(this.searchForm).then(res => {
        if (res.code === 200 && res.result) {
          this.contractData = res.result.records
          this.total = res.result.total
        }
      })
    },
    handleDetail(row) {
      contractServer.findContFileById(row.id).then(res => {
        if (res.code === 200 && res.result && res.result.length > 0) {
          // this.$router.push(`/report/pdfView/${res.result}/1`)
          this.$router.push({ name: 'sysPdfView', params: { path: res.result, type: 1 }})
        } else {
          this.$message.error('合同PDF还未生成')
        }
      })
    },
    handleDwonload(row) {
      var url = '/api/word/downLoadContract?contCode=' + row.contCode
      window.open(url)
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
