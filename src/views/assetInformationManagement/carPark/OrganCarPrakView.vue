<!-- 车场台账 - 组织机构视图 -->
<template>
  <div>
    <!--搜索条件-->
    <div style="padding: 20px 30px">
      <a-row :gutter="8">
        <a-col :span="12">
          <SG-Button
            icon="import"
            type="primary"
            @click="handleExport"
            :loading="exportBtnLoading"
            v-power="ASSET_MANAGEMENT.CARPARK_ORGAN_VIEW_EXPORT"
            >导出组织机构视图</SG-Button
          >
        </a-col>
        <a-col :span="5">
          <tree-select @changeTree="changeTree" style="width: 100%" :showSearch="true" :multiple="true" :treeCheckable="true" />
        </a-col>
        <a-col :span="5">
          <a-select
            v-model="statusList"
            mode="multiple"
            :maxTagCount="1"
            style="width: 100%"
            placeholder="请选择资产状态"
            :options="$addTitle(statusListOpt)"
          />
        </a-col>
        <a-col :span="2">
          <SG-Button icon="search" type="primary" @click="queryTableData({ type: 'search' })">查询</SG-Button>
        </a-col>
      </a-row>
    </div>
    <!--概览-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" isEmit @click="handleClickOverview" />
    </a-spin>
    <!--列表部分-->
    <a-table v-bind="tableObj" size="middle">
      <!--<span slot="assetNum" slot-scope="text">-->
      <!--<span style="color: #0084FF; cursor: pointer">{{text}}</span>-->
      <!--</span>-->
      <span slot="action" slot-scope="text, record">
        <span v-if="!record.totalRow" style="color: #0084ff; cursor: pointer" @click="handleViewDetail(record)">详情</span>
      </span>
    </a-table>
    <!-- <no-data-tip v-if="!tableObj.dataSource.length" /> -->
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })" />
  </div>
</template>

