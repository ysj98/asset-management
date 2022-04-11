<!--资产视图业务-资产视图详情页面-其它信息组件-->
<template>
  <div class="other_info" v-if="Object.keys(infoKeys).length && isPageShow">
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
          :columns="item['table']['columns']"
          :dataSource="tableData"
          :pagination="false">
          <span slot="operation" style="color: #0084FF; cursor: pointer" slot-scope="text, record" @click="checkDetail(record)">详情</span>
          <span class="img-icon" slot="attachmentList" slot-scope="text, record">
            <img v-if="record.attachmentList.length" :src="getUrl(record.attachmentList[0].attachmentPath)" alt="" @click="openBigImg(record.attachmentList)">
            <span v-if="record.attachmentList.length" class="ing-mum">{{record.attachmentList.length}}</span>
            <span v-else>--</span>
          </span>
          <span class="img-icon" slot="rectifyAttachmentList" slot-scope="text, record">
            <img v-if="record.rectifyAttachmentList.length" :src="getUrl(record.rectifyAttachmentList[0].attachmentPath)" alt="" @click="openBigImg(record.rectifyAttachmentList)">
            <span v-if="record.rectifyAttachmentList.length" class="ing-mum">{{record.rectifyAttachmentList.length}}</span>
            <span v-else>--</span>
          </span>
        </a-table>
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
    <preview-images v-if="bigImg.show" @closeImg="hideImg" :imgIndex='bigImg.imgIndex' :list="bigImg.list"></preview-images>
  </div>
</template>

