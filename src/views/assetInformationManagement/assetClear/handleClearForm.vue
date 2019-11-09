<!--
  清理单的操作，包括新增，编辑，审核，详情
-->
<template>
  <div class="handle-clear-form">
    <div class="edit-box">
      <div class="edit-box-title"><i></i><span>基础信息</span></div>
      <div class="edit-box-content">
        <div class="edit-box-content-item">
          <span class="label-name" :class="{'label-space-between': pageType === 'new' || pageType === 'edit'}">清理单编号<i></i></span>：
          <span class="label-value" v-show="pageType === 'new' || pageType === 'edit'">
            <a-input :style="allStyle" v-model="cleaningOrderCode" placeholder="请输入清理单编号" type="text"></a-input>
          </span>
          <span class="label-value" v-show="pageType === 'detail' || pageType === 'audit'">{{cleaningOrderCode || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name" :class="{'label-space-between': pageType === 'new' || pageType === 'edit'}">资产项目<i></i></span>：
          <span class="label-value" v-show="pageType === 'new' || pageType === 'edit'">
            <a-select
              showSearch
              allowClear
              placeholder="请选择资产项目"
              optionFilterProp="children"
              :style="allStyle"
              :options="projectIdOptions"
              :filterOption="filterOption"
            ></a-select>
          </span>
          <span class="label-value" v-show="pageType === 'detail' || pageType === 'audit'">{{projectName || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name" :class="{'label-space-between': pageType === 'new' || pageType === 'edit'}">资产类型<i></i></span>：
          <span class="label-value" v-show="pageType === 'new' || pageType === 'edit'">
            <a-select
              showSearch
              allowClear
              placeholder="请选择资产类型"
              optionFilterProp="children"
              :style="allStyle"
              :options="assetTypeOptions"
              :filterOption="filterOption"
            ></a-select>
          </span>
          <span class="label-value" v-show="pageType === 'detail' || pageType === 'audit'">{{assetTypeName || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name" :class="{'label-space-between': pageType === 'new' || pageType === 'edit'}">清理原因<i></i></span>：
          <span class="label-value" v-show="pageType === 'new' || pageType === 'edit'">
            <a-select
              :maxTagCount="1"
              :style="allStyle"
              mode="multiple"
              :tokenSeparators="[',']"
              placeholder="请选择清理原因"
              style="width: 160px;">
              <a-select-option v-for="(item, index) in cleanupTypeOptions" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
          </span>
          <span class="label-value" v-show="pageType === 'detail' || pageType === 'audit'">{{cleanupTypeName || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name" :class="{'label-space-between': pageType === 'new' || pageType === 'edit'}">所属机构<i></i></span>：
          <span class="label-value" v-show="pageType === 'new' || pageType === 'edit'">
            <a-input :style="allStyle" v-model="organName" type="text" disabled></a-input>
          </span>
          <span class="label-value" v-show="pageType === 'detail'">{{organName || '--'}}</span>
        </div>
        <div class="edit-box-content-item" v-show="pageType === 'detail' || pageType === 'audit'">
          <span class="label-name">创建人</span>：
          <span class="label-value">{{createByName || '--'}}</span>
        </div>
        <div class="edit-box-content-item" v-show="pageType === 'detail' || pageType === 'audit'">
          <span class="label-name">创建时间</span>：
          <span class="label-value">{{createTime || '--'}}</span>
        </div>
        <div class="edit-box-content-item" v-show="pageType === 'detail' || pageType === 'audit'">
          <span class="label-name">备注</span>：
          <span class="label-value">{{remark || '--'}}</span>
        </div>
        <div class="edit-box-content-item-totalWidth" v-show="pageType === 'new' || pageType === 'edit'">
          <span class="label-name-box" :class="{'edit-label': pageType === 'new' || pageType === 'edit'}"><span class="label-name label-space-between">备注<i></i></span>：</span>
          <span class="label-value">
            <a-textarea v-model="remark" placeholder="请输入描述" :rows="3"></a-textarea>
          </span>
          <span class="label-value" v-show="pageType === 'detail'">{{remark || '--'}}</span>
        </div>
        <div class="edit-box-content-item-totalWidth">
          <span class="label-name-box" :class="{'edit-label': pageType === 'new' || pageType === 'edit'}"><span class="label-name" :class="{'label-space-between': pageType === 'new' || pageType === 'edit'}">附件<i></i></span>：</span>
          <span class="label-value">
            <SG-UploadFile v-model="files" type="all" :show="pageType === 'detail' || pageType === 'audit'" />
            <span class="file-null" v-show="(pageType === 'detail' || pageType === 'audit') && files.length === 0">--</span>
          </span>
        </div>
      </div>
    </div>
    <div class="edit-box">
      <div class="edit-box-title"><i></i><span>资产明细</span></div>
      <div class="edit-box-content">
        <div class="table-header-btn">
          <SG-Button type="primary" weaken>添加资产</SG-Button>
        </div>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          class="custom-table"
          :pagination="false"
        >
          <template slot="operation" slot-scope="text, record">
            <a class="operation-btn">删除</a>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: '160'
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: '160'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '160'
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
    width: '160'
  },
  {
    title: '所在位置',
    dataIndex: 'position',
    width: '160'
  },
  {
    title: '面积(㎡)',
    dataIndex: 'assetArea',
    width: '160'
  },
  {
    title: '规格',
    dataIndex: 'specification',
    width: '160'
  },
  {
    title: '资产状态',
    dataIndex: 'assetStatus',
    width: '160'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }]
export default {
  data () {
    return {
      pageType: 'new',
      allStyle: 'width: 160px;',
      organId: '',
      organName: 'XX集团',
      cleaningOrderCode: '',
      projectId: '',
      projectName: '',
      projectIdOptions: [
        {label: '公建2019', value: '1'},
        {label: '廉租房2018', value: '2'}
      ],
      assetType: '',
      assetTypeName: '',
      assetTypeOptions: [
        {label: '房屋', value: '1'},
        {label: '构筑物', value: '2'},
        {label: '设备', value: '3'}
      ],
      cleanupType: '',
      cleanupTypeName: '',
      cleanupTypeOptions: [
        {name: '资产转让', value: '1'},
        {name: '资产报废', value: '2'},
        {name: '资产销售', value: '3'}
      ],
      createByName: '',
      createTime: '',
      remark: '',
      files: [],
      columns,
      dataSource: []
    }
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 新增行
    addItem () {
    }
  },
  mounted () {
    this.pageType = this.$route.query.pageType
  }
}
</script>

<style lang="less" scoped>
  .handle-clear-form {
    padding: 40px 105px 0 95px;
    .edit-box {
      text-align: left;
      color: #49505E;
      margin-bottom: 40px;
      .edit-box-title {
        height: 14px;
        font-size: 14px;
        font-weight:bold;
        i {
          display: block;
          height: 14px;
          width: 5px;
          margin-right: 10px;
          background: #0084FF;
          float: left;
        }
        span {
          display: block;
          float: left;
          height: 14px;
          line-height: 14px;
          font-family: PingFang-SC-Heavy;
        }
      }
      .edit-box-content {
        margin: 30px 40px 0 40px;
        position: relative;
        .edit-box-content-item {
          height: 32px;
          width: 33%;
          float: left;
          font-size: 12px;
          margin-bottom: 30px;
          baseline-shift: super;
          display: flex;
          align-items: center;
          .label-name {
            font-family: PingFang-SC-Regular;
            color: #282D5B;
            margin-right: 3px;
          }
          .label-space-between {
            width: 65px;
            text-align: justify;
            margin-top: 20px;
            i {
              display: inline-block;
              width: 100%;
            }
          }
          .label-value {
            margin-left: 15px;
          }
        }
        .edit-box-content-item-totalWidth {
          width: 100%;
          display: inline-block;
          margin-bottom: 30px;
          .label-name-box {
            display: flex;
            align-items: center;
            height: 32px;
            float: left;
            .label-name {
              margin-right: 3px;
            }
            .label-space-between {
              width: 65px;
              text-align: justify;
              margin-top: 20px;
              i {
                display: inline-block;
                width: 100%;
              }
            }
          }
          .edit-label {
            width: 80px;
          }
          .label-value {
            float: left;
            width: calc(100% - 95px);
            margin-left: 15px;
            .file-null {
              height: 32px;
              line-height: 32px;
            }
          }
        }
        .table-header-btn {
          position: absolute;
          right: 0;
          top: -44px;
        }
      }
    }
  }
</style>