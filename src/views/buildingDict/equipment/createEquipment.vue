<template>
  <div class="landInfo-create-page">
    <div class="create-form">
      <a-form-model ref="form" :rules="rules" :model="formInfo" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
            <SG-Title noMargin title="基础信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-model-item :required="true"  label="所属机构"  prop="topOrganId">
                  <tree-select
                      ref="organTopRef"
                      :default="false"
                      @changeTree="changeTree"
                      :typeFilter="typeFilter"
                      placeholder='请选择所属机构'
                      :defaultOrganName="formInfo.topOrganName"
                      :style="allWidth"
                      :allowClear="false"
                      v-model="formInfo.topOrganId"
                  >
                  </tree-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="设备设施分类" :required="true" prop="equipmentId">
                  <equipment-select-tree
                      :width="'100%'"
                      placeholder="请选择设备设施分类"
                      @change="handleRquipmentChange"
                      :default-name="formInfo.equipmentName"
                      :topOrganId="topOrganId || ''"
                      v-model="formInfo.equipmentId"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="设备设施名称" prop="equipmentInstName">
                  <a-input
                      :style="allWidth"
                      :maxLength="64"
                      placeholder="请输入设备设施名称"
                      v-model="formInfo.equipmentInstName"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="设备设施编码" :required="true" prop="equipmentInstCode">
                  <a-input
                      :style="allWidth"
                      :maxLength="64"
                      placeholder="请输入设备设施编码"
                      v-model="formInfo.equipmentInstCode"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="运营项目" prop="communityId">
                  <a-select
                      showSearch
                      :style="allWidth"
                      :allowClear="false"
                      :loading="communityIdFlag"
                      placeholder="请选择项目"
                      v-model="formInfo.communityId"
                      notFoundContent="没有查询到数据"
                      optionFilterProp="children"
                      @change="handleCommunityIdChange"
                      :options="$addTitle(communityIdOpt)"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="规格型号">
                  <a-input
                      :style="allWidth"
                      :maxLength="64"
                      placeholder="请输入规格型号"
                      v-model="formInfo.equipmentInstModel"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16" style="display: flex">
                <div style="width: 10.7%;text-align: right; line-height: 40px; padding-right: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.85);">地理位置:</div>
                <div style="width: 89.3%">
                <equipment-position-select-tree
                  :community-id="formInfo.communityId"
                  :defaultName="formInfo.equipmentAreaName"
                  style="width: 32.5%;margin-right: 2%;"
                  v-model="formInfo.equipmentAreaId"/>
                  <a-input
                    style="width: 53.7%;"
                    :maxLength="64"
                    placeholder="请输入详细地址"
                    v-model="formInfo.position"
                  />
                </div>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="品牌">
                  <a-input
                      :style="allWidth"
                      :maxLength="64"
                      placeholder="请输入品牌"
                      v-model="formInfo.equipmentInstBrand"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="供应商">
                  <a-select
                      :style="allWidth"
                      placeholder="请选择供应商"
                      :loading="supplierLoadingFlag"
                      :options="$addTitle(supplierListOpt)"
                      :default-active-first-option="false"
                      v-model="formInfo.equipmentSupplierId"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="生产厂家">
                  <a-input
                      :style="allWidth"
                      style="width: 55.5%;"
                      :maxLength="64"
                      placeholder="请输入生产厂家"
                      v-model="formInfo.equipmentFactory"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="出厂日期">
                  <a-date-picker
                      :style="allWidth"
                      valueFormat="YYYYMMDD"
                      placeholder="请选择出厂日期"
                      v-model="formInfo.factoryDate"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="报废日期" >
                  <a-date-picker
                      :style="allWidth"
                      valueFormat="YYYYMMDD"
                      placeholder="请选择报废日期"
                      v-model="formInfo.expDate"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="安装日期">
                  <a-date-picker
                      :style="allWidth"
                      valueFormat="YYYYMMDD"
                      placeholder="请选择安装日期"
                      v-model="formInfo.installDate"
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
                    :maxLength="512"
                    placeholder="请输入备注"
                    v-model="formInfo.equipmentInstDesc"
                  />
                </div>
              </a-col>
            </a-row>
            <div class="mb30">
              <SG-Title noMargin title="图片&附件" />
            </div>
            <a-row>
              <a-col :span="24" style="display: flex">
                <div style="width: 7%;text-align: right; line-height: 40px; padding-right: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.85);">图片:</div>
                <div style="width: 86%">
                  <SG-UploadFile
                    :customUpload="customUpload"
                    v-model="formInfo.imgPath"
                    :max="10"
                    :maxSize="2048"
                  >
                    <span slot="tips">(注：上传的图片最多为 10 张,且图片大小小于2M)</span>
                  </SG-UploadFile>
                </div>
                </a-col>
            </a-row>
            <a-row>
              <a-col :span="24" style="display: flex">
                <div style="width: 7%;text-align: right; line-height: 40px; padding-right: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.85);">附件:</div>
                <div style="width: 86%">
                  <SG-UploadFile
                    type="all"
                    :max="20"
                    :customUpload="customUpload"
                    v-model="formInfo.documentPath"
                    :maxSize="2048"
                  >
                    <span slot="tips">(注：上传的文件最多为 20 个,且文件大小小于2M)</span>
                  </SG-UploadFile>
                </div>
              </a-col>
            </a-row>
            <div class="mb30">
              <SG-Title noMargin title="其它属性" />
            </div>
            <a-row>
              <template v-for="item of formInfo.attrList">
                <a-col :span="8" :key="item.attrId">
                  <a-form-item :label="item.attrName">
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
      </a-form-model>
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
import EquipmentSelect from "../../common/EquipmentSelect.vue";
import EquipmentSelectTree from "../../common/EquipmentSelectTree.vue";
import EquipmentPositionSelectTree from "../../common/EquipmentPositionSelectTree";
import {
  getEquipmentSupplierListByOrganId,
  getInfoAttrListByEquipmentId,
} from "../../../api/building";
import moment from "moment";
import {equipmentFileUpload} from "../../../api/basics";
export default {
  components: {EquipmentSelectTree, EquipmentSelect, EquipmentPositionSelectTree , FormFooter, TreeSelect},
  mixins: [dictMixin],
  data:()=>({
    formInfo:{
      bussType: "equipmentDir",
      topOrganName: '',
      equipmentName: '',
      equipmentId: undefined,
      equipmentAreaId: undefined,
      equipmentSupplierId: undefined,
      equipmentSupplierName: '',
      equipmentAreaName: '',
      equipmentInstDesc: undefined,
      installDate: undefined,
      factoryDate: undefined,
      expDate: undefined,
      documentPath: [],
      imgPath: [],
      attrList: [],
    },
    typeFilter,
    topOrganId: '',
    supplierLoadingFlag:false, // 运营商列表加载
    communityIdFlag: false, // 项目刷新
    communityIdOpt:[], // 运营项目
    supplierListOpt:[], // 供应商
    rules: {
      topOrganId:[{ required: true, message: '请选择所属机构' }],
      equipmentId:[{ required: true, message: '请选择设备设施分类'}],
      equipmentInstName:[{ required: true, message: '请输入设备设施名称'}],
      equipmentInstCode: [{ required: true, message: '请输入设备设施编码'}],
    },
    allWidth: 'width: 100%;'
  }),
  methods: {
    // 初始化
    async init(){
      if (this.routeQuery.type === "edit") {
        await this.equipmentApiDetail()
      }
    },
    // 所属机构变化
    async changeTree(value){
      if (value) {
        const params = { nOrgId: value, nOrganId: value }
        let {organId:organTopId} = await queryTopOrganByOrganID(params)
        this.topOrganId = organTopId
        await this.queryCommunityListByOrganId(organTopId)
        await this.getEquipmentSupplierListByOrganId(value)
        if(this.routeQuery.type !== 'edit') {
          this.formInfo.communityId=
          this.formInfo.equipmentId=undefined
        }
        // 清除数据
        this.formInfo.equipmentName =
        this.formInfo.equipmentAreaName =
        this.formInfo.equipmentAreaId=
        this.formInfo.equipmentSupplierId = undefined
      }
    },
    // 选择项目变化
    handleCommunityIdChange() {
      this.formInfo.equipmentAreaName =
      this.formInfo.equipmentAreaId =
      this.formInfo.equipmentSupplierId = undefined
      this.$nextTick(()=>{
        this.getSupplierList()
      })
    },
    // 设备设施分类变化
    handleRquipmentChange (val) {
      console.log(1,val)
      if(val){
        this.$nextTick(()=>{
          this.getInfoAttrListByEquipmentId()
        })
      }
    },
    // 供应商列表
    async getSupplierList ()  {
      this.supplierLoadingFlag = true
      try {
        let organId
        if (this.formInfo.communityId) {
          organId = await this.queryOrganIdByCommunityId(this.formInfo.communityId)
          if (!organId) {
            return;
          }
        }
        await this.getEquipmentSupplierListByOrganId(organId)
      } finally {
        this.supplierLoadingFlag = false
      }
    },
    // 确定
    handleSave() {
      this.$refs.form.validate(async (validate) => {
        if(validate) {
          const params = await this.beforeEquipment(this.formInfo)
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
    /* **************** */
    // 文件上传
    customUpload (list = []) {
      if(!this.formInfo.topOrganId) {
        this.$message.error("请选择所属机构")
        return Promise.resolve({lists: []})
      }
      let files = Array.from(list)
      let lists = []
      let errorLists = []
      // 由于基础数据上传接口不是多文件上传
      let requestList = files.map(file => {
        let fileData = new FormData()
        fileData.append('file', file)
        errorLists.push({ url: file.name, name: file.name  })
        fileData.append('organId', this.formInfo.topOrganId)
        debugger
        return this.$api.building.equipmentFileUpload(fileData)
      })
      let requestAll = Promise.all(requestList)
      return requestAll.then(res => {
        res.map(item => {
          if (String(item.data.code) === '0' && item.data.data) {
            let url = item.data.data
            lists.push({url, name: url.substring(url.lastIndexOf('/')+1)})
          } else {
            this.$SG_Message.error(item.data.message)
          }
        })
        return {lists}
      }).catch(() => {
        return {lists: [], errorLists}
      })
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
          this.formInfo = this.afterEquipmentApiDetail(res.data);
          this.$nextTick(()=>{
            this.getSupplierList()
          })
        }
      } finally {
        this.DE_Loding(loadingName);
      }
    },
    afterEquipmentApiDetail(data) {
      const fileList = data.fileList || []
      data.communityId = data.communityId || ''
      // this.communityIdOpt =[{label: String(data.organName), value: data.communityId}]
      if (data.topOrganId){
        this.preGetCommunityIdByOrganId(data.topOrganId)
      }
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
      // 转换图片
      const imgPath = fileList.filter(item=>Number(item.fileType) === 1).map(item=>({url:item.filePath,name:item.fileName}))
      // 转换附件
      const documentPath = fileList.filter(item=>Number(item.fileType) === 2).map(item=>({url: item.filePath,name: item.fileName}))
      return {
        ...data,
        imgPath,
        documentPath,
        attrList : data.attrList || [],
        equipmentSupplierId: data.equipmentSupplierId || '',
        expDate: String(data.expDate),
        factoryDate: String(data.factoryDate),
        installDate: String(data.installDate),
        topOrganName: data.topOrganName,
        equipmentName: data.equipmentName,
        equipmentAreaName: data.equipmentAreaName
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

      // delete returnData.imgPath
      delete returnData.documentPath
      delete returnData.topOrganName
      delete returnData.organName
      delete returnData.equipmentSupplierName
      delete returnData.equipmentAreaName

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
        const organId = this.formInfo.topOrganId
        const equipmentId = this.formInfo.equipmentId
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
    },
  },
  /*************/
  mounted() {
    let { organName, topOrganId, type, equipmentInstId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, topOrganId, type, equipmentInstId },
    })
    this.init()
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
