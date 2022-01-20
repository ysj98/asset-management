<template>
  <div>
    <a-form-model :model="formData" ref="formRef" :rules="rules">
      <a-table class="custom-table" v-bind="tableOptions"></a-table>
    </a-form-model>
  </div>
</template>

<script>
import { baseColumns } from "@/views/assetOperating/share";
import { cloneDeep } from "lodash";

export default {
  name: "TableAsset",
  props: {
    dataSource: {
      type: Array,
      required: true,
    },
    assetType: {
      type: [Number, String],
      required: true,
    },
    customParams: {
      type: Array,
      required: true,
    },
  },
  inject: ["sonData"],
  data() {
    return {
      formData: {},
      rules: {},
      tableOptions: {
        rowKey: (record) => record.assetId,
        scroll: { x: 800, y: 800 },
        dataSource: [],
        columns: [...baseColumns],
        pagination: false,
      },
    };
  },
  watch: {
    dataSource: {
      handler(newValue) {
        if (Array.isArray(newValue)) {
          this.tableOptions.dataSource = cloneDeep(newValue).map((ele) => {
            const res = {};
            this.customParams.forEach((ele) => {
              res[ele.transferOperationCode] = "";
            });
            return {
              ...res,
              ...ele,
            };
          });
        }
      },
      immediate: true,
    },
    customParams: {
      handler(newValue) {
        this.handleTableColumns(newValue);
      },
      deep: true,
    },
  },
  computed: {
    organInfo() {
      return this.sonData.organInfo();
    },
  },
  methods: {
    handleValidate() {
      let flag = true;
      this.$refs.formRef.validate((valid) => {
        console.log("valid", valid);
        flag = valid;
      });
      return flag;
    },
    handleTableColumns(paramsList) {
      console.log("paramsList", paramsList);
      const res = paramsList.map((ele) => {
        return {
          dataIndex: ele.transferOperationCode,
          title: ele.transferOperationName,
          customRender: (text, record, index) => {
            return this.generateInput({ text, record, index }, ele);
          },
        };
      });
      this.tableOptions.columns = [...baseColumns, ...res];
    },
    getReq(type) {
      return this.tableOptions.dataSource.map((ele) => {
        let paramList = [];
        Object.keys(ele).forEach((e) => {
          const res = this.customParams.filter(
            (ele) => ele.transferOperationCode === e
          );
          if (res.length) {
            paramList.push({
              transferOperationCode: e,
              transferOperationName: res[0].transferOperationName,
              transferOperationValue: ele[e],
            });
          }
        });
        if (type === "edit") {
          paramList.forEach((paramItem) => {
            const res = ele.paramList.filter(
              (eleParamItem) =>
                paramItem.transferOperationCode ===
                eleParamItem.transferOperationCode
            )[0];
            if (res){
              paramItem.assetOperationDetailId = res.assetOperationDetailId;
            }
          });
        }
        return {
          ...ele,
          paramList,
        };
      });
    },
    generateInput({ record }, curColumn) {
      let resultNode = null;
      const _this = this;
      const _h = this.$createElement;
      const keyStr = curColumn.transferOperationCode;
      const props = {
        placeholder: "请输入",
        size: "small",
        // 为了编辑的时候校验生效
        value: record[keyStr],
      };
      const domProps = {
        value: record[keyStr],
      };
      const formItemProp = `${keyStr}${record.assetId}`;
      if (curColumn.required === 1) {
        _this.rules[formItemProp] = {
          validator: (rule, value, callback) => {
            if (["", undefined, null].includes(record[keyStr])) {
              callback(new Error(""));
            } else {
              callback();
            }
          },
          trigger: "blur",
          required: true,
          // TODO:如何取消错误提醒文字
          message: " ",
        };
      }
      const inputVnode = _h("a-input", {
        style: {
          width: "80px",
        },
        props,
        domProps,
        on: {
          input: (e) => {
            _this.$set(record, keyStr, e.target.value);
          },
        },
      });
      resultNode = _h(
        "a-form-model-item",
        {
          props: {
            prop: formItemProp,
          },
        },
        [inputVnode]
      );
      return resultNode;
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
