<!--资产视图业务-资产视图详情页面-其它信息组件-->
<template>
  <div class="other_info" v-if="Object.keys(infoKeys).length">
    <SG-Title title="其他信息"/>
    <a-tabs defaultActiveKey="receive" v-model="tabKey" class="title_div">
      <a-tab-pane v-for="(item, itemKey) in infoKeys" :tab="item.title" :key="itemKey">
        <!--散列信息-->
        <a-row v-if="Object.keys(item.details).length">
          <a-col :span="8" v-for="(name, key) in item.details" :key="key">
            <span style="margin-right: 4px; color: #282D5B">{{name}}:</span>
            <span style="color: #49505E">{{detailData[key] || '无'}}</span>
          </a-col>
        </a-row>
        <!--列表部分-->
        <div v-if="item['table']['tableTitle']" style="color: #49505E; margin: 15px 0; font-weight: bold">{{item['table']['tableTitle']}}</div>
        <a-table
          class="custom-table td-pd10 table-border"
          v-if="item['table']['rowKey']"
          :rowKey="item['table']['rowKey']"
          :columns="item['table']['columns']"
          :dataSource="tableData"
          :pagination="false"
        />
        <SG-FooterPagination
          v-if="item['table']['pagination']"
          :pageLength="pagination.pageSize"
          :totalCount="pagination.totalCount"
          v-model="pagination.pageNum"
          @change="handleChange"
        />
        <!--特殊处理：权属信息展示的第两个Table-->
        <div v-if="item['table2']">
          <div style="color: #49505E; margin: 35px 0 15px; font-weight: bold">{{item['table2']['tableTitle']}}</div>
          <a-table
            :rowKey="item['table2']['rowKey']"
            :columns="item['table2']['columns']"
            :dataSource="table2Data"
            :pagination="false"
            class="custom-table td-pd10 table-border"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane tab="运营信息" key="operationInformation">
        <operationInformation :assetHouseId="assetHouseId" :assetId="assetId" :transferOperationArea="transferOperationArea" :transferOperationTime="transferOperationTime"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import infoKeys from './otherInfoKeys'
  import operationInformation from './operationInformation'
  let getUuid = ((uuid = 1) => () => ++uuid)();
  // let 2 收入，3费用
  let reportBillIdNameMap = {
    '2': '收入',
    '3': '费用'
  }
  let settleUpMap = {
    '0': '否',
    '1': '是'
  }
  let pagination = {
    pageNum: 1,
    pageSize: 10,
    totalCount: 0
  }
  export default {
    name: 'OtherInfoPart',
    props: ['assetHouseId', 'assetId', 'transferOperationArea', 'transferOperationTime'],
    components: {
      operationInformation
    },
    data () {
      return {
        infoKeys, // 所有Tab的展示字段
        tabKey: 'receiveInfo', // 默认展示第一个Tab-接管信息
        detailData: {}, // 散列信息
        tableData: [], // table信息
        table2Data: [], // table2信息
        cacheDataObj: {}, // 缓存信息
        pagination: { ...pagination}, // 缓存分页一
        apiObj: {
          ownInfo: { api: 'queryAssetViewOwnDetail', tip: '权属信息', param: 'assetId', data: 'assetId' }, // 权属信息
          receiveInfo: { api: 'queryAssetViewTakeOverDetail', tip: '接管信息', param: 'assetObjectId', data: 'assetHouseId' }, // 接管信息
          changeInfo: { api: 'queryAssetViewChangeDetail', tip: '变动记录', param: 'assetObjectId', data: 'assetHouseId' }, // 变动记录
          billInfo: { api: 'queryAssetViewBillDetail', tip: '账面信息', param: 'assetId', data: 'assetId' }, // 账面信息
          accessoryInfo: { api: 'queryAssetViewAccessoryDetail', tip: '附属&配套', param: 'assetId', data: 'assetId' }, // 附属&配套
          disposeInfo: { api: 'queryAssetViewDisposeDetail', tip: '资产处置', param: 'assetId', data: 'assetId' }, // 资产处置
          relatedExpenses: { api: 'assetExpenseInfo', tip: '相关费用', param: 'assetHouseId', data: 'assetHouseId', pagination: true}, // 相关费用
        } // 接口API相关, api接口url,tip提示中文，param接口入参字段名, data接口入参字段值
      }
    },

    methods: {
      queryDetail (type) {
        let { api, tip, param, data } = this.apiObj[type]
        if (!api) { return false }
        let queryData = {[param]: this[data]}
        // 如果有分页
        if (this.apiObj[type]['pagination']) {
          queryData.pageNum = this.pagination.pageNum
          queryData.pageSize = this.pagination.pageSize
        }
        this.$api.assets[api](queryData).then(r => {
          let res = r.data
          let detailData = {}
          let tableData = []
          let table2Data = []
          if (res && String(res.code) === '0') {
            const info = res.data
            if (type === 'ownInfo') {
              let { ownerTypeName, ownershipStatusName, ownershipInfo, transactionList } = info
              detailData = { ownerTypeName, ownershipStatusName }
              tableData = ownershipInfo
              table2Data = transactionList
            } else if (type === 'receiveInfo') {
              let { deliverList, ...others } = info
              let { infoKeys: { receiveInfo: { details } } } = this
              // 是否转运营
              if (!others.transferTime) {
                others.isTransfer = '否'
              } else {
                others.isTransfer = '是'
                this.infoKeys.receiveInfo.details = { ...details, transferTime: '转物业日期' }
              }
              // 是否转物业
              if (!others.transferOperationTime) {
                others.isTransferOperation = '否'
              } else {
                others.isTransferOperation = '是'
                this.infoKeys.receiveInfo.details = { ...details, transferOperationTime: '转运营日期' }
              }
              detailData = others
              tableData = deliverList
            } else if (type === 'changeInfo' || type === 'accessoryInfo') {
              tableData = info
            } else if (type === 'billInfo') {
              let { data, ...others } = info
              detailData = others
              tableData = data.map((m, i) => ({ ...m, index: i + 1 }))
            } else if (type === 'disposeInfo') {
              let { list, ...others } = info
              detailData = others
              tableData = list
            }
            // 相关费用
            if (type === 'relatedExpenses') {
              tableData = res.data.data.map((m,i) => {
                m.reportBillIdName = m.reportBillId ? reportBillIdNameMap[String(m.reportBillId)] : '/'
                m.settleUpName = m.settleUp || m.settleUp===0 ? settleUpMap[String(m.settleUp)] : '/'
                m.amount = m.amount || '/'
                m.unitPrice = m.unitPrice || '/'
                m.readNumber = m.readNumber || '/'
                m.useLevel = m.useLevel || '/'
                return {
                  keyId: getUuid(),
                  ...m,
                }
              })
              this.pagination.totalCount = Number(res.data.count)
            }
            // 缓存数据
            let obj = type === 'ownInfo' ? { detailData, tableData, table2Data } : { detailData, tableData }
            obj = type === 'relatedExpenses' ? { detailData, tableData, pagination: {...this.pagination}} : obj
            this.cacheDataObj[type] = obj
            return Object.assign(this, obj)
          }
          throw res.message || `查询${tip}错误`
        }).catch(err => {
          this.$message.error(err || `查询${tip}错误`)
        })
      },
      // 由于会出现多个接口查询
      queryDetail2 (type) {
        
      },
      handleChange(data) {
        this.pagination.pageNum = data.pageNo;
        this.pagination.pageSize = data.pageLength;
        this.queryDetail(this.tabKey)
      },
      handleChange2(data) {
        this.pagination2.pageNum = data.pageNo;
        this.pagination2.pageSize = data.pageLength;
        this.queryDetail2(this.tabKey)
      },
    },
    
    created () {
      this.queryDetail(this.tabKey)
    },

    watch: {
      tabKey (key) {
        // 如果是运营管理退出
        if (key === 'operationInformation') {
          return
        }
        // 如果Tab被激活过，不再请求接口数据
        const {cacheDataObj} = this
        if (cacheDataObj[key]) {
          Object.assign(this, cacheDataObj[key])
        } else {
          // 清空数据
          Object.assign(this, {
            detailData: {},
            tableData: [],
            table2Data: [],
            pagination: {...pagination},
          })
          this.queryDetail(key)
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .other_info {
    .custom-table {
      /*padding-bottom: 55px;*/
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table {
        .ant-table-thead th {
          white-space: nowrap;
        }
      }
    }
    margin-bottom: 35px;
  }
</style>
