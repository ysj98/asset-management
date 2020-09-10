<!--
 * @Description: 新建资产信息 配套附属资源
 * @Date: 2020-02-17 19:01:00
 * @LastEditTime: 2020-09-10 14:00:17
 -->
<template>
  <a-spin :spinning="spinning">
    <div class="inventoryPlan-create">
      <div class="edit-box">
        <div>
          <SG-Title noMargin title="资产信息" />
        </div>
        <!-- 由资产项目带出数据 -->
        <div class="edit-box-content">
          <!-- 一项数据 -->
           <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                所属组织机构
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{organName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box required">
              <span class="label-name label-space-between">
                资产名称
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{selectObj.assetName || '-'}}<SG-Button @click="showRadioAssetModal" type="primary" icon="plus" size="small" class="ml10" weaken>选择</SG-Button></span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产编码
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{selectObj.assetCode || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box required">
              <span class="label-name label-space-between">
                资产项目
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{selectObj.projectName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产类型
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{selectObj.assetTypeName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产分类
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{selectObj.assetCategoryName || selectObj.objectTypeName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产状态
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{selectObj.assetStatusName || selectObj.statusName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产位置
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{selectObj.address || '-'}}</span>
            </div>
          </div>
        </div>
        <div>
          <SG-Title noMargin title="附属配套信息" />
        </div>
        <!-- 表单填写数据 -->
        <div>
         <a-form :form="form">
           <div class="edit-box-content">
           <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                名称
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input
                placeholder="请输入名称"
                :style="allStyle"
                :maxLength="30"
                v-decorator="[
                  'matchingName',
                  {
                    rules: [
                      {
                        required: true,
                        max: 30,
                        whitespace: true,
                        message: '请输入名称(不超过30字符)'
                      }
                    ],
                    initialValue: ''
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                编码
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input
                placeholder="请输入编码"
                :style="allStyle"
                :maxLength="30"
                v-decorator="[
                  'matchingCode',
                  {
                    rules: [
                      {
                        required: true,
                        max: 30,
                        whitespace: true,
                        message: '请输入编码名称(不超过30字符)'
                      }
                    ],
                    initialValue: ''
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                类型
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择类型"
                v-decorator="[
                  'matchingType',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择类型'
                      }
                    ],
                    initialValue: undefined
                  }
                ]"
                optionFilterProp="children"
                :style="allStyle"
                :options="matchingTypeOpt"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                规格型号
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input
                placeholder="请输入规格型号"
                :style="allStyle"
                :maxLength="30"
                v-decorator="[
                  'specificationType',
                  {
                    rules: [
                      {
                        max: 30,
                        whitespace: true,
                        message: '请输入计划名称不超过30字符'
                      }
                    ],
                    initialValue: undefined
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                价值
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input-number
               :max="999999999.99"
               :min="0"
               :precision="2"
                :style="allStyle"
                placeholder="请输入价值"
                v-decorator="[
                  'value',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入价值'
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                数量
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input-number
               :max="999999999.99"
               :min="0"
               :precision="0"
                :style="allStyle"
                placeholder="请输入数量"
                v-decorator="[
                  'number',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入数量'
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                计量单位
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择计量单位"
                v-decorator="[
                  'unitOfMeasurement',
                  {
                    rules: [
                      {
                        message: '请选择计量单位'
                      }
                    ],
                    initialValue: undefined
                  }
                ]"
                optionFilterProp="children"
                :style="allStyle"
                :options="unitOfMeasurementOpt"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <!-- <div class="label-name-box">
              <span class="label-name label-space-between">
                <i></i>
              </span>
              <span></span>
            </div> -->
            <a-form-item>
              <a-checkbox :checked="checkNick" @change="handleChange">
                接管前附属配套
              </a-checkbox>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                备注
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入备注（最多200字）"
                :rows="3"
                :maxLength="200"
                v-decorator="['remark', { initialValue: '' }]"
              ></a-textarea>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">附件<i></i></span
              ><span>：</span>
            </div>
            <a-form-item class="label-value">
              <SG-UploadFile  type="all" :maxSize="5120" v-model="filepaths" />
            </a-form-item>
          </div>
         </div>
         </a-form>
        </div>
      </div>
      <FormFooter
      v-if="['create', 'edit'].includes(type)"
      style="border:none;"
      location="fixed"
    >
      <SG-Button @click="handleSave" type="primary">提交</SG-Button>
    </FormFooter>
    </div>
    <!-- 选资产 -->
		<radioAssetModal :selectObj="selectObj" ref="radioAssetModal" :organId="organId" :organName="organName" queryType="5" :judgeInstitutions="false" @select="assetChange"></radioAssetModal>
  </a-spin>
</template>
<script>
import radioAssetModal from './child/radioAssetModal'
import FormFooter from "@/components/FormFooter.vue"
let getUuid = ((uuid = 1) => () => ++uuid)()
const allStyle = { width: "200px" }
export default {
  components: {
    radioAssetModal,
    FormFooter
  },
  data () {
    return {
      spinning: false,
      form: this.$form.createForm(this),
      allStyle,
      filepaths: [],
      checkNick: false,
      exePreOpt: [],
      type: 'create',
      organId: '',
      organName: '',
      subsidiaryMatchingId: '',
      assetId: '',
      matchingTypeOpt: [],
      unitOfMeasurementOpt: [],
      selectObj: {},
      oldDetailData: {}
    }
  },
  created () {
    this.organId = this.$route.query.organId || ''
    this.organName = this.$route.query.organName || ''
    this.type = this.$route.query.type || ''
    this.subsidiaryMatchingId = this.$route.query.subsidiaryMatchingId || ''
    this.assetId = this.$route.query.assetId || ''
    if (this.subsidiaryMatchingId && this.type !== 'create') {
      this.getMatchingById()
      this.getAssetById()
    }
    this.organDict('SUBSIDIARY_MATCHING_TYPE')
    this.organDict('MEASURE_UNIT')
  },
  methods: {
    getMatchingById () {
      let data = {
        subsidiaryMatchingId: this.subsidiaryMatchingId
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
            unitOfMeasurement: obj.unitOfMeasurement,
            remark: obj.remark,
          }
          // 处理复选框
          this.checkNick = String(obj.isBefore) === '1' ? true : false
          // 处理附件
          if (obj.attachmentList && obj.attachmentList.length) {
            this.filepaths = obj.attachmentList.map(item => {
              return {url: item.attachmentPath, name: item.oldAttachmentName}
            })
          } else {
            this.filepaths = []
          }
          this.oldDetailData = {...obj}
          this.form.setFieldsValue(o)
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    // 请求资产项目信息
    getAssetById () {
      let data = {
        assetId: this.assetId
      }
      this.$api.subsidiary.getAssetById(data).then(res => {
        if (res.data.code === "0") {
          let obj = res.data.data || {}
          this.selectObj = {...obj}
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    handleSave () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.validateFrom(values )) {
            return
          }
          let data = {}
          data.organId = this.organId
          let keys = ['matchingName', 'matchingCode', 'matchingType', 'specificationType', 'value', 'number', 'unitOfMeasurement', 'remark']
          keys.forEach(item => {
            data[item] = values[item] !== undefined ? values[item] : ''
          })
          data.isBefore = this.checkNick ? '1' : '0'
          data.attachmentList = this.filepaths.map(item => {
            return {attachmentPath: item.url, oldAttachmentName: item.name}
          })
          // 如果不是新增
          if (this.type !== 'create') {
            data.subsidiaryMatchingId = this.subsidiaryMatchingId
            data.status = this.oldDetailData.status
          }
          // 新增
          if (this.type === 'create') {
            data.assetId = this.selectObj.assetId
            data.status = '1'
          }
          let loadingName = this.SG_Loding('提交中...')
          this.$api.subsidiary.modifySave(data).then(res => {
            this.DE_Loding(loadingName).then(() => {
              if (res.data.code === '0') {
                this.$SG_Message.success('提交成功!')
                this.$router.push({ path: '/subsidiary', query: {refresh: true} });
              } else {
                this.$message.error(res.data.message)
              }
            })
          }).catch(() => {
            this.DE_Loding(loadingName).then(res => {
              this.$SG_Message.error('提交失败！')
            })
          })
        }
      })
    },
    // 验证项目
    validateFrom () {
      if (!this.selectObj.assetId) {
        this.$message.error('请选择资产名称!')
        return false
      }
      return true
    },
    handleChange (e) {
     this.checkNick = e.target.checked;
    },
    showRadioAssetModal () {
       this.$refs.radioAssetModal.show = true
       this.$nextTick(() => {
        this.$refs.radioAssetModal.query()
       })
    },
    // 资产选择变动
    assetChange (row) {
      console.log('你好世界=>', row)
      this.selectObj = row
    },
    // 机构字典
    organDict (code) {
      this.$api.assets.organDict({ organId: this.organId, code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item, key: item.value }));
          // 附属信息类型
          if (code === "SUBSIDIARY_MATCHING_TYPE") {
            this.matchingTypeOpt = [
              ...arr
            ];
          }
          // 计量单位
          if (code === "MEASURE_UNIT") {
            this.unitOfMeasurementOpt  = [
              ...arr
            ];
          }
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.inventoryPlan-create {
  padding: 40px 100px 110px 95px;
  position: relative;
  .edit-box {
    text-align: left;
    color: #49505e;
    margin-bottom: 16px;
    .edit-box-content {
      padding: 30px 0px 0 40px;
      position: relative;
      display: inline-block;
      width: 100%;
      .edit-box-content-item {
        width: 33%;
        float: left;
        font-size: 12px;
        &.mr24{
          margin-bottom:24px;
        }
        &.total-width {
          width: 100%;
          .label-value {
            float: left;
            width: calc(100% - 125px);
          }
        }
        .label-name-box {
          float: left;
          line-height: 34px;
          .label-name {
            height: 34px;
            font-family: PingFang-SC-Regular;
            color: #282d5b;
            margin-right: 3px;
            float: left;
            span {
              float: left;
            }
          }
          .label-space-between {
            width: 74px;
            text-align: justify;
            margin-left: 10px;
            i {
              display: inline-block;
              width: 100%;
            }
          }
        }
        .label-name-box.required {
          position: relative;
          &:before {
            position: absolute;
            left: 0px;
            width: 6px;
            content: "*";
            color: #f5222d;
            line-height: 36px;
            font-family: SimSun;
          }
        }
      }
    }
  }
}
.detail-table {
  position: relative;
  border-left: 1px solid rgba(238, 242, 245, 1);
  border-right: 1px solid rgba(238, 242, 245, 1);
}
.btn-delete {
  color: #f5222d;
  cursor: pointer;
}
.label-value{
}
</style>
