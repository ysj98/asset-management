<!--
 * @Description: 新建资产信息 配套附属资源
 * @Date: 2020-02-17 19:01:00
 * @LastEditTime: 2020-02-26 18:06:49
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
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box required">
              <span class="label-name label-space-between">
                资产名称
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{''}}<SG-Button type="primary" icon="plus" size="small" weaken>选择</SG-Button></span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产编码
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box required">
              <span class="label-name label-space-between">
                资产项目
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产类型
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产分类
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产状态
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产位置
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
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
                  'planName',
                  {
                    rules: [
                      {
                        required: true,
                        max: 30,
                        whitespace: true,
                        message: '请输入计划名称(不超过30字符)'
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
                  'planNamed',
                  {
                    rules: [
                      {
                        required: true,
                        max: 30,
                        whitespace: true,
                        message: '请输入计划名称(不超过30字符)'
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
                  'exePre',
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
                :options="exePreOpt"
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
                placeholder="请输入名称"
                :style="allStyle"
                :maxLength="30"
                v-decorator="[
                  'planNa4me',
                  {
                    rules: [
                      {
                        required: true,
                        max: 30,
                        whitespace: true,
                        message: '请输入计划名称(不超过30字符)'
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
                价值
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input-number
               :max="99"
               :min="0"
                :style="allStyle"
                placeholder="请输入价值"
                v-decorator="[
                  'preNu7m',
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
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                数量
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input-number
               :max="99"
               :min="0"
                :style="allStyle"
                placeholder="请输入数量"
                v-decorator="[
                  'preNum',
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
                  'exeP4re',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择计量单位'
                      }
                    ],
                    initialValue: undefined
                  }
                ]"
                optionFilterProp="children"
                :style="allStyle"
                :options="exePreOpt"
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
    </div>
  </a-spin>
</template>
<script>
let getUuid = ((uuid = 1) => () => ++uuid)()
const allStyle = { width: "200px" }
export default {
  data () {
    return {
      spinning: false,
      form: this.$form.createForm(this),
      allStyle,
      filepaths: [],
      type: 'create',
      checkNick: false,
      exePreOpt: []
    }
  },
  methods: {
    handleChange (e) {
     this.checkNick = e.target.checked;
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
