<!--
 * @Author: Lw
 * @Date: 2019-12-25 15:07:07
 * @LastEditTime: 2020-09-09 15:15:04
 * @LastEditors: Please set LastEditors
 * @Description: 盘点执行登记/详情
 * @FilePath: \asset-management\src\views\inventoryManagement\inventoryPerform\detail.vue
 -->

<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">盘点单号：{{particularsData.checkId || '--'}}</a-col>
          <a-col class="playground-col" :span="8">盘点单名称：{{particularsData.checkName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属任务：{{particularsData.taskName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">盘点人：{{particularsData.userNames || '--'}}</a-col>
          <a-col class="playground-col" :span="8">计划执行时间：{{particularsData.endDate ? `${particularsData.beginDate} - ${particularsData.endDate}` : '--'}}</a-col>
          <a-col class="playground-col" :span="8">状态：{{particularsData.checkStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">实际执行时间：{{particularsData.completeDate || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">盘点资产清单（资产总数:{{inventoryAssetCount || 0}}；已盘点:{{inventoryCheckCount || 0}}; 未盘点:{{inventoryNoCheckCount || 0}})</span>
      <div class="particulars-obj">
      <Cephalosome style="margin: 0" :rightCol="18" :leftCol="6">
        <div slot="col-l">
          <SG-Button v-power="ASSET_MANAGEMENT.ASSET_EXECUTE_LISTASSETS" type="primary" style="margin-right: 10px" weaken @click="downloadTemplateFn('0')">导出资产清单</SG-Button>
          <SG-Button v-if="changeType === 'set'" type="primary" @click="importExcelFn()" weaken>导入盘点结果</SG-Button>
        </div>
        <div slot="col-r" class="nav">
          <a-select style="width: 170px; margin-right: 10px;" placeholder="全部状态" @change="checkStatusChange" :tokenSeparators="[',']" v-model="queryCondition.checkStatus">
            <a-select-option :title="item.name" v-for="(item, index) in checkStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search style="width: 170px;" v-model="queryCondition.name" placeholder="资产名称/编码" :maxLength="30" @search="onSearch" />
        </div>
      </Cephalosome>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <template slot="operation" slot-scope="text, record">
              <div v-if="changeType === 'set'">
                <span v-if="+record.checkStatus === 0" @click="operationFn('new', record)" class="btn_click">登记结果</span>
                <span v-if="+record.checkStatus === 1" @click="operationFn('set', record)" class="btn_click">编辑</span>
              </div>
              <div v-else>
                <span @click="viewDetails(record)" class="btn_click">详情</span>
              </div>
            </template>
          </a-table>
          <no-data-tips v-show="tableData.length === 0"></no-data-tips>
          <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="inventoryTotalCount"
            v-model="queryCondition.pageNum"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">盘点异常列表（异常总数:{{exceptionCount || 0}}；盘亏:{{failCount || 0}}; 盘盈:{{successCount || 0}}; 信息有误:{{errorCount || 0}})</span>
      <div class="particulars-obj">
      <Cephalosome style="margin: 0" :rightCol="18" :leftCol="6">
        <div slot="col-l">
          <SG-Button v-if="changeType === 'set'" type="primary" style="margin-right: 10px" weaken @click="registerAssetsFn">登记盘盈资产</SG-Button>
          <SG-Button v-power="ASSET_MANAGEMENT.ASSET_EXECUTE_EXCEPTION" type="primary" @click="downloadTemplateFn('1')" weaken>导出异常信息</SG-Button>
        </div>
        <div slot="col-r">
          <div class="nav">
            <a-select style="width: 160px;" placeholder="全部异常状态" @change="checkResultsChange" v-model="condition.checkResults">
              <a-select-option :title="item.name" v-for="(item, index) in checkResultsData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
          </div>
        </div>
      </Cephalosome>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="tableLoading"
            :columns="exceptionListColumns"
            :dataSource="tableDataList"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <template slot="operation" slot-scope="text, record">
              <div v-if="changeType === 'set'">
                <span v-if="+record.checkResult === 3" @click="assetsFn('detail', record)" class="btn_click mr15">删除</span>
                <span @click="assetsFn('set', record)" class="btn_click">编辑</span>
              </div>
              <div v-else>
                <span @click="viewDetails(record)" class="btn_click">详情</span>
              </div>
            </template>
          </a-table>
          <no-data-tips v-show="tableDataList.length === 0"></no-data-tips>
          <SG-FooterPagination
            :pageLength="condition.pageSize"
            :totalCount="iexceptionCount"
            v-model="condition.pageNum"
            @change="exceptionHandleChange"
          />
        </div>
      </div>
    </div>
    <div class="particulars-nav" v-if="changeType === 'set'">
      <span class="section-title blue">盘点结果说明</span>
      <div class="particulars-obj" style="line-height: 64px; padding: 20px 0 30px 0">
        <span class="required-color">盘点结果：</span><a-textarea placeholder="请输入盘点结果说明"
            :autosize="{ minRows: 3, maxRows: 3 }"
            style="width: 93%;"
            :maxLength="200"
            v-model="checkDetail"
            />
      </div>
    </div>
    <FormFooter v-if="changeType === 'set'" style="border:none;" location="fixed">
      <div>
        <SG-Button style="margin-left: 12px" type="primary" @click="save">提交盘点单</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
    <!-- 登记结果 -->
    <inventoryResultRegistration v-if="newShow" ref="irr" @showFn="showFn" @successQuery="successQueryFn"></inventoryResultRegistration>
    <!-- 登记盘盈资产 -->
    <assetsInventorySurplus v-if="assetsShow" ref="ats" @showFn="showFn" @successQuery="assetsSuccessQueryFn"></assetsInventorySurplus>
    <!-- 盘点结果详情 -->
    <viewDetails ref="vd" ></viewDetails>
    <!-- 导入按钮 -->
    <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
  </div>
</template>

<script>
import {register, exceptionList, checkStatusData, checkResultsData} from './basics'
import {utils} from '@/utils/utils.js'
import Cephalosome from '@/components/Cephalosome'
import noDataTips from "@/components/noDataTips"
import FormFooter from '@/components/FormFooter'
import inventoryResultRegistration from './inventoryResultRegistration'
import assetsInventorySurplus from './assetsInventorySurplus'
import viewDetails from './viewDetails'
import {ASSET_MANAGEMENT} from '@/config/config.power'

export default {
  components: {Cephalosome, noDataTips, FormFooter, inventoryResultRegistration, assetsInventorySurplus, viewDetails},
  props: {},
  data () {
    return {
      ASSET_MANAGEMENT,
      organId: '',
      fileType: ['xls', 'xlsx'],
      formData: null,
      routeData: '',
      newShow: false,
      assetsShow: false,
      taskId: '',                  // 任务id
      checkDetail: '',                  // 盘点结果说明
      inventoryAssetCount: '',     // 资产总数
      inventoryCheckCount: '',     // 已盘点
      inventoryNoCheckCount: '',   // 未盘点
      inventoryTotalCount: '',     // 资产列表分页
      exceptionCount: '',          // 异常总数
      errorCount: '',              // 信息错误总数
      failCount: '',               // 盈亏总数
      successCount: '',            // 盘盈总数
      iexceptionCount: '',         // 异常分页分页总数
      checkStatusData: [...checkStatusData],
      checkResultsData: [...checkResultsData],
      changeType: '',
      checkId: '',
      particularsData: {},
      columns: [...register],                 // 资产清单列表表头
      exceptionListColumns: [...exceptionList],    // 异常列表表头
      loading: false,
      tableLoading: false,
      tableData: [],
      tableDataList: [],
      location: '',
      queryCondition: {     // 资产清单搜索条件
        checkStatus: '',    // 盘点状态
        name: '',           // 名称
        pageSize: 10,
        pageNum: 1
      },
      condition: {          // 异常列表搜索条件
        checkResults: '0,2,3',   // 状态
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  computed: {
  },
  methods: {
    // 取消
    cancel () {
      this.$router.push({path: '/inventoryManagement/inventoryPerform'})
    },
    // 资产清单编辑或新增
    successQueryFn () {
      this.queryCondition.pageNum = 1
      // this.queryCondition.pageSize = 10
      this.assetCheckInstAsseDetail()
      this.exceptionTypes()  // 异常列表
    },
    // 登记盘盈资产新增编辑
    assetsSuccessQueryFn () {
      this.queryCondition.pageNum = 1
      // this.queryCondition.pageSize = 10
      this.exceptionTypes()
    },
    showFn (val) {
      this.newShow = val
      this.assetsShow = val
    },
    // 查询基本信息详情
    query () {
      let obj = {
        checkId: this.checkId  // 盘点单id
      }
      this.$api.inventoryManagementApi.assetCheckInstDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data
          this.taskId = this.particularsData.taskId
          this.organId = this.particularsData.organId
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 盘点资产清单列表
    assetCheckInstAsseDetail () {
      let obj = {
        taskId: '',
        checkId: this.checkId,            // 盘点id
        name: this.queryCondition.name,                  // 资源名称/编码
        checkResults: '0,1,2',                                // 盘点结果可多选(0盘亏 1正常 2信息有误 3盘盈)
        checkStatus: this.queryCondition.checkStatus,    // 盘点状态(0-未盘点 1-已盘点)
        pageSize: this.queryCondition.pageSize,
        pageNum: this.queryCondition.pageNum
      }
      this.loading = true
      this.$api.inventoryManagementApi.assetCheckInstAsseDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          this.inventoryAssetCount = res.data.data.assetCount      // 资产总数
          this.inventoryCheckCount = res.data.data.checkCount      // 已盘点
          this.inventoryNoCheckCount = res.data.data.noCheckCount  // 未盘点
          this.inventoryTotalCount = res.data.data.count           // 分页总数
          this.tableData = data.map((item, index) => {
            item.key = index
            return item
          })
          this.loading = false
        } else {
          this.loading = false
          this.$message.error(res.data.message)
        }
      })
    },
    // 监听选择状态调资产清单列表
    checkStatusChange () {
      this.queryCondition.pageNum = 1
      this.assetCheckInstAsseDetail()
    },
    // 盘点资产清单搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.assetCheckInstAsseDetail()
    },
    // 资产清单分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.assetCheckInstAsseDetail()
    },
    // 监听异常选择状态调异常类别
    checkResultsChange () {
      this.condition.pageNum = 1
      this.exceptionTypes()
    },
    exceptionHandleChange (data) {
      this.condition.pageNum = data.pageNo
      this.condition.pageSize = data.pageLength
      this.exceptionTypes()
    },
    // 异常列表
    exceptionTypes () {
      let obj = {
        taskId: '',
        checkId: this.checkId, // 盘点id
        name: '',              // 资源名称/编码
        checkResults: this.condition.checkResults,  // 盘点结果可多选(0盘亏 2信息有误 3盘盈)
        checkStatus: '',       // 盘点状态(0-未盘点 1-已盘点)
        pageSize: this.condition.pageSize,
        pageNum: this.condition.pageNum
      }
      this.tableLoading = true
      this.$api.inventoryManagementApi.assetCheckInstAsseDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          this.exceptionCount = res.data.data.exceptionCount  // 异常总数
          this.errorCount = res.data.data.errorCount          // 信息错误总数
          this.failCount = res.data.data.failCount            // 盈亏总数
          this.successCount = res.data.data.successCount      // 盘盈总数
          this.iexceptionCount = res.data.data.count          // 分页总数
          this.tableDataList = data.map((item, index) => {
            item.key = index
            return item
          })
          this.tableLoading = false
        } else {
          this.tableLoading = false
          this.$message.error(res.data.message)
        }
      })
    },
    // 提交盘点单
    save () {
      if (!this.checkDetail) {
        this.$message.info('请输入盘点结果')
        return
      }
      let _this = this
      _this.$confirm({
        title: '提示',
        content: +this.inventoryNoCheckCount !== 0 ? `存在${this.inventoryNoCheckCount}个未盘点的资产，提交后将不能再修改了，确认要提交该盘点单吗？` : '提交后将不能再修改了，确认要提交该盘点单吗？',
        onOk() {
          _this.assetCheckInstCheckExe()
        }
      })
    },
    assetCheckInstCheckExe () {
      let obj = {
        checkId: this.checkId,  // 盘点单id
        checkDetail: this.checkDetail
      }
      let loadingName = this.SG_Loding('保存中...')
      this.$api.inventoryManagementApi.assetCheckInstCheckExe(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('提交成功')
            this.$router.push({path: '/inventoryManagement/inventoryPerform', query: {refresh: true}})
          })
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$message.error(res.data.message)
          })
        }
      })
    },
    // 资产清单盘点结果登记/编辑
    operationFn (str, record) {
      this.newShow = true
      this.$nextTick(() => {
        this.$refs.irr.show = true
        this.$refs.irr.query(str, record.resultId, this.checkId, this.taskId, record.assetId)
      })
    },
    // 异常编辑和删除
    assetsFn (str, record) {
      this.newShow = true
      if (str === 'set') {
        if (+record.checkResult === 3) {
          this.assetsShow = true
          this.$nextTick(() => {
            this.$refs.ats.show = true
            this.$refs.ats.query(str, record.resultId, this.checkId, this.taskId, record.assetId, this.organId)
          })
        } else {
          this.newShow = true
          this.$nextTick(() => {
            this.$refs.irr.show = true
            this.$refs.irr.query(str, record.resultId, this.checkId, this.taskId, record.assetId)
          })
        }
      } else if (str === 'detail') {
        let _this = this
        _this.$confirm({
          title: '提示',
          content: '确认要删除该盘盈资产吗',
          onOk() {
            let obj = {
              resultId: record.resultId,  // 盘点单id
              checkResult: '3'
            }
            _this.$api.inventoryManagementApi.assetCheckInstDeleteByCheckResult(obj).then(res => {
              if (Number(res.data.code) === 0) {
                _this.$message.info(res.data.message)
                _this.exceptionTypes()
              } else {
                _this.$message.error(res.data.message)
              }
            })
          }
        })
      }
    },
    // 盘盈新增
    registerAssetsFn () {
      this.assetsShow = true
      this.$nextTick(() => {
        this.$refs.ats.show = true
        this.$refs.ats.newFn('new', '', this.checkId, this.taskId, this.organId)
      })
    },
    // 详情状态下查看盘点详情
    viewDetails (record) {
      this.$refs.vd.show = true
      this.$refs.vd.query(record.resultId, this.checkId, this.taskId, record.assetId)
    },
    // 导出
    downloadTemplateFn (str) {
      let obj = {
        checkId: this.checkId,
        type: str
      }
      this.$api.inventoryManagementApi.downloadTemplate(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${str === '0' ? '盘点资产清单' : '盘点异常清单'}.xls`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 导入
    importExcelFn () {
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
      fileData.append('file', files[0])
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
      this.$api.inventoryManagementApi.importExcel(this.formData).then(res => {
        if (res.data.code === '0') {
          e.target.value = ''
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('导入成功！')
            this.assetCheckInstAsseDetail()
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
    }
  },
  created () {
  },
  mounted () {
    this.routeData = JSON.parse(this.$route.query.quersData)
    // console.log(this.routeData, '0909090')
    this.checkId = this.routeData[0].checkId
    this.changeType = this.routeData[0].type
    this.query()
    this.assetCheckInstAsseDetail()   // 资产清单
    this.exceptionTypes()  // 异常列表
  }
}
</script>
<style lang="less" scoped>
.particulars {
  padding-bottom: 70px;
  .particulars-nav{
      padding: 42px 126px 0 70px;
      .particulars-obj {
        padding: 0 0 10px 40px;
        .playground-row {
          .playground-col {
            line-height: 40px;
            font-size: 12px;
          }
        }
      }
      .particulars-obj:nth-of-type(1) {
        padding-top: 10px;
      }
      .correspondingTask {
        margin:35px 40px 0 40px;
        border: 1px solid #F0F2F5;
      }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
  .required-color:before {
    display: inline-block;
    margin-right: 4px;
    content: '*';
    font-family: SimSun;
    line-height: 1;
    font-size: 12px;
    color: #f5222d;
  }
  .nav{
    line-height: 67px;
  }
}
</style>
