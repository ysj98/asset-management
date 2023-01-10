<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="tData"
      :rowKey="(record) => record.serviceType"
      :pagination="false"
      :loading="loadingFlag"
    >
      <!-- 序号 -->
      <template #index="row, record, index">
        {{ index + 1 }}
      </template>
      <!-- 业务分类 -->
      <template #serviceTypeText="text, record, index">
        <span v-if="record.isValid">
          <!--  -->
        </span>
        {{ record.serviceTypeText }}
      </template>
      <!-- 个性化设置 -->
      <template #isValid="text, record, index">
        <a-switch
          :checked="Boolean(record.isValid)"
          @change="
            (value) => {
              record.isValid = Number(value);
            }
          "
        />
      </template>
      <!-- 参数值 -->
      <template #value="text, record, index">
        <component
          v-if="record.isValid && serviceTypeAll[record.serviceType].component"
          :ref="record.serviceType"
          :is="serviceTypeAll[record.serviceType].component"
          @sendData="handleSendData(record, $event)"
          v-bind="record.customServiceParamSet"
          :serviceTypeText="record.serviceTypeText"
          :approvalOptions="approvalOptions"
        ></component>
      </template>
    </a-table>
  </div>
</template>

<script>
import {clone} from "lodash";

const approveServiceType = [1002, 1003, 1004, 1005, 1006, 1007, 1008,1015,1016]; 
import { serviceTypeAll, columns } from "./share.js";
export default {
  /*
   * 审批设置
   * */
  name: "ApprovalSetting",
  props: {
    approvalOptions: {
      type: Array,
      default() {
        return [];
      },
    },
    organId: {
      type: String,
      default: "",
    },
    loadingFlag: {
      type: Boolean,
      default: true,
    },
    tabDataSource: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      serviceTypeAll: serviceTypeAll,
      columns,
      tData: [],
    };
  },
  watch: {
    tabDataSource: {
      handler: function (newValue) {
        this.tData = clone(newValue).filter((ele) => {
          return approveServiceType.includes(ele.serviceType);
        });
      },
      immediate: true,
    },
  },
  methods: {
    /*
     * payload {subKey:city,paramKey:province}
     * */
    handleSendData(record, payload) {
      Object.assign(record.customServiceParamSet, payload);
    },
    /*
     * @public 供外部调用返回最终上传的数据
     * */
    sendData() {
      // 过滤掉 不在approveServiceType 中的  ref
      let resObj = {};
      approveServiceType.forEach((ele) => {
        // 1. $refs 不是响应式的,过滤掉 ref 为 undefined 的 2. 过滤掉不需要验证的组件
        if (ele in this.$refs && this.$refs[ele]) {
          resObj[ele] = this.$refs[ele];
        }
      });
      // 验证参数值组件参数是否填写
      for (let refName in resObj) {
        let errorMsg = resObj[refName].sendData();
        if (errorMsg) {
          this.$message.error(`${errorMsg}`);
          return null;
        }
      }
      return this.tData.map((ele) => {
        const { isValid, serviceType } = ele;
        let keyTitle = "customServiceParamSet";
        return {
          isValid,
          serviceType,
          subKey: isValid ? ele[keyTitle].subKey : "",
          paramKey: isValid ? ele[keyTitle].paramKey : "",
          flowJson: isValid ? ele[keyTitle].flowJson : "",
        };
      });
    },
  },
  mounted() {
  },
};
</script>

<style scoped></style>
