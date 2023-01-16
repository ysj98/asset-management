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
              <UploadFile v-model="files" type="all" :show="true" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">资产明细</span>
      <div class="particulars-obj">
        <!-- <div class="particulars-t">交付资产数量：{{assetChangeCount || '0'}}个<span v-if="!isSelectedEquipment">，合计交付面积：{{deliveryArea || '0'}}㎡</span></div> -->
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            size="middle"
            :pagination="false"
          >
          <template slot="num" slot-scope="text, record,index">
              {{index+1}}
            </template>
          </a-table>
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
    title: "序号",
    dataIndex: "num",
    width: "5%",
    scopedSlots: { customRender: "num" },
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    width: "10%",
  },
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: "15%",
  },
  {
    title: "地址",
    dataIndex: "address",
    width: "15%",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: "5%",
  },
  {
    title: "资产分类",
    dataIndex: "objectTypeName",
    width: "8%",
  },
  {
    title: "资产面积",
    dataIndex: "area",
    width: "10%",
    scopedSlots: { customRender: "amount" },
  },
  {
    title: "金额(元)",
    dataIndex: "amount",
    align: "center",
    width: "15%",
    
  },
]
const basicData = [
  { name: '组织机构名称', key: 'organName'},
  { name: '所属项目', key: 'projectName'},
  { name: '债务类型', key: 'debtTypeName'},
  { name: '有效期', key: 'dateStr'},
  { name: '债权人', key: 'creditor'},
  { name: '债权人电话', key: 'creditorTel'},
  { name: '创建时间', key: 'createTime'},
  { name: '备注', key: 'remark'}
]
export default {
  components: {},
  props: {},
  data() {
    return {
      spinning: false,
      debtId: '',           // 交付单id
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
      this.$api.debt.getDebtInfo({debtId: this.$route.query.debtId}).then((res) => {
        if (Number(res.data.code) === 0) {
          this.basicObj = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      });
    },
    // 查资产明细
    getDebtDetailPage () {
      this.loading = true
      let obj = {
        debtId: this.debtId,                  // 交付id
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.debt.getDebtDetailPage(obj).then((res) => {
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
      this.$api.delivery.getDeliveryDetailListStatistics({debtId: this.debtId}).then((res) => {
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
        objectId: this.debtId,       // 交付id
        objectType: '32'      // 类型：交付信息18
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
      this.getDebtDetailPage()
    },
  },
  created() {},
  mounted() {
    this.debtId = this.$route.query.debtId
    this.spinning = true
    Promise.all([
      this.query(),
      this.getDebtDetailPage(),
    //   this.getDeliveryDetailListStatistics(),
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
