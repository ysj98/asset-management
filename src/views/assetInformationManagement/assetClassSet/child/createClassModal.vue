<!--
 * @Date: 2020-07-13 13:48:09
 * @Description: 创建分类
-->
<template>
  <SG-Modal
    @cancel="hiddeModal"
    :title="title"
    v-model="visible"
    :width="900"
    @ok="handleSave"
    okText="提交"
    :maskClosable="false"
    :noPadding="true"
    :bodyStyle="{ 'overflow-y': 'auto', padding: '0 0px' }"
    :footer="null"
  >
    <div class="modal-main">
      <a-form :form="form" @submit="handleSave">
        <div class="edit-box">
          <div class="edit-box-content">
            <!-- 所属机构 -->
            <div class="edit-box-content-item">
              <div class="label-name-box">
                <span class="label-name">
                  所属组织机构
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <span class="label-value">{{ storeDetail.organName || "--" }}</span>
              </a-form-item>
            </div>
            <!-- 资产类型-->
            <div class="edit-box-content-item">
              <div class="label-name-box">
                <span class="label-name" :class="{ 'label-space-between': editable }">
                  资产类型
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <span class="label-value">
                  {{
                  typeMap[type] || "--"
                  }}
                </span>
              </a-form-item>
            </div>
            <!-- 分类名称： -->
            <div class="edit-box-content-item">
              <div class="label-name-box" :class="{'required': editable}">
                <span class="label-name" :class="{ 'label-space-between': editable }">
                  分类名称
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <a-input
                  placeholder="请输入分类名称"
                  :style="allStyle"
                  v-if="editable"
                  :maxLength="30"
                  v-decorator="['professionName',
                {initialValue: detail.professionName, rules: [{required: true, whitespace: true, message: '请输入分类名称'}]}
              ]"
                />
                <span v-else class="label-value">
                  {{
                  detail.professionName || "--"
                  }}
                </span>
              </a-form-item>
            </div>
            <!-- 分类编码 -->
            <div class="edit-box-content-item">
              <div class="label-name-box" :class="{'required': editable}">
                <span class="label-name" :class="{'label-space-between': editable}">
                  分类编码
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <a-input
                  placeholder="请输入分类编码"
                  :style="allStyle"
                  v-if="editable"
                  v-decorator="['professionCode',
                {initialValue: detail.professionCod, rules: [{required: true, whitespace: true, message: '请输入分类编码'}]}
              ]"
                />
                <span class="label-value" v-else>{{detail.professionCode || '--'}}</span>
              </a-form-item>
            </div>
            <!-- 计量单位 -->
            <div class="edit-box-content-item">
              <div class="label-name-box">
                <span class="label-name" :class="{'label-space-between': editable}">
                  计量单位
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <a-select
                  v-if="editable"
                  allowClear
                  placeholder="请选择计量单位"
                  :style="allStyle"
                  :options="unitOptions"
                  v-decorator="['unit',
                {initialValue: detail.unit}]"
                ></a-select>
                <span class="label-value" v-else>{{detail.unitName || '--'}}</span>
              </a-form-item>
            </div>
            <!-- 折旧方法 -->
            <div class="edit-box-content-item">
              <div class="label-name-box" :class="{'required': editable}">
                <span class="label-name" :class="{'label-space-between': editable}">
                  折旧方法
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <a-select
                  v-if="editable"
                  allowClear
                  placeholder="请选择折旧方法"
                  :style="allStyle"
                  :options="depreciationMethodOptions"
                  v-decorator="['depreciationMethod',
                {rules: [{required: true, message: '请选择折旧方法'}], initialValue: detail.depreciationMethod}]"
                ></a-select>
                <span class="label-value" v-else>{{detail.depreciationMethodName || '--'}}</span>
              </a-form-item>
            </div>
            <!-- 净残值率(%) -->
            <div class="edit-box-content-item">
              <div class="label-name-box" :class="{'required': editable}">
                <span class="label-name" :class="{'label-space-between': editable}">
                  净残值率(%)
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <a-input-number
                  placeholder="请输入净残值率(%)"
                  :style="allStyle"
                  step="1"
                  v-if="editable"
                  v-decorator="['netSalvageRate',
                {rules: [validateRate], initialValue: detail.netSalvageRate}
              ]"
                />
                <span class="label-value" v-else>{{detail.netSalvageRate || '--'}}</span>
              </a-form-item>
            </div>
            <!-- 使用年限 -->
            <div class="edit-box-content-item">
              <div class="label-name-box">
                <span class="label-name" :class="{'label-space-between': editable}">
                  使用年限
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <a-input-number
                  placeholder="使用年限"
                  :style="allStyle"
                  step="1"
                  v-if="editable"
                  :max="99999"
                  :min="0"
                  :precision="0"
                  v-decorator="['usedAge',
                {initialValue: detail.usedAge}
              ]"
                />
                <span class="label-value" v-else>{{detail.usedAge || '--'}}</span>
              </a-form-item>
            </div>
            <!-- 折旧年限 -->
            <div class="edit-box-content-item">
              <div class="label-name-box">
                <span class="label-name" :class="{'label-space-between': editable}">
                  折旧年限
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item>
                <a-input-number
                  placeholder="折旧年限"
                  :style="allStyle"
                  step="1"
                  :max="99999"
                  :min="0"
                  :precision="0"
                  v-if="editable"
                  v-decorator="['depreciationAge',
                {initialValue: detail.depreciationAge}
              ]"
                />
                <span class="label-value" v-else>{{detail.depreciationAge || '--'}}</span>
              </a-form-item>
            </div>

            <div class="edit-box-content-item total-width" v-show="editable">
              <div class="label-name-box">
                <span class="label-name" :class="{'label-space-between': editable}">
                  备注
                  <i></i>
                </span>
                <span>：</span>
              </div>
              <a-form-item class="label-value">
                <a-textarea
                  placeholder="请输入备注信息（最多200字）"
                  :rows="3"
                  style="width:91%;"
                  :maxLength="200"
                  v-decorator="['remark',
                {rules: [{validator: validateRemark}], initialValue: detail.remark}]"
                ></a-textarea>
              </a-form-item>
            </div>
          </div>
        </div>
      </a-form>
    </div>
    <div class="modal-footer" v-if="editable">
      <SG-Button type="primary" @click="handleSave">提交</SG-Button>
      <SG-Button class="ml12" type="cancel" @click="hiddeModal">取消</SG-Button>
    </div>
  </SG-Modal>
