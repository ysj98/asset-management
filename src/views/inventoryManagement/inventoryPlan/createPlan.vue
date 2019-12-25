<!--
 * @Date: 2019-12-23 10:15:35
 * @Description: 新增 编辑 盘点计划
 -->
<template>
  <div class="inventoryPlan-create">
    <!-- 表单部分 -->
    <a-form :form="form" @submit="handleSubmit">
      <div class="edit-box">
        <div>
          <SG-Title noMargin title="基本信息" />
        </div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                所属组织机构
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
                showSearch
                :disabled="true"
                placeholder="请选择组织机构"
                v-decorator="['organId', { initialValue: '' }]"
                optionFilterProp="children"
                :style="allStyle"
                :options="organIdopt"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                计划名称
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input
                placeholder="请输入计划名称"
                :style="allStyle"
                :max="30"
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
                实施频次
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择实施频次"
                v-decorator="[
                  'exePre',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择实施频次'
                      }
                    ],
                    initialValue: ''
                  }
                ]"
                optionFilterProp="children"
                :style="allStyle"
                :options="organIdopt"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                计划生效时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-date-picker
                :style="allStyle"
                v-decorator="[
                  'effDate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择生效时间'
                      }
                    ],
                    initialValue: null
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                计划失效时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-date-picker
                :style="allStyle"
                v-decorator="[
                  'expDate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择失效时间'
                      }
                    ],
                    initialValue: null
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                任务开始时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
                showSearch
                v-decorator="[
                  'beginMonth',
                  {
                    rules: [
                      {
                        required: true
                      }
                    ],
                    initialValue: ''
                  }
                ]"
                optionFilterProp="children"
                :style="oneInputStyle"
                class="mr10"
                :options="organIdopt"
                notFoundContent="没有查询到数据"
              />
              <a-select
                showSearch
                v-decorator="[
                  'beginDay',
                  {
                    rules: [
                      {
                        required: true
                      }
                    ],
                    initialValue: ''
                  }
                ]"
                optionFilterProp="children"
                :style="twoInputStyle"
                :options="organIdopt"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                提前生成任务时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
                showSearch
                v-decorator="[
                  'beginDay',
                  {
                    rules: [
                      {
                        required: true
                      }
                    ],
                    initialValue: ''
                  }
                ]"
                optionFilterProp="children"
                :style="oneInputStyle"
                :options="organIdopt"
                notFoundContent="没有查询到数据"
              />
              <a-select
                showSearch
                v-decorator="[
                  'beginDay',
                  {
                    rules: [
                      {
                        required: true
                      }
                    ],
                    initialValue: ''
                  }
                ]"
                optionFilterProp="children"
                :style="twoInputStyle"
                :options="organIdopt"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">备注<i></i></span
              ><span>：</span>
            </div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入备注（最多200字）"
                :rows="3"
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
              <SG-UploadFile type="all" v-model="filepaths" />
            </a-form-item>
          </div>
        </div>
      </div>
    </a-form>
    <!-- 表格部分 -->
    <div class="mb30 mt30"><SG-Title noMargin title="计划明细" /></div>
    <div class="table-layout-fixed detail-table ml40">
      <a-table
        class="custom-table td-pd10"
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
      >
        <template slot="taskName" slot-scope="text, record">
          <span v-if="pageType === 'detail'">{{ record.taskName }}</span>
          <div v-else>
            <a-input :maxLength="200" v-model="record.taskName" />
          </div>
        </template>
        <template slot="checkRange" slot-scope="text, record">
          <span v-if="pageType === 'detail'">{{ record.checkRange }}</span>
          <div v-else>
            <a-input :maxLength="200" v-model="record.checkRange" />
          </div>
        </template>
        <template slot="chargePersonList" slot-scope="text, record">
          <span v-if="pageType === 'detail'">{{
            record.chargePersonList
          }}</span>
          <div v-else>
            <a-input :maxLength="200" v-model="record.chargePersonList" />
          </div>
        </template>
        <template slot="deadline" slot-scope="text, record">
          <span v-if="pageType === 'detail'">{{ record.deadline }}</span>
          <div v-else>
            <a-input :maxLength="200" v-model="record.deadline" />
          </div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <span class="btn-delete" @click="deleteTableLine(record, index)"
            >删除</span
          >
        </template>
      </a-table>
    </div>
    <div class="mt15 tc ml40">
      <a-button icon="plus" type="dashed" block @click="pushTableLine"
        >新建</a-button
      >
    </div>
    <!-- 执行记录 -->
    <div>
      <div class="mb30 mt30"><SG-Title noMargin title="执行记录" /></div>
      <div class="ml40"><implementTable /></div>
    </div>
    <!-- 审批轨迹 -->
    <div>
      <div class="mb30 mt30"><SG-Title noMargin title="审批轨迹" /></div>
    </div>
    <!--审批意见-->
    <div>
      <div class="mb30 mt30"><SG-Title noMargin title="审批意见" /></div>
      <div class="ml40">
        <a-textarea placeholder="请输入审批意见"></a-textarea>
      </div>
    </div>
    <FormFooter
      v-if="['create', 'edit'].includes(pageType)"
      style="border:none;"
      location="fixed"
    >
      <SG-Button class="mr2" @click="handleSaveDraft" type="primary"
        >保存草稿</SG-Button
      >
      <SG-Button @click="handleApp">提交审批</SG-Button>
    </FormFooter>
  </div>
