<!--根据固定的组织id,资产项目id单选资产或资产卡片-->
<template>
  <SG-Modal
    :width="950"
    okText="确定"
    v-model="isShow"
    :title="`${isBatch ? '选择' : '批量修改'}${type == 'Card' ? '资产卡片' : '资产'}`"
    @cancel="handleModalAction('')"
    @ok="handleModalAction('ok')"
  >
    <div class="select_asset">
    <a-row :gutter="8" style="margin-bottom: 10px">
      <a-col :span="7">
        <a-select
          style="width: 100%"
          v-model="assetType"
          @change="queryData"
          :options="assetTypeOptions"
          placeholder="请选择资产类型"
        />
      </a-col>
      <a-col :span="7">
        <a-select
          style="width: 100%"
          v-model="objectType"
          @change="queryData"
          :options="objectTypeOptions"
          placeholder="请选择资产类别"
        />
      </a-col>
      <a-col :span="7">
        <a-input-search
          v-model.trim="name"
          style="width: 100%"
          @search="queryData"
          @pressEnter="queryData"
          placeholder="请输入名称"
        />
      </a-col>
    </a-row>
    <a-table
      size="small"
      :rowKey="type == 'Card' ? 'cardId' : 'assetId'"
      :loading="loading"
      :pagination="false"
      :scroll="{x: true}"
      :dataSource="dataSource"
      class="custom-table td-pd10"
      :columns="type == 'Card' ? cardColumns : assetColumns"
      :rowSelection="{ onChange: handleSelect, hideDefaultSelections: true, type: 'radio',}"
    />
      <div v-if="!dataSource.length" style="text-align: center; margin: 25px; color: rgba(0, 0, 0, 0.45)">暂无数据</div>
    <SG-FooterPagination
      noPageTools
      v-bind="paginationObj"
      @change="({pageNo, pageLength}) => queryData({pageNo, pageLength})"
    />
  </div>
  </SG-Modal>
</template>

