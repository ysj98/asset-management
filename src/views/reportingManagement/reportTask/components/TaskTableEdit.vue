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
          :showUploadList="false"
          :action="importBatchData"
          style="margin-left: 10px; display: inline-block"
        >
          <SG-Button icon="plus" :disabled="!customColumns.length">批量导入</SG-Button>
          <!--<a-button> <a-icon type="upload" /> Click to Upload </a-button>-->
        </a-upload>
        <span style="color: #e4393c; float: right; line-height: 32px; margin-right: 15px">填报总数: {{tableObj.dataSource.length}}</span>
      </div>
      <a-form :form="form">
        <a-table v-bind="tableObj" class="custom-table td-pd10">
        <a-table-column
          v-for="m in customColumns"
          :key="m.columnName"
          :dataIndex="m.columnName"
          :fixed="m.fixed || false"
          :width="m.width || 180"
        >
          <!--自定义表头-->
          <span slot="title" @click="handleSameTableCell(m)">
            <span style="color: #e4393c; vertical-align: middle">{{m.columnNeed ? '*' : ''}}</span>
            <span
              :style="`${(m.columnName === 'cardCode' || m.columnName === 'assetCode') ? '' : 'color: #0084FF; cursor: pointer;'}`"
            >{{m.columnDesc}}</span>
          </span>
          <!--Table Cell slot-->
          <template slot-scope="text, record">
            <!--特别处理的表单域-->
            <a-form-item v-if="specialArr.includes(m.columnName)" :key="record.key">
              <a-input
                disabled
                style="width: 100%"
                :placeholder="`请选择${m.columnDesc}`"
                v-decorator="[`${m.columnName}_${record.key}`, {
                  rules: [{required: !!m.columnNeed, message: `请选择${m.columnDesc}`}]
                }]"
              />
              <span
                class="select_mask"
                @click="handleSelectAsset(m.columnName, record.key)"
                v-if="['cardName', 'assetName'].includes(m.columnName)"
              ></span>
            </a-form-item>
            <!--columnType === 1 文本输入域-->
            <a-form-item v-else-if="m.columnType === 1" :key="record.key">
              <a-input
                style="width: 100%"
                :placeholder="`请输入${m.columnDesc}`"
                v-decorator="[`${m.columnName}_${record.key}`, {
                  rules: [
                    {required: !!m.columnNeed, message: `请输入${m.columnDesc}`},
                    {max: m.columnLength || 999, message: `最多${m.columnLength || 999}个字符`}
                  ]
                }]"
              />
            </a-form-item>
            <!--columnType === 2 数字输入域-->
            <a-form-item v-else-if="m.columnType === 2" :key="record.key">
              <a-input-number
                :min="0"
                style="width: 100%"
                :placeholder="`请输入${m.columnDesc}`"
                v-decorator="[`${m.columnName}_${record.key}`, {
                  rules: [{required: !!m.columnNeed, message: `请输入${m.columnDesc}`}]
                }]"
              />
            </a-form-item>
            <!--columnType === 3 日期选择域-->
            <a-form-item v-else-if="m.columnType === 3" :key="record.key">
              <a-date-picker
                allowClear
                style="width: 100%"
                :placeholder="`请选择${m.columnDesc}`"
                v-decorator="[`${m.columnName}_${record.key}`, {
                  rules: [{required: !!m.columnNeed, message: `请输入${m.columnDesc}`}]
                }]"
              />
            </a-form-item>
            <!--columnType === 5 年月日期选择域-->
            <a-form-item v-else-if="m.columnType === 5" :key="record.key">
              <a-month-picker
                allowClear
                style="width: 100%"
                :placeholder="`请选择${m.columnDesc}`"
                v-decorator="[`${m.columnName}_${record.key}`, {
                  rules: [{required: !!m.columnNeed, message: `请输入${m.columnDesc}`}]
                }]"
              />
            </a-form-item>
            <!--columnType === 4 下拉选择域-->
            <a-form-item v-else-if="m.columnType === 4" :key="record.key">
              <a-select
                showSearch
                allowClear
                :options="m.options"
                style="width: 100%"
                :placeholder="`请选择${m.columnDesc}`"
                v-decorator="[`${m.columnName}_${record.key}`, {
                  rules: [
                    {required: !!m.columnNeed, message: `请输入${m.columnDesc}`},
                    {max: m.columnLength || 999, message: `最多${m.columnLength || 999}个字符`}
                  ]
                }]"
              />
            </a-form-item>
            <!--默认展示形式-->
            <a-form-item v-else>
              <!--隐藏域，用于保存资产id或资产卡片id-->
              <a-input type="hidden" v-decorator="[`${assetType === 'Card' ? 'cardId' : 'assetId'}_${record.key}`]"/>
              <span>
                <span v-if="m.columnDesc !== '操作'">{{text}}</span>
                <a-popconfirm v-else okText="确定" cancelText="取消" title="确认要删除该数据吗?" @confirm="deleteTableItem(record.key)">
                  <span style="cursor: pointer; color: #e4393c">删除</span>
                </a-popconfirm>
              </span>
            </a-form-item>
          </template>
        </a-table-column>
      </a-table>
      </a-form>
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
      <!--columnType === 5 年月日期选择域-->
      <a-month-picker
        allowClear
        style="width: 100%"
        v-model="sameCellValue"
        v-else-if="columnType === 5"
        :placeholder="`请选择${columnName}`"
      />
    </SG-Modal>
    <select-asset :type="assetType" ref="selectAsset" @getValue="setAssetValue" v-bind="taskInfo"/>
  </div>
