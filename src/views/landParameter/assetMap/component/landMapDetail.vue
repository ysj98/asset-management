<!--
 * @Date: 2020-09-08 14:54:39
 * @Description: 地图土地资产详情
 * @Author: chh
-->
<template>
  <div class="landMapDetail-page">
    <div class="detail-top-head">
      {{ detailInfo.assetName | filterNullValue }}（土地）
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
                  <span class="detail-label">宗地号：</span><span class="detail-main">{{ detailInfo.theNo | filterNullValue
                  }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">土地面积：</span><span class="detail-main">{{ detailInfo.landArea |
                    filterNullValueSquare }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">土地用途：</span><span class="detail-main">{{ detailInfo.landuseName |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">土地类型：</span><span class="detail-main">{{ detailInfo.landTypeName |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">土地性质：</span><span class="detail-main">{{ detailInfo.landProperties |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">批准日期：</span><span class="detail-main">{{ detailInfo.approvalDate |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">计容面积：</span><span class="detail-main">{{ detailInfo.acreage |
                    filterNullValueSquare }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">容积率：</span><span class="detail-main">{{ detailInfo.landRate | filterNullValue
                  }}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">使用期限：</span><span class="detail-main">{{ detailInfo |
                    filterNullValueDateRange }}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">所属组织：</span><span class="detail-main">{{ detailInfo.organName |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">资产项目：</span><span class="detail-main">{{ detailInfo.projectName |
                    filterNullValue }}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">地理位置：</span><span class="detail-main">{{ detailInfo.position |
                    filterNullValue }} </span>
                </div>
              </a-col>
            </a-row>
          </div>
          <div class="detail-content-right pt10" style="cursor: pointer" @click="previewVisible = true">
            <img v-if="imgSrc" :src="imgSrc" alt="" />
            <img v-else src="../images/default_land.png" />
          </div>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="detail-table">
        <div style="text-align: center; padding: 20px 20px 0">
          <a @click="goDetail">查看资产详情</a>
        </div>
        <div class="pb10 pt10">
          <SG-Title title="资产概况" noMargin />
        </div>
        <a-table class="table-boxs" bordered v-bind="table"> </a-table>
        <div class="pb10 pt10">
          <SG-Title title="使用方向" noMargin />
        </div>
        <a-table class="table-boxs" bordered v-bind="tableTwo"> </a-table>
      </div>
    </div>
    <!-- 图片放大预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img style="width: 100%" v-if="imgSrc" :src="imgSrc" alt="" />
      <img style="width: 100%" v-else src="../images/default_land.png" />
    </a-modal>
  </div>
</template>

<script>
import Tools, { win } from '@/utils/utils';
// 获取图片域名
let hostImg = window.__configs ? window.__configs.hostImg : 'https://betapic.uhomecp.com/';
import { queryTopOrganByOrganID } from '@/views/buildingDict/publicFn';
import { getFormat } from '@/utils/utils';
const columns = [
  {
    title: '资产面积(㎡)',
    dataIndex: 'landArea',
  },
  {
    title: '资产原值(万元)',
    dataIndex: 'originalValue',
  },
  {
    title: '最新估值(万元)',
    dataIndex: 'marketValue',
  },
];

const columnsTwo = [
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
    if (item === 'landArea' || item === 'marketValue' || item === 'originalValue') {
      obj[item] = getFormat(obj[item]);
    }
    // 给columnsTwo中的数据加千分位，由于都有"()"以此判断
    if (obj[item] && obj[item].toString().includes('(')) {
      let arr = obj[item].split('(');
      obj[item] = `${getFormat(arr[0])}(${arr[1]}`;
    }
    o[item] = obj[item] || '-';
  });
  return o;
};
export default {
  name: 'landMapDetail',
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
      previewVisible: false,
    };
  },
  watch: {
    detailInfo(nv) {
      if (nv) {
        let obj = Object.keys(nv).filter((item) => item === 'landArea' || item === 'acreage');
        obj.forEach((sub) => {
          nv[sub] = getFormat(nv[sub]);
        });
        this.table.dataSource = [getDataRow(nv, columns)];
        this.tableTwo.dataSource = [getDataRow(nv, columnsTwo)];
        console.log('拿到数据', getDataRow(nv, columns), getDataRow(nv, columnsTwo));
      }
    },
    organId(val) {
      val && this.useForConfig();
    }
  },
  computed: {
    imgSrc() {
      return this.detailInfo.redMap ? hostImg + this.detailInfo.redMap : '';
    },
  },
  filters: {
    filterNullValue(val) {
      return val ? val : '-';
    },
    filterNullValueSquare(val) {
      return val ? val + '㎡' : '-';
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
    async goDetail() {
      const { organId, organName } = await queryTopOrganByOrganID({ nOrganId: this.organId, nOrgId: this.organId });
      const tabUrl = `/asset-management/#/landAssetsView/detail?assetLandId=${this.detailInfo.assetLandId}&assetId=${this.detailInfo.assetId}&organId=${organId}&organName=${organName}`;
      const tabTitle = '土地资产视图详情';
      win.openPortalMenu(tabUrl, tabTitle);
    },
    handleSwitch() {
      this.$emit('close', 'land');
    },
    // 数据概览信息配置
    useForConfig() {
      this.$api.houseStatusConfig.querySettingByOrganId({ organId: this.organId }).then((res) => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.forEach((item) => {
            this.tableTwo.columns.forEach((e) => {
              if (item.code == e.code) {
                e.isAble = item.isAble;
                e.title = item.alias || item.statusName;
              }
            });
          });
          this.tableTwo.columns = this.tableTwo.columns.filter((i) => {
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
