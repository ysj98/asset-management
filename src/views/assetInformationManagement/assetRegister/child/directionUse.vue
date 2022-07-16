<!--
 * @Author: LW
 * @Date: 2020-07-15 14:50:50
 * @LastEditTime: 2022-07-15 14:44:07
 * @Description: 使用方向
-->
<template>
  <div class="directionUse">
    <!--数据总览-->
    <overview-number :numList="numList"/>
    <div class="button-box" v-if="setType !== 'detail'">
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
        location="static"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <!-- 新增编辑 -->
    <directionUseEdit
      :is-equipment="isEquipment"
      @cancel="cancel"
      v-if="modalShow"
      ref="directionUseEdit"
      @allQuery="allQuery"
    >
    </directionUseEdit>
    <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
  </div>
</template>

<script>
import {utils} from '@/utils/utils'
import { directionUseData, directionEquipment} from './../common/registerBasics'
import noDataTips from '@/components/noDataTips'
import directionUseEdit from './../common/directionUseEdit'
import OverviewNumber from 'src/views/common/OverviewNumber'
const numList = [
  {title: '建筑面积(㎡)', key: 'buildArea', value: 0, fontColor: '#324057', code: '1000', isAble: 'Y'},
  {title: '转物业面积(㎡)', key: 'transferArea', value: 0, bgColor: '#5b8ff9', code: '1000', isAble: 'Y'},
  {title: '运营面积(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#4BD288', code: '1001', isAble: 'Y'},
  {title: '自用面积(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6', code: '1003', isAble: 'Y'},
  {title: '占用面积(㎡)', key: 'occupationArea', value: 0, bgColor: '#FD7474', code: '1004', isAble: 'Y'},
  {title: '其他面积(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6', code: '1005', isAble: 'Y'},
  {title: '闲置面积(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF', code: '1002', isAble: 'Y'},
]
const numListEquipment = [
  {title: '资产数量', key: 'assetNum', value: 0, fontColor: '#324057'},
  {title: '运营数量', key: 'operateNum', value: 0, bgColor: '#4BD288'},
  {title: '自用数量', key: 'selfUseNum', value: 0, bgColor: '#DD81E6'},
  {title: '占用数量', key: 'occupationNum', value: 0, bgColor: '#FD7474'},
  {title: '其他数量', key: 'otherNum', value: 0, bgColor: '#BBC8D6'},
  {title: '闲置数量', key: 'idleNum', value: 0, bgColor: '#1890FF'},
]
export default {
  name:'DirectionUse',
  components: {noDataTips, directionUseEdit, OverviewNumber},
  props: {
    registerOrderId: [String, Number],
    assetType: [String, Number],
    organId: [String, Number]
  },
  data () {
    return {
      record: [],
      setType: '',
      numList: numList, // 概览数字数据, title 标题，value 数值，bgColor 背景色
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
    isEquipment(){
      return String(this.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
      // return true
    },
    directionUseDataCom(){
      return this.isEquipment ? directionEquipment : directionUseData
    },
  },
  created () {
  },
  mounted () {
    if (this.isEquipment){
      this.numList = numListEquipment
    }
    this.queryCondition.registerOrderId = this.registerOrderId
    this.queryCondition.assetType = this.assetType
    this.record = JSON.parse(this.$route.query.record)
    this.setType = this.$route.query.setType
    if (this.setType === 'detail') {
      let arr = []
      arr = utils.deepClone(this.directionUseDataCom)
      arr.pop()
      this.columns = arr
    } else {
      this.columns = this.directionUseDataCom
    }
    this.query()
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
      fileData.append('file', files[0])
      fileData.append('registerOrderId', this.registerOrderId)
      fileData.append('assetType',Number(this.assetType))
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
        this.DE_Loding(loadingName).then(() => {
          this.$SG_Message.error('导入失败！')
        })
      })
    },
    // 导出
    downFn () {
      let obj = {
        registerOrderId: this.registerOrderId,      // 资产登记单
      }
      this.$api.assets.userForExport(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `资产使用方向.xls`
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
      this.$api.assets.userForList(this.queryCondition).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.useForSummary()
          this.useForConfig()
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 配置
    useForConfig () {
      this.$api.houseStatusConfig.querySettingByOrganId({organId: this.organId}).then(res => {
      if (res.data.code == 0) {
        let data = res.data.data
        data.map(item => {
          this.numList.map((e) => {
            if(item.code == e.code){
              e.bgColor = item.color
              e.isAble = item.isAble
              e.title = item.alias || e.title
            }
          })
        })
        this.numList = this.numList.filter((i) => {
            return i.isAble === 'Y'
        })
      } else {
        this.$message.error(res.message || '系统内部错误')
      }
     })
    },
    // 统计
    useForSummary () {
      let obj = {
        registerOrderId: this.queryCondition.registerOrderId,      // 资产登记单
        assetType: this.queryCondition.assetType             // 资产类型
      }
      this.$api.assets.useForSummary(obj).then(res => {
        if (Number(res.data.code) === 0) {
          res.data.data.assetNum = this.count
          return this.numList = this.numList.map(m => {
            return { ...m, value: res.data.data[m.key] || 0 }
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
