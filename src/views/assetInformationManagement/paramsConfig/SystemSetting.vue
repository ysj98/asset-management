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
          v-if="record.isValid && !hiddenValue.includes(record.serviceType)"
          :ref="record.serviceType"
          :is="serviceTypeAll[record.serviceType].component"
          @sendData="handleSendData(record, $event)"
          v-bind="record.customServiceParamSet"
          :isValid="record.isValid"
          :serviceTypeText="record.serviceTypeText"
        ></component>
      </template>
    </a-table>
  </div>
</template>

<script>
// 显示在当前tab的 approveServiceType
const approveServiceType = [1001, 1009, 1010,1011,1012,1013,1014];
// 不显示参数列
const hiddenValue = [1010,1011,1012,1013,1014]
import { serviceTypeAll, columns } from "./share.js";
export default {
  /*
   * 系统设置 tab
   * */
  name: "SystemSetting",
  props:{
    organId:{
      type: String,
      default: ''
    },
    loadingFlag:{
      type:Boolean,
      default: true
    },
    tabDataSource:{
      type:Array,
      required: true
    }
  },
  data() {
    return {
      hiddenValue,
      serviceTypeAll: serviceTypeAll,
      columns,
      tData: []
    };
  },
  watch: {
    tabDataSource:{
      handler:function (newValue){
        this.tData = newValue.filter(ele=>{
          return approveServiceType.includes(ele.serviceType)
        })
      }
    }
  },
  methods: {

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
        let keyTitle = "customServiceParamSet";
        // 现在就这几个 key
        return {
          isValid,
          serviceType,
          subKey: isValid ? ele[keyTitle].subKey : '',
          paramKey: isValid ?  ele[keyTitle].paramKey : '',
        };
      });
    }
  },
};
</script>

<style scoped></style>
