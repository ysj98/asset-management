<!--
  新增: new
  编辑: edit
-->
<template>
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
              v-decorator="['saveRegisterOrder',
                {rules: [{required: true, max: 50, whitespace: true, message: '请输入登记单编号(不超过50字符)'}], initialValue: newEditSingleData.title}
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
          <a-col class="playground-col" :span="8">
            <a-form-item label="接管日期：" v-bind="formItemLayout">
              <a-date-picker
              :style="allWidth"
              placeholder="请选择接管日期"
              v-decorator="['createTime',
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
        <div class="button-box">
          <div class="buytton-nav">
            <SG-Button type="primary" weaken @click="downloadTemplate">下载模板</SG-Button>
            <SG-Button class="choice" type="primary" weaken @click="addTheAsset">导入资产清单</SG-Button>
            <SG-Button type="primary" weaken @click="addTheAsset">清空列表</SG-Button>
          </div>
        </div>
        <!-- table-layout-fixed -->
        <div class="table-border">
          <a-table
            :scroll="{y: 450, x: 2600}"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <template slot="operation" slot-scope="text, record">
              <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <FormFooter>
      <a-button type="primary" @click="save">提交</a-button>
      <a-button @click="cancel">取消</a-button>
    </FormFooter>
     <input class="ipt-file" ref="input" type="file" @change="importf($event.target.files, $event)" />
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
        楼栋名称：<a-select :maxTagCount="4" style="width: 300px" mode="multiple" placeholder="楼栋名称" v-model="buildIds"  @search="handleSearch">
          <a-select-option v-for="(item, index) in buildIdsData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <div class="modal-nav">
          <a-checkbox-group v-model="scope" @change="onChange">
            数据范围：<a-checkbox v-for="(item, index) in scopeData" :key="index" :value="item.value">{{item.name}}</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import AssetBundlePopover from '../../common/assetBundlePopover'
