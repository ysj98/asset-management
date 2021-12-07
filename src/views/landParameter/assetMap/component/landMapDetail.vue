<!--
 * @Date: 2020-09-08 14:54:39
 * @Description: 地图土地资产详情
 * @Author: chh
-->
<template>
  <div class="landMapDetail-page">
    <div class="detail-top-head">
      {{detailInfo.assetName | filterNullValue}}（土地）
      <span class="fr pointer" @click="handleSwitch"
        ><a-icon type="close"
      /></span>
    </div>
    <div class="detail-page">
      <!-- 详情部分 -->
      <div class="detail-top">
        <div class="detail-top-content">
          <div class="detail-content-left">
            <a-row>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">宗地号：</span
                  ><span class="detail-main">{{detailInfo.theNo | filterNullValue}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">土地面积：</span
                  ><span class="detail-main">{{detailInfo.landArea | filterNullValueSquare}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">土地用途：</span
                  ><span class="detail-main">{{detailInfo.landuseName | filterNullValue}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">土地类型：</span
                  ><span class="detail-main">{{detailInfo.landTypeName | filterNullValue}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">土地性质：</span
                  ><span class="detail-main">{{detailInfo.landProperties | filterNullValue}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">批准日期：</span
                  ><span class="detail-main">{{detailInfo.approvalDate | filterNullValue}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">计容面积：</span
                  ><span class="detail-main">{{detailInfo.acreage | filterNullValueSquare}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="detail-top-item">
                  <span class="detail-label">容积率：</span
                  ><span class="detail-main">{{detailInfo.landRate | filterNullValue}}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">使用期限：</span
                  ><span class="detail-main">{{detailInfo | filterNullValueDateRange}}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">管理机构：</span
                  ><span class="detail-main">{{detailInfo.organName | filterNullValue}}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">资产项目：</span
                  ><span class="detail-main">{{detailInfo.projectName | filterNullValue}}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-top-item">
                  <span class="detail-label">地理位置：</span
                  ><span class="detail-main"
                    >{{detailInfo.position | filterNullValue}}
                  </span>
                </div>
              </a-col>
            </a-row>
          </div>
          <div class="detail-content-right pt10">
            <img v-if="imgSrc" :src="imgSrc" alt="">
            <img v-else src="../images/default_land.png">
          </div>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="detail-table">
        <div style="text-align: center;padding: 20px 20px 0;">
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
  </div>
</template>

<script>
import Tools, {win} from '@/utils/utils'
import configs from '@/config/config.base.js'
import {queryTopOrganByOrganID} from "@/views/buildingDict/publicFn";
const columns = [
  {
    title: "资产面积(㎡)",
    dataIndex: "landArea",
  },
  {
    title: "资产原值(万元)",
    dataIndex: "originalValue",
  },
   {
    title: "最新估值(万元)",
    dataIndex: "marketValue",
  },
]

const columnsTwo = [
  {
    title: "运营",
    dataIndex: "transferOperationAreaPercent",
  },
  {
    title: "自用",
    dataIndex: "selfUserAreaPercent",
  },
  {
    title: "闲置",
    dataIndex: "idleAreaPercent",
  },
  {
    title: "占用",
    dataIndex: "occupationAreaPercent",
  },
  {
    title: "其他",
    dataIndex: "otherAreaPercent",
  },
]
let getDataRow = (obj, columns) => {
  let keys = columns.map(item => item.dataIndex)
  let o = {key: Tools.getUuid()}
  keys.forEach(item => {
    o[item] = obj[item]
  })
  return o
}
export default {
  name: "landMapDetail",
  props: {
    detailInfo: {
      type: Object,
      default: () => ({})
    },
    organId:{
      default:''
    }
  },
  data() {
    return {
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
    }
  },
  watch: {
    detailInfo (nv) {
      if (nv) {
        this.table.dataSource = [getDataRow(nv, columns)]
        this.tableTwo.dataSource = [getDataRow(nv, columnsTwo)]
        console.log('拿到数据', getDataRow(nv, columns), getDataRow(nv, columnsTwo))
      }
    }
  },
  computed: {
    imgSrc () {
      return this.detailInfo.redMap ? (configs.hostImg + this.detailInfo.redMap) : ''
    }
  },
  filters: {
    filterNullValue (val) {
      return val ? val : '-'
    },
    filterNullValueSquare (val) {
      return val ? (val + '㎡') : '-'
    },
    filterNullValueDateRange (detailInfo) {
      if (detailInfo.startDate) {
       return detailInfo.startDate + '~' + detailInfo.endDate
      }
      return '-'
    }
  },
  methods: {
    async goDetail(){
      const resOrganId = await queryTopOrganByOrganID({nOrganId:this.organId,nOrgId:this.organId})
      const data = {
        tabUrl:`/asset-management/#/buildingView/buildingViewDetail?buildId=${this.detailInfo.buildId}&organId=${resOrganId}`,
        tabTitle:'楼栋视图详情',
      }
      win.openPortalMenu(data)
    },
    handleSwitch() {
      this.$emit("close", "land")
    },
  },
}
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
.detail-content-right{
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
