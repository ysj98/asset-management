<template>
  <div class="landMapDetail-page">
    <div class="detail-top-head">
      {{ detailInfo.placeName | filterNullValue }}（车场）
      <span class="fr pointer" @click="handleSwitch"><a-icon type="close" /></span>
    </div>
    <div class="detail-page">
      <!-- 详情部分 -->
      <div class="detail-top">
        <div class="detail-top-content">
          <div class="detail-content-left">
            <a-row>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">车场编码：</span><span class="detail-main">{{ detailInfo.placeCode |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">车场面积：</span><span class="detail-main">{{ detailInfo.placeArea |
                    filterNullValueSquare }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">车位数量：</span><span class="detail-main">{{ detailInfo.placeNums |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <!-- TODO:缺少车场类型 -->
                  <span class="detail-label">车场类型：</span><span class="detail-main">{{ detailInfo.typeName |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">地理位置：</span><span class="detail-main">{{ detailInfo.position |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">运营项目：</span><span class="detail-main">{{ detailInfo.communityName |
                    filterNullValue }}</span>
                </div>
              </a-col>
            </a-row>
          </div>
          <!-- TODO:车场 默认图 -->
          <div class="detail-content-right pt10" style="cursor: pointer" @click="previewVisible = true">
            <img v-if="imgSrc" :src="imgSrc" alt="" />
            <img v-else src="../images/default_yard.png" />
          </div>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="detail-table">
        <div class="pb10 pt10">
          <SG-Title title="资产概况" noMargin />
        </div>
        <a-table class="table-boxs" bordered v-bind="table"> </a-table>
        <div class="pb10 pt10">
          <SG-Title title="权属概况" noMargin />
        </div>
        <a-table class="table-boxs" bordered v-bind="tableTwo"> </a-table>
        <div class="pb10 pt10">
          <SG-Title title="使用方向" noMargin />
        </div>
        <a-table class="table-boxs" bordered v-bind="tableThree"> </a-table>
      </div>
    </div>
    <!-- 图片放大预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img style="width: 100%" v-if="imgSrc" :src="imgSrc" alt="" />
      <img style="width: 100%" v-else src="../images/default_yard.png" />
    </a-modal>
  </div>
</template>

<script>
import { getFormat } from '@/utils/utils';
import Tools from '@/utils/utils';
// 获取图片域名
let hostImg = window.__configs ? window.__configs.hostImg : 'https://betapic.uhomecp.com/';
const columns = [
  {
    title: '资产数量(个)',
    dataIndex: 'assetNum',
  },
  {
    title: '资产面积(㎡)',
    dataIndex: 'assetArea',
  },
  {
    title: '资产价值(万元)',
    dataIndex: 'assetValue',
  },
];

const columnsTwo = [
  {
    title: '所有权',
    dataIndex: 'ownerShipPercent',
  },
  {
    title: '使用权',
    dataIndex: 'onlyUsePercent',
  },
  {
    title: '有证',
    dataIndex: 'warrantPercent',
  },
  {
    title: '无证',
    dataIndex: 'noWarrantPercent',
  },
];
const columnsThree = [
  {
    title: '运营',
    dataIndex: 'transferOperationAreaPercent',
    code: '1001',
    isAble: 'Y',
  },
  {
    title: '闲置',
    dataIndex: 'idleAreaPercent',
    code: '1002',
    isAble: 'Y',
  },
  {
    title: '自用',
    dataIndex: 'selfUserAreaPercent',
    code: '1003',
    isAble: 'Y',
  },
  {
    title: '占用',
    dataIndex: 'occupationAreaPercent',
    code: '1004',
    isAble: 'Y',
  },
  {
    title: '其他',
    dataIndex: 'otherAreaPercent',
    code: '1005',
    isAble: 'Y',
  },
];
let getDataRow = (obj, columns) => {
  let keys = columns.map((item) => item.dataIndex);
  let o = { key: Tools.getUuid() };
  keys.forEach((item) => {
    if (item === 'assetArea' || item === 'assetValue') {
      obj[item] = getFormat(obj[item]);
    }
    // 给columnsThree中的数据加千分位，由于都有"()"以此判断
    if (obj[item] && obj[item].toString().includes('(')) {
      let arr = obj[item].split('(');
      obj[item] = `${getFormat(arr[0])}(${arr[1]}`;
    }
    o[item] = obj[item] || '-';
  });
  return o;
};
export default {
  // 车场详情
  name: 'YardDetail',
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    organId: {
      default: '',
    },
  },
  data() {
    return {
      getFormat,
      // 表格数据
      table: {
        columns,
        dataSource: [],
        pagination: false,
      },
      // 表格2
      tableTwo: {
        columns: columnsTwo,
        dataSource: [],
        pagination: false,
      },
      // 表格3
      tableThree: {
        columns: columnsThree,
        dataSource: [],
        pagination: false,
      },
      previewVisible: false,
    };
  },
  watch: {
    detailInfo(nv) {
      if (nv) {
        this.table.dataSource = [getDataRow(nv, columns)];
        this.tableTwo.dataSource = [getDataRow(nv, columnsTwo)];
        this.tableThree.dataSource = [getDataRow(nv, columnsThree)];
      }
    },
    organId(val) {
      val && this.useForConfig();
    }
  },
  computed: {
    imgSrc() {
      return this.detailInfo.picPath ? hostImg + this.detailInfo.picPath : '';
    },
  },
  filters: {
    filterNullValue(val) {
      return val ? val : '-';
    },
    filterNullValueSquare(val) {
      return val ? getFormat(val) + '㎡' : '-';
    },
    filterNullValueDateRange(detailInfo) {
      if (detailInfo.startDate) {
        return detailInfo.startDate + '~' + detailInfo.endDate;
      }
      return '-';
    },
  },
  mounted() {
    this.useForConfig();
  },
  methods: {
    handleSwitch() {
      this.$emit('close', 'land');
    },
    // 数据概览信息配置
    useForConfig() {
      this.$api.houseStatusConfig.querySettingByOrganId({ organId: this.organId }).then((res) => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.forEach((item) => {
            this.tableThree.columns.forEach((e) => {
              if (item.code == e.code) {
                e.isAble = item.isAble;
                e.title = item.alias || item.statusName;
              }
            });
          });
          this.tableThree.columns = this.tableThree.columns.filter((i) => {
            return i.isAble === 'Y';
          });
        } else {
          this.$message.error(res.message || '系统内部错误');
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.landMapDetail-page {
  width: 450px;
  height: auto;
  background: #ffffff;
  box-shadow: 1px 2px 2px 0px rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  font-size: 13px;
  overflow: hidden;
}

.detail-content-right {
  >img {
    width: 100%;
    height: auto;
  }
}

.detail-page {
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.detail-table {
  padding: 0 15px 15px 15px;
}

.detail-top-head {
  padding: 0 15px;
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid #fff;
  background-color: #0084ff;
  color: #fff;
}

.detail-top {
  background-color: #0084ff;
  color: #fff;
  padding-bottom: 15px;

  .detail-top-content {
    display: grid;
    grid-template-columns: auto 124px;
    margin: 0 15px;
  }

  .detail-top-item {
    margin-top: 15px;
  }
}
</style>
