<template>
  <div>
    <el-table
      :data="taskData"
      stripe
      border
      highlight-current-row
      :header-cell-style="{background:'#ECF3FC'}"
    >
      <template slot="empty">
        <div class="table_empty">
          <div class="empty_tips">
            <span>
              暂无任务信息
            </span>
          </div>
        </div>
      </template>
      <el-table-column type="index" width="50" label="序号" align="center" />
      <el-table-column prop="contCode" label="合同编号" align="center" />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="consignorName" label="委托单位" align="center" />
      <el-table-column prop="scheduProgress" label="调度进度" align="center" />
      <el-table-column prop="latestScheduDate" label="上次调度" align="center" />
      <el-table-column prop="finishProgress" label="计划调度完成进度" align="center" />
      <!-- <el-table-column prop="latestFinishDate" label="上次完成" align="center" /> -->
      <el-table-column prop="scheduStatus" label="状态" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="handleDetail(row)"> 查看</el-button>
          <div class="erc-divider-vertical" />
          <el-button type="text" @click="handleScheduler(row)"> 分配</el-button>
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
  </div>
</template>
