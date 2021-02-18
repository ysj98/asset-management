<!--出租收益编辑-->
<template>
  <SG-Modal
    v-model="show"
    :width="800"
    wrapClassName="gainsAdd"
    :noPadding="true"
    :maskClosable="false"
    @ok="submitFn"
  >
    <template #title>
      <div style="font-size: 16px">出租收益登记</div>
    </template>
    <div style="padding: 15px 40px 0 0">
      <a-form :form="form">
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="收益名称"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-input
                placeholder="请输入收益名称"
                @change="nameChange"
                v-decorator="[
                  'incomeName',
                  {
                    rules: [
                      { required: true, message: '请输入收益名称' },
                      { max: 30, message: '最多30个字符' },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="所属组织机构"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              {{ incomeInfo.organName }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="资产项目"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-select
                showSearch
                style="width: 100%"
                :options="projectOptions"
                placeholder="请选择资产项目"
                :filterOption="filterOption"
                @change="projectSelect"
                v-decorator="[
                  'projectId',
                  {
                    rules: [{ required: true, message: '请选择资产项目' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="资产类型"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-select
                style="width: 100%"
                placeholder="请选择资产类型"
                :options="typeOptions"
                @change="assetTypeSelect"
                v-decorator="[
                  'assetType',
                  {
                    rules: [{ required: true, message: '请选择资产类型' }],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              required
              label="客户名称"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :help="validateTenant ? '请选择客户' : ''"
              :validate-status="validateTenant ? 'error' : ''"
            >
              <span>
                <a-tag
                  closable
                  v-for="m in custList"
                  :key="m.extCustId"
                  style="background: #fff"
                  @close="handleTenant(m)"
                >
                  {{ m.custName }}
                </a-tag>
                <a-tag
                  color="#108ee9"
                  @click="handleTenant('')"
                  v-if="custList.length === 0"
                >
                  <a-icon type="user-add" style="margin-right: 3px" />选择
                </a-tag>
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              required
              label="所属出租单："
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :help="validateRent ? '请选择出租单' : ''"
              :validate-status="validateRent ? 'error' : ''"
            >
              <span>
                <a-tag
                  closable
                  v-for="m in rentList"
                  :key="m.leaseOrderId"
                  style="background: #fff"
                  @close="handleRent(m)"
                >
                  {{ m.leaseName }}
                </a-tag>
                <a-tag
                  color="#108ee9"
                  @click="handleRent('')"
                  v-if="rentList.length === 0"
                >
                  <a-icon type="file-add" style="margin-right: 3px" />选择
                </a-tag>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="收益账期"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <SG-DatePicker
                placeholder="请选择月份"
                pickerType="MonthPicker"
                @change="monthChange"
                v-decorator="[
                  'monthNum',
                  { rules: [{ required: true, message: '请选择月份' }] },
                ]"
              ></SG-DatePicker>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="费用科目"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-select
                show-search
                :placeholder="'请选择费用科目'"
                optionFilterProp="children"
                :options="billConfigOptions"
                :allowClear="true"
                :filterOption="filterOption"
                @change="billChange"
                notFoundContent="没有查询到数据"
                v-decorator="[
                  'billOption',
                  { rules: [{ required: true, message: '请选择费用科目1' }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="收益金额(元)"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-input
                placeholder="请输入收益金额"
                @change="incomeNumChange"
                v-decorator="[
                  'incomeNum',
                  {
                    rules: [
                      { required: true, message: '请输入收益金额' },
                      { max: 14, message: '最多14个字符' },
                      {
                        pattern: /(^([-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^([-]?)(0){1}$)|(^([-]?)[0-9]\.[0-9]([0-9])?$)/,
                        message: '只能输入数字，小数点后保留两位',
                      },
                    ],
                    initialValue: incomeInfo.amount,
                  },
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">备&emsp;注：</label>
              <a-textarea
                placeholder="请输入备注"
                style="width: 70%"
                :autosize="{ minRows: 2, maxRows: 4 }"
                @change="noteChange"
                v-decorator="[
                  'remark',
                  {
                    rules: [
                      {
                        required: false,
                        max: 200,
                        message: '请输入问题备注(不超过200字符)',
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
              <label slot="label">附&emsp;件：</label>
              <SG-UploadFile type="all" v-model="uploadList" :maxSize="5120" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 承租人组件 -->
    <TenantModal
      v-model="close"
      v-if="close"
      ref="TenantModal"
      @getTenantList="getTenantList"
    ></TenantModal>
    <!-- 出租单组件 -->
    <AssetRentForm
      v-model="close2"
      v-if="close2"
      ref="AssetRentForm"
      :organId="organId"
      @getRentList="getRentList"
    >
    </AssetRentForm>
  </SG-Modal>
</template>

<script>
import {
  queryProjectListByOrganId,
  filterOption,
  queryAssetTypeList,
} from "src/views/common/commonQueryApi";
import TenantModal from "../../component/tenantModal"; // 客户组件
import AssetRentForm from "../../component/assetRentForm"; // 出租单组件
import moment from "moment";
export default {
  data() {
    return {
      incomeId: "", // 投资单ID（修改时用)
      incomeInfo: {},
      close,
      close2: false,
      show: false,
      form: this.$form.createForm(this), // 注册form
      labelCol: { span: 12 },
      wrapperCol: { span: 10 },
      formItemTextarea: {
        labelCol: {
          xs: { span: 10 },
          sm: { span: 6 },
        },
      },
      incomeName: "", // 收益名称
      projectOptions: [], // 资产项目选项
      typeOptions: [], // 资产类型选项
      validateTenant: false, // 自定义校验客户名称
      validateRent: false, // 自定义校验客户名称
      projectId: 0, // 资产项目ID
      assetType: 0, // 资产类型
      custList: [], // 客户列表
      rentList: [], // 出租单列表
      monthNum: {}, // 月份
      billConfigOptions: [], // 费用科目
      billOption: undefined, // 已选费用科目
      incomeNum: 0, // 收益金额
      note: "", // 备注
      uploadList: [], // 附件
    };
  },
  props: ["organId"],
  components: { TenantModal, AssetRentForm },
  watch: {
    show(newVal) {
      if (newVal === true) {
        this.queryProjectByOrganId(this.organId);
        this.getFeeTypeList();
        this.getIncome();
        this.getAttachmentList(this.incomeId);
      } else {
        this.$emit("input", newVal);
      }
    },
    // 自定义必填客户项校验
    custList: function (val) {
      if (val.length) {
        this.validateTenant = false;
      }
    },
    // 自定义必填出租单项校验
    rentList: function (val) {
      if (val.length) {
        this.validateRent = false;
      }
    },
  },
  methods: {
    moment,
    // 查询收益
    getIncome() {
      if (this.incomeId) {
        this.$api.assetRent
          .getIncome({ incomeId: this.incomeId })
          .then((res) => {
            if (+res.data.code === 0) {
              let data = res.data.data;
              this.custList = [
                {
                  extCustId: data.customerId,
                  custName: data.customerName,
                },
              ];
              this.rentList = [
                {
                  leaseOrderId: data.orderId,
                  leaseName: data.orderName,
                },
              ];
              this.incomeInfo = data;
              this.incomeNum = data.amount;
              this.incomeName = data.incomeName;
              this.projectId = data.projectId;
              this.assetType = data.assetType;
              this.monthNum = data.accountingPeriod;
              this.billOption = data.feeSubject;
              this.note = data.remark;
              this.form.setFieldsValue({
                incomeName: data.incomeName,
                projectId: data.projectId,
                assetType: data.assetTypeName,
                monthNum: data.accountingPeriod
                  ? moment(data.accountingPeriod)
                  : "",
                billOption: data.feeSubject,
                remark: data.remark,
              });
            } else {
              this.$error({
                title: "提示",
                content: res.data.message,
              });
            }
          });
      }
    },
    nameChange(e) {
      this.incomeName = e.target.value;
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
    // 查询资产类型--平台字典
    queryAssetType() {
      queryAssetTypeList().then((list) => {
        list
          ? (this.typeOptions = list)
          : this.$message.error("查询资产类型失败");
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
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 费用科目
    billChange(val) {
      this.billOption = val;
    },
    incomeNumChange(e) {
      this.incomeNum = e.target.value;
    },
    // 资产项目选择
    projectSelect(val) {
      this.projectId = val;
    },
    // 资产类型选择
    assetTypeSelect(val) {
      this.assetType = val;
    },
    // 备注
    noteChange(e) {
      this.note = e.target.value;
    },
    // 删除、选择客户
    handleTenant(m) {
      if (m) {
        this.custList = this.custList.filter(
          (v) => v.extCustId !== m.extCustId
        );
      } else {
        this.close = true;
        this.$nextTick(() => {
          this.$refs.TenantModal.show = true;
        });
      }
    },
    handleRent(m) {
      if (m) {
        this.rentList = this.rentList.filter(
          (v) => v.leaseOrderId !== m.leaseOrderId
        );
      } else {
        this.close2 = true;
        this.$nextTick(() => {
          this.$refs.AssetRentForm.show = true;
        });
      }
    },
    // 接收子组件承租人
    getTenantList(val) {
      let hash = {};
      this.custList.push(val);
      this.custList = this.custList.reduce(function (item, next) {
        hash[next.extCustId]
          ? ""
          : (hash[next.extCustId] = true && item.push(next));
        return item;
      }, []);
    },
    // 接收子组件出租单列表
    getRentList(val) {
      let hash = {};
      this.rentList.push(val);
      this.rentList = this.rentList.reduce(function (item, next) {
        hash[next.leaseOrderId]
          ? ""
          : (hash[next.leaseOrderId] = true && item.push(next));
        return item;
      }, []);
    },
    // 月份改变
    monthChange(val, date) {
      this.monthNum = date;
    },
    // 保存收益单api
    saveUpdateIncome() {
      // 修改上传数组对象字段
      let upList = [];
      this.uploadList.map((value) => {
        upList.push({
          oldAttachmentName: value.name,
          attachmentPath: value.url,
        });
      });
      console.log(this.custList);
      let saveObj = {
        incomeId: this.incomeId,
        incomeName: this.incomeName,
        organId: this.organId,
        projectId: this.projectId,
        assetType: this.assetType,
        customerId: this.custList[0].extCustId,
        orderType: 1,
        orderId: this.rentList[0].leaseOrderId,
        orderName: this.rentList[0].leaseName,
        status: 1,
        accountingPeriod: this.monthNum + "-01",
        amount: this.incomeNum,
        feeSubject: this.billOption,
        remark: this.note,
        attachmentList: upList,
      };
      this.$api.assetRent.saveUpdateIncome(saveObj).then((res) => {
        if (+res.data.code === 0) {
          this.$message.success("出租收益编辑成功！");
          this.show = false;
          this.$emit("childrenSubmit");
        } else {
          this.$error({
            title: "提示",
            content: res.data.message,
          });
        }
      });
    },
    // 提交this.
    submitFn() {
      this.validateTenant = !this.custList.length;
      this.validateRent = !this.rentList.length;
      this.form.validateFields((err, values) => {
        if (!err && this.custList.length && this.rentList.length) {
          this.saveUpdateIncome();
        }
      });
    },
    // 查询附件
    getAttachmentList(id) {
      if (!id) {
        return false;
      }
      this.uploadList = [];
      this.$api.basics
        .attachment({ objectId: id, objectType: 21 })
        .then((res) => {
          if (+res.data.code === 0) {
            let attachment = [];
            res.data.data.forEach((item) => {
              let obj = {
                url: item.attachmentPath,
                name: item.oldAttachmentName,
              };
              attachment.push(obj);
              this.uploadList = attachment;
            });
          } else {
            this.$error({
              title: "提示",
              content: res.data.message,
            });
          }
        });
    },
  },
  mounted() {
    this.queryProjectByOrganId(this.organId);
    this.queryAssetType();
  },
};
</script>

<style lang="less" scoped>
.gainsAdd {
  /deep/.ant-form-item {
    margin-bottom: 18px;
  }
  .canClick {
    cursor: not-allowed;
  }
}
</style>
