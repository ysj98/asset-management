<!--
 * @Author: L
 * @Date: 2020-11-03 10:41:03
 * @LastEditTime: 2022-06-18 10:24:35
 * @Description: 资产明细
-->
<template>
  <div class="landAssetsView">
    <SearchContainer type="" v-model="toggle" :contentStyle="{ paddingTop: '16px' }">
      <div slot="headerBtns">
        <SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_RESOURCE_DETAIL_EXPORT" @click="downloadFn">导出</SG-Button>
        <!-- 暂时不放开 -->
        <SG-Button v-if="false" @click="changeListSettingsModal(true)" class="ml20">列表设置</SG-Button>
      </div>
      <div slot="headerForm">
        <a-select
          :style="allStyle"
          :allowClear="true"
          mode="multiple"
          :maxTagCount="1"
          v-model="queryCondition.projectId"
          placeholder="请选择资产项目"
          :filterOption="filterOption"
          :loading="loading && !projectData.length"
        >
          <a-select-option :title="item.title" v-for="(item, index) in projectData" :key="index" :value="item.value">
            {{ item.title }}
          </a-select-option>
        </a-select>
        <a-input-search v-model="queryCondition.assetNameCode" placeholder="资产名称/编码" :maxLength="40" :style="allStyle" @search="allQuery" />
        <SG-Button type="primary" style="margin-right: 10px" @click="allQuery">查询</SG-Button>
      </div>
    </SearchContainer>
    <!--数据总览-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" />
    </a-spin>
    <div :class="{ overflowX: tableData.length === 0 }">
      <a-table
        :scroll="scroll"
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        class="custom-total custom-scroll"
        :pagination="false"
        ref="table"
      >
        <span slot="action" slot-scope="text, record">
          <span
            v-if="record.projectName !== '当前页-合计' && record.projectName !== '所有页-合计'"
            style="color: #0084ff; cursor: pointer"
            @click="handleViewDetail(record)"
            >房屋详情</span
          >
        </span>
      </a-table>
      <div style="height: 100px"></div>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        :location="location"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <housingDetails v-if="housingShow" :record="record" ref="housingDetails" @cancelFn="cancelFn"></housingDetails>
    <TableHeaderSettings
      v-if="listSettingFlag"
      :funType="funType"
      width="1200px"
      @cancel="changeListSettingsModal(false)"
      @success="handleTableHeaderSuccess"
    />
  </div>
</template>

