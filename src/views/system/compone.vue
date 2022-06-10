<template>
  <div class="app-container">
    <el-card header="机构信息维护" shadow="never" style="min-height:600px">
      <div style="width: 98%;margin:0 auto">
        <el-form ref="contractForm" :model="contractForm" :rules="contractRules" label-width="110px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="organName" label="机构名称:">
                <el-input v-model="contractForm.organName" :disabled="isEdit" maxlength="20" style="width: 350pxpx" placeholder="请录入机构名称" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item prop="contControlId" label="文档控制编号">
                <el-input v-model="contractForm.contControlId" style="width: 350pxpx" maxlength="20" placeholder="请录入文档控制编号" />
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item prop="jurPerson" label="法定代表人:">
                <el-input v-model="contractForm.jurPerson" style="width: 350pxpx" maxlength="10" placeholder="请录入法人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="address" label="通讯地址:">
                <el-input v-model="contractForm.address" style="width: 350pxpx" maxlength="35" placeholder="请录入通讯地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="postCode" label="邮政编码:">
                <el-input v-model="contractForm.postCode" style="width: 350pxpx" maxlength="6" placeholder="请录入邮编" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="agentPerson" label="委托代理人:">
                <el-input v-model="contractForm.agentPerson" style="width: 350pxpx" maxlength="12" placeholder="请录入委托代理人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="telFax" label="电话/传真:">
                <el-input v-model="contractForm.telFax" style="width: 350pxpx" maxlength="15" placeholder="请录入电话/传真" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="bankName" label="开户行:">
                <el-input v-model="contractForm.bankName" style="width: 350pxpx" maxlength="30" placeholder="请录入开户行" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="bankNo" label="银行账号:">
                <el-input v-model="contractForm.bankNo" style="width: 350pxpx" maxlength="30" placeholder="请录入银行卡号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="taxNumber" label="企业税号:">
                <el-input v-model="contractForm.taxNumber" style="width: 350pxpx" maxlength="20" placeholder="请录入税号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center;">
              <el-button type="primary" @click="confirm"> 保 存 </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>

  </div>
</template>

<script>
import * as ownerServer from '@/api/ownerContract'
export default {
  data() {
    return {
      contractForm: {
        id: '',
        organName: '',
        contControlId: 'HT001',
        address: '',
        postCode: '',
        jurPerson: '',
        agentPerson: '',
        telFax: '',
        bankName: '',
        bankNo: '',
        taxNumber: ''
      },
      isEdit: false,
      contractRules: {
        organName: [{ required: true, message: '请录入机构名称', trigger: 'blur' }],
        address: [{ required: true, message: '请录入机构地址', trigger: 'blur' }],
        postCode: [{ required: true, message: '请录入邮政编号', trigger: 'blur' }],
        jurPerson: [{ required: true, message: '请录入法人', trigger: 'blur' }],
        agentPerson: [{ required: true, message: '请录入委托代理人', trigger: 'blur' }],
        telFax: [{ required: true, message: '请录入电话/传真', trigger: 'blur' }],
        bankName: [{ required: true, message: '请录入开户行', trigger: 'blur' }],
        bankNo: [{ required: true, message: '请录入银行卡号', trigger: 'blur' }],
        taxNumber: [{ required: true, message: '请录入企业税号', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getOwnInfo()
  },
  methods: {
    getOwnInfo() {
      if (this.$store.getters.organId) {
        ownerServer.findByOrganId(this.$store.getters.organId).then(res => {
          if (res.code === 200 && res.result) {
            this.contractForm = res.result
            this.isEdit = true
          }
        })
      }
    },
    confirm() {
      this.$refs.contractForm.validate(valid => {
        if (valid) {
          this.contractForm.contControlId = 'HT001'
          if (!this.isEdit) {
            ownerServer.addOwnerContBase(this.contractForm).then(result => {
              if (result.code === 200) {
                this.$notify({
                  title: '成功',
                  message: result.message,
                  type: 'success'
                })
                this.getOwnInfo()
              } else {
                this.$notify({
                  title: '失败',
                  message: result.message,
                  type: 'error'
                })
              }
            })
          } else {
            ownerServer.modifyOwnerContBaseById(this.contractForm).then(result => {
              if (result.code === 200) {
                this.$notify({
                  title: '成功',
                  message: result.message,
                  type: 'success'
                })
              } else {
                this.$notify({
                  title: '失败',
                  message: result.message,
                  type: 'error'
                })
              }
            })
          }
        } else {
          this.$message.error('请录入完整信息')
        }
      })
    }
  }
}
</script>

<style scoped>

  ::v-deep .el-card .el-card__header {
    padding: 15px 20px;
    background: #F3F2F2;
  }
</style>
