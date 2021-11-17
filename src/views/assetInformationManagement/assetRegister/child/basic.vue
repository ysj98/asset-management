<!--
 * @Author: LW
 * @Date: 2020-07-10 16:50:51
 * @LastEditTime: 2020-11-10 15:59:02
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
        <SG-Button type="primary" weaken @click="handleAddAsset">添加资产导入</SG-Button>
        <SG-Button class="ml20" type="primary" weaken @click="downFn">批量导出</SG-Button>
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
        <!-- 车场类型 -->
        <template #type="text,record">
          {{generateYardClassification(record)}}
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        v-show="['detail', 'edit', 'new'].includes(setType) && registerOrderId"
        :pageLength="footer.pageSize"
        :totalCount="count"
        location="static"
        :noPageTools="false"
        v-model="footer.pageNum"
        @change="handleChange"
      />
    </div>
    <basicDownload ref="basicDownload"></basicDownload>
    <!--  添加资产导入  -->
    <AssetImportModal
      ref="assetImportModalRef"
      :modalData="modalObj.add"
      @handleAdditionAsset="handleAdditionAsset"
      @doClosePop="
        ()=>{ modalObj.add.flag = false }
      "
    />
    <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
    <input ref="batchUpload" @change="batchUploadFn($event.target.files, $event)" type="file" style="display:none">
  </div>
</template>

<script>
import {calc, utils, getArrayRepeat} from '@/utils/utils'
import OverviewNumber from 'src/views/common/OverviewNumber'
import noDataTips from '@/components/noDataTips'
import {
  columnsData,
  equipment,
  equipmentVerificationList,
  houseVerificationList,
  landVerificationList,
  yardVerificationList,
  landData,
  yard
} from './../common/registerBasics'
import basicDownload from './../common/basicDownload'
import AssetImportModal from "@/views/assetInformationManagement/assetRegister/common/AssetImportModal";
import bridge from './center'
import {querySourceType} from "@/views/common/commonQueryApi";
import {handleAssetTypeField} from "@/views/assetInformationManagement/assetRegister/common/share";

