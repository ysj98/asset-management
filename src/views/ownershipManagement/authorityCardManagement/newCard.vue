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
    class="assetBundlePopover"
    width="1036px"
    v-model="show"
    title="选择权证"
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
              <label slot="label">权证号：</label>
              <a-input placeholder="请输入权证号"
              :disabled="setType === 'edit'"
              :style="allWidth"
              :max="60"
              v-decorator="['warrantNbr', {rules: [{required: true, max: 60, whitespace: true, message: '请输入权证号(不超过60字符)'}], initialValue: newCardData.warrantNbr}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">权属形式：</label>
              <a-select :style="allWidth" showSearch placeholder="请选择权属形式"
              optionFilterProp="children"
              :options="ownerTypeData"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="['ownerType',{ rules: [{required: true, message: '请选择权属形式'}], initialValue: newCardData.ownerType}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">权利类型：</label>
              <a-select :style="allWidth" showSearch placeholder="请选择权利类型"
              :disabled="setType === 'edit'"
              optionFilterProp="children"
              :options="kindOfRightData"
               @change="kindOfRightChange"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="['kindOfRight',{ rules: [{required: true, message: '请选择权利类型'}], initialValue: newCardData.kindOfRight}]"/>
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
              :options=item.chooseArray
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
              <label slot="label">备注：</label>
              <a-textarea placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
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
                v-model="newCardData.files"
                type="all"
              />
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
    </div>
    <div class="newCard-nav" v-if="this.typeJudgment === '1'">
      <span class="section-title blue">权属人</span>
      <div class="tab-nav table-border">
        <a-table
          :columns="columns"
          :dataSource="amsOwnershipWarrantObligeeList"
          class="custom-table td-pd10"
          :pagination="false"
          >
          <template slot="obligeeId" slot-scope="text, record">
            <a-select
              :placeholder="'请选择权属人'" style="width: 120px"
              showSearch
              :defaultValue="record.obligeeId === '' ? undefined : record.obligeeId"
              v-model="record.obligeeId === '' ? record.obligeeId = undefined : record.obligeeId"
              optionFilterProp="children"
              @change="obligeeNameChange(record)"
              @search="handleSearch"
              :options="obligeeIdData"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              />
          </template>
          <template slot="percent" slot-scope="text, record">
            <a-input-number placeholder="占有比例"
              :min="1" :max="100" :step="1.00" :precision="0" v-model="record.percent"
            />
          </template>
          <template slot="operation" slot-scope="text, record">
            <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
          </template>
        </a-table>
      </div>
      <div class="add-information" @click="communityAroundsFn"><a-icon type="plus" class="item-tab-icon"/>添加权属人</div>
    </div>
    <div class="newCard-nav" v-if="this.typeJudgment === '1'">
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
      <div class="add-information" @click="newMortgageInformation"><a-icon type="plus" class="item-tab-icon"/>添加权利人</div>
    </div>
  </div>
  </SG-Modal>
</template>

<script>
import Cephalosome from '@/components/Cephalosome'
import moment from 'moment'
import {debounce, utils, calc} from '@/utils/utils'
import {accessCard, titleDeed, newCardData, columns, mortgageInformation} from './beat'

