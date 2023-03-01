<template>
  <div>
    <Information v-bind="infoOptions" />
    <a-table v-bind="tableOptions"></a-table>
  </div>
</template>

<script>
import Information from '@/components/Information';
export default {
  // 账面信息
  name: 'BookInformation',
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
        rowKey: '_key',
        scroll: { x: '100%', y: 600 },
        dataSource: [],
        columns: [
          {
            title: '评估基准日',
            dataIndex: 'assessmenBaseDate',
          },
          {
            title: '评估机构',
            dataIndex: 'assessmentOrganName',
          },
          {
            title: '评估方法',
            dataIndex: 'assessmentMethodName',
          },
          {
            title: '评估价值',
            dataIndex: 'assessmentValue',
          },
        ],
        pagination: false,
      },
      infoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: '财务卡片编号',
              key: 'cardCode',
            },
            {
              title: '划转时原值(元)',
              key: 'originalValue',
            },
            {
              title: '资产净值(元)',
              key: 'netValue',
            },
          ],
        ],
        colProps: { span: 8 },
      },
    };
  },
  methods: {
    queryAssetViewBillDetail() {
      const req = {
        assetId: this.assetId,
      };
      this.$api.assets.queryAssetViewBillDetail(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          const { cardCode, netValue, originalValue } = data;
          this.infoOptions.data = { cardCode, netValue, originalValue };
          this.tableOptions.dataSource = (data.data || []).map((ele) => {
            return {
              ...ele,
              _key: Math.random(),
            };
          });
        } else {
          this.$message.error(message);
        }
      });
    },
  },
  mounted() {
    this.queryAssetViewBillDetail();
  },
};
</script>

<style scoped>
.empty {
  height: 10px;
  width: 0;
}
</style>
