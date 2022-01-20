<!--
 * @Author: LW
 * @Date: 2020-07-10 16:13:27
 * @LastEditTime: 2020-11-10 18:08:34
 * @Description: 新增信息
-->
<template>
  <div class="newInformation">
    <div class="newInformation-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-form :form="form" @submit="handleSubmit">
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false"  v-bind="formItemLayoutLong">
              <label slot="label">登记单名称：</label>
              <a-input placeholder="请输入登记单名称"
              :style="allWidth"
              :max="30"
              v-decorator="['registerOrderName',
                {rules: [{required: true, max: 30, whitespace: true, message: '请输入登记单名称(不超过30字符)'}], initialValue: newEditSingleData.registerOrderName}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false"  v-bind="formItemLayout">
              <label slot="label">资产项目：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产项目"
                v-decorator="['projectId',{
                    rules: [{required: true, message: '请选择资产项目'}],
                    initialValue: newEditSingleData.projectId
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="projectIdFn"
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
            <a-form-item :colon="false" label="资产类型：" v-bind="formItemLayout">
              <label slot="label">资产类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="['assetType',{
                    rules: [{required: true, message: '请选择资产类型'}],
                    initialValue: newEditSingleData.assetType
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="assetTypeFn"
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
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-decorator="['remark',
                {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: newEditSingleData.remark}
                ]"
                />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</label>
              <div style="display: flex">
                <SG-UploadFile
                  :baseImgURL="configBase.hostImg1"
                  v-model="imgFiles"
                  :max="5"
                  :maxSize="20480"
                  :customDownload="(value)=>{
                  return customDownload(value,$api.ownership.downLoadAnnex)
                }"
                  :customUpload="(value)=>{
                  return customUpload(value,$api.ownership.uploadAnnex)
                }"
                />
              </div>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件：</label>
              <div style="display: flex">  
              <SG-UploadFile
                :baseImgURL="configBase.hostImg1"
                v-model="filepaths"
                type="all"
                :max="5"
                :maxSize="20480"
                :customDownload="(value)=>{
                return customDownload(value,$api.ownership.downLoadAnnex)
              }"
                :customUpload="(value)=>{
                return customUpload(value,$api.ownership.uploadAnnex)
              }"
              />
              </div>
            </a-form-item>

          </a-col>
        </a-form>
      </a-row>
    </div>
  </div>
</template>

<script>
import configBase from "@/config/config.base";
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
import bridge from './center.js'
const newEditSingleData = {
  registerOrderName: '',    // 资产名称
  assetType: undefined,     // 资产类型
  projectId: undefined,     // 资产项目
  remark: '',               // 备注
  organId: ''
}
export default {
  components: {},
  props: {},
  mixins:[uploadAndDownLoadFIle],
  data () {
    return {
      configBase,
      filepaths: [],
      imgFiles: [],
      saveValues: '',
      assetTypeData: [],     // 资产类型
      projectList: [],       // 资产项目列表
      projectIdData: [],     // 资产项目 ID
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
      },
      formItemLayoutLong: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
    }
  },
  computed: {
  },
  watch: {
    imgFiles(files){
      let reg = /^((?!png|jpg|jpeg|bmp).)*$/
      let flag = this.imgFiles.some(item => {
        let str = item.name.split('.')
        return str[str.length-1] !== 'png' && str[str.length-1] !== 'jpg' && str[str.length-1] !== 'jpeg' && str[str.length-1] !== 'bmp'
      })
      if(flag){
        this.$message.error('请上传图片')
        this.imgFiles = files.filter(item => !reg.test(item.name))
      }
    }
  },
  created () {
  },
  mounted () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.organId = this.organIdData[0].value
    this.setType = this.$route.query.setType                 // 判断新增修改
    this.getObjectKeyValueByOrganIdFn()                      // 获取资产项目
    this.platformDictFn()                                    // 获取资产类型
    this.getCodingRulesByCode()                              // 获取资产登记单规则
  },
  methods: {
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
    // 查询编码规则
    getCodingRulesByCode () {
      let obj = {
        organId: this.organId,
        code: 'register_order_name'
      }
      this.$api.publicCode.getCodingRulesByCode(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.form.setFieldsValue({registerOrderName: res.data.data.value})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 平台字典获取资产类型
    platformDictFn () {
      let obj = {
        code: 'asset_type'
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetTypeData = [...data]
          let asset = []
          this.assetTypeData.forEach(item => {
            asset.push(item.value)
          })
        } else {
          this.$message.error(res.data.message)
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
          this.projectList = data
          this.projectIdData = [...arr]
          this.$nextTick(() => {
            this.projectIdFn(this.jupeProjectId)   // 主动调一下
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 项目监听
    projectIdFn (val) {
      let selectedProject = this.projectList.find(ele=>ele.projectId === val)
      let sourceType = selectedProject ? selectedProject.sourceType : ''
      // sourceType 为了 来源方式 默认取 资产项目的来源方式
      bridge.$emit('assetType', val, 'project', sourceType)
    },
    // 资产类型监听
    assetTypeFn (val) {
      bridge.$emit('assetType', val, 'asset')
    },
    /*
    * ref 调用
    * */
    getFilepaths(){
      return [...this.imgFiles, ...this.filepaths]
    },
    // 提交
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.saveValues = values
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.newInformation {
  .playground-row {
    margin: 28px 20px 0 20px;
  }
}
</style>
