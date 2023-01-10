<template>
  <div>
    <SG-Modal
      :title="modalObj.title"
      :visible="modalObj.show"
      @ok="handlePopSave"
      @cancel="doClosePop"
      okText="保存"
      cancelText="返回"
      :maskClosable="false"
    >
      <div>
        <div style="text-align: right; margin-bottom: 10px">
          <a-input-search
            style="width: 200px"
            v-model="queryForm.schemeName"
            placeholder="方案名称"
            @search="queryLayerPageList"
          ></a-input-search>
        </div>
        <a-table class="custom-table" ref="refTable" v-bind="tableOptions">
          <!-- 所属机构  -->
          <template #organName="text, record, index">
            <div v-if="record.layerId && !record._editFlag">
              {{ record.organName }}
            </div>
            <div style="width: 100%" v-else>
              <treeSelect
                style="width: 100%; color: rgba(0, 0, 0, 0.65)"
                :value="record.organId"
                :default="false"
                :defaultOrganName="record.organName"
                @changeTree="
                  (organId, organName) => {
                    handleSelectOrgan({ organId, organName }, record);
                  }
                "
                placeholder="请选择组织机构"
                :allowClear="false"
              ></treeSelect>
            </div>
          </template>
          <!-- 方案名称  -->
          <template #schemeName="text, record, index">
            <div v-if="record.layerId && !record._editFlag">
              {{ record.schemeName }}
            </div>
            <div v-else>
              <a-input :max-Length="100" v-model="record.schemeName"></a-input>
            </div>
          </template>
          <!-- 操作  -->
          <template #action="text, record, index">
            <a
              v-if="record.layerId && record._editFlag"
              @click="handleSave(record)"
            >
              保存
            </a>
            <a
              v-if="record.layerId && !record._editFlag"
              @click="handleEdit(record)"
              class="right-block"
            >
              编辑
            </a>
            <a
              v-if="record.layerId && record._editFlag"
              @click="handleCancel(record)"
              class="right-block"
            >
              取消
            </a>
            <a
              v-if="!record._editFlag"
              @click="handleDelete(record)"
              class="right-block"
            >
              删除
            </a>
          </template>
        </a-table>
        <div class="table-footer" @click="doAdd">新增方案</div>
        <div style="margin-top: 10px">
          合计 {{ tableOptions.dataSource.length }} 条
        </div>
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import TreeSelect from "@/views/common/treeSelect";
import { uuid } from "utils/utils";