<script>
  export default {
    name: 'SelectAsset',
    props: ['type', 'organId', 'projectId', 'isBatch'],
    data () {
      return {
        selectedRows: [], // 选中的行
        isShow: false, // Modal show
        name: '', // 资产名
        assetType: undefined, // 类型
        assetTypeOptions: [], // 类型选项
        objectType: undefined, // 资产类别
        objectTypeOptions: [], // 类别选项
        dataSource: [], // Table数据源
        loading: false, // Table loading
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        assetColumns: [
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '资产编码', dataIndex: 'assetCode'},
          { title: '所属机构', dataIndex: 'organName' },
          { title: '资产项目', dataIndex: 'projectName' },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'assetCategoryName' },
          { title: '位置', dataIndex: 'address' },
          { title: '状态', dataIndex: 'assetStatusName' }
        ],
        cardColumns: [
          { title: '卡片名称', dataIndex: 'cardName' },
          { title: '卡片编码', dataIndex: 'cardCode' },
          { title: '所属机构', dataIndex: 'organName' },
          { title: '资产项目', dataIndex: 'projectName' },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'assetCategoryName' },
          { title: '入账日期', dataIndex: 'accountEntryTime' },
          { title: '存放地点', dataIndex: 'storagePathName' },
          { title: '入账原值(元)', dataIndex: 'purchaseValue' },
          { title: '累计折旧(元)', dataIndex: 'cumulativeDepreciation' },
          { title: '净值(元)', dataIndex: 'netValue' },
          { title: '折旧方式', dataIndex: 'depreciationMethodName' },
          { title: '计量单位', dataIndex: 'unitOfMeasurementName' },
          { title: '数量', dataIndex: 'num' },
          { title: '减值准备(元)', dataIndex: 'impairmentReady' },
          { title: '状态', dataIndex: 'approvalStatusName' }
        ],
      }
    },

    methods: {
      queryData (obj = {}) {
        this.type == 'Card' ? this.queryCardList(obj) : this.queryAssetList(obj)
      },

      // 处理table 选中
      handleSelect (selectedRowKeys, selectedRows) {
        this.selectedRows = selectedRows
      },

      // 处理Modal显示隐藏
      handleModalAction (flag) {
        let temp = this.selectedRows
        this.selectedRows = []
        this.$emit('getValue', flag ? temp[0] : '')
        this.isShow = false
      },

      // 获取列表数据
      queryAssetList ({ pageLength = 10, pageNo = 1}) {
        const {objectType, assetNameCode: name, assetType, projectId, organId} = this
        if (!projectId) { return this.$message.warn('资产项目Id不存在')}
        this.loading = true
        let form = {
          queryType: 1, assetNameCode: name, projectId, organId,
          assetType: assetType === '-1' ? '' : assetType,
          objectType: objectType === '-1' ? '' : objectType,
          pageSize: pageLength, pageNum: pageNo
        }
        this.$api.assets.assetListPage(form).then(r => {
          let res = r.data
          if (res && res.code.toString() === '0') {
            this.loading = false
            const {count, data} = res.data
            this.dataSource = data
            return Object.assign(this.paginationObj, {
              pageLength, pageNo: Number(pageNo), totalCount: Number(count)
            })
          }
          throw res.msg
        }).catch(err => {
          this.loading = false
          this.$message.error(err || `列表查询请求错误`)
        })
      },

      // 平台字典获取资产类型
      queryAssetTypeDict () {
        this.$api.assets.platformDict({code: 'asset_type'}).then(res => {
          if (Number(res.data.code) === 0) {
            let { data } = res.data
            let list = data.map( m => ({
              title: m.name,
              key: m.value
            }))
            list.unshift({ title: '全部资产类型', key: '-1' })
            this.assetTypeOptions = list
            return false
          }
          throw res.message || '查询资产类型失败'
        }).catch(err => {
          this.$message.error(err || '查询资产类型失败')
        })
      },

      // 根据资产类型查资产分类列表
      queryObjectType (assetType) {
        this.objectType = undefined
        this.objectTypeOptions = []
        if (!assetType) { return false }
        const { organId } = this
        this.$api.assets.getList({ assetType, organId }).then(res => {
          if (Number(res.data.code) === 0) {
            let { data } = res.data
            let list = data.map( m => ({
              title: m.professionName,
              key: m.professionCode
            }))
            list.unshift({ title: '全部资产分类', key: '-1' })
            this.objectTypeOptions = list
            return false
          }
          throw res.message || '查询资产类别失败'
        }).catch(err => {
          this.$message.error(err || '查询资产类别失败')
        })
      },

      // 查询资产卡片列表
      queryCardList ({ pageLength = 10, pageNo = 1}) {
        const { objectType, name, assetType, projectId, organId } = this
        if (!projectId) { return this.$message.warn('资产项目Id不存在')}
        this.loading = true
        let form = {
          organId, projectId, cardName: name, assetType,
          assetCategoryId: objectType, pageSize: pageLength, pageNum: pageNo
        }
        this.$api.assets.queryCardPageList(form).then(r => {
          let res = r.data
          if (res && res.code.toString() === '0') {
            this.loading = false
            const {count, data} = res.data
            this.dataSource = data
            return Object.assign(this.paginationObj, {
              pageLength, pageNo: Number(pageNo), totalCount: Number(count)
            })
          }
          throw res.msg
        }).catch(err => {
          this.loading = false
          this.$message.error(err || `列表查询请求错误`)
        })
      }
    },

    // mounted () {
    //   if (this.isShow) {
    //     this.queryAssetTypeDict()
    //     this.queryData({})
    //   }
    // },

    watch: {
      assetType: function (assetType) {
        this.queryObjectType(assetType)
      },

      isShow: function (bool) {
        if (bool) {
          this.queryAssetTypeDict()
          this.queryData({})
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .select_asset {
    .custom-table {
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
  }
</style>
