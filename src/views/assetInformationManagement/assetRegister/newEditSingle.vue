<!--
  新增: new
  编辑: edit
-->
<template>
  <a-spin :spinning="spinning">
  <div class="newEditSingle">
    <div class="newEditSingle-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-form :form="form" @submit="handleSubmit">
          <a-col class="playground-col" :span="8">
            <a-form-item label="登记单编号" v-bind="formItemLayout">
              <a-input placeholder="请输入登记单编号"
              :style="allWidth"
              :max="10"
              v-decorator="['registerOrderCode',
                {rules: [{required: true, max: 30, whitespace: true, message: '请输入登记单编号(不超过30字符)'}], initialValue: newEditSingleData.title}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="资产项目：" v-bind="formItemLayout">
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产项目"
                v-decorator="['projectId',{
                    rules: [{required: true, message: '请选择资产项目'}],
                    initialValue: newEditSingleData.projectId
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                @change="projectIdFn"
                notFoundContent="没有查询到资产项目"
                >
                <a-select-option
                  v-for="(item) in projectIdData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="资产类型：" v-bind="formItemLayout">
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="['assetType',{
                    rules: [{required: true, message: '请选择资产类型'}],
                    initialValue: newEditSingleData.assetType
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到资产类型"
                >
                <a-select-option
                  v-for="(item) in assetTypeData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8" v-if="+takeOver === 0">
            <a-form-item label="接管日期：" v-bind="formItemLayout">
              <a-date-picker
              :style="allWidth"
              placeholder="请选择接管日期"
              v-decorator="['takeOverDate',
                {rules: [{required: true, message: '请选择接管日期'}]}
              ]"
              />
              </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item label="备注" v-bind="formItemTextarea">
              <a-textarea placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-decorator="['remark',
                {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: newEditSingleData.remark}
                ]"
                />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
              <a-form-item label="上传附件：" v-bind="formItemTextarea">
                <SG-UploadFile
                  v-model="newEditSingleData.files"
                  type="all"
                />
              </a-form-item>
            </a-col>
        </a-form>
      </a-row>
      <div class="tab-nav">
        <span class="section-title blue">资产明细</span>
        <div class="tab-exhibition">
          <div class="exhibition" v-for="(item, index) in assetsCount" :key="index">
            <div class="exhibition-nav">
              <div>{{item.name}}</div>
              <div>{{item.value}}</div>
            </div>
          </div>
        </div>
        <div class="button-box">
          <div class="buytton-nav">
            <SG-Button type="primary" weaken @click="downloadTemplate">下载模板</SG-Button>
            <SG-Button class="choice" type="primary" weaken @click="addTheAsset">导入资产清单</SG-Button>
            <SG-Button type="primary" weaken @click="emptyFn">清空列表</SG-Button>
          </div>
        </div>
        <!-- table-layout-fixed -->
        <div class="table-borders">
          <a-table
            class="table-box"
            :scroll="{y: 450, x: 2700}"
            :columns="columns"
            :dataSource="tableData"
            :pagination="false"
            >
            <template slot="operation" slot-scope="text, record">
              <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <FormFooter style="border:none;">
      <SG-Button class="mr2" @click="save" type="primary">提交</SG-Button>
      <SG-Button @click="cancel">取消</SG-Button>
    </FormFooter>
     <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
    <SG-Modal
      width="500px"
      v-model="modalShow"
      okText="下载模板"
      title="下载模板"
      @ok="commonFn"
    >
      <div>
        <div class="modal-nav">
          <a-radio-group v-model="checkboxAssetType">
            资产类型：<a-radio v-for="(item, index) in checkboxData" :key="index" disabled :value="item.value">{{item.name}}</a-radio>
          </a-radio-group>
        </div>
        <!-- 楼栋名称：<a-select :maxTagCount="4" style="width: 300px" mode="multiple" placeholder="楼栋名称" v-model="buildIds"  @search="handleSearch">
          <a-select-option v-for="(item, index) in buildIdsData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select> -->
        楼栋名称：<a-select
        style="width: 300px"
        mode="multiple"
        :maxTagCount="4"
        showSearch
        placeholder="请选择楼栋"
        v-model="buildIds"
        @search="handleSearch"
        optionFilterProp="children"
        :options="buildIdsData"
        :allowClear="true"
        :filterOption="false"
        notFoundContent="没有查询到数据"
        />
        <div class="modal-nav">
          <a-checkbox-group v-model="scope" @change="onChange">
            数据范围：<a-checkbox v-for="(item, index) in scopeData" :key="index" :value="item.value">{{item.name}}</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
    </SG-Modal>
  </div>
