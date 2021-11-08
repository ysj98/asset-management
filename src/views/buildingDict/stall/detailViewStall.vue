<!--
 * @Description: 新建 编辑车场
-->
<template>
  <div class="landInfo-create-page">
    <div class="create-form">
      <a-form :form="form" layout="horizontal">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
            <SG-Title noMargin title="基础信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item :required="true"  label="所属机构"  v-bind="formItemLayout">
                  <span>{{formInfo.organName}}</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场名称" :required="true" v-bind="formItemLayout">
                  <span>{{formInfo.placeName}}</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="区域名称" v-bind="formItemLayout">
                  <span>{{formInfo.parkingAreaName || '-'}}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="车位名称" v-bind="formItemLayout">
                  <span>{{formInfo.name || '-'}}</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位编码" v-bind="formItemLayout">
                  <p class="text-overflow">{{formInfo.code || '-'}}</p>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="交付时间" v-bind="formItemLayout">
                  <span>{{formInfo.deliverDate || '-'}}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="车位用途" v-bind="formItemLayout">
                  <span>{{formInfo.parkingUsage}}</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位类型" v-bind="formItemLayout">
                  <span>{{formInfo.objTypeName}}</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位状态" v-bind="formItemLayout">
                  <span>{{formInfo.objStatusName}}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="建筑面积(㎡)" v-bind="formItemLayout">
                  <span>{{formInfo.propertyArea || '-'}}</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="使用面积(㎡)" v-bind="formItemLayout">
                  <span>{{formInfo.useArea || '-'}}</span>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="公摊面积(㎡)" v-bind="formItemLayout">
                  <span>{{formInfo.shareArea || '-'}}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="备注" v-bind="formItemLayout2">
                  <div class="text-box">{{formInfo.description}}</div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="图片" v-bind="formItemLayout2">
                  <SG-UploadFile
                    :show="true"
                    v-model="formInfo.parkingImg"
                  />
                </a-form-item>
              </a-col>
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
import { parkTypeOpt} from "./dict";
import {stallApiDetail} from "../../../api/building";

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
        organId:  '',
        placeId:  '',
        name: '',
        code: '',
        deliverDate: '',
        objType: '',
        objTypeName: '',
        objStatus: '',
        objStatusName: '',
        parkingUsage: '',
        parkingAreaId: '',
        useArea: '',
        shareArea: '',
        propertyArea: '',
        parkingImg: [],
        description: '',
        parkingAreaUnits: ''
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
        type: "view", // 页面类型
        placeId: "",
        parkingId: '',
        organName: "",
        organId: "",
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
    let { organName, organId, type, placeId, parkingId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, organId, type, placeId, parkingId },
    })
    this.init()
  },
  methods: {
    async stallApiDetail (data) {
      const params = {
        ...data
      }
      const {data:res} = await stallApiDetail(params)
      if(res.code === '0') {
        this.formInfo = this.afterStallApiList(res.data)
      }
    },
    afterStallApiList (data) {
      return {
        ...data,
        organId: data.organId,
        parkingAreaId: data.parkingAreaId,
        placeId: data.placeId,
        parkingImg: (data.parkingImg || "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))
      }
    },
    // 初始化
    async init(){
      let loadingName = this.SG_Loding("加载中...")
      try {
        await this.stallApiDetail({placeId: this.routeQuery.placeId, parkingId: this.routeQuery.parkingId})
      } finally {
        this.DE_Loding(loadingName)
      }
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
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
}
.text-box {
  white-space: pre-line;
  word-break: break-all;
  word-wrap: break-word;
  padding-top: 10px;
  line-height: 16px;
}
</style>
