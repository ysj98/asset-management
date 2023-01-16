<!--
 * @Author: Marting
 * @Date: 2021-6-24 14:31:59
 * @LastEditTime: ''
 * @Description: 巡查记录-新增编辑
-->
<template>
  <div class="delivery-newEditor">
    <div class="delivery-newEditor-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-form :form="form">
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">所属组织机构：</label>
              <a-input placeholder="请输入组织机构"
              :style="allWidth"
              :disabled="true"
              v-decorator="['organName',
                {rules: [], initialValue: organName}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false"  v-bind="formItemLayout">
              <label slot="label">巡查类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择巡查类型"
                v-decorator="['inspectionType',{ rules: [{required: true, message: '请选择资产类型'}], initialValue: newEditSingleData.inspectionType }]"
                :allowClear="false"
                :options="$addTitle(inspectionTypeOption)"
                notFoundContent="没有查询到资产类型"
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">计划巡查日期：</label>
              <a-date-picker :style="allWidth" v-decorator="['inspectionDate', {rules: [{required: true, message: '请选择计划巡查日期'}], initialValue: newEditSingleData.inspectionDate}]" />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false"  v-bind="formItemLayout">
              <label slot="label"><span class="icon-red"></span>巡查人：</label>
              <span class="showUserName">{{userNames}}</span>
              <span style="color:#0000FF; cursor:pointer;" @click="selectedUser">+ 选择</span>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false"  v-bind="formItemLayout">
              <label slot="label">巡查状态：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择巡查状态"
                v-decorator="['inspectionStatus',{ rules: [{required: true, message: '请选择巡检状态'}], initialValue: newEditSingleData.inspectionStatus }]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="inspectionStatusFn"
                :options="$addTitle(inspectionStatusOption)"
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false"  v-bind="formItemLayout">
              <label slot="label">资产项目：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产项目"
                v-decorator="['projectId',{ rules: [{required: true, message: '请选择资产项目'}], initialValue: newEditSingleData.projectId }]"
                :allowClear="false"
                :filterOption="filterOption"
                :options="$addTitle(projectIdData)"
                @change="projectIdFn"
                notFoundContent="没有查询到资产项目"
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" label="资产类型：" v-bind="formItemLayout">
              <label slot="label">资产类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="['assetType',{ rules: [{required: true, message: '请选择资产类型'}], initialValue: newEditSingleData.assetType}]"
                :allowClear="false"
                :options="$addTitle(assetTypeData)"
                :filterOption="filterOption"
                @change="assetTypeFn"
                notFoundContent="没有查询到资产类型"
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label"><span class="icon-red"></span>资产名称：</label>
              <span class="showUserName">{{assetName}}</span>
              <span style="color:#0000FF; cursor:pointer;" @click="addTheAsset">+ 选择</span>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">资产编码：</label>
              <a-input placeholder="请输入资产编码"
              :style="allWidth"
              :disabled="true"
              v-decorator="['selectObj',
                {rules: [], initialValue: selectObj.assetCode || '--'}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">资产分类：</label>
              <a-input placeholder="请输入资产分类"
              :style="allWidth"
              :disabled="true"
              v-decorator="['assetCategoryName',
                {rules: [], initialValue: selectObj.assetCategoryName || '--'}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">资产位置：</label>
              <a-textarea placeholder="请输入资产位置"
              :style="allWidth"
              :disabled="true"
              v-decorator="['address',
                {rules: [], initialValue: selectObj.address || '--'}
              ]"/>
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <div class="tab-nav" v-show="newEditSingleData.inspectionStatus + '' === '1'">
        <span class="section-title blue">巡查结果</span>
        <a-row class="playground-row">
          <a-form :form="form">
            <a-col class="playground-col" :span="8">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label"><span class="icon-red"></span>实际巡查日期：</label>
                <a-date-picker :style="allWidth" v-decorator="['actualInspectionDate', {rules: [{required: false, message: '请选择实际巡查日期'}], initialValue: newEditSingleData.actualInspectionDate}]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">巡查问题描述：</label>
                <a-textarea placeholder="请输入巡查问题描述"
                  :style="widthBox"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-decorator="['problemDescription',
                  {rules: [{required: false, max: 200, message: '请输入巡查问题描述(不超过200字符)'}], initialValue: newEditSingleData.problemDescription}
                  ]"
                  />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">现场处理措施：</label>
                <a-textarea placeholder="请输入现场处理措施"
                  :style="widthBox"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-decorator="['sceneHandleMeasure',
                  {rules: [{required: false, max: 200, message: '请输入现场处理措施(不超过200字符)'}], initialValue: newEditSingleData.sceneHandleMeasure}
                  ]"
                  />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">巡查现场图片：</label>
                <UploadFile v-model="newEditSingleData.agoFiles" type="all" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">整改后照片：</label>
                <UploadFile v-model="newEditSingleData.afterFiles" type="all" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
                <a-textarea placeholder="请输入备注"
                  :style="widthBox"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-decorator="['remark',
                  {rules: [{required: false, max: 200, message: '请输入备注(不超过200字符)'}], initialValue: newEditSingleData.remark}
                  ]"
                  />
              </a-form-item>
            </a-col>
          </a-form>
        </a-row>
      </div>
      <div class="tab-nav" v-show="newEditSingleData.inspectionStatus + '' === '1'">
        <span class="section-title blue">巡查项列表</span>
        <div class="table-layout-fixed detail-table ml40 mt30">
          <a-table
            :scroll="{y: 450}"
            :columns="columns"
            :dataSource="tableData"
            size="middle"
            :pagination="false" >
            <template slot="itemName" slot-scope="text, record">
             <a-input placeholder="请输入检查项名称" :max="50" v-model="record.itemName" />
            </template>
            <template slot="result" slot-scope="text, record">
             <a-input placeholder="请输入检查结果" :max="50" v-model="record.result" />
            </template>
            <template slot="remark" slot-scope="text, record">
             <a-input placeholder="请输入结果说明" :max="200" v-model="record.remark" />
            </template>
            <template slot="operation" slot-scope="text, record, index">
              <span :class="[tableData.length <= 1 ? 'btn-delete-dis' : 'btn-delete' ]" @click="deleteTableLine(record, index)">删除</span>
            </template>
          </a-table>
        </div>
        <div class="mt15 tc ml40">
          <a-button icon="plus" type="dashed" block @click="pushTableLine">新建</a-button>
        </div>
        <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      </div>
    </div>
    <FormFooter style="border:none;" location="fixed">
      <div>
        <SG-Button type="primary" @click="save()">提交</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
    <!-- 选择资产 -->
    <RadioAssetModal v-if="newEditSingleData.projectId && newEditSingleData.assetType" :key="`${newEditSingleData.projectId + newEditSingleData.assetType}`" :selectObj="selectObj" :assetTypeDataTemp="assetTypeData" :projectDataTemp="projectIdData" :projectIdTemp="newEditSingleData.projectId" :assetTypeTemp="newEditSingleData.assetType" ref="radioAssetModal" :organId="organId" :organName="organName" queryType="5" :judgeInstitutions="false" @select="assetChange"></RadioAssetModal>
    <!-- 选人 -->
    <SelectStaffOrPost ref="selectStaffOrPost" :selectType="selectType" @change="changeSelectStaffOrPost" :selectOptList="newEditSingleData.userIdList"/>
  </div>
