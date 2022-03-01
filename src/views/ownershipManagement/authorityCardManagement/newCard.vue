<!--
  选择权证
  organId: 组织机构id
  projectId: 项目id
  queryType: 查询类型 1 资产变动，2 资产清理 3权属登记
  redactCheckedDataFn()    // 外层删除后给回来的数据调这个方法 this.$refs.chooseWarrants.redactCheckedDataFn(this.checkedData)
  this.$refs.assetBundlePopover.show = true    // 弹窗控制
-->
<template>
  <SG-Modal
    :maskClosable="false"
    class="assetBundlePopover"
    width="1036px"
    v-model="show"
    :noPadding="true"
    :title="newData === 'new' ? '权证新增' : '权证编辑'"
    @ok="statusFn"
    @cancel="handleCancel"
  >
  <div class="newCard">
    <div class="newCard-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-form :form="form" @submit="handleSubmit">
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">组织机构：</label>
              <treeSelect
                :allowClear="false"
                :style="allWidth"
                :default="false"
                :defaultOrganName="organName"
                @changeTree="changeTree"
                :placeholder="''"
                v-decorator="['organId', { rules: [{ required: true, message: '请选择组织机构' }],initialValue:organId}]"
              ></treeSelect>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">权证号：</label>
              <a-input placeholder="请输入权证号"
              :disabled="setType === 'edit'"
              :style="allWidth"
              :maxLength="30"
              v-decorator="['warrantNbr', {rules: [{required: true, max: 30, whitespace: true, message: '请输入权证号(不超过30字符)'}], initialValue: newCardData.warrantNbr}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">权属形式：</label>
              <a-select :style="allWidth" showSearch placeholder="请选择权属形式"
              optionFilterProp="children"
              :options="$addTitle(ownerTypeData)"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="['ownerType',{ rules: [{required: true, message: '请选择权属形式'}], initialValue: newCardData.ownerType}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">权证类型：</label>
              <a-select :style="allWidth" showSearch placeholder="请选择权证类型"
              :disabled="setType === 'edit'"
              optionFilterProp="children"
              :options="$addTitle(kindOfRightData)"
               @change="kindOfRightChange"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="['kindOfRight',{ rules: [{required: true, message: '请选择权证类型'}], initialValue: newCardData.kindOfRight}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">实际产权单位：</label>
               <a-input
                :style="allWidth"
                placeholder="请输入实际产权单位"
                v-decorator="['propertyRightUnit', {rules: [{required: false}], initialValue: newCardData.propertyRightUnit}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">实际保管单位：</label>
              <a-input
                :style="allWidth"
                placeholder="请输入实际保管单位"
                v-decorator="['safekeepUnit', {rules: [{required: false}], initialValue: newCardData.safekeepUnit}]"/>
            </a-form-item>
          </a-col>
          <!-- beat -->
          <!-- -----------------------------------------------------------21212------------------------------------------------------------->
          <!-- 基本输入框 -->
          <a-col class="playground-col" v-for="(item, index) in beat" :key="index" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false" v-if="item.formType === 'input'">
              <label slot="label">{{item.label}}：</label>
              <a-input :placeholder="`请输入${item.label}`"
              :style="allWidth"
              :max=item.max
              :maxLength="item.max"
              v-decorator="[item.attrCode, {rules: [{required: item.required, max: item.max, whitespace: true, message: `请输入${item.label}(不超过${item.max}字符)`}], initialValue: item.attrValue}]"/>
            </a-form-item>
            <!-- 数字输入框 -->
            <a-form-item v-bind="formItemLayout" :colon="false" v-if="item.formType === 'inputNumber'">
              <label slot="label">{{item.label}}：</label>
              <a-input-number :placeholder="`请输入${item.label}`"
                :style="allWidth"
                :min=item.min :max=item.max :step="1.00" :precision=item.precision
                v-decorator="[item.attrCode, {rules: [{required: item.required, message: `请输入${item.label}(范围${item.min}-${item.max})`}], initialValue: item.attrValue}]"/>
            </a-form-item>
            <!-- 选择框 -->
            <a-form-item v-bind="formItemLayout" :colon="false" v-if="item.formType === 'selcet'">
              <label slot="label">{{item.label}}：</label>
              <a-select :style="allWidth" showSearch :placeholder="`请选择${item.label}`"
              optionFilterProp="children"
              :options="item.chooseArray"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="[item.attrCode,{ rules: [{required: item.required, message: `请选择${item.label}`}], initialValue: item.attrValue || undefined}]"/>
            </a-form-item>
            <!-- 时间选择 -->
            <a-form-item v-bind="formItemLayout" :colon="false" v-if="item.formType === 'date'">
              <label slot="label">{{item.label}}：</label>
              <a-date-picker
              :style="allWidth"
              :placeholder="`请选择${item.label}`"
              v-decorator="[item.attrCode, {rules: [{type: 'object', required: item.required, message: `请选择${item.label}`}], initialValue: item.attrValue || undefined}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item v-bind="formItemTextarea" :colon="false">
              <label slot="label">附记：</label>
              <a-textarea
                placeholder="请输入附记"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
                :maxLength="200"
                v-decorator="['excursus',
                  {rules: [{required: false, max: 200, message: '请输入附记(不超过200字符)'}], initialValue: newCardData.excursus}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item v-bind="formItemTextarea" :colon="false">
              <label slot="label">备注：</label>
              <a-textarea placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
                :maxLength="200"
                v-decorator="['remark',
                {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: newCardData.remark}
                ]"
                />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item v-bind="formItemTextarea" :colon="false">
              <label slot="label">上传附件：</label>
              <SG-UploadFile
                :baseImgURL="configBase.hostImg1"
                :customUpload="customUpload"
                :customDownload="customDownload"
                v-model="newCardData.files"
                type="all"
                :maxSize="20480"
                :max="20"
              />
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
    </div>
    <div class="newCard-nav" v-if="this.typeJudgment === '1' || this.typeJudgment === '3' || this.typeJudgment === '4'">
      <span class="section-title blue">{{this.typeJudgment === '1' || this.typeJudgment === '4' ? '权属人' : '土地使用权人'}}</span>
      <div class="tab-nav table-border">
        <a-table
          :columns="columns"
          :dataSource="amsOwnershipWarrantObligeeList"
          class="custom-table td-pd10"
          :pagination="false"
          >
          <template slot="obligeeId" slot-scope="text, record">
            <!-- @search="handleSearch" -->
            <a-select
              :placeholder="'请选择权属人'" style="width: 120px"
              showSearch
              :defaultValue="record.obligeeId === '' ? undefined : record.obligeeId"
              v-model="record.obligeeId === '' ? record.obligeeId = undefined : record.obligeeId"
              optionFilterProp="children"
              @change="obligeeNameChange(record)"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
              :options="$addTitle(obligeeIdData)"
            />
          </template>
          <template slot="percent" slot-scope="text, record">
            <a-input-number placeholder="占有比例"
              :min="0" :max="100" :step="1.00" :precision="2" v-model="record.percent"
            />
          </template>
          <template slot="operation" slot-scope="text, record">
            <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
          </template>
        </a-table>
      </div>
      <div class="add-information" @click="communityAroundsFn"><a-icon type="plus" class="item-tab-icon"/>添加权属人</div>
    </div>
    <div class="newCard-nav" v-if="this.typeJudgment === '1' || this.typeJudgment === '4'">
      <span class="section-title blue">抵押信息</span>
      <div class="tab-nav table-border">
        <a-table
          :columns="mortgageInformation"
          :dataSource="amsOwnershipWarrantMortgageList"
          class="custom-table td-pd10"
          :pagination="false"
          >
          <template slot="mortgageAmount" slot-scope="text, record">
            <a-input-number placeholder="抵押金额(元)"
              :min="0" :max="999999999.99" :step="1.00" :precision="2" v-model="record.mortgageAmount"
            />
          </template>
          <template slot="pledgee" slot-scope="text, record">
            <a-input placeholder="抵押权人" maxlength="50" v-model="record.pledgee" />
          </template>
          <template slot="mortgageBank" slot-scope="text, record">
            <a-input placeholder="抵押银行" maxlength="50" v-model="record.mortgageBank" />
          </template>
          <template slot="mortgageYear" slot-scope="text, record">
            <a-input placeholder="抵押年限" maxlength="30" v-model="record.mortgageYear" />
          </template>
          <template slot="mortgageName" slot-scope="text, record">
            <a-input placeholder="抵押物名称" maxlength="50" v-model="record.mortgageName" />
          </template>
          <template slot="loanContractName" slot-scope="text, record">
            <a-input placeholder="借款合同编号" maxlength="30" v-model="record.loanContractName" />
          </template>
          <template slot="operation" slot-scope="text, record">
            <span class="postAssignment-icon" @click="mortgageInformationDeleteFn(record)">删除</span>
          </template>
        </a-table>
      </div>
      <div class="add-information" @click="newMortgageInformation"><a-icon type="plus" class="item-tab-icon"/>添加抵押信息</div>
    </div>
  </div>
  </SG-Modal>
