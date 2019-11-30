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
    width="860px"
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
              <label slot="label">权&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;证&nbsp;&nbsp;&nbsp;&nbsp;号：</label>
              <a-input placeholder="请输入权证号"
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
              optionFilterProp="children"
              :options="kindOfRightData"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="['kindOfRight',{ rules: [{required: true, message: '请选择权利类型'}], initialValue: newCardData.kindOfRight}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">丘地号：</label>
              <a-input placeholder="请输入丘地号"
              :style="allWidth" :max="30"
              v-decorator="['lotNo', {rules: [{required: true, max: 30, whitespace: true, message: '请输入丘地号(不超过30字符)'}], initialValue: newCardData.lotNo}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">不动产单元号：</label>
              <a-input placeholder="请输入不动产单元号"
              :style="allWidth" :max="30"
              v-decorator="['estateUnitCode', {rules: [{required: true, max: 30, whitespace: true, message: '请输入不动产单元号(不超过30字符)'}], initialValue: newCardData.estateUnitCode}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">坐落位置：</label>
              <a-input placeholder="请输入坐落位置"
              :style="allWidth" :max="100"
              v-decorator="['seatingPosition', {rules: [{required: true, max: 100, whitespace: true, message: '请输入坐落位置(不超过100字符)'}], initialValue: newCardData.seatingPosition}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">土地面积：</label>
              <a-input-number placeholder="请输入土地面积"
              :style="allWidth"
              :min="0" :max="9999999.99" :step="1.00" :precision="2"
              v-decorator="['landArea', {rules: [], initialValue: newCardData.landArea}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">权属用途：</label>
              <a-select :style="allWidth" showSearch placeholder="请选择权属用途"
              optionFilterProp="children"
              :options="ownershipUseData"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="['ownershipUse',{rules: [{required: true, message: '请选择权属用途'}], initialValue: newCardData.ownershipUse}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">结构：</label>
              <a-select :style="allWidth" showSearch placeholder="请选择结构"
              optionFilterProp="children"
              :options="structureData"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="['structure',{ rules: [{required: true, message: '请选择结构'}], initialValue: newCardData.structure}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">建筑面积(㎡)：</label>
              <a-input-number placeholder="请输入建筑面积(㎡)"
              :style="allWidth"
              :min="0" :max="9999999.99" :step="1.00" :precision="2"
              v-decorator="['buildArea', {rules: [{required: true, message: '请输入建筑面积(范围0-9999999.99)'}], initialValue: newCardData.buildArea}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">专属建筑面积：</label>
              <a-input-number placeholder="请输入专属建筑面积"
              :style="allWidth"
              :min="0" :max="9999999.99" :step="1.00" :precision="2"
              v-decorator="['exclusiveBuildArea', {rules: [{required: true, message: '请输入专属建筑面积(范围0-9999999.99)'}], initialValue: newCardData.exclusiveBuildArea}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">分摊面积：</label>
              <a-input-number placeholder="请输入分摊面积"
              :style="allWidth"
              :min="0" :max="9999999.99" :step="1.00" :precision="2"
              v-decorator="['apportionArea', {rules: [{required: true, message: '请输入分摊面积(范围0-9999999.99)'}], initialValue: newCardData.apportionArea}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">总套数：</label>
              <a-input-number placeholder="请输入总套数"
              :style="allWidth"
              :min="0" :max="999999" :precision="0" :step="1.00"
              v-decorator="['totalSuite', {rules: [], initialValue: newCardData.totalSuite}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">权利性质：</label>
              <a-select :style="allWidth" showSearch placeholder="请选择权利性质"
              optionFilterProp="children"
              :options="qualityOfRightData"
              :allowClear="true"
              :filterOption="false"
              notFoundContent="没有查询到数据"
              v-decorator="['qualityOfRight',{ rules: [{required: true, message: '请选择权利性质'}], initialValue: newCardData.qualityOfRight}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">使用期限：</label>
              <a-input placeholder="请输入使用期限"
              :style="allWidth"
              :max="50"
              v-decorator="['useLimitDate', {rules: [], initialValue: newCardData.useLimitDate}]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">登记日期：</label>
              <a-date-picker
              :style="allWidth"
              placeholder="请选择登记日期"
              v-decorator="['rigisterDate', {rules: [{type: 'object', required: true, message: '请选择登记日期'}]}]"/>
              </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item v-bind="formItemLayout" :colon="false">
              <label slot="label">交接日期：</label>
              <a-date-picker
              :style="allWidth"
              placeholder="请选择交接日期"
              v-decorator="['handoverDate']"/>
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
    <div class="newCard-nav">
      <span class="section-title blue">权利人</span>
      <div class="tab-nav table-border">
        <a-table
          :columns="columns"
          :dataSource="amsOwnershipWarrantObligeeList"
          class="custom-table td-pd10"
          :pagination="false"
          >
          <template slot="obligeeId" slot-scope="text, record">
            <a-select
              :placeholder="'请选择权利人'" style="width: 120px"
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
          <template slot="operation" slot-scope="text, record">
            <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
          </template>
        </a-table>
        <div class="add-information" @click="communityAroundsFn"><a-icon type="plus" class="item-tab-icon"/>新增周边信息</div>
      </div>
    </div>
  </div>
  </SG-Modal>
</template>

