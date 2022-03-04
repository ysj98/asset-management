<template>
  <div>
    <SG-Modal
      width="1200px"
      :maskClosable="false"
      :visible="show"
      @cancel="doClosePop"
    >
      <template #title>
        <div class="title">
          <div
            class="title-item"
            v-for="item in tabArr"
            :key="item.key"
            :class="{ activity: tabKey === item.key }"
            @click="changeTab(item.key)"
          >
            {{ item.title }}
          </div>
        </div>
      </template>
      <template #footer>
        <SG-Button @click="doClosePop"> 返回 </SG-Button>
        <SG-Button @click="handleExport" type="primary"> 确认导出 </SG-Button>
      </template>
      <div>
        <ToBeSelectTable
          v-show="tabKey === 0"
          :selectTableData.sync="selectTableData"
        />
        <SelectTable
          ref="selectTableRef"
          v-show="tabKey === 1"
          :selectTableData.sync="selectTableData"
        />
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import SelectTable from "@/views/assetOperating/SelectAssetExportModal/SelectTable";
import ToBeSelectTable from "@/views/assetOperating/SelectAssetExportModal/ToBeSelectTable";
export default {
  name: "SelectAssetExportModal",
  components: {
    SelectTable,
    ToBeSelectTable,
  },
  props: {
    payload: {
      type: Object,
    },
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
  },
  data() {
    return {
      selectTableData: [],
      tabArr: [
        {
          title: "待选资产",
          key: 0,
        },
        {
          title: "已选资产",
          key: 1,
        },
      ],
      tabKey: 0,
    };
  },
  methods: {
    getSelectData() {
      return this.selectTableData;
    },
    changeTab(value) {
      this.tabKey = value;
    },
    doClosePop() {
      this.$emit("doClosePop", this.modalName);
    },
    handleExport(){
      this.$refs.selectTableRef.handleExport()
    }
  },
};
</script>

<style scoped lang="less">
.title {
  display: flex;
  .title-item {
    cursor: pointer;
    margin-left: 20px;
  }
  .activity {
    color: blue;
  }
}
</style>
