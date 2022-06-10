<template>
  <div>
    <el-form :model="searchForm" :inline="true">
      <el-row>
        <el-col :span="20">
          <el-form-item label="项目名称:">
            <el-input v-model="searchForm.projectName" style="width:165px" placeholder="项目名称" />
          </el-form-item>
          <el-form-item label="报价单号:">
            <el-input v-model="searchForm.id" style="width:165px" placeholder="报价单号" />
          </el-form-item>
          <el-form-item label="报价单状态:">
            <el-select v-model="searchForm.status" clearable style="width:160px" filterable placeholder="报价单状态">
              <el-option
                v-for="item in Object.keys(ACCOUNT_STATUS)"
                :key="item"
                :label="ACCOUNT_STATUS[item]"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="iconfont icon-chaxun1" @click="handleSearch"> 查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="search-right">
          <el-button v-hasPermi="['order:list:add']" type="text" icon="el-icon-plus" @click="handleCreate">新增</el-button>
          <el-button type="text" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table
        stripe
        :data="orderData"
        highlight-current-row
        :header-cell-style="{background:'#ECF3FC'}"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="table_empty">
            <div class="empty_tips">
              <span>
                暂无报价单,
              </span>
              <el-button type="text" size="mini" style="font-size:14px;" @click="handleCreate">新建报价单</el-button>
            </div>
          </div>
        </template>
        <el-table-column type="index" width="55" label="序号" align="center" />
        <el-table-column prop="projectName" label="项目名称" min-width="150px" align="center" />
        <el-table-column prop="id" label="报价单号" sortable width="170px" align="center" />
        <el-table-column prop="checkType" label="检测类型" width="90px" align="center">
          <template slot-scope="{row}">
            {{ row.checkType === '0'?"委托检测":"样品送检" }}
          </template>
        </el-table-column>
        <el-table-column prop="certificationType" label="认证类型" width="90px" align="center">
          <template slot-scope="{row}">
            {{ row.certificationType === '1'?"CMA":"CNAS" }}
          </template>
        </el-table-column>
        <el-table-column prop="consignorName" label="客户名称" min-width="150px" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.status | statusQualityFilter">
              {{ ACCOUNT_STATUS[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="finishDate" label="客户要求完成时间" width="140" align="center" />
        <el-table-column prop="createUserId" label="报价人" align="center" />
        <el-table-column prop="checkTaskCount" label="任务数" align="center" />

        <el-table-column prop="checkCircle" label="周期" align="center">
          <template slot-scope="{row}">
            {{ CHECK_STATUS[row.checkCircle] }}
          </template>
        </el-table-column>
        <el-table-column prop="draftAmount" label="费用总计(元)" align="center" />
        <!-- <el-table-column prop="auditReason" label="驳回原因" :show-overflow-tooltip="true" width="100px" align="center" /> -->
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />

        <el-table-column fixed="right" align="center" label="操作" width="190">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleDetail(row)"> 查看</el-button>
            <div v-hasPermi="['order:list:update']" class="erc-divider-vertical" />
            <el-button v-hasPermi="['order:list:update']" type="text" @click="handleCopy(row)"> 复制</el-button>
            <div class="erc-divider-vertical" />
            <!-- <el-button type="text" @click="handleDownload(row)"> 下载</el-button>
            <div class="erc-divider-vertical" /> -->

            <el-dropdown size="medium">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-link v-if="row.status === '0' || row.status === '2'" v-hasPermi="['order:list:update']" :underline="false" @click="handleUpdate(row)">
                  <el-dropdown-item>编辑</el-dropdown-item>
                </el-link>
                <el-link v-if="row.status === '0' || row.status === '2'" v-hasPermi="['order:list:update']" :underline="false" @click="handleApprovel(row.id)">
                  <el-dropdown-item>提交审核</el-dropdown-item>
                </el-link>
                <el-link v-if="row.status === '0' || row.status === '2' || row.status === '4'" v-hasPermi="['order:list:del']" :underline="false" @click="handleDelete(row.id)">
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-link>
                <el-link :underline="false" @click="handleDownload(row)">
                  <el-dropdown-item>下载</el-dropdown-item>
                </el-link>
                <el-link v-if="row.status > 1" :underline="false" @click="handleApproveDetail(row)">
                  <el-dropdown-item>审核历史</el-dropdown-item>
                </el-link>
              </el-dropdown-menu>
            </el-dropdown>
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

    <el-dialog :title="titleMap[orderDialogStatus]" :visible.sync="orderDialogVisible" :before-close="handleDialogClose" fullscreen center>
      <el-form ref="orderForm" :model="orderForm" :rules="orderRules">
        <el-card shadow="never">
          <div slot="header">
            <span>项目基础信息<i class="el-input__icon" /></span>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="offerInfoTdo.projectName" label="项目名称:" label-width="100px">
                <el-input v-model="orderForm.offerInfoTdo.projectName" placeholder="项目名称" maxlength="30" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="offerInfoTdo.finishDate" label-width="115px">
                <span slot="label">
                  完成日期
                  <el-popover
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="客户要求的项目完成时间"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                  :
                </span>
                <el-date-picker
                  v-model="orderForm.offerInfoTdo.finishDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                  placeholder="完成日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="offerInfoTdo.certificationType" label="认证类型:" label-width="100px">
                <el-select v-model="orderForm.offerInfoTdo.certificationType" style="width: 100%;" placeholder="检测类型">
                  <el-option value="1" label="CMA" />
                  <el-option value="2" label="CNAS" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item prop="offerInfoTdo.consignorName" label="委托单位:" label-width="100px">
                <el-input v-model="orderForm.offerInfoTdo.consignorName" placeholder="委托单位" maxlength="25" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="offerInfoTdo.consignorLinker" label="委托人:" label-width="110px">
                <el-input v-model="orderForm.offerInfoTdo.consignorLinker" placeholder="委托人" maxlength="10" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="offerInfoTdo.consignorLinkerPhone" label="联系电话:" label-width="100px">
                <el-input v-model="orderForm.offerInfoTdo.consignorLinkerPhone" placeholder="联系电话" maxlength="15" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注:" label-width="80px">
                <el-input v-model="orderForm.offerInfoTdo.remark" type="textarea" :rows="2" show-word-limit placeholder="备注" maxlength="50" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never" style="margin-top:10px;padding-bottom: 10px">
          <div slot="header" class="clearfix">
            <span>检测因子信息<i class="el-input__icon" /></span>
            <el-button style="float: right; margin:4px 2px;" type="primary" plain size="mini" @click="choseGroup">因子套餐</el-button>
            <el-button style="float: right; margin:4px 2px;" type="primary" plain size="mini" @click="addFactor">添加因子</el-button>
          </div>
          <el-table
            :data="orderForm.factorTdos"
            stripe
            highlight-current-row
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{background:'#ECF3FC'}"
            max-height="400px"
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
            <el-table-column prop="factorPoint" label="位置" min-width="180" align="center">
              <template slot-scope="{row}">
                <el-input v-model="row.factorPoint" placeholder="请录入位置" />
              </template>
            </el-table-column>
            <el-table-column prop="className" label="对象" sortable align="center" />
            <el-table-column prop="secdClassName" label="类别" min-width="100px" align="center">
              <template slot-scope="{row}">
                <template v-if="row.meanName && row.meanName.length > 0">
                  {{ row.secdClassName }}<span style="color:red">{{ '('+row.meanName+')' }}</span>
                </template>
                <template v-else>
                  {{ row.secdClassName }}
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="factorName" label="因子" align="center" />
            <el-table-column prop="dayCount" label="天数" width="100px" align="center">
              <template slot-scope="{row}">
                <el-input-number v-model="row.dayCount" size="small" style="width: 100%;" :disabled="row.secdClassId === '002001' || row.secdClassId === '002003'" :min="1" :step="1" :precision="0" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column prop="frequency" label="频次(次/天)" width="100px" align="center">
              <template slot-scope="{row}">
                <el-input-number v-model="row.frequency" size="small" style="width: 100%;" :disabled="row.secdClassId === '002001' || row.secdClassId === '002003'" :min="1" :step="1" :max="row.secdClassId === '004001'?2:10" :precision="0" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column prop="totalNum" label="次数" width="100px" align="center" />
            <el-table-column prop="price" label="单次费用" width="100px" align="center" />
            <el-table-column prop="totalCost" label="总计" width="120px" align="center" />
            <el-table-column align="center">
              <template slot-scope="{$index, row}">
                <el-popover
                  placement="left"
                  width="280"
                  trigger="click"
                >
                  <el-input v-model="row.remark" placeholder="录入备注信息" />
                  <el-button slot="reference" type="text">备注</el-button>
                </el-popover>
                <el-button style="margin-left: 10px;" type="text" @click="handleRowDel($index, row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 15px">
            <el-col :span="8">
              <el-form-item prop="taskNum" label-width="110px">
                <span slot="label">
                  任务总数
                  <el-popover
                    placement="top-start"
                    title=""
                    width="400"
                    trigger="hover"
                    content="任务总数默认为“1”，表示该项目为单次任务；若是周期性项目，
                    则需填写该项目的任务总数（例如，任务总数填写“12”，任务周期选择“年”，表示该任务要求一年内完成12次检测任务数，
                    具体任务时间根据实际情况分配）注意：一份报价单中不可同时包含
                    单次任务和周期任务，也不可包含不同周期的任务。"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                  :
                </span>
                <el-input-number v-model="orderForm.offerInfoTdo.checkTaskCount" controls-position="right" style="width: 75%;" :step="1" :precision="0" :min="1" />
              </el-form-item>
            </el-col>

            <el-col v-if="orderForm.offerInfoTdo.checkTaskCount>1" :span="8">
              <el-form-item label-width="110px">
                <div slot="label">任务周期:</div>
                <el-select v-model="orderForm.offerInfoTdo.checkCircle" style="width: 75%;" placeholder="周期选择">
                  <el-option value="1" label="周" />
                  <el-option value="2" label="月" />
                  <el-option value="3" label="季" />
                  <el-option value="4" label="半年" />
                  <el-option value="5" label="年" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="135px">
                <span slot="label">
                  报告编制费(%)
                  <el-popover
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="单次任务报告编制费所占总检测费的比例"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                  :
                </span>
                <el-input-number v-model="orderForm.offerCostTdo.reportAmountRate" class="i-input" controls-position="right" :precision="0" :min="0" style="width: 75%;" :max="100" placeholder="报告编制费" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="110px">
                <span slot="label">
                  加急费(元)
                  <el-popover
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="单次任务加急费"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                  :
                </span>
                <el-input-number v-model="orderForm.offerCostTdo.expediteAmount" :min="0" controls-position="right" :precision="2" style="width: 75%;" placeholder="加急费" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="110px">
                <span slot="label">采样费(元)
                  <el-popover
                    slot="suffix"
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="单次任务费用"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>:</span>
                <el-input-number v-model="orderForm.offerCostTdo.laborAmount" :min="0" controls-position="right" :precision="2" style="width: 75%;" placeholder="采样费" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="135px">
                <span slot="label">差旅费(元)
                  <el-popover
                    slot="suffix"
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="单次任务费用"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>:</span>
                <el-input-number v-model="orderForm.offerCostTdo.tripAmount" :min="0" controls-position="right" :precision="2" style="width: 75%;" placeholder="差旅费" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="110px">
                <span slot="label">
                  税率(%)
                  <el-popover
                    placement="top-start"
                    title=""
                    width="300"
                    trigger="hover"
                    content="单次任务费用"
                  >
                    <svg-icon slot="reference" icon-class="help" style="font-size:16px" />
                  </el-popover>
                  :
                </span>
                <el-input-number v-model="orderForm.offerCostTdo.taxAmountRate" class="i-input" style="width: 75%;" controls-position="right" :precision="0" :min="0" :max="100" placeholder="税率" />
              </el-form-item>
            </el-col>

            <el-col v-for="(item, index) in orderForm.selfCostTdos" :key="index" :span="8">
              <el-form-item label-width="110px">
                <div slot="label">{{ item.selfName }}:</div>
                <el-input v-model="item.amount" type="number" min="0" style="width: 65%;margin-right:3px" placeholder="金额信息" />
                <el-button type="text" size="small" @click.prevent="removeDomain(item)">删除</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label-width="110px">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showAddPrice">新增费用</el-button>
              </el-form-item>
            </el-col>

          </el-row>
        </el-card>
        <el-card shadow="never" style="margin-top:10px;padding-bottom: 10px">
          <div slot="header" class="clearfix">
            <span>费用统计</span>
          </div>
          <el-form label-width="130px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="检测费合计:">
                  <span>{{ orderForm.offerCostTdo.checkAmount|MoneyFormat }}</span> 元
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报告编制费:">
                  <span>{{ orderForm.offerCostTdo.reportAmount|MoneyFormat }}</span> 元
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报告加急费:">
                  <span>{{ (orderForm.offerCostTdo.expediteAmount * orderForm.offerInfoTdo.checkTaskCount)|MoneyFormat }}</span> 元
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="采样费:">
                  <span>{{ (orderForm.offerCostTdo.laborAmount * orderForm.offerInfoTdo.checkTaskCount)|MoneyFormat }}</span> 元
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="差旅费:">
                  <span>{{ (orderForm.offerCostTdo.tripAmount * orderForm.offerInfoTdo.checkTaskCount)|MoneyFormat }}</span> 元
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="税额:">
                  <span>{{ orderForm.offerCostTdo.taxAmount|MoneyFormat }}</span> 元
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="额外费用:">
                  <span>{{ otherPrice|MoneyFormat }}</span> 元
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :span="24" style="text-align:right;line-heigh: 2em;">
              <div style="position: relative;display:inline-flex;line-height:2em;">
                <span style="margin-right:10px;">费用总计:</span>
                <div style="position: relative;width:100px;padding:0 15px;">{{ orderForm.offerCostTdo.sysAmount|MoneyFormat }}</div> 元
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:right">
              <span style="margin-right:5px;"><span style="color: red;padding-right: 4px;vertical-align: sub;">*</span>优惠价:</span>
              <el-input v-model="orderForm.offerCostTdo.draftAmount" class="right-input" style="width: 100px" @input="validatoProInput" /> 元
            </el-col>
          </el-row>
        </el-card>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确认</el-button>
      </div>

      <el-dialog title="额外费用" :visible.sync="innerPriceVisible" append-to-body width="60%" top="5vh">
        <div style="width: 450px;margin:0 auto;">
          <el-form :model="addPriceForm" label-width="90px">
            <el-form-item label="费用名目:">
              <el-input v-model="addPriceForm.selfName" placeholder="费用名目" style="width:250px;" />
            </el-form-item>
            <el-form-item label="金额(元):">
              <el-input v-model="addPriceForm.amount" placeholder="金额" style="width:250px;" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerPriceVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmPrice">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog title="因子选择" :visible.sync="factorVisible" append-to-body width="85%" :close-on-click-modal="false" top="5vh">
        <div>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-card class="card-left" shadow="never">
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
                    max-height="310px"
                    :header-cell-style="{background:'#ECF3FC'}"
                    @select="handleSelectChange"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column prop="className" label="检测对象" width="100px" align="center" />
                    <el-table-column prop="factorName" label="检测因子" align="center" />
                    <el-table-column prop="standardName" label="检测标准" min-width="130px" align="center" />
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
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="factorVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmChoseFactor">确认</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <el-dialog :title="'报价单(' +orderDetailForm.offerId+ ')'" :visible.sync="detailVisible" top="5vh" width="70%">
      <el-form label-position="right" label-width="135px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称:">{{ orderDetailForm.offerBaseVo.consignorName || '' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人:">{{ orderDetailForm.offerBaseVo.consignorLinker || '' }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:">{{ orderDetailForm.offerBaseVo.consignorLinkerPhone || '' }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户要求完成时间:">{{ orderDetailForm.offerBaseVo.finishDate|Time2Format }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注:">{{ orderDetailForm.offerBaseVo.remark || '' }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider>因子列表</el-divider>
      <div class="table-responsive">
        <table class="table table-bordered table-hover" cellspacing="1" cellpadding="0  ">
          <thead>
            <tr>
              <th rowspan="2">序号</th>
              <th rowspan="2">检测类别</th>
              <th colspan="3">检测项目</th>
              <th rowspan="2">频次(次/天)</th>
              <th rowspan="2">天数</th>
              <th rowspan="2">次数</th>
              <th rowspan="2">检测费(元)</th>
              <th rowspan="2">总计(元)</th>
            </tr>
            <tr>
              <th>序号</th>
              <th>检测位置</th>
              <th>因子</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in orderDetailForm.factorTdos" :key="index">
              <template v-if="item.dateType == 0">
                <template v-if="item.frIndex==0">
                  <td :rowspan="item.detailLength">{{ item.id }}</td>
                  <td :rowspan="item.detailLength">{{ item.secName }}</td>
                </template>
                <td>{{ item.sid }}</td>
                <td>{{ item.factorPoint }}</td>
                <td>{{ item.factorName }}{{ item.meanName&&item.meanName.length > 0?'('+ item.meanName +')':'' }}</td>
                <td>{{ item.frequency }}</td>
                <td>{{ item.dayCount }}</td>
                <td>{{ Number(item.frequency*item.dayCount).toFixed(0) }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.totalCost|MoneyFormat }}</td>
              </template>
              <template v-else>
                <td colspan="7">小计</td>
                <td>{{ item.totalPrice }}</td>
              </template>
            </tr>
          </tbody>
          <tfoot>
            <tr><td colspan="9">{{ orderDetailForm.offerBaseVo.checkTaskCount > 1?'单次检测费合计':'检测费合计' }}</td><td>{{ orderDetailForm.oncePrice|MoneyFormat }}</td></tr>

            <tr v-if="orderDetailForm.offerBaseVo.checkTaskCount > 1">
              <td colspan="3">检测任务总数</td>
              <td>{{ orderDetailForm.offerBaseVo.checkTaskCount }}</td>
              <td colspan="3">任务周期</td>
              <td colspan="3">{{ CHECK_STATUS[orderDetailForm.offerBaseVo.checkCircle] }}</td>
            </tr>
            <tr><td colspan="9">检测费</td><td>{{ orderDetailForm.costVo.checkAmount|MoneyFormat }}</td></tr>
            <tr><td colspan="9">报告编制费</td><td>{{ orderDetailForm.costVo.reportAmount|MoneyFormat }}</td></tr>
            <tr><td colspan="9">报告加急费</td><td>{{ (orderDetailForm.costVo.expediteAmount)|MoneyFormat }}</td></tr>
            <tr><td colspan="9">采样费</td><td>{{ (orderDetailForm.costVo.laborAmount)|MoneyFormat }}</td></tr>
            <tr><td colspan="9">差旅费</td><td>{{ (orderDetailForm.costVo.tripAmount)|MoneyFormat }}</td></tr>
            <tr><td colspan="9">税额</td><td>{{ orderDetailForm.costVo.taxAmount|MoneyFormat }}</td></tr>
            <template v-if="orderDetailForm.selfCostVos">
              <tr v-for="(item, index) in orderDetailForm.selfCostVos" :key="index">
                <td colspan="9">{{ item.selfName }}</td>
                <td>{{ item.amount|MoneyFormat }}</td>
              </tr>
            </template>
            <tr><td colspan="9">总计</td><td>{{ orderDetailForm.costVo.sysAmount|MoneyFormat }}</td></tr>
            <tr><td colspan="9">优惠价</td><td>{{ orderDetailForm.costVo.draftAmount|MoneyFormat }}</td></tr>
            <tr><td colspan="2">大写：</td><td colspan="8">{{ orderDetailForm.costVo.draftAmount|Money2Chinese }}</td></tr>
          </tfoot>
        </table>
      </div>
    </el-dialog>

    <el-dialog title="审核历史" :visible.sync="approveVisible" width="75%">
      <el-table :data="approveDetails" border stripe>
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.isPass==='0'?'success':'danger'">{{ row.isPass==='0'?'审核通过':'审核不通过' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="审核说明" align="center" />
        <el-table-column prop="approvalUserName" label="审批用户" align="center" />
        <el-table-column prop="createTime" label="审批时间" align="center" />
      </el-table>
    </el-dialog>

    <!-- <el-dialog title="因子套餐" :visible.sync="factorGroupVisible" width="75%">
      <el-row>
        <el-col :span="24">
          <el-table
            ref="groupMultipleTable"
            :data="factorGroupData"
            max-height="400"
            stripe
            border
            :header-cell-style="{background:'#ECF3FC'}"
            @selection-change="handleGroupSelectionChange"
            @select="groupSelect"
            @select-all="groupSelectAll"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column prop="groupName" label="因子套餐名称" align="center" />
            <el-table-column prop="groupDesc" label="套餐说明" align="center" />
            <el-table-column prop="remark" label="因子详情" align="center" />
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="factorGroupVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmAddGroup">确认</el-button>
      </div>
    </el-dialog> -->

    <el-dialog title="因子套餐" :visible.sync="factorGroupVisible" append-to-body :close-on-click-modal="false" width="85%">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-card shadow="never" style="height: 400px;overflow-y: auto;">
            <div v-for="(item, index) in factorGroupData" :key="index" class="text dialog-item" @click="choseItem(item)">
              {{ item.groupName }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="never" style="height: 400px;">
            <el-tree
              ref="tree"
              :data="treeData"
              default-expand-all
              node-key="id"
              highlight-current
              :props="defaultProps"
              @node-click="changeTreeItem"
            />
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-table
            ref="groupMultipleTable"
            :data="factorList"
            border
            height="400px"
            :header-cell-style="{background:'#ECF3FC'}"
            @selection-change="handleGroupSelectionChange"
            @select="groupSelect"
          >
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column prop="secdClassName" label="检测对象" align="center" />
            <el-table-column prop="factorName" label="检测因子" align="center" />
            <el-table-column prop="standardName" label="检测标准" align="center" />
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="factorGroupVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmGroupChoseFactor">确认</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import * as orderServer from '@/api/offer'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import * as factorServer from '@/api/factor'
import * as appServer from '@/api/approve'
import * as dictServer from '@/api/dict'
const ACCOUNT_STATUS = {
  '0': '草稿',
  '1': '待审核',
  '2': '审核驳回',
  '3': '审核通过'
}
const CHECK_STATUS = {
  '0': '单次',
  '1': '周',
  '2': '月',
  '3': '季度',
  '4': '半年',
  '5': '年'
}
const MEAN_STATUS = {
  '0': '日均值',
  '1': '时均值',
  '2': '八小时均值'
}
import { uuid } from 'vue-uuid'
export default {
  name: 'OrderList',
  components: { Pagination },
  filters: {
    statusQualityFilter(status) {
      const statusMap = {
        '0': 'info',
        '1': '',
        '2': 'danger',
        '3': 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      MEAN_STATUS,
      ACCOUNT_STATUS,
      CHECK_STATUS,
      orderData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      },
      searchForm: {
        id: '',
        projectName: '',
        status: '',
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      maxTotal: 10,
      titleMap: {
        edit: '修改报价单',
        create: '新增报价单'
      },
      orderForm: {
        offerId: '',
        offerInfoTdo: {
          projectName: '',
          checkType: '0',
          certificationType: '1',
          status: '',
          consignorName: '',
          consignorLinker: '',
          consignorLinkerPhone: '',
          offerer: '',
          finishDate: '',
          checkCircle: '1',
          checkTaskCount: '',
          remark: ''
        },
        factorTdos: [],
        offerCostTdo: {
          id: '',
          reportAmount: 0, // 报告编制费
          reportAmountRate: 10, // 报告编制费率
          expediteAmount: 0, // 报告加急费
          laborAmount: 0, // 人工费/采样费
          tripAmount: 0, // 差旅费
          taxAmount: '', // 增值税金额
          taxAmountRate: 6, // 增值税率
          checkAmount: 0, // 检测费合计
          sysAmount: 0, // 系统价格
          draftAmount: 0 // 优惠价
        },
        selfCostTdos: []
      },
      otherPrice: '',
      orderRules: {
        offerInfoTdo: {
          consignorLinkerPhone: [{ required: true, message: '请录入联系方式', trigger: 'blur' }],
          projectName: [{ required: true, message: '请录入项目名称', trigger: 'blur' }],
          finishDate: [{ required: true, message: '请录入完成日期', trigger: 'blur' }],
          consignorName: [{ required: true, message: '请录入委托单位', trigger: 'blur' }],
          consignorLinker: [{ required: true, message: '请录入委托人', trigger: 'blur' }],
          checkType: [{ required: true, message: '请选择检测类型', trigger: 'change' }],
          certificationType: [{ required: true, message: '请选择认证类型', trigger: 'change' }]
        }
      },
      orderDialogStatus: 'create',
      orderDialogVisible: false,
      departmentArray: [],
      orderActiveName: '1',
      factorData: [],

      priceArray: [],
      innerPriceVisible: false,
      addPriceForm: {
        selfName: '',
        amount: 0.00
      },
      factorVisible: false,
      showPriceForm: {

      },
      showChoseData: [],
      factTotal: 0,
      factorForm: {
        classId: '',
        factorName: '',
        pageNumber: 1,
        pageSize: 10
      },
      factorMultipleSelection: [],
      factorTreeData: [],
      choseFatcors: [],
      choseGroupFatcors: [], // 套餐因子选择
      addressArray: [],
      groupAddressArray: [],
      setDay: 1,
      frequency: 1, // 频次
      meanType: '0',
      currentNodeId: '',
      currentGroupNodeId: '',
      lookPosition: '',
      currentNodeName: '',
      detailVisible: false,
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
      multipleSelection: [],
      multiplGroupeSelection: [],
      factorGroupData: [],
      choseMultipleTable: [],
      changeGroupId: '',
      startFactorGroup: '',
      factorGroupVisible: false,
      rowShowVisible: true,
      rowRemark: '',
      currentItem: {},
      windNum: 3,
      approveVisible: false,
      approveDetails: [],
      treeData: [],
      factListInfos: [],
      cacheFactors: [],
      factorList: [],
      facName: '',
      resultCache: {},
      resultForCache: {},
      currentUUid: ''
    }
  },
  computed: {
    // factorList() {
    //   if (this.facName !== '') {
    //     const reg = new RegExp(this.facName.trim())
    //     const n_factors = this.cacheFactors.filter(f => reg.test(f.factorName))
    //     return n_factors
    //   }
    //   return this.cacheFactors
    // }
  },
  watch: {
    orderForm: {
      handler(val) {
        let t_checkAmount = 0.00 // 总检测费用   因子合计总费用 * 任务数
        let t_reportAmount = 0.00 // 报告费用
        let t_expediteAmount = 0.00 // 加急费
        let t_taxAmount = 0.00 // 增值费用

        let t_tripAmount = 0.00 // 差旅费
        let t_laborAmount = 0.00 // 人工费
        let t_orderAmount = 0.00 // 其他费用
        // 计算因子费用
        if (this.orderForm.factorTdos.length > 0) {
          let t_one_checkAmount = 0.00 // 单次任务因子检测费
          this.orderForm.factorTdos.forEach(i => {
            if (i.dayCount && i.frequency) {
              const totalNum = Number(i.dayCount * i.frequency)
              const totalCost = parseFloat(i.dayCount * i.frequency * i.price).toFixed(2)
              i.totalNum = totalNum
              i.totalCost = totalCost
              t_one_checkAmount += parseFloat(totalCost)
            }
          })
          if (t_one_checkAmount > 0) {
            t_checkAmount = parseFloat(t_one_checkAmount * this.orderForm.offerInfoTdo.checkTaskCount)
            t_reportAmount = parseFloat(t_checkAmount * this.orderForm.offerCostTdo.reportAmountRate / 100)
            t_taxAmount = parseFloat(t_checkAmount * this.orderForm.offerCostTdo.taxAmountRate / 100)
          }
          this.orderForm.offerCostTdo.checkAmount = t_checkAmount
          this.orderForm.offerCostTdo.reportAmount = t_reportAmount
          // this.orderForm.offerCostTdo.expediteAmount = t_expediteAmount
          this.orderForm.offerCostTdo.taxAmount = t_taxAmount
          t_tripAmount = parseFloat(this.orderForm.offerCostTdo.tripAmount * this.orderForm.offerInfoTdo.checkTaskCount)
          t_laborAmount = parseFloat(this.orderForm.offerCostTdo.laborAmount * this.orderForm.offerInfoTdo.checkTaskCount)
          t_expediteAmount = parseFloat(this.orderForm.offerCostTdo.expediteAmount * this.orderForm.offerInfoTdo.checkTaskCount)

          if (this.orderForm.selfCostTdos && this.orderForm.selfCostTdos.length > 0) {
            this.orderForm.selfCostTdos.forEach(j => {
              t_orderAmount += parseFloat(j.amount)
            })
          }

          this.otherPrice = parseFloat(t_orderAmount * this.orderForm.offerInfoTdo.checkTaskCount)
          // 系统价格计算
          this.orderForm.offerCostTdo.sysAmount = parseFloat(t_checkAmount + t_reportAmount + t_expediteAmount + t_taxAmount + t_tripAmount + t_laborAmount + (t_orderAmount * this.orderForm.offerInfoTdo.checkTaskCount)).toFixed(2)
        }
      },
      deep: true
    }
  },
  created() {
    // UUID获取

    this.getTreeClassList()
    this.getFactorGroup()
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
    getTreeClassList() {
      dictServer.findTreeClasses().then(res => {
        this.factorTreeData = res.result || []
      })
    },
    handleSearch() {
      orderServer.findOfferInfosByCondition(this.searchForm).then(res => {
        if (res.code === 200) {
          this.orderData = res.result.records || []
          this.total = res.result.total
        }
      })
    },
    // 重置
    handleCreate() {
      this.clearForm()
      this.orderDialogStatus = 'create'
      this.orderDialogVisible = true
    },
    handleCopy(row) {
      this.$confirm('确定复制?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderServer.copyOfferByOfferId(row.id).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success'
            })
            this.handleSearch()
          } else {
            this.$notify({
              title: '失败',
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {})
    },
    handleUpdate(row) {
      this.orderForm.offerId = row.id
      this.orderDialogStatus = 'edit'
      orderServer.findOfferDetailsByOfferId(row.id).then(res => {
        if (res.code === 200) {
          this.orderForm.offerId = res.result.offerId || ''
          this.orderForm.offerInfoTdo = res.result.offerBaseVo || {}
          this.orderForm.offerCostTdo = res.result.costVo || {}
          this.orderForm.selfCostTdos = res.result.selfCostVos || []
          this.orderForm.factorTdos = res.result.factorVos.map(i => {
            if (i.dynamicParam !== '{}' && i.dynamicParam.indexOf('meanName') > -1) {
              const dynParam = JSON.parse(i.dynamicParam)
              this.$set(i, 'meanName', dynParam.meanName)
            }
            return i
          }) || [] // 处理展示meanName

          this.orderDialogVisible = true
        }
      })
    },
    handleApprovel(offerId) {
      this.$confirm('确定提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderServer.commitByOfferId(offerId).then(result => {
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
    },
    confirmDialog() {
      if (this.orderForm.factorTdos && this.orderForm.factorTdos.length > 0) {
        const objFlag = this.orderForm.factorTdos.find(j => j.factorPoint === '')
        if (objFlag) {
          this.$message.warning('因子位置信息不能为空')
          return
        }
        if (this.orderForm.offerInfoTdo.checkTaskCount === 1) {
          this.orderForm.offerInfoTdo.checkCircle = '0'
        }
        debugger
        if (this.orderForm.offerCostTdo.draftAmount && this.orderForm.offerCostTdo.draftAmount > 0) {
          if (this.orderDialogStatus === 'create') {
            this.confirmCreate()
          } else {
            this.confirmUpdate()
          }
        } else {
          this.$message.warning('请录入正确的优惠价格!')
        }
      } else {
        this.$message.warning('因子信息不能为空')
      }
    },
    confirmCreate() {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          const data = {
            offerInfoTdo: this.orderForm.offerInfoTdo,
            factorTdos: this.orderForm.factorTdos.map(i => {
              const { checkStandardId, secdClassId, frequency, dayCount, totalCost, factorPoint, remark, dynamicParam, factorGroupKey } = i
              return { checkStandardId, secdClassId, frequency, dayCount, totalCost, factorPoint, remark, dynamicParam, factorGroupKey }
            }),
            offerCostTdo: this.orderForm.offerCostTdo,
            selfCostTdos: this.orderForm.selfCostTdos
          }
          orderServer.saveOffer(data).then(result => {
            if (result.code === 200) {
              this.$notify({
                title: '成功',
                message: result.message,
                type: 'success'
              })
              this.handleSearch()
              this.orderDialogVisible = false
              this.$refs.orderForm.resetFields()
            } else {
              this.$notify({
                title: '失败',
                message: result.message,
                type: 'error'
              })
            }
          }).catch(() => {})
        } else {
          this.$message.warning('请完善必填信息')
          return false
        }
      })
    },
    confirmUpdate() {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          const data = {
            offerId: this.orderForm.offerId,
            offerInfoTdo: this.orderForm.offerInfoTdo,
            factorTdos: this.orderForm.factorTdos.map(i => {
              const { checkStandardId, secdClassId, frequency, dayCount, totalCost, factorPoint, remark, dynamicParam, factorGroupKey } = i
              return { checkStandardId, secdClassId, frequency, dayCount, totalCost, factorPoint, remark, dynamicParam, factorGroupKey }
            }),
            offerCostTdo: this.orderForm.offerCostTdo,
            selfCostTdos: this.orderForm.selfCostTdos
          }
          orderServer.updateOffer(data).then(request => {
            this.$notify({
              title: '成功',
              message: request.message,
              type: 'success'
            })
            this.handleSearch()
            this.orderDialogVisible = false
            this.$refs.orderForm.resetFields()
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    handleDelete(offerId) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderServer.delOffer(offerId).then(result => {
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
    },
    handleApproveDetail(row) {
      appServer.findOfferApprovalRecordByOfferId(row.id).then(res => {
        this.approveDetails = res.result || []
      })
      this.approveVisible = true
    },
    clearForm() {
      this.orderForm = {
        offerInfoTdo: {
          projectName: '',
          checkType: '0',
          certificationType: '1',
          status: '',
          consignorName: '',
          consignorLinker: '',
          consignorLinkerPhone: '',
          offerer: '',
          finishDate: '',
          checkCircle: '1',
          checkTaskCount: '',
          remark: ''
        },
        factorTdos: [],
        offerCostTdo: {
          id: '',
          reportAmount: 0, // 报告编制费
          reportAmountRate: 10, // 报告编制费率
          expediteAmount: 0, // 报告加急费
          laborAmount: 0, // 人工费/采样费
          tripAmount: 0, // 差旅费
          taxAmount: '', // 增值税金额
          taxAmountRate: 6, // 增值税率
          checkAmount: 0, // 检测费合计
          sysAmount: 0, // 系统价格
          draftAmount: 0 // 优惠价
        },
        selfCostTdos: [],
        currentTreeNode: ''
      }
    },
    handleDialogClose(done) {
      this.$confirm('确认离开？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    showAddPrice() {
      this.addPriceForm = {
        selfName: '',
        amount: 0.00
      }
      this.innerPriceVisible = true
    },
    factorNumCheck(attrName, val) {
      if (val.length >= 3) {
        this.orderForm.offerCostTdo[attrName] = val.substr(0, 2)
        return
      }
      this.orderForm.offerCostTdo[attrName] = val.replace(/[^\d]/g, '')
    },
    factorNumCheckNaN(attrName, val) {
      if (val.length >= 3) {
        this.orderForm.offerCostTdo[attrName] = val.substr(0, 2)
        return
      }
      this.orderForm.offerCostTdo[attrName] = val.replace(/[^\d]/g, '')
    },
    factorNumCheckPoint(attrName, val) {
      this.orderForm.offerCostTdo[attrName] = val.replace(/[^\d.]/g, '')
    },
    confirmPrice() {
      if (this.addPriceForm.selfName && this.addPriceForm.amount >= 0) {
        this.orderForm.selfCostTdos.push({ 'selfName': this.addPriceForm.selfName, 'amount': this.addPriceForm.amount })
        this.innerPriceVisible = false
      } else {
        this.$message.warning('请录入完整信息')
      }
    },
    validatoProInput(val) {
      if (val.split('.').length > 2) {
        this.showPriceForm.totalPrice = 0.00
        return
      }
      this.showPriceForm.totalPrice = val.replace(/[^\d.]/g, '')
    },
    addFactor() {
      // 获取UUID
      this.currentUUid = uuid.v4().replaceAll('-', '')

      this.choseFatcors = []
      this.multipleSelection = []
      this.maxTotal = 10
      // this.handleFactorSearch()
      if (this.currentNodeId && this.currentNodeId.length > 0) {
        this.handleFactorSearch()
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
      // 清空设定值
      this.setDay = 1
      this.frequency = 1
      this.addressArray = []
      // this.currentNodeId = ''
      // this.currentNodeName = ''
      this.lookPosition = ''
      this.meanType = ''
      this.factorVisible = true
    },
    choseGroup() {
      this.currentUUid = uuid.v4().replaceAll('-', '')
      this.startFactorGroup = ''
      this.groupAddressArray = []
      this.multiplGroupeSelection = []
      this.choseGroupFatcors = []
      this.factorGroupVisible = true
    },
    getFactorGroup() {
      factorServer.findGroupList().then(res => {
        if (res.code === 200) {
          this.factorGroupData = res.result || []
        }
      })
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
    addGroupAddress() {
      this.$nextTick(() => {
        this.groupAddressArray.push({
          value: '',
          key: Date.now()
        })
      })
    },
    removeDomain(item) {
      var index = this.orderForm.selfCostTdos.indexOf(item)
      if (index !== -1) {
        this.orderForm.selfCostTdos.splice(index, 1)
      }
    },
    removeAddDomain(item) {
      var index = this.addressArray.indexOf(item)
      if (index !== -1) {
        this.addressArray.splice(index, 1)
      }
    },
    removeGroupAddDomain(item) {
      var index = this.groupAddressArray.indexOf(item)
      if (index !== -1) {
        this.groupAddressArray.splice(index, 1)
      }
    },
    handleClass(type) {
      this.searchForm.classId = type
      this.handleFactorSearch()
    },
    handleTreeFactorSearch(val, node) {
      debugger

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
      debugger
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
    handleClose(item) {
      // 移除存储的因子
      this.choseFatcors.splice(this.choseFatcors.indexOf(item), 1)
      this.$refs.multipleTable.toggleRowSelection(item, false)
    },
    handleGroupClose(item) {
      // 移除存储的因子
      this.choseGroupFatcors.splice(this.choseGroupFatcors.indexOf(item), 1)
      this.$refs.groupMultipleTable.toggleRowSelection(item, false)
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
        const { standardCode, className, standardName, factorName, price } = i
        const cost = parseFloat(price * this.frequency * this.setDay).toFixed(2)
        const n_UUid = uuid.v4().replaceAll('-', '')
        this.$set(i, 'factorGroupKey', n_UUid)
        return {
          checkStandardId: standardCode,
          className,
          standardName,
          factorName,
          secdClassId: this.currentNodeId,
          secdClassName: this.currentNodeName,
          frequency: this.frequency,
          dayCount: this.setDay,
          price,
          totalCost: cost,
          meanName: this.currentNodeId === '002001' ? this.MEAN_STATUS[this.meanType] : undefined,
          factorPoint: this.lookPosition,
          groupClassId: groupId !== '' ? (groupId + '/' + standardCode) : '',
          dynamicParam: JSON.stringify(dynamic),
          factorGroupKey: n_UUid // 每次添加因子，同组的归为一类
        }
      })
      if (this.addressArray && this.addressArray.length > 0) {
        this.addressArray.forEach(item => {
          if (item.value && item.value.length > 0) {
            this.choseFatcors.forEach(j => {
              const { standardCode, className, standardName, factorName, price, factorGroupKey } = j
              const cost = parseFloat(price * this.frequency * this.setDay).toFixed(2)
              retListArray.push({
                checkStandardId: standardCode,
                className,
                standardName,
                factorName,
                secdClassId: this.currentNodeId,
                secdClassName: this.currentNodeName,
                frequency: this.frequency,
                dayCount: this.setDay,
                price,
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
      // 追加合并
      this.$nextTick(() => {
        if (this.orderForm.factorTdos && this.orderForm.factorTdos.length > 0) {
          this.orderForm.factorTdos = this.orderForm.factorTdos.concat(retListArray)
        } else {
          this.orderForm.factorTdos = retListArray
        }
      })
      this.factorVisible = false
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
        const { standardCode, className, standardName, factorName, price } = i
        const cost = parseFloat(price * this.frequency * this.setDay).toFixed(2)
        const n_UUid = uuid.v4().replaceAll('-', '')

        this.$set(i, 'factorGroupKey', n_UUid)
        return {
          checkStandardId: standardCode,
          className,
          standardName,
          factorName,
          secdClassId: this.currentNodeId,
          secdClassName: this.currentNodeName,
          frequency: this.frequency,
          dayCount: this.setDay,
          price,
          totalCost: cost,
          meanName: this.currentNodeId === '002001' ? this.MEAN_STATUS[this.meanType] : undefined,
          factorPoint: this.lookPosition,
          groupClassId: groupId !== '' ? (groupId + '/' + standardCode) : '',
          dynamicParam: JSON.stringify(dynamic),
          factorGroupKey: n_UUid
        }
      })
      if (this.addressArray && this.addressArray.length > 0) {
        this.addressArray.forEach(item => {
          if (item.value && item.value.length > 0) {
            this.choseGroupFatcors.forEach(j => {
              const { standardCode, className, standardName, factorName, price, factorGroupKey } = j
              const cost = parseFloat(price * this.frequency * this.setDay).toFixed(2)
              retListArray.push({
                checkStandardId: standardCode,
                className,
                standardName,
                factorName,
                secdClassId: this.currentNodeId,
                secdClassName: this.currentNodeName,
                frequency: this.frequency,
                dayCount: this.setDay,
                price,
                totalCost: cost,
                factorPoint: item.value,
                remark: '',
                meanName: this.currentNodeId === '002001' ? this.MEAN_STATUS[this.meanType] : undefined,
                groupClassId: groupId !== '' ? (groupId + '/' + standardCode) : '',
                dynamicParam: JSON.stringify(dynamic),
                factorGroupKey
              })
            })
          }
        })
      }
      // 追加合并
      this.$nextTick(() => {
        if (this.orderForm.factorTdos && this.orderForm.factorTdos.length > 0) {
          this.orderForm.factorTdos = this.orderForm.factorTdos.concat(retListArray)
        } else {
          this.orderForm.factorTdos = retListArray
        }
      })
      debugger
      this.factorGroupVisible = false
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => {
          if (column.label === '次数') {
            return Number(item.dayCount * item.frequency)
          } else if (column.label === '总计') {
            return parseFloat(item.dayCount * item.frequency * item.price)
          } else {
            return Number(item[column.property])
          }
        })
        if (!values.every(value => isNaN(value))) {
          if (index === 6) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else if (index === 8) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0).toFixed(2)
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    handleRowDel(index, row) {
      if (!row.groupClassId || row.groupClassId === '') {
        this.orderForm.factorTdos.splice(index, 1)
      } else {
        const delData = this.orderForm.factorTdos.filter(item => item.groupClassId === row.groupClassId)
        if (delData) {
          delData.forEach(i => {
            this.orderForm.factorTdos.some((i, index) => {
              if (row.groupClassId === i.groupClassId) {
                this.orderForm.factorTdos.splice(index, 1)
                return
              }
            })
          })
        }
      }
    },
    handleDetail(row) {
      // 获取数据
      orderServer.findOfferDetailsByOfferId(row.id).then(res => {
        if (res.code === 200) {
          this.orderDetailForm.offerId = res.result.offerId || ''
          this.orderDetailForm.offerBaseVo = res.result.offerBaseVo || {}
          this.orderDetailForm.costVo = res.result.costVo || {}
          this.orderDetailForm.selfCostVos = res.result.selfCostVos || []
          this.orderForm.factorTdos = res.result.factorVos.map(i => {
            if (i.dynamicParam !== '{}' && i.dynamicParam.indexOf('meanName') > -1) {
              const dynParam = JSON.parse(i.dynamicParam)
              this.$set(i, 'meanName', dynParam.meanName)
            }
            return i
          }) || [] // 处理展示meanName

          // 处理因子展示数据
          this.orderDetailForm.factorTdos = this.doProcessDate(res.result.factorVos) || []
          this.detailVisible = true
        }
      })
      // 封装展示数据
    },
    doProcessDate(vos) {
      if (vos && vos.length > 0) {
        const factorArray = []
        const factorMap = new Map()
        const resFactorarray = []
        let fIndex = 1
        vos.forEach((item, index) => {
          const o = factorArray.find(j => j.secdClassName === item.secdClassName)
          if (!o) {
            factorArray.push({
              id: fIndex,
              secdClassName: item.secdClassName,
              totalPrice: 0,
              detailLength: 0
            })
            fIndex++
          }
          if (factorMap.get(item.secdClassName)) {
            const ls = factorMap.get(item.secdClassName)
            ls.push(item)
          } else {
            const li = []
            li.push(item)
            factorMap.set(item.secdClassName, li)
          }
        })
        if (factorArray) {
          factorArray.forEach(i => {
            const deList = factorMap.get(i.secdClassName)
            if (deList && deList.length > 0) {
              const totalPrice = this.countTotal(deList, 'totalCost')
              deList.forEach((j, index) => {
                const oo = resFactorarray.find(x => x.secName === j.secdClassName)
                if (!oo) {
                  this.$set(j, 'frIndex', 0)
                } else {
                  this.$set(j, 'frIndex', 1)
                }
                this.$set(j, 'id', i.id)
                this.$set(j, 'sid', i.id + '.' + (index + 1))
                this.$set(j, 'secName', i.secdClassName)
                this.$set(j, 'detailLength', deList.length + 1)
                this.$set(j, 'dateType', 0)
                resFactorarray.push(j)
              })
              resFactorarray.push({
                'secName': i.secdClassName,
                'frIndex': 1,
                'totalPrice': parseFloat(totalPrice).toFixed(2),
                'dateType': 1
              })
            }
          })
        }

        this.orderDetailForm.oncePrice = this.countTotal(resFactorarray, 'totalCost')
        return resFactorarray
      }
      return []
    },
    countTotal(arr, keyName) {
      let $total = 0
      $total = arr.reduce((total, currentValue, currentIndex, arr) => {
        return currentValue[keyName] ? (total + currentValue[keyName]) : total
      }, 0)
      return $total
    },
    handleGroupSelectionChange(val) {
      this.multiplGroupeSelection = val
      if (val) {
        val.forEach(i => {
          debugger
          const ob = this.choseGroupFatcors.find(j => j.standardCode === i.standardCode)
          if (!ob) {
            this.choseGroupFatcors.push(i)
          }
        })
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
    groupSelectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1
      } else {
        this.choseMultipleTable = []
      }
    },
    confirmAddGroup() {
      if (!this.changeGroupId || this.changeGroupId.length <= 0) {
        this.$message.warning('套餐不能为空')
        return
      }
      factorServer.findCheckStandardsByGroupId(this.changeGroupId).then(result => {
        if (result.code === 200 && result.result) {
          this.doGroupProcess(result.result)
          this.factorGroupVisible = false
        }
      })
    },
    doGroupProcess(data) {
      const retListArray = data.map(i => {
        const { standardCode, secdClassId, secdClassName, className, standardName, factorName, price } = i
        return {
          checkStandardId: standardCode,
          className,
          standardName,
          factorName,
          secdClassId,
          secdClassName,
          frequency: 1,
          dayCount: 1,
          price,
          totalCost: price,
          factorPoint: '',
          remark: ''
        }
      })

      this.$nextTick(() => {
        if (this.orderForm.factorTdos && this.orderForm.factorTdos.length > 0) {
          this.orderForm.factorTdos = this.orderForm.factorTdos.concat(retListArray)
        } else {
          this.orderForm.factorTdos = retListArray
        }
      })
      // TODO备注信息
    },
    handleDownload(row) {
      var url = '/api/word/downLoadOffer?offerId=' + row.id
      window.open(url)
    },
    handleRowShow(row) {
      this.currentItem = row
      this.rowRemark = row.remark
      this.rowShowVisible = true
    },
    rowShowConfirm() {
      this.currentItem.remark = this.rowRemark
      this.rowShowVisible = false
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
    changeTreeItem(data, checked, indeterminate) {
      if (data.level === 2) {
        this.factorList = []
        this.multiplGroupeSelection = []
        this.factorList = this.cacheFactors.filter(i => data.id === i.secdClassId)

        this.addressArray = []
        this.currentNodeId = data.id
        this.currentNodeName = data.name
        if (data.id === '002001' && this.meanType === '0') {
          this.maxTotal = 1
        } else if (data.id === '004001') {
          this.maxTotal = 2
        } else {
          this.maxTotal = 10
        }
        if (data.id === '002001' || data.id === '002003') { // 厂界无组织/ 环境空气 自动生成5个点位
          this.$nextTick(() => {
            for (var i = 0; i < 4; i++) {
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
    choseItem(val) {
      debugger
      this.treeData = []
      this.cacheFactors = []
      this.factorList = []
      this.multiplGroupeSelection = []
      this.choseGroupFatcors = []

      // 清空设定值
      this.setDay = 1
      this.frequency = 1
      this.addressArray = []
      this.currentNodeId = ''
      this.currentNodeName = ''
      this.meanType = ''

      if (this.resultCache[val.groupId]) {
        this.treeData = this.resultCache[val.groupId]
        this.cacheFactors = this.resultForCache[val.groupId]
        return
      }
      if (val.groupId) {
        factorServer.findCheckStandardsByGroupId(val.groupId).then(result => {
          if (result.code === 200 && result.result) {
            this.cacheFactors = result.result
            const f_item = []
            result.result.forEach(item => {
              const obj = f_item.find(j => j.id === item.classId)
              if (!obj) {
                const children = [{
                  'id': item.secdClassId,
                  'name': item.secdClassName,
                  'children': [],
                  'level': 2
                }]
                const n_item = {
                  'id': item.classId,
                  'name': item.className,
                  'level': 1,
                  'children': children
                }
                f_item.push(n_item)
              } else {
                const children_od = obj.children
                const obj_sec = children_od.find(j => j.id === item.secdClassId)
                if (!obj_sec) {
                  const children = [{
                    'id': item.secdClassId,
                    'name': item.secdClassName,
                    'children': [],
                    'level': 2
                  }]
                  obj.children.push(children)
                }
              }
            })
            this.$set(this.resultCache, val.groupId, f_item)
            this.$set(this.resultForCache, val.groupId, result.result)
            this.treeData = f_item
          }
        })
      }
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
