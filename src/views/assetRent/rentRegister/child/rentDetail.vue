<!--出租单详情-->
<template>
  <div class="edit_page">
    <SG-Title title="基础信息" />
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>出租单ID： {{ assetInfo.leaseOrderId }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>出租单名称： {{ assetInfo.leaseName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>状态： {{ assetInfo.approvalStatusName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>所属组织机构： {{ assetInfo.organName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>资产项目： {{ assetInfo.projectName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>资产类型： {{ assetInfo.assetTypeName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>合同编号： {{ assetInfo.contractCode }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>承租人： {{ assetInfo.lesseeName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>签约日期： {{ assetInfo.signingDate }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>起租日期： {{ assetInfo.startLeaseDate }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>止租日期： {{ assetInfo.endLeaseDate }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>租金单价： {{ assetInfo.rentPrice }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col v-if="!isSelectedEquipment" :span="6" :offset="2">
        <div>出租面积(㎡)： {{ assetInfo.leaseArea }}㎡</div>
      </a-col>
      <a-col :span="7" :offset="!isSelectedEquipment ? 1 : 2">
        <div>创建人： {{ assetInfo.createByName }}</div>
      </a-col>
      <a-col :span="7" :offset="!isSelectedEquipment ? 1 : 0">
        <div>创建日期： {{ assetInfo.createTime }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="22" :offset="2">
        <div>备注： {{ assetInfo.remark }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="22" :offset="2">
        <div>附件：<SG-UploadFile type="all" v-model="uploadList" :show="true" class="mt20"/></div>
      </a-col>
    </a-row>
    <SG-Title title="资产明细" />
    <div class="assetInfo pr">
      <div class="textNum pa">
        资产数量： {{ dataSource.length }}个<span v-if="!isSelectedEquipment">， 出租面积： {{ rentOutArea }}㎡</span>
      </div>
      <a-table
        :columns="columnsCom"
        :data-source="dataSource"
        :loading="loading"
        bordered
        :pagination="false"
        size="middle"
      >
        <template slot="code" slot-scope="text, record, index">
          <div>
            {{ pagination.pageLength * (pagination.pageNo - 1) + index + 1 }}
          </div>
        </template></a-table
      >
      <SG-FooterPagination
        :pageLength="pagination.pageLength"
        :totalCount="pagination.totalCount"
        location="static"
        :noPageTools="true"
        v-model="pagination.pageNo"
        @change="pageNoChange"
      />
    </div>
    <SG-Title title="收益明细" />
    <div class="assetInfo pr">
      <div class="textNum pa">总收益： {{ earnings }}元</div>
      <a-table
        :columns="columns2"
        :data-source="dataSource2"
        :loading2="loading2"
        bordered
        :pagination="false"
        size="middle"
      >
        <template slot="code" slot-scope="text, record, index">
          <div>
            {{ pagination2.pageLength * (pagination2.pageNo - 1) + index + 1 }}
          </div>
        </template></a-table
      >
      <SG-FooterPagination
        :pageLength="pagination2.pageLength"
        :totalCount="pagination2.totalCount"
        location="static"
        :noPageTools="true"
        v-model="pagination2.pageNo"
        @change="pageNoChange2"
      />
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "code",
    align: "center",
    scopedSlots: { customRender: "code" },
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    align: "center",
  },
  {
    title: "资产名称",
    dataIndex: "assetName",
    align: "center",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    align: "center",
  },
  {
    title: "资产分类",
    dataIndex: "assetCategoryName",
    align: "center",
  },
  {
    title: "规格型号",
    dataIndex: "specificationTypeName",
    align: "center",
  },
  {
    title: "资产面积(㎡)",
    dataIndex: "assetArea",
    align: "center",
  },
  {
    title: "出租面积(㎡)",
    dataIndex: "leaseArea",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
];
const columns2 = [
  {
    title: "序号",
    dataIndex: "code",
    align: "center",
    scopedSlots: { customRender: "code" },
  },
  {
    title: "收入编号",
    dataIndex: "incomeId",
    align: "center",
  },
  {
    title: "费用科目",
    dataIndex: "feeSubjectName",
    align: "center",
  },
  {
    title: "账期",
    dataIndex: "accountingPeriod",
    align: "center",
  },
  {
    title: "收入金额(元)",
    dataIndex: "amount",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
];
export default {
  data() {
    return {
      columns,
      columns2,
      leaseOrderId: "",
      loading: false,
      loading2: false,
      assetInfo: {}, // 资产详情
      dataSource: [], // 资产明细数据源
      dataSource2: [], // 收益明细数据源
      rentOutArea: 0, // 出租总面积
      earnings: 0, //
      uploadList: [], // 附件列表
      pagination: {
        pageLength: 10,
        totalCount: 0,
        pageNo: 1,
      },
      pagination2: {
        pageLength: 10,
        totalCount: 0,
        pageNo: 1,
      },
      rentOutObj: {
        leaseOrderId: +this.$route.query.leaseOrderId,
        pageNum: 1,
        pageSize: 10,
      },
      earningsObj: {
        pageNum: 1,
        pageSize: 10,
        orderId: +this.$route.query.leaseOrderId,
        orderType: 1,
        status: 1,
      },
    };
  },
  computed:{
    isSelectedEquipment(){
      return String(this.assetInfo.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
    },
    columnsCom(){
      if (this.isSelectedEquipment){
          const arr = ['assetArea','leaseArea']
          return this.columns.filter(ele=>{
            return !arr.includes(ele.dataIndex)
          })
      }else {
        return this.columns
      }
    }
  },
  methods: {
    // 获取资产明细
    getLeaseOrder() {
      if (this.leaseOrderId) {
        this.$api.assetRent
          .getLeaseOrder({ leaseOrderId: +this.leaseOrderId })
          .then((res) => {
            this.assetInfo = res.data.data;
          });
      }
    },
    // 查询出租明细分页列表
    getLeaseDetailPageList() {
      if (this.leaseOrderId) {
        this.loading = true;
        this.$api.assetRent
          .getLeaseDetailPageList(this.rentOutObj)
          .then((res) => {
            this.pagination.totalCount = res.data.data.count;
            let r = res.data.data.data;
            r.forEach((item) => {
              item.specificationTypeName = "/";
              item.key = item.assetId;
              this.rentOutArea += item.leaseArea;
            });
            this.dataSource = r;
            this.loading = false;
          });
      }
    },
    // 资产出租/投资收益登记-分页查询收益明细
    getIncomeDetailPageList() {
      if (this.leaseOrderId) {
        this.loading2 = true;
        this.$api.assetRent
          .getIncomeDetailPageList(this.earningsObj)
          .then((res) => {
            this.pagination2.totalCount = res.data.data.count;
            this.dataSource2 = res.data.data.data;
            this.loading2 = false;
          });
      }
    },
    // 资产出租/投资收益登记-查询收益明细合计
    getIncomeDetailStatistics() {
      if (this.leaseOrderId) {
        this.$api.assetRent
          .getIncomeDetailStatistics({
            orderId: this.leaseOrderId,
            orderType: 1,
            status: 1,
          })
          .then((res) => {
            this.earnings = res.data.data.totalAmount;
          });
      }
    },
    // 页码改变
    pageNoChange(page) {
      // console.log(page);
      this.rentOutObj.pageNum = page.pageNo;
      this.getLeaseDetailPageList();
    },
    pageNoChange2(page) {
      this.earningsObj.pageNum = page.pageNo;
      this.getIncomeDetailPageList();
    },
    // 查询附件
    getAttachmentList(id) {
      if (!id) {
        return false;
      }
      this.$api.basics
        .attachment({ objectId: id, objectType: 19 })
        .then((res) => {
          if (+res.data.code === 0) {
            let attachment = [];
            res.data.data.forEach((item) => {
              let obj = {
                url: item.attachmentPath,
                name: item.oldAttachmentName,
              };
              attachment.push(obj);
              this.uploadList = attachment;
            });
          } else {
            this.$error({
              title: "提示",
              content: res.data.message,
            });
          }
        });
    },
  },
  created() {
    this.leaseOrderId = this.$route.query.leaseOrderId;
    this.getLeaseOrder(); // 获取资产明细
    this.getLeaseDetailPageList(); // 获取资产明细列表
    this.getIncomeDetailPageList(); // 获取收益明细列表
    this.getIncomeDetailStatistics(); // 获取收益明细合计
    this.getAttachmentList(this.leaseOrderId)
  },
};
</script>

<style lang="less" scoped>
.edit_page {
  padding: 0 45px 70px 70px;

  .a_row {
    margin-bottom: 12px;
  }
  .assetInfo {
    width: 100%;

    .textNum {
      top: -28px;
      right: 30px;
    }
  }
  /deep/.ant-table-thead {
    th div {
      text-align: center;
    }
  }
}
</style>
