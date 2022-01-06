<template>
  <div>
    <div class="action-block">
      <div>
        <a-button
          v-power="ASSET_MANAGEMENT.CHANGE_ASSET_OPERATION_ADD"
          style="width: 100px"
          type="primary"
          @click="btnAddClick"
        >
          新建
        </a-button>
      </div>
      <div style="display: flex">
        <TopOrganByUser
          class="search-form-item"
          :hasAll="false"
          :selectFirst="true"
          @change="changeTopOrganId"
        />
      </div>
    </div>
    <a-table v-bind="tableOptions">
      <template #action="text, record, index">
        <div class="table-action">
          <div style="margin-right: 30px; display: flex; align-items: center">
            <a-icon
              v-if="index !== 0"
              style="cursor: pointer"
              type="arrow-up"
              @click="changeSort(0, record)"
            />
            <a-icon
              v-if="index !== tableOptions.dataSource.length - 1"
              style="margin-left: 20px; cursor: pointer"
              type="arrow-down"
              @click="changeSort(1, record)"
            />
          </div>
          <OperationPopover
            :operationData="handleActionBtn(record)"
            @operationFun="operationFun($event, record)"
          />
        </div>
      </template>
    </a-table>
    <SG-Modal
      v-model="modalList.add.show"
      :title="modalList.add.title"
      :maskClosable="false"
      @ok="handleAddPopSave"
      @cancel="
        () => {
          modalList.add.show = false;
        }
      "
    >
      <div>
        <div>
          <a-form
            labelAlign="right"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }"
          >
            <a-form-item label="所属机构">
              <span>
                {{ organInfo.organName }}
              </span>
            </a-form-item>
            <a-form-item label="转运营项名称" :required="true">
              <a-input
                v-model="modalForm.transferOperationName"
                placeholer="请输入"
              />
            </a-form-item>
            <a-form-item label="是否必填" :required="true">
              <a-select
                v-model="modalForm.required"
                :options="requiredOptions"
                optionFilterProp="children"
              ></a-select>
            </a-form-item>
            <a-form-item label="备注">
              <a-textarea
                v-model="modalForm.remark"
                placeholer="请输入备注信息"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import { ASSET_MANAGEMENT } from "@/config/config.power";