let getUuid = (() => {
  let uuid = 1
  return () => {
    return ++uuid
  }
})()
const numList = [
  {title: '资产数量', key: 'assetsNum', value: 0, fontColor: '#324057'},
  {title: '建筑面积(㎡)', key: 'areaNum', value: 0, bgColor: '#FD7474', noShow: false},
  {title: '债权(元)', key: 'debtAmount', value: 0, bgColor: '#1890FF'},
  {title: '债务(元)', key: 'depreciationAmount', value: 0, bgColor: '#DD81E6'}
]
const numListEq = [
  {title: '资产数量', key: 'assetsNum', value: 0, fontColor: '#324057'},
  {title: '债权(元)', key: 'debtAmount', value: 0, bgColor: '#1890FF'},
  {title: '债务(元)', key: 'depreciationAmount', value: 0, bgColor: '#DD81E6'}
]
export default {
  components: {OverviewNumber, noDataTips, basicDownload, AssetImportModal},
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
      equipmentVerificationList,
      houseVerificationList,
      landVerificationList,
      yardVerificationList,
      userSelectedOrganId:'',
      detailData:{},
      projectList:[],
      modalObj: {
        add: {
          modalName: "add",
          flag: false,
          title: "添加资产导入",
          // modal中子组件需要的数据
          params: {
            organId: "",
            type: "",
            registerOrderId:''
          }
        }
      },
      sourceType: '',
      sourceOptions:[], // 用来匹配 value
      keyUuid: getUuid(),
      count: '',
      footer: {
        pageNum: 1,
        pageSize: 10
      },
      basicData: [],
      organDictData: {},     // 权属情况
      ownershipData: {},     // 权属类型
      ownershipDataName: [],   // 权属类型名称
      organDictDataName: [],   // 权属情况名称
      fileType: ['xls', 'xlsx'],
      setType: '',
      numList: numList, // 概览数字数据, title 标题，value 数值，bgColor 背景色
      tableData: [],    // 表格内容
      columns: [],      // 表格表头
      assetType: '',    // 资产类型
      projectId: ''
    }
  },
  computed: {
    isEquipment(){
      return this.assetType === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
      // return true
    },
    ASSET_TYPE_CODE(){
      return this.$store.state.ASSET_TYPE_CODE;
    },
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    tempFn(value){
      console.log('test')
      console.log(value)
    },
    generateYardClassification(record){
      const {type, objectType} = record
      let data = []
      // 1车场 2车位 固化的
      if (String(type) === '1'){
        data = this.$store.state.platformDict.PARKING_PLACE_RESOURCE_TYPE
      }else if(String(type) === '2'){
        data = this.$store.state.platformDict.PARKING_OBJ_TYPE
      }

      let res = data.filter(ele=>{
        return ele.value === objectType
      })[0]
      return res ? res.name : '--'
    },
    /*
    * @public ref调用
    * 新增 资产登记 第二个页面 添加资产导入 需要 detailData 数据
    * */
    setDetail( data={} ){
      Object.assign(this.detailData,data)
    },
    /*
    * 获取详情 取projectID 用
    * */
    getDetail(){
      return new Promise(resolve => {
        let obj = {
          registerOrderId: this.registerOrderId     // 资产登记单ID
        }
        this.$api.assets.getRegisterOrderById(obj).then(res => {
          if (Number(res.data.code) === 0) {
            this.detailData = res.data.data
            this.projectId = res.data.data.projectId
          } else {
            this.$message.error(res.data.message)
          }
          resolve()
        })
      })
    },
    /*
    * 编辑 初始化
    * */
    async init(){
      if (this.isEquipment){
        this.numList = numListEq
      }else {
        this.numList = numList
      }
      this.record = JSON.parse(this.$route.query.record)
      this.assetType = String(this.assetTypeId)
      this.setType = this.$route.query.setType

      let res1 = this.getObjectKeyValueByOrganIdFn()
      let res2 = this.getSourceOptions()
      await res1
      await res2
      if(['edit'].includes(this.setType)){
        let res3 = this.getDetail()
        await res3
        console.log(this.projectList,this.sourceOptions)
        this.handleInitDefaultSourceType(this.detailData.projectId)
      }
      // 编辑和详情进来的判断
      if (this.setType === 'detail' || this.setType === 'edit') {
        let arr = []
        this.assetType = String(this.record[0].assetType)
        if (this.assetType === this.ASSET_TYPE_CODE.HOUSE) {                    // 房屋表头
          arr = utils.deepClone(columnsData)
        } else if (this.assetType === this.ASSET_TYPE_CODE.LAND) {             // 土地表头
          arr = utils.deepClone(landData)
        } else if (this.assetType === this.ASSET_TYPE_CODE.EQUIPMENT) {
          arr = utils.deepClone(equipment)
        } else if (this.assetType === this.ASSET_TYPE_CODE.YARD) {
          arr = utils.deepClone(yard)
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
    /*
    * 编辑页面 获取默认来源方式值
    * */
    handleInitDefaultSourceType(projectId){
      let res = this.projectList.find(ele=>ele.projectId === projectId)
      console.log('res',res)
      this.sourceType = res ? Number(res.sourceType) : ''
    },
    /*
    * 获取项目列表
    * 初始化来源方式用
    * */
    getObjectKeyValueByOrganIdFn () {
      return new Promise(resolve => {
        let obj = {
          organId: this.organId,
          projectName: ''
        }
        this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
          if (Number(res.data.code) === 0) {
            this.projectList = res.data.data
          } else {
            this.$message.error(res.data.message)
          }
          resolve()
        })
      })

    },
    /*
    * 获取来源方式
    * */
    async getSourceOptions() {
      return new Promise(resolve => {
        let organId = this.organId
        this.sourceOptions = []
        querySourceType(organId, this).then(list => {
          resolve()
          return this.sourceOptions = list
        })
      })
    },
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
          let ASSET_TYPE_PAGE_LIST = handleAssetTypeField(this.assetType,'pageList')
          data = res.data.data.data[ASSET_TYPE_PAGE_LIST]
          if (data && data.length) {
            data.forEach((item, index) => {
              item.key = index
              item.pasitionString = item.allAddress || ((item.pasitionString || '') + (item.address || ""))
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
          if (this.assetType === this.ASSET_TYPE_CODE.LAND) {
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
      bridge.$on("assetType",(val, type, sourceType)=>{
        //val值    type：project项目  asset资产类型
        // 房屋
        // 初始化 nulList 显示状态
        if (type==='asset'){
          let resType = ''
          let resColumns = []
          this.tableData = []
          switch (val){
            case this.ASSET_TYPE_CODE.HOUSE:
              resType = this.ASSET_TYPE_CODE.HOUSE
              resColumns = columnsData
              this.numList[1].title = '建筑面积'
              break
            case this.ASSET_TYPE_CODE.LAND:
              resType = this.ASSET_TYPE_CODE.LAND
              resColumns = landData
              this.numList[1].title = '土地面积'
              break
            case this.ASSET_TYPE_CODE.YARD:
              resType = this.ASSET_TYPE_CODE.YARD
              resColumns = yard
              this.numList[1].title = '资产面积'
              break
            case this.ASSET_TYPE_CODE.EQUIPMENT:
              resType = this.ASSET_TYPE_CODE.EQUIPMENT
              resColumns = equipment
              break
          }
          this.assetType = resType
          this.columns = resColumns

          if (this.isEquipment){
            this.numList = numListEq
          }else {
            this.numList = numList
          }
        }
        // 项目切换
        if (type === 'project' && val) {
          this.tableData = []
          this.sourceType = Number(sourceType)
          this.projectId  = val
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
      fileData.append('projectId',this.projectId)
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
          let resData = [], arrData =[]
          let ASSET_TYPE_LIST = handleAssetTypeField(this.assetType,'list')
          arrData =  res.data.data[ASSET_TYPE_LIST]
          // 遍历判断必填有字段
          let validateRes = this.handleValidateExcelData( arrData)
          if(validateRes){
            this.DE_Loding(loadingName).then(() => {
              this.$message.info(validateRes)
            })
            return null
          }
          resData = utils.deepClone([...arrData, ...this.tableData])
          // 房屋
          let generateKeyFn = null
          if (this.assetType === this.ASSET_TYPE_CODE.HOUSE) {
            generateKeyFn = (ele)=> ele.objectId + ele.type
          } else if (this.assetType === this.ASSET_TYPE_CODE.LAND) {
            generateKeyFn = (ele)=> ele.landId
          } else if (this.assetType === this.ASSET_TYPE_CODE.YARD){
            generateKeyFn = (ele)=> ele.placeId + ele.objectId
          } else if (this.assetType === this.ASSET_TYPE_CODE.EQUIPMENT){
            generateKeyFn = (ele)=> ele.equipmentId
          }
          resData = getArrayRepeat(resData,generateKeyFn).map(ele=>ele[0])
          this.tableData = this.handleTableDataSourceModeName(
            resData
          ).map(ele => ({
            ...ele,
            pasitionString: ele.allAddress || ((ele.pasitionString || '') + (ele.address || ""))
          }));
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
        this.DE_Loding(loadingName).then(() => {
          this.$SG_Message.error('导入失败！')
        })
      })
    },
    /*
    * 添加默认来源方式
    * @return Array
    * */
    handleTableDataSourceModeName(tableData){
      return tableData.map(ele => {
        // 默认取 资产项目 来源方式
        let sourceModeName = ele.sourceModeName
        if (!ele.sourceModeName) {
          // 筛选对应的来源方式 枚举值 (取项目默认的来源方式)
          let sourceModeObj = this.sourceOptions.filter(sourceItem => Number(sourceItem.key) === Number(this.sourceType))[0]
          sourceModeName = sourceModeObj ? sourceModeObj.title : ''
        }
        return {
          ...ele,
          sourceModeName,
        }
      })
    },
    /*
    * 校验表格数据
    * @return String 错误信息
    * */
    handleValidateExcelData(arrData){
      let publicData = []
      if (Object.keys(this.ASSET_TYPE_CODE).map(e => (this.ASSET_TYPE_CODE[e])).includes(this.assetType)){
        const ASSET_TYPE_VERSIFICATION_LIST = handleAssetTypeField(this.assetType,'verificationList')
         publicData = this[ASSET_TYPE_VERSIFICATION_LIST]
      }
      for (let i = 0; i < arrData.length; i++) {
        for (let j = 0; j < publicData.length; j++) {
          // 必填字段
          if (publicData[j].required) {
            if (!arrData[i][publicData[j].dataIndex]) {
              return `请输入${publicData[j].title}`
            }
          }
          // 判断只能为数字2小数
          if (publicData[j].type === 'float') {
            if (arrData[i][publicData[j].dataIndex] && !(/^(\d{1,10}|\d{1,8}\.\d{1,2})$/).test(arrData[i][publicData[j].dataIndex])) {
              return `请输入正确${publicData[j].title}(只支持10位数2位小数)`
            }
          }
          // 判断只能为13位数字2小数
          if (publicData[j].type === 'float132') {
            if (arrData[i][publicData[j].dataIndex] && !(/^(\d{1,13}|\d{1,11}\.\d{1,2})$/).test(arrData[i][publicData[j].dataIndex])) {
              return `请输入正确${publicData[j].title}(只支持13位数2位小数)`
            }
          }
          // 判断只能为数字4小数
          if (publicData[j].type === 'float4') {
            if (arrData[i][publicData[j].dataIndex] && !(/^(\d{1,10}|\d{1,8}\.\d{1,4})$/).test(arrData[i][publicData[j].dataIndex])) {
              return `请输入正确${publicData[j].title}(只支持10位数2位小数)`
            }
          }
          // 判断只能为整数
          if (publicData[j].type === 'num ber') {
            if (arrData[i][publicData[j].dataIndex] && !(/^\d{1,11}$/).test(Number(arrData[i][publicData[j].dataIndex]))) {
              return `请输入正确${publicData[j].title}`
            }
          }
          // 判断不超过多少字符
          if (publicData[j].fontLength) {
            if (arrData[i][publicData[j].dataIndex] && String(arrData[i][publicData[j].dataIndex]).length > publicData[j].fontLength) {
              return `${publicData[j].title}不超过${publicData[j].fontLength}字符`
            }
          }
          // 判断时间转换
          if (publicData[j].date) {
            if (arrData[i][publicData[j].dataIndex]) {
              arrData[i][publicData[j].dataIndex] = utils.xlsxDate(Number(arrData[i][publicData[j].dataIndex]))
            }
          }
        }
        if (!this.ownershipDataName.includes(arrData[i].kindOfRightName)) {
          return `请选择正确的权属类型`
        }
        if (!this.organDictDataName.includes(arrData[i].ownershipStatusName)) {
          return `请选择正确的权属情况`
        }
        if (arrData[i].ownershipStatusName === '有证') {
          if (!arrData[i].warrantNbr) {
            return '当权属情况为有证时需输入权证号'
          }
        }
        arrData[i].key = i + getUuid()
        arrData[i].area = arrData[i].area ? arrData[i].area : 0
        arrData[i].transferArea = arrData[i].transferArea ? arrData[i].transferArea : 0
      }
    },
    /*
    * 导入之后 保存
    * */
    async handleSaveAsset(basicData){
      let loadingName = this.SG_Loding("保存中...")
      let data = this.detailData
      let ASSET_TYPE_LIST = handleAssetTypeField(data.assetType,'list')
      let requestData = {
        registerOrderId: this.registerOrderId,          // 资产变动单Id（新增为空）
        registerOrderName: data.registerOrderName,    // 登记单名称
        projectId: data.projectId,                    // 资产项目Id
        assetType: data.assetType,                    // 资产类型Id
        remark: data.remark,                          // 备注
        organId: this.organId,                          // 组织机构id
        [ASSET_TYPE_LIST]: basicData,
      }
      try {
        let updateRegisterOrderV2ResData = await this.$api.assets.updateRegisterOrderV2(requestData)
        console.log(updateRegisterOrderV2ResData)
        if (updateRegisterOrderV2ResData.data.code === '0'){
          this.query()
          await this.DE_Loding(loadingName)
          this.$SG_Message.success('保存成功！')
          // 导入成功 关闭弹窗
          this.modalObj.add.flag = false
        }else {
          await this.DE_Loding(loadingName)
          this.$SG_Message.error(updateRegisterOrderV2ResData.data.message)
        }
      }catch (error){
        console.error(error)
        await this.DE_Loding(loadingName)
        this.$SG_Message.error('保存失败')
      }
    },
    /*
    * 追加 导入
    * @fileList Array
    * */
    async handleAdditionAsset(fileList){
      if (!fileList.length) { return }
      let fileData = new FormData()
      fileData.append('registerOrderModelFile', fileList[0])
      fileData.append('assetType', this.assetType)
      fileData.append('registerOrderId', String(this.registerOrderId || ''))
      fileData.append('projectId',this.projectId)
      if (this.formData === null) {
        return this.$message.error('请先上传文件!')
      }
      let loadingName = this.SG_Loding("导入中...")
      console.log(loadingName)
      try {
        let readExcelModelV2ResData = await this.$api.assets.readExcelModelV2(fileData)
        if(readExcelModelV2ResData.data.code === '0'){
          let ASSET_TYPE_LIST = handleAssetTypeField(this.assetType,'list')
          let arrData = readExcelModelV2ResData.data.data[ASSET_TYPE_LIST]
          let validateRes = this.handleValidateExcelData( arrData )
          if( validateRes ) {
            await this.DE_Loding(loadingName)
            await this.$message.info(validateRes)
            return null
          }
          // 追加 默认 sourceMode 信息
          /*
          * */
          let basicData = arrData.map(ele => ({
            ...ele,
            sourceMode: ele.sourceMode !== undefined ? ele.sourceMode : this.sourceType,
            kindOfRight: this.ownershipData[ele.kindOfRightName],
            ownershipStatus: this.organDictData[ele.ownershipStatusName]
          }));
          await this.DE_Loding(loadingName)
          await this.handleSaveAsset(basicData)
        }else {
          await this.DE_Loding(loadingName)
          this.$SG_Message.error({
            content: readExcelModelV2ResData.data.message,
            duration: 5
          })
        }
      }catch (error){
        console.error(error)
        this.DE_Loding(loadingName).then(() => {
          this.$SG_Message.error('导入失败！')
        })
      }

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
    /*
    * 登记基础信息 添加资产导入
    * */
    handleAddAsset(){
      this.modalObj.add.flag = true
      this.modalObj.add.params= {
        organId: this.organId,
        type: this.assetType,
        registerOrderId: this.registerOrderId
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
        if (this.assetType === this.ASSET_TYPE_CODE.EQUIPMENT){
          this.tableData.forEach(item => {
            this.numList[1].value = calc.add(this.numList[1].value, item.creditorAmount || 0)
            this.numList[2].value = calc.add(this.numList[2].value, item.debtAmount || 0)
          })
        }else {
          this.tableData.forEach(item => {
            if (this.assetType === this.ASSET_TYPE_CODE.HOUSE) {
              this.numList[1].value = calc.add(this.numList[1].value, item.area || 0)
            } else if (this.assetType === this.ASSET_TYPE_CODE.LAND) {
              this.numList[1].value = calc.add(this.numList[1].value, item.landArea || 0)
            } else if (this.assetType === this.ASSET_TYPE_CODE.YARD) {
              this.numList[1].value = calc.add(this.numList[1].value, item.area || 0)
            }
            this.numList[2].value = calc.add(this.numList[2].value, item.creditorAmount || 0)
            this.numList[3].value = calc.add(this.numList[3].value, item.debtAmount || 0)
          })
        }
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
        scope: '',                              // 1楼栋 2房屋（房屋时必填）
        organId: this.organId,
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
      fileData.append('projectId',this.projectId)
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
        this.DE_Loding(loadingName).then(() => {
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
          let organDictDataName = []
          organDictData.forEach(item => {
            obj[item.name] = item.value
            organDictDataName.push(item.name)
          })
          this.organDictDataName = organDictDataName
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
          let ownershipDataName = []
          ownershipData.forEach(item => {
            obj[item.name] = item.value
            ownershipDataName.push(item.name)
          })
          this.ownershipDataName = ownershipDataName
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
        // 传 来源方式 对应的 枚举值
        let sourceModeObj = this.sourceOptions.find(ele => item.sourceModeName === ele.title)
        item.ownershipStatus = this.organDictData[item.ownershipStatusName]
        item.kindOfRight = this.ownershipData[item.kindOfRightName]
        item.sourceMode = sourceModeObj ? Number(sourceModeObj.key) : ''
      },this)
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
    border: 1px solid rgba(239, 244, 249, 1);
  }
  .postAssignment-icon {
    cursor: pointer;
    color: #0084ff;
  }
  .postAssignment-icon:hover {
    color: red;
  }
}
.overflowX {
  /deep/ .ant-table-scroll {
    overflow-x: auto;
  }
  /deep/.ant-table-header {
    padding-bottom: 0px !important;
    margin-bottom: 0px !important;
  }
}
</style>
