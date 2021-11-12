<!--
 * @Author: L
 * @Date: 2020-11-05 10:01:40
 * @LastEditTime: 2020-11-18 15:56:02
 * @Description: 详情
-->
<template>
<a-spin :spinning="spinning">
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col"
          :span="item.key === 'remark' ? 24 : 8"
          v-for="(item, index) in basicData"
          :key="index">
          {{item.name}}：{{basicObj[item.key] || '--'}}
          </a-col>
          <a-col class="playground-col" :span="24">
            附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 件：
            <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <SG-UploadFile v-model="files" type="all" :show="true" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">资产明细</span>
      <div class="particulars-obj">
        <div class="particulars-t">交付资产数量：{{assetChangeCount || '0'}}个，合计交付面积：{{deliveryArea || '0'}}㎡</div>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columnsCom"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
          ></a-table>
          <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="queryCondition.count"
            :location="location"
            :noPageTools="noPageTools"
            v-model="queryCondition.pageNum"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
  </div>
</a-spin>
</template>

<script>
const columns = [
   {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: '10%'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: '10%'
  }, {
    title: '管理机构',
    dataIndex: 'organName',
    width: '10%'
  }, {
    title: '所属资产项目',
    dataIndex: 'projectName',
    width: '10%'
  }, {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '10%'
  }, {
    title: '资产分类',
    dataIndex: 'assetObjectTypeName',
    width: '8%'
  }, {
    title: '资产面积',
    dataIndex: 'assetArea',
    width: '6%'
  }, {
    title: '资产位置',
    dataIndex: 'pasitionString',
    width: '10%'
  }, {
    title: '交付面积(㎡)',
    dataIndex: 'deliveryArea',
    align: 'center',
    scopedSlots: { customRender: 'deliveryArea' }
  }, {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    scopedSlots: { customRender: 'remark' }
  },
]
const basicData = [
  { name: '交付单编号', key: 'deliveryId'},
  { name: '交付单名称', key: 'deliveryName'},
  { name: '状态', key: 'approvalStatusName'},
  { name: '所属组织机构', key: 'organName'},
  { name: '资产项目', key: 'projectName'},
  { name: '资产类型', key: 'assetTypeName'},
  { name: '交付类型', key: 'deliveryTypeName'},
  { name: '交付单位', key: 'deliveryCompany'},
  { name: '交付日期', key: 'deliveryDate'},
  { name: '结束日期', key: 'endDate'},
  { name: '创建人', key: 'createByName'},
  { name: '创建日期', key: 'createTime'},
  { name: '备注', key: 'remark'}
]
export default {
  components: {},
  props: {},
  data() {
    return {
      spinning: false,
      deliveryId: '',           // 交付单id
      basicData,
      basicObj: {},             // 基本信息
      assetChangeCount: '',     // 资产数量
      deliveryArea: '',         // 面积
      particularsData: {},
      files: [],
      columns,
      loading: false,
      tableData: [],
      location: "",
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: "",
      },
    };
  },
  computed: {
    isSelectedEquipment(){
      return String(this.basicObj.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
    },
    columnsCom(){
      if (this.isSelectedEquipment){
        const arr = ['deliveryArea','assetArea']
        return this.columns.filter(ele=> !arr.includes((ele.dataIndex || ele.key)))
      }else {
        return this.columns
      }
    }
  },
  watch: {
  },
  methods: {
    // 查询基本信息
    query() {
      this.$api.delivery.getDeliveryById({deliveryId: this.deliveryId}).then((res) => {
        if (Number(res.data.code) === 0) {
          this.basicObj = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      });
    },
    // 查资产明细
    getDeliveryDetailListPage () {
      this.loading = true
      let obj = {
        deliveryId: this.deliveryId,                  // 交付id
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.delivery.getDeliveryDetailListPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          this.checkedData = []
          data.forEach(item => {
            item.key = item.assetId
          })
          this.queryCondition.count = res.data.data.count
          this.tableData = data
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 查汇总信息
    getDeliveryDetailListStatistics () {
      this.$api.delivery.getDeliveryDetailListStatistics({deliveryId: this.deliveryId}).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetChangeCount = data.assetChangeCount    // 数量
          this.deliveryArea = data.deliveryArea            // 面积
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 附件查询
    attachment () {
      let obj = {
        objectId: this.deliveryId,       // 交付id
        objectType: '18'      // 类型：交付信息18
      }
      this.$api.basics.attachment(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let files = []
          if (data && data.length > 0) {
            data.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName,
              })
            })
          }
          this.files = files
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.getDeliveryDetailListPage()
    },
  },
  created() {},
  mounted() {
    this.particularsData = JSON.parse(this.$route.query.record)
    this.deliveryId = this.particularsData[0].deliveryId
    this.spinning = true
    Promise.all([
      this.query(),
      this.getDeliveryDetailListPage(),
      this.getDeliveryDetailListStatistics(),
      this.attachment(),
    ]).then((res) => {
      this.spinning = false
    })
  },
};
</script>
<style lang="less" scoped>
.particulars {
  .particulars-nav {
    padding: 42px 126px 20px 70px;
    .particulars-obj {
      padding: 20px 0 20px 40px;
      .playground-row {
        .playground-col {
        line-height: 40px;
        font-size: 12px;
        word-break: break-all;
        }
      }
      .particulars-t {
        line-height: 40px;
        font-size:14px;
      }
    }
  }
}
</style>
