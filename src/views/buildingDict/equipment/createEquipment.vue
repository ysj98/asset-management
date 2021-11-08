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
                    :defaultOrganName="formInfo.topOrganName"
                    :style="allStyle"
                    :allowClear="false"
                    v-decorator="['topOrganId',{initialValue: ''|| undefined, rules: [{ required: true, message: '请选择所属机构' }]}]"
                  >
                  </treeSelect>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="设备设施分类" :required="true" v-bind="formItemLayout">
                  <equipment-select-tree
                    :width="'100%'"
                    placeholder="请选择设备设施分类"
                    :default-name="formInfo.equipmentName"
                    :topOrganId="topOrganId || ''"
                    @change="handleRquipmentChange"
                    v-decorator="['equipmentId',{initialValue: undefined, rules: [ {required: true, message: '请选择设备设施分类'}]}]"/>
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
                    v-decorator="['equipmentInstCode', { rules: [{ required: true, whitespace: true, message: '请输入设备设施编码'}]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="运营项目" v-bind="formItemLayout">
<!--                  {{form.getFieldValue('organId')}}-->
                  <a-select
                    showSearch
                    :style="allWidth"
                    :allowClear="false"
                    :loading="communityIdFlag"
                    placeholder="请选择项目"
                    v-decorator="['communityId']"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    optionFilterProp="children"
                    @change="handleCommunityIdChange"
                    :getPopupContainer="getPopupContainer"
                    :options="$addTitle(communityIdOpt)"
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
                  <equipment-position-select-tree
                    :community-id="form.getFieldValue('communityId')"
                    :defaultName="formInfo.equipmentAreaName"
                    style="width: 28.5%;margin-right: 2%;"
                    v-decorator="['equipmentAreaId']"/>
