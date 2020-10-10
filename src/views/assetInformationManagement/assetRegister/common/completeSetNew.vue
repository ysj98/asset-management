<!--
 * @Author: LW
 * @Date: 2020-07-14 14:43:17
 * @LastEditTime: 2020-10-10 10:52:42
 * @Description: 新增附属配套
--> 
<template>
  <div class="basicDownload">
    <SG-Modal
     :centered="true"
      width="800px"
      v-model="modalShow"
      okText="提交"
      :title="type === 'new' ? '新增附属配套' : '编辑附属配套'"
      @cancel="handleCancel"
      @ok="handleSubmit"
    >
    <div class="completeSetNew">
      <span class="section-title blue">资产信息</span>
        <div class="mt20">
          <a-row class="playground-row">
              <a-form :form="form" @submit="handleSubmit">
                <a-col :span="12" :class="{'h-65': type === 'new'}" v-if="type === 'new'">
                  <a-form-item label="名称" v-bind="formItemLayout">
                    <a-select
                      :placeholder="'请选择资产名称'" :style="allWidth"
                      showSearch
                      :options="examine.projectIdData"
                      :allowClear="true"
                      @change="assetFn"
                      optionFilterProp="children"
                      @search="handleSearch"
                      :filterOption="false"
                      v-decorator="['assetId',
                          {rules: [{required: true, message: '请选择类型'}], initialValue: subData.assetId}
                        ]"
                      notFoundContent="没有查询到数据"
                      />
                  </a-form-item>
                </a-col>
              <a-col v-if="type === 'edit'" :class="{'h-40': type === 'edit'}" :span="12"><a-form-item label="资产名称：" v-bind="formItemLayout">{{examine.assetName || '--'}}</a-form-item></a-col>
              <a-col :span="12" :class="{'h-65': type === 'new', 'h-40': type === 'edit'}"><a-form-item label="资产编码：" v-bind="formItemLayout">{{examine.assetCode || '--'}}</a-form-item></a-col>
              <a-col :span="12" :class="{'h-65': type === 'new', 'h-40': type === 'edit'}"><a-form-item label="资产分类：" v-bind="formItemLayout">{{examine.objectTypeName || '--'}}</a-form-item></a-col>
              <a-col :span="12" :class="{'h-65': type === 'new', 'h-40': type === 'edit'}"><a-form-item label="资产位置：" v-bind="formItemLayout">{{examine.pasitionString || '--'}}</a-form-item></a-col>
            </a-form>
          </a-row>
        </div>
      <span class="section-title blue">附属配套信息</span>
      <div class="mt30 mb30">
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit">
            <a-col :span="12" class="h-65">
              <a-form-item label="名称" v-bind="formItemLayout">
                <a-input placeholder="请输入名称"
                :style="allWidth"
                :max="30"
                v-decorator="['matchingName',
                  {rules: [{required: true, max: 30, message: '请输入名称(不超过30字符)'}], initialValue: subData.matchingName}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="编码" v-bind="formItemLayout">
                <a-input placeholder="请输入编码"
                :style="allWidth"
                :max="30"
                v-decorator="['matchingCode',
                  {rules: [{required: true, max: 30, message: '请输入编码(不超过30字符)'}], initialValue: subData.matchingCode}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="类型" v-bind="formItemLayout">
                <a-select
                  :placeholder="'请选择类型'" :style="allWidth"
                  showSearch
                  :options="matchingTypeData"
                  :allowClear="true"
                  :filterOption="filterOption"
                  v-decorator="['matchingType',
                    {rules: [{required: true, message: '请选择类型'}], initialValue: subData.matchingType}
                  ]"
                  notFoundContent="没有查询到数据"
                  />
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="规格型号" v-bind="formItemLayout">
                <a-input placeholder="请输入规格型号"
                :style="allWidth"
                :max="30"
                v-decorator="['specificationType',
                  {rules: [{required: false, max: 30, message: '请输入规格型号(不超过30字符)'}], initialValue: subData.specificationType}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="价值(元)" v-bind="formItemLayout">
                <a-input-number placeholder="请输入价值(元)"
                :style="allWidth"
                :max="999999999.99"
                :min="0"
                :precision="2"
                v-decorator="['value',
                  {rules: [{required: true, message: '请输入价值(元)(支持两位小数)'}], initialValue: subData.value}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="数量" v-bind="formItemLayout">
                <a-input-number placeholder="数量"
                :style="allWidth"
                :max="999999999.99"
                :min="0"
                v-decorator="['number',
                  {rules: [{required: true, message: '请输入数量(正整数)'}], initialValue: subData.number}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="计量单位" v-bind="formItemLayout">
                <a-select
                  :placeholder="'请选择计量单位'" :style="allWidth"
                  showSearch
                  :options="unitOfMeasurementOpt"
                  :allowClear="true"
                  :filterOption="filterOption"
                  v-decorator="['unitOfMeasurement',
                    {rules: [{message: '请选择计量单位'}], initialValue: subData.unitOfMeasurement}
                  ]"
                  notFoundContent="没有查询到数据"
                  />
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item>
              <a-checkbox :checked="subData.isBefore" @change="handleChange">
                接管前附属配套
              </a-checkbox>
            </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注：" v-bind="formItemTextarea">
                <a-textarea placeholder="请输入备注"
                  :style="widthBox"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-decorator="['remark',
                  {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: subData.remark}
                  ]"
                  />
              </a-form-item>
            </a-col>
            <a-col :span="24">
                <a-form-item :colon="false" v-bind="formItemTextarea">
                  <label slot="label">上传附件：</label>
                  <SG-UploadFile
                    v-model="subData.files"
                    type="all"
                  />
                </a-form-item>
              </a-col>
          </a-form>
        </a-row>
        </div>
    </div>
    </SG-Modal>
  </div>
