<template>
  <div class="landMapDetail-page">
    <div class="detail-top-head">
      {{ detailInfo.communityName | filterNullValue }}（项目设备设施）
      <span class="fr pointer" @click="handleSwitch"><a-icon type="close" /></span>
    </div>
    <div class="detail-page">
      <!-- 详情部分 -->
      <div class="detail-top">
        <div class="detail-top-content">
          <div class="detail-content-left">
            <a-row>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">运营项目：</span>
                  <span class="detail-main">
                    {{ detailInfo.communityName | filterNullValue }}
                  </span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">项目位置：</span>
                  <span class="detail-main">
                    {{ detailInfo.position | filterNullValue }}
                  </span>
                </div>
              </a-col>
            </a-row>
          </div>
          <!-- TODO:设备设施 默认图 -->
          <div class="detail-content-right pt10">
            <img v-if="imgSrc" :src="imgSrc" alt="" />
            <img v-else src="../images/default_equipment.png" />
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
          <SG-Title title="使用方向" noMargin />
        </div>
        <a-table class="table-boxs" bordered v-bind="tableThree"> </a-table>
        <div class="pb10 pt10">
          <SG-Title title="设备设施详情" noMargin />
        </div>
        <div class="detail-info">
          <div style="margin-bottom: 15px" v-for="(item, index) in detailInfo.equipmentDetailList" :key="index">
            <span>{{ item.equipmentName }}</span>
            <span>：</span>
            <span>{{ item.assetNum }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '@/utils/utils';
// 获取图片域名
let hostImg = window.__configs ? window.__configs.hostImg : 'https://betapic.uhomecp.com/';
import { getFormat } from '../../../../utils/utils';
const columns = [
  {
    title: '资产数量(个)',
    dataIndex: 'assetNum',
  },
  {
    title: '资产原值(万元)',
    dataIndex: 'originalValue',
  },
  {
    title: '资产价值(万元)',
    dataIndex: 'assetValue',
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
    obj[item] = item === 'originalValue' || item === 'assetValue' ? getFormat(obj[item]) : obj[item];
    // 给columnsThree中的数据加千分位，由于都有"()"以此判断
    if (obj[item] && obj[item].toString().includes('(')) {
      let arr = obj[item].split('(');
      obj[item] = `${getFormat(arr[0])}(${arr[1]}`;
    }
    // 沿用 之前的逻辑
    o[item] = obj[item] || '-';
    // o[item] = [undefined, null].includes(obj[item]) ? "-" : obj[item];
  });
  return o;
};
export default {
  // 设备设施详情
  name: 'EquipmentDetail',
  props: {
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 表格数据
      table: {
        columns,
        dataSource: [],
        pagination: false,
      },
      // 表格3
      tableThree: {
        columns: columnsThree,
        dataSource: [],
        pagination: false,
      },
    };
  },
  watch: {
    detailInfo(nv) {
      if (nv) {
        this.table.dataSource = [getDataRow(nv, columns)];
        this.tableThree.dataSource = [getDataRow(nv, columnsThree)];
      }
    },
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
  > img {
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
.detail-info {
  min-height: 100px;
  max-height: 300px;
  overflow: auto;
  padding: 20px 10px;
  border: 1px solid rgba(232, 232, 232, 0.8);
  border-radius: 8px;
}
</style>
