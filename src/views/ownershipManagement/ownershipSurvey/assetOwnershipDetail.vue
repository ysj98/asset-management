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
            <span class="info-item-content">公建2019资产接管任务</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">资产编码：</span>
            <span class="info-item-content">SG2051401</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">管理机构：</span>
            <span class="info-item-content">四格互联信息技术有限公司</span>
          </div>
        </div>
        <div class="base-info-row">
          <div class="base-info-item">
            <span class="info-item-label">资产类型：</span>
            <span class="info-item-content">房屋</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">资产分类：</span>
            <span class="info-item-content">商铺</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">资产状态：</span>
            <span class="info-item-content">正常</span>
          </div>
        </div>
        <div class="base-info-row">
          <div class="base-info-item">
            <span class="info-item-label">资产项目：</span>
            <span class="info-item-content">公建2019</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">所在位置：</span>
            <span class="info-item-content">深圳南山区软件产业基地</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">面积：</span>
            <span class="info-item-content">200㎡</span>
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
            <span class="info-item-content">楼栋/房屋</span>
          </div>
          <div class="base-info-item">
            <span class="info-item-label">权属状态：</span>
            <span class="info-item-content">有证/无证/待办</span>
          </div>
        </div>
        <!-- 表格 -->
        <div class="table-layout-fixed detail-table">
          <a-table
            class="custom-table td-pd10"
            :pagination="false"
            :columns="tableInfo.columns"
            :dataSource="tableInfo.dataSource"
            :locale="{emptyText: '暂无数据'}"
          />
          <no-data-tips class="noTipStyle" v-show="tableInfo.dataSource.length === 0"></no-data-tips>
        </div>
      </div>
      <div class="mb30">
        <SG-Title noMargin title="同权证资产" />
      </div>
      <!-- 同权证资产内容 -->
      <div class="page-detail-item">
        <!-- 表格 -->
        <div class="table-layout-fixed detail-table">
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
        <div class="table-layout-fixed detail-table">
          <a-table
            class="custom-table td-pd10"
            :pagination="false"
            :columns="tableHandler.columns"
            :dataSource="tableHandler.dataSource"
            :locale="{emptyText: '暂无数据'}"
          />
          <no-data-tips class="noTipStyle" v-show="tableHandler.dataSource.length === 0"></no-data-tips>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
import noDataTips from "@/components/noDataTips";
let getUuid = ((uuid = 1) => () => ++uuid)();
const tableInfoColumns = [
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
  }];
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
  }];
const tableHandlerColumns = [
  {
    title: "业务类型",
    dataIndex: "assetName",
    width: "30%"
  },
  {
    title: "原权证号",
    dataIndex: "assetCode",
    width: "15%"
  },
  {
    title: "新权证号",
    dataIndex: "assetTypeName",
    width: "15%"
  },
  {
    title: "权属登记单名称",
    dataIndex: "projectName",
    width: "20%"
  },
  {
    title: "申请人",
    dataIndex: "location",
    width: "20%"
  },
  {
    title: "申请日期",
    dataIndex: "area",
    width: "15%"
  }];
export default {
  components: {
    noDataTips
  },
  data() {
    return {
      spinning: false,
      // 信息表格
      tableInfo: {
        columns: tableInfoColumns,
        dataSource: []
      },
      // 证表格
      tableCert: {
        columns: tableCertColumns,
        dataSource: []
      },
      // 办理表格
      tableHandler: {
        columns: tableHandlerColumns,
        dataSource: []
      }
    };
  }
};
</script>
 <style lang="less" scoped>
 .assetOwnershipDetail-page{
   margin: 42px 105px 0px 94px;
   .page-detail-item{
     margin-left: 44px;
     margin-bottom: 40px;
   }
 }
 .base-info-row{
   display: flex;
   color: #49505E;
   margin-bottom: 30px;
   &>div{
     flex: 1 1 33.33%;
   }
 }
.detail-table {
  position: relative;
  border: 1px solid rgba(238, 242, 245, 1);
  border-top: none;
}
.noTipStyle {
  padding: 20px 0;
}
</style>
