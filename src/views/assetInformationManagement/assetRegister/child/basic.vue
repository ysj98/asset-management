<!--
 * @Author: LW
 * @Date: 2020-07-10 16:50:51
 * @LastEditTime: 2020-08-10 15:25:15
 * @Description: 房屋土地
--> 
<template>
  <div class="sg-child-house">
    <!--数据总览-->
    <overview-number :numList="numList"/>
    <div class="button-box">
      <div class="buytton-nav" v-show="setType === 'new' && !registerOrderId">
        <SG-Button type="primary" weaken @click="downloadTemplate">下载模板</SG-Button>
        <SG-Button class="choice" type="primary" weaken @click="addTheAsset">导入资产清单</SG-Button>
        <SG-Button type="primary" weaken @click="emptyFn">清空列表</SG-Button>
      </div>
      <div class="buytton-nav" v-show="setType === 'edit' && registerOrderId || setType === 'new' && registerOrderId">
        <SG-Button type="primary" weaken @click="downFn">批量导出</SG-Button>
        <SG-Button class="ml20" type="primary" weaken @click="batchUpdate">批量更新</SG-Button>
      </div>
    </div>
    <div class="table-borders" :class="{'overflowX': tableData.length === 0}">
      <a-table
        class="table-boxs"
        :scroll="{y: 450, x: 2300}"
        :columns="columns"
        :dataSource="tableData"
        :pagination="false"
        >
        <template slot="operation" slot-scope="text, record">
          <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        v-show="setType === 'edit' && registerOrderId || setType === 'new' && registerOrderId"
        :pageLength="footer.pageSize"
        :totalCount="count"
        location="static"
        :noPageTools="false"
        v-model="footer.pageNum"
        @change="handleChange"
      />
    </div>
    <basicDownload ref="basicDownload"></basicDownload>
    <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
    <input ref="batchUpload" @change="batchUploadFn($event.target.files, $event)" type="file" style="display:none">
  </div>
</template>

