<template>
  <div>
    <SG-Modal
      :title="title"
      :visible="show"
      @ok="handlePopSave"
      @cancel="doClosePop"
      okText="保存"
      cancelText="返回"
      :maskClosable="false"
    >
      <div class="wrapper">
        <div class="title">
          {{ `组织机构：${this.organName}` }}
        </div>
        <div class="content">
          <div class="content-left">
            <div class="content-title">可选字段</div>
            <div>
              <span>资产基本属性</span>
              <a-checkbox-group v-model="baseCheckboxValues">
                <a-checkbox
                  class="check-item"
                  v-for="item in baseCheckboxOptions"
                  :key="item"
                  @change="onChange($event, item, 0)"
                  :value="item"
                >
                  {{ item }}
                </a-checkbox>
              </a-checkbox-group>

              <span>资产业务属性</span>
              <a-checkbox-group v-model="attrCheckboxValues">
                <a-checkbox
                  class="check-item"
                  v-for="item in attrCheckboxOptions"
                  :key="item"
                  @change="onChange($event, item, 1)"
                  :value="item"
                >
                  {{ item }}
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </div>
          <div class="content-right">
            <div class="content-title">已选字段</div>
            <a-table class="custom-table" v-bind="tableOptions">
              <!--字段名称-->
              <template #fieldName="text, record">
                {{
                  `${["基础属性", "业务属性"][record.fieldFlag]}--${
                    record.fieldName
                  }`
                }}
              </template>
              <!--字段别名-->
              <template #fieldAliasName="text, record">
                <a-input
                  v-model="record.fieldAliasName"
                  :maxLength="50"
                  placeholer="请输入"
                />
              </template>
              <!--操作-->
              <template #action="text, record, index">
                <div class="action">
                  <a-icon
                    v-if="index !== 0"
                    style="cursor: pointer"
                    type="arrow-up"
                    @click="changeSort('up', index)"
                  />
                  <div v-else class="place"></div>
                  <a-icon
                    v-if="index !== tableOptions.dataSource.length - 1"
                    style="margin-left: 20px; cursor: pointer"
                    type="arrow-down"
                    @click="changeSort('down', index)"
                  />
                  <div v-else style="margin-left: 20px" class="place"></div>
                  <a-icon
                    class="delete"
                    type="delete"
                    @click="doDelete(record)"
                  />
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import { allBaseFields } from "@/views/mapDrawLand/share";
export default {
  /*
   * 浮层展示定义
   * */
  name: "PopupParamsConfigModal",
  props: {
    title: {
      type: String,
    },
    show: {
      type: Boolean,
      required: true,
    },
    modalName: {
      type: String,
      required: true,
    },
    organId: {
      type: [String, Number],
      required: true,
    },
    organName: {
      type: String,
      required: true,
    },
    dataSource: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      attrCheckboxValues: [],
      baseCheckboxValues: [],
      baseCheckboxOptions: allBaseFields.map((ele) => ele.title),
      attrCheckboxOptions: [],
      attrValues: [],
      tableOptions: {
        rowKey: "fieldName",
        dataSource: [],
        scroll: {
          x: 500,
          y: 300,
        },
        columns: [
          {
            title: "字段名称",
            ket: "fieldName",
            scopedSlots: {
              customRender: "fieldName",
            },
          },
          {
            title: "字段别名",
            ket: "fieldAliasName",
            scopedSlots: {
              customRender: "fieldAliasName",
            },
          },
          {
            title: "操作",
            ket: "action",
            scopedSlots: {
              customRender: "action",
            },
          },
        ],
        pagination: false,
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    reactiveSwap(target, idx1, idx2) {
      const temp1 = target[idx1];
      const temp2 = target[idx2];
      target.splice(idx1, 1, temp2);
      target.splice(idx2, 1, temp1);
    },
    /*
     * 取消已选字段
     * */
    async doDelete() {},
    async changeSort(type, index) {
      if (type === "up") {
        this.reactiveSwap(this.tableOptions.dataSource, index, index - 1);
      }
      if (type === "down") {
        this.reactiveSwap(this.tableOptions.dataSource, index, index + 1);
      }
    },
    queryLayerFields() {
      const req = {
        topOrganId: this.organId,
      };
      this.$api.drawMap.queryLayerFields(req).then((value) => {
        console.log(value);
      });
    },
    async initData() {
      this.tableOptions.dataSource = this.dataSource;
      // 获取基础信息字段 默认值
      this.baseCheckboxValues = this.dataSource
        .filter((ele) => ele.fieldFlag === 0)
        .map((ele) => ele.fieldName);
      // 获取 业务信息字段 默认值
      this.attrCheckboxValues = this.dataSource
        .filter((ele) => ele.fieldFlag === 1)
        .map((ele) => ele.fieldName);
      this.queryLayerFields();
      const res = await this.queryAssetAttrConfig();
      if (res) {
        const data = res.data;
        this.attrCheckboxOptions = data.map((ele) => ele.attrName);
      }
    },
    queryAssetAttrConfig() {
      return new Promise(async (resolve, reject) => {
        const req = {
          assetType: "4",
          organId: this.organId,
          pageNum: 1,
          pageSize: 999,
          status: "1",
        };
        const {
          data: { code, message, data },
        } = await this.$api.attrConfig.queryAssetAttrConfig(req);
        if (code === "0") {
          resolve(data);
        } else {
          this.$message.error(message);
          reject(message);
        }
      });
    },
    /*
     * 复选框 选择/取消
     * @param event
     * @param value 复选框的value<String>
     * @param fieldFlag<Number> 0基础字段  1业务字段
     * */
    onChange(event, value, fieldFlag) {
      const checkFlag = event.target.checked;
      if (checkFlag) {
        if (
          this.tableOptions.dataSource.find((ele) => ele.fieldName === value)
        ) {
          this.$message.error("已经存在当前字段");
          return null;
        }
        this.tableOptions.dataSource.push({
          fieldName: value,
          fieldAliasName: "",
          fieldFlag,
        });
      } else {
        const idx = this.tableOptions.dataSource.findIndex(
          (ele) => ele.fieldName === value
        );
        this.tableOptions.dataSource.splice(idx, 1);
      }
    },
    async handlePopSave() {
      // 已选字段-基础信息最少一个'
      if (
        this.tableOptions.dataSource.length &&
        this.tableOptions.dataSource.filter((ele) => ele.fieldFlag === 0)
      ) {
        const layerFieldReqDtos = this.tableOptions.dataSource.map(
          (ele, index) => {
            return {
              fieldName: ele.fieldName,
              fieldAliasName: ele.fieldAliasName || "",
              fieldFlag: ele.fieldFlag,
              fieldSort: index,
              organId: this.organId,
            };
          }
        );
        const req = {
          layerFieldReqDtos,
          topOrganId: this.organId,
        };
        console.log(req);
        const {
          data: { code, message, data },
        } = await this.$api.drawMap.setLayerFields(req);
        if (code === "0") {
          console.log(data);
          this.$message.success("保存成功");
          this.$emit("success");
          this.doClosePop();
        } else {
          this.$message.error(message);
        }
      } else {
        this.$message.error("基础信息字段至少选择一个");
        return null;
      }
    },
    doClosePop() {
      this.$emit("doClosePop", this.modalName);
    },
  },
};
</script>

<style scoped>
.wrapper {
  max-height: 500px;
  overflow: auto;
}
.content {
  display: flex;
  margin-top: 20px;
  border-top: 1px solid #eef2f5;
}
.content-title {
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
}
.content-left {
  flex-basis: 150px;
  overflow: auto;
  max-height: 400px;
  border-right: 1px solid #eef2f5;
}
.content-right {
  margin-left: 20px;
  flex: 1;
}
.check-item {
  margin-left: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
}
.action {
  display: flex;
}
.delete {
  margin-left: 20px;
}
.place {
  width: 12px;
  height: 12px;
}
</style>
