<!--
 * @Author: LDC
 * @Date: 2022-06-16 10:52:07
 * @LastEditTime: 2022-06-23 11:41:28
 * @Description: 
 * 
 * 
-->
<template>
  <SG-Modal
  width="800px"
  v-model="show"
  okText="确定"
  title="资产分类明细"
  :footer="null"
  >
   <a-spin :spinning="loading">
     <a-table
   :columns="columns"
    :data-source="dataSource"
    :pagination="false"
   >

   </a-table>
   </a-spin>
  </SG-Modal>
</template>

<script>
export default {
  props: ['queryInfo'],
  data() {
    return {
      show: false,
      columns: [
        { title: '序号', dataIndex: 'index' },
        { title: '资产分类', dataIndex: 'assetTypeName' },
        { title: '资产面积(㎡)', dataIndex: 'areaTotal' },
        { title: '占比%', dataIndex: 'percentage' }
      ],
      loading: false,
      dataSource: []
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.queryData(this.queryInfo)
      }
    },
    // queryInfo (val) {
    //   if (val) {
    //     this.queryData(this.queryInfo)
    //   }
    // }
  },
  methods: {
    // 查询汇总数据
      queryData (form) {
        let { divObj } = this
        console.log(form)
        if (!form.organId) { return false }
        this.loading = true
        
        //  this.$api.tableManage.queryAssetHouseTotal(form).then(r => {
        this.$api.tableManage.queryAssetTypeDetailTotal(form).then(r => {
          this.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.isHasData = true
            this.dataSource = res.data
            this.dataSource.map((m, index) => {
              console.log(m,index)
              m.index = index + 1
            })
          }
        }).catch(err => {
          this.isHasData = false
          this.loading = false
          this.$message.error(err || '查询汇总数据出错')
          console.log(err)
        })
      },
  },
}
</script>

<style>

</style>