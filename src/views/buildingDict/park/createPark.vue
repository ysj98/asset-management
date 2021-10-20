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
                      v-model="formInfo.organId"
                      :allowClear="false"
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
                      :maxLength="30"
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
                  <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                      @change="communityIdChange"
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
                      :max="999999.9999"
                      :style="allWidth"
                      v-decorator="['placeArea',{rules: [{ required: true, message: '请输入车场面积' }]}]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位数量" v-bind="formItemLayout">
                  <a-input-number
                      :max="999999"
                      :min="0"
                      :precision="1"
                      step="1"
                      :style="allWidth"
                      v-decorator="['placeNums', {rules: [{required: true, message: '请输入车位数量'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <a-form-item label="地理位置" v-bind="formItemLayoutGeo">
                  <div class="address-box">
                    <a-select
                        :style="allWidth1"
                        placeholder="省"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        :options="$addTitle(provinceOpt)"
                        :allowClear="false"
                        @change="cityOrRegionChange($event, 'province')"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                        v-decorator="[
                        'province',
                        {
                          rules: [
                            { required: true, message: '请选择省' },
                            { validator: validateAddress },
                          ],
                        },
                      ]"
                    />
                    <a-select
                        :style="allWidth1"
                        placeholder="市"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        :options="$addTitle(cityOpt)"
                        v-model="city"
                        :allowClear="false"
                        @change="cityOrRegionChange($event, 'city')"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                    />
                    <a-select
                        :style="allWidth1"
                        placeholder="区/县"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        v-model="region"
                        @change="cityOrRegionChange($event, 'region')"
                        :options="$addTitle(regionOpt)"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                    />
                    <a-input
                        :maxLength="100"
                        @input="getLL"
                        v-model="address"
                        :style="allWidth2"
                        placeholder="详细地址"
                    />
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="经纬度" v-bind="formItemLayout">
                  <a-input
                      :style="allWidth"
                      v-decorator="[
                      'lngAndlat',
                      {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请选择或输入经纬度',
                          },
                        ],
                      },
                    ]"
                  >
                    <a-icon
                        type="plus"
                        @click="showSelectMap"
                        class="pointer"
                        slot="suffix"
                    />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="车场类型" v-bind="formItemLayout">
                  <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                      placeholder="请选择车场类型"
                      showSearch
                      optionFilterProp="children"
                      :options="$addTitle(landTypeOpt)"
                      :allowClear="false"
                      :filterOption="filterOption"
                      notFoundContent="没有查询到数据"
                      v-decorator="[
                      'typeId',{rules: [{required: true,message: '请选择土地类型'}]}]"
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
          <div class="mb30">
            <SG-Title noMargin title="区域信息" />
            <a-row>
              <a-col :span="23" :offset="1">
                <a-form-item label="" v-bind="formItemLayoutTable">
                  <a-table :columns="areaTitle" :pagination="false" bordered :data-source="formInfo.areaArray">
                      <span slot="operationTitle"
                        @click="handleTableAppend(index)"
                        style="color: #0084ff;cursor: pointer;"
                      >新增</span>
                    <template v-for="com in areaTitle" :slot="com.dataIndex" slot-scope="item, record, index">
                      <div :key="com.dataIndex">
                        <a-form-item style="margin: -5px;">
                          <a-input
                            :value="item"
                            :maxLength="30"
                            :style="allWidth"
                            :placeholder="com.placeHolder"
                            v-if="['input'].includes(com.component)"
                            v-decorator="[`${formInfo.areaArray[index].key+com.dataIndex}`,
                            {initialValue:item ,rules: [{required: com.isRequired,message: com.errMessage}]}]"
                            @change="e => handleTableInput(e.target.value, index, com.dataIndex)"
                          />
                          <a-input
                            :value="item"
                            :maxLength="30"
                            :style="allWidth"
                            :placeholder="com.placeHolder"
                            :key="formInfo.areaArray[index].key"
                            v-else-if="['text'].includes(com.component)"
                            v-decorator="[`${formInfo.areaArray[index].key+com.dataIndex}`,
                            {initialValue:item ,rules: [{required: com.isRequired,message: com.errMessage}]}]"
                            @change="e => handleTableInput(e.target.value, index, com.dataIndex)"
                          />
                          <div style="transform: scale(0.8)" v-else-if="com.component ==='image'">
                            <SG-UploadFile
                                :show="false"
                                :customDownload="customDownload"
                                :customUpload="customUpload"
                                type="all"
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
    <selectLngAndLat
        :point="point"
        @change="bMapChange"
        ref="longitudeAndLatitud"
    />
  </div>
</template>
<script>
import FormFooter from "@/components/FormFooter.vue"
import dictMixin from "../dictMixin.js"
import selectLngAndLat from "@/views/common/selectLngAndLat.vue"
import TreeSelect from "@/views/common/treeSelect";
import {typeFilter} from '@/views/buildingDict/buildingDictConfig';
import {queryTopOrganByOrganID} from "@/views/buildingDict/publicFn";
import {areaTitle} from "./dict";

