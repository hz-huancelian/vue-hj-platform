<template>
  <div class="detail-continer">
    <el-card shadow="never" class="card-continer" style="height:550px">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="8">
            <span>样品列表<i class="el-input__icon" /></span>
          </el-col>
          <el-col :span="8">
            <template v-if="showTitle">
              <el-row style="text-align:center;;font-size:14px;">
                <el-col :span="24">Web打印服务CLodop未安装启动，<a href="#" style="color:red" @click="fileDownLoad">点击这里下载执行安装</a></el-col>
              </el-row>
              <el-row style="text-align:center;font-size:14px;padding-top:3px;">
                <el-col :span="24">(若此前已安装过，<a href="#" style="color:red" @click="tabPrint">可点这里直接再次启动</a>），成功后请刷新本页面。</el-col>
              </el-row>
            </template>
            <template v-else>
              <div style="visibility: hidden;">信息提示</div>
            </template>
          </el-col>
          <el-col :span="8" style="padding: 5px;text-align:right">
            <el-button type="primary" size="mini" @click="pageBack"> 返回</el-button>
            <el-button type="primary" size="mini" @click="tabPrint"> 标签打印</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        stripe
        border
        :data="sampleData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
        max-height="420px"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无样品
              </span>
            </div>
          </div>
        </template>
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column prop="sampleNo" label="样品编号" width="150" align="center" />
        <el-table-column prop="secdClassName" label="检测类别" align="center" />
        <el-table-column prop="factorName" label="检测因子" min-width="170px" align="center" />
        <el-table-column prop="factorPoint" label="检测位置" align="center" />
        <el-table-column prop="dayAndCount" label="频次(天/次)" width="130px" align="center" />
        <!-- <el-table-column prop="inspectionName" label="受检单位" :show-overflow-tooltip="true" align="center" /> -->
        <el-table-column prop="smapStatus" label="样品状态" width="120px" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.smapStatus|statusQualityFilter">
              {{ SAMPLE_STATUS[row.smapStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sampleType" label="是否分包" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.sampleType==='1'?'danger':'success'">
              {{ row.sampleType==='1'?'分包':'自检' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div style="float: right">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="searchForm.pageNumber"
          :limit.sync="searchForm.pageSize"
          style="padding-top: 10px;"
          @pagination="handleSearch"
        />
      </div>
    </el-card>
    <div class="footer">
      <el-row style="color: red;">
        <el-col :span="24">
          提示：
        </el-col>
      </el-row>
      <el-row style="color: red;">
        <el-col :span="24">
          1. 打印样品标签需要用到【热敏打印机】以及【三防热敏标签纸】；
        </el-col>
      </el-row>

      <el-row style="color: red;">
        <el-col :span="24">
          2. 由于一般电脑不带蓝牙，打印机建议使用USB版，而不是蓝牙版，推荐使用得力DL-888D型号；
        </el-col>
      </el-row>

      <el-row style="color: red;">
        <el-col :span="24">
          3. 三防热敏标签纸的尺寸为60*40mm，推荐得力品牌。
        </el-col>
      </el-row>

    </div>

    <div style="overflow: auto;opacity:0;">
      <div id="labelPrint" ref="labelPrint" style="margin: 0;padding: 5px; ">
        <div
          v-for="item in printList"
          :key="item.sampItemId"
          style="width: 60mm;height: 40mm;margin: 0; padding: 0px; font-size:12px;;"
        >
          <div style="padding-left: 10px;padding-top:6px;display: flex;">
            <div style="padding: 0px;line-height: 4mm;">受检单位:</div>
            <div style="padding-left: 10px;line-height: 4mm;">{{ item.inspectionName|ellipsis }}</div>
          </div>
          <div style="padding-left: 10px;display: flex;">
            <div style="padding:  0px;line-height: 4mm;">样品类别:</div>
            <div style="padding-left: 10px;line-height: 4mm;">{{ item.secdClassName }}</div>
          </div>
          <div style="padding-left: 10px;display: flex;">
            <div style="padding:  0px;line-height: 4mm;">检测因子:</div>
            <div style="padding-left: 10px;line-height: 4mm;">{{ item.factorName|ellipsis }}</div>
          </div>
          <div style="text-align: center; font-size: 12px;">
            <barcode :value="item.sampleNo" :options="barcode_option" tag="svg" />
          </div>
          <div style="padding-left: 10px;display: flex;">
            <div style="padding:  0px;line-height: 3mm;width: 8mm">点位:</div>
            <div style="padding:  0px;line-height: 3mm;width: 29mm;text-align:center;">{{ item.factorPoint }}</div>
            <div style="padding:  0px;line-height: 3mm;width: 11mm">次/天:</div>
            <div style="padding:  0px;line-height: 3mm;width: 8mm;text-align:center;">{{ item.frequency?item.frequency:'' }}/{{ item.day?item.day:'' }}</div>
          </div>
          <div style="padding-left: 10px;display: flex;">
            <div style="padding:  0px;line-height: 3mm;">状态:</div>
            <div style="padding-left: 10px;line-height: 4mm;">□未检 □在检 □已检</div>
          </div>
          <div style="padding-left: 10px;display: flex;">
            <div style="padding:  0px;line-height: 3mm;width: 14mm">日期:</div>
            <div style="padding:  0px;line-height: 3mm;width: 14mm">&nbsp;</div>
            <div style="padding:  0px;line-height: 3mm;width: 14mm">采样人:</div>
            <div style="padding:  0px;line-height: 3mm;width: 14mm">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as sampleServer from '@/api/sample'
import { getLodop } from '@/utils/LodopFuncs'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const SAMPLE_STATUS = {
  '0': '待采样',
  '1': '已采样',
  '2': '待组长审核',
  '3': '待负责人审核',
  '4': '审核通过',
  '5': '审核失败',
  '6': '已入库',
  '7': '部分出库',
  '8': '已出库',
  '9': '入库中',
  '10': '待复核'
}
export default {
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      if (status === '0' || status === '1') {
        return ''
      } else if (status === '2' || status === '3') {
        return 'info'
      } else if (status === '4' || status > 5) {
        return 'success'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      SAMPLE_STATUS,
      sampleData: [],
      searchForm: {
        sampTaskId: '',
        pageNumber: 1,
        pageSize: 50
      },
      total: 0,
      multipleSelection: [],
      barcode_option: {
        format: 'CODE128',
        displayValue: true, // 是否默认显示条形码数据
        background: 'rgba(255,255,255,.0)', // 条形码背景颜色
        width: '1.3px', // 单个条形码的宽度
        fontOptions: 'bold',
        height: '30mm',
        fontSize: '12px', // 字体大小
        textMargin: 0,
        font: '12px/1.5 arial,"黑体"',
        textAlign: 'center', // 设置文本的水平对齐方式
        margin: 5
      },
      printList: [],
      showTitle: false
    }
  },
  created() {
    if (this.$route.params.sampTaskId) {
      this.searchForm.sampTaskId = this.$route.params.sampTaskId
      this.handleSearch()
    }
  },
  methods: {
    handleSearch() {
      sampleServer.getSampleItemBySampTaskId(this.searchForm).then(result => {
        if (result.code === 200 && result.result) {
          this.sampleData = result.result.records || []
          this.total = result.result.total
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    tabPrint() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.printList = this.multipleSelection
        this.$nextTick(() => {
          this.tagPrint()
        })
      } else {
        this.$message.info('最少选择一条记录信息')
      }
    },
    tagPrint() {
      const LODOP = getLodop()
      setTimeout(() => {
        this.$nextTick(() => {
          if (LODOP !== undefined) {
            LODOP.PRINT_INIT('标签')
            LODOP.ADD_PRINT_HTM(0, 0, '60mm', '40mm',
              document.getElementById('labelPrint').innerHTML)
            // LODOP.PRINT()
            LODOP.SET_PRINT_MODE('TRYLINKPRINTER_NOALERT', true)// 这个语句设置网络共享打印机连接不通时是否提示一下
            LODOP.PREVIEW()
            // LODOP.PRINT_DESIGN()
          } else {
            // 显示提示信息
            this.showTitle = true
            // this.$print(this.$refs.labelPrint)
          }
          this.showPrint = false
        })
      }, 1000)
    },
    pageBack() {
      this.$router.back()
    },
    fileDownLoad() {
      var url = this.$store.getters.sysBaseUrl + '/downLoad/CLodop_Setup_for_Win32NT.exe'
      window.open(url)
    }
  }
}
</script>

<style scoped lang="scss" type="text/scss">
  .detail-continer{
    padding: 18px;
    background-color: #fff;
    margin:8px 10px;
    min-height: calc(100vh - 130px);
    border-radius: 5px;
  }

  .footer{
    height: 100px;
    width: 100%;
    bottom: 10px;
    font-size: 14px;
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

</style>