<script>
import {utils, calc} from '@/utils/utils'
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
import {columnsData, judgmentData, landData, landCheck} from './../common/registerBasics'
import basicDownload from './../common/basicDownload'
import bridge from './center'
let getUuid = (() => {
  let uuid = 1
  return () => {
    return ++uuid
  }
})()
export default {
  components: {OverviewNumber, noDataTips, basicDownload},
  props: {
    organId: {
      type: [String, Number],
      default: ''
    },
    registerOrderId: {
      type: [String, Number],
      default: ''
    },
    assetTypeId: {
      type: [String, Number],
      default: '' 
    }
  },
  data () {
    return {
      keyUuid: getUuid(),
      count: '',
      footer: {
        pageNum: 1,
        pageSize: 10
      },
      basicData: [],
      organDictData: {},     // 权属情况
      ownershipData: {},     // 权属类型
      fileType: ['xls', 'xlsx'],
      setType: '',
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
  },
  mounted () {
    this.record = JSON.parse(this.$route.query.record)
    this.setType = this.$route.query.setType
    this.assetType = String(this.assetTypeId)
    // 编辑和详情进来的判断
    if (this.setType === 'detail' || this.setType === 'edit') {
      let arr = []
      this.assetType = String(this.record[0].assetType)
      if (+this.record[0].assetType === 1) {                    // 房屋表头
        arr = utils.deepClone(columnsData)
      } else if (+this.record[0].assetType === 4) {             // 土地表头
        arr = utils.deepClone(landData)
      }
      if (this.setType === 'detail') { arr.pop()}
      this.columns = arr
      this.query()
    } else {
      this.bridgeFn()
    }
    this.organDict()
    this.ownershipFn()
  },
  methods: {
    // 分页查询添加后和详情使用
    handleChange (data) {
      this.footer.pageNum = data.pageNo
      this.footer.pageSize = data.pageLength
      this.query()
    },
    allQuery () {
      this.footer.pageNum = 1
      this.footer.pageSize = 10
      this.query()
    },
    // 查询详情
    query (val) {
      if (val === 'sub') {
        this.footer.pageNum = 1
        this.footer.pageSize = 10
      }
      this.loading = true
      let obj = {
        pageNum: this.footer.pageNum,
        pageSize: this.footer.pageSize,
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderDetailsPageById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = []
          if (+this.assetType === 1) {
            data = res.data.data.data.assetHoseList
          } else {
            data = res.data.data.data.assetLandList
          }
          if (data && data.length) {
            data.forEach((item, index) => {
              item.key = index
            }) 
          }
          if (this.columns[0].dataIndex !== 'assetId') {
            this.columns.unshift({title: '资产ID', dataIndex: 'assetId', width: 150})
          }
          this.tableData = data || []
          this.count = res.data.data.count
          this.getRegisterOrderDetailsStatisticsFn()
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
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
          if (this.assetType === '4') {
            this.numList[1].title = '土地面积'
          }
          return this.numList = this.numList.map(m => {
            return { ...m, value: data[m.key] || 0 }
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 切换资产类型时！切换所有数据
    bridgeFn:function(){
      bridge.$on("assetType",(val, type)=>{
        //val值    type：project项目  asset资产类型
        // 房屋
        if (type === 'asset' && val === '1') {
          this.assetType = '1'
          this.tableData = []
          this.columns = columnsData
          this.numList[1].title = '建筑面积'
        // 土地
        } else if (type === 'asset' && val === '4') {
          this.assetType = '4'
          this.tableData = []
          this.columns = landData
          this.numList[1].title = '土地面积'
        }
        // 项目切换
        if (type === 'project' && val) {
          this.tableData = []
        }
        // 切换总的统计数据的值为0
        if (!type && this.tableData.length === 0) {
          this.numList.forEach(item => {
            item.value = 0
          })
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
      console.log(files)
      if (!files.length) { return }
      let fileData = new FormData()
      fileData.append('registerOrderModelFile', files[0])
      fileData.append('assetType', this.assetType)
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
          let resData = [], arrData =[], publicData = []
          if (this.assetType === '1') {
            arrData = res.data.data.assetHouseList
            publicData = judgmentData
          } else if (this.assetType === '4') {
            arrData =  res.data.data.assetBlankList
            publicData = landCheck
          }
          // 遍历判断必填有字段
          for (let i = 0; i < arrData.length; i++) {
            for (let j = 0; j < publicData.length; j++) {
             // 必填字段
              if (publicData[j].required) {
                if (!arrData[i][publicData[j].dataIndex]) {
                  this.DE_Loding(loadingName).then(() => { this.$message.info(`请输入${publicData[j].title}`)})
                  return
                }
              }
              // 判断只能为数字2小数
              if (publicData[j].type === 'float') {
                if (arrData[i][publicData[j].dataIndex] && !(/^(\d{1,10}|\d{1,8}\.\d{1,2})$/).test(arrData[i][publicData[j].dataIndex])) {
                  this.DE_Loding(loadingName).then(() => {this.$message.info(`请输入正确${publicData[j].title}(只支持2位小数)`)})
                  return
                }
              }
              // 判断只能为数字4小数
              if (publicData[j].type === 'float4') {
                if (arrData[i][publicData[j].dataIndex] && !(/^(\d{1,10}|\d{1,8}\.\d{1,4})$/).test(arrData[i][publicData[j].dataIndex])) {
                  this.DE_Loding(loadingName).then(() => {this.$message.info(`请输入正确${publicData[j].title}(只支持4位小数)`)})
                  return
                }
              }
              // 判断只能为整数
              if (publicData[j].type === 'number') {
                if (arrData[i][publicData[j].dataIndex] && !(/^\d{1,11}$/).test(Number(arrData[i][publicData[j].dataIndex]))) {
                  this.DE_Loding(loadingName).then(() => {this.$message.info(`请输入正确${publicData[j].title}`)})
                  return
                }
              }
              // 判断不超过多少字符
              if (publicData[j].fontLength) {
                if (arrData[i][publicData[j].dataIndex] && String(arrData[i][publicData[j].dataIndex]).length > publicData[j].fontLength) {
                  this.DE_Loding(loadingName).then(() => {this.$message.info(`${publicData[j].title}不超过${publicData[j].fontLength}字符`)})
                  return
                }
              }
              // 判断时间转换
              if (publicData[j].date) {
                if (arrData[i][publicData[j].dataIndex]) {
                  arrData[i][publicData[j].dataIndex] = utils.xlsxDate(Number(arrData[i][publicData[j].dataIndex]))
                }
              }
            }
            if (arrData[i].ownershipStatusName === '有证') {
              if (!arrData[i].warrantNbr) {
                this.DE_Loding(loadingName).then(() => {this.$message.info('当权属情况为有证时需输入权证号')})
                return
              }
            }
            arrData[i].key = i + getUuid() 
            arrData[i].area = arrData[i].area ? arrData[i].area : 0
            arrData[i].transferArea = arrData[i].transferArea ? arrData[i].transferArea : 0
          }
          resData = utils.deepClone([...arrData, ...this.tableData])
          // 房屋
          if (this.assetType === '1') {
            // 数组去重根据type和objectId
            let hash = {}
            resData = resData.reduce((preVal, curVal) => {
              hash[Number(curVal.objectId) + Number(curVal.type)] ? '' : hash[Number(curVal.objectId) + Number(curVal.type)] = true && preVal.push(curVal)
              return preVal
            }, [])
            publicData = judgmentData
          } else if (this.assetType === '4') {
            // 土地
            // 数组去重根据objectId
            let hash = {}
            resData = resData.reduce((preVal, curVal) => {
              hash[Number(curVal.landId)] ? '' : hash[Number(curVal.landId)] = true && preVal.push(curVal)
              return preVal
            }, [])
            publicData = landCheck
          }
          this.tableData = resData
          this.calcFn()   // 计算统计的值
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
    // 导入资产清单
    addTheAsset () {
      if (this.assetTypeFn()) { return}
      this.$refs.fileUpload.click()
    },
    assetTypeFn () {
      if (!this.assetType) {
        this.$message.info('请先选择资产类型')
        return true
      }
    },
    // 下载模板
    downloadTemplate () {
      if (this.assetTypeFn()) { return}
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
      console.log(record)
      if (record.assetId) {
        this.deleteBase(record)
      } else {
        this.commomDelete('delete', record.key)
      }
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
                _this.calcFn()
              }
            })
          } else {
            _this.tableData = []
            _this.calcFn()
          }
        }
      })
    },
    // 每次再次计算统计的值
    calcFn () {
      this.numList.forEach(list => {
        list.value = 0
      })
      if (this.tableData.length > 0) {
        this.tableData.forEach(item => {
          if (this.assetType === '1') {
            this.numList[1].value = calc.add(this.numList[1].value, item.area || 0)
          } else if (this.assetType === '4') {
            this.numList[1].value = calc.add(this.numList[1].value, item.landArea || 0)
          }
          this.numList[2].value = calc.add(this.numList[2].value, item.creditorAmount || 0)
          this.numList[3].value = calc.add(this.numList[3].value, item.debtAmount || 0)
        })
      }
      this.numList[0].value = this.tableData.length
    },
    deleteBase (record) {
      let _this = this
      _this.$confirm({
        title: '提示',
        content: '确认要删除该资产吗？资产相关信息将一起删除！',
        onOk() {
          let obj = {
            registerOrderId: _this.registerOrderId,
            assetId: record.assetId
          }
          _this.$api.assets.deleteBase(obj).then(res => {
            if (Number(res.data.code) === 0) {
              _this.query()
            } else {
              _this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    // 导出
    downFn () {
      let obj = {
        registerOrderId: this.registerOrderId,  // 资产登记ID，修改时必填
        assetType: this.assetType,      // 资产类型, 1房屋、2土地、3设备
        buildIds: [],                           // 楼栋id列表（房屋时必填）
        scope: '',                              // 1楼栋 2房屋（房屋时必填）
        organId: this.organId,
        blankIdList: []                         // 土地Id列表（土地时必填）
      }
      this.$api.assets.downloadTemplate(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产基础信息.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
        this.modalShow = false
      })
    },
    // 编辑批量更新导入
    batchUpdate () {
      this.$refs.batchUpload.click()
    },
    // 编辑批量更新文件上传
    batchUploadFn (files, e) {
      if (!files.length) { return }
      let fileData = new FormData()
      fileData.append('file', files[0])
      fileData.append('registerOrderId', this.registerOrderId)
      fileData.append('assetType', this.assetType)
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
      this.$api.assets.baseImport(this.formData).then(res => {
        if (res.data.code === '0') {
          console.log('-=-=-=')
          e.target.value = ''
          this.DE_Loding(loadingName).then(() => {
            this.allQuery()
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
    // 权属情况
    organDict () {
      this.$api.assets.platformDict({code: 'AMS_OWNERSHIP_STSTUS_TYPE'}).then(res => {
        if (Number(res.data.code) === 0) {
          let organDictData = res.data.data
          let obj = {}
          organDictData.forEach(item => {
            obj[item.name] = item.value
          })
          this.organDictData = obj
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 权属类型
    ownershipFn () {
      this.$api.assets.platformDict({code: 'AMS_ASSET_KIND_OF_RIGHT'}).then(res => {
        if (Number(res.data.code) === 0) {
          let ownershipData = res.data.data
          let obj = {}
          ownershipData.forEach(item => {
            obj[item.name] = item.value
          })
          this.ownershipData = obj
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 提交
    save () {
      if (this.tableData.length === 0) {
        this.$message.info('请导入资产明细')
        return true
      }
      let data = utils.deepClone(this.tableData)
      data.forEach(item => {
        item.ownershipStatus = this.organDictData[item.ownershipStatusName]
        item.kindOfRight = this.ownershipData[item.kindOfRightName]
      })
      console.log(data, '-=-=-=')
      this.basicData = data
    }
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
  .postAssignment-icon {
    cursor: pointer;
    color: #0084FF;
  }
  .postAssignment-icon:hover {
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
</style>