export default {
  components: {Cephalosome},
  props: {
    organId: {
      type: [String, Number],
      default: ''
    },
    queryType: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      setType: '',
      titleDeed: utils.deepClone(titleDeed),
      accessCard: utils.deepClone(accessCard),
      warrantId: '',
      typeJudgment: '',        // 权利类型判断
      beat: [],
      mortgageInformation: [...mortgageInformation],  // 抵押信息
      columns: [...columns],
      rigisterDate: {},        // 登记日期
      handoverDate: {},        // 交接日期
      kindOfRightData: [],     // 权利类型
      ownerTypeData: [],       // 权属形式
      ownershipUseData: [],    // 权属用途
      structureData: [],       // 结构
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
      show: false,
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
        if (this.typeJudgment === '1') {
          this.titleDeed.forEach(item => {
            if (item.formType === 'input' || item.formType === 'inputNumber') {
              item.attrValue = ''
            } else if (item.formType === 'selcet' || item.formType === 'date') {
              item.attrValue = undefined
            }
          })
          this.beat = this.titleDeed
        } else if (this.typeJudgment === '2') {
          this.accessCard.forEach(item => {
            if (item.formType === 'input' || item.formType === 'inputNumber') {
              item.attrValue = ''
            } else if (item.formType === 'selcet' || item.formType === 'date') {
              item.attrValue = undefined
            }
          })
          this.beat = this.accessCard
        } else {
          // 新增进来全面清空数据
          this.beat = []
          this.form.setFieldsValue({
            warrantNbr: '',  // 权证号
            ownerType: undefined,      // 权属形式
            kindOfRight: undefined, // 权利类型
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
        }
      }
    }
  },
  methods: {
    // 新增进来清空数据
    newFn (val) {
      this.warrantId = ''
      this.setType = ''
      this.newData = val
      this.typeJudgment = ''
    },
    // 权利类型
    kindOfRightChange (val) {
      this.typeJudgment = val
    },
    // 提交
    statusFn () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let amsOwnershipWarrantObligeeList = []
          let amsOwnershipWarrantMortgageList = []
          if (this.typeJudgment === '1') {
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
            // 抵押信息
            if (this.amsOwnershipWarrantMortgageList.length > 0) {
              for (let i = 0; i < this.amsOwnershipWarrantMortgageList.length; i++) {
                if (!this.amsOwnershipWarrantMortgageList[i].mortgageAmount) {
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
          let files = []
          if (this.newCardData.files.length > 0) {
            this.newCardData.files.forEach(list => {
              files.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name
              })
            })
          }
          let obj = {
            warrantId: this.warrantId,                                            // 类型：Number  必有字段  备注：权证id
            warrantNbr: values.warrantNbr,                                        // 类型：String  必有字段  备注：权证号
            ownerType: values.ownerType,                                          // 类型：Number  必有字段  备注：权属形式
            kindOfRight: values.kindOfRight,                                      // 类型：Number  必有字段  备注：权利类型
            lotNo: values.lotNo ? values.lotNo : '',                              // 类型：String  必有字段  备注：丘地号(产权证所有)
            estateUnitCode: values.estateUnitCode ? values.estateUnitCode : '',                // 类型：String  必有字段  备注：不动产单元号(产权证所有)
            seatingPosition: values.seatingPosition ? values.seatingPosition : '',             // 类型：String  必有字段  备注：坐落位置
            landArea: values.landArea ? values.landArea : '',                     // 类型：Number  必有字段  备注：土地面积(产权证所有)
            ownershipUse: values.ownershipUse ? values.ownershipUse : '',         // 类型：String  必有字段  备注：权属用途
            structure: values.structure ? values.structure : '',                  // 类型：String  必有字段  备注：结构
            buildArea: values.buildArea ? values.buildArea : '',                  // 类型：Number  必有字段  备注：建筑面积
            exclusiveBuildArea: values.exclusiveBuildArea ? values.exclusiveBuildArea : '',        // 类型：Number  必有字段  备注：专属建筑面积
            apportionArea: values.apportionArea ? values.apportionArea : '',       // 类型：Number  必有字段  备注：分摊面积
            totalSuite: values.totalSuite ? values.totalSuite : '',                // 类型：Number  必有字段  备注：总套数(产权证所有)
            qualityOfRight: values.qualityOfRight ? values.qualityOfRight : '',    // 类型：String  必有字段  备注：权利性质(产权证所有)
            useLimitDate: values.useLimitDate ? values.useLimitDate : '',          // 类型：String  必有字段  备注：使用期限(产权证所有)
            rigisterDate: values.rigisterDate ? `${values.rigisterDate.format('YYYY-MM-DD')}` : '',                // 类型：String  必有字段  备注：登记日期
            organId: this.organId,                                                 // 类型：String  必有字段  备注：组织机构
            remark: values.remark ? values.remark : '',                            // 类型：String  必有字段  备注：备注
            handoverDate: values.handoverDate ? `${values.handoverDate.format('YYYY-MM-DD')}` : '',  // 类型：String  必有字段  备注：交接日期
            houseOwner: values.houseOwner ? values.houseOwner : '',                // 类型：String  必有字段  备注：房屋所有权人(使用权证所有)
            tenant: values.tenant ? values.tenant : '',                            // 类型：String  必有字段  备注：承租人(使用权证所有)
            entrustOrganization: values.entrustOrganization ? values.entrustOrganization : '',        // 类型：String  必有字段  备注：委托管理单位(使用权证所有)
            totalFloor: values.totalFloor ? values.totalFloor : '',                 // 类型：String  必有字段  备注：总层数(使用权证所有)
            placeFloor: values.placeFloor ? values.placeFloor : '',                 // 类型：String  必有字段  备注：所在层(使用权证所有)
            houseNo: values.houseNo ? values.houseNo : '',                          // 类型：String  必有字段  备注：房屋号(使用权证所有)
            rentUnitPice: values.rentUnitPice ? values.rentUnitPice : '',        // 类型：Number  必有字段  备注：租金单价(使用权证所有)
            rentTotalPrice: values.rentTotalPrice ? values.rentTotalPrice : '',     // 类型：Number  必有字段  备注：租金总价(使用权证所有)
            contractData: values.contractData ? values.contractData : '',           // 类型：String  必有字段  备注：合同期限(使用权证所有)
            talkUnitPrice: values.talkUnitPrice ? values.talkUnitPrice : '',        // 类型：String  必有字段  备注：议价单价(使用权证所有)
            talkTotalPrice: values.talkTotalPrice ? values.talkTotalPrice : '',     // 类型：String  必有字段  备注：议价租金总价(使用权证所有)
            rentPayDate: values.rentPayDate ? values.rentPayDate : '',              // 类型：String  必有字段  备注：租金缴纳期限(使用权证所有)
            antenatal: values.antenatal ? values.antenatal : '',                    // 类型：String  必有字段  备注：产别(使用权证所有)
            amsAttachmentList: files,                        // 附件
            amsOwnershipWarrantObligeeList: amsOwnershipWarrantObligeeList,
            amsOwnershipWarrantMortgageList: amsOwnershipWarrantMortgageList
          }
          console.log(obj)
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
        this.$emit('successQuery')
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
        // 权利类型
        if (+res[1].data.code === 0) {
          let data = res[1].data.data
          let arr = []
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.kindOfRightData = arr
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
        // 建筑结构
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
          // 结构
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
          // 结构
          if (item.attrCode === 'structure') {
            item.chooseArray = this.structureData
          }
        })
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
    query (warrantId, warrantNbr) {
      this.show = true
      this.setType = 'edit'
      this.warrantId = warrantId
      this.$api.ownership.warrantDetail({warrantNbr: warrantNbr}).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.typeJudgment = String(data.amsOwnershipWarrant.kindOfRight)  // 判断类型
          this.$nextTick(() => {
            if (this.typeJudgment === '1') {
              this.form.setFieldsValue({
                warrantNbr: data.amsOwnershipWarrant.warrantNbr,  // 权证号
                ownerType: String(data.amsOwnershipWarrant.ownerType),      // 权属形式
                kindOfRight: String(data.amsOwnershipWarrant.kindOfRight), // 权利类型
                remark: data.amsOwnershipWarrant.remark,  // 备注
                lotNo: data.amsOwnershipWarrant.lotNo,
                estateUnitCode: data.amsOwnershipWarrant.estateUnitCode,
                seatingPosition: data.amsOwnershipWarrant.seatingPosition,
                landArea: data.amsOwnershipWarrant.landArea,
                ownershipUse: String(data.amsOwnershipWarrant.ownershipUse),
                structure: String(data.amsOwnershipWarrant.structure),
                buildArea: data.amsOwnershipWarrant.buildArea,
                exclusiveBuildArea: data.amsOwnershipWarrant.exclusiveBuildArea,
                apportionArea: data.amsOwnershipWarrant.apportionArea,
                totalSuite: data.amsOwnershipWarrant.totalSuite,
                qualityOfRight: data.amsOwnershipWarrant.qualityOfRight,
                useLimitDate: data.amsOwnershipWarrant.useLimitDate,
                rigisterDate: moment(data.amsOwnershipWarrant.rigisterDate, 'YYYY-MM-DD'),
                handoverDate: moment(data.amsOwnershipWarrant.handoverDate, 'YYYY-MM-DD')
              })
            } else if (this.typeJudgment === '2') {
              this.form.setFieldsValue({
                warrantNbr: data.amsOwnershipWarrant.warrantNbr,  // 权证号
                ownerType: String(data.amsOwnershipWarrant.ownerType),      // 权属形式
                kindOfRight: String(data.amsOwnershipWarrant.kindOfRight), // 权利类型
                remark: data.amsOwnershipWarrant.remark,  // 备注
                houseOwner: data.amsOwnershipWarrant.houseOwner,
                tenant: data.amsOwnershipWarrant.tenant,
                entrustOrganization: data.amsOwnershipWarrant.entrustOrganization,
                buildArea: data.amsOwnershipWarrant.buildArea,
                exclusiveBuildArea: data.amsOwnershipWarrant.exclusiveBuildArea,
                apportionArea: data.amsOwnershipWarrant.apportionArea,
                seatingPosition: data.amsOwnershipWarrant.seatingPosition,
                ownershipUse: String(data.amsOwnershipWarrant.ownershipUse),
                structure: String(data.amsOwnershipWarrant.structure),
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
                rigisterDate: moment(data.amsOwnershipWarrant.rigisterDate, 'YYYY-MM-DD'),
                handoverDate: moment(data.amsOwnershipWarrant.handoverDate, 'YYYY-MM-DD')
              })
            }
          })
          // 几个单独的字段
          // this.form.setFieldsValue({
          //   warrantNbr: data.amsOwnershipWarrant.warrantNbr,  // 权证号
          //   ownerType: String(data.amsOwnershipWarrant.ownerType),      // 权属形式
          //   kindOfRight: String(data.amsOwnershipWarrant.kindOfRight), // 权利类型
          //   remark: data.amsOwnershipWarrant.remark  // 备注
          // })
          let files = []
          if (data.amsAttachmentList && data.amsAttachmentList.length > 0) {
              data.amsAttachmentList.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName
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
    this.platformDictFn()  // 字段表获取数据
  }
}
</script>
<style lang="less" scoped>
.newCard {
  height: 500px;
  overflow-y: scroll;
  padding-bottom: 70px;
  .newCard-nav {
    padding: 16px 14px 0 14px;
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