</a-spin>
</template>

<script>
import AssetBundlePopover from '../../common/assetBundlePopover'
import FormFooter from '@/components/FormFooter'
import moment from 'moment'
import {columnsData, judgmentData} from './registerBasics'
import {debounce, utils, calc} from '@/utils/utils'
const newEditSingleData = {
  registerOrderCode: '',   // 验收单名称
  assetType: undefined,     // 资产类型
  projectId: undefined,     // 资产项目
  takeOverDate: {},       // 接管日期
  remark: '',          // 备注
  files: [],
  organId: ''
}
const checkboxData = [
  {
    value: '1',
    name: '房屋'
  }, {
    value: '2',
    name: '土地'
  }, {
    value: '3',
    name: '设备'
  }
]
const scopeData = [
  {
    value: '1',
    name: '楼栋'
  }, {
    value: '2',
    name: '房屋'
  }
]
// const assetsCount = [
//   {
//     code: 'assetsNum',
//     name: '资产数量',
//     value: 0
//   },
//   {
//     code: 'areaNum',
//     name: '建筑面积',
//     value: 0
//   },
//   {
//     code: 'originalNum',
//     name: '资产原值',
//     value: 0
//   },
//   {
//     code: 'marketValueNum',
//     name: '市场价值',
//     value: 0
//   }
// ]
export default {
  components: {AssetBundlePopover, FormFooter},
  props: {},
  data () {
    return {
      jupeProjectId: '',
      takeOver: '',
      fileType: ['xls', 'xlsx'],
      formData: null,
      spinning: false,
      setType: '',
      recordKey: '',
      registerOrderId: '',
      assetsCount: '',
      organId: '',
      buildIds: undefined,
      buildIdsData: [],
      checkboxAssetType: '1',
      scope: ['1', '2'],
      modalShow: false,   // 下载模板
      checkboxData: [...checkboxData],
      scopeData: [...scopeData],
      enitData: '',
      checkedData: [],
      show: false,
      columns: [...columnsData],
      tableData: [],
      organIdData: [],
      assetTypeData: [],
      projectIdData: [],
      newEditSingleData: {...newEditSingleData},
      form: this.$form.createForm(this),
      allWidth: 'width: 160px',
      widthBox: 'width: 80%',
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      }
    }
  },
  computed: {
  },
  methods: {
    // 项目监听
    projectIdFn (val) {
      this.projectIdData.forEach(item => {
        if (+val === +item.value) {
          console.log(this.takeOver, '909090')
          this.takeOver = item.takeOver
        }
      })
    },
    // 添加资产
    addTheAsset () {
      this.$refs.fileUpload.click()
    },
    checkFile (fileName, fileSize) {
      // 检查文件类型
      let myFileType = false
      if (this.fileType.length) {
        const FileType = fileName.split('.').pop().toLowerCase()
        myFileType = this.fileType.some(item => item.toLowerCase() === FileType)
      }
      // 检查文件大小
      let mfileSize = true
      if (fileSize) {
        mfileSize = fileSize <= (this.fileMaxSize * 1024)
      }
      return {
        size: mfileSize,
        type: myFileType
      }
    },
    // 文件上传
    change (files, e) {
      if (!files.length) { return }
      let fileData = new FormData()
      fileData.append('registerOrderModelFile', files[0])
      let validObj = this.checkFile(files[0].name, files[0].size)
      if (!validObj.type) {
        this.$message.error('上传文件类型错误!')
        return
      }
      this.fileName = files[0].name
      this.formData = fileData
      if (this.formData === null) {
        return this.$message.error('请先上传文件!')
      }
      let loadingName = this.SG_Loding('导入中...')
      this.$api.assets.readExcelModel(this.formData).then(res => {
        if (res.data.code === '0') {
          e.target.value = ''
          let resData = res.data.data
          console.log(resData, 'opopo')
          let arrData = utils.deepClone([...resData, ...this.tableData])
          // 数组去重根据type和objectId
          let hash = {}
          arrData = arrData.reduce((preVal, curVal) => {
            hash[Number(curVal.objectId) + Number(curVal.type)] ? '' : hash[Number(curVal.objectId) + Number(curVal.type)] = true && preVal.push(curVal)
            return preVal
          }, [])
          // 遍历判断必填有字段
          for (let i = 0; i < arrData.length; i++) {
            for (let j = 0; j < judgmentData.length; j++) {
             // 必填字段
              if (judgmentData[j].required) {
                if (!arrData[i][judgmentData[j].dataIndex]) {
                  this.DE_Loding(loadingName).then(() => {
                    this.$message.info(`请输入${judgmentData[j].title}`)
                  })
                  return
                }
              }
              // 判断只能为数字小数
              if (judgmentData[j].type === 'float') {
                if (arrData[i][judgmentData[j].dataIndex] && !(/^(\d{1,10}|\d{1,8}\.\d{1,2})$/).test(arrData[i][judgmentData[j].dataIndex])) {
                  this.DE_Loding(loadingName).then(() => {
                    this.$message.info(`请输入正确${judgmentData[j].title}`)
                  })
                  return
                }
              }
              // 判断只能为整数
              if (judgmentData[j].type === 'number') {
                if (arrData[i][judgmentData[j].dataIndex] && !(/^\d{1,11}$/).test(Number(arrData[i][judgmentData[j].dataIndex]))) {
                  this.DE_Loding(loadingName).then(() => {
                    this.$message.info(`请输入正确${judgmentData[j].title}`)
                  })
                  return
                }
              }
              // 判断不超过多少字符
              if (judgmentData[j].fontLength) {
                if (arrData[i][judgmentData[j].dataIndex] && String(arrData[i][judgmentData[j].dataIndex]).length > judgmentData[j].fontLength) {
                  this.DE_Loding(loadingName).then(() => {
                    this.$message.info(`${judgmentData[j].title}不超过${judgmentData[j].fontLength}字符`)
                  })
                  return
                }
              }
              // 判断时间转换
              if (judgmentData[j].date) {
                if (arrData[i][judgmentData[j].dataIndex]) {
                  arrData[i][judgmentData[j].dataIndex] = utils.xlsxDate(arrData[i][judgmentData[j].dataIndex])
                }
              }
            }
            if (arrData[i].ownershipStatusName === '有证') {
              if (!arrData[i].warrantNbr) {
                this.DE_Loding(loadingName).then(() => {
                  this.$message.info('当权属情况为有证时需输入权证号')
                })
                return
              }
            }
            arrData[i].key = i
            arrData[i].area = arrData[i].area ? arrData[i].area : 0
            arrData[i].transferArea = arrData[i].transferArea ? arrData[i].transferArea : 0
            this.assetsCount[1].value = calc.add(this.assetsCount[1].value, arrData[i].area || 0)
            this.assetsCount[2].value = calc.add(this.assetsCount[2].value, arrData[i].originalValue || 0)
            this.assetsCount[3].value = calc.add(this.assetsCount[3].value, arrData[i].marketValue || 0)
          }
          this.assetsCount[0].value = arrData.length
          this.tableData = arrData
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('导入成功！')
          })
        } else {
          e.target.value = ''
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error(res.data.message)
          })
        }
      }, () => {
        e.target.value = ''
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error('导入失败！')
        })
      })
    },
    // 下载模板
    downloadTemplate () {
      this.modalShow = true
    },
    // 资产登记-导出数据校验
    checkBuildsObjectTypeFn () {
      let obj = {
        buildIds: this.buildIds,
      }
      this.$api.assets.checkBuildsObjectType(obj).then(res => {
        if (res.data.code === '0') {
          this.confirmDownloadTemplate()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 下载模板确认
    commonFn () {
      if (!this.buildIds || this.buildIds.length < 0) {
        this.$message.info('请选择楼栋名称')
        return
      }
      if (this.scope.length < 0) {
        this.$message.info('请选择数据范围')
        return
      }
      console.log(this.scope, '这是什么')
      if (this.scope.includes('1')) {
        this.checkBuildsObjectTypeFn()
      } else {
        this.confirmDownloadTemplate()
      }
    },
    // 模板下载
    confirmDownloadTemplate () {
      let obj = {
        registerOrderId: this.registerOrderId,
        assetType: this.checkboxAssetType,
        buildIds: this.buildIds,
        scope: this.scope.join(','),
        organId: this.organId
      }
      this.$api.assets.downloadTemplate(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产登记模板.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
        this.modalShow = false
      })
    },
    onChange () {},
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        } else {
          // console.log('Received values of form: ', values)
        }
      })
    },
    // 清空列表
    emptyFn () {
      if (this.tableData.length === 0) {
        this.$message.info('暂无资产清空')
        return
      }
      this.commomDelete('empty')
    },
    // 删除
    deleteFn (record) {
      this.commomDelete('delete', record.key)
    },
    commomDelete (str, recordKey) {
      let _this = this
      _this.$confirm({
        title: '提示',
        content: str === 'delete' ? '确认要反审核该资产登记单吗？' : '确认要清空资产列表？',
        onOk() {
          if (str === 'delete') {
            _this.tableData.forEach((item, index) => {
              if (item.key === recordKey) {
                _this.tableData.splice(index, 1)
              }
            })
          } else {
            _this.tableData = []
          }
        }
      })
    },
    // 楼栋搜索
    handleSearch (value) {
      this.searchBuildName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
        this.queryBuildList(this.organId, this.searchBuildName || '')
    }, 200),
    // 请求楼栋列表默认20条
    queryBuildList (organId, buildName) {
      this.$api.basics.queryBuildList({organId, buildName: buildName || ''}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.buildIdsData = result.map(item => {
            return {name: item.buildName, value: item.buildId, label: item.buildName}
          })
        }
      })
    },
    // 提交
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.tableData.length <= 0) {
            this.$message.info('请导入资产明细')
            return
          }
          let files = []
          if (this.newEditSingleData.files.length > 0) {
            this.newEditSingleData.files.forEach(list => {
              files.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name
              })
            })
          }
          let data = utils.deepClone(this.tableData)
          data.forEach(item => {
            if (item.ownershipStatusName === '有证') {
              item.ownershipStatus = 1
            } else if (item.ownershipStatusName === '无证') {
              item.ownershipStatus = 0
            } else {
              item.ownershipStatus = 2
            }
          })
          console.log(values.takeOverDate, '这是什么时间')
          let obj = {
            registerOrderId: this.registerOrderId,                         // 资产变动单Id（新增为空）
            registerOrderCode: values.registerOrderCode, // 登记单编号
            projectId: values.projectId,                 // 资产项目Id
            assetType: values.assetType,                 // 资产类型Id
            remark: values.remark,                       // 备注
            organId: this.organId,                      // 组织机构id
            takeOverDate: values.takeOverDate === undefined ? '' : `${values.takeOverDate.format('YYYY-MM-DD')}`,                // 接管日期
            assetHouseList: data,
            attachment: files.length === 0 ? [] : files
          }
          console.log(obj)
          // 编辑
          if (this.setType === 'edit') {
            let loadingName = this.SG_Loding('保存中...')
            this.$api.assets.updateRegisterOrder(obj).then(res => {
              if (Number(res.data.code) === 0) {
                this.DE_Loding(loadingName).then(() => {
                  this.$SG_Message.success('提交成功')
                  this.$router.push({path: '/assetRegister', query: {refresh: true}})
                })
              } else {
                this.DE_Loding(loadingName).then(() => {
                  this.$message.error(res.data.message)
                })
              }
            }) 
          } else {
          // 新增
           let loadingName = this.SG_Loding('保存中...')
            this.$api.assets.saveRegisterOrder(obj).then(res => {
              if (Number(res.data.code) === 0) {
                this.DE_Loding(loadingName).then(() => {
                  this.$SG_Message.success('提交成功')
                  this.$router.push({path: '/assetRegister', query: {refresh: true}})
                })
              } else {
                this.DE_Loding(loadingName).then(() => {
                  this.$message.error(res.data.message)
                })
              }
            }) 
          }
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/assetRegister'})
    },
    // 编辑获取接口
    editFn () {
      let obj = {
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.jupeProjectId = data.projectId
          this.form.setFieldsValue({
            projectId: data.projectId,
            registerOrderCode: data.registerOrderCode,
            assetType: String(data.assetType),
            remark: data.remark
          })
          if (data.takeOverDate) {
            this.form.setFieldsValue({
              takeOverDate: data.takeOverDate === '' ? '' : moment(data.takeOverDate, 'YYYY-MM-DD'),
            })
          }
          let files = []
          if (data.attachment && data.attachment.length > 0) {
              data.attachment.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.attachmentPath.split('/').pop()
              })
            })
          }
          this.newEditSingleData.files = files
          this.$nextTick(() => {
            this.projectIdFn(data.projectId)   // 主动调一下
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取详情列表
    getRegisterOrderDetailsByIdFn () {
      let obj = {
        registerOrderId: Number(this.registerOrderId)
      }
      this.$api.assets.getRegisterOrderDetailsById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.$nextTick(() => {
            this.tableData = data
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
     // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.organId,
        projectName: ''
      }
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId,
              takeOver: item.takeOver
            })
          })
          this.projectIdData = [...arr]
          this.$nextTick(() => {
            this.projectIdFn(this.jupeProjectId)   // 主动调一下
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 平台字典获取变动类型
    platformDictFn () {
      let obj = {
        code: 'asset_type'
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetTypeData = [...data]
          let asset = []
          this.assetTypeData.forEach(item => {
            asset.push(item.value)
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产登记-详情明细统计
    getRegisterOrderDetailsStatisticsFn () {
      let obj = {
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderDetailsStatistics(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetsCount.forEach(item => {
            Object.keys(data).forEach(key => {
              if (item.code === key) {
                item.value = data[key]
              }
            })
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.organId = this.organIdData[0].value
    this.setType = this.$route.query.setType
  },
  mounted () {
    this.assetsCount = [{
      code: 'assetsNum',
      name: '资产数量',
      value: 0
    },
    {
      code: 'areaNum',
      name: '建筑面积',
      value: 0
    },
    {
      code: 'originalNum',
      name: '资产原值',
      value: 0
    },
    {
      code: 'marketValueNum',
      name: '市场价值',
      value: 0
    }]
    this.getObjectKeyValueByOrganIdFn()
    this.platformDictFn()
    this.queryBuildList(this.organId)
    if (this.setType === 'edit') {
      this.enitData = JSON.parse(this.$route.query.enitData)
      this.registerOrderId = this.enitData[0].registerOrderId
      this.editFn()
      this.getRegisterOrderDetailsByIdFn()
      this.getRegisterOrderDetailsStatisticsFn()
    }
  }
}
</script>
<style lang="less" scoped>
.newEditSingle {
  padding-bottom: 70px;
  .newEditSingle-nav {
    padding: 42px 106px 70px 94px;
  }
  .playground-row {
    margin-top: 28px;
  }
  .tab-nav {
    margin-top: 40px;
    .button-box {
      overflow: hidden;
      margin-bottom: 10px;
      .buytton-nav {
        float: right;
        .choice {
          margin: 0 10px;
        }
      }
    }
    .table-borders {
      border-top: 1px solid rgba(239,244,249,1);
      border-left: 1px solid rgba(239,244,249,1);
      border-right: 1px solid rgba(239,244,249,1);
    }
    .tab-exhibition {
      margin: 10px 0 16px 0;
      display: flex;
      height: 83px;
      .exhibition {
        flex: 1;
        color: #fff;
        text-align: center;
        border-right: 1px solid #EFF2F7;
        display: flex;
        align-items:center;
        justify-content:center;
        .exhibition-nav {
          align-items:center;
          justify-content:center;
          div:nth-of-type(1) {
            font-size: 12px;
          }
          div:nth-of-type(2) {
            padding-top: 10px;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
      .exhibition:nth-of-type(1){
        background-color: rgb(75, 210, 136);
      }
      .exhibition:nth-of-type(2){
        background-color: rgb(24, 144, 255);
      }
      .exhibition:nth-of-type(3){
        background-color: rgb(221, 129, 230);
      }
      .exhibition:nth-of-type(4){
        background-color: rgb(253, 116, 116);
      }
    }
  }
  .postAssignment-icon {
    cursor: pointer;
    color: #0084FF;
    // font-size: 18px;
  }
  .postAssignment-icon:hover {
    color: red;
  }
}
.modal-nav {
  line-height: 60px;
}
.ipt-file {
  display: none !important;
}
</style>

<style lang="scss">
.table-box {
  .ant-table-thead {
    font-size: 14px;
  }
  .ant-table-thead tr th {
    padding: 9px;
    background-color: #fff;
    color: #49505E;
  }
  .ant-table-tbody > tr > td {
    padding: 6px 9px;
  }
  .ant-table-tbody {
    tr:nth-child(even){
      background-color: #F9FBFD;
    }
  }
  table{
    table-layout:fixed;
    td{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    tr:hover{
      td{
        white-space: normal;
        overflow: auto;
        text-overflow: clip;
      }
    }
  }
}
</style>