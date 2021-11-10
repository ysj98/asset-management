<!--
 * @Description: 新建 编辑车场
-->
<template>
  <div class="landInfo-create-page">
    <div class="create-form">
      <a-form-model ref="form" :model="formInfo" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
            <SG-Title noMargin title="基础信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-model-item
                  :required="true"
                  label="所属机构"
                  prop="organId"
                >
                  <treeSelect
                    ref="organTopRef"
                    :default="false"
                    :typeFilter="typeFilter"
                    @changeTree="changeTree"
                    placeholder="请选择所属机构"
                    :defaultOrganName="organName"
                    :style="allStyle"
                    :allowClear="false"
                    v-model="formInfo.organId"
                  >
                  </treeSelect>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  label="车场名称"
                  :required="true"
                  prop="placeId"
                >
                  <a-select
                    show-search
                    :style="allWidth"
                    @search="handleSearch"
                    @change="handleParkChange"
                    placeholder="请选择车场名称"
                    :options="$addTitle(placeArr)"
                    :default-active-first-option="false"
                    v-model="formInfo.placeId"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="区域名称" :required="true" prop="parkingAreaId">
                  <a-select
                    :style="allWidth"
                    :options="$addTitle(placeAreaArr)"
                    placeholder="请选择区域名称"
                    :default-active-first-option="false"
                    v-model="formInfo.parkingAreaId"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="车位名称" :required="true" prop="name">
                  <a-input
                    :style="allWidth"
                    :maxLength="30"
                    placeholder="请输入车位名称"
                    v-model="formInfo.name"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="车位编码" :required="true" prop="code">
                  <a-input
                    :style="allWidth"
                    placeholder="请输入车位编码"
                    :maxLength="30"
                    v-model="formInfo.code"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="交付时间" prop="deliverDate">
                  <a-date-picker
                    :style="allWidth"
                    placeholder="请选择交付时间"
                    :getPopupContainer="getPopupContainer"
                    v-model="formInfo.deliverDate"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="车位用途" :required="true" prop="parkingUsage">
                  <dict-select
                    :style="allWidth"
                    :disabled="routeQuery.type === 'edit'"
                    placeholder="请选择车位用途"
                    @change="handleCarStallUsage"
                    :dict-options="parkingUsageOption"
                    v-model="formInfo.parkingUsage"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="车位类型" :required="true" prop="objType">
                  <dict-select
                    :style="allWidth"
                    :disableOptions="carTypeDisabledList"
                    :refresh="carTypeRefresh"
                    placeholder="请选择车位类型"
                    menu-code="PARKING_OBJ_TYPE"
                    @change="handleCarTypeChange"
                    v-model="formInfo.objType"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8" v-if="carType">
                <a-form-model-item label="车位状态" :required="true" prop="objStatus">
                  <dict-select
                    placeholder="请选择车位状态"
                    :style="allWidth"
                    :menu-code="carType"
                    v-model="formInfo.objStatus"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="建筑面积(㎡)" prop="propertyArea">
                  <a-input-number
                    :min="0"
                    placeholder="请输入建筑面积"
                    :max="999999.9999"
                    :style="allWidth"
                    v-model="formInfo.propertyArea"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="使用面积(㎡)" prop="useArea">
                  <a-input-number
                    :min="0"
                    placeholder="请输入使用面积"
                    :max="999999.9999"
                    :style="allWidth"
                    v-model="formInfo.useArea"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="公摊面积(㎡)" prop="shareArea">
                  <a-input-number
                    :min="0"
                    placeholder="请输入公摊面积"
                    :max="999999.9999"
                    :style="allWidth"
                    v-model="formInfo.shareArea"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24" style="display: flex">
                <!-- 文本框 -->
                <div style="width: 7%;text-align: right; line-height: 40px; padding-right: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.85);">备注:</div>
                <div style="width: 86%">
                <a-textarea
                  :maxLength="200"
                  v-model="formInfo.description"
                />
                </div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24" style="display: flex;margin-top: 20px">
                <div style="width: 7%;text-align: right; line-height: 40px; padding-right: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.85);">图片:</div>
                <div style="width: 86%">
                  <SG-UploadFile
                    :customDownload="customDownload"
                    :customUpload="customUpload"
                    v-model="formInfo.parkingImg"
                    :max="1"
                    :maxSize="2048"
                  >
                  <span slot="tips">(注：上传的图片最多为 1 张,且图片大小小于2M)</span>
                  </SG-UploadFile>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-form-model>
    </div>
    <FormFooter style="border:none;">
      <SG-Button class="mr2" @click="handleSave" type="primary">提交</SG-Button>
      <SG-Button @click="handleCancel">取消</SG-Button>
    </FormFooter>
  </div>
