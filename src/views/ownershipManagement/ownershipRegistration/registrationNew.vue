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
            <a-form-item label="登记单名称" v-bind="formItemLayout">
              <a-input placeholder="请输入登记单名称"
              :style="allWidth"
              :max="10"
              v-decorator="['registerName',
                {rules: [{required: true, max: 60, whitespace: true, message: '请输入登记单名称(不超过50字符)'}], initialValue: newEditSingleData.registerName}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="所属机构：" v-bind="formItemLayout">
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
                  v-for="(item) in organIdData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="登记类型：" v-bind="formItemLayout">
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
                  v-for="(item) in changeTypeData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="资产项目：" v-bind="formItemLayout">
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
                  v-for="(item) in projectIdData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="资产类型：" v-bind="formItemLayout">
              <a-select
                :disabled="setType === 'edit'"
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="['assetType',{
                    rules: [{required: true, message: '请选择资产类型'}],
                    initialValue: newEditSingleData.assetType
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到资产类型"
                >
                <a-select-option
                  v-for="(item) in assetTypeData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item label="备注" v-bind="formItemTextarea">
              <a-textarea placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-decorator="['remark',
                {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: newEditSingleData.remark}
                ]"
                />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
              <a-form-item label="上传附件：" v-bind="formItemTextarea">
                <SG-UploadFile
                  v-model="newEditSingleData.files"
                  type="all"
                />
              </a-form-item>
            </a-col>
        </a-form>
      </a-row>
      <div class="tab-nav">
        <span class="section-title blue">权属登记详情</span>
        <div class="button-box"><SG-Button class="buytton-nav" type="primary" weaken @click="addTheAsset">添加资产</SG-Button></div>
        <div class="table-layout-fixed" v-if="columns.length !== 0" :class="{'table-border': tableData.length != 0}">
          <a-table
            :scroll="{y: 450}"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <!-- 注销登记 -->
            <template v-if="changeType !== '3'" slot="warrantNbr" slot-scope="text, record">
              <a-select
                style="width: 150px"
                mode="multiple"
                :maxTagCount="4"
                showSearch
                placeholder="请选择新权证号"
                v-model="record.warrantNbr"
                optionFilterProp="children"
                :options="warrantNbrData"
                :open="false"
                :allowClear="true"
                @change="change(item.key, item.Jobchecked)"
                @dropdownVisibleChange="handleChange(item.key, item.Jobchecked, item.alarmInformPost)"
                :filterOption="false"
                notFoundContent="没有查询到数据"
                />
                <!-- <div class="button-box"><SG-Button class="buytton-nav" type="primary" weaken @click="chooseWarrantsFn">选择权证</SG-Button></div> -->
            </template>
            <template slot="operation" slot-scope="text, record">
              <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
            </template>
          </a-table>
        </div>
        <no-data-tips v-show="tableData.length === 0"></no-data-tips>
        <!-- <div v-else style="text-align: center">
          暂无数据
        </div> -->
      </div>
    </div>
    <!-- 选择资产 -->
    <AssetBundlePopover :organId="organId" queryType="1" ref="assetBundlePopover" @status="status"></AssetBundlePopover>
    <!-- 选择权证 -->
    <chooseWarrants :organId="organId" ref="chooseWarrants" @status="status"></chooseWarrants>
    <FormFooter>
      <div>
        <a-button type="primary" @click="save('save')">提交</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="save('draft')">保存草稿</a-button>
        <a-button @click="cancel">取消</a-button>
      </div>
    </FormFooter>
  </div>
</template>

<script>
import AssetBundlePopover from '../../common/assetBundlePopover'
import chooseWarrants from '../../common/chooseWarrants'
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
  components: {AssetBundlePopover, chooseWarrants, FormFooter, noDataTips},
  props: {},
  data () {
    return {
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
      if (val === '3') {    // 注销登记
        this.columns = cancellation
      } else {     // // 首次登记 变更登记
        this.columns = register
      }
    }
  },
  methods: {
    // 确定拿到数据
    status (val, data) {
      this.checkedData = [...val]
      data.forEach((item, index) => {
        item.key = item.assetId
      })
      this.tableData = data
      this.$refs.assetBundlePopover.show = false
    },
    // 添加资产
    addTheAsset () {
      if (!this.form.getFieldValue('projectId')) {
        this.$message.info('请先选择资产项目')
        return
      }
      if (this.changeType) {
        console.log(this.checkedData, '给回去的')
        this.$refs.assetBundlePopover.redactCheckedDataFn(this.checkedData, this.form.getFieldValue('projectId'), '', this.tableData)
        this.$refs.assetBundlePopover.show = true
      } else {
        this.$message.info('请先选择登记类型')
      }
    },
    // 选择资产权证
    chooseWarrantsFn () {
      this.$refs.chooseWarrants.redactCheckedDataFn(this.checkedData, this.tableData)
      this.$refs.chooseWarrants.show = true
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
    change () {},
    // 选择新权证号
    handleChange(value, event, str) {
      // const newData = [...this.tableData]
      // const target = newData.filter(item => value.key === item.key)[0]
      // if (target) {
      //   target[str] = event
      //   this.tableData = newData
      // }
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
          let arr = []
          for (let i = 0; i < this.tableData.length; i++) {
            if (String(this.changeType) !== '3') {
              if (!this.tableData[i].transferOperationArea) {
                this.$message.info('请选择新权证号')
                return
              }
            }
          }
          this.tableData.forEach(item => {
            arr.push({
              projectId: Number(item.projectId),        // 资产项目Id
              organId: this.organId,
              assetType: item.assetType,                // 登记类型 1:楼栋，2房间，3构筑物，4土地，5设备  item.assetType
              warrantNbr: item.warrantNbr,
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
            attachment: files,                                         // 附件
            ownershipRegisterDetailList: arr
          }
          console.log(obj)
          let loadingName = this.SG_Loding('保存中...')
          this.$api.ownership.saveOrUpdate(obj).then(res => {
            if (Number(res.data.code) === 0) {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success('提交成功')
                this.$router.push({path: '/assetChange', query: {refresh: true}})
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
    // 取消
    cancel () {
      this.$router.push({path: '/assetChange'})
    },
    // 编辑获取接口
    editFn () {
      let obj = {
        registerId: this.registerId
      }
      this.$api.ownership.getChangeInfo(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.changeType = String(data.changeType)
          let files = []
          if (data.attachment && data.attachment.length > 0) {
              data.attachment.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName
              })
            })
          }
          this.newEditSingleData.files = files
          let checkedData = []
          data.assetDetailList.forEach((item, index) => {
            item.key = item.assetId + index
            item.addressName = item.address
            item.newOriginalValue = item.originalValue
            checkedData.push(item.assetId)
          })
          this.$nextTick(() => {
            this.form.setFieldsValue({
              organId: this.organIdData[0].value,
              projectId: data.projectId,
              title: data.title,
              changeType: String(data.changeType),
              deliveryCompany: data.deliveryCompany,
              changeDate: moment(data.changeDate, 'YYYY-MM-DD'),
              expiryDate: data.expiryDate ? moment(data.expiryDate, 'YYYY-MM-DD') : undefined,
              remark: data.remark
            })
            this.checkedData = [...checkedData]
            this.tableData = data.assetDetailList
          })
          console.log(this.tableData, '拿到的数据')
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
}
</style>
