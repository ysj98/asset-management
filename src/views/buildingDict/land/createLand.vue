<!--
 * @Date: 2020-07-16 15:28:04
 * @Description: 新建 编辑土地
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
                    v-model="organIdMain"
                    :top-level="true"
                  >
                  </treeSelect>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="土地名称" v-bind="formItemLayout">
                  <a-input
                    :style="allWidth"
                    :maxLength="30"
                    v-decorator="[
                      'blankName',
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
                <a-form-item label="土地编码" v-bind="formItemLayout">
                  <a-input
                    :style="allWidth"
                    :maxLength="30"
                    v-decorator="[
                      'blankCode',
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
                <a-form-item label="土地面积(㎡)" v-bind="formItemLayout">
                  <a-input-number
                    :max="999999.9999"
                    :min="0"
                    :style="allWidth"
                    v-decorator="[
                      'buildArea',
                      {
                        rules: [{ required: true, message: '请输入土地面积' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="宗地号" v-bind="formItemLayout">
                  <a-input
                    :style="allWidth"
                    :maxLength="30"
                    v-decorator="[
                      'theNo',
                      {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请输入宗地号',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="地理位置" v-bind="formItemLayout2">
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
              <a-col :span="8">
                <a-form-item label="土地类型" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    :getPopupContainer="getPopupContainer"
                    placeholder="请选择土地类型"
                    showSearch
                    optionFilterProp="children"
                    :options="$addTitle(landTypeOpt)"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="[
                      'landType',
                      {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请选择土地类型',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="土地用途分类" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    :getPopupContainer="getPopupContainer"
                    placeholder="请选择土地用途分类"
                    showSearch
                    optionFilterProp="children"
                    :options="$addTitle(landuseTypeOpt)"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="[
                      'landuseType',
                      {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请选择土地用途分类',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="土地用途" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    :getPopupContainer="getPopupContainer"
                    placeholder="请选择土地用途"
                    showSearch
                    optionFilterProp="children"
                    :options="$addTitle(landuseOpt)"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="[
                      'landuse',
                      {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请选择土地用途',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="批准日期" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    placeholder="请选择批准日期"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['approvalDate']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="计容面积(㎡)" v-bind="formItemLayout">
                  <a-input-number
                    :max="999999.9999"
                    :min="0"
                    :style="allWidth"
                    v-decorator="['acreage']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="容积率" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['landRate']" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="使用年限" v-bind="formItemLayout">
                  <a-input-number
                    placeholder="使用年限"
                    :style="allWidth"
                    step="1"
                    :max="99999"
                    :min="0"
                    :precision="0"
                    v-decorator="['serviceLife']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="开始时间" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    placeholder="请选择开始时间"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['startDate', { initialValue: undefined }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="结束时间" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    placeholder="请选择结束时间"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['endDate', { initialValue: undefined }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="红线面积(㎡)" v-bind="formItemLayout">
                  <a-input-number
                    :max="999999.9999"
                    :style="allWidth"
                    v-decorator="['redlineArea']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="有无围墙" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    :getPopupContainer="getPopupContainer"
                    placeholder="请选择有无围墙"
                    showSearch
                    optionFilterProp="children"
                    :options="$addTitle(wallTypeOpt)"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="[
                      'isEncloseWall',
                      {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请选择有无围墙',
                          },
                        ],
                        initialValue: '0'
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="围墙图片" v-bind="formItemLayout2">
                  <SG-UploadFile
                    :customDownload="customDownload"
                    :customUpload="customUpload"
                    v-model="encloseWallPic"
                    :max="3"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="备注" v-bind="formItemLayout2">
                  <a-textarea
                    :maxLength="200"
                    v-decorator="['blankDesc', { initialValue: '' }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="用地红线图" v-bind="formItemLayout2">
                  <SG-UploadFile
                    :customDownload="customDownload"
                    :customUpload="customUpload"
                    v-model="redMap"
                    :max="1"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="现状图片" v-bind="formItemLayout2">
                  <SG-UploadFile
                    :customDownload="customDownload"
                    :customUpload="customUpload"
                    v-model="nowPic"
                    :max="5"
                  />
                </a-form-item>
              </a-col>
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
    <selectLngAndLat
      :point="point"
      @change="bMapChange"
      ref="longitudeAndLatitud"
    />
  </div>
</template>
<script>
import FormFooter from "@/components/FormFooter.vue"
import { utils, debounce } from "@/utils/utils"
import dictMixin from "../dictMixin.js"
import selectLngAndLat from "@/views/common/selectLngAndLat.vue"
import TreeSelect from "@/views/common/treeSelect";
import {typeFilter} from '@/views/buildingDict/buildingDictConfig';
import moment from "moment"
import {queryTopOrganByOrganID} from "@/views/buildingDict/publicFn";
const allWidth = { width: "100%" }
const allWidth1 = { width: "100px", marginRight: "10px", flex: "0 0 120px" }
const allWidth2 = { width: "250px", flex: 1 }
// 页面跳转
const operationTypes = {
  index: "/buildingDict",
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
      landTypeOpt: [], // 土地类型
      landuseTypeOpt: [], // 土地用途分类
      wallTypeOpt: [{value:"1",label:"有围墙"}, {value:"0",label:"无围墙"}], // 有无围墙
      landuseOpt: [], // 土地用途
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
      organIdMain:'', // 所属机构
      organNameMain:'', // 所属机构名称
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
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
        if (!err) {
          let data = {}
          utils.each(values, (value, key) => {
            data[key] = value || ""
          })
          // 处理开始时间
          if (data.startDate) {
            data.startDate = data.startDate.format("YYYY-MM-DD")
          }
          // 处理结束时间
          if (data.endDate) {
            data.endDate = data.endDate.format("YYYY-MM-DD")
          }
          // 处理批准日期
          if (data.approvalDate) {
            data.approvalDate = data.approvalDate.format("YYYY-MM-DD")
          }
          // 处理经纬度
          let lngAnLatArr = data.lngAndlat.split("-")
          data.longitude = lngAnLatArr[0]
          data.latitude = lngAnLatArr[1]
          // 处理平面图
          if (this.redMap.length > 0) {
            data.redMap = this.redMap[0].url
          }
          // 处理围墙图片
          if (this.encloseWallPic.length > 0) {
            let str = ''
            this.encloseWallPic.forEach((item, index) => {
              if (index === this.encloseWallPic.length - 1) {
                str = str + item.url
              } else {
                str = str + item.url + ','
              }
            })
            data.encloseWallPic = str
          }
          // 处理现状图片
          if (this.nowPic.length > 0) {
            let str = ''
            this.nowPic.forEach((item, index) => {
              if (index === this.nowPic.length - 1) {
                str = str + item.url
              } else {
                str = str + item.url + ','
              }
            })
            data.nowPic = str
          }
          // 处理附件
          if (this.filePath.length > 0) {
            data.filePath = this.filePath.map((item) => item.url).join(",")
          }
          // 处理省市区的联动start
          data.city = this.city
          data.region = this.region
          data.address = this.address
          //删除多余字段
          delete data.lngAndlat
          data.organId = this.organIdMain
          // 新增土地
          if (this.routeQuery.type === "create") {
            let loadingName = this.SG_Loding("新增中...")
            this.$api.building.blankApiInsert(data).then(
              (res) => {
                this.DE_Loding(loadingName).then(() => {
                  if (res.data.code === "0") {
                    this.$SG_Message.success("新增土地成功")
                    this.$router.push({
                      path: "/buildingDict",
                      query: { showKey: "land", refresh: true },
                    })
                  } else {
                    this.$message.error(res.data.message)
                  }
                })
              },
              () => {
                this.DE_Loding(loadingName).then((res) => {
                  this.$SG_Message.error("新增失败！")
                })
              }
            )
          }
          // 编辑土地
          if (this.routeQuery.type === "edit") {
            data.blankId = this.routeQuery.blankId
            let loadingName = this.SG_Loding("编辑中...")
            this.$api.building.blankApiUpdate(data).then(
              (res) => {
                this.DE_Loding(loadingName).then(() => {
                  if (res.data.code === "0") {
                    this.$SG_Message.success("编辑土地成功")
                    this.$router.push({
                      path: "/buildingDict",
                      query: { showKey: "land", refresh: true },
                    })
                  } else {
                    this.$message.error(res.data.message)
                  }
                })
              },
              () => {
                this.DE_Loding(loadingName).then((res) => {
                  this.$SG_Message.error("编辑失败！")
                })
              }
            )
          }
        }
      })
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: "/buildingDict", query: { showKey: "land" } })
    },
    // 请求土地详情
    async blankApiDetail() {
      return new Promise((resolve, reject) => {
        let data = {
          blankId: this.routeQuery.blankId,
        }
        this.loading = true
        this.$api.building.blankApiDetail(data).then(
          async (res) => {
            this.loading = false
            if (res.data.code === "0") {
              let data = { ...res.data.data }
              // 处理开始时间
              if (data.startDate) {
                data.startDate = moment(data.startDate, "YYYY-MM-DD")
              }
              // 处理结束时间
              if (data.endDate) {
                data.endDate = moment(data.endDate, "YYYY-MM-DD")
              }
              // 处理批准日期
              if (data.approvalDate) {
                data.approvalDate = moment(data.approvalDate, "YYYY-MM-DD")
              }
              if (data.longitude) {
                data.lngAndlat = data.longitude + "-" + data.latitude
                this.point = {
                  lng: data.longitude,
                  lat: data.latitude,
                }
              }
              // 处理平面图
              if (data.redMap) {
                this.redMap = [{ url: data.redMap, name: "" }]
              }
              // 处理围墙图片
              if (data.encloseWallPic) {
                let arr = data.encloseWallPic.split(',')
                console.log('arr', arr)
                if (arr.length > 0) {
                  arr.forEach(item => {
                    this.encloseWallPic.push({url: item,name: ''})
                  })
                }
              }
              // 处理现状图片
              if (data.nowPic) {
                let arr = data.nowPic.split(',')
                console.log('arr', arr)
                if (arr.length > 0) {
                  arr.forEach(item => {
                    this.nowPic.push({url: item,name: ''})
                  })
                }
              }
              // 处理附件
              if (data.filePath) {
                let filePath = data.filePath.split(",")
                this.filePath = filePath.map((url) => {
                  return { url, name: url.substring(url.lastIndexOf("/") + 1) }
                })
              }
              // 处理省市区的联动start
              this.city = data.city
              this.region = data.region
              this.address = data.address
              this.queryCityAndAreaList(data.province, "province")
              this.queryCityAndAreaList(data.city, "city")
              // 赋值表单
              let o = this.form.getFieldsValue()
              console.log("表单数据=>", o)
              let values = {}
              utils.each(o, (value, key) => {
                if (data[key] && data[key] !== 0) {
                  values[key] = data[key]
                }
              })
              this.organIdMain = data.organId
              let {organId:organTopId, organName:organTopName} = await queryTopOrganByOrganID(
                {
                  nOrgId: data.organId,
                  nOrganId: data.organId,
                }
              )
              this.$refs.organTopRef.initDepartment(organTopId, organTopName)
              await this.queryCommunityListByOrganId(organTopId)
              this.organNameMain = data.organName
              this.form.setFieldsValue(values)
            } else {
              this.$message.error(res.data.message)
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
    // 查询土地类别
    queryLandType() {
      let data = {
        dictCode: "OCM_LAND_TYPE",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_LAND_TYPE",
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
    // 查询土地用途分类列表
    queryLandUseTypeList() {
      let data = {
        dictCode: "OCM_LANDUSE_TYPE",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_LANDUSE_TYPE",
        organId: this.organIdMain,
      }
      this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data
          this.landuseTypeOpt = data.map((item) => ({
            value: item["value"],
            label: item["name"],
          }))
        }
      })
    },
    // 取全部土地用途
    queryLandUseList() {
      let data = {
        dictCode: "OCM_LANDUSE",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_LANDUSE",
        organId: this.organIdMain,
      }
      this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data
          this.landuseOpt = data.map((item) => ({
            value: item["value"],
            label: item["name"],
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
      if (this.routeQuery.type === "edit") {
        await this.blankApiDetail()
        this.initPreData()
      }
      this.queryProvinceList()
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