</template>
<script>
import FormFooter from "@/components/FormFooter.vue";
import dictMixin from "../dictMixin.js";
import TreeSelect from "@/views/common/treeSelect";
import { typeFilter } from "@/views/buildingDict/buildingDictConfig";
import { queryTopOrganByOrganID } from "@/views/buildingDict/publicFn";
import { carTypeMenu, parkingUsageOption, parkTypeOpt } from "./dict";
import DictSelect from "../../common/DictSelect";
import { stallApiDetail } from "../../../api/building";

const allWidth = { width: "100%" };
const allWidth1 = { width: "100px", marginRight: "10px", flex: "0 0 120px" };
const allWidth2 = { width: "250px", flex: 1 };
// 页面跳转
const operationTypes = {
  index: "/buildingDict"
};
export default {
  components: {
    DictSelect,
    FormFooter,
    TreeSelect
  },
  mixins: [dictMixin],
  data() {
    return {
      parkingUsageOption,
      parkTypeOpt, // 全部车场
      carTypeMenu, // 车位类型列表
      carType: undefined, // 车位类型
      carTypeDisabledList: [], // 车位筛选列表
      carTypeMarketList: [3 , '3'], // 销售类型
      carTypePropertyList:[0, 1, 2, '0', '1', '2'], // 产权类型
      carTypeRefresh: 0, // 车位手动刷新列表
      organId: "",
      organName: "",
      formInfo: {
        // 表单
        organId: undefined, // '机构Id',
        placeId: undefined, // '车场Id',
        name: undefined, // '车位名称',
        code: undefined, // '车位编码',
        deliverDate: undefined,
        objType: undefined, // '车位类型',
        objStatus: undefined, // '车位状态',
        parkingUsage: undefined, //'车位用途',
        parkingAreaId: undefined, // '区域Id',
        useArea: undefined, // 使用面积
        shareArea: undefined, //'公摊面积',
        propertyArea: undefined, // '产权面积',
        parkingImg: [],
        description: undefined // '备注',
        // parkingAreaUnits: '' // '面积单位'
      },
      rules:{
        organId: [
          { required: true, message: '请选择所属机构' },
        ],
        placeId:[
          { required: true, message: '请选择车场名称' },
        ],
        parkingAreaId:[
          { required: true, message: '请选择区域名称' },
        ],
        parkingUsage:[
          { required: true, message: '请输入车位用途' },
        ],
        name:[
          { required: true, message: '请输入车位名称' },
        ],
        code:[
          { required: true, message: '请输入车位编码' },
        ],
        objType:[
          { required: true, message: '请输入车位类型' },
        ],
        objStatus:[
          { required: true, message: '请输入车位状态' },
        ],
        useArea: [
          {pattern: new RegExp(/^\d{1,13}(?:\.\d{1,4})?$/), message: '请输入小于13位整数，小于4位精度的数值'}
        ],
        shareArea: [
          {pattern: new RegExp(/^\d{1,13}(?:\.\d{1,4})?$/), message: '请输入小于13位整数，小于4位精度的数值'}
        ],
        propertyArea:[
          { required: true, message: '请输入产权面积' },
          {required: true, pattern: new RegExp(/^\d{1,13}(?:\.\d{1,4})?$/), message: '请输入小于13位整数，小于4位精度的数值'}
        ],
      },
      placeArr: [], // 车场列表
      placeAreaArr: [], // 区域列表
      allStyle: "width: 100%;",
      typeFilter,
      allWidth,
      allWidth1,
      allWidth2,
      communityIdOpt: [], // 选择项目
      routeQuery: {
        // 路由传入数据
        type: "create", // 页面类型
        placeId: "", // 车场Id
        parkingId: "", // 车位Id
        organName: "",
        organId: ""
      },
      loadingFlag: false,
      bussType: "blankDir",
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
    window.fff = this.form;
  },
  mounted() {
    let { organName, organId, type, placeId, parkingId } = this.$route.query;
    Object.assign(this, {
      routeQuery: { organName, organId, type, placeId, parkingId }
    });
    this.init();
  },
  methods: {
    async changeTree(value, title) {
      this.organId = value;
      this.organName = title;
      this.parkApiList({ organId: value });
      this.placeAreaArr = []; // 清空区域
      this.formInfo.placeId=
      this.formInfo.parkingAreaId= undefined
    },
    beforeSubmit(value) {
      return {
        ...value,
        parkingImg: (this.formInfo.parkingImg|| []).map(node => node.url).join(",")
      };
    },
    // 确定
    handleSave() {
      this.$refs.form.validate(async (validate) => {
        if(validate) {
        const data = this.beforeSubmit(this.formInfo);
        if (this.routeQuery.type === "create") {
          this.stallApiInsert(data);
        } else if (this.routeQuery.type === "edit") {
          this.stallApiEdit(data);
        }
        } else {
          return false
        }
      });
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: "/buildingDict", query: { showKey: "stall" } });
    },
    // 车场搜索
    handleSearch(key) {
      this.parkApiList({ nameOrCode: key });
    },
    // 车场 变化查询区域
    handleParkChange(ev) {
      const params = {
        placeId: ev,
        organId: this.organId
      };
      this.formInfo.parkingAreaId= undefined
      this.placeAreaArr = [];
      this.parkAreaApiList(params);
    },
    // 车位用途发生变化
    handleCarStallUsage (ev) {
      console.log(ev)
      if (this.loadingFlag) {
        this.formInfo.objType = undefined
        this.formInfo.objStatus = undefined
      }
      switch (ev) {
        case 1: // 运营车位
        case '1':
        case '运营车位':
          this.carTypeDisabledList = this.carTypeMarketList
          break;
        case 2: // 销售车位
        case '2':
        case '销售车位':
          this.carTypeDisabledList = this.carTypePropertyList
          break;
      }
      this.carTypeRefresh = Math.random()
    },
    // 车位类型变化
    handleCarTypeChange(ev) {
      this.formInfo.objStatus = undefined;
      this.checkCarType(ev);
    },
    checkCarType(ev) {
      switch (Number(ev)) {
        case 0: // 临时
        case 1: // 固定
          this.carType = this.carTypeMenu.PARKING_OBJ_STATUS;
          break;
        case 2: // 产权
          this.carType = this.carTypeMenu.PROPERTY_PARKING_OBJ_STATUS;
          break;
        default:
          this.carType = undefined;
          return;
      }
    },
    // 请求项目
    queryCommunityListByOrganId(organTopId) {
      let data = {
        organId: organTopId
      };
      this.$api.basics.queryCommunityListByOrganId(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let resultArr = result.map(item => {
            return {
              label: item.name,
              value: item.communityId,
              ...item
            };
          });
          this.communityIdOpt = resultArr;
        }
      });
    },
    getPopupContainer(e) {
      return e.parentElement;
    },
    // 改变 所属机构时,做部分重置
    initPreData() {},
    // 初始化
    async init() {
      this.$nextTick(() => {
        this.form.setFieldsValue(this.formInfo);
      });
      if (this.routeQuery.type === "create") {
         this.loadingFlag = true
      }
      if (this.routeQuery.type === "edit") {
        await this.stallApiDetail({
          placeId: this.routeQuery.placeId,
          parkingId: this.routeQuery.parkingId
        });
      }
    },
    /* *****************接口相关**************** */
    // 查询 车场列表
    async parkApiList(data) {
      if (!this.organId) {
        this.$message.error("请选择所属机构");
        return;
      }
      this.placeArr = [];
      const params = {
        ...data,
        onlyCurrentNode: 1,
        organId: this.organId,
        pageNo: 1,
        pageLength: 999
      };
      const {data: res} = await this.$api.building.parkApiList(params)
        if (String(res.code) === "0") {
          let result = res.data.resultList || [];
          this.placeArr = result.map(item => ({
            value: item.placeId,
            label: item.placeName
          }));
        } else {
          this.$message.error(res.data.message);
        }
    },
    // 查询 区域
    async parkAreaApiList(data) {
      const {data: res} = await this.$api.building.parkApiDetail(data)
        if (String(res.code) === "0") {
          this.placeAreaArr = (res.data.areaArray || []).map(item => ({
            value: item.parkingAreaId,
            label: item.areaName
          }));
        } else {
          this.$message.error(res.message);
        }
    },
    // 查询 车位详情
    async stallApiDetail(data) {
      const params = {
        ...data
      };
      let loadingName = this.SG_Loding("加载中...");
      try {
        const { data: res } = await stallApiDetail(params);
        if (res.code === "0") {
          this.formInfo = await this.afterStallApiList(res.data);
          this.$nextTick(()=>{
            this.handleCarStallUsage(this.formInfo.parkingUsage || '')
          })
        }
      } finally {
        this.DE_Loding(loadingName);
        this.$nextTick(()=>{
          this.loadingFlag = true
        })
      }
    },
    async afterStallApiList(data) {
      const parkingImg = (data.parkingImg || "")
        .split(",")
        .filter(item => item)
        .map(item => ({
          url: item,
          name: item.split("/").pop()
        }));
      this.organName = data.organName;
      this.organId = data.organId;
      { // 获取车场
        this.parkApiList({ organId: data.organId });
      }
      { // 获取区域
        const params = {
          placeId: data.placeId,
          organId: data.organId
        };
        await this.parkAreaApiList(params);
      }
      this.checkCarType(data.objType);
      return {
        ...data,
        parkingImg,
        organId: data.organId,
        placeId: data.placeId,
        objStatus: data.objStatus,
        parkingAreaId: data.parkingAreaId,
      };
    },
    stallApiInsert(data) {
      const params = {
        ...data
      };
      let loadingName = this.SG_Loding("新增中...");
      this.$api.building.stallApiInsert(params).then(
        res => {
          this.DE_Loding(loadingName).then(() => {
            if (res.data.code === "0") {
              this.$SG_Message.success("新增车位成功");
              this.$router.push({
                path: "/buildingDict",
                query: { showKey: "stall", refresh: true }
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        },
        () => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error("新增失败！");
          });
        }
      );
    },
    stallApiEdit(data) {
      const params = {
        ...data,
        parkingId: this.routeQuery.parkingId
      };
      let loadingName = this.SG_Loding("编辑中...");
      this.$api.building.stallApiEdit(params).then(
        res => {
          this.DE_Loding(loadingName).then(() => {
            if (res.data.code === "0") {
              this.$SG_Message.success("编辑车位成功");
              this.$router.push({
                path: "/buildingDict",
                query: { showKey: "stall", refresh: true }
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        },
        () => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error("编辑失败！");
          });
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.landInfo-create-page {
  position: relative;
  height: calc(100vh - 40px);
  overflow: hidden;
}

.create-form {
  padding: 42px 100px 70px 94px;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