export default {
  /*
   * 新建方案
   * */
  name: "AddMethodsModal",
  components: { TreeSelect },
  props: {
    modalObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      total: 0,
      pageObj: {
        pageSize: 10,
        pageNum: 1,
      },
      queryForm: {
        schemeName: "",
      },
      tableOptions: {
        rowKey: function (record) {
          return record.layerId || record._key;
        },
        dataSource: [],
        pagination: false,
        scroll: { y: 400 },
        columns: [
          {
            title: "序号",
            width: 80,
            customRender: this.generateSerialNumber,
          },
          {
            title: "所属机构",
            key: "organName",
            scopedSlots: { customRender: "organName" },
          },
          {
            title: "方案名称",
            key: "schemeName",
            scopedSlots: {
              customRender: "schemeName",
            },
          },
          {
            title: "操作",
            scopedSlots: {
              customRender: "action",
            },
          },
        ],
      },
    };
  },
  methods: {
    handleSelectOrgan({ organName, organId }, record) {
      this.$set(record, "organName", organName);
      this.$set(record, "organId", organId);
    },
    async handleSave(record) {
      if (record.layerId) {
        const req = {
          schemeName: record.schemeName,
          organId: record.organId,
          layerId: record.layerId,
        };
        const {
          data: { code, message },
        } = await this.$api.drawMap.updateLayerScheme(req);
        if (code === "0") {
          this.changeEdit(record, false);
          this.$SG_Message.success({ content: "操作成功" });
          this.$emit("doRefresh");
        } else {
          this.$SG_Message.error(message);
        }
      }
    },
    // 改变表格指定行的编辑状态
    changeEdit(record, flag) {
      this.$set(record, "_editFlag", flag);
    },
    handleEdit(record) {
      this.$set(record, "_originObj", { ...record });
      this.changeEdit(record, true);
    },
    handleCancel(record) {
      this.changeEdit(record, true);
      Object.keys(record).forEach((ele) => {
        if (ele !== "_originObj") {
          this.$set(record, ele, record._originObj[ele]);
        }
      });
    },
    async handleDelete(record) {
      const _this = this;
      // 本地删除
      if (record._key) {
        const idx = this.tableOptions.dataSource.findIndex(
          (ele) => ele._key === record._key
        );
        if (idx !== -1) {
          this.tableOptions.dataSource.splice(idx, 1);
          this.$SG_Message.success({ content: "操作成功" });
        }
      }
      // 调用接口删除
      if (record.layerId) {
        const idx = this.tableOptions.dataSource.findIndex(
          (ele) => ele.layerId === record.layerId
        );
        this.$SG_Modal.confirm({
          content: "确认删除吗?",
          okText: "确定",
          cancelText: "关闭",
          type: "delete",
          onOk: async () => {
            const req = {
              layerId: record.layerId,
            };
            const {
              data: { code, message },
            } = await _this.$api.drawMap.deleteLayerScheme(req);
            if (code === "0") {
              if (idx !== -1) {
                _this.tableOptions.dataSource.splice(idx, 1);
                _this.$SG_Message.success({ content: "操作成功" });
                _this.$emit("doRefresh");
              }
            } else {
              _this.$SG_Message.error(message);
            }
          },
        });
      }
    },
    generateSerialNumber(text, record, index) {
      return (this.pageObj.pageNum - 1) * 10 + (index + 1);
    },
    handleTableData(data) {
      this.tableOptions.dataSource = data;
    },
    async queryLayerPageList() {
      const req = {
        ...this.pageObj,
        ...this.queryForm,
        // 外部一级机构 organId
        organId: this.modalObj.payload.organId,
      };
      const {
        data: {
          data: { data },
          code,
          message,
        },
      } = await this.$api.drawMap.queryLayerPageList(req);
      if (code === "0") {
        this.handleTableData(data || []);
      } else {
        this.$SG_Message.error(message);
      }
    },
    handleValidate() {
      const data = this.tableOptions.dataSource.filter((ele) => ele._key);
      if (!data.length) {
        return null;
        // return "最少一个新增一个数据";
      } else {
        if (data.some((ele) => !ele.organId || !ele.schemeName)) {
          return "请选择所属机构和填写方案名称";
        }
      }
    },
    async handlePopSave() {
      const error = this.handleValidate();
      if (error) {
        this.$SG_Message.error(error);
        return null;
      }
      const newMethods = this.tableOptions.dataSource.filter((ele) => ele._key);
      newMethods.map((ele) => {
        const req = {
          schemeName: ele.schemeName,
          organId: ele.organId,
        };
        this.$api.drawMap
          .addLayerScheme(req)
          .then(({ data: { code, message } }) => {
            console.log("code", code);
            if (code === "0") {
              this.$SG_Message.success("保存成功");
              this.queryLayerPageList();
              this.$emit("success");
              this.$emit("doRefresh");
            } else {
              this.$SG_Message.error(message);
            }
          });
      });
    },
    doClosePop() {
      this.$emit("doClosePop", this.modalObj.modalName);
    },
    doSearch() {
      this.pageObj.pageNum = 1;
      this.queryLayerPageList();
    },
    changePage({ pageLength, pageNo }) {
      this.pageObj.pageNum = pageNo;
      this.pageObj.pageSize = pageLength;
      this.queryLayerPageList();
    },
    // 新增方案
    doAdd() {
      this.tableOptions.dataSource.push({
        organId: "",
        schemeName: "",
        _key: uuid(),
      });
      this.$nextTick(() => {
        const antTableBodyEle =
          this.$refs.refTable.$el.querySelector(".ant-table-body");
        antTableBodyEle.scrollTop = antTableBodyEle.scrollHeight;
      });
    },
  },
  mounted() {
    this.queryLayerPageList();
  },
};
</script>

<style scoped>
.table-footer {
  cursor: pointer;
  width: 100%;
  text-align: center;
  margin-top: 10px;
  height: 20px;
  line-height: 20px;
  border: 1px dashed #959dab;
}
.right-block {
  margin-left: 20px;
}
</style>