<!--                  <equipment-select-->
<!--                    placeholder="请选择位置"-->
<!--                    :defaultName="formInfo.equipmentAreaName"-->
<!--                    :community-id="form.getFieldValue('communityId')"-->
<!--                    style="width: 28.5%;margin-right: 2%;"-->
<!--                    v-decorator="['equipmentAreaId']"/>-->
                  <a-input
                    style="width: 55.5%;"
                    :maxLength="100"
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
                    placeholder="请输入品牌"
                    v-decorator="['equipmentInstBrand',{initialValue: ''|| undefined }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="供应商" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    :loading="supplierLoadingFlag"
                    @focus="handleSupplierFocus"
                    :options="$addTitle(supplierListOpt)"
                    :default-active-first-option="false"
                    v-decorator="['equipmentSupplierId']"
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
                    v-decorator="['equipmentFactory', {initialValue: ''}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="出厂日期" v-bind="formItemLayout">
                   <a-date-picker
                     :style="allWidth"
                     valueFormat="YYYYMMDD"
                     placeholder="请选择出厂日期"
                     :getPopupContainer="getPopupContainer"
                      v-decorator="['factoryDate', {initialValue: form.getFieldValue('factoryDate')}]"
                   />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="报废日期" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    valueFormat="YYYYMMDD"
                    placeholder="请选择报废日期"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['expDate', {initialValue: undefined}]"
                  />
                </a-form-item>
                </a-col>
              <a-col :span="8">
                <a-form-item label="安装日期" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    valueFormat="YYYYMMDD"
                    placeholder="请选择安装日期"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['installDate', {initialValue: undefined}]"
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
                    :customUpload="customUpload"
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
                    :max="5"
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
import EquipmentSelect from "../../common/EquipmentSelect";
import EquipmentSelectTree from "../../common/EquipmentSelectTree";
import EquipmentPositionSelectTree from "../../common/EquipmentPositionSelectTree";
import {
  getEquipmentSupplierListByOrganId,
  getInfoAttrListByEquipmentId,
} from "../../../api/building";
import moment from "moment";
//
const allWidth = { width: "100%" }
const allWidth1 = { width: "100px", marginRight: "10px", flex: "0 0 120px" }
const allWidth2 = { width: "250px", flex: 1 }
// 页面跳转
const operationTypes = {
  index: "/buildingDict",
}
export default {
  components: {
    EquipmentSelectTree,
    EquipmentSelect,
    DictSelect,
    FormFooter,
    TreeSelect,
    EquipmentPositionSelectTree
  },
  mixins: [dictMixin],
  data() {
    return {
      parkTypeOpt, // 全部车场
      formInfo: { // 表单
        topOrganName: '',
        imgPath: [], // 图片
        documentPath: [], // 附件
        attrList:[],
        equipmentAreaName: '', // 所在位置名称
      },
      topOrganId: '',
      allStyle: 'width: 100%;',
      typeFilter,
      allWidth,
      allWidth1,
      allWidth2,
      communityIdFlag: false, // 项目刷新
      communityIdOpt: [], // 选择项目
      supplierLoadingFlag: false, // 查询供应商字典loading
      supplierListOpt: [], // 供应商
      routeQuery: {
        // 路由传入数据
        type: "create", // 页面类型
        equipmentInstId: "",
        organName: "",
        topOrganId: "",
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
    let { organName, topOrganId, type, equipmentInstId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, topOrganId, type, equipmentInstId },
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
        this.topOrganId = organTopId
        this.queryCommunityListByOrganId(organTopId)
        this.getEquipmentSupplierListByOrganId(value)
        // 清除数据
        this.formInfo.equipmentName = ''
        this.formInfo.equipmentAreaName = ''
        this.form.resetFields(['communityId', 'equipmentId', 'equipmentAreaId', 'equipmentAreaId', 'equipmentSupplierId'])
      }
    },
    // 确定
    handleSave() {
      this.form.validateFields(async (err, values) => {
        if(!err) {
          const params = await this.beforeEquipment(values)
          if (this.routeQuery.type == 'edit') {
            this.equipmentApiEdit(params)
          } else {
            this.equipmentApiInsert(params)
          }
        }
      })
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: "/buildingDict", query: { showKey: "equipment" } })
    },
    // 供应商焦点事件
    async handleSupplierFocus ()  {
      this.supplierLoadingFlag = true
      try {
        let organId
        if (this.form.getFieldValue('communityId')) {
          organId = await this.queryOrganIdByCommunityId(this.form.getFieldValue('communityId'))
          if (!organId) {
            return;
          }
        }
        await this.getEquipmentSupplierListByOrganId(organId)
      } finally {
        this.supplierLoadingFlag = false
      }
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
    handleCommunityIdChange(e) {
      this.formInfo.equipmentAreaName = ''
      this.form.resetFields(['equipmentAreaId', 'equipmentSupplierId'])
    },
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
    handleRquipmentChange (val) {
      if(val){
        this.getInfoAttrListByEquipmentId()
      }
    },
    // 初始化时调用此接口查询运营项目
    async preGetCommunityIdByOrganId (organId) {
      let {organId:organTopId} = await queryTopOrganByOrganID(
          {
            nOrgId: organId,
            nOrganId: organId,
          }
      )
      this.topOrganId = organTopId
      this.queryCommunityListByOrganId(organTopId)
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
        topOrganId: this.routeQuery.topOrganId,
        systemCode: 'assets'
      }
      let loadingName = this.SG_Loding("加载中...");
      try {
        const {data: res} = await this.$api.building.equipmentApiDetail(params)
        if (String(res.code) === "0") {
          this.form.setFieldsValue(this.afterEquipmentApiDetail(res.data));
        }
      } finally {
        this.DE_Loding(loadingName);
      }
    },
    afterEquipmentApiDetail(data) {
      const fileList = data.fileList || []
      this.formInfo.topOrganName = data.topOrganName
      this.formInfo.equipmentName = data.equipmentName
      this.formInfo.equipmentAreaName = data.equipmentAreaName
      data.communityId = data.communityId || ''
      // this.communityIdOpt =[{label: String(data.organName), value: data.communityId}]
      this.preGetCommunityIdByOrganId(data.topOrganId)
      data.communityId = String (data.communityId)
      // 转换时间
      {
        if (data.expDate) {
          data.expDate = moment(data.expDate * 1000).format('YYYYMMDD')
        } else {
          data.expDate = ''
        }
        if (data.installDate) {
          data.installDate = moment(data.installDate * 1000 ).format('YYYYMMDD')
        } else {
          data.installDate = ''
        }
        if (data.factoryDate) {
          data.factoryDate = moment(data.factoryDate*1000).format('YYYYMMDD')
        } else {
          data.factoryDate = ''
        }
      }

      this.supplierListOpt = [{label: data.equipmentSupplierName, value: data.equipmentSupplierId}]
      // this.formInfo.imgPath = (data.imgPath || "").split(",").filter(item => item).map(item => ({ url: item, name: item.split("/").pop()}));
      // this.formInfo.documentPath = (data.documentPath || "").split(",").filter(item => item).map(item => ({ url: item, name: item.split("/").pop()}));
      // 转换图片
      this.formInfo.imgPath = fileList.filter(item=>Number(item.fileType) === 1).map(item=>({url:item.filePath,name:item.fileName}))
      // 转换附件
      this.formInfo.documentPath = fileList.filter(item=>Number(item.fileType) === 2).map(item=>({url: item.filePath,name: item.fileName}))
      // 合并数据
      this.formInfo.attrList = data.attrList || []
      return {
        ...data,
        equipmentSupplierId: data.equipmentSupplierId || '',
        expDate: String(data.expDate),
        factoryDate: String(data.factoryDate),
        installDate: String(data.installDate)
      }
    },
    async beforeEquipment (data) {
      let organId
      if (data.communityId) {
        organId = await this.queryOrganIdByCommunityId(data.communityId)
        if (!organId) {
          return;
        }
      }
      const params = Object.assign({},data)
      if (params.expDate) {
        params.expDate = moment(params.expDate, '"YYYYMMDD').valueOf() / 1000
      }
      if (params.installDate) {
        params.installDate = moment(params.installDate, 'YYYYMMDD').valueOf() / 1000
      }
      if (params.factoryDate) {
        params.factoryDate = moment(params.factoryDate, 'YYYYMMDD').valueOf() / 1000
      }
      const fileList = [
        ...(this.formInfo.imgPath|| []).map(item => ({...item,fileType: 1})),
        ...(this.formInfo.documentPath|| []).map(item => ({...item,fileType: 2}))
      ].map(item => ({
        fileSize: 0,
        fileName: item.name,
        filePath: item.url,
        fileType: item.fileType
      }))

      const returnData = {
        ...params,
        organId,
        fileList,
        systemCode:'assets',
        attrList: this.formInfo.attrList,
        equipmentInstId:this.routeQuery.equipmentInstId,
        imgPath: (this.formInfo.imgPath || []).map(node => node.url).join(","),
        documentPath: (this.formInfo.documentPath || []).map(node => node.url).join(","),
      }

      delete returnData.imgPath
      delete returnData.documentPath

      return returnData
    },
    // 插入
    async equipmentApiInsert (params) {
      let loadingName = this.SG_Loding("新增中...");
      try {
        const data = {...params}
        const {data: res} = await this.$api.building.equipmentApiInsert(data)
        this.DE_Loding(loadingName).then(() => {
          if (String(res.code) === "0") {
            this.$SG_Message.success("新增成功");
            this.$router.push({
              path: "/buildingDict",
              query: { showKey: "equipment", refresh: true }
            });
          } else {
            this.$SG_Message.error(res.message);
          }
        });
      } catch (e) {
        this.DE_Loding(loadingName).then(() => {
          this.$SG_Message.error("新增失败！");
        });
      } finally {
        this.DE_Loding(loadingName)
      }
    },
    // 编辑
    async equipmentApiEdit (params) {
      let loadingName = this.SG_Loding("编辑中...");
      try {
        const data = {...params}
        data.equipmentInstId = this.routeQuery.equipmentInstId
        const {data: res} = await this.$api.building.equipmentApiEdit(data)
        this.DE_Loding(loadingName).then(() => {
          if (String(res.code) === "0") {
            this.$SG_Message.success("编辑成功");
            this.$router.push({
              path: "/buildingDict",
              query: { showKey: "equipment", refresh: true }
            });
          } else {
            this.$SG_Message.error(res.message);
          }
        });
      } catch (e) {
        this.DE_Loding(loadingName).then(() => {
          this.$SG_Message.error("编辑失败！");
        });
      } finally {
        this.DE_Loding(loadingName)
      }
    },
    // 根据组织机构id查询分类编码表
    async queryOrganIdByCommunityId (communityId) {
      const {data: res} = await this.$api.building.queryOrganIdByCommunityId({communityId})
      if (String(res.code) === '0') {
        return res.data
      } else {
        this.$SG_Message.error(res.message)
      }
      return false
    },
    // 获取供应商
    async getEquipmentSupplierListByOrganId (organId) {
      const params = {
        systemCode: 'assets',
        organId: organId
      }
      const {data: res} = await getEquipmentSupplierListByOrganId(params)
      if (String(res.code) === '0') {
        this.supplierListOpt = (res.data.resultList || []).map(item => ({label: item.equipmentSupplierName, value: item.equipmentSupplierId}))
      } else {
        this.$message.error(res.message)
      }
    },
    // 根据组织机构id和设备分类id查询其它属性
    async getInfoAttrListByEquipmentId () {
      try {
        const organId = this.form.getFieldValue('topOrganId')
        const equipmentId = this.form.getFieldValue('equipmentId')
        if (!equipmentId || !organId) {
          return
        }
        const params = {
          organId,
          equipmentId
        }
        this.formInfo.attrList = []
        const {data: res} = await getInfoAttrListByEquipmentId(params)
        if (Number(res.code) === 0) {
          console.log('getInfoAttrListByEquipmentId',res)
          this.formInfo.attrList = res.data.resultList || []
          return
        }
        this.$SG_Message.error(res.message)
      } catch {
        this.$SG_Message.error("系统异常")
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