</template>
<script>
import moment from "moment"
import implementTable from "./child/implementTable.vue"
import FormFooter from "@/components/FormFooter.vue"
let getUuid = ((uuid = 1) => () => ++uuid)()
const allStyle = { width: "200px" }
const oneInputStyle = { width: "95px", marginRight: "10px" }
const twoInputStyle = { width: "95px" }
const operationTypes = {
  detail: "/inventoryPlan/detail",
  create: "/inventoryPlan/create",
  edit: "/inventoryPlan/edit"
}
// 表格数据
let columns = [
  {
    title: "编号",
    dataIndex: "order",
    width: "7%"
  },
  {
    title: "盘点任务名称",
    dataIndex: "taskName",
    scopedSlots: { customRender: "taskName" },
    width: "15%"
  },
  {
    title: "盘点范围描述",
    dataIndex: "checkRange",
    scopedSlots: { customRender: "checkRange" },
    width: "20%"
  },
  {
    title: "盘点负责人",
    dataIndex: "chargePersonList",
    scopedSlots: { customRender: "chargePersonList" },
    width: "30%"
  },
  {
    title: "任务期限(天)",
    dataIndex: "deadline",
    scopedSlots: { customRender: "deadline" },
    width: "20%"
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: "8%"
  }
]

export default {
  components: {
    implementTable,
    FormFooter
  },
  data() {
    return {
      allStyle,
      oneInputStyle,
      twoInputStyle,
      organIdopt: [],
      filepaths: [],
      form: this.$form.createForm(this),
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      },
      pageType: ""
    }
  },
  created() {
    this.pageType = this.$route.query.type || ""
    if (this.pageType === "create") {
      this.createInit()
    }
  },
  methods: {
    // 新建初始化
    createInit() {
      this.pushTableLine()
    },
    // 在表格压入一条数据
    pushTableLine() {
      let o = {
        key: getUuid(),
        order: this.table.dataSource.length + 1,
        taskName: "",
        checkRange: "",
        chargePersonList: "",
        deadline: "",
        operation: ""
      }
      this.table.dataSource.push(o)
    },
    deleteTableLine(record, index) {
      console.log("删除", record, index)
      if (this.table.dataSource.length === 1) {
        this.$message.error("请至少保留一行数据!")
        return
      }
      this.table.dataSource.splice(index, 1)
    },
    handleSubmit() {},
    handleSaveDraft() {},
    handleApp() {}
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
            width: 100px;
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
</style>