import OperationPopover from "@/components/OperationPopover";
import TopOrganByUser from "@/views/common/topOrganByUser";
export default {
  name: "TabContent",
  components: {
    TopOrganByUser,
    OperationPopover,
  },
  props: {
    assetType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 所操作项的id
      transferOperationId: "",
      ASSET_MANAGEMENT,
      organInfo: {
        organID: "",
        organName: "",
      },
      requiredOptions: [
        {
          label: "必填",
          value: 1,
        },
        {
          label: "非必填",
          value: 0,
        },
      ],
      modalForm: {
        remark: "",
        required: 0,
        transferOperationName: "",
      },
      modalList: {
        add: {
          modelName: "add",
          show: false,
          title: "新增",
        },
      },
      statusOptions: [
        {
          label: "全部状态",
          value: "",
        },
        {
          label: "启用",
          value: 1,
        },
        {
          label: "停用",
          value: 0,
        },
      ],
      tableOptions: {
        loading: true,
        rowKey: "transferOperationId",
        pagination: false,
        dataSource: [],
        scroll: { x: 600, y: 800 },
        columns: [
          {
            title: "序号",
            customRender(text, record, index) {
              return index + 1;
            },
          },
          {
            title: "转运营编码",
            dataIndex: "transferOperationCode",
          },
          {
            title: "转运营项名称",
            dataIndex: "transferOperationName",
          },
          {
            title: "备注",
            dataIndex: "remark",
          },
          {
            title: "必填项",
            dataIndex: "requiredName",
          },
          {
            title: "状态",
            dataIndex: "statusName",
          },
          {
            title: "操作",
            width: 200,
            scopedSlots: {
              customRender: "action",
            },
          },
        ],
      },
    };
  },
  methods: {
    async changeSort(direction, record) {
      const req = {
        transferOperationCode: record.transferOperationCode,
        direction,
        assetType: this.assetType,
      };
      const {
        data: { message, code },
      } = await this.$api.operationParams.adjustParamPosition(req);
      if (code === "0") {
        this.$SG_Message.success("操作成功");
        this.getTableData();
      } else {
        this.$SG_Message.error(message);
      }
    },
    btnEdit(record) {
      this.modalList.add.show = true;
      this.modalForm = {
        remark: record.remark,
        required: record.required,
        transferOperationName: record.transferOperationName,
      };
      this.transferOperationId = record.transferOperationId;
      this.modalList.add.title = "编辑";
    },
    // TODO: 做不同操作
    operationFun(type, record) {
      switch (type) {
        case "edit":
          console.log("record", record);
          this.btnEdit(record);
          break;
        case "deactivate":
          this.btnChangeStatus(0, record);
          break;
        case "enable":
          this.btnChangeStatus(1, record);
          break;
      }
    },
    handleActionBtn(record) {
      const res = [
        { iconType: "edit", text: "编辑", editType: "edit" },
        {
          iconType: "edit",
          text: "停用",
          editType: "deactivate",
          isShow(record) {
            return record.statusName === "启用";
          },
        },
        {
          iconType: "edit",
          text: "启用",
          editType: "enable",
          isShow(record) {
            return record.statusName === "停用";
          },
        },
      ];
      return res.filter((ele) => {
        if (typeof ele.isShow === "function") {
          return ele.isShow(record);
        } else {
          return true;
        }
      });
    },
    intiModal() {
      this.transferOperationId = "";
      this.modalForm = {
        remark: "",
        required: 0,
        transferOperationName: "",
      };
    },
    btnAddClick() {
      this.intiModal();
      this.modalList.add.title = "新增";
      this.modalList.add.show = true;
    },
    async btnChangeStatus(status, record) {
      const req = {
        status,
        assetType: this.assetType,
        transferOperationId: record.transferOperationId,
        organId: this.organInfo.organId,
        transferOperationCode: record.transferOperationCode,
        transferOperationName: record.transferOperationName,
      };
      const {
        data: { code, message },
      } = await this.$api.operationParams.updateStatus(req);
      if (code === "0") {
        this.getTableData();
        this.$SG_Message.success("操作成功");
      } else {
        this.$SG_Message.error(message);
      }
    },
    handleValidateModal() {
      if (!this.modalForm.transferOperationName) {
        return "未填写转运营项名称呢个";
      }
      if (
        this.tableOptions.dataSource
          .filter((ele) => ele.transferOperationId !== this.transferOperationId)
          .map((ele) => ele.transferOperationName)
          .includes(this.modalForm.transferOperationName)
      ) {
        return `此名称已存在`;
      }
    },
    async handleAddPopSave() {
      const error = this.handleValidateModal();
      if (error) {
        this.$SG_Message.error(error);
        return null;
      }
      let req = {
        ...this.modalForm,
        organId: this.organInfo.organID,
        assetType: this.assetType,
        status: 1,
      };

      if (this.modalList.add.title === "编辑") {
        req.transferOperationId = this.transferOperationId;
        const {
          data: { code, message },
        } = await this.$api.operationParams.editTransferOperationParam(req);
        if (code === "0") {
          this.modalList.add.show = false;
          this.getTableData();
          this.$SG_Message.success("操作成功");
        } else {
          this.$SG_Message.error(message);
        }
      } else {
        const {
          data: { code, message },
        } = await this.$api.operationParams.saveTransferOperationParam(req);
        if (code === "0") {
          this.modalList.add.show = false;
          this.getTableData();
          this.$SG_Message.success("操作成功");
        } else {
          this.$SG_Message.error(message);
        }
      }
    },
    changeTopOrganId(info) {
      this.organInfo.organID = info.value;
      this.organInfo.organName = info.name;
      this.getTableData();
    },
    async getTableData() {
      this.tableOptions.loading = true;
      const req = {
        assetType: this.assetType,
        organId: this.organInfo.organID,
        pageNum: 1,
        pageSize: 9999,
      };
      const {
        data: { code, message, data },
      } = await this.$api.operationParams.getPage(req);
      if (code === "0") {
        let res = [];
        data ? (res = data.data) : (res = []);
        this.tableOptions.dataSource = res;
        this.tableOptions.loading = false;
      } else {
        this.$SG_Message.error(message);
      }
    },
  },
};
</script>

<style scoped lang="less">
.search-form-item {
  width: 200px;
  margin-right: 20px;
  ::v-deep .ant-select {
    width: 200px;
  }
}
.action-block {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
.table-action {
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
