<!--
 * @Description: 新建 编辑车场
-->
<template>
  <div class="landInfo-create-page">
    <div class="create-form">
      <a-form :form="form" @submit="handleSave" layout="horizontal">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
            <SG-Title noMargin title="基础信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item :required="true"  label="所属机构"  v-bind="formItemLayout">
                  {{formInfo.topOrganName}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="设备设施分类" :required="true" v-bind="formItemLayout">
                  {{formInfo.equipmentName}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="设备设施名称" v-bind="formItemLayout">
                  {{formInfo.equipmentInstName}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="设备设施编码" v-bind="formItemLayout">
                  {{formInfo.equipmentInstCode}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="运营项目" v-bind="formItemLayout">
                  {{formInfo.organName}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="规格型号" v-bind="formItemLayout">
                  {{formInfo.equipmentInstModel}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <a-form-item label="所在位置" v-bind="formItemLayoutGeo">
                  {{formInfo.equipmentAreaName}}-{{formInfo.position}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="品牌" v-bind="formItemLayout">
                  {{formInfo.equipmentInstBrand}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="供应商" v-bind="formItemLayout">
                  {{formInfo.equipmentSupplierName}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="生产厂家" v-bind="formItemLayout">
                  {{formInfo.equipmentFactory}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="出厂日期" v-bind="formItemLayout">
                  {{formInfo.factoryDate}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="报废日期" v-bind="formItemLayout">
                  {{formInfo.expDate}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="安装日期" v-bind="formItemLayout">
                  {{formInfo.installDate}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="备注" v-bind="formItemLayout2">
                  {{formInfo.equipmentInstDesc}}
                </a-form-item>
              </a-col>
            </a-row>
            <div class="mb30">
              <SG-Title noMargin title="图片&附件" />
            </div>
            <a-row>
              <a-col :span="24">
                <a-form-item label="图片" v-bind="formItemLayout2">
                  <SG-UploadFile
                    :show="true"
                    v-model="formInfo.imgPath"
                    :max="5"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="附件" v-bind="formItemLayout2">
                  <SG-UploadFile
                    type="all"
                    :show="true"
                    :customUpload="customUpload"
                    v-model="formInfo.documentPath"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <div class="mb30">
              <SG-Title noMargin title="其它属性" />
            </div>
            <a-row>
              <template v-for="item of formInfo.attrList">
                <a-col :span="8" :key="item.attrId">
                  <a-form-item :label="item.attrName" v-bind="formItemLayout">
                    {{item.attrValue}}
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
          </div>
        </div>
      </a-form>
    </div>

  </div>
</template>
<script>
import dictMixin from "../dictMixin.js"
import {typeFilter} from '@/views/buildingDict/buildingDictConfig';
import {queryTopOrganByOrganID} from "@/views/buildingDict/publicFn";
import {parkTypeOpt, timeStampToFormatDate} from "./dict";
import moment from "moment";

const allWidth = { width: "100%" }
const allWidth1 = { width: "100px", marginRight: "10px", flex: "0 0 120px" }
const allWidth2 = { width: "250px", flex: 1 }
// 页面跳转
const operationTypes = {
  index: "/buildingDict",
}
export default {
  mixins: [dictMixin],
  data() {
    return {
      parkTypeOpt, // 全部车场
      formInfo: { // 表单
        imgPath: [],
        documentPath: []
      },
      allStyle: 'width: 100%;',
      typeFilter,
      allWidth,
      allWidth1,
      allWidth2,
      communityIdOpt: [], // 选择项目
      landTypeOpt: [], // 房屋类型
      redMap: [], // 用地红线图
      encloseWallPic: [], // 围墙图片
      nowPic: [], // 现状图片
      filePath: [], // 附件
      routeQuery: {
        // 路由传入数据
        type: "create", // 页面类型
        equipmentInstId: "",
        organName: "",
        topOrganId: "",
      },
      bussType: "blankDir",
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
      formItemLayout2: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
      formItemLayoutTable: {
        labelCol: {
          xs: { span: 0 },
          sm: { span: 0 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 22 },
        },
      },
      formItemLayoutGeo: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 21 },
        },
      },
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    window.fff = this.form
  },
  mounted() {
    let { organName, topOrganId, type, equipmentInstId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, topOrganId, type, equipmentInstId },
    })
    this.init()
  },
  methods: {
    // 请求详情
    async equipmentApiDetail() {
      const params = {
        equipmentInstId: this.routeQuery.equipmentInstId,
        topOrganId: this.routeQuery.topOrganId,
        systemCode: 'assets'
      }
      let loadingName = this.SG_Loding("加载中...");
      try {
        const {data: res} = await this.$api.building.equipmentApiDetail(params)
        if (String(res.code) === "0") {
          this.formInfo = this.afterEquipmentApiDetail(res.data);
        }
      } finally {
        this.DE_Loding(loadingName);
      }
    },
    afterEquipmentApiDetail(data) {
      const fileList = data.fileList || []
      if (data.expDate) {
        data.expDate = timeStampToFormatDate(data.expDate)
      } else {
        data.expDate = ''
      }
      if (data.installDate) {
        data.installDate = timeStampToFormatDate(data.installDate )
      } else {
        data.installDate = ''
      }
      if (data.factoryDate) {
        data.factoryDate = timeStampToFormatDate(data.factoryDate)
      } else {
        data.factoryDate = ''
      }
      return {
        ...data,
        imgPath: fileList.filter(item=>Number(item.fileType) === 1).map(item=>({url:item.filePath,name:item.fileName})),
        documentPath: fileList.filter(item=>Number(item.fileType) === 2).map(item=>({url:item.filePath,name:item.fileName}))
      }
    },
    // 初始化
    init(){
      this.equipmentApiDetail()
    },
  },
}
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
