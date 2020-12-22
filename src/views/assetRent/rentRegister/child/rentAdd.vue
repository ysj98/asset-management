<!--出租单新建-->
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
              v-decorator="[
                'rentName',
                {
                  rules: [
                    { required: true, message: '请输入出租单名称' },
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
            xx集团<!-- {{particularsData.changeOrderId || '--'}} -->
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
              style="width: 100%;"
              :options="projectOptions"
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
              style="width: 100%;"
              placeholder="请选择资产类型"
              :options="typeOptions"
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
            label="合同编号"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input placeholder="请输入合同编号" />
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
                style="background: #fff;"
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
            <a-input placeholder="请输入租金单价" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="出租面积(㎡)"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            --
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :colon="false" v-bind="formItemTextarea">
            <label slot="label">备&emsp;&emsp;注：</label>
            <a-textarea
              placeholder="请输入备注"
              :style="widthBox"
              :autosize="{ minRows: 2, maxRows: 4 }"
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
            <SG-UploadFile type="all" />
          </a-form-item>
        </a-col>
      </a-row>
      <SG-Title title="资产明细" />
      <a-form-item label="">
        <div class="assetInfo">
          <div class="text">
            <div class="leftInfo">
              资产数量： 6个，&emsp; 出租面积： 600㎡
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
            :data-source="tableData"
            :pagination="false"
            :bordered="true"
          >
            <template slot="operation"
              ><!--  slot-scope="text, record" -->
              <a>删除</a>
            </template>
          </a-table>
        </div>
      </a-form-item>
    </a-form>

    <!-- 承租人组件 -->
    <TenantModal
      v-model="close"
      v-if="close"
      ref="TenantModal"
      @getTenantList="getTenantList"
    ></TenantModal>
  </a-spin>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
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
    dataIndex: "specifications",
    // scopedSlots: { customRender: "operation" },
    align: "center",
  },
  {
    title: "资产面积(㎡)",
    dataIndex: "assetArea",
    align: "center",
  },
  {
    title: "出租面积(㎡)",
    dataIndex: "rentOutArea",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
  },
];
import {
  queryProjectListByOrganId,
  filterOption,
  queryAssetTypeList,
} from "src/views/common/commonQueryApi";
import TenantModal from "../../component/tenantModal";
export default {
  data() {
    return {
      close,
      columns,
      organId: 1,
      spinning: false, // 页面加载状态
      form: this.$form.createForm(this), // 注册form
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      projectOptions: [], // 资产项目选项
      typeOptions: [], // 资产类型选项
      tenantList: [], // 承租人，多个，分隔
      validateTenant: false, // 自定义校验auditUsers标志
      allWidth: "width: 214px",
      widthBox: "width: 70%",
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
      },
      dynamicData: {
        assetType: "",
        projectId: "",
      },
      tableData: [],
    };
  },
  components: { TenantModal },
  watch: {
    // 自定义必填项校验
    tenantList: function(val) {
      if (val.length) {
        this.validateTenant = false;
      }
    },
  },
  methods: {
    // 下拉搜索筛选
    filterOption,
    // 改变资产项目或资产类型，清空关联的登记单
    changeSelect(val) {
      console.log(val);
      this.dynamicData.assetType = val;
      /*  this.selectedList = []
        this.tableObj.dataSource = [] */
    },
    // 资产项目选择
    projectSelect(val) {
      this.dynamicData.projectId = val;
    },
    // 资产类型选择
    assetTypeSelect(val) {
      this.dynamicData.assetType = val;
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
    // 接收子组件承租人
    getTenantList(val) {
      let hash = {};
      this.tenantList.push(val);
      this.tenantList = this.tenantList.reduce(function(item, next) {
        hash[next.extCustId]
          ? ""
          : (hash[next.extCustId] = true && item.push(next));
        return item;
      }, []);
      // console.log("我收到了", this.tenantList);
    },
    // 获取选中的审核人
    /*     getTenant(list = []) {
      this.tenantList = list;
    }, */
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
    signDateFn(value, mode) {
      console.log(value, mode);
    },
    startDateFn(value, mode) {
      console.log(value, mode);
    },
    endDateFn(value, mode) {
      console.log(value, mode);
    },
  },
  created() {
    // 页面一加载储存organId
    this.organId = this.$route.params.id;
  },
  mounted() {
    // 获取当前用户信息
    // let { query: {id, organId} } = this.$route
    // this.storeId = id
    // this.organId = organId
    // organId && this.queryProjectByOrganId(organId)
    this.queryProjectByOrganId(this.organId);
    this.queryAssetType();
  },
};
</script>

<style lang="less">
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
/deep/.ant-table-thead {
  th div {
    text-align: center;
  }
}
</style>
