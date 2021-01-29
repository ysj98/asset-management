<!--出租单编辑-->
<template>
  <a-spin :spinning="spinning" class="edit_page">
    <a-form :form="form">
      <SG-Title title="基础信息" />
      <a-row>
        <a-col :span="8">
          <a-form-item
            label="出租单名称"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              placeholder="请输入出租单名称"
              @change="nameChange"
              v-decorator="[
                'rentName',
                {
                  rules: [
                    { required: true, message: '请输入出租单名称' },
                    { max: 30, message: '最多30个字符' },
                  ],
                  initialValue: assetInfo.leaseName,
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
            {{ assetInfo.organName }}
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
              :options="projectOptions"
              placeholder="请选择资产项目"
              :filterOption="filterOption"
              @change="projectSelect"
              v-decorator="[
                'projectId',
                {
                  rules: [{ required: true, message: '请选择资产项目' }],
                  initialValue: assetInfo.projectId,
                },
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
              :options="typeOptions"
              @change="assetTypeSelect"
              v-decorator="[
                'assetType',
                {
                  rules: [{ required: true, message: '请选择资产类型' }],
                  initialValue: assetInfo.assetTypeName,
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="合同编号"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              placeholder="请输入合同编号"
              v-model="contractNum"
              v-decorator="[
                'contractNum',
                {
                  rules: [{ max: 30, message: '最多30个字符' }],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            required
            label="承租人"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :help="validateTenant ? '请选择承租人' : ''"
            :validate-status="validateTenant ? 'error' : ''"
          >
            <span>
              <a-tag
                closable
                v-for="m in tenantList"
                :key="m.extCustId"
                style="background: #fff"
                @close="handleTenant(m)"
              >
                {{ m.custName }}
              </a-tag>
              <a-tag color="#108ee9" @click="handleTenant('')">
                <a-icon type="user-add" style="margin-right: 3px" />选择
              </a-tag>
            </span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item
            label="签约日期"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-date-picker
              :style="allWidth"
              placeholder="请选择日期"
              v-decorator="[
                'signDate',
                { rules: [{ required: true, message: '请选择签约日期' }] },
              ]"
              @change="signDateFn"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="起租日期"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-date-picker
              :style="allWidth"
              placeholder="请选择日期"
              v-decorator="[
                'startDate',
                { rules: [{ required: true, message: '请选择起租日期' }] },
              ]"
              @change="startDateFn"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="止租日期"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-date-picker
              :style="allWidth"
              placeholder="请选择日期"
              v-decorator="[
                'endDate',
                { rules: [{ required: true, message: '请选择止租日期' }] },
              ]"
              @change="endDateFn"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item
            label="租金单价"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              placeholder="请输入租金单价"
              v-model="rentPrice"
              v-decorator="[
                'rentPrice',
                {
                  rules: [{ max: 30, message: '最多30个字符' }],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="出租面积(㎡)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <span class="pubText">{{ leaseArea ? leaseArea : 0 }}㎡</span>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :colon="false" v-bind="formItemTextarea">
            <label slot="label">备&emsp;&emsp;注：</label>
            <a-textarea
              placeholder="请输入备注"
              :style="widthBox"
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
        <a-col :span="24">
          <a-form-item :colon="false" v-bind="formItemTextarea">
            <label slot="label">附&emsp;&emsp;件：</label>
            <SG-UploadFile type="all" v-model="uploadList" />
          </a-form-item>
        </a-col>
      </a-row>
      <SG-Title title="资产明细" />
      <a-form-item label="">
        <div class="assetInfo">
          <div class="text">
            <div class="leftInfo">
              资产数量：
              <span class="pubText">{{
                selectedList.length === 0 ? 0 : selectedList.length
              }}</span
              >&nbsp;&nbsp;个，&emsp; 出租面积：
              <span class="pubText">{{ leaseArea ? leaseArea : 0 }}㎡</span>
            </div>
            <SG-Button
              icon="plus"
              type="primary"
              ghost
              @click="handleAddModal(true)"
              >添加资产</SG-Button
            >
          </div>
          <!-- 资产表格部分 -->
          <a-table
            :columns="columns"
            :data-source="selectedList"
            :pagination="false"
            :bordered="true"
          >
            <template slot="operation" slot-scope="text, record">
              <a style="color: #ff0000" @click="removeRent(record)">删除</a>
            </template>
            <template slot="leaseArea">
              <span class="icon-red">出租面积(㎡)</span>
            </template>
            <template slot="leaseArea" slot-scope="text, record">
              <a-input-number
                id="inputNumber"
                v-model="record.leaseArea"
                :step="1.0"
                :precision="2"
                :min="0"
                :max="+record.assetArea"
                @change="rentOutAreaChange"
              />
            </template>
            <template slot="remark" slot-scope="text, record">
              <a-input
                placeholder="请输入备注"
                :max="200"
                v-model="record.remark"
                style="width: 150px"
                maxLength="200"
              />
            </template>
          </a-table>
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
    <!-- 承租人组件 -->
    <TenantModal
      v-model="close"
      v-if="close"
      ref="TenantModal"
      @getTenantList="getTenantList"
    ></TenantModal>
    <!-- 资产列表组件 -->
    <AssetListMoal
      ref="AssetListMoal"
      :proId="projectId"
      :assetType="assetType"
      :organId="organId"
      :queryType="6"
      v-model="selectedList"
      @areaChange="areaChange"
    ></AssetListMoal>
  </a-spin>
</template>

<script>
const columns = [
  {
    title: "序号",
    align: "center",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    align: "center",
  },
  {
    title: "资产名称",
    dataIndex: "assetName",
    align: "center",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    align: "center",
  },
  {
    title: "资产分类",
    dataIndex: "assetCategoryName",
    align: "center",
  },
  {
    title: "规格型号",
    dataIndex: "model",
    align: "center",
  },
  {
    title: "资产面积(㎡)",
    dataIndex: "assetArea",
    align: "center",
  },
  {
    slots: { title: "leaseArea" },
    dataIndex: "leaseArea",
    scopedSlots: { customRender: "leaseArea" },
    align: "center",
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
  },
];
import {
  queryProjectListByOrganId,
  filterOption,
  queryAssetTypeList,
} from "src/views/common/commonQueryApi";
import TenantModal from "../../component/tenantModal"; // 承租人组件
import AssetListMoal from "../../component/assetListModal"; // 资产列表组件
import { calc, debounce } from "@/utils/utils";
import FormFooter from "@/components/FormFooter";
import moment from "moment";
export default {
  components: { TenantModal, AssetListMoal, FormFooter },
  data() {
    return {
      close,
      columns,
      assetInfo: "",
      organId: "",
      leaseOrderId: "",
      rentFormName: "", // 出租单名称
      projectId: "",
      assetType: "",
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
      allWidth: "width: 214px",
      widthBox: "width: 70%",
      projectOptions: [], // 资产项目选项
      typeOptions: [], // 资产类型选项
      validateTenant: false, // 自定义校验auditUsers标志
      tenantList: [], // 承租人，多个，分隔
      signingDate: "",
      startLeaseDate: "",
      endLeaseDate: "",
      leaseArea: "", // 出租面积
      selectedList: [], // 资产列表选中项
      note: "", // 备注
      contractNum: "", // 合同编号
      rentPrice: "", // 租金单价
      uploadList: [], // 上传列表
    };
  },
  watch: {
    // 自定义必填项校验
    tenantList: function (val) {
      if (val.length) {
        this.validateTenant = false;
      }
    },
  },
  methods: {
    moment,
    // 查询出租单
    getLeaseOrder() {
      this.$api.assetRent
        .getLeaseOrder({ leaseOrderId: +this.leaseOrderId })
        .then((res) => {
          // 过滤承租人信息
          let arr = [];
          let leaseIdList = res.data.data.lesseeId.split(",");
          let leaseName = res.data.data.lesseeName.split(",");
          for (let i = 0; i < leaseIdList.length; i++) {
            let newObj = {};
            newObj.extCustId = leaseIdList[i];
            arr.push(newObj);
          }
          arr.forEach((item, index1) => {
            leaseName.forEach((j, index2) => {
              if (index1 === index2) {
                item.custName = j;
              }
            });
          });
          this.assetInfo = res.data.data;
          let r = res.data.data;
          this.rentFormName = r.leaseName;
          this.organId = r.organId;
          this.projectId = r.projectId;
          this.assetType = r.assetType;
          this.tenantList = arr;
          this.signingDate = r.signingDate;
          this.startLeaseDate = r.startLeaseDate;
          this.endLeaseDate = r.endLeaseDate;
          this.contractNum = r.contractCode;
          this.rentPrice = r.rentPrice;
          this.leaseArea = r.leaseArea;
          this.form.setFieldsValue({
            signDate: r.signingDate ? moment(r.signingDate) : "",
            startDate: r.startLeaseDate ? moment(r.startLeaseDate) : "",
            endDate: r.endLeaseDate ? moment(r.endLeaseDate) : "",
            remark: r.remark,
            contractNum: r.contractCode,
            rentPrice: r.rentPrice,
          });
          this.note = r.remark;
          this.queryProjectByOrganId(this.organId);
        });
    },
    // 查询附件
    getAttachmentList(id) {
      if (!id) {
        return false;
      }
      this.$api.basics
        .attachment({ objectId: id, objectType: 19 })
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
    // 出租登记-查询出租明细列表
    getLeaseDetailList() {
      this.$api.assetRent
        .getLeaseDetailList({ leaseOrderId: +this.leaseOrderId })
        .then((res) => {
          this.selectedList = res.data.data;
          this.selectedList.forEach((item) => {
            item.model = "/";
            item.key = item.assetId;
          });
          // 回显列表
          let arr = [];
          this.selectedList.forEach((j) => {
            arr.push(j.assetId);
          });
          this.$refs.AssetListMoal.selectedRowKeys = arr;
        });
    },
    // 名称改变
    nameChange(e) {
      this.rentFormName = e.target.value;
    },
    noteChange(e) {
      this.note = e.target.value;
    },
    // 根据organId查询资产项目
    queryProjectByOrganId(organId) {
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
    // 下拉搜索筛选
    filterOption,
    // 资产项目选择
    projectSelect(val) {
      if (+val === +this.projectId) {
        this.projectId = val;
      } else {
        this.projectId = val;
        this.selectedList = [];
        this.leaseArea = 0;
        this.$refs.AssetListMoal.selectedRowKeys = [];
      }
    },
    // 资产类型选择
    assetTypeSelect(val) {
      if (+val === +this.assetType) {
        this.assetType = val;
      } else {
        this.assetType = val;
        this.selectedList = [];
        this.leaseArea = 0;
        this.$refs.AssetListMoal.selectedRowKeys = [];
      }
    },
    // 接收子组件承租人
    getTenantList(val) {
      let hash = {};
      this.tenantList.push(val);
      this.tenantList = this.tenantList.reduce(function (item, next) {
        hash[next.extCustId]
          ? ""
          : (hash[next.extCustId] = true && item.push(next));
        return item;
      }, []);
    },
    // 删除、选择承租人
    handleTenant(m) {
      if (m) {
        this.tenantList = this.tenantList.filter(
          (v) => v.extCustId !== m.extCustId
        );
      } else {
        this.close = true;
        this.$nextTick(() => {
          this.$refs.TenantModal.show = true;
        });
      }
    },
    // 日期
    signDateFn(value, mode) {
      this.signingDate = mode;
    },
    startDateFn(value, mode) {
      this.startLeaseDate = mode;
    },
    endDateFn(value, mode) {
      this.endLeaseDate = mode;
    },
    // 添加资产按钮
    handleAddModal() {
      if (!this.projectId && !this.assetType) {
        this.form.validateFieldsAndScroll(["projectId", "assetType"], () => {
          this.$message.warn("请先选择数据");
          return;
        });
      } else {
        this.$refs.AssetListMoal.show = true;
      }
    },
    // 获取面积
    areaChange() {
      this.debounceMothed();
    },
    // 监听面积值改变
    rentOutAreaChange() {
      this.debounceMothed();
    },
    // 防抖函数计算交付面积总计
    debounceMothed: debounce(function () {
      this.calcFn();
    }, 200),
    // 每次再次计算统计的值
    calcFn() {
      if (this.selectedList.length > 0) {
        this.leaseArea = this.selectedList.reduce(
          (sun, current) => calc.add(sun, current.leaseArea || 0),
          0
        );
      } else {
        this.leaseArea = 0;
      }
    },
    // 删除资产行
    removeRent(val) {
      let _this = this;
      this.$confirm({
        title: "提示",
        content: "确认要删除该记录吗？",
        onOk() {
          let arr = [];
          let area = 0;
          _this.selectedList.forEach((item, index) => {
            if (item.assetId === val.assetId) {
              _this.selectedList.splice(index, 1);
            }
          });
          _this.selectedList.forEach((j) => {
            arr.push(j.assetId);
          });
          _this.$refs.AssetListMoal.selectedRowKeys = arr; // 删除组件中的项
        },
      });
    },
    // 保存/修改请求
    saveUpdateLeaseOrder(type) {
      // 过滤承租人
      let arr = [];
      this.tenantList.map((item) => {
        arr.push(item.extCustId);
      });
      let str = arr.toString();
      // 过滤资产列表
      let newArr = [];
      for (let i = 0; i < this.selectedList.length; i++) {
        let newObj = {};
        newObj.assetId = this.selectedList[i].assetId;
        newObj.leaseArea = this.selectedList[i].leaseArea;
        newObj.remark = this.selectedList[i].remark;
        newArr.push(newObj);
      }
      // 修改上传数组对象字段
      let upList = [];
      this.uploadList.map((value, index, arry) => {
        upList.push({
          oldAttachmentName: value.name,
          attachmentPath: value.url,
        });
      });
      let saveObj = {
        leaseOrderId: +this.leaseOrderId,
        leaseName: this.rentFormName,
        organId: this.organId,
        projectId: this.projectId,
        assetType: this.assetType,
        approvalStatus: type === "draft" ? 0 : 2,
        lesseeId: str,
        signingDate: this.signingDate,
        startLeaseDate: this.startLeaseDate,
        endLeaseDate: this.endLeaseDate,
        leaseArea: this.leaseArea,
        assetSum: this.selectedList.length,
        leaseDetail: newArr,
        contractCode: this.contractNum,
        rentPrice: this.rentPrice,
        remark: this.note,
        attachmentList: upList,
      };
      this.$api.assetRent.saveUpdateLeaseOrder(saveObj).then((res) => {
        if (+res.data.code === 0) {
          this.$message.success(`${type === "" ? "提交审批" : "保存草稿"}成功`);
          this.$router.push("/rentRegister");
        } else {
          this.$message.error(res.data.message)
        }
      });
    },
    // 页脚保存/草稿
    save(val) {
      if (val) {
        this.validateTenant = !this.tenantList.length;
        this.form.validateFields((err, values) => {
          if (!err && this.tenantList.length) {
            if (this.selectedList.length === 0) {
              this.$message.error("请添加资产");
            } else {
              this.saveUpdateLeaseOrder("");
            }
          }
        });
      } else {
        this.validateTenant = !this.tenantList.length;
        this.form.validateFields((err, values) => {
          if (!err && this.tenantList.length) {
            this.saveUpdateLeaseOrder("draft");
          }
        });
      }
    },
    // 页脚取消
    cancel() {
      this.$router.push("/rentRegister");
    },
  },
  // 赋值出租单ID
  created() {
    this.leaseOrderId = this.$route.query.leaseOrderId;
    this.getLeaseOrder();
    this.getAttachmentList(this.leaseOrderId);
  },
  mounted() {
    // 获取资产项目/资产类型mounted
    this.getLeaseDetailList();
    this.queryAssetType();
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
.pubText {
  font-size: 14px;
  font-weight: bold;
}
/deep/.ant-table-thead {
  th div {
    text-align: center;
  }
}
</style>