<script>
import Cephalosome from '@/components/Cephalosome'
import moment from 'moment'
import {debounce, utils, calc} from '@/utils/utils'
const columns = [
  {
    title: '姓名',
    dataIndex: 'obligeeId',
    width: 160,
    scopedSlots: { customRender: 'obligeeId' }
  }, {
    title: '证件种类',
    width: 100,
    dataIndex: 'certificateTypeName'
  }, {
    title: '证件号',
    width: 100,
    dataIndex: 'certificateNo'
  }, {
    title: '占用比例',
    width: 100,
    dataIndex: 'percent'
  }, {
    title: '操作',
    width: 100,
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
const newCardData = {
  warrantId: '',                //类型：Number  必有字段  备注：权证id
  warrantNbr: '',                //类型：String  必有字段  备注：权证号
  ownerType: undefined,                //类型：Number  必有字段  备注：权属形式
  kindOfRight: undefined,                //类型：Number  必有字段  备注：权利类型
  lotNo: '',                //类型：String  必有字段  备注：丘地号(产权证所有)
  estateUnitCode: '',                //类型：String  必有字段  备注：不动产单元号(产权证所有)
  seatingPosition: '',                //类型：String  必有字段  备注：坐落位置
  landArea: '',                //类型：Number  必有字段  备注：土地面积(产权证所有)
  ownershipUse: undefined,                //类型：String  必有字段  备注：权属用途
  structure: undefined,                //类型：String  必有字段  备注：结构
  buildArea: '',                //类型：Number  必有字段  备注：建筑面积
  exclusiveBuildArea: '',                //类型：Number  必有字段  备注：专属建筑面积
  apportionArea: '',                //类型：Number  必有字段  备注：分摊面积
  totalSuite: '',                //类型：Number  必有字段  备注：总套数(产权证所有)
  qualityOfRight: undefined,                //类型：String  必有字段  备注：权利性质(产权证所有)
  useLimitDate: '',                //类型：String  必有字段  备注：使用期限(产权证所有)
  rigisterDate: {},                //类型：String  必有字段  备注：登记日期
  organId: '',                //类型：String  必有字段  备注：组织机构
  remark: '',                //类型：String  必有字段  备注：备注
  handoverDate: '',                //类型：String  必有字段  备注：交接日期
  houseOwner: '',                //类型：String  必有字段  备注：房屋所有权人(使用权证所有)
  tenant: '',                //类型：String  必有字段  备注：承租人(使用权证所有)
  entrustOrganization: '',                //类型：String  必有字段  备注：委托管理单位(使用权证所有)
  totalFloor: '',                //类型：String  必有字段  备注：总层数(使用权证所有)
  placefloor: '',                //类型：String  必有字段  备注：所在层(使用权证所有)
  houseNo: '',                //类型：String  必有字段  备注：房屋号(使用权证所有)
  rentUnitPrice: '',                //类型：Number  必有字段  备注：租金单价(使用权证所有)
  rentTotalPrice: '',                //类型：Number  必有字段  备注：租金总价(使用权证所有)
  contractData: '',                //类型：String  必有字段  备注：合同期限(使用权证所有)
  talkUnitPrice: '',                //类型：String  必有字段  备注：议价单价(使用权证所有)
  talkTotalPrice: '',                //类型：String  必有字段  备注：议价租金总价(使用权证所有)
  rentPayDate: '',                //类型：String  必有字段  备注：租金缴纳期限(使用权证所有)
  antenatal: '',                //类型：String  必有字段  备注：产别(使用权证所有)
  files: []                      // 附件
}
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
      columns: [...columns],
      rigisterDate: {},        // 登记日期
      handoverDate: {},        // 交接日期
      kindOfRightData: [],     // 权利类型
      ownerTypeData: [],       // 权属形式
      ownershipUseData: [],    // 权属用途
      structureData: [],       // 结构
      qualityOfRightData: [],  // 权利性质
      amsOwnershipWarrantObligeeList: [],           // 权属人列表信息
      obligeeIdData: [],       // 权属人选择
      obligeeIdDataChange: [], // 用于选择时遍历
      form: this.$form.createForm(this),
      allWidth: 'width: 214px',
      widthBox: 'width: 80%',
      newCardData: {...newCardData},
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
    // 'selectedData.projectId' () {
    //   this.query()
    // }
  },
  methods: {
    statusFn () {
      console.log('tijiao')
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
    handleCancel () {
      this.show = false
    },
    // 平台字典获取数据
    platformDictFn () {
      Promise.all([
        this.$api.assets.platformDict({code: 'AMS_OWNER_TYPE'}),
        this.$api.assets.platformDict({code: 'AMS_KIND_OF_RIGHT'}),
        this.$api.assets.platformDict({code: 'OWNERSHIP_USE'}),
        this.$api.assets.platformDict({code: 'BUILD_STRUCT'}),
        this.$api.assets.platformDict({code: 'QUALITY_OF_RIGHT'})
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
        if (+res[2].data.code === 0) {
          let data = res[2].data.data
          let arr = []
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.structureData = arr
        }
        // 权利性质
        if (+res[2].data.code === 0) {
          let data = res[2].data.data
          let arr = []
          data.forEach(item => {
            arr.push({ value: item.value, label: item.name })
          })
          this.qualityOfRightData = arr
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
    // 删除
    deleteFn (record) {
      this.amsOwnershipWarrantObligeeList.forEach((item, index) => {
        if (record.key === item.key) {
          this.amsOwnershipWarrantObligeeList.splice(index, 1)
        }
      })
    },
    query () {
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
    margin-top: 10px;
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