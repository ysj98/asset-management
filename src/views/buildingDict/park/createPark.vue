<template>
  <div class="landInfo-create-page">
    <div class="create-form">
      <a-form-model ref="form" :rules="rules" :model="formInfo" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
            <SG-Title noMargin title="基础信息" />
          </div>
        </div>
        <a-row>
          <a-col :span="8">
            <a-form-model-item :required="true"  label="所属机构" porp="organId">
              <tree-select
                ref="organTopRef"
                :default="false"
                :typeFilter="typeFilter"
                @changeTree="changeTree"
                placeholder='请选择所属机构'
                :defaultOrganName="organNameMain"
                style="width:100%;"
                :allowClear="false"
                v-model="formInfo.organId"
              >
              </tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="车场名称" :required="true" prop="placeName">
              <a-input
                style="width: 100%;"
                :maxLength="128"
                placeholder="请输入车场名称"
                v-model="formInfo.placeName"
                />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="车场编码" :required="true" prop="placeCode">
              <a-input
                :style="allWidth"
                :maxLength="64"
                placeholder="请输入车场编码"
                v-model="formInfo.placeCode"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="运营项目" prop="communityId">
              <a-select
                  :disabled="routeQuery.type === 'edit'"
                  :style="allWidth"
                  :placeholder=" routeQuery.type === 'edit' ? '无' : '请选择'"
                  showSearch
                  option-filter-prop="children"
                  :options="$addTitle(communityIdOpt)"
                  :allowClear="false"
                  notFoundContent="没有查询到数据"
                  v-model="formInfo.communityId"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="车场面积(㎡)" :required="true" prop="placeArea">
              <a-input-number
                  :min="0"
                  step="0.0001"
                  :max="9999999999999.9999"
                  :style="allWidth"
                  v-model="formInfo.placeArea"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="车位数量" :required="true" prop="placeNums">
              <a-input-number
                  step="1"
                  :min="0"
                  :precision="1"
                  :style="allWidth"
                  :max="99999999999"
                  v-model="formInfo.placeNums"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <a-form-model-item label="地理位置" :label-col="{ span: 2 }" :wrapper-col="{ span: 19 }" prop="placeAddr">
              <a-input
                :maxLength="128"
                :style="allWidth"
                placeholder="详细地址"
                v-model="formInfo.placeAddr"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="车场类型" :required="true" prop="typeId">
              <dict-select
                placeholder="请选择车场类型"
                menu-code="PARKING_PLACE_RESOURCE_TYPE"
                v-model="formInfo.typeId"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" style="display: flex">
            <!-- 文本框 -->
            <div style="width: 5.6%;text-align: right; line-height: 40px; padding-right: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.85);">备注:</div>
            <div style="width: 86%">
              <a-textarea
                  :maxLength="128"
                  placeholder="请输入备注"
                  v-model="formInfo.description"
              />
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" style="display: flex;margin-top: 20px">
            <!-- 文本框 -->
            <div style="width: 5.6%;text-align: right; line-height: 40px; padding-right: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.85);">图片:</div>
            <div style="width: 86%">
              <SG-UploadFile
                ref="uploadFile"
                :customDownload="customDownload"
                :customUpload="customUpload"
                v-model="formInfo.otherImg"
                :max="5"
                :maxSize="2048"
              >
                <span slot="tips">(注：上传的图片最多为 5 张,且图片大小小于2M,区域信息图片同上)</span>
              </SG-UploadFile>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" style="display: flex;margin-top: 20px">
            <div style="width: 5.6%;text-align: right; line-height: 40px; padding-right: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.85);">附件:</div>
            <div style="width: 86%">
              <SG-UploadFile
                type="all"
                ref="uploadFile"
                :customDownload="customDownload"
                :customUpload="customUpload"
                v-model="formInfo.carPlaceDoc"
                :max="5"
                :maxSize="20480"
              >
              </SG-UploadFile>
            </div>
          </a-col>
        </a-row>
        <div class="mb30">
          <SG-Title noMargin title="区域信息" />
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="" :label-col="{ span: 1 }" :wrapper-col="{ span: 22 }">
                <a-table :columns="areaTitle"  :pagination="false" bordered :data-source="formInfo.areaArray">
                    <span slot="areaNameTitle">
                      <span style="color:red">*</span>
                      区域名称</span>
                  <span slot="areaCodeTitle">
                      <span style="color:red">*</span>
                      区域编码</span>
                  <span slot="areaZone">
                      <span style="color:red">*</span>
                      区域面积(㎡)</span>
                  <span slot="areaPosiNums">
                      <span style="color:red">*</span>
                      区域车位数</span>
                  <span slot="operationTitle"
                        @click="handleTableAppend(index)"
                        style="color: #0084ff;cursor: pointer;"
                  >新增</span>
                  <template v-for="(com, ind) in areaTitle" :slot="com.dataIndex" slot-scope="item, record, index">
                    <div :key="com.dataIndex">
                      <a-form-model-item v-if="['areaDescription'].includes(com.dataIndex)"
                          style="margin: -5px;"
                          :label-col="{ span: 0 }"
                          :wrapper-col="{ span: 24 }">
                          <a-input
                              :key="'areaDescription'+index+ind"
                              type="textarea"
                              :disabled="formInfo.areaArray[index].disabled"
                              :maxLength="128"
                              :style="allWidth"
                              :placeholder="com.placeHolder"
                              v-model="formInfo.areaArray[index].areaDescription"
                          />
                        </a-form-model-item>
                      <a-form-model-item v-else-if="['areaPosiNums'].includes(com.dataIndex)"
                          :prop="`areaArray[${index}].areaPosiNums`"
                          style="margin: -5px;"
                          :label-col="{ span: 0 }"
                          :wrapper-col="{ span: 24 }"
                          :rules=" [
                           { required: true, message: '请输入区域车位数量', trigger: 'blur' },
                           {required: true,pattern: new RegExp(/^\d{0,11}?$/), message: '请输入区域车位数量,并且小于11位的正整数,'}]">
                        <a-input
                            :key="'areaPosiNums'+index+ind"
                            :maxLength="com.maxLength"
                            :style="allWidth"
                            :disabled="formInfo.areaArray[index].disabled"
                            :placeholder="com.placeHolder"
                            v-model="formInfo.areaArray[index].areaPosiNums"
                        />
                        </a-form-model-item>
                      <a-form-model-item v-else-if="['areaZone'].includes(com.dataIndex)"
                        :prop="`areaArray[${index}].areaZone`"
                        style="margin: -5px;"
                        :label-col="{ span: 0 }"
                        :wrapper-col="{ span: 24 }"
                        :rules="[
                           { required: true, message: '请输入区域面积', trigger: 'blur' },
                           { pattern: new RegExp(/^\d{1,13}(?:\.\d{1,4})?$/), message: '请输入小于13位整数，小于4位精度的数值'}]"
                      >
                        <a-input
                          :style="allWidth"
                          :maxLength="com.maxLength"
                          :placeholder="com.placeHolder"
                          :disabled="formInfo.areaArray[index].disabled"
                          v-model="formInfo.areaArray[index].areaZone"
                        />
                      </a-form-model-item>
                      <a-form-model-item v-else-if="['areaName'].includes(com.dataIndex)"
                        :key="'areaName'+index+ind"
                        :prop="`areaArray[${index}].areaName`"
                        style="margin: -5px;"
                        :label-col="{ span: 0 }"
                        :wrapper-col="{ span: 24 }"
                        :rules="[{ required: true, message: '请输入区域名称', trigger: 'blur' }]">
