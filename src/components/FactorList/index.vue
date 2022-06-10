<template>
  <div>
    <el-form ref="innerSearchForm" :model="searchForm" :inline="true">
      <el-form-item label="检测对象:">
        <el-select v-model="searchForm.classId" size="small" clearable style="width:165px" filterable placeholder="检测对象" @change="findSecClass">
          <el-option
            v-for="item in classArray"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="检测类别:">
        <el-select v-model="secdClassId" size="small" clearable style="width:165px" filterable placeholder="检测类别" @change="handleSearch">
          <el-option
            v-for="item in secClassArray"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检测因子:">
        <el-input v-model="searchForm.factorName" size="small" placeholder="检测因子" />
      </el-form-item>
      <el-form-item label="标准号:">
        <el-input v-model="searchForm.standardNo" size="small" placeholder="标准号" />
      </el-form-item>
      <el-form-item label="标准名称:">
        <el-input v-model="searchForm.standardName" size="small" placeholder="标准名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="iconfont icon-chaxun1" size="small" @click="handleSearch"> 查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table
        ref="compData"
        stripe
        size="small"
        :data="factorData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
        max-height="300px"
        @selection-change="handleSelectionChange"
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
        <el-table-column type="selection" width="55" align="center" />
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
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import * as factorServer from '@/api/factor'
import * as dictServer from '@/api/dict'
const STOKEN_STUTS = {
  '0': '现行',
  '1': '自定义标准',
  '2': '试行'
}
export default {
  components: { Pagination },
  props: {
    showSelect: {
      type: Boolean,
      default: true
    },
    authType: {
      type: String,
      default: ''
    },
    choseRow: {
      type: Object,
      default: function() {
        return {}
      }
    },
    clearType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      STOKEN_STUTS,
      searchForm: {
        classId: '',
        factorName: '',
        authType: '',
        standardNo: '',
        standardName: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      factorData: [],
      categoryArray: [],
      classArray: [],
      secClassArray: [],
      secdClassId: ''
    }
  },
  watch: {
    clearType() {
      this.searchForm = {
        classId: '',
        factorName: '',
        authType: '',
        standardNo: '',
        standardName: '',
        pageNumber: 1,
        pageSize: 10
      }
      this.factorData = []
    },
    async choseRow(val) {
      console.log(val)
      debugger
      if (val) {
        this.$refs.compData.toggleRowSelection(val, false)
      }
    }
  },
  created() {
    console.log(':::' + this.$store.state.user.resetForm)
    this.getClassList()
    // this.handleSearch()
  },
  methods: {
    getClassList() {
      dictServer.findFstClasses().then(res => {
        this.classArray = res.result || []
      })
    },
    findSecClass(val) {
      this.secdClassId = ''
      this.searchForm.pageNumber = 1
      if (val.length > 0) {
        dictServer.findSecdClassByClassId(val).then(res => {
          this.secClassArray = res.result || []
        })
      }
    },
    handleSearch() {
      if (this.secdClassId && this.secdClassId.length > 0) {
        this.searchForm.authType = ''
        factorServer.getFactorListForPage(this.searchForm).then(res => {
          if (res.code === 200) {
            this.factorData = res.result.records || []
            this.total = res.result.total
          }
        })
      } else {
        this.$message.warning('请先选择对应的检测类别和认证类型!')
      }
    },
    handleSelectionChange(val) {
      debugger
      if (val && val.length > 0) {
        const o = this.secClassArray.find(i => i.id === this.secdClassId)
        val.forEach(i => {
          this.$set(i, 'secdClassId', this.secdClassId)
          this.$set(i, 'secdClassName', o.name)
        })
      }
      this.$emit('pageChose', val)
      // if (this.searchForm.authType === this.authType) {
      // } else {
      //   this.$message.warning('认证类型不匹配不能添加!')
      // }
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
</style>