<script>
import SearchContainer from '@/views/common/SearchContainer';
import noDataTips from '@/components/noDataTips';
import OverviewNumber from 'src/views/common/OverviewNumber';
import housingDetails from './housingDetails';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import { getFormat } from '@/utils/utils';
import { handleTableHeaderScrollHeight, handleTableScrollHeight, initTableColumns } from 'utils/share';
import TableHeaderSettings from '@/components/TableHeaderSettings';
const detailColumns = [
  { title: '权属单位', dataIndex: 'organName', width: 120, fixed: 'left' },
  { title: '资产项目', dataIndex: 'projectName', width: 120, fixed: 'left' },
  { title: '资产名称', dataIndex: 'assetName', width: 200, fixed: 'left' },
  { title: '资产编码', dataIndex: 'assetCode', width: 180 },
  { title: '权证号', dataIndex: 'warrantNbr', width: 150 },
  { title: '产权人', dataIndex: 'obligeeAndPercent', width: 150 },
  { title: '权属用途', dataIndex: 'ownershipUse', width: 150 },
  { title: '楼栋名称', dataIndex: 'buildName', width: 150 },
  { title: '房屋数量', dataIndex: 'houseNum', width: 150 },
  { title: '资产分类', dataIndex: 'objectTypeName', width: 150 },
  { title: '资产用途', dataIndex: 'useTypeName', width: 150 },
  { title: '资产形态', dataIndex: 'typeName', width: 150 },
  { title: '资产状态', dataIndex: 'assetStatusName', width: 150 },
  { title: '资产原值(元)', dataIndex: 'originalValue', width: 150 },
  { title: '最新估值(元)', dataIndex: 'marketValue', width: 150 },
  { title: '资产面积(㎡)', dataIndex: 'assetArea', width: 150 },
  { title: '房屋总面积(㎡)', dataIndex: 'houseTotalArea', width: 150 },
  { title: '可租面积(㎡)', dataIndex: 'rentableArea', width: 150 },
  { title: '已租面积(㎡)', dataIndex: 'rentedArea', width: 150 },
  { title: '待租面积(㎡)', dataIndex: 'leaseArea', width: 150 },
  { title: '自用面积(㎡)', dataIndex: 'oneselfArea', width: 150 },
  { title: '闲置面积(㎡)', dataIndex: 'idleArea', width: 150 },
  { title: '销售面积(㎡)', dataIndex: 'sellArea', width: 150 },
];
const requiredColumn = [{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 120 }];
const queryCondition = {
  organId: '', // 组织机构id
  projectId: undefined, // 项目id
  assetNameCode: '', // 资产名称/编码
  pageNum: 1, // 当前页
  pageSize: 10, // 每页显示记录数
};
export default {
  components: { SearchContainer, noDataTips, OverviewNumber, housingDetails, TableHeaderSettings },
  props: {},
  data() {
    return {
      funType: 8,
      listSettingFlag: false,
      ASSET_MANAGEMENT,
      housingShow: false, // 房间弹框控制
      allStyle: 'width: 240px; margin-right: 10px;',
      overviewNumSpinning: false,
      scroll: { x: '100%', y: 600 },
      numList: [
        { title: '资产数量(个)', key: 'assetNum', value: 0, fontColor: '#324057' },
        { title: '资产面积(㎡)', key: 'assetArea', value: 0, bgColor: '#4BD288' },
        { title: '楼栋数量', key: 'buildNum', value: 0, bgColor: '#1890FF' },
        { title: '房屋数量', key: 'houseNum', value: 0, bgColor: '#DD81E6' },
        { title: '房屋面积(㎡)', key: 'houseTotalArea', value: 0, bgColor: '#FD7474' },
        { title: '已租面积(㎡)', key: 'rentedArea', value: 0, bgColor: '#FE0974' },
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      loading: false,
      noPageTools: false,
      location: 'absolute',
      toggle: false,
      columns: [],
      tableData: [],
      queryCondition: { ...queryCondition },
      count: '',
      projectData: [{ name: '全部资产项目', value: '' }],
      sumObj: {
        houseNum: '',
        originalValue: '',
        marketValue: '',
        assetArea: '',
        houseTotalArea: '',
        rentableArea: '',
        rentedArea: '',
        leaseArea: '',
        oneselfArea: '',
        idleArea: '',
        sellArea: '',
      },
      subArr: [
        'houseNum',
        'originalValue',
        'marketValue',
        'assetArea',
        'houseTotalArea',
        'rentableArea',
        'rentedArea',
        'leaseArea',
        'oneselfArea',
        'idleArea',
        'sellArea',
      ],
    };
  },
  computed: {},
  methods: {
    initColumns() {
      initTableColumns({ columns: this.columns, detailColumns, requiredColumn, funType: this.funType });
    },
    handleTableHeaderSuccess() {
      this.changeListSettingsModal(false);
      this.initColumns();
    },
    changeListSettingsModal(flag) {
      this.listSettingFlag = flag;
    },
    // 导出（暂无）
    downloadFn() {
      let obj = {
        organId: this.queryCondition.organId, // 组织机构id
        projectIdList: this.queryCondition.projectId === undefined ? [] : this.queryCondition.projectId, // 项目id
        assetNameCode: this.queryCondition.assetNameCode, // 资产名称/编码
      };
      this.$api.tableManage.detailExport(obj).then((res) => {
        let blob = new Blob([res.data]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '资产明细.xls';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 关闭房屋详情
    cancelFn() {
      this.housingShow = false;
    },
    // 查看房屋详情
    handleViewDetail(record) {
      this.record = record;
      this.housingShow = true;
      this.$nextTick(() => {
        this.$refs.housingDetails.status = true;
      });
    },
    // 搜索
    allQuery(str) {
      this.queryCondition.pageNum = 1;
      this.query(str);
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query('changePage');
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: '',
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach((item) => {
            arr.push({
              key: item.projectId,
              title: item.projectName,
              value: item.projectId,
            });
          });
          this.projectData = [{ name: '全部资产项目', value: '' }, ...arr];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    // 查询
    async query(str) {
      this.loading = true;
      let obj = {
        organId: this.queryCondition.organId, // 组织机构id
        selectOrganId: this.selectOrganId,
        projectIdList: this.queryCondition.projectId === undefined ? [] : this.queryCondition.projectId, // 项目id
        assetNameCode: this.queryCondition.assetNameCode, // 资产名称/编码
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
      };
      if (str !== 'asset') {
        if (str !== 'changePage') {
          obj.pageNum = 1;
          obj.pageSize = 1;
          try {
            this.overviewNumSpinning = true;
            let { data } = await this.$api.tableManage.detailTotal(obj);
            if (Number(data.code) === 0) {
              let list = data.data;
              this.numList = this.numList.map((m) => {
                return { ...m, value: list[m.key] || 0 };
              });
              Object.keys(this.sumObj).forEach((key) => {
                this.sumObj[key] = list[key];
              });
              this.overviewNumSpinning = false;
            } else {
              this.$message.error(data.message);
              this.overviewNumSpinning = false;
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      (obj.pageNum = this.queryCondition.pageNum), // 当前页
        (obj.pageSize = this.queryCondition.pageSize); // 每页显示记录数
      this.$api.tableManage.detailPageList(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index;
            });
            this.tableData = data;
            let pageSum = {};
            this.tableData.forEach((item, index) => {
              item.key = index;
              Object.keys(this.sumObj).forEach((key) => {
                !pageSum[key] && (pageSum[key] = 0);
                pageSum[key] += item[key] ? Number(item[key]) * 10000 : 0;
                if (index === this.tableData.length - 1) {
                  pageSum[key] = pageSum[key] / 10000;
                }
              });
              for (let key in item) {
                // item[key] = item[key] || '--'
              }
            });
            this.tableData = this.tableData.length
              ? this.tableData.concat(
                  { ...pageSum, projectName: '当前页-合计', key: Date.now() },
                  { ...this.sumObj, projectName: '所有页-合计', key: Date.now() + 100 }
                )
              : [];
            this.count = res.data.data.count;
            let formatArr = [
              'houseNum',
              'originalValue',
              'marketValue',
              'assetArea',
              'houseTotalArea',
              'rentableArea',
              'rentedArea',
              'leaseArea',
              'oneselfArea',
              'idleArea',
              'sellArea',
            ];
            this.tableData.forEach((item) => {
              let arr = Object.keys(item);
              arr.forEach((key) => {
                if (formatArr.includes(key)) {
                  item[key] = getFormat(item[key]);
                }
              });
            });
          } else {
            this.tableData = [];
            this.count = 0;
          }
          this.loading = false;
        } else {
          this.tableData = [{ organName: '拉开点距离飞洒' }];
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 资产登记-详情明细统计
    // assetViewTotal (obj) {
    //   this.overviewNumSpinning = true
    //   obj.pageNum = 1
    //   obj.pageSize = 1
    //   this.$api.tableManage.detailTotal(obj).then(res => {
    //     if (Number(res.data.code) === 0) {
    //       let data = res.data.data
    //       this.numList = this.numList.map(m => {
    //         return { ...m, value: data[m.key] || 0 }
    //       })
    //       this.overviewNumSpinning = false
    //     } else {
    //       this.$message.error(res.data.message)
    //       this.overviewNumSpinning = false
    //     }
    //   })
    // }
  },
  created() {
    handleTableScrollHeight(this.scroll, 360);
    this.initColumns();
  },
  mounted() {
    this.queryCondition.organId = this.$route.query.organId;
    this.selectOrganId = this.$route.query.selectOrganId;
    this.getObjectKeyValueByOrganIdFn();
    this.query();
    handleTableHeaderScrollHeight(this.$refs.table.$el);
  },
};
</script>
<style lang="less" scoped>
.landAssetsView {
  .from-second {
    padding-top: 14px;
  }
  .box {
    display: inline-block;
  }
  .box-left {
    margin-left: 10px;
  }
  .custom-table {
    padding-bottom: 70px;
  }
  .overflowX {
    /deep/ .ant-table-scroll {
      overflow-x: auto;
    }
    /deep/.ant-table-header {
      padding-bottom: 0px !important;
      margin-bottom: 0px !important;
    }
  }
  .city {
    float: right;
    margin-right: 8px;
    /deep/.ant-col-8 {
      width: 180px;
    }
    /deep/.province_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.city_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.district_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    flex: 1;
    flex-wrap: wrap;
    text-align: right;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>
