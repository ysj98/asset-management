<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="tData"
      :rowKey="record => record.serviceType"
      :pagination="false"
      :loading="loadingFlag"
    >
      <!-- 序号 -->
      <template #index="row,record,index">
        {{ index + 1 }}
      </template>
      <!-- 业务分类 -->
      <template #serviceTypeText="text,record,index">
        <span v-if="record.isValid">
          <!--  -->
        </span>
        {{ record.serviceTypeText }}
      </template>
      <!-- 个性化设置 -->
      <template #isValid="text,record,index">
        <a-switch
          :checked="Boolean(record.isValid)"
          @change="
            value => {
              record.isValid = Number(value);
            }
          "
        />
      </template>
      <!-- 参数值 -->
      <template #value="text,record,index">
        <component
          v-if="record.isValid"
          :ref="record.serviceType"
          :is="serviceTypeAll[record.serviceType].component"
          @sendData="handleSendData(record, $event)"
          v-bind="record.customServiceParamSet"
          :isValid="record.isValid"
        ></component>
      </template>
    </a-table>
  </div>
</template>

<script>
// 显示在当前tab的 approveServiceType
const approveServiceType = [1001, 1003];
import { serviceTypeAll } from "./serviceTypeAll";
const columns = [
  {
    key: "index",
    title: "序号",
    width: 100,
    scopedSlots: { customRender: "index" }
  },
  {
    key: "serviceTypeText",
    title: "业务分类",
    scopedSlots: { customRender: "serviceTypeText" },
    width: 250
  },
  {
    key: "isValid",
    title: "个性化设置",
    scopedSlots: { customRender: "isValid" },
    width: 150
  },
  {
    key: "value",
    title: "参数值",
    scopedSlots: { customRender: "value" }
  }
];
export default {
  /*
   * 系统设置 tab
   * */
  name: "SystemSetting",
  props:{
    organId:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loadingFlag: true, // table loadingFlag
      serviceTypeAll,
      columns,
      tData: []
    };
  },
  watch: {},
  methods: {
    async getTableData() {
      this.loadingFlag = true;
      let responseData = await this.$api.paramsConfig.querySysSet({
        organId: this.organId
      });
      console.log("responseData", responseData);
      this.tData = responseData.data.data
      this.loadingFlag = false;
    },
    /*
     * payload {subKey:city,paramKey:province}
     * */
    handleSendData(record, payload) {
      console.log("payload", payload);
      Object.assign(record.customServiceParamSet, payload);
    },
    /*
     * @public 供外部调用返回最终上传的数据
     * */
    sendData() {
      // 过滤掉 不在approveServiceType 中的  ref
      let resObj = {};
      approveServiceType.forEach(ele => {
        // $refs 不是响应式的,过滤掉 ref 为 undefined 的
        if ((ele in this.$refs) && this.$refs[ele] ) {
          resObj[ele] = this.$refs[ele];
        }
      });
      for (let refName in resObj) {
        let errorMsg = resObj[refName].sendData();
        if (errorMsg) {
          console.log("refName", refName);
          this.$message.error(`${errorMsg}`);
          return null;
        }
      }
      return this.tData.map(ele => {
        const { isValid, serviceType } = ele;
        let keyTitle = "defaultServiceParamSet";
        if (isValid) keyTitle = "customServiceParamSet";
        // 现在就这几个 key
        return {
          isValid,
          serviceType,
          subKey: ele[keyTitle].subKey,
          paramKey: ele[keyTitle].paramKey
        };
      });
    }
  },
  mounted() {
    console.log("加载");
    this.getTableData();
  }
};
</script>

<style scoped></style>
