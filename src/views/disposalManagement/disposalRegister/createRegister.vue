<!--
 * @Date: 2019-12-31 10:37:21
 * @Description: 新增处置登记
 -->
<template>
  <div class="createRegister">
    <div class="createRegister-nav">
      <span class="section-title blue">基础信息</span>
      <div class="createRegister-obj">
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit">
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="资产处置名称：">
                <a-input placeholder="请输入资产处置名称"
                :style="allWidth"
                :maxLength="30"
                v-decorator="['disposeName', {rules: [{required: true, max: 30, whitespace: true, message: '请输入任务名称(不超过30字符)'}], initialValue: newCardData.disposeName}]"/>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="所属机构：">
                <a-input placeholder="请输入所属机构"
                :style="allWidth"
                :disabled="true"
                v-decorator="['organName', {rules: [{message: '请输入所属机构'}], initialValue: newCardData.organName}]"/>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item label="资产项目：" v-bind="formItemLayout">
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择资产项目"
                  v-decorator="['projectId',{rules: [{required: true, message: '请选择资产项目'}], initialValue: newCardData.projectId}]"
                  :allowClear="false"
                  @change="projectFn"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到资产项目"
                  >
                  <a-select-option v-for="(item) in projectIdData" :key="item.value" :value='item.value'>{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item label="资产类型：" v-bind="formItemLayout">
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择资产类型"
                  v-decorator="['assetType',{rules: [{required: true, message: '请选择资产类型'}], initialValue: newCardData.assetType}]"
                  :allowClear="false"
                  @change="assetTypeFn"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到资产类型"
                  >
                  <a-select-option v-for="(item) in assetTypeData" :key="item.value" :value='item.value'>{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item label="处置类型：" v-bind="formItemLayout">
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择处置类型"
                  v-decorator="['disposeType',{rules: [{required: true, message: '请选择处置类型'}], initialValue: newCardData.disposeType}]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到处置类型"
                  >
                  <a-select-option v-for="(item) in disposeTypeData" :key="item.value" :value='item.value'>{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item label="处置方式：" v-bind="formItemLayout">
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择处置方式"
                  v-decorator="['disposeMode',{rules: [{required: true, message: '请选择处置方式'}], initialValue: newCardData.disposeMode}]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到处置方式"
                  >
                  <a-select-option v-for="(item) in disposeModeData" :key="item.value" :value='item.value'>{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="处置成本(元)：">
                <a-input-number placeholder="请输入处置成本(元)"
                :style="allWidth"
                :min="0"
                :max="999999999.99"
                step="1.00" :precision="2"
                v-decorator="['disposeCost', {rules: [{required: true, message: '请输入处置成本(元)(范围0-999999999.99)'}], initialValue: newCardData.disposeCost}]"/>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="处置收入(元)：">
                <a-input-number placeholder="请输入处置收入(元)"
                :style="allWidth"
                :min="0"
                :max="999999999.99"
                step="1.00" :precision="2"
                v-decorator="['disposeReceive', {rules: [{required: true, message: '请输入处置收入(元)(范围0-999999999.99)'}], initialValue: newCardData.disposeReceive}]"/>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="处置时间：">
                <SG-DatePicker :style="allWidth"
                v-decorator="['disposeDate', {rules: [{required: true, message: '请选择处置时间'}], initialValue: newCardData.disposeDate}]"
                format="YYYY-MM-DD"></SG-DatePicker>
                <!-- <a-date-picker
                :style="allWidth"
                placeholder="请选择处置时间"
                v-decorator="['takeOverDate',
                  {rules: [{required: true, message: '请选择处置时间'}]}
                ]"
                /> -->
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="资产接收人：">
                <a-input placeholder="请输入资产接收人"
                :style="allWidth"
                :maxLength="40"
                v-decorator="['assetReceiver', {rules: [{required: false, max: 50, whitespace: true, message: '请输入资产接收人(不超过40字符)'}], initialValue: newCardData.assetReceiver}]"/>
              </a-form-item>
            </a-col>
            <!-- <a-col class="playground-col" :span="8">
              <a-form-item label="费用分摊方式：" v-bind="formItemLayout">
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择费用分摊方式"
                  v-decorator="['costSharingMode',{rules: [{message: '请选择费用分摊方式'}], initialValue: newCardData.costSharingMode}]"
                  :allowClear="true"
                  @change="changeCostSharingMode"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到费用分摊方式"
                  >
                  <a-select-option v-for="(item) in costSharingModeData" :key="item.value" :value='item.value'>{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemTextarea" :colon="false">
                <label slot="label">上传附件：</label>
                <SG-UploadFile
                  v-model="newCardData.files"
                  type="all"
                />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemTextarea" label="处置原因：">
                <a-textarea placeholder="请输入处置原因"
                  :style="widthBox"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  :maxLength="200"
                  v-decorator="['disposeReason',
                  {rules: [{required: true, max: 200, message: '请输入处置原因(不超过200字符)'}], initialValue: newCardData.disposeReason}
                  ]"
                  />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemTextarea" label="备注：">
                <a-textarea placeholder="请输入备注"
                  :style="widthBox"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  :maxLength="200"
                  v-decorator="['remark',
                  {rules: [{required: false, max: 200, message: '请输入备注(不超过200字符)'}], initialValue: newCardData.remark}
                  ]"
                  />
              </a-form-item>
            </a-col>
          </a-form>
        </a-row>
      </div>
    </div>
    <div class="createRegister-nav">
      <span class="section-title blue">资产处置清单（已选择资产总数: {{table.dataSource.length}})</span>
      <div class="button-box">
        <div class="buytton-nav">
          <SG-Button class="choice" type="primary" weaken @click="addTheAsset">添加资产</SG-Button>
          <SG-Button class="choice" type="primary" weaken @click="quickEntry('1')">快捷录入处置成本</SG-Button>
          <SG-Button class="choice" type="primary" weaken @click="quickEntry('2')">快捷录入处置收入</SG-Button>
        </div>
      </div>
      <div class="createRegister-obj">
        <div class="table-layout-fixed table-border-lr">
          <a-table
            :loading="table.loading"
            :columns="table.columns"
            :dataSource="table.dataSource"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <!-- 处置成本 -->
            <template slot="disposeCost">
              <a class="icon-red" @click="openSubjectModal('cost')">处置成本(元)</a>
            </template>
            <template slot="disposeCost" slot-scope="text, record">
              <a-input-number :min="0" :step="1.00" :max="999999999.99" :precision="2" v-model="record.disposeCost"/>
            </template>
            <!-- 处置收入 -->
            <template slot="disposeReceive">
              <a class="icon-red" @click="openSubjectModal('income')">处置收入(元)</a>
            </template>
            <template slot="disposeReceive" slot-scope="text, record">
              <a-input-number :min="0" :step="1.00" :max="999999999.99" :precision="2" v-model="record.disposeReceive"/>
            </template>
            <!-- 备注 -->
            <template slot="remark" slot-scope="text, record">
              <a-input placeholder="请输入备注" :maxLength="200" v-model="record.remark"/>
            </template>
            <!-- 操作 -->
            <template slot="operation" slot-scope="text, record, index">
              <span class="postAssignment-icon" weaken @click="deleteFn(record, 'property', index)">删除</span>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <div class="createRegister-nav">
      <span class="section-title blue">收付款计划</span>
      <div class="createRegister-obj">
        <div class="table-layout-fixed table-border-lr">
          <a-table
            :loading="receiving.loading"
            :columns="receiving.columns"
            :dataSource="receiving.dataSource"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <!-- 收付款类型 -->
            <template slot="receivecostType" slot-scope="text, record">
              <a-select
                :placeholder="'请选择收付款类型'" style="width: 150px"
                :defaultValue="record.receivecostType === '' ? undefined : record.receivecostType"
                v-model="record.receivecostType === '' ? record.receivecostType = undefined : record.receivecostType"
                optionFilterProp="children"
                :options="receiptPayment"
                :allowClear="true"
                :filterOption="filterOption"
                notFoundContent="没有查询到数据"
                />
            </template>
            <!-- 收款方 -->
            <template slot="payee" slot-scope="text, record">
              <span v-if="record.receivecostType === '1'">--</span>
              <a-input v-else placeholder="请输入收款方" :maxLength="50" v-model="record.payee"/>
            </template>
            <!-- 付款方 -->
            <template slot="payer" slot-scope="text, record">
              <span v-if="record.receivecostType === '2'">--</span>
              <a-input v-else placeholder="请输入付款方" :maxLength="50" v-model="record.payer"/>
            </template>
            <!-- 费用科目 -->
            <template slot="feeSubject" slot-scope="text, record">
              <a-select
                :placeholder="'请选择费用科目'" style="width: 150px"
                :defaultValue="record.feeSubject === '' ? undefined : record.feeSubject"
                v-model="record.feeSubject === '' ? record.feeSubject = undefined : record.feeSubject"
                optionFilterProp="children"
                :options="billConfigOptions"
                :allowClear="true"
                :filterOption="filterOption"
                notFoundContent="没有查询到数据"
                />
            </template>
            <!-- 金额 -->
            <template slot="amount" slot-scope="text, record">
              <a-input-number placeholder="请输入金额"  :min="0" :step="1.00" :max="999999999.99" :precision="2" v-model="record.amount"/>
            </template>
            <!-- 收付款时间 -->
            <template slot="receivecostDate" slot-scope="text, record">
              <a-date-picker v-model="record.receivecostDate"/>
            </template>
            <!-- 跟进人 -->
            <template slot="secondMover" slot-scope="text, record">
              <a-input placeholder="请输入跟进人" :maxLength="30" v-model="record.secondMover"/>
            </template>
            <!-- 备注 -->
            <template slot="remark" slot-scope="text, record">
              <a-input placeholder="请输入备注" :maxLength="200" v-model="record.remark"/>
            </template>
            <!-- 操作 -->
            <template slot="operation" slot-scope="text, record, index">
              <span class="postAssignment-icon" weaken @click="deleteFn(record, 'receiving', index)">删除</span>
            </template>
          </a-table>
        </div>
        <div class="add-information" @click="newMortgageInformation"><a-icon type="plus" class="item-tab-icon"/>添加计划</div>
      </div>
    </div>
    <FormFooter style="border:none;" location="fixed">
      <div>
        <SG-Button type="primary" @click="save">提交</SG-Button>
        <!-- <SG-Button style="margin-left: 12px" type="primary" weaken @click="save('draft')">保存草稿</SG-Button> -->
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
    <div>
      <!-- 选资产 -->
      <assetBundlePopover :organId="organId" queryType="4" ref="assetBundlePopover" @status="status"></assetBundlePopover>
    </div>
    <!-- 批量设置 -->
<!--     <SG-Modal-->
<!--        v-model="show"-->
<!--        width="400px"-->
<!--        title="批量设置"-->
<!--        okText="确定"-->
<!--        @ok="modalFn"-->
<!--      >-->
<!--      <div style="margin: 26px 0">-->
<!--        <span>{{modelTitle}}：</span><a-input-number style="width: 200px" :min="0" :step="1.00" :max="999999999.99" :precision="2" v-model="modelData"/>-->
<!--      </div>-->
<!--      </SG-Modal>-->

<!--    快捷设置  开始-->
    <SG-Modal
            v-model="modalInfo.show"
            width="800px"
            :title="modalInfo.title"
            okText="确定"
            @ok="quickFn"
    >
    <div class="l-modal-container">
      <div class="l-modal-left">
        <div class="l-modal-select">
          <span class="icon-red" v-show="quickInfo.type === '1'">处置成本对象： </span>
          <span class="icon-red" v-show="quickInfo.type === '2'">处置收入对象： </span>
          <a-select v-model="quickInfo.select" style="width: 150px">
            <a-select-option
                    v-for="item in quickInfo.options"
                    :key="item.value"
                    :value="item.value"
            >{{item.label}}</a-select-option>
          </a-select>
        </div>
        <div class="l-modal-radio">
          <div class="l-modal-radio-lable">
            <span class="icon-red">分摊方式： </span>
          </div>
          <div v-show="quickInfo.select === '1'" style="margin-left: 10px;">
            <SG-RadioGroup direction="vertical" v-model="quickInfo.radioValue" style="font-size: 14px;">
              <SG-Radio :value="1">按照资产个数均摊</SG-Radio>
              <SG-Radio :value="2">按照资产面积均摊</SG-Radio>
            </SG-RadioGroup>
          </div>
          <div v-show="quickInfo.select === '2'" style="line-height: 30px;margin-left: 10px;">
            <SG-Radio :checked="true">不分摊，每个资产处置收入相同</SG-Radio>
          </div>
        </div>
      </div>
      <div class="l-modal-right">
        <div class="l-modal-input">
          <span class="icon-red" v-show="quickInfo.type === '1'">处置成本金额(元): </span>
          <span class="icon-red" v-show="quickInfo.type === '2'">处置收入金额(元): </span>
<!--          <a-form-item v-bind="formItemLayout" label="" style="margin-bottom: 0px;margin-left: 5px;">-->
            <a-input-number placeholder="请输入金额(元)"
                            style="width: 190px;"
                            :min="0"
                            :max="999999999.99"
                            v-model="quickInfo.value"
                            step="1.00" :precision="2"
                            v-decorator="['disposeReceive', {rules: [{required: true, message: '请输入处置收入(元)(范围0-999999999.99)'}], initialValue: quickInfo.value}]"/>
<!--          </a-form-item>-->
        </div>
        <div class="l-modal-explain">
          <p>*说明：例如成本对象是所有资产，处置成本金额为100万，5个资产，那么每个资产处置成本为20万</p>
          <p>*说明：例如成本对象是所有资产，处置成本金额为100万，资产01面积为100㎡，资产02面积为300㎡，那么资产001处置成本为25万，资产02处置成本为75万</p>
          <p>*说明：例如成本对象是单个资产，处置成本金额为100万，那么所有的资产处置成本都为100万</p>
        </div>
      </div>
    </div>
    </SG-Modal>
<!--    快捷设置  结束-->
  </div>
</template>

<script>
import {utils} from '@/utils/utils.js'
import FormFooter from '@/components/FormFooter'
import AssetBundlePopover from '../../common/assetBundlePopover'
import moment from 'moment'
import {columns, receivingData, costSharingModeData, receiptPayment, conditionalJudgment} from './beat.js'
export default {
  components: {FormFooter, AssetBundlePopover},
  props: {},
  data () {
    return {
      // 快捷录入弹出框
      modalInfo: {
        title: '',
        show: false,
      },
      // 快捷录入信息
      quickInfo: {
        value: '', // 处置金额
        type: '', // 类型 1 为处置成本  2 处置收入
        select: '1', // 1 所有资产  2 单个资产
        options: [
          {
            label: '所有资产',
            value: '1'
          },
          {
            label: '单个资产',
            value: '2'
          },
        ],
        radioValue: 1
      },
      modelTitle: '',
      modelData: 0,
      show: false,                // 批量设置弹窗显示
      particularsData: '',
      disposeRegisterOrderId: '',  // 处置登记单ID
      projectIdData: [],        // 资产项目
      assetTypeData: [],        // 资产类型
      disposeTypeData: [],      // 处置类型
      disposeModeData: [],      // 处置方式
      costSharingModeData: [...costSharingModeData],   // 分摊
      receiptPayment: [...receiptPayment],             // 收付款类型
      organId: '67',            // 项目id
      type: '',                 // 判断是新增还是编辑
      selectOptList: [],
      widthBox: 'width: 85%',
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      form: this.$form.createForm(this),
      allWidth: 'width: 214px',
      files: [],
      location: '',
      noPageTools: false,
      newCardData: {
        organName: '',                 // 所属机构名称
        disposeName: '',
        projectId: undefined,          // 资产项目
        assetType: undefined,          // 资产类型
        disposeType: undefined,        // 处置类型
        disposeCost: 0,                // 处置成本(元)
        disposeReceive: 0,             // 处置收入
        disposeDate: moment(new Date()),  // 处置时间
        assetReceiver: '',             // 资产接收人
        costSharingMode: undefined,    // 费用分摊方式
        files: [],                     // 附件
      },
      table: {
        columns: [...columns],
        dataSource: [],         // 资产列表表格数据
        loading: false,
      },
      receiving: {             // 首付款的数据
        columns: [...receivingData],
        dataSource: [],         // 资产列表表格数据
        loading: false,
      },
      checkedData: [],         // 存着资产总的数据
      billConfigOptions: []    // 科目
    }
  },
  computed: {
  },
  methods: {
    moment,
    // 快捷录入弹框确认按钮
    quickFn(){
      console.log(this.quickInfo)
    },
    // 快捷录入处置成本、收入按钮
    quickEntry(type) {
      if (type === '1') {
        this.modalInfo.show = true
        this.modalInfo.title = '快捷录入处置成本'
        this.quickInfo.type = type
      } else if (type === '2') {
        this.modalInfo.show = true
        this.modalInfo.title = '快捷录入处置收入'
        this.quickInfo.type = type
      }
    },
    // 弹窗批量设置
    modalFn () {
      this.table.dataSource.forEach(item => {
        this.modelType === 'cost' ? item.disposeCost = this.modelData : item.disposeReceive = this.modelData
      })
      this.show = false
    },
    // 批量设置
    openSubjectModal (str) {
      if (this.table.dataSource.length === 0) {
        this.$message.info('请先选择资产处置清单')
        return
      }
      // 处置成本
      if (str === 'cost') {
        this.modelTitle = '处置成本(元)'
        this.modelType = 'cost'
      } else if (str === 'income') {
        this.modelTitle = '处置收入(元)'
        this.modelType = 'income'
      }
      this.modelData = 0
      this.show = true
    },
    // 取消
    cancel () {
      this.$router.push({path: '/disposalRegister'})
    },
    // 项目监听
    projectFn (val) {
      this.checkedData = []
      this.table.dataSource = []
    },
    assetTypeFn (val) {
      this.checkedData = []
      this.table.dataSource = []
    },
    // 监听费用分摊方式
    changeCostSharingMode (val) {
      console.log(val)
      // this.overallComputing()
    },
    // // 计算总和
    // overallComputing () {
    //   let costSharingModeData = this.form.getFieldValue('costSharingMode')   // 分摊方式
    //   if (table.dataSource.length > 0 && this.form.getFieldValue('disposeCost') !== 0 || table.dataSource.length > 0 && this.form.getFieldValue('disposeCost') !== 0) {
    //     // 先计算面积总和在算每个占总面积的百分比！在用总额度成百分比算出没个多少钱       说明先写 本期暂时不做
    //     if (costSharingModeData === '2') {   // 按资产面积平均分摊
    //       let assetAreaTotal = 0             // 先计算面积总和
    //       table.dataSource.forEach(item => {
    //         item.assetArea = conditionalJudgment.includes(this.tableData[i].newOriginalValue) ? 0 : Number(item.assetArea)
    //         assetAreaTotal = assetAreaTotal + item.assetArea
    //       })
    //     }
    //   }
    // },
    // 确定拿到数据
    status (val, data) {
      this.checkedData = [...val]
      data.forEach((item, index) => {
        item.key = item.assetId
      })
      this.table.dataSource = data
      this.$refs.assetBundlePopover.show = false
    },
    // 添加资产
    addTheAsset () {
      if (!this.form.getFieldValue('projectId')) {
        this.$message.info('请先选择资产项目')
        return
      } else if (!this.form.getFieldValue('assetType')) {
        this.$message.info('请先选择资产类型')
        return
      }
      this.$refs.assetBundlePopover.redactCheckedDataFn(this.checkedData, this.form.getFieldValue('projectId'), this.form.getFieldValue('assetType'), this.table.dataSource)
      this.$refs.assetBundlePopover.show = true
    },
    // 提交详情
    save (str) {
      this.form.validateFields((err, values) => {
        if (!err) {
          let tableArr = utils.deepClone(this.table.dataSource)
          if (tableArr.length === 0) {
            this.$message.info('请选择资产处置清单')
            return
          }
          for (let i = 0; i < tableArr.length; i++) {
            if (conditionalJudgment.includes(tableArr[i].disposeCost)) {
              this.$message.info('请输入处置成本(元)')
              return
            }
            if (conditionalJudgment.includes(tableArr[i].disposeReceive)) {
              this.$message.info('请输入处置收入(元)')
              return
            }
          }
          let receivingData = utils.deepClone(this.receiving.dataSource)
          // if (receivingData.length === 0) {
          //   this.$message.info('请添加收付款计划')
          //   return
          // }
          if (receivingData.length > 0) {
            for (let i = 0; i < receivingData.length; i++) {
              if (!receivingData[i].receivecostType) {
                this.$message.info('请选择收付款类型')
                return
              }
              if (receivingData[i].receivecostType === '2') {
                if (!receivingData[i].payee) {
                  this.$message.info('请输入收款方')
                  return
                }
              }
              if (receivingData[i].receivecostType === '1') {
                if (!receivingData[i].payer) {
                  this.$message.info('请输入付款方')
                  return
                }
              }
              if (conditionalJudgment.includes(receivingData[i].amount)) {
                this.$message.info('请输入金额')
                return
              }
              if (!receivingData[i].receivecostDate) {
                this.$message.info('请选择收付款时间')
                return
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
          let disposeDetailList = []
          tableArr.forEach(item => {
            disposeDetailList.push({
              assetId: item.assetId,                // 资产信息ID
              assetObjectId: item.assetObjectId,    // 资产对象ID
              assetType: item.assetType,            // 资产类型
              organId: this.organId,                // 管理机构ID
              disposeCost: item.disposeCost,        // 处置成本(元)
              disposeReceive: item.disposeReceive,  // 处置收入(元)
              remark: item.remark                   // 备注
            })
          })
          let receivecostPlanList = []
          // console.log(this.receiving.dataSource, '计划的数据')
          if (receivingData.length > 0) {
            receivingData.forEach(list => {
              receivecostPlanList.push({
                receivecostType: list.receivecostType,                  // 收付款类型 1收款 2付款
                payee: +list.receivecostType === 2 ? list.payee : '',   // 收款方，收付款类型=1收款时不传， =2付款时必填
                payer: +list.receivecostType === 1 ? list.payer : '',   // 付款方，收付款类型=1收款时必填， =2付款时不传
                feeSubject: list.feeSubject,         // 费用科目
                amount: list.amount,                 //类型：Number  必有字段 金额(元)
                receivecostDate: moment(list.receivecostDate, 'YYYY-MM-DD'),  // 收付款时间
                secondMover: list.secondMover,       // 跟进人
                remark: list.remark                  // 备注
              })
            })
          }
          // console.log(receivecostPlanList, '计划的数据')
          let obj = {
            disposeName: values.disposeName,        // 处置名称
            organId: this.organId,                  // 所属组织机构
            projectId: values.projectId,            // 资产项目ID
            assetType: values.assetType,            // 资产类型 平台字典表asset_type 1房屋，2构筑物，3设备
            disposeType: values.disposeType,        // 处置类型 平台字典 AMS_DISPOSE_TYPE 1 资产报废 2 资产报损 3 资产转让
            disposeMode: values.disposeMode,        // 处置方式 机构字典 AMS_DISPOSE_MODE 1报废 2销售 3有偿转让 4无偿转让 5拆迁 6报损 7拍卖 8破产清算
            disposePlanId: '',                      // 处置计划ID，先预留字段，没有值
            disposeCost: values.disposeCost,        // 处置成本(元)
            disposeReceive: values.disposeReceive,  // 处置收入(元)
            disposeDate: values.disposeDate.format('YYYY-MM-DD'), // 处置时间
            assetReceiver: values.assetReceiver,     // 资产接收人
            // costSharingMode: values.costSharingMode, // 费用分摊方式 1按资产数量平均分摊 2按资产面积平均分摊
            costSharingMode: '', // 费用分摊方式 1按资产数量平均分摊 2按资产面积平均分摊
            attachmentList: files,
            disposeReason: values.disposeReason,     // 处置原因
            remark: values.remark,                   // 备注
            disposeDetailList: disposeDetailList,    // 资产清单类别
            receivecostPlanList: receivecostPlanList, // 计划列表
            approvalStatus: '1'                      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
          }
          // 新增提交
          if (this.type === 'create') {
            let loadingName = this.SG_Loding('保存中...')
            this.$api.basics.addRegisterSave(obj).then(res => {
              if (Number(res.data.code) === 0) {
                this.DE_Loding(loadingName).then(() => {
                  this.$SG_Message.success('提交成功')
                  this.$router.push({path: '/disposalRegister', query: {refresh: true}})
                })
              } else {
                this.DE_Loding(loadingName).then(() => {
                  this.$message.error(res.data.message)
                })
              }
            })
          } else {
            // 编辑保存
            obj.disposeRegisterOrderId = this.disposeRegisterOrderId
            let loadingName = this.SG_Loding('保存中...')
            this.$api.basics.modifySave(obj).then(res => {
              if (Number(res.data.code) === 0) {
                this.DE_Loding(loadingName).then(() => {
                  this.$SG_Message.success('提交成功')
                  this.$router.push({path: '/disposalRegister', query: {refresh: true}})
                })
              } else {
                this.DE_Loding(loadingName).then(() => {
                  this.$message.error(res.data.message)
                })
              }
            })
          }
        }
      })
    },
    // 删除
    deleteFn (record, str, index) {
      // 资产处置清单
      if (str === 'property') {
        this.table.dataSource.forEach((item, index) => {
          if (item.assetId === record.assetId) {
            this.table.dataSource.splice(index, 1)
          }
        })
        this.checkedData.forEach((item, index) => {
          if (record.assetId === item) {
            this.checkedData.splice(index, 1)
          }
        })
      } else if (str === 'receiving') {
        this.receiving.dataSource.splice(index, 1)
      }
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
    // 查询详情
    query () {
      let obj = {
        disposeRegisterOrderId: this.disposeRegisterOrderId
      }
      this.$api.basics.getDisposeRegisterById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.$nextTick(() => {
            let files = []
            if (data.attachment && data.attachment.length > 0) {
                data.attachment.forEach(item => {
                files.push({
                  url: item.attachmentPath,
                  name: item.oldAttachmentName
                })
              })
            }
            this.newCardData.files = files
            // 信息回填
            this.form.setFieldsValue({
              disposeName: data.disposeName,
              projectId: data.projectId,
              assetType: String(data.assetType),
              disposeType: String(data.disposeType),
              disposeMode: String(data.disposeMode),
              disposeCost: data.disposeCost,
              disposeReceive: data.disposeReceive,
              disposeDate: moment(data.disposeDate),
              assetReceiver: data.assetReceiver,
              // costSharingMode: data.costSharingMode ? String(data.costSharingMode) : undefined,    // 费用分摊方式
              disposeReason: data.disposeReason,
              remark: data.remark
            })
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 处置清单列表
    getDetailList () {
      let obj = {
        disposeRegisterOrderId: this.disposeRegisterOrderId
      }
      this.$api.basics.getDisposeRegisterDetailList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          // console.log(data)
          this.checkedData = []
          data.forEach((item, index) => {
            item.key = index
            item.assetCategoryName = item.objectTypeName
            this.checkedData.push(item.assetId)
          })
          this.table.dataSource = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询收付款计划列表
    getreceivecostPlanList () {
      let obj = {
        disposeRegisterOrderId: this.disposeRegisterOrderId
      }
      this.$api.basics.getreceivecostPlanList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          // console.log(data)
          data.forEach((item, index) => {
            item.key = index
            item.receivecostType = String(item.receivecostType)
            item.feeSubject = Number(item.feeSubject)
            item.receivecostDate = moment(data.receivecostDate)
          })
          this.receiving.dataSource = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 新建收付款计划
    newMortgageInformation () {
      let atr = [{indexKey: '', receivecostType: undefined, payee: '', payer: '', feeSubject: '', amount: '', receivecostDate: undefined, secondMover: '', remark: ''}]
      let arr = [...this.receiving.dataSource, ...atr]
      // console.log(arr)
      arr.forEach((item, index) => {
        item.key = index
        item.indexKey = index + 1
      })
      this.receiving.dataSource = arr
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.organId,
        projectName: ''
      }
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId
            })
          })
          this.projectIdData = [...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 平台字典获取资产类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'asset_type') {
            this.assetTypeData = data
          } if (str === 'AMS_DISPOSE_TYPE') {
            this.disposeTypeData = data
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 机构字典表
    organDict () {
      this.$api.assets.organDict({code: 'AMS_DISPOSE_MODE'}).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.disposeModeData = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 费用科目
    getFeeTypeList () {
      let form = {
        organId: this.organId
      }
      this.$api.assets.getFeeTypeList(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.feeTypeName,
              value: item.feeTypeId
            }
            arr.push(obj)
          })
          this.billConfigOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
    this.particularsData = this.$route.query
    this.organId = this.particularsData.organId
    this.newCardData.organName = this.particularsData.organName
    this.type = this.particularsData.type
    this.getObjectKeyValueByOrganIdFn()      // 资产项目
    this.platformDictFn('asset_type')        // 资产类型
    this.platformDictFn('AMS_DISPOSE_TYPE')  // 处置类型
    this.organDict()                         // 处置方式
    this.getFeeTypeList()                    // 费用科目
  },
  mounted () {
    if (this.type === 'edit') {
      this.disposeRegisterOrderId = this.particularsData.disposeRegisterOrderId
      this.query()
      this.getDetailList()                  // 处置登记-查询处置清单列表
      this.getreceivecostPlanList()         // 查询收付款计划列表
    }
  }
}
</script>
<style lang="less" scoped>
  .l-modal-container{
    display: flex;
    font-size: 14px;
    /*.l-modal-left, .l-modal-right{*/
    /*  width: 50%;*/
    /*}*/
    .l-modal-left{
      width: 350px;
      padding-right: 8px;
      .l-modal-radio{
        display: flex;
        margin-top: 30px;
      }
      .icon-red{
        line-height: 30px;
      }
      .l-modal-radio/deep/.sg-radio-group.sg-radio-group-vertical>.sg-radio+.sg-radio{
        margin-top: 25px;
      }
    }
    .l-modal-right{
      padding-left: 8px;
      flex: 1;
    }
    .l-modal-input{
      display: flex;
      align-items: center;
      padding-left: 15px;
    }
    .l-modal-explain{
      margin-top: 30px;
      font-size: 12px;
      color: #bfbfbf;
      p{
        margin-bottom: 5px;
      }
    }
  }
.createRegister {
  padding-bottom: 70px;
  .createRegister-nav{
    padding: 42px 126px 0 70px;
    .createRegister-obj {
      padding: 20px 0 0 40px;
      .playground-row {
        .playground-col {
          line-height: 40px;
          font-size: 12px;
        }
      }
    }
    .correspondingTask {
      margin:35px 40px 0 40px;
      border: 1px solid #F0F2F5;
    }
    .button-box {
      overflow: hidden;
      margin-bottom: 10px;
      .buytton-nav {
        float: right;
        .choice {
          margin: 0 10px;
        }
      }
    }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
  .postAssignment-icon {
    cursor: pointer;
    color: #0084FF;
    // font-size: 18px;
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