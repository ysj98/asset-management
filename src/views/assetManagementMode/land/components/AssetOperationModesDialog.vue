<template>
  <div>
    <a-modal title="业务属性字段" :visible="visible" width="800px"  @cancel="handleClose" @ok="handleSubmit">
      <div class="modal-box">
        <a-table
          rowKey="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          class="custom-table td-pd10"
          :loading="table.loading"
          :pagination="false"
          bordered
          align="center"
          :columns="selectAttrColumns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
          :scroll="{x: 700, y:500 }"
        />
        <SG-FooterPagination
            location="relative"
            :pageLength="page.pageLength"
            :totalCount="page.totalCount"
            v-model="page.pageNo"
            @change="handleChange"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import {selectAttrColumns} from "../dict";

export default {
  props: {
    visible: {
      default: false
    },
    organId: {
      default: ""
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.$nextTick(()=>{
          this.init()
        })
      },
    },
  },
  data: ()=>({
    selectAttrColumns,
    table: {
      column:0,
      loading: false,
      dataSource: []
    },
    page: {
      pageSize: 10,
      pageNum: 1,
      totalCount: 0
    },
    selectedRowKeys: []
  }),
  methods: {
    init () {
      this.query()
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    handleSubmit () {
      console.log('submit')
      this.$emit("submit",this.selectedRowKeys)
    },
    handleClose () {
    console.log('handle close')
    this.$emit("close")
    },
    handleChange(data) {
      this.page.pageNum = data.pageNo;
      this.page.pageSize = data.pageLength;
      this.query()
    },
    query(){
      const params = {
        ...this.page,
        organId: this.organId,
      }
      this.table.loading = true
      console.log(params)
      this.queryAssetAttrConfig(params)
    },
    ////////////////////////////////////////////////////////////
    async queryAssetAttrConfig (params) {
      try {
        this.table.dataSource = [];
        this.page.totalCount = 0;
        this.table.loading = true;
        const {data: res} = await this.$api.attrConfig.queryAssetAttrConfig(params);
        if (String(res.code) === "0") {
          this.table.dataSource = res.data.data;
          this.page.totalCount = res.data.count;
        }
      } finally {
        this.table.loading = false;
      }
    }
  }
}
</script>
<style lang="less" scoped>
.color-title {
  width: 50px;
  height: 10px;
}
.modal-box {
  width: 750px;
  margin-top: 20px;
  position: relative;
}
</style>