</template>

<script>
import RadioAssetModal from './radioAssetModal'
import SelectStaffOrPost from '@/views/common/selectStaffOrPost'
import noDataTips from "@/components/noDataTips";
import FormFooter from "@/components/FormFooter";
import moment from "moment";
let getUuid = ((uuid = 1) => () => ++uuid)()
const columns = [
   {
    title: '序号',
    dataIndex: 'index',
    width: '10%'
  }, {
    title: '检查项名称',
    dataIndex: 'itemName',
    align: 'center',
    scopedSlots: { customRender: 'itemName' },
    width: '30%'
  }, {
    title: '检查结果',
    dataIndex: 'result',
    align: 'center',
    scopedSlots: { customRender: 'result' },
    width: '20%'
  }, {
    title: '结果说明',
    dataIndex: 'remark',
    align: 'center',
    scopedSlots: { customRender: 'remark' },
    width: '30%'
  }, {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
    width: '10%'
  }
]
const newEditSingleData = {
  recordId: '', // 记录Id(修改必填)
  organId: '', // 所属机构ID
  inspectionType: '', // 巡查类型
  inspectionDate: undefined, // 计划巡查日期
  userIdList: [], // 巡查人
  inspectionStatus: '1', // 巡查状态
  projectId: '', // 资产项目ID
  assetType: undefined,     // 资产类型
  assetId: '', // 资产信息ID
  actualInspectionDate: undefined, // 实际巡查日期
  problemDescription: '', // 巡查问题描述
  sceneHandleMeasure: '', // 现场处理措施
  agoFiles: [], // 现场图片
  afterFiles: [], // 整改后图片
  remark: '' // 备注-------------------------------
}
export default {
  components: {RadioAssetModal, noDataTips, FormFooter, SelectStaffOrPost},
  data () {
    return {
      moment,
      selectType: 'staff', // staff选人 post选岗位
      selectObj: {}, // 选择资产的数据
      recordId: '',        // 交付id
      deliveryArea: '',      // 交付面积
      setType: '',           // 新增编辑
      selectedRowKeys: [],   // 表格选择的数据
      organIdData: [],       // 父组件传进来的数据
      columns,               // 表头
      tableData: [],         // 表格内容
      organId: '',           // 机构id
      organName: '',         // 所属机构
      userNames: '', // 用于展示选择的人员
      assetName: '', // 资产名称
      assetTypeData: [],     // 资产类型
      projectIdData: [],     // 资产项目
      newEditSingleData: {...newEditSingleData}, // form表单字段
      // 检查项
      form: this.$form.createForm(this),
      allWidth: 'width: 220px',
      widthBox: 'width: 80%',
      // 巡查类型
      inspectionTypeOption: [], // 巡查状态选项
      inspectionStatusOption: [
        {value: '0', label: '未完成'},
        {value: '1', label: '已完成'}
      ], // 巡检状态
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
      }
    }
  },
  computed: {
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.organId = this.organIdData[0].organId
    this.organName = this.organIdData[0].organName
    this.setType = this.$route.query.setType               // 判断新增修改
  },
  mounted () {
    if (this.setType === 'edit') {
      this.recordId = this.organIdData[0].recordId
      Promise.all([
        this.editFn(),
        this.getInspectionCheckItemList(),                          // 获取明细
      ]).then((res) => {})
    } else {
      this.pushTableLine()
    }
    this.getObjectKeyValueByOrganIdFn()                     // 获取资产项目
    this.platformDictFn('asset_type')                       // 获取资产类型
    this.queryOrganOptions('')     // 获取巡查类型
  },
  methods: {
    // 监听选人弹窗改变事件
    changeSelectStaffOrPost (selectOptList = []) {
      this.userNames = selectOptList.map((item => item.name)).join(',')
      this.newEditSingleData.userIdList = selectOptList
    },
    // 选择巡查人
    selectedUser () {
      this.$refs.selectStaffOrPost.visible = true
    },
    // 资产选择变动
    assetChange (row) {
      console.log('row', row)
      this.assetName = row.assetName
      this.selectObj = row
    },
     // 添加资产
    addTheAsset() {
      if (!this.form.getFieldValue("projectId")) {
        this.$message.info("请先选择资产项目");
        return;
      }
      if (!this.form.getFieldValue("assetType")) {
        this.$message.info("请先选择资产类型");
        return;
      }
      this.$nextTick(() => {
        this.$refs.radioAssetModal.show = true
        this.$refs.radioAssetModal.query()
      })
    },
    // 在表格压入一条数据
    pushTableLine() {
      let o = {
        key: getUuid(),
        index: '',
        itemId: "",
        itemName: "",
        result: "",
        remark: "",
        operation: "",
      }
      this.tableData.push(o)
      this.confirmIndex()
    },
    // 删除一行巡查项
    deleteTableLine(record, index) {
      if (this.tableData.length === 1) {
        this.$message.error("请至少保留一行数据!")
        return
      }
      this.$SG_Modal.confirm({
        content: `确认要删除吗？?`,
        okText: '确定',
        cancelText: '再想想',
        onOk: () => {
          this.tableData.splice(index, 1)
          this.confirmIndex()
        }
      })
    },
    // 从新定义检查项的序号
    confirmIndex () {
      console.log('this.tableData', this.tableData)
      this.tableData.forEach((item, index) => {
        item.index = index + 1
      })
    },
    // 编辑回填基础信息
    editFn () {
      this.$api.useManage.getInspectionTaskRecord({recordId: Number(this.recordId)}).then((res) => {
        if (Number(res.data.code) === 0) {
          let obj = res.data.data
          this.newEditSingleData.inspectionType = obj.inspectionType + ''
          this.newEditSingleData.inspectionDate = obj.inspectionDate ? moment(obj.inspectionDate, "YYYY-MM-DD") : undefined
          let userIdList = []
          for (const key in obj.userMap) {
            userIdList.push({
              name: obj.userMap[key],
              userId: key,
              id: key
            })
          }
          console.log('userIdList', userIdList)
          this.newEditSingleData.remark = obj.remark || ''
          this.selectObj.assetCategoryName = obj.objectTypeName
          this.selectObj.address = obj.position
          this.selectObj.assetCode = obj.assetCode
          this.selectObj.assetId =  Number(obj.assetId)
          this.selectObj.assetObjectId = Number(obj.assetId)
          this.newEditSingleData.userIdList = userIdList
          this.userNames = obj.userNames
          this.newEditSingleData.assetType = obj.assetType + ''
          this.newEditSingleData.inspectionStatus = obj.inspectionStatus + ''
          this.newEditSingleData.projectId = Number(obj.projectId)
          this.assetName = obj.assetName
          this.newEditSingleData.actualInspectionDate = obj.actualInspectionDate ? moment(obj.actualInspectionDate, "YYYY-MM-DD") : undefined
          this.newEditSingleData.problemDescription = obj.problemDescription || ''
          this.newEditSingleData.sceneHandleMeasure = obj.sceneHandleMeasure || ''
          this.newEditSingleData.agoFiles = obj.attachmentList.map(item => {
            return {name: item.oldAttachmentName, url: item.attachmentPath}
          })
          this.newEditSingleData.afterFiles = obj.rectifyAttachmentList.map(item => {
            return {name: item.oldAttachmentName, url: item.attachmentPath}
          })
          console.log('this.selectObj', this.selectObj)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询巡查项
    getInspectionCheckItemList () {
      this.$api.useManage.getInspectionCheckItemList({recordId: this.recordId}).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          data.forEach(item => {
            item.key = getUuid()
            item.itemId = item.itemId
            item.itemName = item.itemName
            item.result = item.result
            item.remark = item.remark
          })
          this.tableData = data
          if (this.tableData.length <= 0) {
            this.pushTableLine()
          }
          this.confirmIndex()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 提交
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.newEditSingleData.userIdList.length <= 0) {
            this.$message.info("请选择巡查人");
            return
          }
          if (!this.selectObj.assetId) {
            this.$message.info("请选择资产");
            return
          }
          if (!values.actualInspectionDate && values.inspectionStatus + '' === '1') {
            this.$message.info("请选实际巡查日期");
            return
          }
          let agoFiles = [];
          if (this.newEditSingleData.agoFiles.length > 0) {
            this.newEditSingleData.agoFiles.forEach((list) => {
              agoFiles.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name,
              });
            });
          }
          let afterFiles = [];
          if (this.newEditSingleData.afterFiles.length > 0) {
            this.newEditSingleData.afterFiles.forEach((list) => {
              afterFiles.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name,
              });
            });
          }
          let checkItemList = []
          this.tableData.forEach(item => {
            if (item.itemName) {
              checkItemList.push({
                itemId: item.itemId, // 检查想id  修改时必有
                itemName: item.itemName, // 检查想名称
                result: item.result, // 检查项结果
                remark: item.remark //  结果说明
              })
            }
          })
          let actualInspectionDate = values.actualInspectionDate === undefined ? '' : `${values.actualInspectionDate.format('YYYY-MM-DD')}`
          let obj = {
            recordId: this.recordId,                  // 巡查ID
            organId: this.organId,                        // 组织机构id
            inspectionType: values.inspectionType, // 巡查类型
            inspectionDate: values.inspectionDate === undefined ? '' : `${values.inspectionDate.format('YYYY-MM-DD')}`, // 计划巡查日期
            actualInspectionDate: values.inspectionStatus + '' === '1' ? actualInspectionDate : '',    // 实际巡查日期
            userIdList: this.newEditSingleData.userIdList.map(item => item.userId), // 巡查人Id
            inspectionStatus: values.inspectionStatus, //巡查状态
            projectId: values.projectId + '',                  // 资产项目Id
            assetType: values.assetType,                  // 资产类型
            assetId: this.selectObj.assetId + '',  // 资产Id
            problemDescription: values.inspectionStatus + '' === '1' ? values.problemDescription : '', // 巡查问题描述
            sceneHandleMeasure: values.inspectionStatus + '' === '1' ? values.sceneHandleMeasure : '', // 巡查问题措施
            remark: values.inspectionStatus + '' === '1' ? values.remark : '', // 巡查问题备注
            attachmentList: values.inspectionStatus + '' === '1' ? agoFiles : [], // 巡查前图片
            afterAttachmentList: values.inspectionStatus + '' === '1' ? afterFiles : [], // 整改后图片
            checkItemList: values.inspectionStatus + '' === '1' ? checkItemList : []
          }
          // console.log('objobjobjobjobj', obj)
          // return
          let loadingName = this.SG_Loding("保存中...");
          this.$api.useManage.addOrUpdateInspectionRecord(obj).then((res) => {
            if (Number(res.data.code) === 0) {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success("提交成功");
                this.$router.push({
                  path: "/patrolRecord",
                  query: { refresh: true },
                })
              })
            } else {
              this.DE_Loding(loadingName).then(() => {
                this.$message.error(res.data.message);
              })
            }
          })
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({ path: "/patrolRecord" })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
            this.assetTypeData = data.map(item => {
              return {label: item.name, value: item.value, key: item.value, name: item.name}
            })
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询巡查类型-机构字典
    queryOrganOptions () {
      this.$api.basics.organDict({ code: 'inspection_type', organId: '1' }).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          this.inspectionTypeOption = res.data.map(item => {
            return {label: item.name, value: item.value, key: item.value}
          })
        } else {
          this.$message.error(err || '查询巡查类型失败')
        }
      }).catch(err => {
        this.$message.error(err || '查询巡查类型失败')
      })
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
              label: item.projectName,
              value: item.projectId,
              key: item.projectId,
              name: item.projectName
            })
          })
          this.projectIdData = [...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 监听巡查状态
    inspectionStatusFn (val) {
      this.newEditSingleData.inspectionStatus = val
    },
    // 资产项目监听
    projectIdFn (val) {
      console.log('this.newEditSingleData.projectId', this.newEditSingleData.projectId)
      this.newEditSingleData.projectId = val
      this.removeAsset()
    },
    // 资产类型监听
    assetTypeFn (val) {
      this.newEditSingleData.assetType = val
      this.removeAsset()
    },
    // 清空资产名称的值
    removeAsset () {
      this.assetName = ''
      this.selectObj = {...selectObj}
    }
  }
}
</script>
<style lang="less" scoped>
.delivery-newEditor {
  padding-bottom: 70px;
  .delivery-newEditor-nav {
    padding: 42px 106px 70px 94px;
    .playground-row {
      margin-top: 20px;
    }
    .tab-nav {
      margin-top: 40px;
      .button-box {
        overflow: hidden;
        margin-bottom: 10px;
        .fl {
          font-size: 14px;
          line-height:32px;
        }
      }
    }
  }
  .showUserName{
    vertical-align: middle;
    display: inline-block;
    line-height: 22px;
    max-width: 180px;
    white-space:nowrap;/* 规定文本是否折行 */
    overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
    text-overflow: ellipsis;
    &:hover{
      white-space:normal;/* 规定文本是否折行 */
    }
  }
  .btn-delete {
    color: #f5222d;
    cursor: pointer;
  }
  .btn-delete-dis{
    cursor: not-allowed;
  }
}
</style>
