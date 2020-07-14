<!--
 * @Author: LW
 * @Date: 2020-07-14 14:43:17
 * @LastEditTime: 2020-07-14 18:09:16
 * @Description: 新增附属配套
--> 
<template>
  <div class="basicDownload">
    <SG-Modal
      width="800px"
      v-model="modalShow"
      okText="提交"
      title="新增附属配套"
      @cancel="handleCancel"
      @ok="handleSubmit"
    >
    <div>
      <span class="section-title blue">资产信息</span>
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit">
            <a-col :span="12">
              <a-form-item label="名称" v-bind="formItemLayout">
                <a-select
                  :placeholder="'请选择资产名称'" :style="allWidth"
                  showSearch
                  :options="projectIdData"
                  :allowClear="true"
                  :filterOption="filterOption"
                  v-decorator="['assetName',
                      {rules: [{required: true, message: '请选择类型'}], initialValue: subData.assetName}
                    ]"
                  notFoundContent="没有查询到数据"
                  />
              </a-form-item>
            </a-col>
          </a-form>
          <a-col :span="12"><a-form-item label="资产编码：" v-bind="formItemLayout">{{subData.assetCode || '--'}}</a-form-item></a-col>
          <a-col :span="12"><a-form-item label="资产分类：" v-bind="formItemLayout">{{subData.objectType || '--'}}</a-form-item></a-col>
          <a-col :span="12"><a-form-item label="资产位置：" v-bind="formItemLayout">{{subData.pasitionString || '--'}}</a-form-item></a-col>
        </a-row>
      <span class="section-title blue">附属配套信息</span>
      <div class="mt30 mb30">
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit">
            <a-col :span="12">
              <a-form-item label="名称" v-bind="formItemLayout">
                <a-input placeholder="请输入名称"
                :style="allWidth"
                :max="30"
                v-decorator="['matchingName',
                  {rules: [{required: true, max: 30, message: '请输入名称(不超过30字符)'}], initialValue: subData.matchingName}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="编码" v-bind="formItemLayout">
                <a-input placeholder="请输入编码"
                :style="allWidth"
                :max="30"
                v-decorator="['matchingCode',
                  {rules: [{required: true, max: 30, message: '请输入编码(不超过30字符)'}], initialValue: subData.matchingCode}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="类型" v-bind="formItemLayout">
                <a-select
                  :placeholder="'请选择类型'" :style="allWidth"
                  showSearch
                  :options="matchingTypeData"
                  :allowClear="true"
                  :filterOption="filterOption"
                  v-decorator="['registerOrderCode',
                    {rules: [{required: true, message: '请选择类型'}], initialValue: subData.matchingType}
                  ]"
                  notFoundContent="没有查询到数据"
                  />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="规格型号" v-bind="formItemLayout">
                <a-input placeholder="请输入规格型号"
                :style="allWidth"
                :max="30"
                v-decorator="['specificationType',
                  {rules: [{max: 30}], initialValue: subData.specificationType}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
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
            <a-col :span="12">
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
            <a-col :span="12">
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
            <a-col :span="12">
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
export default {
  components: {},
  props: {},
  data () {
    return {
      organId: '67',
      form: this.$form.createForm(this),
      modalShow: false,
      projectIdData: [
        { label: 1, key: 1 }
      ],    // 资产名称
      matchingTypeData: [], // 类型
      unitOfMeasurementOpt: [],    // 计量单位
      subData: {
        subsidiaryMatchingId: '',  // 附属配套ID,修改必有
        registerOrderId: '',       // 资产登记ID
        assetId: '',               // 资产登记ID
        assetName: undefined,      // 资产名称
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
    this.organDict('SUBSIDIARY_MATCHING_TYPE')
    this.organDict('MEASURE_UNIT')
  },
  methods: {
    // 提交
    addModifySaveByRgId () {
      console.log(this.subData, '-=')
      let obj = {
            subsidiaryMatchingId: '',      //  附属配套ID,修改必有
            registerOrderId: '',           //  资产登记ID
            assetId: '',                   //  资产信息ID
            status: '',                    //  状态 1启用 0停用      新增默认启动
            matchingName: '',              //  名称
            matchingCode: '',              //  编码
            matchingType: '',              //  类型 SUBSIDIARY_MATCHING_ TYPE 1门、2窗、3仪表、4家具、5设备、6电梯
            specificationType: '',         //  规格型号
            value: '',                     //  价值(元)
            number: '',                    //  数量
            unitOfMeasurement: '',         //  计量单位
            isBefore: '',                  //  是否接管前附属配套 1是 0否
            remark: '',                    //  备注
            attachmentList: []             //附件
      }
      console.log(obj)
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
          this.$message.error(res.data.message);
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
</style>