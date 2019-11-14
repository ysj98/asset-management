<!--楼栋视图业务-楼栋视图详情页面-其它信息组件-->
<template>
  <div class="other_info">
    <SG-Title title="其它信息" noMargin/>
    <a-table v-bind="tableObj" class="custom-table title_div">
      <span slot="action" slot-scope="text, record">
        <span class="btn-text">下载</span>
      </span>
    </a-table>
  </div>
</template>

<script>
  export default {
    name: 'OtherInfoPart',
    data () {
      return {
        tableObj: {
          rowKey: 'assetCode',
          dataSource: [],
          columns: [
            { title: '档案分类', dataIndex: 'address', key: 'address' },
            { title: '档案名称', dataIndex: 'tags', key: 'tags'},
            { title: '档案日期', dataIndex: 'tagss', key: 'tagss'},
            { title: '归档人', dataIndex: 'taas', key: 'taas'},
            { title: '操作', key: 'action', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
          ]
        }
      }
    },

    methods: {},
    
    watch: {
    
    }
  }
</script>

<style lang='less' scoped>
  .other_info {
  }
</style>