const allWidth = { width: "100%" }
const allWidth1 = { width: "100px", marginRight: "10px", flex: "0 0 120px" }
const allWidth2 = { width: "250px", flex: 1 }
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
  areaOtherImg: [], // 图片
  areaDescription:'描述' // 描述
}
export default {
  components: {
    FormFooter,
    selectLngAndLat,
    TreeSelect
  },
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
      allWidth,
      allWidth1,
      allWidth2,
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
      organIdMain:'', // 所属机构
      organNameMain:'', // 所属机构名称
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
      this.organIdMain = value || ''
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
      if (!this.organIdMain){
        this.$message.error('请选择所属机构')
        return null;
      }
      this.form.validateFields((err, values) => {
      })
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: "/buildingDict", query: { showKey: "land" } })
    },
    // 请求土地详情
    async blankApiDetail() {
    },
    // 查询土地类别
    queryLandType() {
      let data = {
        dictCode: "PARKING_PLACE_RESOURCE_TYPE",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "PARKING_PLACE_RESOURCE_TYPE",
        organId: this.organIdMain,
        // assetType: '4'
      }
      // this.$api.assets.getList(data)
      // this.$api.basics.organDict(data)
      this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data
          this.landTypeOpt = data.map((item) => ({
            value: item["value"],
            label: item["name"],
            // id: item["dictId"]
          }))
        }
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
    // 选择项目变化
    communityIdChange(e) {},
    bMapChange(point) {
      console.log("经纬度改变=>", point)
      let lngAndlat = point.lng + "-" + point.lat
      this.form.setFieldsValue({ lngAndlat })
      this.point = { ...point }
    },
    // 显示百度地图
    showSelectMap() {
      this.$refs.longitudeAndLatitud.visible = true
    },
    // 请求省
    queryProvinceList() {
      return this.$api.basics.queryProvinceList().then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data || []
          this.provinceOpt = data.map((item) => {
            return { label: item.name, value: item.regionId }
          })
        }
      })
    },
    // 请求市区
    queryCityAndAreaList(parentRegionId, type) {
      this.$api.basics.queryCityAndAreaList({ parentRegionId }).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data || []
          let result = data.map((item) => {
            return { label: item.name, value: item.regionId }
          })
          // 市
          if (type === "province") {
            this.regionOpt = []
            this.cityOpt = result
          }
          // 区
          if (type === "city") {
            this.regionOpt = result
          }
        }
      })
    },
    // 验证省市区
    validateAddress(rule, value, callback) {
      console.log("ss", this.city)
      if (!value) {
        callback("请选择省份")
      } else if (!this.city) {
        callback("请选择市")
      } else if (!this.region) {
        callback("请选择区/县")
      } else {
        callback()
      }
    },
    cityOrRegionChange(e, type) {
      console.log("改变项", e, type)
      // 如果是区/县 请求经纬度
      if (type === "region") {
        this.getLL()
      }
      // 市
      if (type === "province") {
        this.region = undefined
        this.city = undefined
      }
      // 区
      if (type === "city") {
        this.region = undefined
      }
      // 触发验证
      if (["region", "city"].includes(type)) {
        this.form.validateFields(["province"], { force: true })
      }
      // 请求联动数据
      if (["province", "city"].includes(type)) {
        this.queryCityAndAreaList(e, type)
      }
    },
    transformProvince() {
      let value = this.form.getFieldsValue().province
      let arr = this.provinceOpt.filter(
          (item) => String(item.value) === String(value)
      )
      return arr[0].label
    },
    transformCity() {
      let value = this.city
      let arr = this.cityOpt.filter(
          (item) => String(item.value) === String(value)
      )
      return arr[0].label
    },
    transformArea() {
      let value = this.region
      let arr = this.regionOpt.filter(
          (item) => String(item.value) === String(value)
      )
      return arr[0].label
    },
    // 请求经纬度坐标
    getLL() {
      if (!BMap) return
      if (!this.region) return
      var myGeo = new BMap.Geocoder()
      let self = this
      let longitude = 0
      let latitude = 0
      let transformProvince = this.transformProvince()
      let transformCity = this.transformCity()
      let transformArea = this.transformArea()
      let address = this.address
      console.log("动态经纬度=>", transformProvince)
      if (transformProvince && transformCity && transformArea) {
        myGeo.getPoint(
            transformProvince + transformCity + transformArea + address,
            (point) => {
              if (point) {
                let lngAndlat = point.lng + "-" + point.lat
                this.form.setFieldsValue({ lngAndlat })
              }
            }
        )
      }
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
      this.queryLandType()
      this.queryLandUseTypeList()
      this.queryLandUseList()
    },
    // 初始化
    async init(){
      this.form.setFieldsValue(this.formInfo)
      if (this.routeQuery.type === "edit") {
        await this.blankApiDetail()
        this.initPreData()
      }
      this.queryProvinceList()
    },
    /*******************************/
    handleTableInput (value, index, column) {
      const newTable = [...this.formInfo.areaArray]
      newTable[index][column] = value
      this.formInfo.areaArray = [...newTable]
      this.formInfo = {...this.formInfo}
    },
    handleTableDelete (index) {
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
      this.formInfo = {...this.formInfo}
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
