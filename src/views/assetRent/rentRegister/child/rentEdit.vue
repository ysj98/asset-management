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
            xx集团
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
            <a-input placeholder="请输入租金单价" />
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
        <!-- <div class="assetInfo">
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
          </div> -->
        <!-- 资产表格部分 -->
        <!--  <a-table
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
              />
            </template>
          </a-table>
        </div> -->
      </a-form-item>
    </a-form>
    <!-- 页脚 -->
    <!-- <FormFooter style="border: none" location="fixed">
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
    </FormFooter> -->
    <!-- 承租人组件 -->
    <TenantModal
      v-model="close"
      v-if="close"
      ref="TenantModal"
      @getTenantList="getTenantList"
    ></TenantModal>
    <!-- 资产列表组件 -->
    <!-- <AssetListMoal
      ref="AssetListMoal"
      :proId="dynamicData.projectId"
      :assetType="dynamicData.assetType"
      :organId="organId"
      :queryType="6"
      v-model="selectedList"
      @areaChange="areaChange"
    ></AssetListMoal> -->
  </a-spin>
</template>

<script>
import {
  queryProjectListByOrganId,
  filterOption,
  queryAssetTypeList,
} from "src/views/common/commonQueryApi";
import TenantModal from "../../component/tenantModal"; // 承租人组件
export default {
  components: { TenantModal },
  data() {
    return {
      close,
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
    // 查询出租单
    getLeaseOrder() {
      this.$api.assetRent
        .getLeaseOrder({ leaseOrderId: +this.leaseOrderId })
        .then((res) => {
          console.log(res);
        });
    },
    // 名称改变
    nameChange(e) {
      this.rentFormName = e.target.value;
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
    // 下拉搜索筛选
    filterOption,
    // 资产项目选择
    projectSelect(val) {
      this.projectId = val;
    },
    // 资产类型选择
    assetTypeSelect(val) {
      this.assetType = val;
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
  },
  // 赋值出租单ID
  created() {
    this.leaseOrderId = this.$route.params.id;
    this.getLeaseOrder();
  },
  mounted() {
    // 获取资产项目/资产类型
    // queryProjectByOrganId(organId)
    // this.queryAssetType();
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