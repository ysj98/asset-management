<!--
 * @Author: LW
 * @Date: 2020-07-15 14:50:50
 * @LastEditTime: 2020-07-17 11:46:34
 * @Description: 使用方向
--> 
<template>
  <div class="directionUse">
    <!--数据总览-->
    <overview-number :numList="numList"/>
    <div class="button-box" v-if="record[0].type !== 'detail'">
      <div class="buytton-nav">
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
        location="absolute"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <!-- 新增编辑 -->
    <directionUseEdit @cancel="cancel" v-if="modalShow" ref="directionUseEdit"></directionUseEdit>
    <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
  </div>
</template>

<script>
import {utils} from '@/utils/utils'
import {directionUseData} from './../common/registerBasics'
import noDataTips from '@/components/noDataTips'
import directionUseEdit from './../common/directionUseEdit'
import OverviewNumber from 'src/views/common/OverviewNumber'
export default {
  components: {noDataTips, directionUseEdit, OverviewNumber},
  props: {},
  data () {
    return {
      record: [],
      numList: [
        {title: '建筑面积(㎡)', key: 'buildArea', value: 0, fontColor: '#324057'},
        {title: '转物业面积(㎡)', key: 'transferArea', value: 0, bgColor: '#5b8ff9'},
        {title: '运营面积(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#4BD288'},
        {title: '自用面积(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6'},
        {title: '占用面积(㎡)', key: 'occupationArea', value: 0, bgColor: '#FD7474'},
        {title: '其他面积(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6'},
        {title: '闲置面积(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF'},
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
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
      }
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.record = JSON.parse(this.$route.query.record)
    if (this.record[0].type === 'detail') {
      let arr = []
      arr = utils.deepClone(directionUseData)
      arr.pop()
      this.columns = arr
    }
    this.query()
  },
  methods: {
    // 编辑
    editFn (record) {
      this.modalShow = true
      this.$nextTick(() => {
        this.$refs.directionUseEdit.getValueDetail(record)
        this.$refs.directionUseEdit.modalShow = true
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
      console.log(files)
      if (!files.length) { return }
      let fileData = new FormData()
      fileData.append('registerOrderModelFile', files[0])
      fileData.append('registerOrderId', this.registerOrderId)
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
      this.$api.assets.usrForImport(this.formData).then(res => {
        if (res.data.code === '0') {
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
    // 导出
    downFn () {
      let obj = {
        registerOrderId: '',      // 资产登记单
      }
      this.$api.grid.userForExport(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `附属配套.xls`
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
      this.tableData = [
        {
          assetType: '1', //类型：String  必有字段  备注：资产类型
          assetId: 'mock',                //类型：String  必有字段  备注：资产ID
          assetName: 'mock',                //类型：String  必有字段  备注：资产名称
          assetCode: 'mock',                //类型：String  必有字段  备注：资产编码
          objectType: 'mock',                //类型：String  必有字段  备注：资产分类
          objectTypeName: 'mock',                //类型：String  必有字段  备注：资产分类名称
          buildArea: 'mock',                //类型：String  必有字段  备注：建筑面积(㎡)
          transferTime: 'mock',                //类型：String  必有字段  备注：转物业时间
          transferArea: 'mock',                //类型：String  必有字段  备注：转物业面积(㎡
          transferOperationTime: 'mock',                //类型：String  必有字段  备注：转运营时间
          transferOperationArea: 'mock',                //类型：String  必有字段  备注：运营面积(㎡)
          selfUserArea: 'mock',                //类型：String  必有字段  备注：自用面积(㎡)
          idleArea: 'mock',                //类型：String  必有字段  备注：闲置面积(㎡)
          occupationArea: 'mock',                //类型：String  必有字段  备注：占用面积(㎡)
          otherArea: 'mock'                //类型：String  必有字段  备注：其他面积(㎡)
      }
      ]
      this.loading = false
      this.$api.assets.userForList(this.queryCondition).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.useForSummary()
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 统计
    useForSummary () {
      let obj = {
        registerOrderId: '',      // 资产登记单
        assetType: ''             // 资产类型
      }
      this.$api.assets.useForSummary(obj).then(res => {
        if (Number(res.data.code) === 0) {
          return this.numList = this.numList.map(m => {
            return { ...m, value: res.data[m.key] || 0 }
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.directionUse{
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