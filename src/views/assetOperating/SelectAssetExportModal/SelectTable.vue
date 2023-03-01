<template>
  <div>
    <div style="margin-bottom: 10px">
      <SG-Button type="primary" @click="handleExport"> 导出 </SG-Button>
    </div>
    <a-table size="middle" v-bind="tableOptions">
      <template #action="text, reocrd">
        <a style="color: red" @click="handleDel(reocrd)">删除</a>
      </template>
    </a-table>
  </div>
</template>

<script>
import { columns } from './share.js';
import { handleDownloadFile } from 'utils/utils';
export default {
  name: 'SelectTable',
  inject: ['sonData'],
  props: {
    selectTableData: {
      type: Array,
    },
  },
  data() {
    return {
      tableOptions: {
        rowKey: function (record) {
          return record.assetId;
        },
        scroll: { x: 560, y: 600 },
        columns: [
          ...columns,
          {
            title: '操作',
            scopedSlots: {
              customRender: 'action',
            },
          },
        ],
        dataSource: [],
        pagination: false,
      },
    };
  },
  computed: {
    assetType() {
      return this.sonData.assetType();
    },
    organInfo() {
      return this.sonData.organInfo();
    },
    customParamsCom() {
      return this.sonData.customParams();
    },
  },
  watch: {
    selectTableData: {
      handler(newValue) {
        this.intiTableData(newValue);
      },
      immediate: true,
    },
  },
  methods: {
    async handleExport() {
      if (!(this.selectTableData && this.selectTableData.length)) {
        this.$message.warn('请选择资产');
        return null;
      }
      const assetIds = this.selectTableData.map((ele) => ele.assetId);
      const req = {
        assetIds: assetIds.join(','),
        transferOperationNameList: this.customParamsCom.map((ele) => ele.transferOperationName),
      };
      const responseData = await this.$api.toOperation.exportAsset(req);
      if (responseData.data.type === 'application/json') {
        const enc = new TextDecoder('utf-8');
        responseData.data.arrayBuffer().then((buffer) => {
          let data = JSON.parse(enc.decode(new Uint8Array(buffer))) || {};
          console.log('data', data);
          this.$SG_Message.error(data.message);
        });
      } else {
        handleDownloadFile({
          data: responseData.data,
          fileName: '资产转运营模板.xls',
        });
      }
    },
    handleDel(record) {
      const selectTableData = this.selectTableData.filter((ele) => ele.assetId !== record.assetId);
      this.$emit('update:selectTableData', selectTableData);
    },
    intiTableData() {
      this.tableOptions.dataSource = this.selectTableData;
    },
  },
};
</script>

<style scoped></style>
