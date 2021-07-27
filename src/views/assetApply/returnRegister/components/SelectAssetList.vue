<!--props参数释义：
1.height: String || Number, 设置Table及已选人员框高度，默认450px
2.allAttrs: Boolean，是否获取全部属性，默认false获取userId字符串构成的数组
3.value: Array，直接用v-model绑定组件即可,默认格式['UID001', 'UID001']，若 allAttrs 为true, 输入格式[{assetId: 'UID001'}]
-->
<template>
  <div class="select-detail">
    <a-row :gutter="8" style="margin-bottom: 10px">
      <a-col :span="3">
        <div style="line-height: 32px; font-weight: bold">待选资产</div>
      </a-col>
      <a-col :span="6">
        <a-select
          style="width: 100%"
          v-model="objectType"
          @change="fetchData"
          :options="$addTitle(objectTypeOptions)"
          placeholder="请选择资产类别"
          :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
          "
        />
      </a-col>
      <a-col :span="6">
        <a-input-search
          v-model.trim="receiveDetailId"
          style="width: 100%"
          @search="fetchData"
          @pressEnter="fetchData"
          placeholder="请输入领用编号"
        />
      </a-col>
      <a-col :span="6">
        <a-input-search
          v-model.trim="assetName"
          style="width: 100%"
          @search="fetchData"
          @pressEnter="fetchData"
          placeholder="请输入资产名称"
        />
      </a-col>
      <a-col :span="6" :offset="3">
        <div style="line-height: 32px">已选：<span style="color: #49505E; font-weight: bold">{{selectedList.length}}</span></div>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :span="18">
        <div class="col_div" :style="`height: ${height}px`">
          <div :style="`overflow-y: auto; height: ${height - 51}px; max-height: ${height - 51}px`">
            <a-table
              size="small"
              rowKey="receiveDetailId"
              :columns="columns"
              :loading="loading"
              :pagination="false"
              :dataSource="dataSource"
              class="custom-table td-pd10"
              :scroll="{x: 1200}"
              :rowSelection="{selectedRowKeys, onChange: handleSelectChange}"
            />
          </div>
          <SG-FooterPagination ref="footerPagination" v-bind="paginationObj" @change="({pageNo, pageLength}) => fetchData({pageNo, pageLength})"/>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="col_div" :style="`overflow-y: auto; height: ${height}px; max-height: ${height}px`" >
          <div class="item_div" v-for="item in selectedList" :key="item.receiveDetailId" >
            {{item.assetName}}
            <a-icon type="close" class="remove_icon" @click="removeItem(item.receiveDetailId)"/>
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
      // !注意：默认格式['UID001', 'UID001']，如果 allAttrs 为true, 传入格式为[{assetId: 'UID001'}],
      value: { type: Array, default: () => [] },
      // 查询类型 必须 1 资产变动，2 资产清理 3 权属登记
      queryType: { type: [Number, String], default: () => 2 },
      // 资产项目projectId
      proId: { type: [Number, String], default: () => '' },
      // 资产类型
      assetType: { type: [Number, String], default: () => '' }
    },
    data () {
      return {
        list: [], // 回传数据列表
        receiveDetailId: '', // 领用编号
        assetName: '', // 资产名
        // assetType: undefined, // 类型
        // assetTypeOptions: [], // 类型选项
        projectId: undefined, // 资产项目
        projectOptions: [], // 资产项目选项
        objectType: undefined, // 资产类别
        objectTypeOptions: [], // 类别选项
        dataSource: [], // Table数据源
        loading: false, // Table loading
        selectedList: [], // 选中人员list
        selectedRowKeys: [], // Table选中项
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute', noPageTools: false },
        columns: [
          { title: '领用编号', dataIndex: 'receiveDetailId', fixed: 'left', width: 120 },
          { title: '资产编码', dataIndex: 'assetCode' },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'assetCategoryName' },
          { title: '领用日期', dataIndex: 'receiveDate' },
          { title: '领用人', dataIndex: 'receiveUserName' },
          { title: '领用面积（㎡）', dataIndex: 'receiveArea' },
          { title: '已归还面积(㎡)', dataIndex: 'returnArea' },
          { title: '未归还面积(㎡)', dataIndex: 'unReturnArea' }
        ]
      }
    },

    methods: {
      // 获取列表数据
      fetchData ({ pageLength = 10, pageNo = 1}) {
        const {objectType, assetName, assetType, proId: projectId, queryType, organId, receiveDetailId} = this
        if (!projectId) { return this.$message.warn('资产项目Id不存在')}
        this.loading = true
        let form = {
          queryType, assetName, projectId, organId, receiveDetailId,
          // projectId: projectId === '-1' ? '' : projectId, 改前
          assetType: assetType === '-1' ? '' : assetType,
          objectType: objectType === '-1' ? '' : objectType,
          pageSize: pageLength, pageNum: pageNo
        }
        console.log(123)
        return this.$api.useManage.getReceiveRecordPage(form).then(r => {
          let res = r.data
          if (res && res.code.toString() === '0') {
            this.loading = false
            res.data.data.map((item,index) => {
              if(!item.returnArea){
                res.data.data[index].returnArea = 0
              }
              if(!item.unReturnArea){
                res.data.data[index].unReturnArea = 0
              }
              if(!item.receiveArea){
                res.data.data[index].receiveArea = 0
              }
            })
            console.log(res)
            if(this.assetType != '房屋' && this.assetType != '土地' && this.assetType != '车场' ){}
            const {count, data} = res.data
            this.dataSource = data
            Object.assign(this.paginationObj, {
              pageLength,
              location: 'absolute',
              pageNo: Number(pageNo),
              totalCount: Number(count)
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
      handleSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.list.push(selectedRows)
      },

      // 移除选中的人员
      removeItem (id) {
        this.selectedRowKeys = this.selectedRowKeys.filter(i => i !== id)
        this.list = this.list.map((item) => {
          if(item.assId != id) {
            return item
          }
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

      // 资产项目
      queryProjectByOrganId () {
        this.$api.assets.getObjectKeyValueByOrganId({organId: this.organId, projectName: ''}).then(res => {
          if (Number(res.data.code) === 0) {
            let { data } = res.data
            let arr = data.map(m => ({
              title: m.projectName,
              key: m.projectId
            }))
            // arr.unshift({title: '全部项目', key: '-1'}) 改前
            this.projectId = arr.length ? arr[0].key : undefined
            this.projectOptions = arr
            return this.fetchData({})
          }
          throw res.message || '查询资产项目失败'
        }).catch(err => {
          this.$message.error(err || '查询资产项目失败')
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
      // 向父组件传值
      getReturnAssetInfo() {
        this.$emit('getReturnAssetInfo', this.selectedList)
      }
    },
    mounted () {
      const {allAttrs, value, assetType} = this
      if(this.assetType != 1 && this.assetType != 2 && this.assetType != 4 ) {
               this.columns = [
          { title: '领用编号', dataIndex: 'receiveDetailId', fixed: 'left', width: 120 },
          { title: '资产编码', dataIndex: 'assetCode' },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'assetCategoryName' },
          { title: '领用日期', dataIndex: 'receiveDate' },
          { title: '领用人', dataIndex: 'receiveUserName' },
        ]
          }
      this.fetchData({}).then(() => this.selectedRowKeys = allAttrs ? value.map(i => i.receiveDetailId) : value)
      this.queryObjectType(String(assetType))
      // 添加可以选择不同数量分页
      this.$nextTick(function () {
        let arr = this.$refs.footerPagination.pageLists
        if (!arr.includes(200)) {
          this.$refs.footerPagination.pageLists = [10, 20, 30, 50, 100, 200]
        }
      })
    },
    watch: {
      assetType: function () {
          if(this.assetType != 1 && this.assetType != 2 && this.assetType != 4 ) {

               this.columns = [
          { title: '领用编号', dataIndex: 'receiveDetailId', fixed: 'left', width: 120 },
          { title: '资产编码', dataIndex: 'assetCode' },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'assetCategoryName' },
          { title: '领用日期', dataIndex: 'receiveDate' },
          { title: '领用人', dataIndex: 'receiveUserName' },
        ]
          }
      },
      value: function (value) {
        this.selectedRowKeys = this.allAttrs ? value.map(i => i.receiveDetailId) : value
      },

      selectedRowKeys: function (keys) {
        let {dataSource, allAttrs, selectedList, list} = this
        let primaryKeys = []
        let primaryList = selectedList.filter(n => {
          // let flag = []
          // if(keys.includes(n.assetId)){
          //   flag.push(n)
          // }
          let flag = keys.includes(n.receiveDetailId)
          flag && primaryKeys.push(n.receiveDetailId)
          return flag
        })
        let newList = dataSource.filter(i => !primaryKeys.includes(i.receiveDetailId) && keys.includes(i.receiveDetailId))
        // let newList = []
        // if(dataSource.length){
        //    newList = dataSource.map(i => {
        //   if (primaryKeys.includes(i.assetId) && !keys.includes(i.assetId)) {
        //     return i
        //   }
        // })
        // }
        this.selectedList = primaryList.concat(newList)
        this.$emit('input', allAttrs ? selectedList : keys)
        this.getReturnAssetInfo()
        //this.$emit('input', selectedList)
      },
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
