<template>
  <a-modal :visible="visible" title="资产业务信息" width="800px" @cancel="handleClose">
    <div class="box">
      <div class="section-title blue">资产概况</div>
      <div style="padding: 10px 20px">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="12">资产项目：{{ '--' }}</a-col>
          <a-col class="playground-col" :span="12">资产编码：{{ '--' }}</a-col>
        </a-row>
        <a-row class="playground-row">
          <a-col class="playground-col" :span="12">资产名称：{{ '--' }}</a-col>
          <a-col class="playground-col" :span="12">运营项目：{{ '--' }}</a-col>
        </a-row>
        <a-row class="playground-row">
          <a-col class="playground-col" :span="12">宗地号：{{ '--' }}</a-col>
          <a-col class="playground-col" :span="12">土地面积：{{ '--' }}</a-col>
        </a-row>
        <a-row class="playground-row">
          <a-col class="playground-col" :span="12">土地用途：{{ '--' }}</a-col>
          <a-col class="playground-col" :span="12">土地类型：{{ '--' }}</a-col>
        </a-row>
        <a-row class="playground-row">
          <a-col class="playground-col" :span="12">土地性质：{{ '--' }}</a-col>
          <a-col class="playground-col" :span="12">经营方式：{{ '--' }}</a-col>
        </a-row>
        <a-row class="playground-row">
          <a-col class="playground-col" :span="24">地理位置：{{ '--' }}</a-col>
          <a-col class="playground-col" :span="24">权属单位：{{ '--' }}</a-col>
        </a-row>
      </div>
      <div class="section-title blue">业务信息</div>
      <div>
        <a-table
          border
          class="td-pd10"
          :loading="table.loading"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{ emptyText: '暂无数据' }"
          :scroll="{ x: 550, y: 300 }"
        >
          <div slot="operate" slot-scope="text, record">
            <a-input v-model="record.value" placeholder="请输入属性值" />
          </div>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      default: false,
    },
  },
  data: () => ({
    table: {
      loading: false,
      columns: [
        {
          align: 'center',
          title: '属性名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '100px',
        },
        {
          align: 'center',
          title: '操作',
          dataIndex: 'operate',
          scopedSlots: { customRender: 'operate' },
          width: '350px',
        },
      ],
      dataSource: [],
    },
  }),
  watch: {
    visible: {
      handler: function (v) {
        if (v) {
          this.init();
        }
      },
    },
  },
  methods: {
    init() {},
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="less" scoped>
.box {
  width: 750px;
  height: auto;
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .section-title {
    font-size: 15px;
  }
  .playground-col {
    margin-top: 10px;
    font-size: 14px;
  }
}
</style>
