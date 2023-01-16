<!--
  新增: new
  编辑: edit
-->
<template>
  <div class="newEditSingle">
    <div class="newEditSingle-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-form :form="form" @submit="handleSubmit">
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">登记单名称：</label>
              <a-input placeholder="请输入登记单名称"
              :style="allWidth"
              :max="60"
              :maxLength="60"
              v-decorator="['registerName',
                {rules: [{required: true, max: 60, whitespace: true, message: '请输入登记单名称(不超过60字符)'}], initialValue: newEditSingleData.registerName}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">所属机构：</label>
              <a-select
                :disabled="true"
                showSearch
                :style="allWidth"
                placeholder="请选择所属机构"
                v-decorator="['organId',{
                    rules: [{required: true, message: '请选择所属机构'}],
                    initialValue: newEditSingleData.organId
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到所属机构"
                >
                <a-select-option
                  :title="item.name"
                  v-for="(item) in organIdData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">登记类型：</label>
              <a-select
                :disabled="setType === 'edit'"
                showSearch
                :style="allWidth"
                placeholder="请选择登记类型"
                v-decorator="['registerType',{
                    rules: [{required: true, message: '请选择登记类型'}],
                    initialValue: newEditSingleData.registerType
                  }]"
                @change="changeTypeChange"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到登记类型"
                >
                <a-select-option
                  :title="item.name"
                  v-for="(item) in changeTypeData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">资&nbsp;产&nbsp;项&nbsp;目：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产项目"
                v-decorator="['projectId',{
                    rules: [{required: true, message: '请选择资产项目'}],
                    initialValue: newEditSingleData.projectId
                  }]"
                :allowClear="false"
                @change="projectChangeFn"
                :filterOption="filterOption"
                notFoundContent="没有查询到资产项目"
                >
                <a-select-option
                  :title="item.name"
                  v-for="(item) in projectIdData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">资产类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                @change="assetChange"
                v-decorator="['assetType',{
                    rules: [{required: true, message: '请选择资产类型'}],
                    initialValue: newEditSingleData.assetType
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到资产类型"
                >
                <a-select-option
                  :title="item.name"
                  v-for="(item) in assetTypeData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
              <a-textarea placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 3, maxRows: 4 }"
                :maxLength="200"
                v-decorator="['remark',
                {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: newEditSingleData.remark}
                ]"
                />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">上&nbsp;传&nbsp;附&nbsp;件：</label>
                <UploadFile
                  v-model="newEditSingleData.files"
                  type="all"
                />
              </a-form-item>
            </a-col>
        </a-form>
      </a-row>
      <div class="tab-nav">
        <span class="section-title blue">权属登记详情</span>
        <div class="button-box">
          <div class="buytton-nav">
            <SG-Button v-if="+changeType !== 3" class="buytton-nav-r" type="primary" weaken @click="batchExport">批量导出</SG-Button>
            <SG-Button v-if="+changeType !== 3"  class="buytton-nav-r" type="primary" weaken @click="bulkImport ">批量导入</SG-Button>
            <SG-Button class="buytton-nav-r" type="primary" weaken @click="newFn" v-if="showNewFn">新增权证</SG-Button>
            <SG-Button type="primary" weaken @click="addTheAsset">添加资产</SG-Button>
          </div>
        </div>
        <div class="table-layout-fixed" v-if="columns.length !== 0" :class="{'table-border': tableData.length != 0}">
          <a-table
            :scroll="{y: 450}"
            :columns="columns"
            :dataSource="tableData"
            size="middle"
            :pagination="false"
            >
            <!-- 注销登记 -->
            <template v-if="changeType !== '3'" slot="warrantNbr" slot-scope="text, record">
              <a-select
                style="width: 150px"
                placeholder="请选择关联资产"
                :open="false"
                :options="$addTitle(record.warrantNbrData)"
                @dropdownVisibleChange="handleChange(record)"
                v-model="record.warrantNbr"
              >
                <div slot="dropdownRender" slot-scope="menu"></div>
                <a-icon slot="suffixIcon" type="plus-circle" />
              </a-select>
            </template>
            <template slot="operation" slot-scope="text, record">
              <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
            </template>
          </a-table>
        </div>
        <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      </div>
    </div>
    <!-- 选择资产 -->
    <AssetBundlePopover judgmentType="register" :organId="organId" queryType="1" ref="assetBundlePopover" @status="status"></AssetBundlePopover>
    <!-- 选择权证 -->
    <chooseWarrants :organId="organId" ref="chooseWarrants" @status="chooseWarrantsStatus"></chooseWarrants>
    <!-- 新增权证 -->
    <NewCard ref="newCard" :organId="organId"></NewCard>
    <FormFooter location="fixed">
      <div>
        <SG-Button type="primary" @click="save('save')">提交</SG-Button>
        <SG-Button style="margin-left: 10px" type="primary" @click="save('draft')">保存草稿</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
    <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
  </div>
