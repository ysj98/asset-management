<template>
  <div>
    <Information v-bind="infoOptions" />
    <a-table v-bind="tableOptions"></a-table>
  </div>
</template>

<script>
import Information from '@/components/Information';
export default {
  // 资产处置
  name: 'AssetDisposal',
  components: {
    Information,
  },
  props: {
    assetId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      tableOptions: {
        rowKey: 'disposeRegisterOrderId',
        scroll: { x: '100%', y: 600 },
        dataSource: [],
        columns: [
          { title: '处理单编号', dataIndex: 'disposeRegisterOrderId' },
          // { title: "处置名称", dataIndex: "disposeName" },
          { title: '处置类型', dataIndex: 'disposeTypeName' },
          { title: '处置方式', dataIndex: 'disposeModeName' },
          { title: '处置日期', dataIndex: 'disposeDate' },
          { title: '负责人', dataIndex: 'assetReceiver' },
          { title: '相关人(机构)', dataIndex: 'organName' },
          { title: '处置成本(元)', dataIndex: 'disposeCost' },
          { title: '处置收入(元)', dataIndex: 'disposeReceive' },
          { title: '备注', dataIndex: 'remark' },
        ],
        pagination: false,
      },
      infoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: '清理单编号',
              key: 'cleaningOrderId',
            },
            {
              title: '清理时间',
              key: 'createTime',
            },
            {
              title: '清理原因',
              key: 'cleanupTypeName',
            },
          ],
        ],
        colProps: { span: 8 },
      },
    };
  },
  methods: {
    queryDisposeDetail() {
      const req = {
        assetId: this.assetId,
      };
      this.$api.assets.queryAssetViewDisposeDetail(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          console.log({ data });
          const { cleaningOrderId, createTime, cleanupTypeName, list } = data;
          this.infoOptions.data = {
            cleaningOrderId,
            createTime,
            cleanupTypeName,
          };
          this.tableOptions.dataSource = list || [];
        } else {
          this.$message.error(message);
        }
      });
    },
  },
  mounted() {
    this.queryDisposeDetail();
  },
};
</script>

<style scoped></style>
