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
    <div class="table-layout-fixed pb70">
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
import { getFormat } from '../../../utils/utils';
let columnsFrist = [
  {
    title: '所有权',
    dataIndex: 'goodsTypeNames',
    children: [
      {
        title: '总数',
        dataIndex: 'ownerShipCount',
      },
      {
        title: '有证',
        dataIndex: 'ownerShipYesCount',
      },
      {
        title: '无证',
        dataIndex: 'ownerShipNoCount',
      },
      {
        title: '待办证',
        dataIndex: 'ownerShipWaitCount',
      },
    ],
  },
  {
    title: '使用权',
    dataIndex: 'wsPrice',
    children: [
      {
        title: '总数',
        dataIndex: 'useShipCount',
      },
      {
        title: '有证',
        dataIndex: 'useShipYesCount',
      },
      {
        title: '无证',
        dataIndex: 'useShipNoCount',
      },
      {
        title: '待办证',
        dataIndex: 'useShipWaitCount',
      },
    ],
  },
  {
    title: '权属办理进度',
    dataIndex: 'progress',
    width: 200,
  },
];
let columns = [
  {
    title: '权属单位',
    dataIndex: 'organName',
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
  },
  {
    title: '资产项目编码',
    dataIndex: 'projectCode',
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
    title: '建筑面积(㎡)',
    dataIndex: 'area',
  },
  {
    title: '车场数量',
    dataIndex: 'placeNum',
  },
  {
    title: '资产数量',
    dataIndex: 'assetNum',
  },
  {
    title: '运营(㎡)',
    dataIndex: 'transferOperationArea',
  },
  {
    title: '自用(㎡)',
    dataIndex: 'selfUserArea',
  },
  {
    title: '闲置(㎡)',
    dataIndex: 'idleArea',
  },
  {
    title: '占用(㎡)',
    dataIndex: 'occupationArea',
  },
  {
    title: '其他(㎡)',
    dataIndex: 'otherArea',
  },
  {
    title: '资产原值(元)',
    dataIndex: 'originalValue',
  },
  {
    title: '最新估值(元)',
    dataIndex: 'marketValue',
  },
];
export default {
  components: {
    OverviewNumber,
    noDataTips,
  },
  data() {
    return {
      formatArr: [
        'transferOperationArea',
        'selfUserArea',
        'idleArea',
        'occupationArea',
        'otherArea',
        'originalValue',
        'marketValue',
        'area',
        'assetNum',
        'placeNum',
      ],
      tableFirst: {
        loading: false,
        columns: columnsFrist,
        dataSource: [],
      },
      overviewNumSpinning: false,
      numList: [
        {
          title: '建筑面积(㎡)',
          key: 'measuredArea',
          value: 0,
          fontColor: '#324057',
          code: '1000',
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
        location: 'absolute',
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
    this.getCarParkListForOrgan();
    this.getCarParkStatisticsForOrgan();
    this.getCarParkViewShip();
    this.useForConfig();
  },
  methods: {
    // 数据概览信息配置
    useForConfig() {
      this.$api.houseStatusConfig.querySettingByOrganId({ organId: this.organId }).then((res) => {
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
    getCarParkListForOrgan() {
      let data = { ...this.routeQueryStore, ...this.queryCondition };
      this.table.loading = true;
      this.$api.carPark
        .getCarParkListForOrgan(data)
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
            this.table.dataSource.forEach((item) => {
              let arr = Object.keys(item);
              arr.forEach((sub) => {
                if (this.formatArr.includes(sub)) {
                  item[sub] = getFormat(item[sub]);
                }
              });
            });
          } else {
            this.$message.error(res.data.message || res.data.msg || '请求错误');
          }
        })
        .finally(() => {
          this.table.loading = false;
        });
    },
    // 组织机构视图详情表头统计
    getCarParkStatisticsForOrgan() {
      let data = { ...this.routeQueryStore };
      this.overviewNumSpinning = true;
      this.$api.carPark
        .getCarParkStatisticsForOrgan(data)
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
            this.$message.error(res.data.message || res.data.msg || '请求错误');
          }
        })
        .finally(() => {
          this.overviewNumSpinning = false;
        });
    },
    // 查询组织机构视图详情
    getCarParkViewShip() {
      let data = { ...this.routeQueryStore };
      this.tableFirst.loading = true;
      this.$api.carPark
        .getCarParkViewShip(data)
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
      this.getCarParkListForOrgan();
    },
  },
};
</script>
<style lang="less" scoped>
.organViewDetail-page {
  margin: 40px;
}
</style>
