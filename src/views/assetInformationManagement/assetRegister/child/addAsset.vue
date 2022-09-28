<template>
  <div class="addAsset">
    <SG-Modal width="650px" v-model="show" title="资产登记" confirmText="提交" @ok="onConfirm" @cancel="onCancel">
      <a-form :form="form">
        <span class="section-title blue">基本信息</span>
        <div class="playground-row">
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="资产类型：" v-bind="formItemLayout">
                <label slot="label">资产类型：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择资产类型"
                  v-decorator="[
                    'assetType',
                    {
                      rules: [{ required: true, message: '请选择资产类型' }],
                      initialValue: params.assetType,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="assetTypeChange"
                  notFoundContent="没有查询到资产类型"
                >
                  <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">资产名称：</label>
                <a-input placeholder="请输入资产名称" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)' }], initialValue: params.assetName }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">资产编码：</label>
                <a-tooltip placement="topLeft" :title="params.assetCode" arrow-point-at-center>
                  <!-- <span v-if="assetCodeDisabled" class="assetCodeBtn">{{ params.assetCode || '资产编码' }}</span> -->
                  <a-input v-if="assetCodeDisabled" disabled placeholder="请输入资产编码" :style="allWidth" :max="100" v-decorator="['assetCode', { rules: [{ required: false, max: 100, whitespace: true, message: '请输入资产编码(不超过100字符)' }], initialValue: params.assetCode }]" />
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">{{ assetTitle }}：</label>
                <a-select
                  showSearch
                  :placeholder="`请选择${assetTitle}`"
                  v-decorator="[
                    'buildId',
                    {
                      rules: [{ required: true, message: '请选择楼栋' }],
                      initialValue: params.buildId,
                    },
                  ]"
                  @change="handlePositionId"
                  @search="handleSearch"
                  optionFilterProp="children"
                  :allowClear="true"
                  :filterOption="false"
                  notFoundContent="没有查询到数据"
                >
                  <a-select-option v-for="(item, index) in positionNameData" :key="index + 'positionNameData'" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="房间名称：" v-bind="formItemLayout">
                <label slot="label">房间名称：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择房间名称"
                  v-decorator="[
                    'houseNumber',
                    {
                      rules: [{ required: false, message: '请选择房间名称' }],
                      initialValue: params.houseNumber,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="houseChange"
                  notFoundContent="没有查询到房间信息"
                >
                  <a-select-option :title="item.name" v-for="item in houseList" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
                <a-tooltip style="margin: 5px">
                  <template slot="title">楼栋作为资产，房间名称无需选择</template>
                  <a-icon type="exclamation-circle" />
                </a-tooltip>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">建筑面积(㎡)：</label>
                <a-input-number :min="0" :max="99999.9999" :step="0.0001" :style="allWidth" disabled v-model="params.area" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">坐落位置：</label>
                <a-input :style="allWidth" disabled v-model="buildAddress" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">装修情况：</label>
                <a-input placeholder="请输入装修情况" :style="allWidth" :max="30" v-decorator="['decorationSituation', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入装修情况(不超过30字符)' }], initialValue: params.decorationSituation }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">资产原值(元)：</label>
                <a-input-number :min="0" :max="9999999.99" :step="0.01" placeholder="请输入资产原值" :style="allWidth" v-decorator="['originalValue', { initialValue: params.originalValue }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">市场价值(元)：</label>
                <a-input-number :min="0" :max="9999999.99" :step="0.01" placeholder="请输入市场价值" :style="allWidth" v-decorator="['marketValue', { initialValue: params.marketValue }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="来源方式：" v-bind="formItemLayout">
                <label slot="label">来源方式：</label>
                <a-select
                  :style="allWidth"
                  placeholder="请选择来源方式"
                  v-decorator="[
                    'sourceMode',
                    {
                      initialValue: params.sourceMode,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到来源方式"
                >
                  <a-select-option :title="item.name" v-for="item in assetSourceOptions" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <span class="section-title blue">权属信息</span>
        <div class="playground-row">
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="权属类型：" v-bind="formItemLayout">
                <label slot="label">权属类型：</label>
                <a-select
                  :style="allWidth"
                  placeholder="请选择权属类型"
                  v-decorator="[
                    'kindOfRight',
                    {
                      rules: [{ required: true, message: '请选择权属类型' }],
                      initialValue: params.kindOfRight,
                    },
                  ]"
                  :allowClear="false"
                  notFoundContent="没有查询到权属类型"
                >
                  <a-select-option :title="item.name" v-for="item in ownershipData" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="权属情况：" v-bind="formItemLayout">
                <label slot="label">权属情况：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择权属情况"
                  v-decorator="[
                    'ownershipStatus',
                    {
                      rules: [{ required: true, message: '请选择权属情况' }],
                      initialValue: params.ownershipStatus,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="ownershipStatusChange"
                  notFoundContent="没有查询到权属情况"
                >
                  <a-select-option :title="item.name" v-for="item in ownershipStatusList" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-show="warrantNbrShow">
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">权证号：</label>
                <a-input placeholder="请输入权证号" :style="allWidth" :max="30" v-decorator="['warrantNbr', { rules: [{ required: warrantNbrShow, max: 30, whitespace: true, message: '请输入权证号(不超过30字符)' }], initialValue: params.warrantNbr }]" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <span class="section-title blue">使用方向信息</span>
        <div class="playground-row">
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="转运营日期：" v-bind="formItemLayout">
                <label slot="label">转运营日期：</label>
                <a-input placeholder="请输入转运营日期" :style="allWidth" v-model="transferTime" @click="timeShow = true" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">运营面积(㎡)：</label>
                <a-input-number :min="0" :max="9999999.9999" :step="0.0001" placeholder="请输入运营面积" :style="allWidth" v-decorator="['transferOperationArea', { rules: [{ required: true, message: '请输入请输入运营面积' }], initialValue: params.transferOperationArea }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">其他面积(㎡)：</label>
                <a-input-number :min="0" :max="9999999.9999" :step="0.0001" placeholder="请输入其他面积" :style="allWidth" v-decorator="['otherArea', { rules: [{ required: true, message: '请输入其他面积' }], initialValue: params.otherArea }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">闲置面积(㎡)：</label>
                <a-input-number :min="0" :max="9999999.9999" :step="0.0001" placeholder="请输入闲置面积" :style="allWidth" v-decorator="['idleArea', { rules: [{ required: true, message: '请输入闲置面积' }], initialValue: params.idleArea }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">自用面积(㎡)：</label>
                <a-input-number :min="0" :max="9999999.9999" :step="0.0001" placeholder="请输入自用面积" :style="allWidth" v-decorator="['selfUserArea', { rules: [{ required: true, message: '请输入自用面积' }], initialValue: params.selfUserArea }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">占地面积(㎡)：</label>
                <a-input-number :min="0" :max="9999999.9999" :step="0.0001" placeholder="请输入占地面积" :style="allWidth" v-decorator="['occupationArea', { rules: [{ required: true, message: '请输入占地面积' }], initialValue: params.occupationArea }]" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <span class="section-title blue">其他信息</span>
        <div class="playground-row">
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">债券金额(元)：</label>
                <a-input-number :min="0" :max="9999999.99" :step="0.01" placeholder="请输入债券金额" :style="allWidth" v-decorator="['creditorAmount', { rules: [{ required: false, message: '请输入债券金额' }], initialValue: params.creditorAmount }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">债务金额(元)：</label>
                <a-input-number :min="0" :max="9999999.99" :step="0.01" placeholder="请输入债务金额" :style="allWidth" v-decorator="['debtAmount', { rules: [{ required: false, message: '请输入债务金额' }], initialValue: params.debtAmount }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="是否质押：" v-bind="formItemLayout">
                <label slot="label">是否质押：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择是否质押"
                  v-decorator="[
                    'pledge',
                    {
                      rules: [{ required: false, message: '请选择是否质押' }],
                      initialValue: params.pledge,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="assetTypeFn"
                >
                  <a-select-option :title="item.name" v-for="item in lawsuitList" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="是否抵押：" v-bind="formItemLayout">
                <label slot="label">是否抵押：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择是否抵押"
                  v-decorator="[
                    'mortgage',
                    {
                      rules: [{ required: false, message: '请选择是否抵押' }],
                      initialValue: params.mortgage,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="assetTypeFn"
                >
                  <a-select-option :title="item.name" v-for="item in lawsuitList" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="是否涉诉：" v-bind="formItemLayout">
                <label slot="label">是否涉诉：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择是否涉诉"
                  v-decorator="[
                    'lawsuit',
                    {
                      rules: [{ required: false, message: '请选择是否涉诉' }],
                      initialValue: params.lawsuit,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="lawsuitChange"
                >
                  <a-select-option :title="item.name" v-for="item in lawsuitList" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-show="lawsuitRemarkShow">
            <a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">诉讼情况：</label>
                <a-textarea placeholder="请输入诉讼情况" :style="widthBox" :autosize="{ minRows: 2, maxRows: 4 }" v-decorator="['lawsuitRemark', { rules: [{ required: false, max: 500, message: '请输入诉讼情况(不超过500字符)' }], initialValue: params.lawsuitRemark }]" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <a-modal title="转运营日期" :visible="timeShow" :confirm-loading="false" @ok="handleOk" @cancel="handleCancel">
        <a-calendar :fullscreen="false" v-model="transferTimeTemp" />
      </a-modal>
    </SG-Modal>
  </div>
</template>
<script>
import { debounce } from 'utils/utils'
import _ from 'lodash'
import moment from 'moment'
const formItemTextarea = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const params = {
  assetType: '1', // 资产类型
  assetName: '', // 资产名称
  assetCode: '', // 资产编码
  buildId: '', // 楼栋id
  area: 0, // 建筑面积 需根据选择的楼栋已经房屋自动带出来展示；---只读，不可修改 选择楼栋时为buildArea 选择房间为area
  buildName: '', // 楼栋名称
  houseNumber: '', // 房间id
  houseName: '', // 房间名称
  objectType: '', // 该值 如果选了楼栋 则为buildType 选了房间，则为houseType
  province: '',
  city: '',
  region: '',
  address: '',
  decorationSituation: '', // 装修情况
  originalValue: '', // 资产原值
  marketValue: '', // 市场价值
  sourceMode: '', // 来源方式 原来的值为sourceType
  kindOfRight: '',
  kindOfRightName: '', // 权属类型
  ownershipStatus: '',
  ownershipStatusName: '', // 权属情况
  warrantNbr: '', // 权证号
  transferOperationTime: '', // 转运营日期
  transferOperationArea: '', //  运营面积
  otherArea: '', // 其他面积
  idleArea: '', // 闲置面积
  selfUserArea: '', // 自用面积
  occupationArea: '', // 占地面积
  creditorAmount: '', //债券金额
  debtAmount: '', // 债务金额
  pledge: '', // 是否质押
  mortgage: '', // 是否抵押
  lawsuit: '', // 是否涉诉 /lawsuitName
  lawsuitRemark: '', //诉讼情况
}
export default {
  props: {
    organId: {
      type: [String, Number],
      default: '',
    },
    // 资产项目id
    projectId: {
      type: [String, Number],
      default: '',
    },
    sourceType: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      show: true,
      assetCodeDisabled: true,
      form: this.$form.createForm(this),
      searchName: '',
      positionNameData: [], // 楼栋列表
      houseList: [], // 房间列表
      assetSourceOptions: [], // 来源方式列表
      ownershipData: [], // 权属类型列表
      buildAddress: '', //坐落位置 需根据选择的房间自动带出来展示；---只读，不可修改
      assetTypeData: [{ name: '房屋', value: '1' }], // 资产类型
      ownershipStatusList: [
        { name: '无证', value: '0' },
        { name: '有证', value: '1' },
        { name: '待办', value: '2' },
      ], // 权属情况
      lawsuitList: [
        { name: '是', value: '1' },
        { name: '否', value: '0' },
      ], // 是否涉诉
      params: _.cloneDeep(params),
      allWidth: 'width: 160px',
      widthBox: 'width: 80%',
      formItemTextarea,
      formItemLayout,
      warrantNbrShow: false,
      timeShow: false,
      transferTime: '',
      transferTimeTemp: '',
      lawsuitRemarkShow: false,
    }
  },
  watch: {
    show(val) {
      if (!val) this.$parent.modelStatus = false
    },
    sourceType: {
      handler(val) {
        if (val) this.params.sourceMode = val + ''
      },
      immediate: true,
    },
  },
  computed: {
    assetTitle() {
      return '楼栋名称'
    },
  },
  mounted() {
    // this.platformDictFn() // 获取资产类型
    this.debounceMothed() // 获取楼栋列表
    this.getAssetSourceOptions() // 获取资产来源下拉列表
    this.ownershipFn() // 获取权属类型
  },
  methods: {
    moment,
    // 获取资产编码
    getAssetCode() {
      const params = {
        assetType: '1',
        projectId: this.projectId + '',
        organId: this.organId,
        resId: this.params.houseNumber || this.params.buildId,
      }
      this.$api.assets.getAssetCode(params).then(res => {
        if (res.data.code === '0') {
          this.params.assetCode = res.data.data
        }
      })
    },

    // 权属类型
    ownershipFn() {
      this.$api.assets.platformDict({ code: 'AMS_ASSET_KIND_OF_RIGHT' }).then(res => {
        if (Number(res.data.code) === 0) {
          this.ownershipData = [...res.data.data]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取资产来源下拉列表
    getAssetSourceOptions() {
      let form = {
        code: 'ams_source_type',
      }
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              name: item.name,
              value: item.value,
            }
            arr.push(obj)
          })
          this.assetSourceOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 选择楼栋
    handlePositionId(value) {
      this.params.buildId = value
      // 获取房间列表
      this.queryHouseByPage()
      //查询建筑面积和坐落位置字段
      this.queryBuildDetail(value)
      // 获取资产编码
      this.getAssetCode()
    },
    // 搜索楼栋
    handleSearch(value) {
      this.searchName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
      this.positionApiList(this.organId, this.searchName || '')
    }, 200),
    positionApiList(organId, aliasName) {
      // 资产类型是车场
      if (this.params.assetType === '5') {
        const requestData = {
          organId: this.topOrganId || organId,
          onlyCurrentNode: 1,
          nameOrCode: aliasName,
          pageNo: 1,
          pageLength: 20,
        }
        this.$api.building.parkApiList(requestData).then(value => {
          if (value.data.code === '0') {
            let result = value.data ? value.data.data.resultList : []
            this.positionNameData = result.map(item => {
              return {
                name: item.placeName,
                value: item.placeId,
                type: item.buildType,
              }
            })
          }
        })
      } else {
        this.$api.basics
          .positionApiList({
            organId,
            aliasName: aliasName || '',
            positionType: this.params.assetType,
            subPositionType: '',
          })
          .then(res => {
            if (res.data.code === '0') {
              let result = res.data.data || []
              this.positionNameData = result.map(item => {
                return {
                  value: item.objectId,
                  name: item.aliasName,
                }
              })
            }
          })
      }
    },
    ownershipStatusChange(value) {
      this.params.ownershipStatusName = this.ownershipStatusList.filter(item => {
        return item.value === value
      })[0].name
      this.warrantNbrShow = value === '1'
    },
    handleOk() {
      this.params.transferOperationTime = moment(this.transferTimeTemp).valueOf()
      this.transferTime = moment(this.transferTimeTemp).format('YYYY-MM-DD')
      this.timeShow = false
    },
    handleCancel() {
      this.timeShow = false
    },
    lawsuitChange(value) {
      this.lawsuitRemarkShow = value === '1'
    },
    assetTypeChange() {},
    houseChange(value) {
      let result = this.houseList.filter(item => {
        return item.value === value
      })[0]
      this.params.objectType = result.type
      this.params.area = result.area
      // 获取资产编码
      this.getAssetCode()
    },
    // 查询房间列表
    queryHouseByPage() {
      this.params.houseNumber = ''
      this.houseList = []
      const queryData = {
        pageNo: 1,
        pageLength: 10000,
        organId: this.organId,
        buildId: this.params.buildId,
      }
      this.$api.building.queryHouseByPage(queryData).then(res => {
        if (res.data.code === '0') {
          this.houseList = res.data.data.map(item => {
            return {
              name: item.houseName,
              value: item.houseId,
              type: item.houseType,
              area: item.area,
            }
          })
        }
      })
    },
    //  查看楼栋详情
    queryBuildDetail(buildId) {
      let data = {
        buildId,
      }
      this.$api.building.queryBuildDetail(data).then(res => {
        if (res.data.code === '0') {
          const { builtArea, buildAddress, province, city, region, address, buildType } = res.data.data
          this.buildAddress = buildAddress // 展示
          this.params.province = province
          this.params.city = city
          this.params.region = region
          this.params.address = address
          this.params.objectType = buildType
          this.params.area = builtArea // 展示
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 提交
    onConfirm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$parent.modelStatus = false
          let obj = _.cloneDeep(values)
          for (const key in this.params) {
            if (!Object.hasOwnProperty.call(obj, key)) {
              obj[key] = this.params[key]
            }
          }
          // type 1楼栋 2房屋
          obj.type = obj.houseNumber ? '2' : '1'
          obj.objectId = obj.houseNumber ? obj.houseNumber : obj.buildId
          this.$emit('submitAsset', _.cloneDeep([].concat(obj)))
        } else {
          this.$message.error('请按照规则填写信息')
        }
      })
    },
    onCancel() {
      this.$parent.modelStatus = false
    },
    assetTypeFn() {},
    // 平台字典获取资产类型
    platformDictFn() {
      let obj = {
        code: 'asset_type',
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetTypeData = [...data]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style lang="less" scoped>
.playground-row {
  margin: 28px 20px 0 20px;
}
.assetCodeBtn {
  width: 160px;
  height: 32px;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
  line-height: 1.5;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>
