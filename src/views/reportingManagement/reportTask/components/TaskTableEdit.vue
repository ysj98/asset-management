<!--呈报任务-填报/详情页面-编辑填报数据part-->
<template>
  <div class="table_edit">
    <SG-Title title="填报数据"/>
    <div style="margin-left: 40px">
      <a-row v-if="type == 'edit'" style="line-height: 32px">
        <a-col :span="8">
          <span style="margin-right: 12px; color: #282D5B">填报结果:</span>
          <a-radio-group v-model="result">
            <a-radio value="1">填报</a-radio>
            <a-radio value="0">不填报</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="16">
          <span style="float: left;">填报说明:</span>
          <div style="margin-left: 65px">
            <a-input placeholder="请输入填报说明" v-model="des"/>
          </div>
        </a-col>
      </a-row>
      <!--列表部分-->
      <div style="margin: 10px 0">
        <SG-Button icon="plus">批量导入</SG-Button>
        <SG-Button icon="export" :loading="exportBtnLoading" style="margin-left: 10px">导出填报模板</SG-Button>
        <span style="color: #e4393c; float: right; line-height: 32px">填报总数: {{tableObj.dataSource.length}}</span>
      </div>
      <a-table v-bind="tableObj" class="custom-table td-pd10">
        <a-table-column
          v-for="m in tableObj.customColumns"
          :key="m.dataIndex"
          :dataIndex="m.dataIndex"
          :fixed="m.fixed"
          :width="m.width"
        >
          <!--自定义表头-->
          <span slot="title" @click="handleSameTableCell(m)" style="color: #0084FF; cursor: pointer; white-space: nowrap">
            <span style="color: #e4393c; vertical-align: middle">{{!m.columnNeed ? '*' : ''}}</span>
            {{m.title}}
          </span>
          <!--Table Cell slot-->
          <template slot-scope="text, record">
            <!--columnType === 1 文本输入域-->
            <a-input v-if="m.columnType === 1" v-model.trim="record[m.dataIndex]" :placeholder="`请输入${m.columnName}`"/>
            <!--columnType === 2 数字输入域-->
            <a-input-number
              style="width: 100%"
              v-model="record[m.dataIndex]"
              v-else-if="m.columnType === 2"
              :placeholder="`请输入${m.columnName}`"
            />
            <!--columnType === 3 日期选择域-->
            <a-date-picker
              format="YYYY-MM-DD"
              style="width: 100%"
              v-model="record[m.dataIndex]"
              v-else-if="m.columnType === 3"
              :placeholder="`请选择${m.columnName}`"
            />
            <!--columnType === 4 下拉选择域-->
            <a-select
              :options="[{title: '隔壁楼', key: 123}, {title: '老王', key: 12453}]"
              style="width: 100%"
              v-model="record[m.dataIndex]"
              v-else-if="m.columnType === 4"
              :placeholder="`请选择${m.columnName}`"
            />
            <!--默认展示形式-->
            <span v-else>{{text}}</span>
          </template>
        </a-table-column>
      </a-table>
      <div v-if="!tableObj.dataSource.length" style="text-align: center; margin-top: 25px; color: rgba(0, 0, 0, 0.45)">暂无数据</div>
      <div style="margin: 15px 0">
        <SG-Button icon="plus" style="width: 100%; height: 40px;" @click="addTableItem">添加</SG-Button>
      </div>
    </div>
    <!--批量修改Modal-->
    <SG-Modal
      :width="450"
      okText="保存"
      v-model="isShowModal"
      :title="`批量修改${columnName}`"
      @cancel="handleModalAction('')"
      @ok="handleModalAction('ok')"
    >
      <!--columnType === 1 文本输入域-->
      <a-input v-if="columnType === 1" v-model.trim="sameCellValue" :placeholder="`请输入${columnName}`"/>
      <!--columnType === 2 数字输入域-->
      <a-input-number v-else-if="columnType === 2" v-model="sameCellValue" :placeholder="`请输入${columnName}`" style="width: 100%"/>
      <!--columnType === 3 日期选择域-->
      <a-date-picker
        format="YYYY-MM-DD"
        style="width: 100%"
        v-model="sameCellValue"
        v-else-if="columnType === 3"
        :placeholder="`请选择${columnName}`"
      />
      <!--columnType === 4 下拉选择域-->
      <a-select
        style="width: 100%"
        v-model="sameCellValue"
        :options="selectOptions"
        v-else-if="columnType === 4"
        :placeholder="`请选择${columnName}`"
      />
    </SG-Modal>
  </div>
</template>

<script>
  export default {
    name: 'TaskTableEdit',
    props: ['type'],
    data () {
      return {
        result: '1', // 填报结果
        des: '12月份资产呈报数据',
        tableObj: {
          dataSource: [
            {relId: 12, assetCode: 834, createByName: '', assessmentValue: null },
            {relId: 243, assetCode: 394, createByName: '', assessmentValue: null },
            {relId: 45, assetCode: 384, createByName: '', assessmentValue: null }
          ],
          loading: false,
          bordered: true,
          scroll: { x: 2000 },
          pagination: false,
          rowKey: 'relId',
          customColumns: [
            { title: '价值编号', columnType: 1, dataIndex: 'relId', fixed: 'left', width: 120, scopedSlots: { customRender: 'relId' } },
            { title: '资产编码', columnType: 2, dataIndex: 'assetCode', fixed: 'left', width: 180, scopedSlots: { customRender: 'assetCode' } },
            { title: '提交人', columnType: 4, dataIndex: 'createByName' },
            { title: '本次估值(元)', columnType: 3, dataIndex: 'assessmentValue' }
          ]
        },
        exportBtnLoading: false, // 导出按钮loading
        isShowModal: false, // modal show
        sameCellValue: '', // 批量修改-值
        columnType: '', // 批量修改-列头类型
        dataIndex: '', // 批量修改-列头字段值
        columnName: '', // 批量修改-列头字段名
        selectOptions: [], // 批量修改-为select时选项数据
      }
    },

    methods: {
      // 批处理Table Cell数据
      handleSameTableCell ({columnType, dataIndex, sameCellValue, optVal, columnName, type}) {
        if (type === 'submit') {
          let { tableObj: { dataSource } } = this
          return this.tableObj.dataSource = dataSource.map(item => {
            return {
              ...item, [dataIndex]: sameCellValue
            }
          })
        }
        Object.assign(this, { columnType, dataIndex, isShowModal: true, selectOptions: optVal, columnName })
        // record[dataIndex] = type === 'input' ? e.target.value.replace(/(^\s*)|(\s*$)/g, "") : e
      },

      // 处理Modal关闭/保存
      handleModalAction (flag) {
        if (flag) {
          const { columnType, dataIndex, sameCellValue } = this
          this.handleSameTableCell({ columnType, dataIndex, sameCellValue, type: 'submit' })
        }
        Object.assign(this, {
          columnType: '', dataIndex: '', isShowModal: false, sameCellValue: '', columnName: '', selectOptions: []
        })
      },

      // 添加一条Table记录
      addTableItem () {}
    }
  }
</script>

<style lang='less' scoped>
  .table_edit {
    .custom-table {
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
      .action_text {
        color: #0084FF;
        cursor: pointer;
        margin-right: 12px;
        white-space: nowrap;
      }
      .custom_table_column {
        color: #0084FF;
        cursor: pointer;
        white-space: nowrap;
      }
    }
  }
</style>
