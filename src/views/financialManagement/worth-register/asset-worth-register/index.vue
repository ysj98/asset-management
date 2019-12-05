<!--价值登记页面--资产价值登记Tab页面-->
<template>
  <div class="asset_worth_register">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button
          icon="plus"
          type="primary"
          @click="handleBtnAction({type: 'add'})"
        >新增资产项目</SG-Button>
        <SG-Button icon="export" :loading="exportBtnLoading" style="margin-left: 10px" @click="handleExport">导出</SG-Button>
      </div>
      <div slot="headerForm">
        <a-input placeholder="请输入登记名称" @pressEnter="queryTableData" v-model.trim="registerName" style="width: 171px; margin-right: 10px"/>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="15">
            <organ-project-type v-model="organProjectType"/>
          </a-col>
          <a-col :span="5">
            <a-select
              mode="multiple"
              :maxTagCount="2"
              style="width: 100%;"
              @change="queryTableData"
              v-model="approvalStatus"
              :options="statusOptions"
              placeholder="请选择项目状态"
            />
          </a-col>
          <a-col :span="4" style="text-align: left">
            <SG-Button type="primary" @click="queryTableData({})">查询</SG-Button>
            <!--<SG-Button style="margin-left: 10px" @click="handleReset">清空</SG-Button>-->
          </a-col>
        </a-row>
        <a-row style="margin-top: 14px">
          <a-col :span="24">
            <date-method-organ v-model="dateMethodOrgan"/>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          okText="确定"
          cancelText="取消"
          title="确定要删除该资产项目吗?"
          @confirm="confirmDelete(record)"
        >
          <span class="action_text">删除</span>
        </a-popconfirm>
        <!--<span class="action_text" @click="handleBtnAction({record.registerId, 'detail'})">详情</span>-->
        <!--<span class="action_text" @click="handleBtnAction({record.registerId, 'approval'})">审批</span>-->
        <!--<span @click="handleBtnAction({}record.registerId, 'edit'})">编辑</span>-->
        <router-link class="action_text" :to="{name: '价值登记详情', params: {registerId: record.registerId, type: 'detail'}}">详情</router-link>
        <router-link class="action_text" :to="{name: '价值登记审批', params: {registerId: record.registerId, type: 'approval'}}">审批</router-link>
        <router-link class="action_text" :to="{name: '价值登记编辑', params: {registerId: record.registerId, type: 'edit'}}">编辑</router-link>
      </span>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
  </div>
</template>

<script>
  import NoDataTip from 'src/components/noDataTips'
  import OrganProjectType from '../components/OrganProjectType'
  import DateMethodOrgan from '../components/DateMethodOrgan'
  import SearchContainer from 'src/views/common/SearchContainer'
  export default {
    name: 'index',
    components: { SearchContainer, OrganProjectType, DateMethodOrgan, NoDataTip },
    data () {
      return {
        fold: true, // 查询条件折叠按钮
        registerName: '', // 查询条件-登记名称
        exportBtnLoading: false, // 导出按钮loading
        organProjectType: {}, // 查询条件：组织机构-资产项目-资产类型 { organId, organName, projectId, assetType }
        dateMethodOrgan: {}, // { assessOrgan, assessDate, confirmDate, assessMethod }
        // 查询条件：提交日期--评估基准日-评估方式-评估机构
        approvalStatus: undefined, // 查询条件-登记状态
        statusOptions: [
          { title: '全部', key: '-1' }, { title: '草稿', key: '1' }, { title: '待审批', key: '2' },
          { title: '已驳回', key: '3' }, { title: '已审批', key: '4' }, { title: '已取消', key: '5' }
        ], // 查询条件-状态选项
        tableObj: {
          dataSource: [],
          loading: false,
          scroll: { x: 1800 },
          pagination: false,
          rowKey: 'registerId',
          columns: [
            { title: '登记单ID', dataIndex: 'registerId', fixed: 'left', width: 150  },
            { title: '所属机构', dataIndex: 'organName', fixed: 'left', width: 150  },
            { title: '价值登记单名称', dataIndex: 'registerName' }, { title: '资产项目', dataIndex: 'projectName' },
            { title: '资产类型', dataIndex: 'assetTypeName' }, { title: '评估方法', dataIndex: 'assessmentMethodName' },
            { title: '评估机构', dataIndex: 'assessmentOrganName' }, { title: '评估基准日', dataIndex: 'assessmenBaseDate' },
            { title: '资产数量', dataIndex: 'num', align: 'right' }, { title: '提交人', dataIndex: 'createByName' },
            { title: '提交时间', dataIndex: 'createTime' }, { title: '状态', dataIndex: 'approvalStatusName' },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 180 }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' }
      }
    },

    methods: {
      // 处理新增add、编辑edit、详情detail、审批approval操作
      handleBtnAction ({id, type}) {
        if (type === 'add') {
          const { organProjectType: { organId, organName } } = this
          // if (!organId) { return this.$message.info('请选择组织机构') }
          this.$router.push({ name: '价值登记新增', params: { organId, organName, type: 'add' }})
        } else {
          console.log(id)
        }
      },

      // 导出
      handleExport () {
        return this.$message.info('暂不支持')
        // if (!this.tableObj.dataSource.length) {
        //   return this.$message.info('无可导出数据')
        // }
      },

      // 删除项目
      confirmDelete ({registerId, approvalStatus}) {
        this.tableObj.loading = true
        this.$api.worthRegister.updateStatus({registerId, approvalStatus, status: 0}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$message.success('删除成功')
            // 更新列表
            const { pageNo, pageLength } = this.paginationObj
            return this.queryTableData({pageNo, pageLength})
          }
          throw res.message || '删除失败'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '删除失败')
        })
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10}) {
        const { registerName, approvalStatus, organProjectType, dateMethodOrgan } = this
        if (!organProjectType.organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        let form = {
          registerName, pageSize: pageLength, pageNum: pageNo,
          approvalStatus: approvalStatus === '-1' ? '' : approvalStatus,
          ...organProjectType, ...dateMethodOrgan
        }
        this.$api.worthRegister.queryRegisterList(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            return false
          }
          throw res.message || '查询资产价值登记接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询资产价值登记接口出错')
        })
      },
    },

    // 路由卫士，用于审批及提交成功后刷新列表
    beforeRouteEnter (to, from, next) {
      // debugger
      next(vm => {
        // 通过 `vm` 访问组件实例
        // debugger
        console.log(to, from, next, vm)
      })
    },

    watch: {
      // 全选与其他选项互斥处理
      approvalStatus: function (val) {
        if (val && val.length !== 1 && val.includes('-1')) {
          this.approvalStatus = ['-1']
        }
      },

      // 全选与其他选项互斥处理
      // sourceTypeList: function (val) {
      //   if (val && val.length !== 1 && val.includes('allType')) {
      //     this.sourceTypeList = ['allType']
      //   }
      // },

      // 长度不能超过30字符
      registerName: function (val, pre) {
        if (val && val.length > 40) {
          this.$message.warn("登记名称不能超40个字符")
          this.registerName = pre
        }
      },

      organProjectType: function (val) {
        val && val.organId && this.queryTableData({})
      },

      dateMethodOrgan: function () {
        this.queryTableData({})
      }
    }
  }
</script>

<style lang='less' scoped>
  .asset_worth_register {
    .custom-table {
      padding-bottom: 55px;
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