</template>

<script>
  import SelectAsset from './SelectAsset'
  import moment from 'moment'
  export default {
    name: 'TaskTableEdit',
    props: ['type', 'taskInfo', 'taskId'],
    components: { SelectAsset },
    data () {
      return {
        tableObj: {
          dataSource: [],
          loading: false,
          bordered: true,
          scroll: { x: true },
          pagination: false
        },
        form: this.$form.createForm(this), // 注册form
        customColumns: [], // 自定义column
        result: '1', // 填报结果, 1 填报，0 不填报
        resultRemark: '', // 填报说明
        exportBtnLoading: false, // 导出按钮loading
        dateArr: [], // 日期格式的字段[{format: 'YYYY-MM-DD': name:'test'}]
        isShowModal: false, // modal show
        sameCellValue: undefined, // 批量修改-值
        columnType: '', // 批量修改-列头类型
        dataIndex: '', // 批量修改-列头字段值
        columnName: '', // 批量修改-列头字段名
        selectOptions: [], // 批量修改-为select时选项数据
        assetType: '', // 查询资产卡片 Card 或资产名 Name 的标志
        dataSourceKeys: [], // 存放 Table dataSource 中 key 值
        indexKey: '', // 记录选中的 Table dataSource key
        specialArr: ['cardName', 'cardCode', 'assetName', 'assetCode'], // 特殊处理的显示字段
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
      handleSameTableCell ({columnType, columnName, sameCellValue, options, columnDesc, type}) {
        // 点击资产编码或资产卡片编码不执行操作
        if (columnName === 'cardCode' || columnName === 'assetCode') { return false }
        let { tableObj: { dataSource } } = this
        if (!dataSource.length) { return this.$message.warn('请先添加一行数据')}
        if (type === 'submit') {
          return this.tableObj.dataSource = dataSource.map(item => {
            return { ...item, [columnName]: sameCellValue }
          })
        }
        Object.assign(this, { columnType, dataIndex: columnName, isShowModal: true, selectOptions: options, columnName: columnDesc })
      },

      // 处理Modal关闭/保存
      handleModalAction (flag) {
        if (flag) {
          const { columnType, dataIndex, sameCellValue } = this
          this.handleSameTableCell({ columnType, columnName: dataIndex, sameCellValue, type: 'submit' })
        }
        Object.assign(this, {
          columnType: '', dataIndex: '', isShowModal: false, sameCellValue: undefined, columnName: '', selectOptions: []
        })
      },

      // 添加一条Table记录
      addTableItem () {
        let { customColumns } = this
        let key = new Date().getTime()
        let temp = { key}
        customColumns.forEach(m => temp[m.columnName] = m.columnType === 3 ? null : '')
        this.tableObj.dataSource.push(temp)
        this.dataSourceKeys.push(key)
      },
      
      // 删除一条Table记录
      deleteTableItem (key) {
        this.tableObj.dataSource = this.tableObj.dataSource.filter(m => m.key !== key)
        this.dataSourceKeys = this.dataSourceKeys.filter(v => v !== key)
      },

      // 查询表单字段,作为Table columns
      queryColumns () {
        const { taskInfo: { reportBillId, reportPlanId }, taskId } = this
        if (!reportBillId && !reportPlanId) { return false }
        // 清空旧数据
        this.assetType = ''
        this.customColumns = []
        this.tableObj.dataSource = []
        this.tableObj.loading = true
        this.$api.reportManage.queryReportBillColumn({reportBillId, reportPlanId}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0' && (res.data || []).length) {
              // 日期格式的字段
            let dateArr = []
            // 过滤不展示的列
            let list = (res.data || []).filter(v => v.columnDisplay !== 0)
            this.customColumns = list.map((m, i) => {
              if (m.columnType === 4) {
                m.options = (m.optVal || '').split(',').map(item => {
                  let t = item.split('-')
                  return { key: t[0], title: t[1] }
                })
              } else if (m.columnType === 3 || m.columnType === 5) {
                dateArr.push({
                  name: m.columnName,
                  format: m.columnType === 3 ? 'YYYY-MM-DD' : 'YYYY-MM'
                })
              }
              // 保存资产编码或资产卡片编码字段名
              if (m.columnName === 'assetName' || m.columnName === 'cardName') {
                this.assetType = m.columnName === 'assetName' ? 'Name' : 'Card'
              }
              return (i === 0 || i === 1) ? { ...m, fixed: list.length > 9 ? 'left' : false } : m
            }).concat({ columnName: 'action', columnDesc: '操作', fixed: list.length > 9 ? 'right' : false, width: 60 })
            if (taskId) { this.queryTableData(dateArr) }
            this.dateArr = dateArr
            this.tableObj.scroll.x = list.length > 9 ? list.length * 180 : true
            return false
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
                const { name, format } = v
                if (m.hasOwnProperty(name)) {
                  m[name] = m[name] ? moment(m[name], format) : null
                }
              })
              let key = i + new Date().getTime()
              this.dataSourceKeys.push(key)
              return { ...m, key }
            })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询填报数据出错')
        })
      },
      
      // 提交填报数据
      handleSubmit (resolve) {
        // 校验必填项
        const { result, resultRemark, dataSourceKeys, customColumns, dateArr, assetType } = this
        if (String(result) === '0' && !resultRemark ) {
          document.getElementById('resultRemark').scrollIntoView({block: "center"})
          return this.$message.warn('请填写填报说明')
        }
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            let detailList = dataSourceKeys.map(key => {
              let temp = {}
              // 补充资产id或资产卡片id
              let id = assetType === 'Card' ? 'cardId' : 'assetId'
              temp[id] = values[`${id}_${key}`]
              customColumns.forEach(c => {
                const { columnName } = c
                let val = values[`${columnName}_${key}`]
                let flag = false
                for (let i = 0; i < dateArr; i++) {
                  const { name, format } = dateArr[i]
                  if (name === columnName) {
                    temp[columnName] = val ? moment(val).format(format) : val
                    flag = true
                    break
                  }
                }
                if (!flag) {
                  temp[columnName] = val
                }
              })
              return temp
            })
            resolve({ result, resultRemark, detailList })
          } else {
            this.$message.warn('请检查填报数据列表')
          }
        })
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
            this.$message.success(res.message)
            let { dateArr, tableObj: { dataSource } } = this
            let newList = (res.data || []).map((m, i) => {
              dateArr.forEach(v => {
                const { name, format } = v
                if (m.hasOwnProperty(name)) {
                  m[name] = m[name] ? moment(m[name], format) : null
                }
              })
              let key = i + new Date().getTime()
              this.dataSourceKeys.push(key)
              return { ...m, key }
            })
            return this.tableObj.dataSource = dataSource.concat(newList)
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          return this.$message.error(err || '批量导入失败')
        })
      },
      
      // 选择资产或卡片Modal
      handleSelectAsset (type, key) {
        const {projectId} = this.taskInfo
        if (!projectId) {
          return this.$message.warn('请选择资产项目')
        }
        this.indexKey = key
        this.$refs['selectAsset'].isShow = true
      },

      // 赋值名称、编码字段及id隐藏域
      setAssetValue (values) {
        if (values) {
          const { indexKey, assetType } = this
          const { assetId, assetName, assetCode, cardId, cardName, cardCode } = values
          let obj = {}
          if (assetType === 'Card') {
            obj[`cardId_${indexKey}`] = cardId
            obj[`cardName_${indexKey}`] = cardName
            obj[`cardCode_${indexKey}`] = cardCode
          } else {
            obj[`assetId_${indexKey}`] = assetId,
            obj[`assetName_${indexKey}`] = assetName
            obj[`assetCode_${indexKey}`] = assetCode
          }
          this.form.setFieldsValue(obj)
        }
      }
    },

    watch: {
      // 切换资产项目时重置关联资产项目的数据项
      'taskInfo.projectId': function () {
        const { assetType, dataSourceKeys } = this
        if (assetType && dataSourceKeys.length) {
          let obj = {}
          let name = assetType === 'Card' ? 'card' : 'asset'
          dataSourceKeys.forEach(key => {
            obj[`${name}Name_${key}`] = ''
            obj[`${name}Code_${key}`] = ''
            obj[`${name}Id_${key}`] = ''
          })
          this.form.setFieldsValue(obj)
        }
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
      & /deep/ .ant-table td {
        .ant-form-item {
          margin-bottom: 15px;
        }
        padding-bottom: 0 !important;
        .ant-form-item-with-help {
          margin-bottom: 0 !important;
        }
        .ant-input-disabled {
          cursor: default;
          color: #000000a6;
          background-color: transparent;
        }
      }
      .select_mask {
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }
</style>