</template>

<script>
import TreeSelect from "src/views/common/treeSelect";
// import Cephalosome from '@/components/Cephalosome'
import configBase from "@/config/config.base";
import moment from 'moment'
import {debounce, utils} from '@/utils/utils'
import {accessCard, titleDeed, newCardData, columns, mortgageInformation, landDeed} from './beat'
import warantAnnex from './warrantAnnex'
import {typeFilter} from '@/views/buildingDict/buildingDictConfig';
const conditionalJudgment = [undefined, null, '']
export default {
  components: {TreeSelect},
  props: {
    queryType: {
      type: [String, Number],
      default: ''
    },
    pageNum: {
      type: Number
    }
  },
  mixins: [warantAnnex],
  data () {
    return {
      typeFilter,
      configBase,
      newData: '',
      setType: '',
      titleDeed: utils.deepClone(titleDeed),
      accessCard: utils.deepClone(accessCard),
      landDeed: utils.deepClone(landDeed),
      warrantId: '',
      typeJudgment: '',        // 权证类型判断 1 不动产
      beat: [],
      mortgageInformation: [...mortgageInformation],  // 抵押信息
      columns: [...columns],
      rigisterDate: {},        // 登记日期
      handoverDate: {},        // 交接日期
      kindOfRightData: [],     // 权证类型
      ownerTypeData: [],       // 权属形式
      ownershipUseData: [],    // 权属用途
      structureData: [],       // 建筑结构
      qualityOfRightData: [],  // 权利性质
      amsOwnershipWarrantObligeeList: [],           // 权属人列表信息
      amsOwnershipWarrantMortgageList: [],          // 抵押信息
      obligeeIdData: [],       // 权属人选择
      obligeeIdDataChange: [], // 用于选择时遍历
      form: this.$form.createForm(this),
      allWidth: 'width: 214px',
      widthBox: 'width: 73.5%',
      newCardData: utils.deepClone(newCardData),
      newCard: '',
      kindOfRightsData: [],
      typeOfRightData:[],      // 权利类型
      show: false,
      organId: '',
      organName:'',
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      }
    }
  },
  computed: {
  },
  watch: {
    'show' (val) {
      if (val === false) {
        this.handleCancel()
      }
    },
    'typeJudgment' () {
      if (this.newData === 'new') {
        if (this.typeJudgment) {
          let arr = []
          if (this.typeJudgment === '1') {
            arr = this.titleDeed
          } else if (this.typeJudgment === '2') {
            arr = this.accessCard
          } else if (this.typeJudgment === '3') {
            arr = this.landDeed
          } else if (this.typeJudgment === '4') {
            arr = this.titleDeed
          }
          arr.forEach(item => {
            if (item.formType === 'input' || item.formType === 'inputNumber') {
              item.attrValue = ''
            } else if (item.formType === 'selcet' || item.formType === 'date') {
              item.attrValue = undefined
            }
          })
          this.beat = arr
        } else {
          // 新增进来全面清空数据
          this.beat = []
          this.form.setFieldsValue({
            warrantNbr: '',  // 权证号
            ownerType: undefined,      // 权属形式
            kindOfRight: undefined, // 权证类型
            propertyRightUnit: '',  // 实际产权单位
            safekeepUnit: '',  // 实际保管单位
            excursus: '', // 附记
            remark: ''  // 备注
          })
          this.newCardData = utils.deepClone(newCardData)
          this.amsOwnershipWarrantObligeeList = []
          this.amsOwnershipWarrantMortgageList = []
        }
      } else {
        if (this.typeJudgment === '1') {
          this.beat = this.titleDeed
        } else if (this.typeJudgment === '2') {
          this.beat = this.accessCard
        } else if (this.typeJudgment === '3') {
          this.beat = landDeed
        }else if (this.typeJudgment === '4') {
          this.beat = this.titleDeed
        }
      }
    }
  },
  methods: {
    changeTree(value, label){
      this.organName = label
      this.organId = value
    },
    // 新增进来清空数据
    newFn (val, id,name) {
      this.newData = val
      this.organId = id
      this.organName = name
      if (val === 'new') {
        this.warrantId = ''
        this.setType = ''
        this.typeJudgment = ''
      }
      this.platformDictFn()  // 字段表获取数据
      this.organDictFn()     // 字段表获取数据
    },
    // 权证类型
    kindOfRightChange (val) {
      this.typeJudgment = val
    },
    // 提交
    statusFn () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let amsOwnershipWarrantObligeeList = []
          let amsOwnershipWarrantMortgageList = []
          if (this.typeJudgment === '1' || this.typeJudgment === '3' || this.typeJudgment === '4') {
            if (this.amsOwnershipWarrantObligeeList.length === 0) {
              this.$message.info('请选择权属人')
              return
            } else {
              // 权属人必填
              let percentTotal = 0
              for (let i = 0; i < this.amsOwnershipWarrantObligeeList.length; i++) {
                if (!this.amsOwnershipWarrantObligeeList[i].obligeeId) {
                  this.$message.info('请选择权属人')
                  return
                }
                if (!this.amsOwnershipWarrantObligeeList[i].percent) {
                  this.$message.info('请输入占用比例')
                  return
                }
                percentTotal = percentTotal + this.amsOwnershipWarrantObligeeList[i].percent
                amsOwnershipWarrantObligeeList.push({
                  obligeeId: this.amsOwnershipWarrantObligeeList[i].obligeeId,
                  percent: this.amsOwnershipWarrantObligeeList[i].percent
                })
              }
              if (percentTotal !== 100) {
                percentTotal = 0
                this.$message.info('权属人的占比总和必须等于100%')
                return
              }
            }
          }
          if (this.typeJudgment === '1' || this.typeJudgment === '4') {
            // 抵押信息
            if (this.amsOwnershipWarrantMortgageList.length > 0) {
              for (let i = 0; i < this.amsOwnershipWarrantMortgageList.length; i++) {
                if (conditionalJudgment.includes(this.amsOwnershipWarrantMortgageList[i].mortgageAmount)) {
                  this.$message.info('请输入抵押金额')
                  return
                }
                if (!this.amsOwnershipWarrantMortgageList[i].pledgee) {
                  this.$message.info('请输入抵押权人')
                  return
                }
                if (!this.amsOwnershipWarrantMortgageList[i].mortgageBank) {
                  this.$message.info('请输入抵押银行')
                  return
                }
                if (!this.amsOwnershipWarrantMortgageList[i].mortgageYear) {
                  this.$message.info('请输入抵押年限')
                  return
                }
                if (!this.amsOwnershipWarrantMortgageList[i].mortgageName) {
                  this.$message.info('请输入抵押物名称')
                  return
                }
                if (!this.amsOwnershipWarrantMortgageList[i].loanContractName) {
                  this.$message.info('请输入借款合同编码')
                  return
                }
                amsOwnershipWarrantMortgageList.push({
                  mortgageAmount: this.amsOwnershipWarrantMortgageList[i].mortgageAmount,
                  pledgee: this.amsOwnershipWarrantMortgageList[i].pledgee,
                  mortgageBank: this.amsOwnershipWarrantMortgageList[i].mortgageBank,
                  mortgageYear: this.amsOwnershipWarrantMortgageList[i].mortgageYear,
                  mortgageName: this.amsOwnershipWarrantMortgageList[i].mortgageName,
                  loanContractName: this.amsOwnershipWarrantMortgageList[i].loanContractName
                })
              }
            }
          }
          // 附件
          let files = []
          if (this.newCardData.files.length > 0) {
            this.newCardData.files.forEach(list => {
              files.push({
                // fileSources 回显的时候对数据初始化，如果无 则代表新数据 传1
                fileSources: [undefined,null].includes(list.fileSources) ? 1 : list.fileSources,
                attachmentPath: list.url,
                oldAttachmentName: list.name,
                originName: list.name
              })
            })
          }
          let obj = {
            warrantId: this.warrantId,                                                                                // 权证id
            rightType:  conditionalJudgment.includes(values.rightTypeName) ? '' : values.rightTypeName,               // 权利类型
            warrantNbr: conditionalJudgment.includes(values.warrantNbr) ? '' : values.warrantNbr,                     // 权证号
            ownerType: conditionalJudgment.includes(values.ownerType) ? '' : values.ownerType,                        // 权属形式
            kindOfRight: conditionalJudgment.includes(values.kindOfRight) ? '' : values.kindOfRight,                  // 权证类型
            propertyRightUnit: conditionalJudgment.includes(values.propertyRightUnit) ? '' : values.propertyRightUnit,// 实际产权单位
            safekeepUnit: conditionalJudgment.includes(values.safekeepUnit) ? '' : values.safekeepUnit,               // 实际保管单位
            lotNo: conditionalJudgment.includes(values.lotNo) ? '' : values.lotNo,                              // 丘地号(产权证所有)
            estateUnitCode: conditionalJudgment.includes(values.estateUnitCode) ? '' : values.estateUnitCode,   // 不动产单元号(产权证所有)
            seatingPosition: conditionalJudgment.includes(values.seatingPosition) ? '' : values.seatingPosition, // 坐落位置
            landArea: conditionalJudgment.includes(values.landArea) ? '' : values.landArea,                     // 土地面积(产权证所有)
            ownershipUse: conditionalJudgment.includes(values.ownershipUse) ? '' : values.ownershipUse,         // 权属用途
            structure: conditionalJudgment.includes(values.structure) ? '' : values.structure,                  // 建筑结构
            buildArea: conditionalJudgment.includes(values.buildArea) ? '' : values.buildArea,                  // 建筑面积
            exclusiveBuildArea: conditionalJudgment.includes(values.exclusiveBuildArea) ? '' : values.exclusiveBuildArea,        // 专有建筑面积
            apportionArea: conditionalJudgment.includes(values.apportionArea) ? '' : values.apportionArea,       //  分摊面积
            totalSuite: conditionalJudgment.includes(values.totalSuite) ? '' : values.totalSuite,                //  总套数(产权证所有)
            qualityOfRight: conditionalJudgment.includes(values.qualityOfRight) ? '' : values.qualityOfRight,    // 权利性质(产权证所有)
            useLimitDate: conditionalJudgment.includes(values.useLimitDate) ? '' : values.useLimitDate,          // 使用期限(产权证所有)
            houseProveLife: conditionalJudgment.includes(values.houseProveLife) ? '' : values.houseProveLife,          // 房产证使用年限(产权证所有)
            houseStartDate: conditionalJudgment.includes(values.houseStartDate) ? '' : `${values.houseStartDate.format('YYYY-MM-DD')}`,          // 房产证起始日期(产权证所有)
            houseEndDate: conditionalJudgment.includes(values.houseEndDate) ? '' : `${values.houseEndDate.format('YYYY-MM-DD')}`,          // 房产证截止日期(产权证所有)

            rigisterDate: conditionalJudgment.includes(values.rigisterDate) ? '' : `${values.rigisterDate.format('YYYY-MM-DD')}`,                // 登记日期
            organId: this.organId,                                                 // 组织机构
            remark: conditionalJudgment.includes(values.remark) ? '' : values.remark,                            // 备注
            excursus: conditionalJudgment.includes(values.excursus) ? '' : values.excursus,                      // 附记
            handoverDate: conditionalJudgment.includes(values.handoverDate) ? '' : `${values.handoverDate.format('YYYY-MM-DD')}`,  // 交接日期
            houseOwner: conditionalJudgment.includes(values.houseOwner) ? '' : values.houseOwner,                // 房屋所有权人(使用权证所有)
            tenant: conditionalJudgment.includes(values.tenant) ? '' : values.tenant,                            // (使用权证所有)
            entrustOrganization: conditionalJudgment.includes(values.entrustOrganization) ? '' : values.entrustOrganization,        // 委托管理单位(使用权证所有)
            totalFloor: conditionalJudgment.includes(values.totalFloor) ? '' : values.totalFloor,                 // 总层数(使用权证所有)
            placeFloor: conditionalJudgment.includes(values.placeFloor) ? '' : values.placeFloor,                 // 所在层(使用权证所有)
            houseNo: conditionalJudgment.includes(values.houseNo) ? '' : values.houseNo,                          // 房屋号(使用权证所有)
            rentUnitPice: conditionalJudgment.includes(values.rentUnitPice) ? '' : values.rentUnitPice,           // 租金单价(使用权证所有)
            rentTotalPrice: conditionalJudgment.includes(values.rentTotalPrice) ? '' : values.rentTotalPrice,     // 租金总价(使用权证所有)
            contractData: conditionalJudgment.includes(values.contractData) ? '' : values.contractData,           // 合同期限(使用权证所有)
            talkUnitPrice: conditionalJudgment.includes(values.talkUnitPrice) ? '' : values.talkUnitPrice,        // 议价单价(使用权证所有)
            talkTotalPrice: conditionalJudgment.includes(values.talkTotalPrice) ? '' : values.talkTotalPrice,     // 议价租金总价(使用权证所有)
            rentPayDate: conditionalJudgment.includes(values.rentPayDate) ? '' : values.rentPayDate,              // 租金缴纳期限(使用权证所有)
            antenatal: conditionalJudgment.includes(values.antenatal) ? '' : values.antenatal,                    // 产别(使用权证所有)
            useArea: conditionalJudgment.includes(values.useArea) ? '' : values.useArea,                          // 使用面积(使用权证所有)
            landNumber: conditionalJudgment.includes(values.landNumber) ? '' : values.landNumber,                 // 地号
            picNumber: conditionalJudgment.includes(values.picNumber) ? '' : values.picNumber,                    // 图号
            landCategory: conditionalJudgment.includes(values.landCategory) ? '' : values.landCategory,           // 地类(用途)
            getPrice: conditionalJudgment.includes(values.getPrice) ? '' : values.getPrice,                       // 取得价格
            useCategory: conditionalJudgment.includes(values.useCategory) ? '' : values.useCategory,              // 使用权类型
            useArea: conditionalJudgment.includes(values.useArea) ? '' : values.useArea,                          // 使用权面积
            exclusiveArea: conditionalJudgment.includes(values.exclusiveArea) ? '' : values.exclusiveArea,        // 独用面积
            terminationData: conditionalJudgment.includes(values.terminationData) ? '' : `${values.terminationData.format('YYYY-MM-DD')}`,  // 终止日期
            tenantId: conditionalJudgment.includes(values.tenantId) ? '' : values.tenantId,                       // 承租人id
            amsAttachmentList: files,                        // 附件
            amsOwnershipWarrantObligeeList: amsOwnershipWarrantObligeeList,
            amsOwnershipWarrantMortgageList: amsOwnershipWarrantMortgageList,
            rightType: !isNaN(Number(values.rightTypeName)) ? values.rightTypeName : (values.rightTypeName == '国有建设用地使用权' ? 3 : (values.rightTypeName == '房屋所有权' ? 2 : 1))
          }
          let loadingName = this.SG_Loding('保存中...')
          this.$api.ownership.warrantSaveOrUpdate(obj).then(res => {
          if (Number(res.data.code) === 0) {
            let _this = this
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.success('提交成功')
              _this.handleCancel('success')
            })
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$message.error(res.data.message)
            })
          }
        })
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        } else {
          // console.log('Received values of form: ', values)
        }
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 关闭弹窗
    handleCancel (str) {
      if (str === 'success') {
        this.$emit('successQuery', this.pageNum)
      }
      this.show = false
      this.$emit('showFn', this.show)
    },
    // 平台字典获取数据
    platformDictFn () {
      Promise.all([
        this.$api.assets.platformDict({code: 'AMS_OWNER_TYPE'}),
        this.$api.assets.platformDict({code: 'AMS_KIND_OF_RIGHT'}),
        this.$api.assets.organDict({code: 'OWNERSHIP_USE', organId: this.organId}),
        this.$api.assets.platformDict({code: 'BUILD_STRUCT'}),
        this.$api.assets.organDict({code: 'QUALITY_OF_RIGHT', organId: this.organId})
      ]).then(res => {
        // 权属形式
        if (+res[0].data.code === 0) {
          let data = res[0].data.data
          let arr = []
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.ownerTypeData = arr
        }
        // 权证类型
        if (+res[1].data.code === 0) {
          let data = res[1].data.data
          let arr = []
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          let temp = [{label:'不动产证', value:'1'}, {label:'使用权证', value:'2'}, {label:'土地使用权证', value:'3'}, {label:'房屋产权证', value:'3'}] // 临时本地模拟数据
          this.kindOfRightData = arr.length < 3 ? temp : arr
        }
        // 权属用途
        if (+res[2].data.code === 0) {
          let data = res[2].data.data
          let arr = []
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.ownershipUseData = arr
        }
        // 建筑建筑结构
        if (+res[3].data.code === 0) {
          let data = res[3].data.data
          let arr = []
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.structureData = arr
        }
        // 权利性质
        if (+res[4].data.code === 0) {
          let data = res[4].data.data
          let arr = []
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.qualityOfRightData = arr
        }
        this.titleDeed.forEach(item => {
          // 权属用途
          if (item.attrCode === 'ownershipUse') {
            item.chooseArray = this.ownershipUseData
          }
          // 建筑结构
          if (item.attrCode === 'structure') {
            item.chooseArray = this.structureData
          }
          // 权利性质
          if (item.attrCode === 'qualityOfRight') {
            item.chooseArray = this.qualityOfRightData
          }
        })
        this.accessCard.forEach(item => {
          // 权属用途
          if (item.attrCode === 'ownershipUse') {
            item.chooseArray = this.ownershipUseData
          }
          // 建筑结构
          if (item.attrCode === 'structure') {
            item.chooseArray = this.structureData
          }
        })
      })
    },
    // 机构字典获取数据
    organDictFn () {
      this.$api.assets.organDict({code: 'AMS_RIGHT_TYPE', organId:1300}).then(res => {
        console.log(res)
        if (res.data.code == 0) {
          let data = res.data.data
          let arr = []
          let temp = [{ value: 1, label: '国有建设用地使用权/房屋所有权' }, {value: 2, label: '-/房屋所有权'}, {value: 3, label: '国有建设用地使用权/-' }]
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.titleDeed.forEach(item => {
            if(item.attrCode === 'rightTypeName'){
                if(arr.length < 3){
                  item.chooseArray = temp
                }else{
                  item.chooseArray = arr
                }
                console.log(item.chooseArray )
            }
          })
        }
      })
    },
    // 权属人
    handleSearch (value) {
      this.obligeeName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求权属人
    debounceMothed: debounce(function () {
        this.selectFn(this.obligeeName || '')
    }, 200),
    // 权属人
    selectFn (buildName) {
      let obj = {
        organId: this.organId,
        obligeeName: buildName || ''
      }
      this.$api.assets.select(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.obligeeIdDataChange = data  // 用于选择时遍历
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.obligeeName,
              label: item.obligeeName,
              value: item.obligeeId
            })
          })
          this.obligeeIdData = arr
          this.accessCard.forEach(item => {
            // 承租人
            if (item.attrCode === 'tenantId') {
              item.chooseArray = arr
            }
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 添加权属人
    communityAroundsFn () {
      let atr = [{ obligeeId: '', certificateTypeName: '', certificateNo: '', percent: '', operation: ''}]
      let arr = [...this.amsOwnershipWarrantObligeeList, ...atr]
      console.log(arr)
      arr.forEach((item, index) => {
        item.key = index
      })
      this.amsOwnershipWarrantObligeeList = arr
    },
    // 监听选择权利人
    obligeeNameChange (record, type) {
      for (let i = 0; i < this.amsOwnershipWarrantObligeeList.length; i++) {
        if (this.amsOwnershipWarrantObligeeList[i].obligeeId === record.obligeeId && record.key !== this.amsOwnershipWarrantObligeeList[i].key) {
          this.$set(this.amsOwnershipWarrantObligeeList, record.key, Object.assign(this.amsOwnershipWarrantObligeeList[record.key], {
            obligeeId: '',
            certificateTypeName: '',
            certificateNo: '',
            percent: ''
          }))
          this.$message.info('权属人不能重复选择')
          return
        }
      }
      let obligeeId = record.obligeeId
      let certificateTypeNames = ''
      let certificateNos = ''
      this.obligeeIdDataChange.forEach(item => {
        if (obligeeId === item.obligeeId) {
          certificateTypeNames = item.certificateTypeName
          certificateNos = item.certificateNo
        }
      })
      // 选择权利人带出证件种类证件号
      this.$set(this.amsOwnershipWarrantObligeeList, record.key, Object.assign(this.amsOwnershipWarrantObligeeList[record.key], {
        certificateTypeName: certificateTypeNames,
        certificateNo: certificateNos
      }))
    },
    // 权利人删除
    deleteFn (record) {
      this.amsOwnershipWarrantObligeeList.forEach((item, index) => {
        if (record.key === item.key) {
          this.amsOwnershipWarrantObligeeList.splice(index, 1)
        }
      })
    },
    // 抵押信息添加
    newMortgageInformation () {
      let atr = [{ mortgageAmount: '', pledgee: '', mortgageBank: '', mortgageYear: '', mortgageName: '', loanContractName: '', operation: ''}]
      let arr = [...this.amsOwnershipWarrantMortgageList, ...atr]
      console.log(arr)
      arr.forEach((item, index) => {
        item.key = index
      })
      this.amsOwnershipWarrantMortgageList = arr
    },
    // 抵押信息删除
    mortgageInformationDeleteFn (record) {
      this.amsOwnershipWarrantMortgageList.forEach((item, index) => {
        if (record.key === item.key) {
          this.amsOwnershipWarrantMortgageList.splice(index, 1)
        }
      })
    },
    // 编辑查询
    query ({warrantId}) {
      this.show = true
      this.setType = 'edit'
      this.warrantId = warrantId
      this.$api.ownership.warrantDetail({warrantId}).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.typeJudgment = String(data.amsOwnershipWarrant.kindOfRight)  // 判断类型
          this.$nextTick(() => {
            // 公共的
            this.form.setFieldsValue({
              warrantNbr: data.amsOwnershipWarrant.warrantNbr,  // 权证号
              ownerType: String(data.amsOwnershipWarrant.ownerType),      // 权属形式
              kindOfRight: String(data.amsOwnershipWarrant.kindOfRight), // 权证类型
              remark: data.amsOwnershipWarrant.remark,  // 备注
              excursus: data.amsOwnershipWarrant.excursus,  // 附记
              exclusiveBuildArea: data.amsOwnershipWarrant.exclusiveBuildArea,  // 专有建筑面积
              apportionArea: data.amsOwnershipWarrant.apportionArea,  // 分摊面积
              ownershipUse: conditionalJudgment.includes(data.amsOwnershipWarrant.ownershipUse) ? undefined : String(data.amsOwnershipWarrant.ownershipUse),  // 权属用途
              rigisterDate: conditionalJudgment.includes(data.amsOwnershipWarrant.rigisterDate) ? undefined : moment(data.amsOwnershipWarrant.rigisterDate, 'YYYY-MM-DD'),
              handoverDate: conditionalJudgment.includes(data.amsOwnershipWarrant.handoverDate) ? undefined : moment(data.amsOwnershipWarrant.handoverDate, 'YYYY-MM-DD'),
              structure: conditionalJudgment.includes(data.amsOwnershipWarrant.structure) ? undefined : String(data.amsOwnershipWarrant.structure),     // 建筑结构
              seatingPosition: data.amsOwnershipWarrant.seatingPosition,    // 坐落位置
              propertyRightUnit: data.amsOwnershipWarrant.propertyRightUnit,    // 实际产权单位
              safekeepUnit: data.amsOwnershipWarrant.safekeepUnit,    // 实际保管单位
            })
            if (this.typeJudgment === '1' || this.typeJudgment === '4') {
              this.form.setFieldsValue({
                lotNo: data.amsOwnershipWarrant.lotNo,
                estateUnitCode: data.amsOwnershipWarrant.estateUnitCode,
                landArea: data.amsOwnershipWarrant.landArea,
                buildArea: data.amsOwnershipWarrant.buildArea,
                totalSuite: data.amsOwnershipWarrant.totalSuite,
                qualityOfRight: conditionalJudgment.includes(data.amsOwnershipWarrant.qualityOfRight) ? undefined : String(data.amsOwnershipWarrant.qualityOfRight),
                useLimitDate: data.amsOwnershipWarrant.useLimitDate,
                rightTypeName: data.amsOwnershipWarrant.rightTypeName,
                houseProveLife: data.amsOwnershipWarrant.houseProveLife, // 房产证使用年限
                houseStartDate: conditionalJudgment.includes(data.amsOwnershipWarrant.houseStartDate) ? undefined : moment(data.amsOwnershipWarrant.houseStartDate, 'YYYY-MM-DD'), // 房产证起始日期
                houseEndDate: conditionalJudgment.includes(data.amsOwnershipWarrant.houseEndDate) ? undefined : moment(data.amsOwnershipWarrant.houseEndDate, 'YYYY-MM-DD'), // 房产证截止日期
              })
            } else if (this.typeJudgment === '2') {
              this.form.setFieldsValue({
                houseOwner: data.amsOwnershipWarrant.houseOwner,
                tenantId: data.amsOwnershipWarrant.tenantId,
                entrustOrganization: data.amsOwnershipWarrant.entrustOrganization,
                buildArea: data.amsOwnershipWarrant.buildArea,
                totalFloor: data.amsOwnershipWarrant.totalFloor,
                placeFloor: data.amsOwnershipWarrant.placeFloor,
                houseNo: data.amsOwnershipWarrant.houseNo,
                rentUnitPice: data.amsOwnershipWarrant.rentUnitPice,
                rentTotalPrice: data.amsOwnershipWarrant.rentTotalPrice,
                contractData: data.amsOwnershipWarrant.contractData,
                talkUnitPrice: data.amsOwnershipWarrant.talkUnitPrice,
                talkTotalPrice: data.amsOwnershipWarrant.talkTotalPrice,
                rentPayDate: data.amsOwnershipWarrant.rentPayDate,
                antenatal: data.amsOwnershipWarrant.antenatal,
                useArea: data.amsOwnershipWarrant.useArea
              })
            } else if (this.typeJudgment === '3') {
              this.form.setFieldsValue({
                landNumber: data.amsOwnershipWarrant.landNumber,    // 地号
                picNumber: data.amsOwnershipWarrant.picNumber,     // 图号
                landCategory: String(data.amsOwnershipWarrant.landCategory),  // 地类（用途）
                getPrice: data.amsOwnershipWarrant.getPrice,      // 取得价格
                useCategory: data.amsOwnershipWarrant.useCategory,   // 使用权类型
                useArea: data.amsOwnershipWarrant.useArea,       // 使用权面积
                exclusiveArea: data.amsOwnershipWarrant.exclusiveArea,  // 独用面积
                apportionArea: data.amsOwnershipWarrant.apportionArea,  // 分摊面积
                terminationData: conditionalJudgment.includes(data.amsOwnershipWarrant.terminationData) ? undefined : moment(data.amsOwnershipWarrant.terminationData, 'YYYY-MM-DD'),  // 终止日期
              })
            }
          })
          let files = []
          if (data.amsAttachmentList && data.amsAttachmentList.length > 0) {
              data.amsAttachmentList.forEach(item => {
              files.push({
                fileSources: item.fileSources,
                url: item.attachmentPath,
                name: item.oldAttachmentName,
                attachmentId: item.attachmentId
              })
            })
          }
          this.newCardData.files = files
          // 权属人信息
          data.amsOwnershipWarrantObligeeList.forEach((list, index) => {
            list.key = index
          })
          this.amsOwnershipWarrantObligeeList = data.amsOwnershipWarrantObligeeList
          // 抵押信息
          data.amsOwnershipWarrantMortgageList.forEach((elv, index) => {
            elv.key = index
          })
          this.amsOwnershipWarrantMortgageList = data.amsOwnershipWarrantMortgageList
        } else {
          this.show = false
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.newCard {
  height: 500px;
  overflow-y: scroll;
  padding-bottom: 70px;
  .newCard-nav {
    padding: 40px 70px 0 70px;
    .tab-nav {
      margin: 24px 20px;
    }
  }
  .playground-row {
    margin: 23px 0 0 26px;
  }
  .postAssignment-icon {
    cursor: pointer;
    color: #0084FF;
  }
  .postAssignment-icon:hover {
    color: red;
  }
  .add-information {
    cursor: pointer;
    line-height: 32px;
    text-align: center;
    border:1px dashed #EBF2FF;
    margin: 10px 20px 0 20px;
    .item-tab-icon {
      padding-right: 4px;
    }
  }
  .add-information:hover {
    border:1px dashed #0084FF;
    color: #0084FF;
  }
}
</style>

<style lang="less">
.newCard {
  .ant-form-item-label label:after {
    margin: 0 0 0 2px;
  }
}
</style>
