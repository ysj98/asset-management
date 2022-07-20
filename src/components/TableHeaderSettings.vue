<template>
  <div>
    <SG-Modal
      width="800px"
      :visible="show"
      okText="确定"
      title="列表设置"
      @ok="commonFn"
      @cancel="cancelFn"
    >
      <a-spin :spinning="loading">
        <div>
          <a-checkbox-group v-model="listValue">
            <a-row>
              <a-col
                class="p10"
                :span="8"
                v-for="item in listData"
                :key="item.colCode"
              >
                <a-checkbox :disabled="notAllowedCode.includes(item.colCode)" :value="item.colCode">
                  {{ item.colName }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </a-spin>
    </SG-Modal>
  </div>
</template>

<script>
export default {
  /*
   * 表格列表设置
   * */
  name: "TableHeaderSettings",
  props: {
    funType: {
      type: Number,
      required: true,
    },
    hiddenConfig: {
      type: Array,
      required: [],
    },
    aliasConfig: {
      type: Object,
      required: {},
    },
  },
  data() {
    return {
      show: true,
      loading: true,
      listValue: [],
      listData: [],
      notAllowedCode: []
    };
  },
  methods: {
    async getList() {
      this.loading = true;
      const req = {
        funType: this.funType,
      };
      const {
        data: { code, message, data },
      } = await this.$api.global.assetRolListV2(req);
      this.loading = false;
      if (code === "0") {
        console.log(data);
        console.log(this.aliasConfig, this.hiddenConfig)
        if (Object.keys(this.aliasConfig).length) {
          data.templeCode.map(item => {item.colName = this.aliasConfig[item.colCode] || item.colName})
          data.customShow.map(item => {item.colName = this.aliasConfig[item.colCode] || item.colName})
          data.customChose.map(item => {item.colName = this.aliasConfig[item.colCode] || item.colName})
        }
        if (this.hiddenConfig.length) {
          data.templeCode = data.templeCode.filter(item => {return !this.hiddenConfig.includes(item.colCode)})
          data.customShow = data.customShow.filter(item => {return !this.hiddenConfig.includes(item.colCode)})
          data.customChose = data.customChose.filter(item => {return !this.hiddenConfig.includes(item.colCode)})
        }
        this.listData = data.templeCode;
        this.listValue = data.customChose.map((ele) => ele.colCode);
        this.notAllowedCode = data.customShow.filter(ele=>{
          // userId 为-1 代表 此表头用户不可设置
          return ele.userId === -1
        }).map(ele=>ele.colCode)
      } else {
        this.$message.error(message);
      }
    },
    commonFn() {
      const chooseList = this.listData
        .filter((ele) => this.listValue.includes(ele.colCode))
        .map((ele) => ({
          colCode: ele.colCode,
          colName: ele.colName,
          funType: this.funType,
        }));
      const req = { chooseList, funType: this.funType };
      this.$api.global
        .addCustomShowV2(req)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            console.log(data);
            this.$emit("success");
            this.show = false
          } else {
            this.$message.error(message);
          }
        });
    },
    cancelFn() {
      this.$emit("cancel");
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped></style>
