<template>
  <div class="organViewDetail-page">
    <!-- 标题 -->
    <div class="mb30" style="margin-left:-12px">
      <SG-Title noMargin title="权属概况" />
    </div>
    <!-- 权属表格 -->
    <a-table
      class="custom-table td-pd10"
      bordered
      :loading="tableFirst.loading"
      :pagination="false"
      :columns="tableFirst.columns"
      :dataSource="tableFirst.dataSource"
      :locale="{emptyText: '暂无数据'}"
    ></a-table>
    <!-- 标题 -->
    <div class="mb30 mt30" style="margin-left:-12px">
      <SG-Title noMargin title="资产概况" />
    </div>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" />
    </a-spin>
    <div class="table-layout-fixed pb70">
      <a-table
        :loading="table.loading"
        :columns="table.columns"
        :dataSource="table.dataSource"
        class="custom-table td-pd10"
        :pagination="false"
      />
      <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="table.totalCount"
        :location="footerOpt.location"
        :noPageTools="footerOpt.noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>
<script>
import OverviewNumber from "@/views/common/OverviewNumber";
import noDataTips from "@/components/noDataTips";
import { getFormat } from '../../../utils/utils';
let columnsFrist = [
  {
    title: "所有权",
    dataIndex: "goodsTypeNames",
    children: [
      {
        title: "总数",
        dataIndex: "ownerShipCount",
      },
      {
        title: "有证",
        dataIndex: "ownerShipYesCount",
      },
      {
        title: "无证",
        dataIndex: "ownerShipNoCount",
      },
      {
        title: "待办证",
        dataIndex: "ownerShipWaitCount",
      },
    ],
  },
  {
    title: "使用权",
    dataIndex: "wsPrice",
    children: [
      {
        title: "总数",
        dataIndex: "useShipCount",
      },
      {
        title: "有证",
        dataIndex: "useShipYesCount",
      },
      {
        title: "无证",
        dataIndex: "useShipNoCount",
      },
      {
        title: "待办证",
        dataIndex: "useShipWaitCount",
      },
    ],
  },
  {
    title: "权属办理进度",
    dataIndex: "progress",
    width: 200,
  },
];
let columns = [
  {
    title: "管理机构",
    dataIndex: "organName",
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
  },
  {
    title: "资产项目编码",
    dataIndex: "projectCode",
  },
  {
    title: "来源方式",
    dataIndex: "sourceTypeName",
  },
  {
    title: "来源渠道",
    dataIndex: "souceChannelType",
  },
  {
    title: "接管时间",
    dataIndex: "takeOverDate",
  },
  {
    title: "建筑面积(㎡)",
    dataIndex: "area",
  },
  {
    title: "车场数",
    dataIndex: "buildNum",
  },
  {
    title: "资产数量",
    dataIndex: "assetNum",
  },
  {
    title: "运营(㎡)",
    dataIndex: "transferOperationArea",
  },
  {
    title: "自用(㎡)",
    dataIndex: "selfUserArea",
  },
  {
    title: "闲置(㎡)",
    dataIndex: "idleArea",
  },
  {
    title: "占用(㎡)",
    dataIndex: "occupationArea",
  },
  {
    title: "其他(㎡)",
    dataIndex: "otherArea",
  },
  {
    title: "资产原值(元)",
    dataIndex: "originalValue",
  },
  {
    title: "最新估值(元)",
    dataIndex: "marketValue",
  },
];
export default {
  components: {
    OverviewNumber,
    noDataTips,
  },
  data() {
    return {
      formatArr: ['transferOperationArea', 'selfUserArea', 'idleArea', 'occupationArea', 'otherArea', 'originalValue', 'marketValue'],
      tableFirst: {
        loading: false,
        columns: columnsFrist,
        dataSource: [],
      },
      overviewNumSpinning: false,
      numList: [
        {
          title: "建筑面积(㎡)",
          key: "measuredArea",
          value: 0,
          fontColor: "#324057",
        },
        {
          title: "运营(㎡)",
          key: "transferOperationArea",
          value: 0,
          bgColor: "#4BD288",
        },
        { title: "闲置(㎡)", key: "idleArea", value: 0, bgColor: "#1890FF" },
        {
          title: "自用(㎡)",
          key: "selfUserArea",
          value: 0,
          bgColor: "#DD81E6",
        },
        {
          title: "占用(㎡)",
          key: "occupationArea",
          value: 0,
          bgColor: "#FD7474",
        },
        { title: "其他(㎡)", key: "otherArea", value: 0, bgColor: "#BBC8D6" },
        {
          title: "资产原值(万元)",
          key: "originalValue",
          value: 0,
          bgColor: "#DD81E6",
        },
        {
          title: "最新估值(万元)",
          key: "marketValue",
          value: 0,
          bgColor: "#1890FF",
        },
      ],
      table: {
        loading: false,
        totalCount: 0,
        columns,
        dataSource: [],
      },
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
      },
      footerOpt: {
        noPageTools: false,
        location: "absolute",
      },
      routeQueryStore: {
        organId: "",
        statusList: [],
      },
    };
  },
  created() {
    let { organId, statusList } = this.$route.query;
    this.routeQueryStore = { organId, statusList };
  },
  mounted() {
    this.viewGetAssetHouseListForOrgan();
    this.viewGetAssetHouseStatisticsForOrgan();
    this.queryOrganViewDetail();
  },
  methods: {
    // 查询详情列表
    viewGetAssetHouseListForOrgan() {
      let data = { ...this.routeQueryStore, ...this.queryCondition };
      this.table.loading = true;
      this.$api.assets
        .viewGetAssetHouseListForOrgan(data)
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let data = res.data.data.data || [];
            this.table.dataSource = data.map((item, index) => {
              return {
                ...item,
                key: index,
              };
            });
            this.table.totalCount = res.data.data.count || 0;
            this.table.dataSource.forEach(item => {
              let arr = Object.keys(item)
              arr.forEach(sub => {
                if(this.formatArr.includes(sub)){
                  item[sub] = getFormat(item[sub])
                }
              })
            })
          } else {
            this.$message.error(res.data.message || res.data.msg || "请求错误");
          }
        })
        .finally(() => {
          this.table.loading = false;
        });
    },
    // 组织机构视图详情表头统计
    viewGetAssetHouseStatisticsForOrgan() {
      let data = { ...this.routeQueryStore };
      this.overviewNumSpinning = true;
      this.$api.assets
        .viewGetAssetHouseStatisticsForOrgan(data)
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let data = res.data.data || {};
            this.numList = this.numList.map((item) => {
              return {
                ...item,
                value: data[item.key],
              };
            });
          } else {
            this.$message.error(res.data.message || res.data.msg || "请求错误");
          }
        })
        .finally(() => {
          this.overviewNumSpinning = false;
        });
    },
    // 查询组织机构视图详情
    queryOrganViewDetail() {
      let data = { ...this.routeQueryStore };
      this.tableFirst.loading = true;
      this.$api.assets
        .queryOrganViewDetail(data)
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let result = res.data.data || {};
            if (Object.keys(result).length) {
              result.progress = result.progress + "%";
              this.tableFirst.dataSource = [{ ...result, key: 1 }];
            }
          } else {
            this.$message.error(res.data.message || res.data.msg || "请求错误");
          }
        })
        .finally(() => {
          this.tableFirst.loading = false;
        });
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.viewGetAssetHouseListForOrgan();
    },
  },
};
</script>
<style lang="less" scoped>
.organViewDetail-page {
  margin: 40px;
}
</style>
