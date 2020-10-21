<!--
 * @Date: 2019-11-27 14:54:57
 * @Author: chen han
 * @Description: 资产权属详情
 -->
<template>
  <a-spin :spinning="spinning">
    <div class="assetOwnershipDetail-page">
      <div class="mb30">
        <SG-Title noMargin title="资产基本信息" />
      </div>
      <!-- 基础信息内容 -->
      <div class="page-detail-item">
        <div class="base-info-row">
          <div class="base-info-item">
            <span class="info-item-label">资产名称：</span>
            <span class="info-item-content">{{baseInfo.assetName}}</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">资产编码：</span>
            <span class="info-item-content">{{baseInfo.assetCode}}</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">管理机构：</span>
            <span class="info-item-content">{{baseInfo.organName}}</span>
          </div>
        </div>
        <div class="base-info-row">
          <div class="base-info-item">
            <span class="info-item-label">资产类型：</span>
            <span class="info-item-content">{{baseInfo.assetTypeName}}</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">资产分类：</span>
            <span class="info-item-content">{{baseInfo.objectTypeName}}</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">资产状态：</span>
            <span class="info-item-content">{{baseInfo.statusName}}</span>
          </div>
        </div>
        <div class="base-info-row">
          <div class="base-info-item">
            <span class="info-item-label">资产项目：</span>
            <span class="info-item-content">{{baseInfo.projectName}}</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">所在位置：</span>
            <span class="info-item-content">{{baseInfo.location}}</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">面积：</span>
            <span class="info-item-content">{{baseInfo.area}}㎡</span>
          </div>
        </div>
      </div>
      <div class="mb30">
        <SG-Title noMargin title="权属信息" />
      </div>
      <!-- 权属信息内容 -->
      <div class="page-detail-item">
        <div class="base-info-row" style="margin-bottom:20px;">
          <div class="base-info-item">
            <span class="info-item-label">权属形式：</span>
            <span class="info-item-content">{{baseInfo.ownerTypeName}}</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">权属状态：</span>
            <span class="info-item-content">{{baseInfo.ownershipStatusName}}</span>
          </div>
        </div>
        <!-- 表格 -->
        <div
          class="table-layout-fixed detail-table"
          :class="[tableInfo.dataSource.length === 0&&'borderBottom']"
        >
          <a-table
            class="custom-table td-pd10"
            :pagination="false"
            :columns="tableInfo.columns"
            :dataSource="tableInfo.dataSource"
            :locale="{emptyText: '暂无数据'}"
          >
            <template slot="warrantNbr" slot-scope="text, record">
              <template v-if="text">
                <span
                  class="nav_name"
                  @click="showCertDetail(item, record.organId)"
                  v-for="(item, i) in text.split(',')"
                  :key="i"
                >{{item}}{{text.split(',').length==(i+1)? '': ','}}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </template>
          </a-table>
          <no-data-tips class="noTipStyle" v-show="tableInfo.dataSource.length === 0"></no-data-tips>
        </div>
      </div>
      <div class="mb30">
        <SG-Title noMargin title="同权证资产" />
      </div>
      <!-- 同权证资产内容 -->
      <div class="page-detail-item">
        <!-- 表格 -->
        <div
          class="table-layout-fixed detail-table"
          :class="[tableCert.dataSource.length === 0&&'borderBottom']"
        >
          <a-table
            class="custom-table td-pd10"
            :pagination="false"
            :columns="tableCert.columns"
            :dataSource="tableCert.dataSource"
            :locale="{emptyText: '暂无数据'}"
          />
          <no-data-tips class="noTipStyle" v-show="tableCert.dataSource.length === 0"></no-data-tips>
        </div>
      </div>
      <div class="mb30">
        <SG-Title noMargin title="权属办理记录" />
      </div>
      <!-- 权属办理记录内容 -->
      <div class="page-detail-item">
        <!-- 表格 -->
        <div
          class="table-layout-fixed detail-table"
          :class="[tableHandler.dataSource.length === 0&&'borderBottom']"
        >
          <a-table
            class="custom-table td-pd10"
            :pagination="false"
            :columns="tableHandler.columns"
            :dataSource="tableHandler.dataSource"
            :locale="{emptyText: '暂无数据'}"
          >
            <!-- 旧产权证 -->
            <template slot="oldWarrantNbr" slot-scope="text, record">
              <template v-if="text">
                <span
                  class="nav_name"
                  @click="showCertDetail(item, record.organId)"
                  v-for="(item, i) in text.split(',')"
                  :key="i"
                >{{item}}{{text.split(',').length==(i+1)? '': ','}}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </template>
            <!-- 新产权证 -->
            <template slot="warrantNbr" slot-scope="text, record">
              <template v-if="text">
                <span
                  class="nav_name"
                  @click="showCertDetail(item, record.organId)"
                  v-for="(item, i) in text.split(',')"
                  :key="i"
                >{{item}}{{text.split(',').length==(i+1)? '': ','}}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </template>
          </a-table>
          <no-data-tips class="noTipStyle" v-show="tableHandler.dataSource.length === 0"></no-data-tips>
        </div>
      </div>
    </div>
    <certDetail ref="certDetail"></certDetail>
  </a-spin>
