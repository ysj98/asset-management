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
                v-for="m in rentList"
                :key="m.extCustId"
                style="background: #fff"
                @close="handleAsset(m)"
              >
                {{ m.custName }}
              </a-tag>
              <a-tag color="#108ee9" @click="handleAsset('')">
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
          - -
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
          - -
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="资产位置"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
          - -
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label="维修人"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input placeholder="请输入维修人名称" v-model="fixMan" />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- <a-row>
        <a-col :span="8">
          <a-form-item
            label="租金单价"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input placeholder="请输入租金单价" v-model="rentPrice" />
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
      </a-row> -->
      <SG-Title title="付款计划" />
      <a-form-item label="">
        <div class="assetInfo">
          <!-- <div class="text">
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
          <!-- <a-table
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
          </a-table> -->
        </div>
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
    <!-- <TenantModal
      v-model="close"
      v-if="close"
      ref="TenantModal"
      @getTenantList="getTenantList"
    ></TenantModal> -->
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
export default {
  data() {
    return {
      spinning: false, // 页面加载状态
      form: this.$form.createForm(this), // 注册form
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
      repairFormName: "", // 维修单名称
      organName: "", // 所属组织机构
      projectOptions: [], // 资产项目
      projectId: 0, // 资产项目ID
      assetType: 0, // 资产类型
      typeOptions: [], // 资产类型选项
      validateRent: false, // 自定义校验auditUsers标志
      rentList: [],
      fixMan: "", // 维修人名称
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
      this.projectId = val;
    },
    // 资产类型选择
    assetTypeSelect(val) {
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
    // 删除、选择承租人
    handleAsset(m) {
      if (m) {
        this.rentList = this.rentList.filter(
          (v) => v.extCustId !== m.extCustId
        );
      } else {
        // this.close = true;
        this.$nextTick(() => {
          // this.$refs.TenantModal.show = true;
        });
      }
    },
  },
  created() {
    this.organId = this.$route.params.id;
    this.organName = this.$route.params.organName;
  },
  mounted() {
    // 获取当前用户信息
    this.queryProjectByOrganId(this.organId);
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
</style>