<!--                        区域名称-->
                        <a-input
                          :style="allWidth"
                          :maxLength="64"
                          :placeholder="com.placeHolder"
                          :disabled="formInfo.areaArray[index].disabled"
                          v-model="formInfo.areaArray[index].areaName"
                        />
                      </a-form-model-item>
                      <a-form-model-item v-else-if="['areaCode'].includes(com.dataIndex)"
                          :prop="`areaArray[${index}].areaCode`"
                          style="margin: -5px;"
                          :label-col="{ span: 0 }"
                          :wrapper-col="{ span: 24 }"
                          :key="'areaCode'+index+ind"
                          :rules="[{ required: true, message: '请输入区域编码', trigger: 'blur' }]">
<!--                        区域编码-->
                        <a-input
                            :style="allWidth"
                            :maxLength="64"
                            :placeholder="com.placeHolder"
                            :disabled="formInfo.areaArray[index].disabled"
                            v-model="formInfo.areaArray[index].areaCode"
                        />
                      </a-form-model-item>
                      <a-form-model-item v-else-if="com.component ==='image'"
                      style="margin: -5px;"
                      :label-col="{ span: 0 }"
                      :wrapper-col="{ span: 24 }"
                      :rules="{}">
                        <div style="transform: scale(0.8)" >
                          <SG-UploadFile
                            :customDownload="customDownload"
                            :customUpload="customUpload"
                            :show="formInfo.areaArray[index].disabled"
                            :max="1"
                            v-model="formInfo.areaArray[index].areaOtherImg"
                            :maxSize="2048"
                          >
                            <span slot="tips"></span>
                          </SG-UploadFile>
                        </div>
                      </a-form-model-item>
                      <div v-else-if="com.dataIndex === 'operation'">
                        <template v-if="formInfo.areaArray[index].parkingAreaId">
                          <span
                              v-if="formInfo.areaArray[index].disabled"
                              @click="handleTableEdit(index)"
                              style="color: #0084ff;cursor: pointer;"
                          >编辑&nbsp;&nbsp;</span>
                          <span v-else
                              @click="handleTableEditSave(index)"
                              style="color: #0084ff;cursor: pointer;"
                          >编辑保存&nbsp;&nbsp;</span>
                        </template>
                        <span v-if="routeQuery.type === 'edit' && !formInfo.areaArray[index].parkingAreaId"
                          @click="handleTableSave(index)"
                          style="color: #0084ff;cursor: pointer;"
                        >保存&nbsp;&nbsp;</span>
                        <span @click="handleTableDelete(index)"
                              style="color: red;cursor: pointer;"
                        >删除</span>
                      </div>
                    </div>
                  </template>
                </a-table>
              </a-form-model-item>
            </a-col>
          </a-row>
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
import {areaTitle,} from "./dict";
import DictSelect from "../../common/DictSelect";

