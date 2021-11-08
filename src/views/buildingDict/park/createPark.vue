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
                      :defaultOrganName="organNameMain"
                      :style="allStyle"
                      :allowClear="false"
                      v-decorator="['organId',{initialValue: '' || undefined, rules: [{required: true, message: '请选择所属机构'}]}]"
                  >
                  </treeSelect>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场名称" :required="true" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      :maxLength="128"
                      v-decorator="[
                      'placeName',
                      {
                        initialValue: '' || undefined,
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请输入土地名称',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场编码" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      :maxLength="64"
                      v-decorator="[
                      'placeCode',
                      {
                        initialValue: '' || undefined,
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请输入土地编码',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="运营项目" v-bind="formItemLayout">
<!--                      @change="communityIdChange"-->
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
                      v-decorator="['communityId']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场面积(㎡)" v-bind="formItemLayout">
                  <a-input-number
                      :min="0"
                      step="0.0001"
                      :max="9999999999999.9999"
                      :style="allWidth"
                      v-decorator="['placeArea',{rules: [{ required: true, message: '请输入车场面积' },{pattern:new RegExp(/^\d{1,13}(?:\.\d{1,4})?$/), message: '请输入小于13位整数，小于4位精度的数值'}]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位数量" v-bind="formItemLayout">
                  <a-input-number
                      :max="99999999999"
                      :min="0"
                      :precision="1"
                      step="1"
                      :style="allWidth"
                      v-decorator="['placeNums', {rules: [{required: true,pattern: new RegExp(/^[0-9]\d*$/,'g'), message: '请输入车位数量,并且是正整数'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <a-form-item label="地理位置" v-bind="formItemLayoutGeo">
                  <div class="address-box">
                    <a-input
                        :maxLength="128"
                        :style="allWidth2"
                        placeholder="详细地址"
                        v-decorator="['placeAddr', {initialValue: undefined, rules: [{required: true,message: '请输入车场地址'}]}]"
                    />
                  </div>
                </a-form-item>
              </a-col>
<!--            </a-row>-->
<!--            <a-row>-->
              <a-col :span="8">
                <a-form-item label="车场类型" v-bind="formItemLayout">
                  <dict-select
                    placeholder="请选择车场类型"
                    menu-code="PARKING_PLACE_RESOURCE_TYPE"
                    v-decorator="['typeId',{initialValue: undefined, rules: [{required: true,message: '请选择土地类型'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="备注" v-bind="formItemLayout2">
                  <a-textarea
                      :maxLength="128"
                      v-decorator="['description', { initialValue: '' }]"
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
                      v-model="formInfo.otherImg"
                      :max="1"
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
                  <a-table :columns="areaTitle" :pagination="false" bordered :data-source="formInfo.areaArray">
                    <span slot="areaNameTitle">
                      <span style="color:red">*</span>
                      区域名称</span>
                    <span slot="areaCodeTitle">
                      <span style="color:red">*</span>
                      区域编码</span>
                    <span slot="operationTitle"
                      @click="handleTableAppend(index)"
                      style="color: #0084ff;cursor: pointer;"
                    >新增</span>
                    <template v-for="com in areaTitle" :slot="com.dataIndex" slot-scope="item, record, index">
                      <div :key="com.dataIndex">
                        <a-form-item style="margin: -5px;">
                          <a-input
                              type="textarea"
                              :maxLength="com.maxLength"
                              :style="allWidth"
                              :placeholder="com.placeHolder"
                              v-if="['textarea'].includes(com.component)"
                              v-decorator="[`areaArray[${index}].${formInfo.areaArray[index].key + com.dataIndex}`,
                              {initialValue:item ,rules: [{required: com.isRequired,message: com.errMessage}]}]"
                              @change="e => handleTableInput(e.target.value, index, com.dataIndex)"
                          />
                          <a-input
                              :min="0"
                              step="0.0001"
                              :style="allWidth"
                              :maxLength="com.maxLength"
                              :key="index+'number'"
                              :placeholder="com.placeHolder"
                              v-if="['number'].includes(com.component)"
                              v-decorator="[`areaArray[${index}].${formInfo.areaArray[index].key + com.dataIndex}`,
                              {initialValue: 0 ,rules: [{required: com.isRequired,message: com.errMessage},...com.rules]}]"
                              @change="e => handleTableInput(e.target.value, index, com.dataIndex)"
                          />
                          <a-input
                            :maxLength="com.maxLength"
                            :style="allWidth"
                            :placeholder="com.placeHolder"
                            :key="formInfo.areaArray[index].key"
                            v-else-if="['text'].includes(com.component)"
                            v-decorator="[`areaArray[${index}].${formInfo.areaArray[index].key + com.dataIndex}`,
                            {initialValue:item ,rules: [{required: com.isRequired,message: com.errMessage}]}]"
                            @change="e => handleTableInput(e.target.value, index, com.dataIndex)"
                          />
                          <div style="transform: scale(0.8)" v-else-if="com.component ==='image'">
<!--                                v-model="formInfo.areaArray[index].areaOtherImg"-->
                            <SG-UploadFile
                                :customDownload="customDownload"
                                :customUpload="customUpload"
                                :max="1"
                                v-model="formInfo.areaArray[index].areaOtherImg"
                            >
                              <span slot="tips"></span>
                            </SG-UploadFile>
                          </div>
                          <span v-else-if="com.dataIndex === 'operation'"
                            @click="handleTableDelete(index)"
                            style="color: red;cursor: pointer;"
                          >删除</span>
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
import {areaTitle} from "./dict";
import DictSelect from "../../common/DictSelect";