<script>
  import { ASSET_MANAGEMENT } from "@/config/config.power";
  import infoKeys from './otherInfoKeys'
  import PreviewImages from 'components/PreviewImages.vue'
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
      operationInformation, PreviewImages
    },
    data () {
      return {
        ASSET_MANAGEMENT, // tab页签的权限
        isPageShow: false, //  根据是否存在拥有至少一个tab页签的权限来控制其它信息是否展示
        infoKeys, // 所有Tab的展示字段
        tabKey: 'receiveInfo', // 默认展示第一个Tab-接管信息
        detailData: {}, // 散列信息
        tableData: [], // table信息
        table2Data: [], // table2信息
        cacheDataObj: {}, // 缓存信息
        pagination: { ...pagination}, // 缓存分页一
        apiObj: {
          ownInfo: { api: 'queryAssetViewOwnDetail', tip: '权属信息', param: 'assetId', data: 'assetId', prower: 'power_ownInfo' }, // 权属信息
          receiveInfo: { api: 'queryAssetViewTakeOverDetail', tip: '接管信息', param: 'assetId', data: 'assetId', prower: 'power_receiveInfo' }, // 接管信息
          changeInfo: { api: 'queryAssetViewChangeDetail', tip: '变动记录', param: 'assetId', data: 'assetId', prower: 'power_changeInfo' }, // 变动记录
          billInfo: { api: 'queryAssetViewBillDetail', tip: '账面信息', param: 'assetId', data: 'assetId', prower: 'power_billInfo' }, // 账面信息
          patrolRecord: { api: 'queryAssetViewPatrolDetail', tip: '巡查记录', param: 'assetId', data: 'assetId', pagination: true, prower: 'power_patrolRecord' }, // 巡查记录
          accessoryInfo: { api: 'queryAssetViewAccessoryDetail', tip: '附属&配套', param: 'assetId', data: 'assetId', prower: 'power_accessoryInfo' }, // 附属&配套
          disposeInfo: { api: 'queryAssetViewDisposeDetail', tip: '资产处置', param: 'assetId', data: 'assetId', prower: 'power_disposeInfo' }, // 资产处置
          relatedExpenses: { api: 'assetExpenseInfo', tip: '相关费用', param: 'assetId', data: 'assetId', pagination: true, prower: 'power_relatedExpenses' }, // 相关费用
          archive: { api: 'queryAssetViewArchiveDetail', tip: '档案文件', param: 'assetId', data: 'assetId', pagination: true, prower: 'power_archive' } // 档案文件
        }, // 接口API相关, api接口url,tip提示中文，param接口入参字段名, data接口入参字段值
        bigImg: { // 查看大图所需数据
          show: false,
          list: [],
          imgIndex: 0
        }
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
        if (type === 'patrolRecord') {
          queryData.inspectionStatus = '1'
        }
        if (type === 'relatedExpenses') {
          queryData.sourceType = '3'
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
              let { deliveryDetailList, ...others } = info
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
              tableData = deliveryDetailList
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
            } else if (type === 'archive') {
              tableData = info.data
              this.pagination.totalCount = Number(info.count)
            } else if (type === 'patrolRecord') {
              tableData = info.data
              this.pagination.totalCount = Number(info.count)
            }
            // 相关费用
            if (type === 'relatedExpenses') {
              tableData = res.data.data.map(m => {
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
            // 给 tableData 默认值
            tableData = tableData || []
            tableData.forEach((item, index) => {
              item.key = index
            })
            // 缓存数据
            let obj = type === 'ownInfo' ? { detailData, tableData, table2Data } : { detailData, tableData }
            obj = type === 'archive' || type === 'relatedExpenses' || type === 'patrolRecord' ? { detailData, tableData, pagination: {...this.pagination}} : obj
            this.cacheDataObj[type] = obj
            Object.assign(this, obj)
          } else {
            // 查询档案信息接口 不把异常信息提供给客户
            if (api !== 'queryAssetViewArchiveDetail') {
              this.$message.error(`查询${tip}错误`)
            }else {
              console.warn(`查询${tip}错误`)
            }
          }
        }).catch(err => {
          console.error(err)
          // this.$message.error(err || `查询${tip}错误`)
        })
      },

      handleChange(data) {
        this.pagination.pageNum = data.pageNo;
        this.pagination.pageSize = data.pageLength;
        this.queryDetail(this.tabKey)
      },
      openBigImg (lists) {
        this.bigImg.imgIndex = 0
        this.bigImg.list = []
        lists.forEach(item => {
          this.bigImg.list.push({
            url: item.attachmentPath,
            title: item.oldAttachmentName
          })
        })
        this.bigImg.show = true
      },
      hideImg () {
        this.bigImg.show = false
      },
      // 获取图片可展示路径
      getUrl (url) {
        let urlShow = /^http|https/.test(url) ? url : window.__configs ? (window.__configs.hostImg + url) : ('http://192.168.1.11:8092' + url)
        return urlShow
      },
      // 查看详情
      checkDetail (item) {
        if (this.tabKey === 'archive') {
          window.parent.openPortalMenu('/archives-management/#/consultantFile/details?type=detail&archiveId=' + item.archiveId, '档案文件详情')
        } else if (this.tabKey === 'patrolRecord') {
          window.parent.openPortalMenu('/asset-management/#/patrolRecord/details?type=detail&recordId=' + item.recordId, '巡查记录详情')
        }
      }
    },

    created () {
      let temp = {}
      for (const key in this.apiObj) {
        if (this.$power.has(ASSET_MANAGEMENT[this.apiObj[key]['prower']]) && this.infoKeys[key]) {
          temp[key] = this.infoKeys[key]
          this.isPageShow = true
        } else if (this.$power.has(ASSET_MANAGEMENT.power_operationInformation) && this.infoKeys.operationInformation) {
          temp.operationInformation = this.infoKeys.operationInformation
          this.isPageShow = true
        }
      }
      this.infoKeys = {...temp}
    },
    mounted () {
      if (this.isPageShow) {
        this.queryDetail(this.tabKey)
      }
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
    .img-icon{
      position: relative;
      display: inline-block;
      overflow: hidden;
      width: 60px;
      height: 40px;
      img{
        cursor: pointer;
        max-width: 60px;
        max-height: 40px;
      }
      .ing-mum{
        width: auto;
        height: 16px;
        background: #4BD288;
        position:absolute;
        top: 0px;
        right: 0px;
        line-height: 16px;
        font-weight: 600px;
        color: #fff;
        font-size: 14px;
        border-radius: 8px;
        text-align: center;
        padding: 0 3px;
      }
    }
    margin-bottom: 35px;
  }
</style>
