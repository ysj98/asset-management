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
          <div style="margin-left: 65px" id="resultRemark">
            <a-input placeholder="请输入填报说明" v-model="resultRemark"/>
          </div>
        </a-col>
      </a-row>
      <!--列表部分-->
      <div style="margin: 10px 0">
        <SG-Button icon="export" :loading="exportBtnLoading" @click="exportTemplate" :disabled="!customColumns.length">导出填报模板</SG-Button>
        <a-upload
          :fileList="fileList"
          :action="importBatchData"
          style="margin-left: 10px; display: inline-block"
        >
          <SG-Button icon="plus" :disabled="!customColumns.length">批量导入</SG-Button>
          <!--<a-button> <a-icon type="upload" /> Click to Upload </a-button>-->
        </a-upload>
        <span style="color: #e4393c; float: right; line-height: 32px; margin-right: 15px">填报总数: {{tableObj.dataSource.length}}</span>
      </div>
      <a-table v-bind="tableObj" class="custom-table td-pd10">
        <a-table-column
          v-for="m in customColumns"
          :key="m.columnCode"
          :dataIndex="m.columnCode"
          :fixed="m.fixed || false"
          :width="m.width || 180"
        >
          <!--自定义表头-->
          <span slot="title" @click="handleSameTableCell(m)">
            <span style="color: #e4393c; vertical-align: middle">{{m.columnNeed ? '*' : ''}}</span>
            <span style="color: #0084FF; cursor: pointer; white-space: nowrap">{{m.columnName}}</span>
          </span>
          <!--Table Cell slot-->
          <template slot-scope="text, record">
            <!--columnType === 1 文本输入域-->
            <a-input v-if="m.columnType === 1" v-model.trim="record[m.columnCode]" :placeholder="`请输入${m.columnName}`"/>
            <!--columnType === 2 数字输入域-->
            <a-input-number
              :min="0"
              style="width: 100%"
              v-model="record[m.columnCode]"
              v-else-if="m.columnType === 2"
              :placeholder="`请输入${m.columnName}`"
            />
            <!--columnType === 3 日期选择域-->
            <a-date-picker
              allowClear
              format="YYYY-MM-DD"
              style="width: 100%"
              v-model="record[m.columnCode]"
              v-else-if="m.columnType === 3"
              :placeholder="`请选择${m.columnName}`"
            />
            <!--columnType === 4 下拉选择域-->
            <a-select
              allowClear
              :options="m.options"
              style="width: 100%"
              v-model="record[m.columnCode]"
              v-else-if="m.columnType === 4"
              :placeholder="`请选择${m.columnName}`"
            />
            <!--默认展示形式-->
            <span v-else>
              <span v-if="m.columnName !== '操作'">{{text}}</span>
              <a-popconfirm v-else okText="确定" cancelText="取消" title="确认要删除该数据吗?" @confirm="deleteTableItem(record.key)">
                <span style="cursor: pointer; color: #e4393c">删除</span>
              </a-popconfirm>
            </span>
          </template>
        </a-table-column>
      </a-table>
      <div v-if="!tableObj.dataSource.length" style="text-align: center; margin-top: 25px; color: rgba(0, 0, 0, 0.45)">暂无数据</div>
      <div v-if="customColumns.length" style="margin: 15px 0">
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
        allowClear
        format="YYYY-MM-DD"
        style="width: 100%"
        v-model="sameCellValue"
        v-else-if="columnType === 3"
        :placeholder="`请选择${columnName}`"
      />
      <!--columnType === 4 下拉选择域-->
      <a-select
        allowClear
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
  import moment from 'moment'
  export default {
    name: 'TaskTableEdit',
    props: ['type', 'taskInfo', 'taskId'],
    data () {
      return {
        tableObj: {
          dataSource: [],
          loading: false,
          bordered: true,
          scroll: { x: true },
          pagination: false
        },
        customColumns: [], // 自定义column
        result: '1', // 填报结果, 1 填报，0 不填报
        resultRemark: '', // 填报说明
        exportBtnLoading: false, // 导出按钮loading
        dateArr: [], // 日期格式的字段
        isShowModal: false, // modal show
        sameCellValue: undefined, // 批量修改-值
        columnType: '', // 批量修改-列头类型
        dataIndex: '', // 批量修改-列头字段值
        columnName: '', // 批量修改-列头字段名
        assetNameOptions: [], // 资产名称选项
        assetCardOptions: [], // 资产卡片名称选
        selectOptions: [], // 批量修改-为select时选项数据
        assetType: '', // 查询资产卡片 card 或资产名 name 的标志
        fileList: [] // 隐藏Upload文件列表
      }
    },

    created () {
      this.queryColumns()
      if (this.type == 'edit') {
        let { result, resultRemark } = this.taskInfo
        this.resultRemark = resultRemark
        this.result = String(result)
      }
    },

    methods: {
      // 批处理Table Cell数据
      handleSameTableCell ({columnType, dataIndex, sameCellValue, options, columnName, type}) {
        if (type === 'submit') {
          let { tableObj: { dataSource } } = this
          return this.tableObj.dataSource = dataSource.map(item => {
            return { ...item, [dataIndex]: sameCellValue }
          })
        }
        Object.assign(this, { columnType, dataIndex, isShowModal: true, selectOptions: options, columnName })
      },

      // 处理Modal关闭/保存
      handleModalAction (flag) {
        if (flag) {
          const { columnType, dataIndex, sameCellValue } = this
          this.handleSameTableCell({ columnType, dataIndex, sameCellValue, type: 'submit' })
        }
        Object.assign(this, {
          columnType: '', dataIndex: '', isShowModal: false, sameCellValue: undefined, columnName: '', selectOptions: []
        })
      },

      // 添加一条Table记录
      addTableItem () {
        let { customColumns, tableObj: { dataSource } } = this
        let temp = { key: dataSource.length }
        customColumns.forEach(m => temp[m.columnCode] = Number(m.columnType) === 3 ? null : '')
        this.tableObj.dataSource.push(temp)
      },
      
      // 删除一条Table记录
      deleteTableItem (key) {
        this.tableObj.dataSource = this.tableObj.dataSource.filter(m => m.key !== key)
      },

      // 查询表单字段,作为Table columns
      queryColumns () {
        const { taskInfo: { reportBillId, reportPlanId }, taskId } = this
        if (!reportBillId && !reportPlanId) { return false }
        this.tableObj.loading = true
        this.$api.reportManage.queryReportBillColumn({reportBillId, reportPlanId}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0' && (res.data || []).length) {
            let dateArr = [] // 日期格式的字段
            let list = res.data
            this.customColumns = list.filter(v => Number(v.columnDisplay) !== 0).map((m, i) => {
              if (Number(m.columnType) === 4) {
                m.options = m.optVal.split(',').map(item => {
                  let t = item.split('-')
                  return { key: t[0], title: t[1] }
                })
              } else if (Number(m.columnType) === 3) {
                dateArr.push(m.columnCode)
              }
              return (i === 0 || i === 1) ? { ...m, fixed: list.length > 9 ? 'left' : false } : m
            }).concat({ columnName: '操作', fixed: list.length > 9 ? 'right' : false, width: 60 })
            if (taskId) { this.queryTableData(dateArr) }
            // 加载资产卡片名称或资产名称选项
            let temp = list[0]
            if (temp && (temp.columnName === '资产名称' || temp.columnName === '资产卡片名称')) {
              let assetType = temp.columnName === '资产名称' ? 'name' : 'card'
              this.assetType = assetType
              this.queryAssetOptions(assetType)
            }
            list.length > 9 && (this.tableObj.scroll.x = list.length * 180)
            return this.dateArr = dateArr
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询表单数据出错')
        })
      },

      // 查询列表数据
      queryTableData (dateArr) {
        this.tableObj.loading = true
        this.$api.reportManage.queryTaskDetailList({reportTaskId: this.taskId}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.tableObj.dataSource = res.data.map((m, i) => {
              dateArr.forEach(v => {
                if (m.hasOwnProperty(v)) {
                  m[v] = m[v] ? moment(m[v], 'YYYY-MM-DD') : null
                }
              })
              return { ...m, key: i }
            })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询填报数据出错')
        })
      },
      
      // 根据资产项目查询资产名称及资产卡片名称
      queryAssetOptions (assetType = this.assetType) {
        if (!this.taskInfo.projectId || !assetType) { return false }
        // 区分查询接口
        Promise.resolve(assetType).then(() => {
          this.assetNameOptions = [
            { title: '测试资产名1', key: 126, code: 889 },
            { title: '测试资产名2', key: 2512, code: 166 }
          ]
          this.assetCardOptions = [
            { title: '测试资卡片1', key: 126, code: 889 },
            { title: '测试资卡片2', key: 2512, code: 166 }
          ]
        })
      },
      
      // 提交填报数据
      handleSubmit () {
        // 校验必填项
        const { result, resultRemark, tableObj: { dataSource } } = this
        if (String(result) === '0' && !resultRemark ) {
          document.getElementById('resultRemark').scrollIntoView({block: "center"})
          this.$message.warn('请填写填报说明')
          return false
        }
        return { result, resultRemark, detailList: dataSource }
      },
      
      // 导出模板
      exportTemplate () {
        this.exportBtnLoading = true
        this.$api.reportManage.exportDetailTemplate({reportBillId: this.taskInfo.reportBillId}).then(res => {
          this.exportBtnLoading = false
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([res.data]))
            a.download = '任务填报模板.xls'
            document.body.appendChild(a)
            a.click()
            return a.remove()
          }
          throw res.message
        }).catch(err => {
          this.exportBtnLoading = false
          this.$message.error(err || '模板导出失败')
        })
      },
      
      // 批量导入数据
      importBatchData (file) {
        this.tableObj.loading = true
        let fileData = new FormData()
        fileData.append('file', file)
        fileData.append('reportBillId', this.taskInfo.reportBillId)
        this.$api.reportManage.importTaskdetailList(fileData).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$message.success(res.msg)
            let { dateArr, tableObj: { dataSource } } = this
            let index = dataSource.length
            let newList = (res.data || []).map((m, i) => {
              dateArr.forEach(v => {
                if (m.hasOwnProperty(v)) {
                  m[v] = m[v] ? moment(m[v], 'YYYY-MM-DD') : null
                }
              })
              return { ...m, key: i + index }
            })
            return this.tableObj.dataSource = dataSource.concat(newList)
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          return this.$message.error(err || '批量导入失败')
        })
      }
    },

    watch: {
      // 切换资产项目时更新资产卡片或资产名选项
      'taskInfo.projectId': function () {
        this.queryAssetOptions()
      },
      
      // 根据billId加载Table列头字段
      'taskInfo.reportBillId': function () {
        this.queryColumns()
      }
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
      /*.action_text {*/
        /*color: #0084FF;*/
        /*cursor: pointer;*/
        /*margin-right: 12px;*/
        /*white-space: nowrap;*/
      /*}*/
      /*.custom_table_column {*/
        /*color: #0084FF;*/
        /*cursor: pointer;*/
        /*white-space: nowrap;*/
      /*}*/
    }
  }
</style>
