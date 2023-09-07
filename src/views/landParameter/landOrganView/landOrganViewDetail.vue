<!--
 * @Date: 2020-08-07 13:36:14
 * @Description: 组织机构视图详情
 * @Author: chh
-->
<template>
  <div class="organViewDetail-page">
    <!-- 标题 -->
    <div class="mb30" style="margin-left: -12px">
      <SG-Title noMargin title="权属概况" />
    </div>
    <!-- 权属表格 -->
    <a-table
      size="middle"
      bordered
      :loading="tableFirst.loading"
      :pagination="false"
      :columns="tableFirst.columns"
      :dataSource="tableFirst.dataSource"
      :locale="{ emptyText: '暂无数据' }"
    ></a-table>
    <!-- 标题 -->
    <div class="mb30 mt30" style="margin-left: -12px">
      <SG-Title noMargin title="资产概况" />
    </div>
    <!--数据概览信息-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" />
    </a-spin>
    <div class="table-layout-fixed">
      <a-table :loading="table.loading" :columns="table.columns" :dataSource="table.dataSource" size="middle" :pagination="false" />
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
import OverviewNumber from '@/views/common/OverviewNumber';
import noDataTips from '@/components/noDataTips';
let columnsFrist = [
  {
    title: '有证',
    dataIndex: 'yesCount',
  },
  {
    title: '无证',
    dataIndex: 'noCount',
  },
  {
    title: '待办',
    dataIndex: 'waitCount',
  },
  {
    title: '权属办理进度',
    dataIndex: 'progress',
    width: 200,
  },
];
let columns = [
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
  },
  {
    title: '资产项目编码',
    dataIndex: 'projectCode',
  },
  {
    title: '权属单位',
    dataIndex: 'organName',
  },
  {
    title: '来源方式',
    dataIndex: 'sourceTypeName',
  },
  {
    title: '来源方式说明',
    dataIndex: 'souceChannelType',
  },
  {
    title: '接管时间',
    dataIndex: 'takeOverDate',
  },
  {
    title: '土地面积(㎡)',
    dataIndex: 'landArea',
  },
  {
    title: '土地数量',
    dataIndex: 'landCount',
  },
  {
    title: '运营(㎡)',
    dataIndex: 'transferOperationAreaTotal',
  },
  {
    title: '自用(㎡)',
    dataIndex: 'selfUserAreaTotal',
  },
  {
    title: '闲置(㎡)',
    dataIndex: 'idleAreaTotal',
  },
  {
    title: '占用(㎡)',
    dataIndex: 'occupationAreaTotal',
  },
  {
    title: '其他(㎡)',
    dataIndex: 'otherAreaTotal',
  },
  {
    title: '资产原值(元)',
    dataIndex: 'originalValueTotal',
  },
  {
    title: '最新估值(元)',
    dataIndex: 'marketValueTotal',
  },
];
export default {
  components: {
    OverviewNumber,
    noDataTips,
  },
  data() {
    return {
      tableFirst: {
        loading: false,
        columns: columnsFrist,
        dataSource: [],
      },
      overviewNumSpinning: false,
      numList: [
        {
          title: '土地面积(㎡)',
          key: 'landArea',
          value: 0,
          fontColor: '#324057',
          isAble: 'Y',
        },
        {
          title: '运营(㎡)',
          key: 'transferOperationArea',
          value: 0,
          bgColor: '#4BD288',
          code: '1001',
          isAble: 'Y',
        },
        { title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF', code: '1002', isAble: 'Y' },
        {
          title: '自用(㎡)',
          key: 'selfUserArea',
          value: 0,
          bgColor: '#DD81E6',
          code: '1003',
          isAble: 'Y',
        },
        {
          title: '占用(㎡)',
          key: 'occupationArea',
          value: 0,
          bgColor: '#FD7474',
          code: '1004',
          isAble: 'Y',
        },
        { title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6', code: '1005', isAble: 'Y' },
        {
          title: '资产原值(万元)',
          key: 'originalValue',
          value: 0,
          bgColor: '#DD81E6',
          isAble: 'Y',
        },
        {
          title: '最新估值(万元)',
          key: 'marketValue',
          value: 0,
          bgColor: '#1890FF',
          isAble: 'Y',
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
        // location: "absolute",
      },
      routeQueryStore: {
        organId: '',
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
    this.useForConfig();
  },
  methods: {
    // 数据概览信息配置
    useForConfig() {
      let { organId } = this.$route.query;
      this.$api.houseStatusConfig.querySettingByOrganId({ organId }).then((res) => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.forEach((item) => {
            this.numList.forEach((e) => {
              if (item.code == e.code) {
                e.bgColor = item.color;
                e.isAble = item.isAble;
                e.title = item.alias + '(㎡)' || item.statusName + '(㎡)';
              }
            });
          });
          this.numList = this.numList.filter((i) => {
            return i.isAble === 'Y';
          });
        } else {
          this.$message.error(res.message || '系统内部错误');
        }
      });
    },
    // 查询详情列表
    viewGetAssetHouseListForOrgan() {
      let data = { ...this.routeQueryStore, ...this.queryCondition };
      this.table.loading = true;
      this.$api.land
        .organViewProjectDetail(data)
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
          } else {
            this.$message.error(res.data.message || res.data.msg || '请求错误');
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
      this.$api.land
        .organViewProjectDetailTotal(data)
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let data = res.data.data || {};
            this.numList = this.numList.map((item) => {
              return {
                ...item,
                value: data[item.key] || '--',
              };
            });
          } else {
            this.$message.error(res.data.message || res.data.msg || '请求错误');
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
      this.$api.land
        .organViewShipDetail(data)
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let result = res.data.data || {};
            if (Object.keys(result).length) {
              result.progress = result.progress + '%';
              this.tableFirst.dataSource = [{ ...result, key: 1 }];
            }
          } else {
            this.$message.error(res.data.message || res.data.msg || '请求错误');
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
  /*overflow: hidden;*/
  padding: 40px;
}
</style>
