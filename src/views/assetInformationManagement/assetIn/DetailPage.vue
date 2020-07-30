<!--资产入库-入口列表-详情页-->
<template>
  <div class="detail_page">
    <a-spin :spinning="spinning">
      <!--基本信息-->
      <SG-Title title="基本信息"/>
      <div style="margin-left: 45px">
        <a-row>
          <a-col v-for="{title, key, span} in baseInfoKeys" :span="span || 8" :key="key" style="margin: 12px 0;">
            <span style="color: #282D5B">{{title}}:</span>
            <span style="margin-left: 9px; color: #49505E">{{infoData[key] || '--'}}</span>
          </a-col>
        </a-row>
        <div style="margin-top: 8px">
          <span style="color: #282D5B; float: left">附件:</span>
          <SG-UploadFile show v-if="attachmentList.length" v-model="attachmentList"/>
          <span v-else style="margin-left: 9px; color: #49505E">--</span>
        </div>
      </div>
      <!--资产明细-->
      <SG-Title title="资产明细"/>
      <div style="margin-left: 45px">
        <a-table v-bind="tableObj" class="custom-table td-pd10 table-border"/>
        <SG-FooterPagination
          v-if="tableObj.dataSource.length"
          v-bind="paginationObj" style="margin-top: 15px"
          @change="({ pageNo, pageLength }) => queryAssetByRegistId({ pageNo, pageLength })"
        />
      </div>
      <!--审批轨迹-->
      <SG-Title title="审批轨迹"/>
      <SG-TrackStep v-if="stepList.length" :stepList="stepList" style="margin-left: 45px"/>
      <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
      <div v-if="isApprove">
        <!--后期开发-->
        <!--审核意见-->
        <!--<SG-Title title="审核意见"/>-->
        <!--<a-textarea :rows="4" style="resize: none; margin-left: 45px" placeholder="请输入审核意见" v-model="advice"/>-->
        <!--底部审批操作按钮组-->
        <form-footer location="fixed">
          <SG-Button type="primary" @click="handleBtn('')" :loading="submitBtnLoading">审批通过</SG-Button>
          <SG-Button type="dangerous" @click="handleBtn('reject')" :loading="submitBtnLoading" style="margin-right: 8px">驳回</SG-Button>
        </form-footer>
      </div>
    </a-spin>
  </div>
</template>

<script>
  import FormFooter from '@/components/FormFooter'
  export default {
    name: 'DetailPage',
    components: {FormFooter},
    data () {
      return {
        spinning: false,
        storeId: '', // 入库单Id
        baseInfoKeys: [
          {title: '入库单名称', key: 'storeName'}, {title: '入库单编号', key: 'storeCode'}, {title: '状态', key: 'statusName'},
          {title: '所属机构', key: 'organName'}, {title: '资产项目', key: 'projectName'}, {title: '资产类型', key: 'assetTypeName'},
          {title: '关联资产登记单', key: 'assetRegisterName'}, {title: '创建人', key: 'createUserName'},
          {title: '创建日期', key: 'createDate'}, {title: '备注', key: 'remark', span: 24}
        ], // 基本信息字段
        advice: '', // 审核意见
        attachmentList: [], // 附件
        infoData: {}, // 基本信息字段值
        submitBtnLoading: false, // 按钮loading
        isApprove: false, // 当前页面是否为审批操作
        stepList: [
          // { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] }
        ], // 审批轨迹
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          scroll: { x: 1600 },
          rowKey: 'assetCode',
          columns: [
            { title: '登记单编号', dataIndex: 'registerOrderId', scopedSlots: { customRender: 'registerOrderId' } },
            { title: '资产名称', dataIndex: 'assetName' }, { title: '资产编码', dataIndex: 'assetCode' },
            { title: '资产类型', dataIndex: 'assetTypeName' }, { title: '资产分类', dataIndex: 'objectTypeName' },
            { title: '管理机构', dataIndex: 'organName' }, { title: '资产项目名称', dataIndex: 'projectName' },
            { title: '资产面积(㎡)', dataIndex: 'executeDate' }, { title: '资产位置', dataIndex: 'pasitionString', width: 150 },
            { title: '创建日期', dataIndex: 'createTime' }, { title: '创建人', dataIndex: 'createByName' },
            { title: '核实时间', dataIndex: 'verifierTime' }, { title: '核实人', dataIndex: 'verifierByName' }
          ]
        },
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
      }
    },

    created () {
      const { query: { id }, path } = this.$route
      this.storeId = id
      this.isApprove = path === '/assetIn/approve'
      id && this.queryDetail(id)
    },

    methods: {
      // 根据资产登记单查询资产明细
      queryAssetByRegistId ({pageNo = 1, pageLength = 10, assetRegisterId = this.assetRegisterId}) {
        if (!assetRegisterId) { return false }
        this.tableObj.loading = true
        this.$api.assets.getRegisterOrderDetailsPageByIdList({
          registerOrderIdList: assetRegisterId.split(','), pageNum: pageNo, pageSize: pageLength
        }).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = data
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message || '查询资产明细列表出错'
        }).catch(err => {
          this.$message.error(err || '查询资产明细列表出错')
        }).finally(() => this.tableObj.loading = false)
      },

      // 查询详情
      queryDetail (storeId) {
        this.spinning = true
        this.$api.assets.queryAssetStoreDetail({storeId}).then(({data: res}) => {
          this.spinning = false
          if (res && String(res.code) === '0') {
            const {attachmentList, assetRegisterId, ...others} = res.data
            assetRegisterId && this.queryAssetByRegistId({assetRegisterId})
            return Object.assign(this, {
              assetRegisterId,
              infoData: others,
              attachmentList: (attachmentList || []).map(m => {
                return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix }
              })
            })
          }
          throw res.message || '查询详情出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询详情出错')
        })
      },

      // 按钮操作
      handleBtn (flag) {
        this.submitBtnLoading = true
        const {storeId, advice} = this
        this.$api.assets.auditAssetStore({ storeId, advice, status: flag ? 1 : 2 }).then(({data: res}) => {
          if (res && String(res.code) === '0') {
            this.$message.success(flag ? '驳回成功' : '审批成功')
            // 跳回列表路由
            return this.$router.push({ path: '/assetIn', query: { refresh: true } })
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || `${flag ? '驳回失败' : '审批失败'}`)
        }).finally(() => this.submitBtnLoading = false)
      }
    }
  }
</script>

<style lang='less' scoped>
  .detail_page {
    padding: 0 70px 75px;
    & /deep/ .ant-table-placeholder {
      display: block;
      border-bottom: 1px solid #e8e8e8;
    }
  }
</style>
