<!--
 * @Description: 附属配套 相关费用
-->
<template>
  <div class="necessaryCaaessories">
    <span class="section-title blue">{{ title }}</span>
    <div class="button-box">
      <div class="button-l" v-if="type === 'necessaryCaaessories'">
        <span>配套附属总数量：{{ statistics.number || '0' }}</span> <span class="p120">总价值：{{ statistics.value || '0' }}元</span>
      </div>
      <div class="button-l" v-if="type === 'correlativeCharges'">
        <span>费用总额：{{ statistics.expenseAmount || '0' }}元</span> <span class="p120">收入总额：{{ statistics.incomeAmount || '0' }}元</span>
      </div>
    </div>
    <div class="table-borders">
      <a-table class="table-boxs table-layout-fixed" :columns="columns" :loading="loading" :dataSource="tableData" :pagination="false"> </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        location="static"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import noDataTips from '@/components/noDataTips';

const necessaryCaaessoriesColumns = [
  { title: '附属配套ID', dataIndex: 'subsidiaryMatchingId', width: '8%' },
  { title: '附属配套名称', dataIndex: 'matchingName' },
  { title: '附属配套编码', dataIndex: 'matchingCode' },
  { title: '类型', dataIndex: 'matchingTypeName', width: '6%' },
  { title: '规格型号', dataIndex: 'specificationType' },
  { title: '价值(元)', dataIndex: 'value' },
  { title: '数量', dataIndex: 'number', width: '6%' },
  { title: '计量单位', dataIndex: 'unitOfMeasurementName' },
  { title: '接管前附属配套', dataIndex: 'isBeforeName' },
  { title: '备注', dataIndex: 'remark', width: '15%' },
];

const correlativeChargesColumns = [
  { title: '类别', dataIndex: 'reportBillName' },
  { title: '费用/收入类型', dataIndex: 'incomeType' },
  { title: '费用/收入名称', dataIndex: 'incomeName' },
  { title: '客户名称', dataIndex: 'customerName' },
  { title: '所属月份', dataIndex: 'month' },
  { title: '金额', dataIndex: 'amount' },
  { title: '读数', dataIndex: 'readNumber' },
  { title: '备注', dataIndex: 'remark' },
];

export default {
  components: { noDataTips },
  props: {
    registerOrderId: [String, Number],
    title: String,
    assetId: [String, Number],
    type: String, // 根据类型展示附属配套 相关费用
  },
  data() {
    return {
      necessaryCaaessoriesColumns,
      correlativeChargesColumns,
      columns: [],
      tableData: [],
      loading: false,
      noPageTools: false,
      count: '', // 总页数
      queryCondition: {
        pageNum: '1',
        pageSize: '10',
      },
      statistics: {}, // 统计
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 查询
    query() {
      if (this.type === 'necessaryCaaessories') {
        this.columns = this.necessaryCaaessoriesColumns;
        this.getMatchingListByAssetIdPage();
      } else if (this.type === 'correlativeCharges') {
        this.columns = this.correlativeChargesColumns;
        this.assetExpenseInfo();
      }
    },
    // 附属配套列表
    getMatchingListByAssetIdPage() {
      this.loading = true;
      let params = {
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize,
        assetId: this.assetId,
      };
      this.$api.assets.getMatchingListByAssetIdPage(params).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
          });
          this.tableData = data;
          this.count = res.data.data.count;
          this.getMatchingSta();
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 相关费用列表
    assetExpenseInfo() {
      this.loading = true;
      let params = {
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize,
        assetId: this.assetId,
        sourceType: 2,
      };
      this.$api.assets.assetExpenseInfo(params).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
            item.reportBillName = +item.reportBillId === 2 ? '收入' : '费用';
          });
          this.tableData = data;
          this.count = res.data.data.count;
          this.assetExpenseTotal();
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 附属配套统计
    getMatchingSta() {
      let obj = {
        assetId: this.assetId, // 资产信息ID
      };
      this.$api.assets.getMatchingSta(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          this.statistics = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 相关费用统计
    assetExpenseTotal() {
      let obj = {
        assetId: this.assetId, // 资产信息ID
        sourceType: 2,
      };
      this.$api.assets.assetExpenseTotal(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          this.statistics = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.no-data-tips {
  padding: 40px 0;
}
.table-borders {
  margin-bottom: 60px;
}
.necessaryCaaessories {
  .button-box {
    overflow: hidden;
    margin-bottom: 15px;
    line-height: 40px;
    display: flex;
    .button-l {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
