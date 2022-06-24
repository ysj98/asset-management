<!--维修新建-->
<template>
  <a-spin :spinning="spinning" class="edit_page">
    <a-form :form="form">
      <SG-Title title="基础信息" />
      <a-row>
        <a-col :span="8">
          <a-form-item
            label="维修单名称"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              placeholder="请输入申请单名称"
              @change="nameChange"
              v-decorator="[
                'rentName',
                {
                  rules: [
                    { required: true, message: '请输入维修单名称' },
                    { max: 30, message: '最多30个字符' },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="所属组织机构"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            {{ organName }}
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="资产项目"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-select
              showSearch
              style="width: 100%"
              :options="$addTitle(projectOptions)"
              placeholder="请选择资产项目"
              :filterOption="filterOption"
              @change="projectSelect"
              v-decorator="[
                'projectId',
                { rules: [{ required: true, message: '请选择资产项目' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item
            label="资产类型"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-select
              style="width: 100%"
              placeholder="请选择资产类型"
              :options="$addTitle(typeOptions)"
              @change="assetTypeSelect"
              v-decorator="[
                'assetType',
                { rules: [{ required: true, message: '请选择资产类型' }] },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            required
            label="资产名称"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :help="validateRent ? '请选择资产' : ''"
            :validate-status="validateRent ? 'error' : ''"
          >
            <span>
              <a-tag
                closable
                v-for="m in selectedList"
                :key="m.assetId"
                style="background: #fff"
                @close="handleAsset(m)"
              >
                {{ m.assetName }}
              </a-tag>
              <a-tag
                color="#108ee9"
                @click="handleAsset('')"
                v-if="selectedList.length !== 1"
              >
                <a-icon type="home" style="margin-right: 3px" />选择
              </a-tag>
            </span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="资产编码"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <span v-if="selectedList.length > 0">{{
              selectedList[0].assetCode
            }}</span>
            <span v-else>- -</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item
            label="资产分类"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <span v-if="selectedList.length > 0">{{
              selectedList[0].assetCategoryName
            }}</span>
            <span v-else>- -</span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="资产位置"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <span v-if="selectedList.length > 0">{{
              selectedList[0].address
            }}</span>
            <span v-else>- -</span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="维修人（单位）"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input placeholder="请输入维修人名称" v-model="fixMan" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item
            label="开始日期"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-date-picker
              :style="allWidth"
              placeholder="请选择开始日期"
              v-decorator="[
                'startDate',
                { rules: [{ required: true, message: '请选择开始日期' }] },
              ]"
              v-model="startDate"
              @openChange="handleStartOpenChange"
              :disabled-date="disabledStartDate"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="完成日期"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-date-picker
              :style="allWidth"
              placeholder="请选择完成日期"
              v-decorator="[
                'endDate',
                { rules: [{ required: true, message: '请选择完成日期' }] },
              ]"
              :open="endOpen"
              v-model="endDate"
              @openChange="handleEndOpenChange"
              :disabled-date="disabledEndDate"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="维修费用（元）"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              placeholder="请输入维修费用"
              v-model="fixPayment"
              v-decorator="[
                'fixPayment',
                {
                  rules: [
                    { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '只能输入正数，小数点后保留两位' },
                    { max: 13, message: '最多13个字符' },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item :colon="false" v-bind="formItemTextarea">
            <label slot="label">维修说明</label>
            <a-textarea
              placeholder="请输入维修说明"
              style="width: 70%"
              :autosize="{ minRows: 2, maxRows: 4 }"
              explain
              @change="explainChange"
              v-decorator="[
                'explain',
                {
                  rules: [
                    {
                      required: true,
                      max: 200,
                      message: '请输入维修说明(不超过200字符)',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item :colon="false" v-bind="formItemTextarea">
            <label slot="label">附&emsp;&emsp;件：</label>
            <SG-UploadFile type="all" v-model="uploadList" :maxSize="10240" >
              <div slot="tips">
                上传的文件最多为 5 个，单文件大小最大为 10M，支持文件格式包括doc, docx, xls, xlsx, ppt, pptx, zip, rar, jpg, jpeg, bmp, png, txt, pdf。
              </div>
            </SG-UploadFile>
          </a-form-item>
        </a-col>
      </a-row>
      <SG-Title title="付款计划" />
      <a-form-item label="">
        <div class="assetInfo">
          <!-- 资产表格部分 -->
          <a-table
            class="custom-table td-pd10"
            :loading="loading"
            :pagination="false"
            :columns="columns"
            :dataSource="dataSource"
            :bordered="true"
          >
            <template slot="payee">
              <div class="icon-red">收款人(单位)</div>
            </template>
            <template slot="payee" slot-scope="text, record">
              <a-input
                placeholder="请输入收款人（单位）"
                v-model="record.payee"
                maxLength="200"
              />
            </template>
            <template slot="costId" slot-scope="text, record">
              <a-select
                show-search
                :placeholder="'请选择费用科目'"
                optionFilterProp="children"
                :options="$addTitle(billConfigOptions)"
                :allowClear="true"
                :filterOption="filterOption"
                notFoundContent="没有查询到数据"
                v-model="record.costId"
              />
            </template>
            <template slot="paymentAmount">
              <span class="icon-red">付款金额(元)</span>
            </template>
            <template slot="paymentAmount" slot-scope="text, record">
              <a-input
                placeholder="请输入付款金额"
                v-model="record.paymentAmount"
                maxLength="13"
              />
            </template>
            <template slot="paymentDate">
              <span class="icon-red">付款时间</span>
            </template>
            <template slot="paymentDate" slot-scope="text, record">
              <a-date-picker v-model="record.paymentDate" />
            </template>
            <template slot="followUpUser" slot-scope="text, record">
              <a-input
                placeholder="请输入跟进人"
                v-model="record.followUpUser"
                maxLength="30"
              />
            </template>
            <template slot="remark" slot-scope="text, record">
              <a-input
                placeholder="请输入备注"
                maxLength="200"
                v-model="record.remark"
              />
            </template>
            <template slot="operation" slot-scope="text, record, index">
              <a style="color: #ff0000" @click="removeRent(index)">删除</a>
            </template>
          </a-table>
          <div class="mt15 tc">
            <a-button icon="plus" type="dashed" block @click="pushTableLine"
              >添加付款计划</a-button
            >
          </div>
        </div>
      </a-form-item>
    </a-form>
    <!-- 页脚 -->
    <FormFooter style="border: none" location="fixed">
      <div>
        <SG-Button type="primary" @click="save('save')">提交审批</SG-Button>
        <SG-Button
          style="margin-left: 12px"
          type="primary"
          weaken
          @click="save()"
          >保存草稿</SG-Button
        >
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>

    <!-- 资产列表组件 -->
    <assetModal
      ref="AssetListMoal"
      :proId="projectId"
      :assetType="assetType"
      :organId="organId"
      :queryType="6"
      @getAsset="getAsset"
    ></assetModal>
  </a-spin>
</template>

<script>
const columns = [
  {
    title: "编号",
    dataIndex: "order",
    align: "center",
    width: "7%",
  },
  {
    slots: { title: "payee" },
    dataIndex: "payee",
    scopedSlots: { customRender: "payee" },
    align: "center",
    width: "15%",
  },
  {
    title: "费用科目",
    dataIndex: "costId",
    scopedSlots: { customRender: "costId" },
    align: "center",
    width: "13%",
  },
  {
    slots: { title: "paymentAmount" },
    scopedSlots: { customRender: "paymentAmount" },
    dataIndex: "paymentAmount",
    align: "center",
    width: "10%",
  },
  {
    slots: { title: "paymentDate" },
    scopedSlots: { customRender: "paymentDate" },
    dataIndex: "paymentDate",
    align: "center",
    width: "17%",
  },
  {
    title: "跟进人",
    dataIndex: "followUpUser",
    scopedSlots: { customRender: "followUpUser" },
    align: "center",
    width: "10%",
  },
  {
    title: "备注",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    align: "center",
    width: "7%",
  },
];
import {
  queryProjectListByOrganId,
  filterOption,
  queryAssetTypeList,
} from "src/views/common/commonQueryApi";
import assetModal from "./assetModal";
import moment from "moment";
import FormFooter from "@/components/FormFooter.vue";
import { utils } from "@/utils/utils";
export default {
  components: { assetModal, FormFooter },
  data() {
    return {
      columns,
      spinning: false, // 页面加载状态
      form: this.$form.createForm(this), // 注册form
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
      },
      repairFormName: "", // 维修单名称
      organName: "", // 所属组织机构
      projectOptions: [], // 资产项目
      projectId: "", // 资产项目ID
      assetType: "", // 资产类型
      typeOptions: [], // 资产类型选项
      validateRent: false, // 自定义校验auditUsers标志
      rentList: [],
      fixMan: "", // 维修人名称
      fixPayment: "", // 维修费用
      allWidth: "width: 214px",
      endOpen: false,
      startDate: null, // 开始时间
      endDate: null, // 结束时间
      explain: "", // 维修说明
      uploadList: [], // 上传列表
      loading: false,
      dataSource: [
        {
          payee: "",
          costId: undefined,
          paymentAmount: "",
          paymentDate: moment(Date.now()),
          followUpUser: "",
          remark: "",
          order: 1,
          remark: "",
        },
      ],
      selectedList: [],
      billConfigOptions: [], // 费用科目
    };
  },
  watch: {
    // 自定义必填项校验
    rentList: function (val) {
      if (val.length) {
        this.validateRent = false;
      }
    },
  },
  methods: {
    // 下拉搜索筛选
    filterOption,
    // 维修单名称
    nameChange(e) {
      this.repairFormName = e.target.value;
    },
    // 根据organId查询资产项目
    queryProjectByOrganId(organId) {
      organId &&
        queryProjectListByOrganId(organId).then((list) =>
          list
            ? (this.projectOptions = list)
            : this.$message.error("查询资产项目失败")
        );
    },
    // 资产项目选择
    projectSelect(val) {
      this.selectedList = [];
      this.projectId = val;
    },
    // 资产类型选择
    assetTypeSelect(val) {
      this.selectedList = [];
      this.assetType = val;
    },
    // 查询资产类型--平台字典
    queryAssetType() {
      queryAssetTypeList().then((list) => {
        list
          ? (this.typeOptions = list)
          : this.$message.error("查询资产类型失败");
      });
    },
    // 删除、选择资产
    handleAsset(m) {
      if (m) {
        let arr = [];
        this.selectedList = this.selectedList.filter(
          (v) => v.assetId !== m.assetId
        );
        this.selectedList.forEach((j) => {
          arr.push(j.assetId);
        });
      } else {
        // this.close = true;
        if (!this.projectId && !this.assetType) {
          this.form.validateFieldsAndScroll(["projectId", "assetType"], () => {
            this.$message.warn("请先选择数据");
            return;
          });
        } else {
          this.$nextTick(() => {
            this.$refs.AssetListMoal.show = true;
          });
        }
      }
    },
    startDateFn(value, mode) {
      this.startDate = mode;
      console.log(this.startDate);
    },
    endDateFn(value, mode) {
      this.endDate = mode;
      console.log(this.endDate);
    },
    disabledStartDate(startValue) {
      const endValue = this.endDate;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startDate;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    // 维修说明
    explainChange(e) {
      this.explain = e.target.value;
    },
    getAsset(val) {
      this.selectedList = [val];
    },
    // 删除付款计划
    removeRent(index) {
      if (this.dataSource.length === 1) {
        this.$message.error("请至少保留一行数据!");
        return;
      }
      this.$SG_Modal.confirm({
        content: `确认要删除吗？?`,
        okText: "确定",
        cancelText: "再想想",
        onOk: () => {
          this.dataSource.splice(index, 1);
        },
      });
    },
    // 费用科目
    getFeeTypeList() {
      this.$api.assets.getFeeTypeList({ organId: this.organId }).then((res) => {
        if (+res.data.code === 0) {
          let arr = [];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.feeTypeName,
              value: item.feeTypeId,
            };
            arr.push(obj);
          });
          this.billConfigOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    pushTableLine() {
      let o = {
        key: Date.now(),
        order: this.dataSource.length + 1,
        payee: "",
        costId: undefined,
        paymentAmount: "",
        paymentDate: moment(Date.now()),
        followUpUser: "",
        remark: "",
      };
      this.dataSource.push(o);
    },
    validateFrom(values) {
      // 验证下方表格数据
      let flag = true;
      utils.each(this.dataSource, (item, i) => {
        if (!item.payee) {
          this.$message.error(
            `请填写付款计划第 ${item.order} 行，收款人（单位）!`
          );
          flag = false;
          return false;
        }
        /* if (!item.costId) {
          this.$message.error(`请选择付款计划第 ${item.order} 行, 费用科目!`);
          flag = false;
          return false;
        } */
        if (!item.paymentAmount) {
          this.$message.error(`请填写付款计划第 ${item.order} 行, 付款金额!`);
          flag = false;
          return false;
        }
        if (!item.paymentDate) {
          this.$message.error(`请选择付款计划第 ${item.order} 行, 付款时间!`);
          flag = false;
          return false;
        }
        /* if (!item.followUpUser) {
          this.$message.error(`请填写付款计划第 ${item.order} 行, 跟进人!`);
          flag = false;
          return false;
        } */
      });
      return flag;
    },
    // 保存/草稿
    submitMaintain(val) {
      // 修改上传数组对象字段
      let upList = [];
      this.uploadList.map((value, index, arry) => {
        upList.push({
          oldAttachmentName: value.name,
          attachmentPath: value.url,
        });
      });
      let arr = utils.deepClone(this.dataSource);
      arr.forEach((item) => {
        item.paymentDate = moment(item.paymentDate).format("YYYY-MM-DD");
      });
      let obj = {
        organId: this.organId,
        maintainName: this.repairFormName,
        projectId: this.projectId,
        assetType: this.assetType,
        assetObjectId: this.selectedList[0].assetObjectId,
        assetId: this.selectedList[0].assetId,
        maintainUserId: this.fixMan,
        maintainCost: Number(this.fixPayment),
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        completeDate: moment(this.endDate).format("YYYY-MM-DD"),
        remark: this.explain,
        saveType: val === "submit" ? 1 : 0,
        attachmentList: upList,
        detailList: arr,
      };
      this.$api.assetRent.submitMaintain(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          this.$message.success(
            `${val === "submit" ? "提交审批" : "保存草稿"}成功`
          );
          this.$router.push("/repairRegister");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    save(val) {
      if (val) {
        this.validateRent = !this.selectedList.length;
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!this.validateFrom(values)) {
              return;
            }
            this.submitMaintain("submit");
          }
        });
      } else {
        this.validateRent = !this.selectedList.length;
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!this.validateFrom(values)) {
              return;
            }
            console.log(123);
            this.submitMaintain("");
          }
        });
      }
    },
    cancel() {
      this.$router.push("/repairRegister");
    },
  },
  created() {
    this.organId = this.$route.query.organId;
    this.organName = this.$route.query.organName;
  },
  mounted() {
    // 获取当前用户信息
    this.queryProjectByOrganId(this.organId);
    this.queryAssetType();
    this.getFeeTypeList();
  },
};
</script>

<style lang="less" scoped>
.edit_page {
  padding: 0 45px 70px 70px;
  & /deep/ .ant-table-placeholder {
    display: block;
    border-bottom: 1px solid #e8e8e8;
  }
  .assetInfo {
    .text {
      display: flex;
      justify-content: space-between;
      padding: 0 15px 0 70px;
      height: 34px;
      margin-bottom: 13px;
      .leftInfo {
        position: relative;
        top: 6px;
      }
    }
  }
}
/deep/.sg-uploadFile {
    max-width: 100% !important;
  }
</style>
