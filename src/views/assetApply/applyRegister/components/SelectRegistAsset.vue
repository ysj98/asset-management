<!--查询所选资产项目及资产类型下的资产登记单-->
<!--props参数释义：
1.height: String || Number, 设置Table及已选人员框高度，默认450px
-->
<template>
  <div class="select_detail">
    <a-row :gutter="8" style="margin-bottom: 10px">
      <a-col :span="3">
        <div style="line-height: 32px; font-weight: bold">待选列表</div>
      </a-col>
      <a-col :span="15" style="text-align: right">
        <a-input-search
          v-model.trim="registerOrderName"
          style="width: 220px"
          @search="fetchData"
          @pressEnter="fetchData"
          placeholder="请输入登记单名称"
        />
      </a-col>
      <a-col :span="6">
        <div style="line-height: 32px">已选：<span style="color: #49505E; font-weight: bold">{{selectedList.length}}</span></div>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :span="18">
        <div class="col_div" :style="`height: ${height}px`">
          <div :style="`overflow-y: auto; height: ${height - 51}px; max-height: ${height - 51}px`">
            <a-table
              size="small"
              :columns="columns"
              :loading="loading"
              :pagination="false"
              :scroll="{x: 900}"
              :dataSource="dataSource"
              rowKey="registerOrderId"
              class="custom-table td-pd10"
              :rowSelection="{selectedRowKeys, onChange: handleSelectChange}"
            />
          </div>
          <SG-FooterPagination v-bind="paginationObj" @change="({pageNo, pageLength}) => fetchData({pageNo, pageLength})"/>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="col_div" :style="`overflow-y: auto; height: ${height}px; max-height: ${height}px`">
          <div class="item_div" v-for="item in selectedList" :key="item.registerOrderId">
            {{item.registerOrderName}}
            <a-icon type="close" class="remove_icon" @click="removeItem(item.registerOrderId)"/>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'SelectRegistAsset',
    props: {
      // projectId 必须
      projectId: { type: [Number, String], default: () => '' },
      // storeId 必须
      storeId: { type: [Number, String], default: () => '' },
      // projectId 必须
      organId: { type: [Number, String], default: () => '' },
      // 资产类型 必须
      assetType: { type: [Number, String], default: () => '' },
      // 设置table高度
      height: { type: [Number, String], default: () => 550 },
      // 初始选中的值，以v-model方式传入, 格式['UID001', 'UID001']
      initList: { type: Array, default: () => [] }
    },
    data () {
      return {
        registerOrderName: '', // 资产名
        dataSource: [], // Table数据源
        loading: false, // Table loading
        selectedList: [], // 选中人员list
        selectedRowKeys: [], // Table选中项
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute', noPageTools: true },
        columns: [
          { title: '登记单编号', dataIndex: 'registerOrderId', fixed: 'left', width: 120 },
          { title: '登记单名称', dataIndex: 'registerOrderName' },
          { title: '所属机构', dataIndex: 'organName' },
          { title: '资产项目', dataIndex: 'projectName' },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产数量', dataIndex: 'assetNum' },
          { title: '创建人', dataIndex: 'createByName' },
          { title: '创建日期', dataIndex: 'createTime' }
        ]
      }
    },

    methods: {
      // 获取列表数据
      fetchData ({ pageLength = 10, pageNo = 1}) {
        const {registerOrderName, assetType, projectId, organId, storeId} = this
        if (!projectId || !organId || !assetType) { return Promise.reject() }
        this.loading = true
        let form = {
          assetTypes: assetType, registerOrderName, projectId, organId, storeId,
          pageSize: pageLength, pageNum: pageNo, approvalStatusList: ['1'], operationSource: '2'
        }
        return this.$api.assets.getRegisterOrderListPage(form).then(({data}) => {
          if (data && data.code.toString() === '0') {
            this.loading = false
            const {count, data: list} = data.data
            this.dataSource = list || []
            this.paginationObj = Object.assign(this.paginationObj, {
              pageLength,
              pageNo: Number(pageNo),
              totalCount: Number(count)
            })
            return false
          }
          throw data.msg
        }).catch(err => {
          this.loading = false
          this.$message.error(err || `列表查询请求错误`)
        })
      },

      // 处理选中的数据
      handleSelectChange (selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },

      // 移除选中的人员
      removeItem (id) {
        this.selectedRowKeys = this.selectedRowKeys.filter(i => i !== id)
      }
    },
    mounted () {
      this.fetchData({}).then(() => this.selectedRowKeys = this.initList.map(i => Number(i.registerOrderId)))
    },
    watch: {
      selectedRowKeys: function (keys) {
        let {dataSource, selectedList} = this
        let primaryKeys = []
        let primaryList = selectedList.filter(n => {
          let flag = keys.includes(n.registerOrderId)
          flag && primaryKeys.push(n.registerOrderId)
          return flag
        })
        let newList = dataSource.filter(i => !primaryKeys.includes(i.registerOrderId) && keys.includes(i.registerOrderId))
        this.selectedList = primaryList.concat(newList)
      }
    }
  }
</script>

<style lang='less' scoped>
  .select_detail {
    min-width: 650px;
    .col_div {
      position: relative;
      border-radius: 3px;
      border: 1px solid #DCE1E6;
      & /deep/ .sg-FooterPagination {
        margin-bottom: 0 !important;
        padding: 5px 20px !important;
      }
      .item_div {
        /*width: 100%;*/
        padding: 10px;
        cursor: default;
        overflow: hidden;
        &:hover {
          background-color: #e6f7ff;
        }
        .remove_icon {
          float: right;
          margin-top: 5px;
          cursor: pointer;
        }
      }
    }
    .custom-table {
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table {
        .ant-table-thead th {
          white-space: nowrap;
        }
      }
    }
  }
</style>
