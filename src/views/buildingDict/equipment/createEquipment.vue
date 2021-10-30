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
<!--                      :defaultOrganName="formInfo.organName"-->
                  <treeSelect
                      ref="organTopRef"
                      :default="false"
                      :typeFilter="typeFilter"
                      @changeTree="changeTree"
                      placeholder='请选择所属机构'
                      :style="allStyle"
                      :allowClear="false"
                      v-decorator="['topOrganId',{initialValue: ''|| undefined, rules: [{ required: true, message: '请选择所属机构' }]}]"
                  >
                  </treeSelect>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="设备设施分类" :required="true" v-bind="formItemLayout">
                  <equipment-select
                    :organId="form.getFieldValue('organId')"
                    v-decorator="['equipmentId',{initialValue: undefined, rules: [ {required: true, message: '请选择设备设施分类'}]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="设备设施名称" v-bind="formItemLayout">
                  <a-input
                    :style="allWidth"
                    :maxLength="30"
                    placeholder="请输入设备设施名称"
                    v-decorator="['equipmentInstName', {initialValue: ''|| undefined, rules: [{ required: true, whitespace: true, message: '请输入设备设施名称'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="设备设施编码" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      :maxLength="30"
                      placeholder="请输入设备设施编码"
                      v-decorator="['equipmentInstCode', { rules: [{ required: true, whitespace: true, message: '请输入土地名称'}]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="运营项目" v-bind="formItemLayout">
                  <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                      placeholder="请选择项目"
                      showSearch
                      optionFilterProp="children"
                      :options="$addTitle(communityIdOpt)"
                      :allowClear="false"
                      :filterOption="filterOption"
                      notFoundContent="没有查询到数据"
                      v-decorator="['organId']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="规格型号" v-bind="formItemLayout">
                  <a-input
                    :style="allWidth"
                    :maxLength="30"
                    placeholder="请输入规格型号"
                    v-decorator="['equipmentInstModel', {initialValue: '' || undefined, rules: [{ message: '请输入规格型号'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <a-form-item label="所在位置" v-bind="formItemLayoutGeo">
                  <a-input
                      style="width: 28.5%;margin-right: 2%;"
                      :maxLength="30"
                      placeholder="请选择位置"
                      v-decorator="['equipmentAreaId']"
                  />
                  <a-input
                      style="width: 55.5%;"
                      :maxLength="30"
                      placeholder="请输入详细地址"
                      v-decorator="['position']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="品牌" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      :maxLength="30"
                      placeholder="请输入供应商"
                      v-decorator="['equipmentInstBrand',{initialValue: ''|| undefined }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="供应商" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      :maxLength="30"
                      placeholder="请输入供应商"
                      v-decorator="['equipmentSupplierId',{initialValue: ''|| undefined , rules: [{ message: '请选择供应商' }]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="生产厂家" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      style="width: 55.5%;"
                      :maxLength="30"
                      placeholder="请输入生产厂家"
                      v-decorator="['equipmentFactory', {initialValue: '',}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="出厂日期" v-bind="formItemLayout">
                   <a-date-picker
                     :style="allWidth"
                     placeholder="请选择出厂日期"
                     :getPopupContainer="getPopupContainer"
                      v-decorator="['factoryDate',{initialValue: ''}]"
                   />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="报废日期" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    placeholder="请选择报废日期"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['expDate',{initialValue: '', }]"
                  />
                </a-form-item>
                </a-col>
              <a-col :span="8">
                <a-form-item label="安装日期" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    placeholder="请选择安装日期"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['installDate',{initialValue: ''}]"
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
                      v-decorator="['equipmentInstDesc', { initialValue: ''|| undefined }]"
                  />
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
                      :customDownload="customDownload"
                      :customUpload="customUpload"
                      v-model="formInfo.imgPath"
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
                    <a-input
                        :style="allWidth"
                        :maxLength="30"
                        :placeholder="'请输入' + item.attrName"
                        v-model="item.attrValue"
                    />
                  </a-form-item>
                </a-col>
                </template>
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
import {equipmentApiEdit, getEquipmentCodeList} from "../../../api/building";
import EquipmentSelect from "../../common/EquipmentSelect";

const allWidth = { width: "100%" }
const allWidth1 = { width: "100px", marginRight: "10px", flex: "0 0 120px" }
const allWidth2 = { width: "250px", flex: 1 }
// 页面跳转
const operationTypes = {
  index: "/buildingDict",
}
export default {
  components: {
    EquipmentSelect,
    DictSelect,
    FormFooter,
    TreeSelect
  },
  mixins: [dictMixin],
  data() {
    return {
      parkTypeOpt, // 全部车场
      formInfo: { // 表单
        organName: '',
        imgPath: [], // 图片
        documentPath: [], // 附件
        attrList:[]
      },
      allStyle: 'width: 100%;',
      typeFilter,
      allWidth,
      allWidth1,
      allWidth2,
      communityIdOpt: [], // 选择项目
      routeQuery: {
        // 路由传入数据
        type: "create", // 页面类型
        equipmentInstId: "",
        organName: "",
        organId: "",
      },
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
  },
  mounted() {
    let { organName, organId, type, equipmentInstId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, organId, type, equipmentInstId },
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
        if(!err) {
          const params = this.beforeEquipment(values)
          this.equipmentApiEdit(params)
        }
      })
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: "/buildingDict", query: { showKey: "equipment" } })
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
      if (this.routeQuery.type === "edit") {
        await this.equipmentApiDetail()
        this.initPreData()
      }
    },
    /* **************************************************** */
    // 请求详情
    async equipmentApiDetail() {
      const params = {
        equipmentInstId: this.routeQuery.equipmentInstId,
        organId: this.routeQuery.organId
      }
      let loadingName = this.SG_Loding("加载中...");
      try {
        const {data: res} = await this.$api.building.equipmentApiDetail(params)
        if (String(res.code) === "0") {
          this.form.setFieldsValue(this.afterequipmentApiDetail(res.data));
        }
      } finally {
        this.DE_Loding(loadingName);
      }
    },
    afterequipmentApiDetail(data) {
      this.formInfo.organName = data.organName
      return {
        ...data
      }
    },
    beforeEquipment (data) {
      return {
        ...data,
        equipmentInstId:this.routeQuery.equipmentInstId,
        systemCode:'assets',
        attrList: this.formInfo.attrList
      }
    },
    async equipmentApiEdit (params) {
      let loadingName = this.SG_Loding("编辑中...");
      try {
        const {data: res} = await this.$api.building.equipmentApiEdit(params)
        this.DE_Loding(loadingName).then(() => {
          if (res.code === "0") {
            this.$SG_Message.success("编辑车位成功");
            this.$router.push({
              path: "/buildingDict",
              query: { showKey: "equipment", refresh: true }
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
      } catch (e) {
        this.DE_Loding(loadingName).then(() => {
          this.$SG_Message.error("编辑失败！");
        });
      } finally {
        this.DE_Loding(loadingName)
      }
    }

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