</template>

<script>
import {utils} from '@/utils/utils'
import AssetBundlePopover from '../../common/assetBundlePopover'
import chooseWarrants from '../../common/chooseWarrants'
import NewCard from '../authorityCardManagement/newCard'
import {register, cancellation } from './basics'
import FormFooter from '@/components/FormFooter'
import noDataTips from '@/components/noDataTips'
import moment from 'moment'

const newEditSingleData = {
  registerName: '',          // 登记单名称
  remark: '',                // 备注
  ownershipHandleId: '',     // 权属办理任务ID
  registerType: undefined,   // 登记类型
  assetType: undefined,      // 资产类型
  projectId: undefined,      // 资产项目
  files: [],
  organId: ''
}
export default {
  components: {AssetBundlePopover, chooseWarrants, NewCard, FormFooter, noDataTips},
  props: {},
  data () {
    return {
      showNewFn: true, // 新增权证按钮
      fileType: ['xls', 'xlsx'],
      warrantNbrData: [],
      registerId: '',
      organId: '',
      enitData: '',
      changeType: '',          // 用来判断对象登记类型
      checkedData: [],
      show: false,
      columns: [],
      tableData: [],
      organIdData: [],
      changeTypeData: [],
      projectIdData: [],
      assetTypeData: [],
      newEditSingleData: {...newEditSingleData},
      form: this.$form.createForm(this),
      allWidth: 'width: 160px',
      widthBox: 'width: 80%',
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
  watch: {
    'changeType' (val) {
      this.checkedData = []
      this.tableData = []
      let columns = []
      if (val === '3') {    // 注销登记
        columns = cancellation
      } else {     // // 首次登记 变更登记
        columns = register
      }
      if (columns[0].dataIndex !== 'serial') {
        columns.unshift({
          title: '序号',
          dataIndex: 'serial',
          width: '8%'
        })
      }
      this.columns = [...columns]
    },
    tableData: {
      handler (val) {
        val.forEach((item, index) => {
          item.serial = index + 1
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 当开启了【权属登记审批】，权属登记的“新增权证”按钮隐藏不展示
    async getApproveConfig(){
      let { data:{ code,data } } = await this.$api.paramsConfig.queryParamsConfigDetail({
        serviceType: 1015,
        organId: this.organId,
      })
      if (code === "0"){
        const {isValid} = data
        if( isValid === 1){
          this.showNewFn = false
        }
      }
    },
    // 确定拿到数据
    status (val, data) {
      this.checkedData = [...val]
      data.forEach((item, index) => {
        item.key = item.assetId
      })
      this.tableData = data
      this.$refs.assetBundlePopover.show = false
    },
    // 选择权证给回来的数据
    chooseWarrantsStatus (val, data, roeNameData, selectKey) {
      console.log(data)
      let warrantNbrDataIs = [{label: roeNameData.join(','), value: val.join(',')}]
      this.tableData.forEach((item, index) => {
        if (item.key === selectKey) {
          item.warrantGeneralData = data
          item.warrantNbrData = warrantNbrDataIs
          item.warrantNbr = val.join(',')
        }
      })
      this.$refs.chooseWarrants.show = false
    },
    // 选择新权证号
    handleChange(value) {
      value.warrantGeneralData.forEach(list => {
        list.lotNoEstateUnitCode = `${list.lotNo || '--'}/${list.estateUnitCode || '--'}`
      })
      let warrantNbr = []
      if (value.warrantNbr) {
        value.warrantNbr.split(',').forEach(item => {
          warrantNbr.push(Number(item))
        })
      } else {
        warrantNbr === []
      }
      this.$refs.chooseWarrants.redactCheckedDataFn(warrantNbr, value.warrantGeneralData, value.key)
      this.$refs.chooseWarrants.show = true
    },
    // 添加资产
    addTheAsset () {
      if (!this.form.getFieldValue('projectId')) {
        this.$message.info('请先选择资产项目')
        return
      }
      if (!this.form.getFieldValue('assetType')) {
        this.$message.info('请先选择资产类型')
        return
      }
      if (this.changeType) {
        this.$refs.assetBundlePopover.redactCheckedDataFn(this.checkedData, this.form.getFieldValue('projectId'), this.form.getFieldValue('assetType'), this.tableData)
        this.$refs.assetBundlePopover.show = true
      } else {
        this.$message.info('请先选择登记类型')
      }
    },
    // 登记类型
    changeTypeChange (val) {
      this.changeType = val
    },
    projectChangeFn () {
      this.checkedData = []
      this.tableData = []
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 改变资产
    assetChange () {
      this.checkedData = []
      this.tableData = []
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
    // 批量导出
    batchExport () {
      if (this.tableData.length === 0) {
        this.$message.info('请先选择资产')
        return
      }
      console.log(this.tableData)
      let arr = utils.deepClone(this.tableData)
      arr.forEach((item) => {
        item.area = item.area || item.assetArea
        item.location = item.location || item.address
        item.warrantGeneralData = []
        item.warrantNbr = item.warrantNbrData.length > 0 ? item.warrantNbrData[0].label : ''
      })
      console.log(arr, '9090mshsh')
      this.$api.ownership.shipAssetExport(arr).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `权属登记.xls`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 批量导入
    bulkImport () {
      if (!this.form.getFieldValue('registerType')) {
        this.$message.info('请先选择登记类型')
        return
      }
      if (!this.form.getFieldValue('projectId')) {
        this.$message.info('请先选择资产项目')
        return
      }
      if (!this.form.getFieldValue('assetType')) {
        this.$message.info('请先选择资产类型')
        return
      }
      this.$refs.fileUpload.click()
    },
    checkFile (fileName, fileSize) {
      // 检查文件类型
      let myFileType = false
      if (this.fileType.length) {
        const FileType = fileName.split('.').pop().toLowerCase()
        myFileType = this.fileType.some(item => item.toLowerCase() === FileType)
      }
      // 检查文件大小
      let mfileSize = true
      if (fileSize) {
        mfileSize = fileSize <= (this.fileMaxSize * 1024)
      }
      return {
        size: mfileSize,
        type: myFileType
      }
    },
    // 文件上传
    change (files, e) {
      console.log(files)
      if (!files.length) { return }
      let fileData = new FormData()
      fileData.append('file', files[0])
      fileData.append('projectId', this.form.getFieldValue('projectId'))
      fileData.append('organId', this.form.getFieldValue('organId'))
      fileData.append('assetType', this.form.getFieldValue('assetType'))
      let validObj = this.checkFile(files[0].name, files[0].size)
      if (!validObj.type) {
        this.$message.error('上传文件类型错误!')
        return
      }
      this.fileName = files[0].name
      this.formData = fileData
      if (this.formData === null) {
        return this.$message.error('请先上传文件!')
      }
      let loadingName = this.SG_Loding('导入中...')
      this.$api.ownership.shipImportData(this.formData).then(res => {
        if (res.data.code === '0') {
          e.target.value = ''
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('导入成功！')
            let data = res.data.data
            console.log(data, '909dh你好是')
            let checkedData = []
            if (this.changeType !== '3') {
              data.forEach((item, index) => {
                item.key = item.assetId
                item.address = item.location
                item.assetArea = item.area
                checkedData.push(item.assetId)
                if (item.warrantIds && item.warrantIds.length !== 0) {
                  item.warrantNbrData = [{label: item.warrantNbr, value: item.warrantIds.join(',')}]      // 用于存储单个下拉框数据
                  item.warrantNbr = item.warrantIds.join(',')
                } else {
                  item.warrantGeneralData = []
                  item.warrantNbrData = []
                  item.warrants = []
                  item.warrantIds = []
                  item.warrantNbr = ''
                }
                item.warrantGeneralData = item.warrants  // 用于存权证号总是数据
              })
            }
            this.tableData = data
            console.log(this.tableData, '这是没事')
          })
        } else {
          e.target.value = ''
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error(res.data.message)
          })
        }
      }, () => {
        e.target.value = ''
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error('导入失败！')
        })
      })
    },
    // 新增权证
    newFn () {
      this.$refs.newCard.show = true
      this.$refs.newCard.newFn('new', this.organId)
      this.$refs.newCard.selectFn()
    },
    // 删除
    deleteFn (record) {
      this.tableData.forEach((item, index) => {
        if (item.assetId === record.assetId) {
          this.tableData.splice(index, 1)
        }
      })
      this.checkedData.forEach((item, index) => {
        if (record.assetId === item) {
          this.checkedData.splice(index, 1)
        }
      })
    },
    platformDictFn () {
      Promise.all([this.$api.assets.platformDict({code: 'AMS_REGISTER_TYPE'}), this.$api.assets.platformDict({code: 'asset_type'})]).then(res => {
        // 登记类型
        if (+res[0].data.code === 0) {
          let data = res[0].data.data
          this.changeTypeData = [...data]
        }
        // 资产类型
        if (+res[1].data.code === 0) {
          let data = res[1].data.data
          this.assetTypeData = [...data]
        }
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
    // 提交
    save (str) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.tableData.length <= 0) {
            this.$message.info('请选择权属登记详情')
            return
          }
          let files = []
          if (this.newEditSingleData.files.length > 0) {
            this.newEditSingleData.files.forEach(list => {
              files.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name
              })
            })
          }
          for (let i = 0; i < this.tableData.length; i++) {
            if (String(this.changeType) !== '3') {
              if (!this.tableData[i].warrantNbr) {
                this.$message.info('请选择新权证号')
                return
              }
            }
          }
          let array = []
          this.tableData.map(item => {
            let assetArea = item.assetArea
            let buildArea = 0
            console.log(assetArea)
            item.warrantGeneralData.map(e => {
              console.log(e.buildArea)
              buildArea += e.buildArea
              console.log(buildArea)
            })
            console.log(assetArea, buildArea)
            if (assetArea !== buildArea) {
              array.push(item.assetName)
            }
          })
          if (array.length) {
            let tips = array.join('、') + '与权证的面积不一致，确定登记吗？'
            this.$SG_Message.confirmDelete({
              content: tips,
              confirmText: '确定',
              onConfirm: () => {
                this.submitData(str, values, files)
              },
              onCancel: () => {
                return
              }
            })
          } else {
            this.submitData(str, values, files)
          }
          
        }
      })
    },
    // 提交数据
    submitData (str, values, files) {
      let arr = []
      this.tableData.forEach(item => {
           arr.push({
             projectId: Number(item.projectId),        // 资产项目Id
             organId: this.organId,
             assetType: item.assetType,                // 登记类型 1:楼栋，2房间，3构筑物，4土地，5设备  item.assetType
             warrantNbr: item.warrantNbrData.length > 0 ? item.warrantNbrData[0].label : '',
             assetObjectId: item.assetObjectId,  // 资产对象Id 为1和2时，asset_object_id对应的ams_asset_house表asset_house_id
           })
         })
         let obj = {
           registerName: values.registerName,                          // 登记单名称
           remark: values.remark,                                      // 备注
           ownershipHandleId: '',                                      // 权属办理任务ID
           registerType: values.registerType,                          // 登记类型Id
           assetType: values.assetType,                                // 资产类型
           projectId: Number(values.projectId),                        // 资产项目Id
           organId: Number(values.organId),                            // 组织机构id
           approvalStatus: str === 'draft' ? 0 : 1,                    // 0:草稿 1:已审核
           registerId: this.registerId,                                // 权属登记Id(空为新增，不为空为编辑)
           attachmentList: files,                                          // 附件
           ownershipRegisterDetailList: arr
         }
         console.log(obj)
         let loadingName = this.SG_Loding('保存中...')
         this.$api.ownership.saveOrUpdate(obj).then(res => {
           if (Number(res.data.code) === 0) {
             this.DE_Loding(loadingName).then(() => {
               this.$SG_Message.success('提交成功')
               this.$router.push({path: '/ownershipRegistration', query: {refresh: true}})
             })
           } else {
             this.DE_Loding(loadingName).then(() => {
               this.$message.error(res.data.message)
             })
           }
         })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/ownershipRegistration'})
    },
    // 编辑获取接口
    editFn () {
      let obj = {
        registerId: this.registerId
      }
      this.$api.ownership.shipDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.changeType = String(data.registerInfo.registerType)
          let files = []
          if (data.amsAttachmentList && data.amsAttachmentList.length > 0) {
              data.amsAttachmentList.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName
              })
            })
          }
          this.newEditSingleData.files = files
          let checkedData = []
          if (this.changeType !== '3') {
            data.amsOwnershipRegisterDetailList.forEach((item, index) => {
              item.key = item.assetId
              item.address = item.location
              item.assetArea = item.area
              checkedData.push(item.assetId)
              item.warrantNbrData = [{label: item.warrantNbr, value: item.warrantIds.join(',')}]      // 用于存储单个下拉框数据
              item.warrantNbr = item.warrantIds.join(',')
              item.warrantGeneralData = item.warrants  // 用于存权证号总是数据
            })
          } else if (this.changeType === '3') {
              data.amsOwnershipRegisterDetailList.forEach((item, index) => {
                item.key = item.assetId
                item.address = item.location
                item.assetArea = item.area
                checkedData.push(item.assetId)
                item.warrantNbrData = []      // 用于存储单个下拉框数据
                item.warrantNbr = ''
              })
          }
          this.$nextTick(() => {
            this.form.setFieldsValue({
              organId: this.organIdData[0].value,
              projectId: data.registerInfo.projectId,
              registerName: data.registerInfo.registerName,
              registerType: String(data.registerInfo.registerType),
              assetType: String(data.registerInfo.assetType),
              remark: data.registerInfo.remark
            })
            this.checkedData = [...checkedData]
            this.tableData = data.amsOwnershipRegisterDetailList
            console.log(this.tableData, '拿到的数据')
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.organId = this.organIdData[0].value
    this.setType = this.$route.query.setType
  },
  mounted () {
    this.getObjectKeyValueByOrganIdFn()
    this.getApproveConfig()
    console.log('--------------------')
    // 登记类型
    this.platformDictFn()
    if (this.setType === 'edit') {
      this.enitData = JSON.parse(this.$route.query.enitData)
      this.registerId = this.enitData[0].registerId
      this.editFn()
    } else {
      this.form.setFieldsValue({
        organId: this.organIdData[0].value
      })
    }
  }
}
</script>
<style lang="less" scoped>
.newEditSingle {
  padding-bottom: 70px;
  .newEditSingle-nav {
    padding: 42px 106px 70px 94px;
  }
  .playground-row {
    margin-top: 28px;
  }
  .tab-nav {
    margin-top: 40px;
    .button-box {
      overflow: hidden;
      margin-bottom: 10px;
      .buytton-nav {
        float: right;
        .buytton-nav-r {
          margin-right: 10px;
        }
      }
    }
  }
  .postAssignment-icon {
    cursor: pointer;
    color: #0084FF;
    // font-size: 18px;
  }
  .postAssignment-icon:hover {
    color: red;
  }
  .new-icon {
    padding-right: 10px;
    cursor: pointer;
    color: #0084FF;
  }
}
</style>
