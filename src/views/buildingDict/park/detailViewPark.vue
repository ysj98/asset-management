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
                <a-form-item label="所属机构"  v-bind="formItemLayout">
                  {{formInfo.organId}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场名称" v-bind="formItemLayout">
                  {{formInfo.placeName}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场编码" v-bind="formItemLayout">
                  {{formInfo.placeCode}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="运营项目" v-bind="formItemLayout">
                  {{formInfo.communityId}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场面积(㎡)" v-bind="formItemLayout">
                  {{formInfo.placeArea}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位数量" v-bind="formItemLayout">
                  {{formInfo.placeNums}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <a-form-item label="地理位置" v-bind="formItemLayoutGeo">
                  <div class="address-box">
                    {{formInfo.province}}-{{city}}-{{region}}-{{address}}
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="经纬度" v-bind="formItemLayout">
                  {{formInfo.lngAndlat}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="车场类型" v-bind="formItemLayout">
                  {{formInfo.typeId}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="备注" v-bind="formItemLayout2">
                  {{formInfo.description}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="图片" v-bind="formItemLayout2">
                  <SG-UploadFile
                      :show="true"
                      v-model="redMap"
                      :max="1"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="附件" v-bind="formItemLayout2">
                  <SG-UploadFile
                      :show="true"
                      v-model="filePath"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="mb30">
            <SG-Title noMargin title="区域信息" />
            <a-row>
              <a-col :span="23" :offset="1">
                <a-form-item label="" v-bind="formItemLayoutTable">
                  <a-table :columns="areaTitle.filter(item=>item.dataIndex !=='operation')" :pagination="false" bordered :data-source="formInfo.areaArray">
                    <template v-for="com in areaTitle.filter(item=>item.dataIndex !=='operation')" :slot="com.dataIndex" slot-scope="item, record, index">
                      <div :key="com.dataIndex">
                        <a-form-item style="margin: -5px;">
                          <span v-if="['text', 'input'].includes(com.component)">{{ item }}</span>
                          <div style="transform: scale(0.8)" v-else-if="com.component ==='image'">
                            <SG-UploadFile
                                :show="true"
                                v-model="filePath"
                            >
                              <span slot="tips"></span>
                            </SG-UploadFile>
                          </div>
                        </a-form-item>
                      </div>
                    </template>
                  </a-table>
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
import {areaTitle} from "./dict";

// 页面跳转
const operationTypes = {
  index: "/buildingDict",
}
const tableDataTemplate = {
  areaName:'132123', // 名称
  areaCode:'编码', // 编码
  areaZone:'1111222', // 面积
  areaPosiNums: '9999', // 车位数
  areaParkingImg: '', //
  areaOtherImg: '', // 图片
  areaDescription:'描述' // 描述
}
export default {
  mixins: [dictMixin],
  data() {
    return {
      areaTitle, // 区域信息表头
      formInfo: { // 表单
        organId:'9999', // 组织机构ID
        communityId: '66666', // 项目Id
        placeName: '111111', // 车场名称
        placeCode: '车场编码', // 车场编码
        placeArea: 11111122,// 车场面积
        placeAreaUnit: '车场面积单位', // 车场面积单位
        placeNums: 9999, // 车位数量
        typeId: '9999', // 车厂类型Id
        placeAddr: '车厂地址', // 车厂地址
        carPlaceImg: '', // 车场平面图
        otherImg: '', // 其它图片
        description: '备注', // 备注
        areaArray: [{
          areaName:'132123', // 名称
          areaCode:'编码', // 编码
          areaZone:'1111222', // 面积
          areaPosiNums: '9999', // 车位数
          areaParkingImg: '', //
          areaOtherImg: '', // 图片
          areaDescription:'描述', // 描述
          key: Math.random()
        }]
      },
      allStyle: 'width: 100%;',
      typeFilter,
      region: undefined, // 区/县
      city: undefined, // 市
      address: "", // 详细地址
      provinceOpt: [], // 省
      cityOpt: [], // 市
      regionOpt: [], // 区/县
      point: {
        // 经纬度
        lng: "",
        lat: "",
      },
      communityIdOpt: [], // 选择项目
      landTypeOpt: [], // 房屋类型
      redMap: [], // 用地红线图
      encloseWallPic: [], // 围墙图片
      nowPic: [], // 现状图片
      filePath: [], // 附件
      routeQuery: {
        // 路由传入数据
        type: "create", // 页面类型
        blankId: "",
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
  mounted() {
    this.init()
  },
  methods: {
    // 请求土地详情
    async blankApiDetail() {
    },
    // 初始化
    async init(){

    },
    /*******************************/
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
