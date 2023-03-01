<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">权证信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">权证号：{{ warrantNbr || '--' }}</a-col>
          <a-col class="playground-col" :span="8">权证类型：{{ kindOfRightName || '--' }}</a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">修改的基础信息</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table :loading="loading" :columns="basicColumns" :dataSource="basicData" size="middle" :pagination="false">
            <div slot="index" slot-scope="text, record, index">{{ +index + 1 }}</div>
            <div slot="code" slot-scope="text">{{ basicObj[text] }}</div>
          </a-table>
        </div>
      </div>
      <span class="section-title blue">修改的权属人信息</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table :loading="loading" :columns="obligeeColumns" :dataSource="obligeeData" size="middle" :pagination="false">
            <div slot="index" slot-scope="text, record, index">{{ +index + 1 }}</div>
            <div slot="obligeeName" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="certificateTypeName" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="certificateNo" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="percent" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="type" slot-scope="text">{{ typeArr[text] }}</div>
          </a-table>
        </div>
      </div>
      <span class="section-title blue">修改的抵押信息</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table :loading="loading" :columns="mortgageColumns" :dataSource="mortgageData" size="middle" :pagination="false">
            <div slot="index" slot-scope="text, record, index">{{ +index + 1 }}</div>
            <div slot="mortgageAmount" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="pledgee" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="mortgageBank" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="mortgageYear" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="mortgageName" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="loanContractName" slot-scope="text, record" :class="markRed(text, record.type)">{{ text }}</div>
            <div slot="type" slot-scope="text">{{ typeArr[text] }}</div>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import {register} from './basics'
const basicColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' },
    width: 70,
  },
  {
    title: '字段名称',
    dataIndex: 'code',
    scopedSlots: { customRender: 'code' },
    width: 120,
  },
  {
    title: '修改前内容',
    dataIndex: 'oldValue',
    width: 120,
  },
  {
    title: '修改后内容',
    dataIndex: 'newValue',
    width: 120,
  },
];
const obligeeColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' },
    width: 70,
  },
  {
    title: '姓名',
    dataIndex: 'obligeeName',
    scopedSlots: { customRender: 'obligeeName' },
    width: 120,
  },
  {
    title: '证件种类',
    dataIndex: 'certificateTypeName',
    scopedSlots: { customRender: 'certificateTypeName' },
    width: 120,
  },
  {
    title: '证件号',
    dataIndex: 'certificateNo',
    scopedSlots: { customRender: 'certificateNo' },
    width: 120,
  },
  {
    title: '占用比例（%）',
    dataIndex: 'percent',
    scopedSlots: { customRender: 'percent' },
    width: 120,
  },
  {
    title: '操作类型',
    dataIndex: 'type',
    width: 100,
    scopedSlots: { customRender: 'type' },
  },
];
const mortgageColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: { customRender: 'index' },
    width: 70,
  },
  {
    title: '抵押金额（元）',
    dataIndex: 'mortgageAmount',
    scopedSlots: { customRender: 'mortgageAmount' },
    width: 120,
  },
  {
    title: '抵押权人',
    dataIndex: 'pledgee',
    scopedSlots: { customRender: 'pledgee' },
    width: 120,
  },
  {
    title: '抵押银行',
    dataIndex: 'mortgageBank',
    scopedSlots: { customRender: 'mortgageBank' },
    width: 120,
  },
  {
    title: '抵押年限',
    dataIndex: 'mortgageYear',
    scopedSlots: { customRender: 'mortgageYear' },
    width: 120,
  },
  {
    title: '抵押物名称',
    dataIndex: 'mortgageName',
    scopedSlots: { customRender: 'mortgageName' },
    width: 120,
  },
  {
    title: '借款合同编号',
    dataIndex: 'loanContractName',
    scopedSlots: { customRender: 'loanContractName' },
    width: 120,
  },
  {
    title: '操作类型',
    dataIndex: 'type',
    width: 100,
    scopedSlots: { customRender: 'type' },
  },
];
const basicObj = {
  rigthTypeName: '权利类型',
  warrantId: '权证id',
  warrantNbr: '权证号',
  ownerTypeName: '权属形式',
  kindOfRightName: '权证类型',
  lotNo: '丘地号',
  estateUnitCode: '不动产单元号',
  seatingPosition: '坐落位置',
  landArea: '土地面积',
  ownershipUseName: '权属用途',
  structure: '结构',
  buildArea: '建筑面积',
  exclusiveBuildArea: '专属建筑面积',
  apportionArea: '分摊面积',
  totalSuite: '总套数',
  qualityOfRightName: '权利性质',
  useLimitDate: '使用期限',
  rigisterDate: '登记日期',
  organId: '组织机构',
  remark: '备注',
  excursus: '附记',
  handoverDate: '交接日期',
  houseOwner: '房屋所有权人',
  tenant: '承租人',
  entrustOrganization: '委托管理单位',
  totalFloor: '总层数',
  placefloor: '所在层',
  houseNo: '房屋号',
  rentUnitPrice: '租金单价',
  rentTotalPrice: '租金总价',
  contractData: '合同期限',
  talkUnitPrice: '议价单价',
  talkTotalPrice: '议价租金总价',
  rentPayDate: '租金缴纳期限',
  antenatal: '产别',
  landNumber: '地号',
  picNumber: '图号',
  landCategory: '地类',
  getPrice: '取得价格',
  useCategory: '使用权类型',
  useArea: '使用权面积',
  exclusiveArea: '独用面积',
  terminationData: '终止日期',
  tenantId: '承租人id',
  propertyRightUnit: '实际产权单位',
  safekeepUnit: '实际保管单位',
  houseProveLife: '房产证使用年限',
  houseStartDate: '房产证起始日期',
  houseEndDate: '房产证截止日期',
  landUse: '土地用途',
};
export default {
  components: {},
  props: {},
  data() {
    return {
      typeArr: ['删除', '新增', '编辑'],
      basicObj,
      basicColumns,
      obligeeColumns,
      mortgageColumns,
      warrantNbr: '',
      kindOfRightName: '',
      particularsData: {},
      columns: [],
      loading: false,
      basicData: [],
      mortgageData: [],
      obligeeData: [],
      location: '',
      noPageTools: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    markRed(name, type) {
      return name.includes('->') || type != 2 ? 'red' : '';
    },
    // 查询详情
    query() {
      let obj = {
        logId: this.$route.query.logId,
      };
      this.$api.ownership.logDetail(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.basicData = data.ownershipWarrantLog.filter((item) => {
            return this.basicObj[item.code];
          });
          console.log(this.basicData);
          this.obligeeData = data.obligeeLogList;
          this.mortgageData = data.mortgageLogList;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
  created() {},
  mounted() {
    this.warrantNbr = this.$route.query.warrantNbr;
    this.kindOfRightName = this.$route.query.kindOfRightName;
    this.query();
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
          // height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
      }
    }
    .correspondingTask {
      margin: 35px 40px 0 40px;
      border: 1px solid #f0f2f5;
    }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
}
.red {
  color: red !important;
}
/deep/td {
  white-space: normal !important;
}
</style>
