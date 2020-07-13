<!--
 * @Author: LW
 * @Date: 2020-07-10 16:50:51
 * @LastEditTime: 2020-07-13 13:42:34
 * @Description: 房屋
--> 
<template>
  <div class="sg-child-house">
    <!--数据总览-->
    <overview-number :numList="numList"/>
    <div class="button-box">
      <div class="buytton-nav">
        <SG-Button type="primary" weaken @click="downloadTemplate">下载模板</SG-Button>
        <SG-Button class="choice" type="primary" weaken @click="addTheAsset">导入资产清单</SG-Button>
        <SG-Button type="primary" weaken @click="emptyFn">清空列表</SG-Button>
      </div>
    </div>
    <div class="table-borders">
      <a-table
        class="table-boxs"
        :scroll="{y: 450, x: 2700}"
        :columns="columns"
        :dataSource="tableData"
        :pagination="false"
        >
        <template slot="operation" slot-scope="text, record">
          <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    </div>
    <basicDownload ref="basicDownload"></basicDownload>
    <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
  </div>
</template>

<script>
import {utils, calc} from '@/utils/utils'
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
import {columnsData, judgmentData, landData} from './../common/registerBasics'
import basicDownload from './../common/basicDownload'
import bridge from './center'
export default {
  components: {OverviewNumber, noDataTips, basicDownload},
  props: {
    organId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      numList: [
        {title: '资产数量', key: 'assetsNum', value: 0, fontColor: '#324057'},
        {title: '建筑面积(㎡)', key: 'areaNum', value: 0, bgColor: '#FD7474'},
        {title: '债权(元)', key: 'debtAmount', value: 0, bgColor: '#1890FF'},
        {title: '债务(元)', key: 'depreciationAmount', value: 0, bgColor: '#DD81E6'}
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      tableData: [],    // 表格内容
      columns: [],      // 表格表头
      assetType: '',    // 资产类型
    }
  },
  computed: {
  },
  created () {
    this.bridgeFn()
  },
  mounted () {
  },
  methods: {
    // 切换资产类型时！切换所有数据
    bridgeFn:function(){
      bridge.$on("assetType",(val, type)=>{
        //val值    type：project项目  asset资产类型
        console.log(val, type, '切换资产类型时！切换所有数据231232')
        // 房屋
        if (type === 'asset' && val === '1') {
          this.assetType = '1'
          this.tableData = []
          this.columns = columnsData
        // 土地
        } else if (type === 'asset' && val === '2') {
          this.assetType = '2'
          this.tableData = []
          this.columns = landData
        }
        if (type === 'project' && val) {
          this.tableData = []
        }
      })
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
                    this.$message.info(`请输入正确${judgmentData[j].title}(只支持2位小数)`)
                  })
                  return
                }
              }
              // 判断只能为数字小数
              if (judgmentData[j].type === 'float2') {
                if (arrData[i][judgmentData[j].dataIndex] && !(/^(\d{1,10}|\d{1,8}\.\d{1,4})$/).test(arrData[i][judgmentData[j].dataIndex])) {
                  this.DE_Loding(loadingName).then(() => {
                    this.$message.info(`请输入正确${judgmentData[j].title}(只支持4位小数)`)
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
            this.numList[1].value = calc.add(this.numList[1].value, arrData[i].area || 0)
            this.numList[2].value = calc.add(this.numList[2].value, arrData[i].originalValue || 0)
            this.numList[3].value = calc.add(this.numList[3].value, arrData[i].marketValue || 0)
          }
          this.numList[0].value = arrData.length
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
    // 添加资产
    addTheAsset () {
      this.$refs.fileUpload.click()
    },
    // 下载模板
    downloadTemplate () {
      this.$refs.basicDownload.typesQueries(this.organId, this.assetType)
      this.$refs.basicDownload.modalShow = true
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
        content: str === 'delete' ? '确认要删除该资产登记单吗？' : '确认要清空资产列表？',
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
  }
}
</script>
<style lang="less" scoped>
.sg-child-house {
  .button-box {
    overflow: hidden;
    margin-bottom: 10px;
    margin-top: 20px;
    .buytton-nav {
      float: right;
      .choice {
        margin: 0 10px;
      }
    }
  }
  .table-borders {
    border: 1px solid rgba(239,244,249,1)
  }
}
</style>

<style lang="less">
.table-boxs {
  .ant-table-placeholder {
    display: none;
  }
  .ant-table-thead {
    font-size: 14px;
  }
  .ant-table-thead tr th {
    padding: 9px;
    background-color: #fff;
    color: #49505E;
  }
  .ant-table-tbody > tr > td {
    padding: 9px 9px;
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

<style lang="less">
.newEditSingle {
  .ant-form-item-label label:after {
    margin: 0 0 0 2px;
  }
}
</style>

