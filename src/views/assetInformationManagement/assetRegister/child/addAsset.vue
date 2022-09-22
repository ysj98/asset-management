<template>
  <div class="addAsset" v-if="modelStatus">
    <SG-Modal width="650px" v-model="modelStatus" title="资产登记" confirmText="提交" @ok="onConfirm" @cancel="onCancel">
      <a-form :form="form" @submit="handleSubmit">
        <span class="section-title blue">基本信息</span>
        <div class="playground-row">
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="资产类型：" v-bind="formItemLayout">
                <label slot="label">资产类型：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择资产类型"
                  v-decorator="[
                    'assetType',
                    {
                      rules: [{ required: true, message: '请选择资产类型' }],
                      initialValue: params.assetType,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="assetTypeFn"
                  notFoundContent="没有查询到资产类型"
                >
                  <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">资产名称：</label>
                <a-input placeholder="请输入资产名称" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)' }], initialValue: params.assetName }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">资产编码：</label>
                <a-input placeholder="请输入资产编码" :style="allWidth" :max="30" v-decorator="['assetCode', { rules: [{ required: false, max: 30, whitespace: true, message: '请输入资产编码(不超过30字符)' }], initialValue: params.assetCode }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" :label="title + '：'" v-bind="formItemLayout">
                <label slot="label">{{title}}：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择楼栋名称"
                  v-decorator="[
                    'buildId',
                    {
                      rules: [{ required: true, message: '请选择楼栋名称' }],
                      initialValue: params.buildId,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="assetTypeFn"
                  notFoundContent="没有查询到楼栋名称"
                >
                <a-select-option v-for="(item,index) in positionNameData" :key="index + 'positionNameData'" :value="item.value">
        {{ item.label }}
      </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="房间名称：" v-bind="formItemLayout">
                <label slot="label">资产类型：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择资产类型"
                  v-decorator="[
                    'assetType',
                    {
                      rules: [{ required: true, message: '请选择资产类型' }],
                      initialValue: params.assetType,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="assetTypeFn"
                  notFoundContent="没有查询到资产类型"
                >
                  <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">建筑面积(m2)：</label>
                <a-input placeholder="请输入资产名称" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)' }], initialValue: params.assetName }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">坐落位置：</label>
                <a-input placeholder="请输入资产编码" :style="allWidth" :max="30" v-decorator="['assetCode', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产编码(不超过30字符)' }], initialValue: params.assetCode }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">装修情况：</label>
                <a-input placeholder="请输入资产名称" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)' }], initialValue: params.assetName }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">资产原值(元)：</label>
                <a-input placeholder="请输入资产编码" :style="allWidth" :max="30" v-decorator="['assetCode', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产编码(不超过30字符)' }], initialValue: params.assetCode }]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">市场价值：</label>
                <a-input placeholder="请输入资产名称" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)' }], initialValue: params.assetName }]" />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item :colon="false" label="来源方式：" v-bind="formItemLayout">
                <label slot="label">资产类型：</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择资产类型"
                  v-decorator="[
                    'assetType',
                    {
                      rules: [{ required: true, message: '请选择资产类型' }],
                      initialValue: params.assetType,
                    },
                  ]"
                  :allowClear="false"
                  :filterOption="filterOption"
                  @change="assetTypeFn"
                  notFoundContent="没有查询到资产类型"
                >
                  <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>

      <span class="section-title blue">权属信息</span>
      <div class="playground-row">
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" label="权属类型：" v-bind="formItemLayout">
              <label slot="label">权属类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择权属类型"
                v-decorator="[
                  'assetType',
                  {
                    rules: [{ required: true, message: '请选择权属类型' }],
                    initialValue: params.assetType,
                  },
                ]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="assetTypeFn"
                notFoundContent="没有查询到权属类型"
              >
                <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" label="权属情况：" v-bind="formItemLayout">
              <label slot="label">权属情况：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择权属情况"
                v-decorator="[
                  'assetType',
                  {
                    rules: [{ required: true, message: '请选择权属情况' }],
                    initialValue: params.assetType,
                  },
                ]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="assetTypeFn"
                notFoundContent="没有查询到权属情况"
              >
                <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">权证号：</label>
              <a-input placeholder="请输入权证号" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入权证号(不超过30字符)' }], initialValue: params.assetName }]" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span class="section-title blue">使用方向信息</span>
      <div class="playground-row">
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" label="转运营日期：" v-bind="formItemLayout">
              <label slot="label">转运营日期：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="[
                  'assetType',
                  {
                    rules: [{ required: true, message: '请选择资产类型' }],
                    initialValue: params.assetType,
                  },
                ]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="assetTypeFn"
                notFoundContent="没有查询到资产类型"
              >
                <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">运营面积(m2)：</label>
              <a-input placeholder="请输入运营面积" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)' }], initialValue: params.assetName }]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">其他面积：</label>
              <a-input placeholder="请输入其他面积" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入其他面积(不超过30字符)' }], initialValue: params.assetName }]" />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">闲置面积：</label>
              <a-input placeholder="请输入闲置面积" :style="allWidth" :max="30" v-decorator="['assetCode', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入闲置面积(不超过30字符)' }], initialValue: params.assetCode }]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">自用面积：</label>
              <a-input placeholder="请输入其他面积" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入其他面积(不超过30字符)' }], initialValue: params.assetName }]" />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">占地面积：</label>
              <a-input placeholder="请输入闲置面积" :style="allWidth" :max="30" v-decorator="['assetCode', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入闲置面积(不超过30字符)' }], initialValue: params.assetCode }]" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span class="section-title blue">其他信息</span>
      <div class="playground-row">
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">债券金额(元)：</label>
              <a-input placeholder="请输入债券金额" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)' }], initialValue: params.assetName }]" />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">债务金额(元)：</label>
              <a-input placeholder="请输入债务金额" :style="allWidth" :max="30" v-decorator="['assetName', { rules: [{ required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)' }], initialValue: params.assetName }]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" label="楼栋名称：" v-bind="formItemLayout">
              <label slot="label">资产类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="[
                  'assetType',
                  {
                    rules: [{ required: true, message: '请选择资产类型' }],
                    initialValue: params.assetType,
                  },
                ]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="assetTypeFn"
                notFoundContent="没有查询到资产类型"
              >
                <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" label="楼栋名称：" v-bind="formItemLayout">
              <label slot="label">资产类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="[
                  'assetType',
                  {
                    rules: [{ required: true, message: '请选择资产类型' }],
                    initialValue: params.assetType,
                  },
                ]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="assetTypeFn"
                notFoundContent="没有查询到资产类型"
              >
                <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" label="楼栋名称：" v-bind="formItemLayout">
              <label slot="label">资产类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="[
                  'assetType',
                  {
                    rules: [{ required: true, message: '请选择资产类型' }],
                    initialValue: params.assetType,
                  },
                ]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="assetTypeFn"
                notFoundContent="没有查询到资产类型"
              >
                <a-select-option :title="item.name" v-for="item in assetTypeData" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="playground-col" :span="12">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
              <a-textarea placeholder="请输入备注" :style="widthBox" :autosize="{ minRows: 2, maxRows: 4 }" v-decorator="['remark', { rules: [{ required: false, max: 200, message: '请输入问题备注(不超过200字符)' }], initialValue: newEditSingleData.remark }]" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </SG-Modal>
  </div>
