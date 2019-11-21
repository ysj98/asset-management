<!--资产项目管理业务-资产项目管理列表页面-->
<template>
  <div class="project_manage">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button
          icon="plus"
          type="primary"
          v-power="ASSET_MANAGEMENT.ASSET_APM_REAPPROVAL"
          @click="handleModalOpen('add', new Date().getTime())"
        >新增资产项目</SG-Button>
        <SG-Button icon="import" style="margin-left: 10px">导入资产项目</SG-Button>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="6">
            <tree-select @changeTree="changeTree" style="width: 100%;"/>
          </a-col>
          <a-col :span="6">
            <a-select v-model="approvalStatusList" mode="multiple" :maxTagCount="2" :options="statusOptions" placeholder="请选择项目状态" style="width: 100%;"/>
          </a-col>
          <a-col :span="6">
            <a-select v-model="sourceTypeList" mode="multiple" :maxTagCount="1" placeholder="请选择来源方式" style="width: 100%;" :options="sourceTypeOptions"/>
          </a-col>
          <a-col :span="6" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({type: 'search'})">查询</SG-Button>
            <!--<SG-Button style="margin-left: 10px" @click="handleReset">清空</SG-Button>-->
          </a-col>
        </a-row>
        <a-row :gutter="8" style="margin-top: 14px">
          <a-col :span="6">
            <a-select v-model="takeOver" placeholder="请选择接管状态" style="width: 100%;" :options="takeOverOptions"/>
          </a-col>
          <a-col :span="6">
            <a-select v-model="transferToOperation" placeholder="请选择运营状态" style="width: 100%;" :options="operateOptions"/>
          </a-col>
          <a-col :span="6">
            <a-input placeholder="请输入资产项目名称" v-model="projectName"/>
          </a-col>
          <a-col :span="6" style="text-align: left">
            <a-checkbox :checked="isCurrent" @change="changeChecked" style="margin-top: 7px">仅当前机构下资产项目</a-checkbox>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--概览-->
    <overview-number :numList="numList"/>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <!--二期开发-->
      <!--<span slot="ownershipProgress" slot-scope="text">-->
        <!--<a-progress :percent="text || 0" :format="a => a" size="small"/>-->
      <!--</span>-->
      <span slot="takeOver" slot-scope="text">{{text ? "已接管": "未接管" }}</span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          okText="确定"
          cancelText="取消"
          title="确定要删除该资产项目吗?"
          @confirm="confirmDelete(record.projectId)"
          v-power="ASSET_MANAGEMENT.ASSET_APM_DELETE"
          v-if="Number(record.approvalStatus) === 0 || Number(record.approvalStatus) === 3"
        >
          <span class="action_text">删除</span>
        </a-popconfirm>
        <a-popconfirm
          okText="确定"
          cancelText="取消"
          title="确认要反审核该资产项目吗?"
          @confirm="confirmApproval(record.projectId)"
          v-power="ASSET_MANAGEMENT.ASSET_APM_REAPPROVAL"
          v-if="Number(record.approvalStatus) === 1"
        >
          <span class="action_text">反审核</span>
        </a-popconfirm>
        <span
          class="action_text"
          v-power="ASSET_MANAGEMENT.ASSET_APM_EDIT"
          @click="handleModalOpen('edit', record.projectId)"
          v-if="Number(record.approvalStatus) === 0 || Number(record.approvalStatus) === 3"
        >编辑</span>
        <span
          class="action_text"
          v-if="Number(record.approvalStatus) === 2"
          v-power="ASSET_MANAGEMENT.ASSET_APM_APPROVAL"
          @click="handleModalOpen('approval', record.projectId)"
        >审核</span>
        <router-link :to="{ path: '/assetProjectDetail', query: { projectId: record.projectId } }" class="action_text">详情</router-link>
      </span>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
    <!--新增、编辑、审核弹窗-->
    <SG-Modal v-bind="modalObj" v-model="modalObj.status">
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="tableObj.loading" @click="handleModalOk">
          {{modalObj.okText}}
        </a-button>
        <a-button key="back" @click="handleModalCancel" :loading="modalObj.type === 'approval' ? tableObj.loading : false">
          {{modalObj.cancelText}}
        </a-button>
      </template>
      <base-info
        ref="baseInfo"
        :organId="organId"
        :type="modalObj.type"
        :organTitle="organName"
        :key="modalObj.projectId"
        :projectId="modalObj.projectId"
        :sourceTypeOptions="sourceTypeOptions"
      />
    </SG-Modal>
  </div>
</template>

