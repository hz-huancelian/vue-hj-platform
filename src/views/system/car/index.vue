<template>
  <div class="app-container">
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="21">
          <el-form-item label="车辆编号:">
            <el-input v-model="searchForm.carBaseNumber" style="width:165px" placeholder="车辆编号" />
          </el-form-item>
          <el-form-item label="车牌号:">
            <el-input v-model="searchForm.carNumber" style="width:165px" placeholder="车牌号" />
          </el-form-item>
          <el-form-item label="车辆状态:">
            <el-select v-model="searchForm.carStatus" clearable style="width:160px" filterable placeholder="车辆状态">
              <el-option
                v-for="item in Object.keys(USE_STATUS)"
                :key="item"
                :label="USE_STATUS[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3" class="search-right">
          <el-button type="text" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      stripe
      :data="carData"
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
      <el-table-column prop="carBaseNumber" label="车辆编号" align="center" />
      <el-table-column prop="carNumber" label="车牌号" align="center" />
      <el-table-column prop="carType" label="品牌型号" align="center" />
      <el-table-column prop="location" label="当前位置" align="center" />
      <el-table-column prop="repairTime" label="维保时间" align="center" />
      <el-table-column prop="carStatus" label="车辆状态" align="center">
        <template slot-scope="{row}">
          {{ USE_STATUS[row.carStatus] }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="使用人员" align="center" />

      <el-table-column prop="remark" label="备注" align="center" />

      <el-table-column fixed="right" align="center" width="130px" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)"> 编辑</el-button>
          <div class="erc-divider-vertical" />
          <el-button type="text" @click="handleDelete(scope.row.id)"> 删除</el-button>
          <div class="erc-divider-vertical" />
          <el-button type="text" @click="handleDispatch(scope.row.id)"> 调度</el-button>
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

    <el-dialog :title="titleMap[carDialogStatus]" :visible.sync="carDialogVisible" width="600px" center>
      <div style="padding: 30px;">
        <el-form ref="carForm" :model="carForm" :rules="carRules" label-width="100px" style="">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="carBaseNumber" label="车辆编号:">
                <el-input v-model="carForm.carBaseNumber" placeholder="请录入车辆编号" maxlength="25" style="width: 80%;" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="carNumber" label="车牌号:">
                <el-input v-model="carForm.carNumber" placeholder="请录入车牌号" style="width: 80%;" maxlength="25" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="carType" label="品牌型号:">
                <el-input v-model="carForm.carType" placeholder="请录入品牌型号" style="width: 80%;" maxlength="25" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="location" label="当前位置:">
                <el-input v-model="carForm.location" placeholder="当前位置" style="width: 80%;" maxlength="20" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="repairTime" label="维保日期:">
                <el-date-picker
                  v-model="carForm.repairTime"
                  value-format="yyyy-MM-dd"
                  placeholder="维保日期"
                  style="width:80%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="remark" label="备注:">
                <el-input v-model="carForm.remark" type="textarea" :rows="3" placeholder="备注" style="width: 80%;" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="carDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="车辆调度" :visible.sync="carDisVisible" width="600px" center>
      <el-form ref="disForm" :model="disForm" :rules="disRules" label-width="100px" style="">
        <el-row>
          <el-col :span="24">
            <el-form-item label="车辆状态:">
              <el-radio-group v-model="disForm.carStatus">
                <el-radio :label="0">闲置中</el-radio>
                <el-radio :label="1">使用中</el-radio>
                <el-radio :label="2">维修中</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="location" label="当前位置:">
              <el-input v-model="disForm.location" placeholder="当前位置" style="width: 80%;" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col v-if="disForm.carStatus == 1" :span="24">
            <el-form-item prop="username" label="使用人员:">
              <el-input v-model="disForm.username" placeholder="请录入使用人员" style="width: 80%;" maxlength="25" />
            </el-form-item>
          </el-col>
          <el-col v-if="disForm.carStatus == 1" :span="24">
            <el-form-item prop="linkmethod" label="联系电话:">
              <el-input v-model="disForm.linkmethod" placeholder="请录联系电话" style="width: 80%;" maxlength="25" />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="carDisVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDisDialog">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import * as carServer from '@/api/car'
import { validPhone } from '@/utils/validate'

const USE_STATUS = {
  '0': '闲置中',
  '1': '使用中',
  '2': '维修中'
}
import * as dictServer from '@/api/dict'
export default {
  components: { Pagination },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value && value.length > 0) {
        if (validPhone(value)) {
          callback()
        } else {
          callback(new Error('输入正确的电话号码'))
        }
      } else {
        callback()
      }
    }
    return {
      USE_STATUS,
      searchForm: {
        carBaseNumber: '',
        carNumber: '',
        carStatus: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      carData: [],
      carDialogStatus: 'create',
      carDialogVisible: false,
      titleMap: {
        edit: '修改车辆',
        create: '新增车辆'
      },
      carForm: {
        id: '',
        carBaseNumber: '',
        carNumber: '',
        carType: '',
        location: '',
        repairTime: '',
        remark: ''
      },
      carDisVisible: false,
      disForm: {
        carId: '',
        carStatus: 0,
        username: 0,
        linkmethod: '',
        location: ''
      },
      carRules: {
        carBaseNumber: [{ required: true, message: '请录入车辆编号', trigger: 'blur' }],
        carNumber: [{ required: true, message: '请录入车牌号', trigger: 'blur' }],
        carType: [{ required: true, message: '请录入品牌型号', trigger: 'blur' }],
        location: [{ required: true, message: '请录入当前位置', trigger: 'blur' }]
      },
      disRules: {
        location: [{ required: true, message: '请录入当前位置', trigger: 'blur' }],
        username: [{ required: true, message: '请录入使用人员', trigger: 'blur' }],
        linkmethod: [{ required: true, message: '请录联系电话', trigger: 'blur' }, { required: true, validator: validatePhone, trigger: 'blur' }]
      }
    }
  },
  created() {
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
    handleSearch() {
      carServer.findByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.carData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    handleDispatch(id) {
      this.disForm = {
        carId: id,
        carStatus: 0,
        username: '',
        linkmethod: '',
        location: ''
      }
      this.carDisVisible = true
    },
    handleAdd() {
      this.clearForm()
      this.carDialogStatus = 'create'
      this.carDialogVisible = true
    },
    handleUpdate(row) {
      this.clearForm()
      this.carForm.id = row.id
      this.carForm.carBaseNumber = row.carBaseNumber
      this.carForm.carNumber = row.carNumber
      this.carForm.carType = row.carType
      this.carForm.location = row.location
      this.carForm.repairTime = row.repairTime
      this.carForm.remark = row.remark
      // 获取二级类别字典

      this.carDialogStatus = 'edit'
      this.carDialogVisible = true
    },
    clearForm() {
      this.carForm = {
        id: '',
        carBaseNumber: '',
        carNumber: '',
        carType: '',
        location: '',
        repairTime: '',
        remark: ''
      }
    },
    confirmDisDialog() {
      this.$refs.disForm.validate(valid => {
        if (valid) {
          carServer.carScheduling(this.disForm).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.carDisVisible = false
            this.$refs.disForm.resetFields()
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    confirmDialog() {
      if (this.carDialogStatus === 'create') {
        carServer.saveCar(this.carForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.carDialogVisible = false
          } else {
            this.$notify({
              title: '失败',
              message: result.message,
              type: 'error'
            })
          }
        })
      } else {
        carServer.updateCar(this.carForm).then(result => {
          if (result.code === 200) {
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            })
            this.handleSearch()
            this.carDialogVisible = false
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
        carServer.delEquipment(id).then(result => {
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
