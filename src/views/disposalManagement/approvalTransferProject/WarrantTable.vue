<template>
  <div>
    <a-table v-bind="tableOptions"></a-table>
    <SG-FooterPagination
      v-if="false"
      :pageLength="pageInfo.pageSize"
      :totalCount="tableTotal"
      :noPageTools="true"
      v-model="pageInfo.pageNum"
      @change="changePage"
    />
  </div>
</template>

<script>
export default {
  name: 'WarrantTable',
  props: {
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    dataSource: {
      handler(newValue) {
        if (newValue.length) {
          this.tableOptions.dataSource = newValue.map((ele) => ({
            ...ele,
            _key: Math.random(),
          }));
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      tableTotal: 0,
      pageInfo: {
        pageNum: 1,
        pageLength: 10,
      },
      tableOptions: {
        dataSource: [],
        scroll: { y: 500, x: 600 },
        columns: [
          {
            title: '序号',
            width: 80,
            customRender: (text, record, index) => {
              return (this.pageInfo.pageNum - 1) * 10 + 1 + index;
            },
          },
          {
            title: '权证号',
            width: 100,
            dataIndex: 'warrantNbr',
          },
          {
            title: '权证类型',
            width: 100,
            dataIndex: 'kindOfRightName',
          },
          {
            title: '权证有效期',
            width: 200,
            key: 'houseStartAndEndDate',
            customRender(text, record) {
              if (record.houseStartDate && record.houseEndDate) {
                return `${record.houseStartDate}至${record.houseEndDate}`;
              } else {
                return '--';
              }
            },
          },
          {
            title: '证载用途',
            width: 100,
            dataIndex: 'ownershipUse',
          },
          {
            title: '建筑面积(㎡)',
            width: 100,
            dataIndex: 'buildArea',
          },
          {
            title: '土地面积(㎡)',
            width: 100,
            dataIndex: 'landArea',
          },
          {
            title: '权属单位',
            width: 200,
            dataIndex: 'obligeeName',
          },
          {
            title: '权属人股权构成',
            width: 200,
            dataIndex: 'equityComposition',
          },
        ],
        rowKey: '_key',
        pagination: false,
      },
    };
  },
  methods: {
    changePage({ pageNo, pageLength }) {
      this.pageInfo.pageNum = pageNo;
      this.pageInfo.pageSize = pageLength;
    },
  },
};
</script>

<style scoped></style>
