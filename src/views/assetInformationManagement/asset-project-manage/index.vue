<!--资产项目管理业务-资产项目管理列表页面-->
<template>
  <div class="project_manage">
    <!--搜索条件-->
    <search-container v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="plus" type="primary" @click="handleModalOpen('add')">新增资产项目</SG-Button>
        <SG-Button icon="import" style="margin-left: 10px" @click="handleClick('import')">导入资产项目</SG-Button>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="6">
            <a-select mode="multiple" placeholder="请选择项目状态" style="width: 100%;" :options="statusOptions"/>
          </a-col>
          <a-col :span="6">
            <a-select placeholder="请选择来源方式" style="width: 100%;" :options="sourceOptions"/>
          </a-col>
          <a-col :span="6" style="text-align: left">
            <a-checkbox :checked="isPrivate" style="vertical-align: sub">仅当前机构下资产项目</a-checkbox>
          </a-col>
          <a-col :span="6">
            <SG-Button type="primary" @click="handleModalOpen('add')">查询</SG-Button>
            <SG-Button style="margin-left: 10px" @click="handleClick('import')">清空</SG-Button>
          </a-col>
        </a-row>
        <a-row :gutter="8" style="margin-top: 14px">
          <a-col :span="6">
            <a-select placeholder="请选择是否接管" style="width: 100%;" :options="ownOptions"/>
          </a-col>
          <a-col :span="6">
            <a-select placeholder="请选择是否转运营" style="width: 100%;" :options="operateOptions"/>
          </a-col>
          <a-col :span="6">
            <a-input placeholder="请输入资产项目名称" v-model="name"/>
          </a-col>
        </a-row>
      </div>
    </search-container>
    <!--概览-->
    <overview-number :numList="numList"/>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table">
      <span slot="action" slot-scope="text, record">
        <span class="btn-text">Delete</span>
        <a-popconfirm
          okText="确定"
          cancelText="取消"
          @confirm="confirmDelete(record.id)"
          title="确定删除该资产项目吗?"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="handleChangePage"/>
    <!--新增、编辑弹窗-->
    <SG-Modal
      v-bind="modalObj"
      v-model="modalObj.status"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <base-info ref="baseInfo" :isEdit="false"/>
    </SG-Modal>
    <!--<router-link to="/assetProjectDetail">戳我去详情页</router-link>-->
  </div>
</template>

<script>
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import SearchContainer from 'src/views/common/SearchContainer'
  import BaseInfo from './components/components/BaseInfoPart'
  export default {
    name: 'index',
    components: { BaseInfo, SearchContainer, OverviewNumber },
    data () {
      return {
        fold: true, // 查询条件折叠
        name: '', // 资源项目名称
        isPrivate: false, // 是否仅当前机构下资产项目
        ownOptions: [], // 是否接管选项
        statusOptions: [
          {key: 0, title: '全部状态'}, {key: 1, title: '待审批'},
          {key: 2, title: '已驳回'}, {key: 3, title: '已审批'}
        ], // 项目状态选项
        sourceOptions: [], // 来源方式选项
        operateOptions: [], // 是否转运营选项
        numList: [
          {title: '运营(㎡)', value: 0, bgColor: '#4BD288'}, {title: '闲置(㎡)', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', value: 0, bgColor: '#DD81E6'}, {title: '占用(㎡)', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据，title 标题，value 数值，color 背景色
        modalObj: { title: '', details: {}, status: false, okText: '', cancelText: '', bodyStyle: {} },
        tableObj: {
          rowKey: 'assetCode',
          loading: false,
          dataSource: [],
          scroll: { x: true },
          columns: [
            { title: '管理机构', dataIndex: 'name', key: 'name', fixed: 'left' },
            { title: '资产项目名称', dataIndex: 'age', key: 'age' },
            { title: '资产项目编码', dataIndex: 'address', key: 'address' },
            { title: '来源方式', key: 'tags', dataIndex: 'tags', scopedSlots: { customRender: 'tags' } },
            { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 100 },
          ]
        },
        paginationObj: { pageNo: 0, totalCount: 0, pageLength: 0, location: 'absolute' }
      }
    },
    
    methods: {
      // Table切换页码页数
      handleChangePage ({ pageNo, pageLength }) {
        debugger
      },

      // 删除资产项目
      confirmDelete (id) {
        console.log(id)
        debugger
        this.queryData()
      },

      // Table搜索
      queryData () {
        this.tableObj.loading = true
        // const {} = this
      },

      // 导入、查询按钮事件
      handleClick (type) {
        switch (type) {
          case 'search':
            // this.handleModalOpen()
        }
      },

      // Modal关闭
      handleModalCancel () {
        this.modalObj.status = false
      },

      // Modal提交
      handleModalOk () {
        new Promise((resolve, reject) => {
          this.$refs['baseInfo'].handleSubmit(resolve, reject)
        }).then(res => {
          debugger
        }).catch(err => {
          debugger
        })
      },

      // Modal打开
      handleModalOpen (type) {
        const textObj = {
          add: {title: '新建资产项目', okText: '提交审核', cancelText: '取消'},
          edit: {title: '编辑资产项目', okText: '提交审核', cancelText: '取消'},
          approval: {title: '审核资产项目', okText: '审核通过', cancelText: '驳回'}
        }
        Object.assign(this.modalObj, {
          status: true,
          ...textObj[type],
          details: {},
          bodyStyle: {maxHeight: `${document.documentElement.clientHeight - 180}px`, overflowY: 'auto'}
        })
      }
    },

    mounted () {
      // this.handleModalOpen('add')
    }
  }
</script>

<style lang='less' scoped>
  .project_manage {
    padding: 8px;
    .custom-table {
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
  }
</style>
