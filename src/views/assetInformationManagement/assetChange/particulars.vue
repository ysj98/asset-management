<!--
  详情: particulars
  审核: audit  一期暂时不做审核和审核轨迹
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">变更单编号：{{particularsData.changeOrderId || '--'}}</a-col>
          <a-col class="playground-col" :span="8">变更单名称：{{particularsData.title || '--'}}</a-col>
          <a-col
            class="playground-col"
            :span="8"
          >当前状态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属机构：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产类型：{{particularsData.assetTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">变更类型：{{particularsData.changeTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">变更日期：{{particularsData.changeDate || '--'}}</a-col>
          <!-- <a-col
            class="playground-col"
            :span="8"
            v-if="+changeType === 1 || +changeType === 2"
          >截止日期：{{particularsData.expiryDate || '--'}}</a-col>
          <a-col class="playground-col" :span="8">交付单位：{{particularsData.deliveryCompany || '--'}}</a-col>-->
          <template v-if="+changeType === 3">
            <div>
              <a-col
                class="playground-col"
                :span="8"
              >原值对象类型：{{particularsData.originalObjectTypeName || '--'}}</a-col>
              <a-col
                class="playground-col"
                :span="8"
              >原值对象：{{particularsData.originalObjectIdName|| '--'}}</a-col>
              <a-col
                class="playground-col"
                :span="8"
              >原值金额(元)：{{particularsData.originalValue || '--'}}</a-col>
            </div>
          </template>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
          <a-col class="playground-col" :span="24">
            附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 件：
            <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <SG-UploadFile v-model="files" type="all" :show="true" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">资产列表</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columnsCom"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
          ></a-table>
          <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="queryCondition.count"
            :location="location"
            :noPageTools="noPageTools"
            v-model="queryCondition.pageNum"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deliveryProperty,
  deliveryOperation,
  changeDirectionUse,
  variationOriginalValue,
  positionChange,
  projectChange,
  baseChange,
  debtChange,
  baseChangeTwo,
  assetSize, changeDirectionUseEq
} from "./basics";
import { utils } from "@/utils/utils.js";
const originalObjectTypeMap = {
  "1": "资产项目",
  "2": "楼栋",
  "3": "车场",
  "4": "资产",
};
const shareWayMap = {
  "1": "按资产面积分摊",
  "2": "按资产个数分摊",
};
export default {
  components: {},
  props: {},
  data() {
    return {
      changeType: "",
      assetType: "",
      changeOrderId: "",
      particularsData: {},
      files: [],
      columns: [],
      loading: false,
      tableData: [],
      location: "",
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: "",
      },
    };
  },
  computed: {
    isSelectedEquipment(){
      return String(this.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
    },
    columnsCom(){
      if (this.isSelectedEquipment){
        const arr = ['assetArea']
        return this.columns.filter(ele=>{
          return !arr.includes(ele.dataIndex)
        })
      }else {
        return this.columns
      }
    }
  },
  watch: {
    changeType(value) {
      let val = String(value);
      let arr = [];
      if (val === "2") {
        arr = utils.deepClone(deliveryProperty);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "1") {
        arr = utils.deepClone(deliveryOperation);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "4") {
        arr = utils.deepClone(changeDirectionUse);
        arr = this.assetType === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT ? utils.deepClone(changeDirectionUseEq) : utils.deepClone(changeDirectionUse)
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "3") {
        arr = utils.deepClone(variationOriginalValue);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "5") {
        arr = utils.deepClone(positionChange);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "6") {
        arr = utils.deepClone(projectChange);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "7") {
        arr = utils.deepClone(baseChange);
        this.columns = arr.splice(0, arr.length - 1);
        this.handleBaseAndHuse();
      } else if (val === "8") {
        arr = utils.deepClone(debtChange);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "9") {
        arr = utils.deepClone(assetSize);
        this.columns = arr.splice(0, arr.length - 1);
      }
    },
  },
  methods: {
    // 查询详情
    query() {
      let obj = {
        changeOrderId: this.changeOrderId,
      };
      this.$api.assets.getChangeDetail(obj).then((res) => {
        console.log(res);
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          data.originalObjectTypeName =
            originalObjectTypeMap[data.originalObjectType];
          data.shareWayName = shareWayMap[data.shareWay];
          this.particularsData = data;
          let files = [];
          if (data.attachment && data.attachment.length > 0) {
            data.attachment.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName,
              });
            });
          }
          this.files = files;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产列表
    getChangeDetailPageFn() {
      this.loading = true;
      let obj = {
        changeOrderId: this.changeOrderId,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize,
      };
      this.$api.assets.getChangeDetailPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
            item.newOriginalValue = item.originalValue;
            item.changeProjectId = item.changeProjectName;
            // 债权映射
            item.newCreditorAmount = item.creditorAmount;
            item.newDebtAmount = item.debtAmount;

            item.creditorAmount = item.oldCreditorAmount;
            item.debtAmount = item.oldDebtAmount;
            // 资产面积映射
            item.assetArea = item.oldAssetArea;
            // 基础信息字段映射
            item.newDecorationSituation = item.decorationSituation;
          });
          this.tableData = data;
          this.queryCondition.count = res.data.data.count;
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 当为基础信息变动， 并且为房屋或者车场，资产类型
    handleBaseAndHuse() {
      console.log("会进到这里来2", this.changeType, "www", this.assetType);
      if (this.changeType === "7" && ["1"].includes(this.assetType)) {
        let arr = utils.deepClone(baseChangeTwo);
        this.columns = arr.splice(0, arr.length - 1);
      }
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.getChangeDetailPageFn();
    },
  },
  created() {},
  mounted() {
    this.particularsData = JSON.parse(this.$route.query.record);
    this.changeOrderId = this.particularsData[0].changeOrderId;
    this.changeType = this.particularsData[0].changeType + "";
    this.assetType = this.particularsData[0].assetType + "";
    this.query();
    this.getChangeDetailPageFn();
  },
};
</script>
<style lang="less" scoped>
.particulars {
  .particulars-nav {
    padding: 42px 126px 20px 70px;
    .particulars-obj {
      padding: 20px 0 20px 40px;
      .playground-row {
        .playground-col {
          height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
      }
    }
    .correspondingTask {
      margin: 35px 40px 0 40px;
      border: 1px solid #f0f2f5;
    }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
}
</style>