</template>

<script>
import {debounce} from '@/utils/utils'
export default {
  components: {},
  props: {},
  data () {
    return {
      type: '',                   // 新增编辑
      organId: '',
      form: this.$form.createForm(this),
      modalShow: false,
      matchingTypeData: [],       // 类型
      unitOfMeasurementOpt: [],   // 计量单位
      examine: {
        projectIdData: [],                        // 资产名称
      },
      subData: {
        subsidiaryMatchingId: '',  // 附属配套ID,修改必有
        registerOrderId: '',       // 资产登记ID
        assetId: undefined,               // 资产登记ID
        status: '',                // 状态
        matchingName: '',          // 名称
        matchingCode: '',          // 编码
        matchingType: undefined,   // 类型
        specificationType: '',     // 规格型号
        unitOfMeasurement: undefined,     // 计量单位
        isBefore: false,           // 否接管前附属配套
        value: '',                 // 价值登记
        number: '',                // 数量
        remark: '',                // 备注
        files: []                  // 附件
      },
      assetName: '',
      allWidth: {width: '200px'},
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
  created () {
  },
  watch: {
    modalShow (nv) {
      if (!nv) {
        this.handleCancel()
      }
    }
  },
  mounted () {
  },
  methods: {
    allMounted (str, obj) {
      this.subData.registerOrderId = obj.registerOrderId
      this.organId = obj.organId
      this.type = str
      if (str === 'edit') {
        this.subData.assetId = obj.assetId
        this.examine.assetName = obj.assetName
        this.examine.assetCode = obj.assetCode
        this.examine.objectTypeName = obj.objectTypeName
        this.examine.pasitionString = obj.pasitionString
          this.subData.subsidiaryMatchingId = obj.subsidiaryMatchingId
        this.getMatchingById()
      } else {
         this.findAssetListByRgId(this.subData.registerOrderId, '')
      }
      this.organDict('SUBSIDIARY_MATCHING_TYPE')
      this.organDict('MEASURE_UNIT')
    },
    // 编辑查询
    getMatchingById () {
      let data = {
        subsidiaryMatchingId: this.subData.subsidiaryMatchingId
      }
      this.$api.subsidiary.getMatchingById(data).then(res => {
        if (res.data.code === "0") {
          let obj = res.data.data || {}
          // 处理表单数据
          let o = {
            matchingName: obj.matchingName,
            matchingCode: obj.matchingCode,
            matchingType: String(obj.matchingType),
            specificationType: obj.specificationType,
            value: obj.value,
            number: obj.number,
            unitOfMeasurement: obj.unitOfMeasurement || '',
            remark: obj.remark,
          }
          // 处理复选框
          this.subData.isBefore = String(obj.isBefore) === '1' ? true : false
          // 处理附件
          if (obj.attachmentList && obj.attachmentList.length) {
            this.subData.files = obj.attachmentList.map(item => {
              return {url: item.attachmentPath, name: item.oldAttachmentName}
            })
          } else {
            this.subData.files = []
          }
          this.oldDetailData = {...obj}
          this.form.setFieldsValue(o)
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    // 提交
    addModifySaveByRgId (values) {
      let files = []
      if (this.subData.files.length !== 0) {
        this.subData.files.forEach(item => {
          files.push({
            attachmentPath: item.url,
            oldAttachmentName: item.name
          })
        })
      }
      let obj = {
        subsidiaryMatchingId: this.subData.subsidiaryMatchingId,  //  附属配套ID,修改必有
        registerOrderId: this.subData.registerOrderId,            //  资产登记ID
        assetId: this.subData.assetId,                            //  资产信息ID
        status: this.type === 'new' ? '1' : this.subData.status,  //  状态 1启用 0停用      新增默认启动
        matchingName: values.matchingName,                        //  名称
        matchingCode: values.matchingCode,                        //  编码
        matchingType: values.matchingType,                        //  类型 SUBSIDIARY_MATCHING_ TYPE 1门、2窗、3仪表、4家具、5设备、6电梯
        specificationType: values.specificationType,              //  规格型号
        value: values.value,                                      //  价值(元)
        number: values.number,                                    //  数量
        unitOfMeasurement: values.unitOfMeasurement || '',              //  计量单位
        isBefore: Number(this.subData.isBefore),                  //  是否接管前附属配套 1是 0否
        remark: values.remark,                                    //  备注
        attachmentList: files                                     // 附件
      }
      let loadingName = this.SG_Loding('保存中...')
      this.$api.assets.addModifySaveByRgId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('提交成功')
            this.$emit('allQuery')
            this.handleCancel()
          })
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$message.error(res.data.message)
          })
        }
      })
    },
    assetFn (val) {
      this.subData.assetId = val
      this.examine.projectIdData.forEach(item => {
        if (item.assetId === val) {
          this.examine.assetName = item.assetName
          this.examine.assetCode = item.assetCode
          this.examine.objectTypeName = item.objectTypeName
          this.examine.pasitionString = item.pasitionString
        }
      })
    },
    // 搜索
    handleSearch (value) {
      this.assetName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
        this.findAssetListByRgId(this.subData.registerOrderId, this.assetName || '')
    }, 200),
    findAssetListByRgId (registerOrderId, assetName) {
      let obj = {
        registerOrderId: registerOrderId,    // 资产登记单Id
        assetName: assetName           // 资产名称，支持模糊查询
      }
      this.$api.assets.findAssetListByRgId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          if (data && data.length !== 0) {
            data.forEach(item => {
              arr.push({label: item.assetName, value: item.assetId, ...item})
            })
            this.examine.projectIdData = arr
          } else {
            this.examine.projectIdData = []
            this.examine.assetName = ''
            this.examine.assetCode = ''
            this.examine.objectTypeName = ''
            this.examine.pasitionString = ''
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 机构字典
    organDict (code) {
      this.$api.assets.organDict({ organId: this.organId, code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item, key: item.value }));
          // 附属信息类型
          if (code === "SUBSIDIARY_MATCHING_TYPE") {
            this.matchingTypeData = [...arr]
          }
          // 计量单位
          if (code === "MEASURE_UNIT") {
            this.unitOfMeasurementOpt  = [...arr]
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange (e) {
     this.subData.isBefore = e.target.checked
    },
    commonFn () {
      this.handleSubmit()
    },
    // 取消
    handleCancel () {
      this.show = false
      this.$emit('cancel')
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.addModifySaveByRgId(values)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.modal-nav {
  line-height: 60px;
}
.completeSetNew {
  max-height: 550px;
  overflow: auto;
  padding: 32px 18px;
  .h-65 {
    height: 65px;
  }
  .h-40 {
    height: 40px;
  }
}
</style>