</template>
<script>
import noDataTips from "@/components/noDataTips";
// import certDetail from "./child/certDetail.vue";
import certDetail from "@/views/ownershipManagement/authorityCardManagement/cardDetails";
import { utils } from "@/utils/utils";
let getUuid = ((uuid = 1) => () => ++uuid)();
const tableInfoColumns = [
  {
    title: "编号",
    dataIndex: "order",
    width: "10%"
  },
  {
    title: "权属形式",
    dataIndex: "ownerTypeName",
    width: "10%"
  },
  {
    title: "权证类型",
    dataIndex: "kindOfRightName",
    width: "15%"
  },
  {
    title: "权证号",
    dataIndex: "warrantNbr",
    scopedSlots: { customRender: "warrantNbr" },
    width: "15%"
  },
  {
    title: "权属人",
    dataIndex: "obligeeNames",
    width: "20%"
  },
  {
    title: "登记日期",
    dataIndex: "rigisterDate",
    width: "20%"
  },
  {
    title: "交接日期",
    dataIndex: "handoverDate",
    width: "20%"
  }
];
const tableCertColumns = [
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: "20%"
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    width: "15%"
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: "15%"
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
    width: "20%"
  },
  {
    title: "所在位置",
    dataIndex: "location",
    width: "20%"
  },
  {
    title: "面积(㎡)",
    dataIndex: "area",
    width: "10%"
  }
];
const tableHandlerColumns = [
  {
    title: "业务类型",
    dataIndex: "registerTypeName",
    width: "10%"
  },
  {
    title: "原权证号",
    dataIndex: "oldWarrantNbr",
    scopedSlots: { customRender: "oldWarrantNbr" },
    width: "30%"
  },
  {
    title: "新权证号",
    dataIndex: "warrantNbr",
    scopedSlots: { customRender: "warrantNbr" },
    width: "30%"
  },
  {
    title: "权属登记单名称",
    dataIndex: "registerName",
    width: "10%"
  },
  {
    title: "申请人",
    dataIndex: "createByName",
    width: "10%"
  },
  {
    title: "申请日期",
    dataIndex: "createTime",
    width: "10%"
  }
];
export default {
  components: {
    noDataTips,
    certDetail
  },
  data() {
    return {
      type: "",
      assetObjectId: '',
      assetType: '',
      organId: '',
      spinning: false,
      // 权属信息
      tableInfo: {
        columns: tableInfoColumns,
        dataSource: []
      },
      // 同权证资产
      tableCert: {
        columns: tableCertColumns,
        dataSource: []
      },
      // 权属办理记录
      tableHandler: {
        columns: tableHandlerColumns,
        dataSource: []
      },
      // 基础信息
      baseInfo: {}
    };
  },
  created() {
    this.type = this.$route.query.type || "";
    this.assetObjectId = this.$route.query.assetObjectId || "";
    this.assetType = this.$route.query.assetType || "";
    this.organId = this.$route.query.organId || ''
    this.assetDetail();
  },
  methods: {
    assetDetail() {
      let data = {
        assetObjectId: this.assetObjectId,
        assetType: this.assetType
      };
      this.spinning = true
      this.$api.basics.assetDetail(data).then(res => {
        this.spinning = false
        if (res.data.code === "0") {
          let baseInfo = res.data.data.baseInfo || {};
          let ownershipInfo = res.data.data.ownershipInfo || [];
          let sameNo = res.data.data.sameNo || [];
          let transactionList = res.data.data.transactionList || [];
          utils.each(baseInfo, (item, key) => {
            if (!item && item !== 0) {
              baseInfo[key] = "--";
            }
          });
          this.baseInfo = { ...baseInfo };
          // 权属信息
          this.tableInfo.dataSource = ownershipInfo.map((item, i) => {
            return {
              key: getUuid(),
              order: i + 1,
              ...item
            };
          });
          // 同权证资产
          this.tableCert.dataSource = sameNo.map(item => {
            item.location = item.location || "--";
            item.area = item.area || item.area===0? item.area : "--";
            return {
              key: getUuid(),
              ...item
            };
          });
          // 权属办理记录
          this.tableHandler.dataSource = transactionList.map(item => {
            item.createByName = item.createByName || '--'
            return {
              key: getUuid(),
              ...item
            };
          });
        } else {
          this.$message.error(res.data.message);
        }
      }, () => {
        this.spinning = false
      });
    },
    showCertDetail(warrantNbr, organId) {
      console.log('拿到产权好', warrantNbr)
      if (!warrantNbr) {
        return
      }
      this.$refs.certDetail.query(warrantNbr, organId)
    }
  }
};
</script>
 <style lang="less" scoped>
.assetOwnershipDetail-page {
  margin: 42px 105px 0px 94px;
  .page-detail-item {
    margin-left: 44px;
    margin-bottom: 40px;
  }
}
.base-info-row {
  display: flex;
  color: #49505e;
  margin-bottom: 30px;
  & > div {
    flex: 1 1 33.33%;
  }
}
.detail-table {
  position: relative;
  border-left: 1px solid rgba(238, 242, 245, 1);
  border-right: 1px solid rgba(238, 242, 245, 1);
  &.borderBottom {
    border-bottom: 1px solid rgba(238, 242, 245, 1);
  }
}
.noTipStyle {
  padding: 20px 0;
}
</style>
