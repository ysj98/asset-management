<!--资产入库-入口列表-详情页-->
<template>
  <div class="detail_page">
    <!--基本信息-->
    <SG-Title title="基本信息"/>
    <div style="margin-left: 45px">
      <a-row>
        <a-col v-for="{title, key, span} in baseInfoKeys" :span="span || 8" :key="key" style="margin: 12px 0;">
          <span style="color: #282D5B">{{title}}:</span>
          <span style="margin-left: 9px; color: #49505E">{{infoData[key] || '无'}}</span>
        </a-col>
      </a-row>
      <div style="margin-top: 8px">
        <span style="color: #282D5B">附件:</span>
        <SG-UploadFile
          show
          v-if="attachmentList.length"
          v-model="attachmentList"
        />
        <span v-else style="margin-left: 9px; color: #49505E">无</span>
      </div>
    </div>
    <!--资产明细-->
    <SG-Title title="权属情况"/>
    <a-table v-bind="tableObj" style="margin-left: 45px" class="custom-table td-pd10 table-border"/>
    <!--审批轨迹-->
    <SG-Title title="审批轨迹"/>
    <SG-TrackStep v-if="stepList.length" :stepList="stepList" style="margin-left: 45px"/>
    <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
  </div>
</template>

<script>
  export default {
    name: 'DetailPage',
    data () {
      return {
        storeId: '', // 入库单Id
        baseInfoKeys: [
          {title: '入库单名称', key: 'storeName'}, {title: '入库单编号', key: 'storeCode'}, {title: '状态', key: 'statusName'},
          {title: '所属机构', key: 'organName'}, {title: '资产项目', key: 'projectName'}, {title: '资产类型', key: 'assetTypeName'},
          {title: '联资产登记单', key: 'assetRegisterName'}, {title: '创建人', key: 'createUserName'},
          {title: '创建日期', key: 'minCreateDate'}, {title: '备注', key: 'desc', span: 24}
        ], // 基本信息字段
        infoData: {}, // 基本信息字段值
        attachmentList: [], // 附件
        stepList: [
          // { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] }
        ], // 审批轨迹
        tableObj: {
          dataSource: [],
          pagination: false,
          // rowKey: 'transferOperationTime',
          columns: [
            { title: '转运营日期', dataIndex: 'transferOperationTime', key: 'transferOperationTime' },
            { title: '转运营面积(㎡)', dataIndex: 'transferOperationArea', key: 'transferOperationArea' },
            { title: '转物业日期', dataIndex: 'transferTime', key: 'transferTime' },
            { title: '转物业面积(㎡)', key: 'transferArea', dataIndex: 'transferArea' }
          ]
        }
      }
    },

    created () {
      const { query: { storeId }} = this.$route
      this.storeId = storeId
      storeId && this.queryDetail(storeId)
    },

    methods: {
      // 查询详情
      queryDetail (storeId) {
        debugger
      }
    }
  }
</script>

<style lang='less' scoped>
  .detail_page {
    padding: 0 70px 0;
  }
</style>
