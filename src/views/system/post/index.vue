<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="岗位名称" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入岗位名称"
          clearable
          style="width: 180px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:post:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="postList">
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <!-- <el-table-column key="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==='0'?'success':'danger'">{{ scope.row.status==='0'?'正常':'停用' }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="备注" align="center" show-overflow-tooltip prop="remark" />
      <el-table-column label="创建日期" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:post:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['system:post:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" />
        </el-form-item>
        <!-- <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="item in Object.keys(POST_STATUS)"
              :key="item"
              :label="item"
            >{{ POST_STATUS[item] }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
            show-word-limit
            :rows="6"
            maxlength="120"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost, exportPost } from '@/api/system/post'
const POST_STATUS = {
  '0': '正常',
  '1': '停用'
}
export default {
  name: 'Post',
  data() {
    return {
      POST_STATUS,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        postCode: '',
        postName: '',
        status: '0'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        postName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
        ]
        // postCode: [
        //   { required: true, message: '岗位代号不能为空', trigger: 'blur' }
        // ]
        // postSort: [
        //   { required: true, message: '岗位顺序不能为空', trigger: 'blur' }
        // ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      listPost(this.queryParams).then(response => {
        this.postList = response.result || []
        // this.total = response.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 岗位状态字典翻译
    statusFormat(row, column) {
      return POST_STATUS[row.status]
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        postId: undefined,
        postCode: 'emp',
        postName: undefined,
        postSort: 0,
        status: '0',
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.postId)
    //   this.single = selection.length !== 1
    //   this.multiple = !selection.length
    // },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加岗位'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form.postId = row.postId
      this.form.postName = row.postName
      this.form.postSort = row.postSort
      this.form.status = row.status
      this.form.remark = row.remark
      this.open = true
      this.title = '修改岗位'
      // getPost(postId).then(response => {
      //   this.form = response.data
      // })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.postId !== undefined) {
            updatePost(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPost(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.postId
      this.$confirm('是否确认删除岗位为"' + row.postName + '"的数据信息?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delPost(postIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有岗位数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exportLoading = true
        return exportPost(queryParams)
      }).then(response => {
        this.download(response.msg)
        this.exportLoading = false
      }).catch(() => {})
    }
  }
}
</script>