const allWidth = { width: "100%" }
const allWidth1 = { width: "100px", marginRight: "10px", flex: "0 0 120px" }
const allWidth2 = { width: "86%", flex: 1 }
// 页面跳转
const operationTypes = {
  index: "/buildingDict",
}
const tableDataTemplate = {
  areaName:'', // 名称
  areaCode:'', // 编码
  areaZone:'', // 面积
  areaPosiNums: 0, // 车位数
  areaParkingImg: '', //
  areaOtherImg: [], // 图片
  areaDescription:'' // 描述
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
      areaTitle, // 区域信息表头
      formInfo: { // 表单
        // organId:'9999', // 组织机构ID
        // communityId: '66666', // 项目Id
        // placeName: '111111', // 车场名称
        // placeCode: '车场编码', // 车场编码
        // placeArea: 11111122,// 车场面积
        // placeAreaUnit: '车场面积单位', // 车场面积单位
        // placeNums: 9999, // 车位数量
        // typeId: '9999', // 车厂类型Id
        // placeAddr: '车厂地址', // 车厂地址
        // carPlaceImg: '', // 车场平面图
        otherImg: [], // 其它图片
        // description: '备注', // 备注
        areaArray: [
          // {
          //   areaName:'132123', // 名称
          //   areaCode:'编码', // 编码
          //   areaZone:'1111222', // 面积
          //   areaPosiNums: '9999', // 车位数
          //   areaParkingImg: '', //
          //   areaOtherImg: [], // 图片
          //   areaDescription:'描述', // 描述
          //   key: Math.random()
          // }
        ]
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
        placeId: "",
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
      organIdMain:'', // 所属机构
      organNameMain:'', // 所属机构名称
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    window.fff = this.form
  },
  mounted() {
    let { organName, organId, type, placeId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, organId, type, placeId },
    })
    this.init()
  },
  methods: {
    async changeTree(value){
      // this.organIdMain = value || ''
      if (value) {
        let {organId:organTopId} = await queryTopOrganByOrganID(
            {
              nOrgId: value,
              nOrganId: value,
            }
        )
        this.queryCommunityListByOrganId(organTopId)
        this.form.resetFields(['communityId'])
      }
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: "/buildingDict", query: { showKey: "land" } })
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
    // communityIdChange(e) {},

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
    // 初始化
    async init(){
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
    /*******************************/
    handleTableInput (value, index, column) {
      const newTable = [...this.formInfo.areaArray]
      newTable[index][column] = value
      this.formInfo.areaArray = [...newTable]
      this.formInfo = {...this.formInfo}
    },
    // 删除区域数据
    async handleTableDelete (index) {
      const tableData = this.formInfo.areaArray[index]
      console.log(tableData)
      if (tableData.parkingAreaId) {
        let delFlag = false
        this.$SG_Modal.confirm({
          title: `确定要删除该车场信息吗?`,
          okText: "确定",
          cancelText: "关闭",
          onOk: async () => {
            delFlag = await this.deleteParkingPlaceArea(this.organIdMain, this.routeQuery.placeId, tableData.parkingAreaId)
          }
        })
        if (!delFlag) {
          return
        }
      }
      const newTable = [...this.formInfo.areaArray]
      newTable.splice(index,1)
      this.formInfo.areaArray = [...newTable]
      this.formInfo = {...this.formInfo}
    },
    handleTableAppend () {
      const newTable = [...this.formInfo.areaArray]
      newTable.push({
        ...tableDataTemplate,
        key: Math.random()
      })
      this.formInfo.areaArray = [...newTable]
      // this.formInfo = {...this.formInfo}
    },
    // 确定
    handleSave() {
      // if (!this.organIdMain){
      //   this.$message.error('请选择所属机构')
      //   return null;
      // }
      this.form.validateFields((err, values) => {
        if(err) return
        console.log(values)
        const data = this.beforeSubmit(values)
        if (this.routeQuery.type === "create") {
          this.parkApiInsert(data)
        } else if(this.routeQuery.type === "edit") {
          this.parkApiEdit(data)
        }
      })
    },
    beforeSubmit (value) {
      debugger
      let areaArray = this.formInfo.areaArray || []
      areaArray = areaArray.map(item=>({...item,areaOtherImg: item.areaOtherImg.map(node=>node.url).join(',')}))
      return {
        ...value,
        otherImg:this.formInfo.otherImg.map(node=>node.url).join(','),
        areaArray: areaArray
      }
    },

    /*************接口相关************/
    afterParkApiDetail (value) {
      const data = {
        ...value,
      }
      data.organId = String(data.organId)
      data.areaArray = value.areaArray.map(item=>({...item, key:Math.random(),areaOtherImg: (item.areaOtherImg|| "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))}))
      this.formInfo.areaArray = [...data.areaArray]
      this.formInfo.otherImg = (value.otherImg|| "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))
      this.organNameMain = data.organName
      this.organIdMain = data.organId
      // 营运项目
      this.communityIdOpt = [{label: value.communityName, value: value.communityId}]
      return data
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
                this.form.setFieldsValue(this.afterParkApiDetail(res.data.data))
              } else {
                this.$SG_Message.error(res.data.message)              }
              resolve()
            },
            () => {
              this.loading = false
              reject()
            }
        )
      })
    },
    parkApiEdit (data) {
      // parkApiEdit
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
          })
        },
        () => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error("新增失败！")
          })
        }
      )
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
            this.$SG_Message.error("区域删除失败！")
          })
        }
      } catch {
        this.DE_Loding(loadingName).then(() => {
          this.$SG_Message.error("区域删除失败！")
        })
      }
      return false
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
