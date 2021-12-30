<template>
  <div>
    <a-table class="custom-table" v-bind="tableOptions"></a-table>
  </div>
</template>

<script>
import { baseColumns, getColumns } from "@/views/assetOperating/share";

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
  },
  inject: ["sonData"],
  data() {
    return {
      tableOptions: {
        rowKey: (record) => record.assetId,
        dataSource: [],
        columns: [],
        pagination: false,
      },
    };
  },
  watch: {
    dataSource: {
      handler(newValue) {
        this.tableOptions.dataSource = newValue;
      },
      immediate: true,
    },
    assetType: {
      handler(newValue) {
        if (!["", undefined, null].includes(newValue)) {
          this.initColumns({
            organId: this.organInfo.organId,
            assetType: newValue,
          });
        }
      },
    },
  },
  computed: {
    organInfo() {
      return this.sonData.organInfo();
    },
  },
  methods: {
    initColumns({ organId, assetType }) {
      getColumns({
        organId,
        assetType,
      }).then((columns) => {
        console.log("columns", columns);
        this.tableOptions.columns = [...baseColumns, ...columns];
      });
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