<script>
import NoDataTip from 'src/components/noDataTips';
import TreeSelect from 'src/views/common/treeSelect';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import OverviewNumber from 'src/views/common/OverviewNumber';
import { getFormat } from '../../../utils/utils';
import costInfoVue from '../../reportingManagement/reportingRecordList/costInfo.vue';
// 概览数字数据, title 标题，value 数值，bgColor 背景色
const numList = [
  { title: '所有资产(㎡)', key: 'area', value: 0, fontColor: '#324057', isAble: 'Y' },
  {
    title: '运营(㎡)',
    key: 'transferOperationArea',
    value: 0,
    bgColor: '#4BD288',
    code: '1001',
    isAble: 'Y',
    flag: '0',
  },
  { title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF', code: '1002', isAble: 'Y', flag: '1' },
  {
    title: '自用(㎡)',
    key: 'selfUserArea',
    value: 0,
    bgColor: '#DD81E6',
    code: '1003',
    isAble: 'Y',
    flag: '2',
  },
  {
    title: '占用(㎡)',
    key: 'occupationArea',
    value: 0,
    bgColor: '#FD7474',
    code: '1004',
    isAble: 'Y',
    flag: '3',
  },
  { title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6', code: '1005', isAble: 'Y', flag: '4' },
];
export default {
  name: 'index',
  components: { OverviewNumber, NoDataTip, TreeSelect },
  data() {
    return {
      organName: '',
      ASSET_MANAGEMENT, // 权限对象
      organId: '', // 查询条件-组织机构
      exportBtnLoading: false, // 导出按钮loading
      overviewNumSpinning: false, // 查询视图面积概览数据loading
      numList: numList,
      tableObj: {
        dataSource: [],
        loading: false,
        pagination: false,
        rowKey: 'organId',
        columns: [
          { title: '权属单位', dataIndex: 'organName' },
          { title: '建筑面积(㎡)', dataIndex: 'area' },
          { title: '车场数量', dataIndex: 'placeNum' },
          { title: '资产数量', dataIndex: 'assetNum' },
          { title: '运营(㎡)', dataIndex: 'transferOperationArea' },
          { title: '自用(㎡)', dataIndex: 'selfUserArea' },
          { title: '闲置(㎡)', dataIndex: 'idleArea' },
          { title: '占用(㎡)', dataIndex: 'occupationArea' },
          { title: '其它(㎡)', dataIndex: 'otherArea' },
          { title: '资产原值(元)', dataIndex: 'originalValue' },
          { title: '最新估值(元)', dataIndex: 'marketValue' },
          { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } },
        ],
        scroll: { y: 420 },
      },
      paginationObj: {
        pageNo: 1,
        totalCount: 0,
        pageLength: 10,
        location: 'absolute',
      },
      sumObj: {
        area: '',
        placeNum: '',
        assetNum: '',
        transferOperationArea: '',
        selfUserArea: '',
        idleArea: '',
        occupationArea: '',
        otherArea: '',
        originalValue: '',
        marketValue: '',
      }, // 求和用的对象
      current: null, // 当前选中的概览区域下标，与后台入参一一对应
      statusList: [], // 资产分类
      statusListOpt: [
        { title: '全部状态', key: 'all' },
        { title: '待入库', key: '0' },
        { title: '正常', key: '1' },
        { title: '报废', key: '2' },
        { title: '转让', key: '3' },
        { title: '报损', key: '4' },
        { title: '入库中', key: '7' },
      ],
    };
  },
  watch: {
    // 全选与其他选项互斥处理
    statusList: function (val) {
      if (val && val.length !== 1 && val.includes('all')) {
        this.statusList = ['all'];
      }
    },
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
                e.title = item.alias || item.statusName;
              }
            });
            // 同步修改表头的字段名称
            this.tableObj.columns.forEach((m, i) => {
              let isTransferOperationArea = item.code == 1001 && m.dataIndex === 'transferOperationArea';
              let isIdleArea = item.code == 1002 && m.dataIndex === 'idleArea';
              let isSelfUserArea = item.code == 1003 && m.dataIndex === 'selfUserArea';
              let isOccupationArea = item.code == 1004 && m.dataIndex === 'occupationArea';
              let isOthernArea = item.code == 1005 && m.dataIndex === 'otherArea';
              let flag = isTransferOperationArea || isIdleArea || isSelfUserArea || isOccupationArea || isOthernArea;
              if (flag) {
                m.title = item.alias || item.statusName;
                if (item.isAble === 'N') {
                  this.tableObj.columns.splice(i, 1);
                }
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
    // 点击总览数据块
    handleClickOverview({ i }) {
      this.current = i;
      this.queryTableData({ type: 'search' });
    },

    // 查看组织机构视图详情
    handleViewDetail(record) {
      let query = {
        organId: record.organId,
        statusList: this.statusList.includes('all') ? [] : this.statusList,
      };
      this.$router.push({ path: '/organCarPrakView/detail', query: query || {} });
    },

    // 查询列表数据
    queryTableData({ pageNo = 1, pageLength = 10, type }) {
      const { sumObj, organId, current, statusList } = this;
      if (!organId) {
        return this.$message.info('请选择组织机构');
      }
      this.tableObj.loading = true;
      this.$api.carPark
        .carParkViewOrgan({
          organIds: organId.toString(),
          pageSize: pageLength,
          pageNum: pageNo,
          flag: current ? current : '',
          statusList: statusList.includes('all') ? [] : statusList,
        })
        .then(({ data: res }) => {
          this.tableObj.loading = false;
          if (res && String(res.code) === '0') {
            const { count, data } = res.data;
            // let pageSum = {};
            data.forEach((item, index) => {
              item.key = index;
              // Object.keys(sumObj).forEach((key) => {
              //   !pageSum[key] && (pageSum[key] = 0);
              //   pageSum[key] += item[key] ? Number(item[key]) : 0;
              //   pageSum[key] = Number(pageSum[key].toFixed(2));
              // });
            });
            this.tableObj.dataSource = data.length ? data : [];
            // this.tableObj.dataSource = data.length
            //   ? data.concat({
            //       ...pageSum,
            //       organName: "本页合计",
            //       organId: "-999",
            //       totalRow: true
            //     })
            //   : [];
            // 查询楼栋面积统计数据
            if (type !== 'search') {
              data.length &&
                this.tableObj.dataSource.push({
                  ...sumObj,
                  organName: '全部合计',
                  organId: Date.now(),
                  totalRow: true,
                });
            } else {
              this.queryAreaInfo();
            }
            // 处理千分位
            this.tableObj.dataSource.forEach((item) => {
              Object.keys(item).forEach((sub) => {
                if (Object.keys(this.sumObj).includes(sub)) {
                  item[sub] = getFormat(item[sub], 4);
                }
              });
            });
            return Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo,
              pageLength,
            });
          }
          throw res.message;
        })
        .catch((err) => {
          this.tableObj.loading = false;
          this.$message.error(err || '查询列表接口出错');
        });
    },

    // 查询组织机构视图面积概览数据
    queryAreaInfo() {
      let {
        organId,
        tableObj: { dataSource },
        current,
        sumObj,
        statusList,
      } = this;
      this.overviewNumSpinning = true;
      this.$api.carPark
        .organGetTotal({
          organIds: organId.toString(),
          flag: current ? current : '',
          statusList: statusList.includes('all') ? [] : statusList,
        })
        .then(({ data: res }) => {
          this.overviewNumSpinning = false;
          if (res && String(res.code) === '0') {
            let obj = {};
            let list = res.data || {};
            Object.keys(sumObj).forEach((key) => (obj[key] = list[key] ? list[key].toFixed(2) : 0));
            this.sumObj = obj;
            // 处理千分位
            let arr = Object.keys(this.sumObj);
            arr.forEach((item) => {
              this.sumObj[item] = getFormat(this.sumObj[item], 4);
            });
            dataSource.length &&
              this.tableObj.dataSource.push({
                ...obj,
                organName: '全部合计',
                organId: Date.now(),
                totalRow: true,
              });
            this.numList = numList
              .map((m) => {
                return { ...m, value: list[m.key] || 0 };
              })
              .filter((item) => {
                return item.value !== 0;
              });
            this.useForConfig();
          } else {
            throw res.message;
          }
        })
        .catch((err) => {
          this.overviewNumSpinning = false;
          this.$message.error(err || '查询组织机构视图面积统计出错');
        });
    },

    // 导出数据
    handleExport() {
      this.exportBtnLoading = true;
      const { organId, current } = this;
      this.$api.carPark
        .carParkExPortForOrgan({
          organIds: organId,
          flag: current ? current : '',
          pageSize: 1,
          pageNum: 1,
        })
        .then((res) => {
          this.exportBtnLoading = false;
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([res.data]));
            a.download = '组织机构视图导出列表.xls';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            return a.remove();
          }
          throw res.message || '导出组织机构视图失败';
        })
        .catch((err) => {
          this.exportBtnLoading = false;
          this.$message.error(err || '导出组织机构视图失败');
        });
    },

    // 获取选择的组织机构
    changeTree(organId, name) {
      this.organName = name;
      this.organId = organId.split(',')[0];
      organId && this.queryTableData({ type: 'search' });
    },
  },

  created() {},
};
</script>

<style lang="less" scoped>
.custom-table {
  padding-bottom: 70px;
  /*if you want to set scroll: { x: true }*/
  /*you need to add style .ant-table td { white-space: nowrap; }*/
  & /deep/ .ant-table {
    .ant-table-thead th {
      white-space: nowrap;
    }
    tr:last-child,
    tr:nth-last-child(1) {
      font-weight: bold;
    }
  }
}
/deep/.ant-table-tbody {
  tr:nth-last-child(1) {
    position: sticky;
    bottom: 4px;
    background: #fff;
  }
  // tr:nth-last-child(2){
  //   position: sticky;
  //   bottom: 43px;
  //   background: #fff;
  // }
}
</style>
