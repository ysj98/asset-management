<!--
 * @Author: LW
 * @Date: 2020-07-15 10:47:05
 * @LastEditTime: 2020-07-29 17:44:20
 * @Description: 价值信息
--> 
<template>
  <div class="valueToRegister">
    <div class="button-box">
      <div class="buytton-l">
        <span>资产总原值：{{statistics.originalValue || '0'}}元</span> <span class="p120">累计折旧总金额：{{statistics.depreciationAmount || '0'}}元</span>
      </div>
      <div class="buytton-nav" v-if="setType !== 'detail'">
        <SG-Button type="primary" weaken @click="downFn">批量导出</SG-Button>
        <SG-Button class="ml20" type="primary" weaken @click="addTheAsset">批量更新</SG-Button>
      </div>
    </div>
    <div class="table-borders" :class="{'overflowX': tableData.length === 0}">
      <a-table
        class="table-boxs"
        :columns="columns"
        :loading="loading"
        :scroll="{y: 450, x: 1900}"
        :dataSource="tableData"
        :pagination="false"
        >
        <template slot="operation" slot-scope="text, record">
          <div class="tab-opt">
            <span @click="editFn(record)">编辑</span>
          </div>
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        location="static"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <!-- 新增编辑 -->
    <valueToRegisterEdit @cancel="cancel" v-if="modalShow" ref="valueToRegisterEdit" @allQuery="allQuery"></valueToRegisterEdit>
    <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
  </div>
</template>

<script>
import {utils} from '@/utils/utils'
import {valueToRegisterData} from './../common/registerBasics'
import noDataTips from '@/components/noDataTips'
import valueToRegisterEdit from './../common/valueToRegisterEdit'
export default {
  components: {noDataTips, valueToRegisterEdit},
  props: {
    registerOrderId: [String, Number],
    assetType: [String, Number],
    organId: [String, Number]
  },
  data () {
    return {
      record: [],
      setType: '',
      fileType: ['xls', 'xlsx'],
      columns: [],
      tableData: [],
      count: '',            // 总页数
      loading: false,
      modalShow: false,
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        registerOrderId: '',   // 资产登记单Id
        assetType: ''          // 资产类型
      },
      statistics: {}          // 统计
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.queryCondition.registerOrderId = this.registerOrderId
    this.queryCondition.assetType = this.assetType
    this.queryCondition.organId = this.organId
    this.record = JSON.parse(this.$route.query.record)
    this.setType = this.$route.query.setType
    if (this.setType === 'detail') {
      let arr = []
      arr = utils.deepClone(valueToRegisterData)
      arr.pop()
      this.columns = arr
    } else {
      this.columns = valueToRegisterData
    }
    this.query()
    this.$textReplace()
  },
  methods: {
    allQuery () {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
      this.query()
    },
    // 编辑
    editFn (record) {
      this.modalShow = true
      this.$nextTick(() => {
        record.registerOrderId = this.queryCondition.registerOrderId
        this.$refs.valueToRegisterEdit.modalShow = true
        this.$refs.valueToRegisterEdit.getValueDetail(record)
      })
    },
    cancel () {
      this.modalShow = false
    },
    // 导入
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
      fileData.append('file', files[0])
      fileData.append('registerOrderId', this.queryCondition.registerOrderId)
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
      this.$api.assets.valueImport(this.formData).then(res => {
        if (res.data.code === '0') {
          e.target.value = ''
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('导入成功！')
            this.allQuery()
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
    // 导出
    downFn () {
      let obj = {
        registerOrderId: this.queryCondition.registerOrderId,      // 资产登记单
        assetType: this.queryCondition.assetType             // 资产类型
      }
      this.$api.assets.valueExport(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `价值信息.xls`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 查询
    query () {
      this.loading = true
      this.$api.assets.queryValuePageListByRgId(this.queryCondition).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.getValueStatistics()
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 统计
    getValueStatistics () {
      let obj = {
        registerOrderId: this.queryCondition.registerOrderId,      // 资产登记单
        assetType: this.queryCondition.assetType                   // 资产类型
      }
      this.$api.assets.getValueStatistics(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.statistics = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.valueToRegister{
  .button-box {
    overflow: hidden;
    margin-bottom: 15px;
    line-height: 40px;
    display: flex;
    .button-l {
      flex: 1;
      text-align: left;
    }
    .buytton-nav {
      flex: 1;
      text-align: right;
    }
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084FF;
      cursor: pointer;
    }
    .postAssignment-icon {
      color: red;
    }
  }
  .overflowX{
    /deep/ .ant-table-scroll {
      overflow-x: auto;
    }
    /deep/.ant-table-header {
      padding-bottom: 0px !important;
      margin-bottom: 0px !important;
    }
  }
}
</style>