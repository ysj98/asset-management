<!--资产视图业务-资产视图详情页面-其它信息组件-->
<template>
  <div class="other_info">
    <SG-Title title="其他信息"/>
    <a-tabs defaultActiveKey="receive" v-model="tabKey" class="title_div">
      <a-tab-pane v-for="(item, itemKey) in infoKeys" :tab="item.title" :key="itemKey">
        <!--散列信息-->
        <a-row v-if="Object.keys(item.details).length">
          <a-col :span="8" v-for="(name, key) in item.details" :key="key">
            <span style="margin-right: 4px; color: #282D5B">{{name}}:</span>
            <span style="color: #49505E">{{detailData[key] || '无'}}</span>
          </a-col>
        </a-row>
        <!--列表部分-->
        <div v-if="item['table']['tableTitle']" style="color: #49505E; margin: 15px 0; font-weight: bold">{{item['table']['tableTitle']}}</div>
        <a-table
          v-if="item['table']['rowKey']"
          :rowKey="item['table']['rowKey']"
          :columns="item['table']['columns']"
          :dataSource="tableData"
          :pagination="false"
          class="custom-table td-pd10"
        />
        <!--特殊处理：权属信息展示的第两个Table-->
        <div v-if="item['table2']">
          <div style="color: #49505E; margin: 15px 0; font-weight: bold">{{item['table2']['tableTitle']}}</div>
          <a-table
            :rowKey="item['table2']['rowKey']"
            :columns="item['table2']['columns']"
            :dataSource="tableData"
            :pagination="false"
            class="custom-table td-pd10"
          >
          <span slot="action" slot-scope="text, record">
            <span class="btn-text">{{text}}</span>
          </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import infoKeys from './otherInfoKeys'
  export default {
    name: 'OtherInfoPart',
    props: ['assetHouseId'],
    data () {
      return {
        infoKeys, // 所以Tab的展示字段
        tabKey: 'receive', // 默认展示第一个Tab-接管信息
        detailData: {}, // 散列信息
        tableData: [] // table信息
      }
    },

    methods: {},
    
    watch: {
      tabKey (key) {
        // 如果Tab被激活过，不处理数据-------
        if (key) {
          Object.assign(this, {
            detailData: {},
            tableData: []
          })
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .other_info {
    .custom-table {
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
      & /deep/ .ant-table-body {
        &::-webkit-scrollbar {
          height: 8px !important;
        }
      }
    }
  }
</style>
