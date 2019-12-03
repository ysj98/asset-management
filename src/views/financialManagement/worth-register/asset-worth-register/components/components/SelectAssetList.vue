<!--props参数释义：
1.height: String || Number, 设置Table及已选人员框高度，默认450px
2.allAttrs: Boolean，是否获取全部属性，默认false获取userId字符串构成的数组
3.value: Array，直接用v-model绑定组件即可,默认格式['UID001', 'UID001']，若 allAttrs 为true, 输入格式[{userId: 'UID001'}]
-->
<template>
  <div class="select-detail">
    <a-row :gutter="8" style="margin-bottom: 10px">
      <a-col :span="2">
        <div style="line-height: 32px; font-weight: bold">待选资产</div>
      </a-col>
      <a-col :span="4">
        <a-input-search
          v-model.trim="assetName"
          style="width: 100%"
          @search="fetchData"
          @pressEnter="fetchData"
          placeholder="请输入资产名称"
        />
      </a-col>
      <a-col :span="4">
        <a-select
          mode="multiple"
          :maxTagCount="2"
          style="width: 100%"
          v-model="project"
          :options="projectOptions"
          placeholder="请选择资产项目"
        />
      </a-col>
      <a-col :span="4">
        <a-select
          mode="multiple"
          :maxTagCount="2"
          style="width: 100%"
          v-model="status"
          :options="statusOptions"
          placeholder="请选择资产类别"
        />
      </a-col>
      <a-col :span="4">
        <a-select
          mode="multiple"
          :maxTagCount="2"
          style="width: 100%"
          v-model="assetType"
          :options="assetTypeOptions"
          placeholder="请选择资产类型"
        />
      </a-col>
      <a-col :span="6">
        <div style="line-height: 32px">已选：<span style="color: #49505E; font-weight: bold">{{selectedList.length}}</span></div>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :span="18">
        <div class="col_div" :style="`height: ${height}px; max-height: ${height}px`">
          <a-table
            size="small"
            rowKey="assetId"
            :columns="columns"
            :loading="loading"
            :pagination="false"
            :dataSource="dataSource"
            class="custom-table td-pd10"
            :scroll="{y: Number(height) - 100, x: true}"
            :rowSelection="{selectedRowKeys, onChange: handleSelectChange}"
          />
          <SG-FooterPagination v-bind="paginationObj" @change="({pageNo, pageLength}) => fetchData({pageNo, pageLength})"/>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="col_div" :style="`height: ${height}px; max-height: ${height}px`">
          <div class="item_div" v-for="item in selectedList" :key="item.assetId">
            {{item.assetName}}
            <a-icon type="close" class="remove_icon" @click="removeItem(item.assetId)"/>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'SelectAssetList',
    props: {
      // 是否获取全部属性，默认获取userId字符串构成的数组
      allAttrs: { type: Boolean, default: () => false },
      // organId
      organId: { type: [Number, String], default: () => '' },
      // 设置table高度
      height: { type: [Number, String], default: () => 450 },
      // 初始选中的值，以v-model方式传入
      // !注意：默认格式['UID001', 'UID001']，如果 allAttrs 为true, 传入格式为[{userId: 'UID001'}],
      value: { type: Array, default: () => [] }
    },
    data () {
      return {
        assetName: '', // 资产名
        assetType: undefined, // 类型
        assetTypeOptions: [], // 类型选项
        project: undefined, // 资产项目
        projectOptions: [], // 资产项目选项
        status: undefined, // 资产类别
        statusOptions: [], // 类别选项
        dataSource: [], // Table数据源
        loading: false, // Table loading
        selectedList: [], // 选中人员list
        selectedRowKeys: [], // Table选中项
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        columns: [
          { title: '资产编码', dataIndex: 'assetCode' },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '所属机构', dataIndex: 'organName' },
          { title: '资产项目', dataIndex: 'projectName' },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'assetCategoryName' },
          { title: '位置', dataIndex: 'address' },
          { title: '状态', dataIndex: 'assetStatusName' }
        ]
      }
    },

    methods: {
      // 获取列表数据
      fetchData ({ pageLength = 10, pageNo = 1}) {
        this.loading = true
        const {assetName, project, organId, assetType} = this
        Promise.reject({assetType, organId, pageSize: pageLength, pageNum: pageNo, assetName, project}).then(res => {
          if (res && res.code.toString() === '0') {
            this.loading = false
            const {paginator: {pageLimit, pageNo, totalCount}, resultList} = res.data
            Object.assign(this, {
              dataSource: resultList || [],
              pagination: {pageSize: Number(pageLimit), current: Number(pageNo), total: Number(totalCount)}
            })
            return false
          }
          throw res.msg
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
      const {allAttrs, value} = this
      this.selectedRowKeys = allAttrs ? value.map(i => i.assetId) : value
      this.fetchData({})
    },
    watch: {
      selectedRowKeys: function (keys) {
        let {dataSource, allAttrs, selectedList} = this
        let primaryKeys = []
        let primaryList = selectedList.filter(n => {
          let flag = keys.includes(n.assetId)
          flag && primaryKeys.push(n.assetId)
          return flag
        })
        let newList = dataSource.filter(i => !primaryKeys.includes(i.assetId) && keys.includes(i.assetId))
        this.selectedList = primaryList.concat(newList)
        this.$emit('input', allAttrs ? selectedList : keys)
      }
    }
  }
</script>

<style lang='less' scoped>
  .select-detail {
    min-width: 650px;
    .col_div {
      /*height: 450px;*/
      /*max-height: 450px;*/
      position: relative;
      overflow-y: auto;
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
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
  }
</style>
