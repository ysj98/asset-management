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
                  <treeSelect
                      ref="organTopRef"
                      :default="false"
                      :typeFilter="typeFilter"
                      @changeTree="changeTree"
                      placeholder='请选择所属机构'
                      :defaultOrganName="formInfo.organId"
                      :style="allStyle"
                      :allowClear="false"
                      v-decorator="['organId',{initialValue: ''|| undefined, rules: [{ required: true, message: '请选择所属机构' }]}]"
                  >
                  </treeSelect>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场名称" :required="true" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      :maxLength="30"
                      v-decorator="[
                      'placeId',
                      {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请输入车场名称',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="区域名称" v-bind="formItemLayout">
                  <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                      @change="communityIdChange"
                      placeholder="请选择区域名称"
                      showSearch
                      optionFilterProp="children"
                      :options="$addTitle(communityIdOpt)"
                      :allowClear="false"
                      :filterOption="filterOption"
                      notFoundContent="没有查询到数据"
                      v-decorator="['parkingAreaId',{rules:[{required:true, message: '请选择区域名称'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="车位名称" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      :maxLength="30"
                      v-decorator="['name', { rules: [{ required: true, whitespace: true, message: '请输入土地名称'}]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位编码" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      :maxLength="30"
                      v-decorator="['code', {initialValue: '' || undefined, rules: [{ required: true, whitespace: true, message: '请输入土地名称'}]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="交付时间" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    placeholder="请选择开始时间"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['deliverDate',{initialValue: '' }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="车位用途" v-bind="formItemLayout">
                  <dict-select
                    :style="allWidth"
                    v-decorator="['parkingUsage',{initialValue: ''|| undefined ,rules: [{ required: true, message: '请选择车位用途' }]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位类型" v-bind="formItemLayout">
                  <dict-select
                    :style="allWidth"
                    v-decorator="['objType',{initialValue: ''|| undefined ,rules: [{ required: true, message: '请选择车位类型' }]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位状态" v-bind="formItemLayout">
                  <dict-select
                    :style="allWidth"
                    v-decorator="['objStatus',{initialValue: '' || undefined, rules: [{ required: true, message: '请选择车位状态' }]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="建筑面积(㎡)" v-bind="formItemLayout">
                  <a-input-number
                    :min="0"
                    :max="999999.9999"
                    :style="allWidth"
                    v-decorator="['propertyArea',{initialValue: ''|| undefined , rules: [{ required: true, message: '请输入建筑面积' }]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="使用面积(㎡)" v-bind="formItemLayout">
                  <a-input-number
                    :min="0"
                    :max="999999.9999"
                    :style="allWidth"
                    v-decorator="['useArea', {initialValue: ''|| undefined}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="公摊面积(㎡)" v-bind="formItemLayout">
                  <a-input-number
                      :min="0"
                      :max="999999.9999"
                      :style="allWidth"
                      v-decorator="['shareArea']"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="备注" v-bind="formItemLayout2">
                  <a-textarea
                      :maxLength="200"
                      v-decorator="['description', { initialValue: ''|| undefined }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="图片" v-bind="formItemLayout2">
                  <SG-UploadFile
                      :customDownload="customDownload"
                      :customUpload="customUpload"
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
                      :customDownload="customDownload"
                      :customUpload="customUpload"
                      type="all"
                      v-model="filePath"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-form>
    </div>
    <FormFooter style="border:none;">
      <SG-Button class="mr2" @click="handleSave" type="primary">提交</SG-Button>
      <SG-Button @click="handleCancel">取消</SG-Button>
    </FormFooter>
  </div>
</template>
<script>
import FormFooter from "@/components/FormFooter.vue"
import dictMixin from "../dictMixin.js"
import TreeSelect from "@/views/common/treeSelect";
import {typeFilter} from '@/views/buildingDict/buildingDictConfig';
import {queryTopOrganByOrganID} from "@/views/buildingDict/publicFn";
import { parkTypeOpt} from "./dict";
import DictSelect from "../../common/DictSelect";

const allWidth = { width: "100%" }
const allWidth1 = { width: "100px", marginRight: "10px", flex: "0 0 120px" }
const allWidth2 = { width: "250px", flex: 1 }
// 页面跳转
const operationTypes = {
  index: "/buildingDict",
}
export default {
  components: {
    DictSelect,
    FormFooter,
    TreeSelect
  },
  mixins: [dictMixin],
  data() {
    return {
      parkTypeOpt, // 全部车场
      formInfo: { // 表单
        organId: '', // '机构Id',
        placeId: '', // '车场Id',
        name: '', // '车位名称',
        code: '', // '车位编码',
        deliverDate: '2020-09-09',
        objType: '', // '车位类型',
        objStatus: '', // '车位状态',
        parkingUsage: '', //'车位用途',
        parkingAreaId: '', // '区域Id',
        useArea: '', // 使用面积
        shareArea: '',//'公摊面积',
        propertyArea: '',// '产权面积',
        parkingImg: '车位图片',
        description: '备注',
        parkingAreaUnits: '面积单位'
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
  beforeCreate() {
    this.form = this.$form.createForm(this)
    window.fff = this.form
  },
  mounted() {
    let { organName, organId, type, blankId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, organId, type, blankId },
    })
    this.init()
  },
  methods: {
    async changeTree(value){
      if (value) {
        this.initPreData();
        let {organId:organTopId} = await queryTopOrganByOrganID(
            {
              nOrgId: value,
              nOrganId: value,
            }
        )
        this.queryCommunityListByOrganId(organTopId)
        this.form.resetFields(['communityId', 'landType', 'landuseType', 'landuse'])
      }
    },
    // 确定
    handleSave() {
      this.form.validateFields((err, values) => {
        console.log(values)
      })
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: "/buildingDict", query: { showKey: "land" } })
    },
    // 请求土地详情
    async blankApiDetail() {
    },
    // 请求项目
    queryCommunityListByOrganId(organTopId) {
      let data = {
        organId: organTopId,
      }
      this.$api.basics.queryCommunityListByOrganId(data).then((res) => {
        if (res.data.code === "0") {
          let result = res.data.data || []
          let resultArr = result.map((item) => {
            return {
              label: item.name,
              value: item.communityId,
              ...item,
            }
          })
          this.communityIdOpt = resultArr
        }
      })
    },
    // 选择项目变化
    communityIdChange(e) {},
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
      )
    },
    getPopupContainer(e) {
      return e.parentElement
    },
    // 改变 所属机构时,做部分重置
    initPreData(){
    },
    // 初始化
    async init(){
      this.$nextTick(() => {
        this.form.setFieldsValue(this.formInfo)
      })
      // if (this.routeQuery.type === "edit") {
      //   await this.blankApiDetail()
      //   this.initPreData()
      // }
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