</template>
<script>
const params = {
  assetType: '1',
  assetName: '',
  assetCode: '',
}
export default {
  props: {
    organId: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      modelStatus: true,
      assetTypeData: [{ name: '房屋', value: '1' }], // 资产类型
      form: this.$form.createForm(this),
      params,
      allWidth: 'width: 160px',
      widthBox: 'width: 80%',
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
    }
  },
  mounted() {
    this.getCodingRulesByCode() // 获取资产登记单规则
    // this.platformDictFn() // 获取资产类型
  },
  methods: {
    title() {
      const ASSET_TYPE_CODE = this.$store.state.ASSET_TYPE_CODE;
      const title = {
        [ASSET_TYPE_CODE.HOUSE]: "楼栋名称",
        [ASSET_TYPE_CODE.LAND]: "土地名称",
        [ASSET_TYPE_CODE.YARD]: "车场名称",
        [ASSET_TYPE_CODE.EQUIPMENT]: "设备设施分类"
      };
      return title[this.params.assetType];
    },
    // 查询编码规则
    getCodingRulesByCode() {
      let obj = {
        organId: this.organId,
        code: 'register_order_name',
      }
      this.$api.publicCode.getCodingRulesByCode(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.form.setFieldsValue({ registerOrderName: res.data.data.value })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        } else {
          // console.log('Received values of form: ', values)
        }
      })
    },
    onConfirm() {
      this.modelStatus = false
      this.form.validateFields((err, values) => {
        if (!err) {
          this.saveValues = values
        }
      })
    },
    onCancel() {
      this.modelStatus = false
    },
    assetTypeFn() {},
    // 平台字典获取资产类型
    platformDictFn() {
      let obj = {
        code: 'asset_type',
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetTypeData = [...data]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>
<style lang="less" scoped>
.playground-row {
  margin: 28px 20px 0 20px;
}
</style>
