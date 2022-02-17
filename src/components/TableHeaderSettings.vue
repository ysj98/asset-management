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
                <a-checkbox :value="item.colCode">
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
  },
  data() {
    return {
      show: true,
      loading: true,
      listValue: [],
      listData: [],
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
        this.listData = data.templeCode;
        this.listValue = data.customChose.map((ele) => ele.colCode);
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
      const req = { chooseList };
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