const tableDataTemplate = {
  areaName:'', // 名称
  areaCode:'', // 编码
  areaZone:'', // 面积
  areaPosiNums: '', // 车位数
  areaParkingImg: '', //
  areaOtherImg: [], // 图片
  areaDescription:'' // 描述
}
export default {
  components: { DictSelect, TreeSelect, FormFooter},
  mixins: [dictMixin],
  data: () =>({
    areaTitle,
    typeFilter,
    bussType: "parkDir",
    allWidth: "width:100%",
    formInfo: { // 表单
      organId: undefined, // 组织机构ID
      communityId: undefined, // 项目Id
      placeName: undefined, // 车场名称
      placeCode: undefined, // 车场编码
      placeArea: undefined,// 车场面积
      placeAreaUnit: undefined, // 车场面积单位
      placeNums: undefined, // 车位数量
      typeId: undefined, // 车厂类型Id
      placeAddr: undefined, // 车厂地址
      carPlaceImg: undefined, // 车场平面图
      otherImg: [], // 其它图片
      carPlaceDoc: [], // 附件
      description: undefined, // 备注
      areaArray: []
    },
    rules:{
      organId: [
        { required: true, message: '请选择所属机构' },
      ],
      placeName: [
        { required: true, message: '请输入车场名称' },
      ],
      placeArea: [
        { required: true, message: '请输入车场面积' },
        {required: true, pattern: new RegExp(/^\d{1,13}(?:\.\d{1,4})?$/), message: '请输入小于13位整数，小于4位精度的数值'}
      ],
      placeCode: [
        { required: true, message: '请输入车场编码' },
      ],
      placeNums:[
        { required: true, message: '请输入车位数量' },
        {required: true,pattern: new RegExp(/^[0-9]\d*$/,'g'), message: '请输入车位数量,并且是正整数'}
      ],
      typeId: [
        { required: true, message: '请输入车场类型' },
      ],
      placeAddr: [
        { required: true, message: '请输入地理位置' },
      ],
    },
    communityIdOpt:[],
    routeQuery: {
      // 路由传入数据
      type: "create", // 页面类型
      placeId: "",
      organName: "",
      organId: "",
    },
    organIdMain:'', // 所属机构
    organNameMain:'', // 所属机构名称
  }),
  methods: {
    async changeTree(value){
      if (value) {
        let {organId:organTopId} = await queryTopOrganByOrganID(
          {
            nOrgId: value,
            nOrganId: value,
          }
        )
        if(this.routeQuery.type === 'edit') return
        this.queryCommunityListByOrganId(organTopId)
        this.formInfo.communityId = ''
      }
    },
    // 初始化
    async init(){
      this.initUploadFile()
      // this.form.setFieldsValue(this.formInfo)
      if (this.routeQuery.type === "edit") {
        let loadingName = this.SG_Loding("加载中...")
        try {
          await this.parkApiDetail()
        } finally {
          this.DE_Loding(loadingName)
        }
      }
    },
    initUploadFile () {
      // this.$refs.uploadFile.$data.hostImg = ""
      // this.$refs.uploadFile.$data.imgStr = ""
      console.log(this.$refs.uploadFile.$data.hostImg )
    },
    handleSave () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = this.beforeSubmit(this.formInfo)
          if (this.routeQuery.type === "create") {
            this.parkApiInsert(data)
          } else if(this.routeQuery.type === "edit") {
            this.parkApiEdit(data)
          }
        } else {
          return false;
        }
      });
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: "/buildingDict", query: { showKey: "land" } })
    },
    /************ 处理区域 ************/
    handleTableAppend () {
      this.formInfo.areaArray.push({
        ...tableDataTemplate,
        key: Math.random()
      })
      // this.formInfo = {...this.formInfo}
    },
    // 新增区域
    async handleTableSave(index) {
      const tableData = this.formInfo.areaArray[index]
      const areaOtherImg = tableData.areaOtherImg.map(node=>node.url).join(',')
      const data = await this.addParkingPlaceArea({...tableData, areaOtherImg,placeId: this.formInfo.placeId})
      if (data) {
        tableData.parkingAreaId = data
        tableData.disabled = true
      }
      this.formInfo.areaArray = [...this.formInfo.areaArray]
    },
    async handleTableEditSave(index) {
      const tableData = this.formInfo.areaArray[index]
      const areaOtherImg = tableData.areaOtherImg.map(node=>node.url).join(',')
      const params = {
        ...tableData,
        areaOtherImg,
        placeId: this.formInfo.placeId,
        areaId: tableData.parkingAreaId
      }
      delete params.key
      delete params.disabled
      await this.editParkingPlaceArea(params)
      tableData.disabled = true
      this.formInfo.areaArray = [...this.formInfo.areaArray]
    },

    // 删除区域数据
    async handleTableDelete (index) {
      const tableData = this.formInfo.areaArray[index]
      console.log(tableData)
      if (tableData.parkingAreaId) {
        let delFlag = false
        this.$SG_Modal.confirm({
          content: `确定要删除该车场信息吗?`,
          okText: "确定",
          cancelText: "关闭",
          onOk: async () => {
            delFlag = await this.deleteParkingPlaceArea(this.organIdMain, this.routeQuery.placeId, tableData.parkingAreaId)
            if (!delFlag) {
              return
            }
            this.formInfo.areaArray.splice(index,1)
          }
        })
        if (!delFlag) {
          return
        }
      }
      this.formInfo.areaArray.splice(index,1)
    },
    handleTableEdit (index) {
      const tableData = this.formInfo.areaArray[index]
      tableData.disabled = false
      this.formInfo.areaArray = [...this.formInfo.areaArray]
    },
    // 验证区域是否全部存储
    validateAreaArray () {
      for( const item of this.formInfo.areaArray || []){
        if (!item.parkingAreaId) {
          this.$SG_Message.error("请先保存未保存的区域信息")
          return true
        }
      }
      return false
    },
    /*************接口相关************/

    beforeSubmit (value) {
      console.log('value',value)
      let areaArray = this.formInfo.areaArray || []
      areaArray = areaArray.map(item=>({...item,areaOtherImg: item.areaOtherImg.map(node=>node.url).join(',')}))
      return {
        ...value,
        otherImg:this.formInfo.otherImg.map(node=>node.url).join(','),
        carPlaceDoc: this.formInfo.carPlaceDoc.map(node=>node.url).join(','),
        areaArray: areaArray
      }
    },
    async afterParkApiDetail (value) {
      const data = {
        ...value,
      }
      data.organId = String(data.organId)
      data.otherImg = (value.otherImg|| "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))
      data.carPlaceDoc = (value.carPlaceDoc|| "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))
      data.communityId = String(data.communityId) === '-1' ? undefined : String(data.communityId)
      this.organNameMain = data.organName
      this.organIdMain = data.organId
      if (data.organId) {
        let {organId:organTopId} = await queryTopOrganByOrganID(
            {
              nOrgId: data.organId,
              nOrganId: data.organId,
            }
        )
        // 查询运营项目
        await this.queryCommunityListByOrganId(organTopId)
        // 查询区域
        const areaList = await this.getParkingPlaceAreasByPlaceId({organId:data.organId,placeId:data.placeId})
        data.areaArray = areaList.map(item=>({...item, key:Math.random(), disabled: true, areaOtherImg: (item.areaOtherImg|| "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))}))
      }
      // 营运项目
      return {...data}
    },
    // 详情
    async parkApiDetail() {
      return new Promise((resolve, reject) => {
        let data = {
          placeId: this.routeQuery.placeId,
          organId: this.routeQuery.organId
        }
        this.loading = true
        this.$api.building.parkApiDetail(data).then(
            async (res) => {
              this.loading = false
              if (res.data.code === "0") {
                this.formInfo.areaArray=[]
                this.formInfo=await this.afterParkApiDetail(res.data.data)
              } else {
                this.$SG_Message.error(res.data.message)
              }
              resolve()
            },
            () => {
              this.loading = false
              reject()
            }
        )
      })
    },
    async parkApiEdit (data) {
      if (this.validateAreaArray()) {
        return
      }
      const params = {
        ...data,
        placeId: this.routeQuery.placeId
      }
      let loadingName = this.SG_Loding("编辑中...")
      this.$api.building.parkApiEdit(params).then(
          (res) => {
            this.DE_Loding(loadingName).then(() => {
              if (res.data.code === "0") {
                this.$SG_Message.success("编辑车场成功")
                this.$router.push({
                  path: "/buildingDict",
                  query: { showKey: "park", refresh: true },
                })
              } else {
                this.$message.error(res.data.message)
              }
              this.DE_Loding(loadingName)
            })
          },
          () => {
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.error("编辑失败！")
            })
          }
      )
    },
    parkApiInsert (data) {
      const params = {
        ...data
      }
      let loadingName = this.SG_Loding("新增中...")
      this.$api.building.parkApiInsert(params).then(
        (res) => {
          this.DE_Loding(loadingName).then(() => {
            if (res.data.code === "0") {
              this.$SG_Message.success("新增车场成功")
              this.$router.push({
                path: "/buildingDict",
                query: { showKey: "park", refresh: true },
              })
            } else {
              this.$SG_Message.error(res.data.message)
            }
            this.DE_Loding(loadingName)
          })
        },
        () => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error("新增失败！")
          })
        }
      )
    },
    // 请求项目
    async queryCommunityListByOrganId(organTopId) {
      let data = {
        organId: organTopId,
      }
      const {data: res} = await this.$api.basics.queryCommunityListByOrganId(data)
      if (String(res.code) === "0") {
        let result = res.data || []
        let resultArr = result.map((item) => {
          return {
            label: item.name,
            value: item.communityId,
            ...item,
          }
        })
        this.communityIdOpt = resultArr
      }
    },
    // 删除区域
    async deleteParkingPlaceArea (organId, placeId, areaId) {
      // organId	组织机构ID	Integer	Y	组织机构ID
      // placeId	车场ID	Integer	Y	车场ID
      // areaId	区域ID	Integer	Y	区域ID
      const params = {
        organId,
        placeId,
        areaId
      }
      let loadingName = this.SG_Loding("区域删除中")
      try {
        const {data: res} = await this.$api.building.deleteParkingPlaceArea(params)
        if (String(res.code) === "0") {
          this.$SG_Message.success("删除成功")
          this.DE_Loding(loadingName)
          return true
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error(res.message)
          })
        }
      } catch {
        this.DE_Loding(loadingName).then(() => {
          this.$SG_Message.error("区域删除失败！")
        })
      }
      return false
    },
    // 新增区域
    async addParkingPlaceArea (data) {
      let loadingName = this.SG_Loding("区域新增中")
      try {
        const {data: res} = await this.$api.building.addParkingPlaceArea(data)
        if(String(res.code) === '0'){
          this.$SG_Message.success('新增成功')
          return res.data
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error(res.message)
          })
        }
      }finally {
        this.DE_Loding(loadingName)
      }
      return
    },
    // 编辑区域
    async editParkingPlaceArea (data) {
      let loadingName = this.SG_Loding("区域编辑中")
      try {
        const {data: res} = await this.$api.building.editParkingPlaceArea(data)
        if(String(res.code) === '0'){
          this.$SG_Message.success('编辑成功')
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error(res.message)
          })
        }
      }finally {
        this.DE_Loding(loadingName)
      }
    },
    // 查询区域
    async getParkingPlaceAreasByPlaceId ({organId,placeId}) {
      const params = {organId,placeId}
      try {
        const {data: res} = await this.$api.building.getParkingPlaceAreasByPlaceId(params)
        if(String(res.code) === '0'){
          return res.data || []
        }else {
          this.$SG_Message.error(res.message)
          return []
        }
      } catch {
        return []
      }
      // return []

    },
    // 文件上传
    customUpload (list = []) {
      if(!this.formInfo.organId) {
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
        fileData.append('organId', this.formInfo.organId)
        return this.$api.building.parkUploadPicFile(fileData)
      })
      let requestAll = Promise.all(requestList)
      return requestAll.then(res => {
        res.map(item => {
          if (String(item.data.code)=== '0' && item.data.data) {
            let url = item.data.data.imgPath;
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
  },
    /************************************/
  mounted() {
    let { organName, organId, type, placeId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, organId, type, placeId },
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