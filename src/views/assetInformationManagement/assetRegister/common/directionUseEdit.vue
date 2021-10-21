<!--
 * @Author: LW
 * @Date: 2020-07-15 17:22:25
 * @LastEditTime: 2020-07-30 20:03:11
 * @Description: 使用方向
-->
<template>
  <div class="basicDownload">
    <SG-Modal
      :centered="true"
      width="800px"
      v-model="modalShow"
      okText="提交"
      title="编辑使用方向"
      @cancel="handleCancel"
      @ok="handleSubmit"
    >
    <div class="directionUseEdit">
      <span class="section-title blue">资产信息</span>
        <a-row class="playground-row">
          <a-col :span="12" class="playground-col">资产名称：{{examine.assetName || '--'}}</a-col>
          <a-col :span="12" class="playground-col">资产编码：{{examine.assetCode || '--'}}</a-col>
          <a-col :span="12" class="playground-col">资产分类：{{examine.objectTypeName || '--'}}</a-col>
          <a-col :span="12" class="playground-col">建筑面积(㎡)：{{examine.buildArea || '--'}}</a-col>
        </a-row>
      <span class="section-title blue">使用方向</span>
      <div v-if="isEquipment" class="mt30 mb30">
        <a-col :span="12" class="h-65">
          <a-form-item label="转物业时间" v-bind="formItemLayout">
            <a-date-picker
              :style="allWidth"
              placeholder="转物业时间"
              v-decorator="['transferTime',
                {rules: [{ required: false, message: '转物业时间'}]}
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" class="h-65">
          <a-form-item label="使用方向" v-bind="formItemLayout">
            <a-select style="width: 200px;"></a-select>
          </a-form-item>

        </a-col>
      </div>
      <div v-else class="mt30 mb30">
        <a-row>
          <a-form :form="form" @submit="handleSubmit">
            <a-col :span="12" class="h-65">
              <a-form-item label="转物业时间" v-bind="formItemLayout">
                <a-date-picker
                :style="allWidth"
                placeholder="转物业时间"
                v-decorator="['transferTime',
                  {rules: [{ required: false, message: '转物业时间'}]}
                ]"
                />
                </a-form-item>
             </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="转物业面积" v-bind="formItemLayout">
                <a-input-number placeholder="转物业面积"
                :style="allWidth"
                :min="0"
                :precision="2"
                :max="99999999.99"
                v-decorator="['transferArea',
                  {rules: [{required: false, message: '转物业面积(支持两位小数)'}], initialValue: subData.transferArea}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="转运营时间" v-bind="formItemLayout">
                <a-date-picker
                :style="allWidth"
                placeholder="转运营时间"
                v-decorator="['transferOperationTime',
                  {rules: [{ required: false, message: '转运营时间'}]}
                ]"
                />
                </a-form-item>
             </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="运营面积(㎡)" v-bind="formItemLayout">
                <a-input-number placeholder="运营面积(㎡)"
                :style="allWidth"
                :min="0"
                :max="99999999.99"
                :precision="2"
                v-decorator="['transferOperationArea',
                  {rules: [{ required: true, message: '运营面积(㎡)(支持两位小数)'}], initialValue: subData.transferOperationArea}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="自用面积(㎡)" v-bind="formItemLayout">
                <a-input-number placeholder="自用面积(㎡)"
                :style="allWidth"
                :min="0"
                :max="99999999.99"
                :precision="2"
                v-decorator="['selfUserArea',
                  {rules: [{ required: true, message: '自用面积(㎡)(支持两位小数)'}], initialValue: subData.selfUserArea}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="占用面积(㎡)" v-bind="formItemLayout">
                <a-input-number placeholder="占用面积(㎡)"
                :style="allWidth"
                :min="0"
                :max="99999999.99"
                :precision="2"
                v-decorator="['occupationArea',
                  {rules: [{ required: true, message: '占用面积(㎡)(支持两位小数)'}], initialValue: subData.occupationArea}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="其他面积(㎡)" v-bind="formItemLayout">
                <a-input-number placeholder="其他面积(㎡)"
                :style="allWidth"
                :min="0"
                :max="99999999.99"
                :precision="2"
                v-decorator="['otherArea',
                  {rules: [{ required: true, message: '其他面积(㎡)(支持两位小数)'}], initialValue: subData.otherArea}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="闲置面积(㎡)" v-bind="formItemLayout">
                <a-input-number placeholder="闲置面积(㎡)"
                :style="allWidth"
                :min="0"
                :max="99999999.99"
                :precision="2"
                v-decorator="['idleArea',
                  {rules: [{ required: true, message: '闲置面积(㎡)(支持两位小数)'}], initialValue: subData.idleArea}
                ]"/>
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
import moment from 'moment'
const conditionalJudgment = [undefined, null, '']
export default {
  components: {},
  props: {
    isEquipment:{
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      organId: '67',
      form: this.$form.createForm(this),
      modalShow: false,
      examine: {},
      subData: {
        assetId: '',                 // 资产ID
        transferTime: '',            // 转物业时间
        transferArea: '',            // 转物业面积(㎡)
        transferOperationTime: '',   // 转运营时间
        transferOperationArea: '',   // 运营面积(㎡)
        selfUserArea: '',            // 自用面积(㎡)
        idleArea: '',                // 闲置面积(㎡)
        occupationArea: '',          // 占用面积(㎡)
        otherArea: ''                // 其他面积(㎡)
      },
      assetName: '',
      allWidth: {width: '200px'},
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 }
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
    moment,
    // 编辑查询
    getValueDetail (record) {
      this.examine = record
      let data = {
        assetId	: record.assetId
      }
      this.$api.assets.useForDetail(data).then(res => {
        if (res.data.code === "0") {
          let obj = res.data.data || {}
          this.examine = obj
          this.subData.assetId = obj.assetId
          // 处理表单数据
          let o = {transferTime: obj.transferTime ? moment(obj.transferTime, 'YYYY-MM-DD') : undefined}
          // 转物业时间
          if (!this.isEquipment){
            Object.assign(o,{
              transferArea: obj.transferArea,                     // 转物业面积(㎡)
              transferOperationTime: obj.transferOperationTime ? moment(obj.transferOperationTime, 'YYYY-MM-DD') : undefined,   // 转运营时间
              transferOperationArea: obj.transferOperationArea,   // 运营面积(㎡)
              selfUserArea: obj.selfUserArea,                     // 自用面积(㎡)
              idleArea: obj.idleArea,                             // 闲置面积(㎡)
              occupationArea: obj.occupationArea,                 // 占用面积(㎡)
              otherArea: obj.otherArea                            // 其他面积(㎡)
            })
          }
          this.form.setFieldsValue(o)
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    // 提交
    useForUpdate (values) {
      let obj = {
        assetId: this.subData.assetId,
        transferTime: conditionalJudgment.includes(values.transferTime) ? '' : `${values.transferTime.format('YYYY-MM-DD')}`,                     // 转物业时间
        transferArea: conditionalJudgment.includes(values.transferArea) ? '' : values.transferArea,                     // 转物业面积(㎡)
        transferOperationTime: conditionalJudgment.includes(values.transferOperationTime) ? '' : `${values.transferOperationTime.format('YYYY-MM-DD')}`,   // 转运营时间
        transferOperationArea: conditionalJudgment.includes(values.transferOperationArea) ? '' : values.transferOperationArea,   // 运营面积(㎡)
        selfUserArea: conditionalJudgment.includes(values.selfUserArea) ? '' : values.selfUserArea,                     // 自用面积(㎡)
        idleArea: conditionalJudgment.includes(values.idleArea) ? '' : values.idleArea,                             // 闲置面积(㎡)
        occupationArea: conditionalJudgment.includes(values.occupationArea) ? '' : values.occupationArea,                 // 占用面积(㎡)
        otherArea: conditionalJudgment.includes(values.otherArea) ? '' : values.otherArea                            // 其他面积(㎡)
      }
      console.log(values, 'dddd')
      let loadingName = this.SG_Loding('保存中...')
      this.$api.assets.useForUpdate(obj).then(res => {
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
          this.useForUpdate(values)
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
.playground-row {
  margin: 20px;
  .playground-col {
    line-height: 40px;
    font-size: 12px;
  }
}
.directionUseEdit {
  max-height: 550px;
  overflow: auto;
  padding: 32px 18px 20px 18px;
  .h-65 {
    height: 65px;
  }
}
</style>