</template>
<script>
import { actionMap, titleMap, typeMap, pageTypeMap } from "./dict";
let allStyle = { width: "250px" };
export default {
  props: {
    // 传入详情参数
    storeDetail: {
      type: Object,
      default: () => ({})
    },
    // categoryConfId
    categoryConfId: {
      default: ''
    },
    type: {
      default: "house"
    },
    action: {
      default: "create"
    }
  },

  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      allStyle,
      typeMap,
      unitOptions: [], // 计量单位
      depreciationMethodOptions: [], // 折旧方法
      detail: {} // 分类详情
    };
  },
  computed: {
    // 标题
    title() {
      return actionMap[this.action] + titleMap[this.type];
    },
    // 是否可编辑
    editable() {
      return this.action !== "detail";
    }
  },
  watch: {
    storeDetail() {
      this.getUnitOptions();
    },
    visible(nv) {
      if (nv && ["edit", "detail"].includes(this.action)) {
        this.getDetail();
      }
    }
  },
  mounted() {
    this.getDepreciationMethodOptions();
  },
  methods: {
    // 提交表单验证
    handleSave() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("得到参数=>", values);
          let data = {
            ...values,
            organId: this.storeDetail.organId,
            assetType: pageTypeMap[this.type]
          };
          // 如果是编辑
          if (this.action === "edit") {
            data.categoryConfId = this.categoryConfId;
          }
          this.$api.assets.update(data).then(res => {
            if (res.data.code === "0") {
              this.$message.success(actionMap[this.action] + "成功");
              this.$emit("success");
              this.hiddeModal();
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    // 查询资产详情
    getDetail() {
      let data = {
        categoryConfId: this.categoryConfId,
        organId: this.storeDetail.organId,
        assetType: pageTypeMap[this.type]
      };
      this.$api.assets.getDetail(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || {};
          this.detail = result;
          let o = {
            professionName: result.professionName,
            professionCode: result.professionCode,
            unit: result.unit,
            depreciationMethod: result.depreciationMethod,
            netSalvageRate: result.netSalvageRate,
            usedAge: result.usedAge,
            depreciationAge: result.depreciationAge,
            remark: result.remark
          };
          if (this.action === "edit") {
            this.form.setFieldsValue(o);
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    hiddeModal() {
      Object.assign(this, {
        visible: false,
        detail: {} // 分类详情
      });
      this.form.resetFields();
    },
    // 验证函数
    validateRate(rule, value, callback) {
      if (!value) {
        callback("请输入净残值率(%)");
      } else if (value < 0 || value > 100) {
        callback("净残值率取值范围为0-100");
      }
      callback();
    },
    // 校验备注
    validateRemark(rule, value, callback) {
      if (value && value.length > 200) {
        callback("备注长度不能超过200个字");
      } else {
        callback();
      }
    },
    // 取机构字典表
    getUnitOptions() {
      let form = {
        code: "MEASURE_UNIT",
        organId: this.storeDetail.organId
      };
      this.$api.basics.organDict(form).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          this.unitOptions = result.map(item => {
            return {
              label: item.name,
              value: item.value
            };
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取平台字典表
    getDepreciationMethodOptions() {
      let form = {
        code: "DEPRECIATION_METHOD"
      };
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          this.depreciationMethodOptions = result.map(item => {
            return {
              label: item.name,
              value: item.value
            };
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.edit-box {
  text-align: left;
  color: #49505e;
  margin-bottom: 16px;
  margin: 40px;
  .edit-box-title {
    height: 14px;
    font-size: 14px;
    font-weight: bold;
    i {
      display: block;
      height: 14px;
      width: 5px;
      margin-right: 10px;
      background: #0084ff;
      float: left;
    }
    span {
      display: block;
      float: left;
      height: 14px;
      line-height: 14px;
      font-family: PingFang-SC-Heavy;
    }
  }
  .edit-box-content {
    position: relative;
    display: inline-block;
    width: 100%;
    .edit-box-content-item {
      width: 50%;
      float: left;
      font-size: 12px;
      .label-name-box {
        float: left;
        line-height: 34px;
        .label-name {
          height: 34px;
          font-family: PingFang-SC-Regular;
          color: #282d5b;
          margin-right: 3px;
          margin-left: 10px;
          float: left;
          span {
            float: left;
          }
        }
        .label-space-between {
          width: 70px;
          text-align: justify;
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
      /deep/ .ant-form-item-control {
        line-height: 34px;
      }
      /deep/ .ant-form-explain {
        margin-left: 95px;
      }
      /deep/ .ant-form-item-with-help {
        margin-bottom: 6px;
      }
    }
    .edit-box-content-item.total-width {
      width: 100%;
      .label-value {
        float: left;
        width: calc(100% - 95px);
      }
    }
    .edit-box-content-item.long-label {
      .label-space-between {
        width: 100px;
      }
      /deep/ .ant-form-explain {
        margin-left: 125px;
      }
    }
    .table-header-btn {
      position: absolute;
      right: 0;
      top: -44px;
    }
  }
}
.modal-footer {
  background: #fafafa;
  text-align: center;
  padding: 19px 30px;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #e8e8e8;
  text-align: center;
}
</style>