import FormFooter from '@/components/FormFooter'
import moment from 'moment'
import {columnsData} from './registerBasics'
import {debounce, utils} from '@/utils/utils'
const newEditSingleData = {
  saveRegisterOrder: '',   // 验收单名称
  assetType: undefined,     // 资产类型
  projectId: undefined,     // 资产项目
  createTime: {},       // 接管日期
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
export default {
  components: {AssetBundlePopover, FormFooter},
  props: {},
  data () {
    return {
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
    // 添加资产
    addTheAsset () {
      this.$refs.input.click()
    },
    importf (file, event) {
      this.$importf(file, event).then(v => {
        console.log(v, '拿到的数据')
        if (v.length > 0) {
          let arr = []
          let a = '使用期限(月)'
          let b = '已使用期数(月)'
          for (let i = 0; i < v.length; i++) {
            if (!v[i].资产名称) {
              this.$message.info('请填写资产名称')
              return
            } else if (!v[i].资产编码) {
              this.$message.info('请填写资产编码')
              return
            } else if (!v[i].权属情况) {
              this.$message.info('请填写权属情况')
              return
            } else if (!v[i].权证号) {
              this.$message.info('请填写权证号')
              return
            } else if (!v[i].装修情况) {
              this.$message.info('请填写装修情况')
              return
            } else if (!v[i].资产原值) {
              this.$message.info('请填写资产原值')
              return
            } else if (!v[i].市场价值) {
              this.$message.info('请填写市场价值')
              return
            } else if (!v[i].转运营日期) {
              this.$message.info('请填写转运营日期')
              return
            } else if (!v[i].转运营日期) {
              this.$message.info('请填写转运营日期')
              return
            } else if (!v[i].转运营面积) {
              this.$message.info('请填写转运营面积')
              return
            } else if (!v[i].闲置面积) {
              this.$message.info('请填写闲置面积')
              return
            } else if (!v[i].占用面积) {
              this.$message.info('请填写占用面积')
              return
            } else if (!v[i].其他面积) {
              this.$message.info('请填写其他面积')
              return
            } else if (!v[i].转物业面积) {
              this.$message.info('请填写转物业面积')
              return
            } else if (!v[i].转物业日期) {
              this.$message.info('请填写转物业日期')
              return
            } else if (!v[i][a]) {
              this.$message.info('请填写使用期限(月)')
              return
            } else if (!v[i].开始使用日期) {
              this.$message.info('请填写开始使用日期')
              return
            } else if (!v[i][b]) {
              this.$message.info('请填写已使用期数(月)')
              return
            }
            arr.push({
              key: i,
              type: v[i].类型,
              objectId: v[i].楼栋ID,
              buildId: v[i].对象ID,
              assetName: v[i].资产名称,
              buildingName: v[i].楼栋名称,
              houseName: v[i].房屋名称,
              assetCode: v[i].资产编码,
              coveredArea: v[i].建筑面积,
              seatingPosition: v[i].坐落位置,
              ownershipStatus: v[i].权属情况,
              warrantNbr: v[i].权证号,
              decorateSituation: v[i].装修情况,
              originalValue: v[i].资产原值,
              marketValue: v[i].市场价值,
              transferOperationTime: utils.xlsxDate(v[i].转运营日期),
              transferOperationArea: v[i].转运营面积,
              selfUserArea: v[i].闲置面积,
              occupationArea: v[i].自用面积,
              occupationArea: v[i].占用面积,
              otherArea: v[i].其他面积,
              transferArea: v[i].转物业面积,
              transferTime: utils.xlsxDate(v[i].转物业日期),
              validPeriod: utils.xlsxDate(v[i][a]),
              startDate: utils.xlsxDate(v[i].开始使用日期),
              usedDate: v[i][b]
            })
            this.tableData = arr
          }
        } else {
          this.$message.info('请填写数据后在上传')
        }
      })
    },
    // 下载模板
    downloadTemplate () {
      this.modalShow = true
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
      let obj = {
        assetType: this.checkboxAssetType,
        buildIds: this.buildIds.join(','),
        scope: this.scope.join(',')
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
    // 删除
    deleteFn (record) {
      this.tableData.forEach((item, index) => {
        if (item.assetCode === record.assetCode) {
          this.tableData.splice(index, 1)
        }
      })
      this.checkedData.forEach((item, index) => {
        if (record.assetCode === item) {
          this.checkedData.splice(index, 1)
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
            return {name: item.buildName, value: item.buildId}
          })
        }
      })
    },
    // 提交
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.tableData.length <= 0) {
            this.$message.info('请选择资产明细')
            return
          }
          let obj = {
            registerOrderId: '',                // 资产变动单Id（新增为空）
            saveRegisterOrder: values.saveRegisterOrder,                // 登记单编号
            projectId: values.projectId,                // 资产项目Id
            assetType: values.assetType,                // 资产类型Id
            remark: values.remark,                // 备注
            organId: values.organId,                // 组织机构id
            createTime: `${values.createTime.format('YYYY-MM-DD')}`,                // 接管日期
            assetHouseList: this.tableData
          }
          console.log(obj)
          // 编辑
          if (this.setType === 'edit') {
            this.$api.assets.updateRegisterOrder(obj).then(res => {
              if (Number(res.data.code) === 0) {
                console.log('提交成功')
              }
            }) 
          } else {
          // 新增
            this.$api.assets.saveRegisterOrder(obj).then(res => {
              if (Number(res.data.code) === 0) {
                console.log('编辑成功')
              }
            }) 
          }
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/asset-management/#/assetRegister'})
    },
    // 编辑获取接口
    editFn () {
      let obj = {
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.form.setFieldsValue({
            projectId: data.projectId,
            registerOrderCode: data.registerOrderCode,
            assetType: String(data.assetType),
            createTime: moment(data.createTime, 'YYYY-MM-DD'),
            remark: data.remark
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取详情
    getRegisterOrderDetailsByIdFn () {
      let obj = {
        registerOrderId: this.registerOrderId
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
              value: item.projectId
            })
          })
          this.projectIdData = [...arr]
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
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.organId = this.organIdData[0].value
    this.setType = this.$route.query.setType
  },
  mounted () {
    this.getObjectKeyValueByOrganIdFn()
    this.platformDictFn()
    this.queryBuildList('1300')
    if (this.setType === 'edit') {
      this.enitData = JSON.parse(this.$route.query.enitData)
      this.editFn()
      this.getRegisterOrderDetailsByIdFn()
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
