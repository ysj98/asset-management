<template>
  <div>
    <div class="action-block">
      <a-button v-power="ASSET_MANAGEMENT.CHANGE_ASSET_OPERATION_ADD" style="width: 100px" type="primary" @click="btnAddClick">
        新建
      </a-button>
      <div>
        <TopOrganByUser
          class="search-form-item"
          :hasAll="false"
          :selectFirst="true"
          @change="changeTopOrganId"
        />
        <a-select
          v-model="queryForm.status"
          class="search-form-item"
          :options="statusOptions"
        >
        </a-select>
        <a-input class="search-form-item" placeholder="参数名称"></a-input>
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
            />
            <a-icon
              v-if="index !== tableOptions.dataSource.length - 1"
              style="margin-left: 20px; cursor: pointer"
              type="arrow-down"
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
      @cancel="()=>{ modalList.add.show = false }"
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
                v-model="modalList.add.payload.nameDebugger"
                placeholer="请输入"
              />
            </a-form-item>
            <a-form-item label="是否必填" :required="true">
              <a-select
                v-model="modalList.add.payload.requiredFlagDebugger"
                :options="requiredOptions"
                optionFilterProp="children"
              ></a-select>
            </a-form-item>
            <a-form-item label="备注">
              <a-textarea
                v-model="modalList.add.payload.remarkDebugger"
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
import {ASSET_MANAGEMENT} from '@/config/config.power'
import OperationPopover from "@/components/OperationPopover";
import TopOrganByUser from "@/views/common/topOrganByUser";
export default {
  name: "TabContent",
  components: {
    TopOrganByUser,
    OperationPopover,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      queryForm: {
        status: "0",
      },
      organInfo: {
        organID: "",
        organName: "",
      },
      requiredOptions: [
        {
          label: "必填",
          value: "1",
        },
        {
          label: "非必填",
          value: "0",
        },
      ],
      modalList: {
        add: {
          modelName: "add",
          show: false,
          title: "新增",
          payload: {
            remarkDebugger: "",
            requiredFlagDebugger: "0",
            nameDebugger: "",
          },
        },
      },
      statusOptions: [
        {
          label: "全部状态",
          value: "0",
        },
        {
          label: "启用",
          value: "1",
        },
        {
          label: "停用",
          value: "2",
        },
      ],
      tableOptions: {
        pagination: false,
        dataSource: [{}, {}],
        columns: [
          {
            title: "序号",
          },
          {
            title: "转运营编码",
          },
          {
            title: "转运营项名称",
          },
          {
            title: "备注",
          },
          {
            title: "必填项",
          },
          {
            title: "状态",
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
    handleInitAddModalData({
      remarkDebugger,
      requiredFlagDebugger,
      nameDebugger,
    }) {
      this.modalList.add.payload = {
        remarkDebugger,
        requiredFlagDebugger,
        nameDebugger,
      };
    },
    handleDelete() {},
    // TODO: 做不同操作
    operationFun(type, record) {
      switch (type) {
        case "edit":
          this.modalList.add.show = true;
          console.log("record", record);
          break;
        case "deactivate":
          break;
        case "enable":
          break;
        case "delete":
          break;
      }
    },
    handleActionBtn() {
      // TODO: 更换图标
      return [
        { iconType: "book", text: "编辑", editType: "edit" },
        { iconType: "book", text: "停用", editType: "deactivate" },
        { iconType: "book", text: "启用", editType: "enable" },
        { iconType: "book", text: "删除", editType: "delete" },
      ];
    },
    btnAddClick() {
      this.modalList.add.show = true;
    },

    handleAddPopSave() {},
    changeTopOrganId(info) {
      this.organInfo.organID = info.value;
      this.organInfo.organName = info.name;
    },
  },
};
</script>

<style scoped>
.search-form-item {
  width: 200px;
  margin-right: 20px;
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