<script>
  import TreeSelect from 'src/views/common/treeSelect'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  import BaseInfo from './components/components/BaseInfoPart'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import SearchContainer from 'src/views/common/SearchContainer'
  export default {
    name: 'index',
    components: { BaseInfo, SearchContainer, OverviewNumber, TreeSelect },
    data () {
      return {
        fold: true, // 查询条件折叠
        ASSET_MANAGEMENT, // 权限对象
        overviewNumSpinning: false, // 统计查询loading
        projectName: '', // 查询条件-资源项目名称
        takeOver: undefined, // 查询条件-是否接管
        takeOverOptions: [
          // {key: -1, title: '全部接管'},
          {key: 1, title: '已接管'}, {key: 0, title: '未接管'}
        ], // 查询条件-是否接管选项
        isCurrent: false, // 查询条件-是否仅当前机构
        organId: '', // 查询条件-组织Id
        organName: '', // 查询条件-组织Id
        approvalStatusList: undefined, // 查询条件-项目状态
        statusOptions: [
          // {key: -1, title: '全部状态'},
          {key: 0, title: '草稿'}, {key: 2, title: '已驳回'}, {key: 3, title: '已审批'}, {key: 1, title: '待审批'}
        ], // 查询条件-项目状态选项
        sourceTypeList: undefined, // 查询条件-来源方式
        sourceTypeOptions: [], // 查询条件-来源方式选项
        transferToOperation: undefined, // 查询条件-是否转运营
        operateOptions: [
          // {key: -1, title: '全部运营状态'},
          {key: 1, title: '已转运营'}, {key: 0, title: '未转运营'}
        ], // 查询条件-是否转运营选项
        numList: [
          {title: '所有资产项目', value: 0, num: 'projectNum', fontColor: '#324057'},
          {title: '待审核', value: 0, num: 'toBeAuditedNum', percent: 'toBeAuditedPercent', fontColor: '#324057'},
          {title: '接管中', value: 0, num: 'takeOverNum', percent: 'takeOverPercent', fontColor: '#324057'},
          {title: '已接管', value: 0, num: 'takeOveredNum', percent: 'takeOveredPercent', fontColor: '#324057'},
          {title: '转运营', value: 0, num: 'transferOperationNum', percent: 'transferOperationNumPercent', fontColor: '#324057'},
        ], // 概览数据，title 标题，value 数值，bgColor 背景色
        modalObj: { title: '', status: false, okText: '', cancelText: '', bodyStyle: {}, type: '', projectId: '', maskClosable: false },
        tableObj: {
          rowKey: 'projectId',
          loading: false,
          dataSource: [],
          scroll: { x: true },
          columns: [
            { title: '管理机构', dataIndex: 'organName', key: 'organName', fixed: 'left', width: '120px' },
            { title: '资产项目名称', dataIndex: 'projectName', key: 'projectName', fixed: 'left', width: '120px' },
            { title: '资产项目编码', dataIndex: 'projectCode', key: 'projectCode' },
            { title: '来源方式', key: 'sourceTypeName', dataIndex: 'sourceTypeName' },
            { title: '来源渠道', dataIndex: 'souceChannelType', key: 'sourceChannelType' },
            { title: '资产数量', dataIndex: 'assetsNum', key: 'assetsNum' },
            { title: '资产项目状态', dataIndex: 'approvalStatusName', key: 'approvalStatusName' },
            { title: '审核日期', dataIndex: 'auditDate', key: 'auditDate' },
            { title: '是否接管', dataIndex: 'takeOver', key: 'takeOver', scopedSlots: { customRender: 'takeOver' } },
            { title: '接管日期', dataIndex: 'takeOverDate', key: 'takeOverDate' },
            { title: '权属进度', dataIndex: 'ownershipProgress', key: 'ownershipProgress', scopedSlots: { customRender: 'ownershipProgress'}, width: 150 },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 180 }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        modalTextObj: {
          add: {title: '新建资产项目', okText: '提交审核', cancelText: '取消'},
          edit: {title: '编辑资产项目', okText: '提交审核', cancelText: '取消'},
          approval: {title: '审核资产项目', okText: '审核通过', cancelText: '驳回'}
        }
      }
    },
    
    methods: {
      // 处理是否选中仅当前机构
      changeChecked (e) {
        this.isCurrent = e.target.checked
      },

      // 查询数据来源方式字典接口
      querySourceTypeList () {
        this.$api.assets.organDict({code: 'source_type', organId: this.organId}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            this.sourceTypeOptions = (res.data || []).map(item => {
              return { key: item.value, title: item.name }
            })
            return false
          }
          throw res.message || '查询来源方式失败'
        }).catch(err => {
          this.$message.error(err || '查询来源方式失败')
        })
      },

      // Modal提交
      handleModalOk () {
        const { modalObj: { type }, projectId, paginationObj: { pageNo, pageLength } } = this
        // 编辑基本信息时保存
        if (type === 'add' || type === 'edit') {
          new Promise((resolve, reject) => {
            this.tableObj.loading = true
            this.$refs['baseInfo'].handleSubmit(resolve, reject)
          }).then(() => {
            this.tableObj.loading = false
            this.modalObj.status = false
            this.queryTableData({pageNo, pageLength, type: 'search'})
          }).catch(() => {
            this.tableObj.loading = false
          })
        } else if (type === 'approval') {
          // 审核提交
          this.tableObj.loading = true
          this.$api.assets.doProjectManageAudit({ projectId }).then(r => {
            this.tableObj.loading = false
            let res = r.data
            if (res && String(res.code) === '0') {
              this.$message.success('审核成功')
              this.modalObj.status = false
              // 更新列表
              const { pageNo, pageLength } = this.paginationObj
              return this.queryTableData({pageNo, pageLength, type: 'search'})
            }
            throw res.message || '审核失败'
          }).catch(err => {
            this.tableObj.loading = false
            this.$message.error(err || '审核失败')
          })
        } else {
          this.$message.error('操作不存在')
        }
      },

      // 编辑、新增、审核按钮控制Modal打开
      handleModalOpen (type, projectId = '') {
        // type ：add 新增，edit 编辑，approval 审核
        if (type === 'add' && !this.organId) {
          return this.$message.info('请先选择组织机构')
        }
        const { modalTextObj } = this
        Object.assign(this.modalObj, {
          type,
          projectId,
          status: true,
          ...modalTextObj[type],
          bodyStyle: {maxHeight: `${document.documentElement.clientHeight - 180}px`, overflowY: 'auto'}
        })
      },

      // 清空查询条件
      handleReset () {},

      // Modal关闭
      handleModalCancel () {
        this.tableObj.loading = false
        const { modalObj: { type }, projectId } = this
        if (type === 'approval') {
          this.$message.info(projectId + '别点了，二期开发')
          // 审核提交
          // this.tableObj.loading = true
          // this.$api.assets.doProjectManageAudit({ projectId }).then(r => {
          //   this.tableObj.loading = false
          //   let res = r.data
          //   if (res && String(res.code) === '0') {
          //     this.$message.success('驳回成功')
          //     this.modalObj.status = false
          //     // 更新列表
          //     const { pageNo, pageLength } = this.paginationObj
          //     return this.queryTableData({pageNo, pageLength, type: 'search'})
          //   }
          //   throw res.message || '驳回失败'
          // }).catch(err => {
          //   this.tableObj.loading = false
          //   this.$message.error(err || '驳回失败')
          // })
          // return false
        }
        this.modalObj.status = false
      },

      // 删除资产项目
      confirmDelete (projectId) {
        this.tableObj.loading = true
        this.$api.assets.deleteProjectManageProjectById({projectId}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$message.success('删除成功')
            // 更新列表
            const { pageNo, pageLength } = this.paginationObj
            return this.queryTableData({pageNo, pageLength, type: 'search'})
          }
          throw res.message || '删除失败'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '删除失败')
        })
      },

      // 反审核资产项目
      confirmApproval (projectId) {
        this.tableObj.loading = true
        this.$api.assets.doProjectManageReaudit({projectId}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$message.success('反审核成功')
            // 更新列表
            const { pageNo, pageLength } = this.paginationObj
            return this.queryTableData({pageNo, pageLength, type: 'search'})
          }
          throw res.message || '反审核失败'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '反审核失败')
        })
      },

      // 获取选择的组织机构
      changeTree (id, name) {
        this.organId = id
        this.organName = name
        // 根据organId查询来源方式字典
        id && this.querySourceTypeList()
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10, type}) {
        const { organId, approvalStatusList, sourceTypeList, takeOver, isCurrent, projectName, transferToOperation } = this
        if (!organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        let form = {
          projectName, approvalStatusList, transferToOperation,
          organId, sourceTypeList, takeOver, isCurrent, pageSize: pageLength, pageNum: pageNo
        }
        this.$api.assets.queryProjectManageListPage(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            // 查询面积统计数据
            if (type === 'search') { this.queryStatistics(form) }
            return false
          }
          throw res.message || '查询接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
      },

      // 查询统计数据
      queryStatistics (form) {
        this.overviewNumSpinning = true
        this.$api.assets.queryProjectManageProjectStatistics(form).then(r => {
          this.overviewNumSpinning = false
          let { data, code, message } = r.data
          if (data && String(code) === '0') {
            return this.numList = this.numList.map(m => {
              const { num, percent } = m
              return {
                ...m,
                value: `${data[num]}${ percent ? `(${data[percent]})` : ''}`
              }
            })
          }
          throw message || '查询资产项目统计信息出错'
        }).catch(err => {
          this.overviewNumSpinning = false
          this.$message.error(err || '查询资产项目统计信息出错')
        })
      }
    }

    // created () {}
  }
</script>

<style lang='less' scoped>
  .project_manage {
    /*padding: 8px;*/
    .custom-table {
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
    .action_text {
      color: #0084FF;
      cursor: pointer;
      margin-right: 12px;
      white-space: nowrap;
    }
  }
</style>
