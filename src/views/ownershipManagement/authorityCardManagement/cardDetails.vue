
<template>
  <SG-Modal
    class="assetBundlePopover"
    width="836px"
    v-model="show"
    :noPadding="true"
    title="权证详情"
    :footer="null"
  >
  <div class="newCard">
    <div class="newCard-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-col class="playground-col" :span="12" v-for="(item, index) in basicDate" :key="index">
          {{item.text}}：{{conditionalJudgment.includes(particularsData[item.value]) ? '--' : particularsData[item.value]}}
        </a-col>
        <a-col class="playground-col" :span="24">附记：{{particularsData.excursus || '--'}}</a-col>
        <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
        <a-col class="playground-col" :class="{'files-style': files.length > 0}" :span="24">附件： <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <SG-UploadFile
                v-model="files"
                type="all"
                :show="true"
              />
            </div>
          </a-col>
      </a-row>
    </div>
    <div class="newCard-nav" v-if="this.kindOfRight === '1' || this.kindOfRight === '3'">
      <span class="section-title blue">权属人</span>
      <div class="tab-nav table-border">
        <a-table
          :columns="columns"
          :dataSource="amsOwnershipWarrantObligeeList"
          class="custom-table td-pd10"
          :pagination="false"
          >
        </a-table>
      </div>
    </div>
    <div class="newCard-nav" v-if="this.kindOfRight === '1'">
      <span class="section-title blue">抵押信息</span>
      <div class="tab-nav table-border">
        <a-table
          :columns="mortgageInformation"
          :dataSource="amsOwnershipWarrantMortgageList"
          class="custom-table td-pd10"
          :pagination="false"
          >
        </a-table>
      </div>
    </div>
  </div>
  </SG-Modal>
</template>

<script>
import {utils} from '@/utils/utils'
import {columns, mortgageInformation} from './beat'
const conditionalJudgment = [undefined, null, '']
const titleDeed = [
  { text: '权证号', value: 'warrantNbr' },
  { text: '权属形式', value: 'ownerTypeName' },
  { text: '权证类型', value: 'kindOfRightName' },
  { text: '权利类型', value: 'rightTypeName' },
  { text: '不动产单元号', value: 'estateUnitCode' },
  { text: '丘地号', value: 'lotNo' },
  { text: '坐落位置', value: 'seatingPosition' },
  { text: '土地面积 (㎡)', value: 'landArea' },
  { text: '权属用途', value: 'ownershipUseName' },
  { text: '建筑结构', value: 'structureName' },
  { text: '建筑面积(㎡)', value: 'buildArea' },
  { text: '专有建筑面积', value: 'exclusiveBuildArea' },
  { text: '分摊面积(㎡)', value: 'apportionArea' },
  { text: '总套数', value: 'totalSuite' },
  { text: '权利性质', value: 'qualityOfRightName' },
  { text: '使用期限', value: 'useLimitDate' },
  { text: '登记日期', value: 'rigisterDate' },
  { text: '交接日期', value: 'handoverDate' },
]
const accessCard = [
  { text: '权证号', value: 'warrantNbr' },
  { text: '权属形式', value: 'ownerTypeName' },
  { text: '权证类型', value: 'kindOfRightName' },
  { text: '房屋所有权人', value: 'houseOwner' },
  { text: '承租人', value: 'tenantIdName' },
  { text: '委托管理单位', value: 'entrustOrganization' },
  { text: '建筑面积(㎡)', value: 'buildArea' },
  { text: '使用面积(㎡)', value: 'useArea' },
  { text: '专有建筑面积(㎡)', value: 'exclusiveBuildArea' },
  { text: '分摊面积(㎡)', value: 'apportionArea' },
  { text: '坐落位置', value: 'seatingPosition' },
  { text: '用途', value: 'ownershipUseName' },
  { text: '建筑结构', value: 'structureName' },
  { text: '总层数', value: 'totalFloor' },
  { text: '所在层', value: 'placeFloor' },
  { text: '房屋号', value: 'houseNo' },
  { text: '租金单价', value: 'rentUnitPice' },
  { text: '租金总价', value: 'rentTotalPrice' },
  { text: '合同期限', value: 'contractData' },
  { text: '议价租金单价', value: 'talkUnitPrice' },
  { text: '议价租金总价', value: 'talkTotalPrice' },
  { text: '租金缴纳期限', value: 'rentPayDate' },
  { text: '产别', value: 'antenatal' },
  { text: '登记日期', value: 'rigisterDate' },
  { text: '交接日期', value: 'handoverDate' },
]
const landDeed = [
  { text: '权证号', value: 'warrantNbr' },
  { text: '权属形式', value: 'ownerTypeName' },
  { text: '权证类型', value: 'kindOfRightName' },
  { text: '地号', value: 'landNumber' },
  { text: '图号', value: 'picNumber' },
  { text: '座落位置', value: 'seatingPosition' },
  { text: '地类(用途)', value: 'landCategory' },
  { text: '取得价格', value: 'getPrice' },
  { text: '使用权类型', value: 'useCategory' },
  { text: '使用权面积(㎡)', value: 'useArea' },
  { text: '独有面积(㎡)', value: 'exclusiveArea' },
  { text: '分摊面积(㎡)', value: 'apportionArea' },
  { text: '终止日期', value: 'terminationData' },
  { text: '登记日期', value: 'rigisterDate' },
  { text: '交接日期', value: 'handoverDate' }
]
export default {
  components: {},
  props: {},
  data () {
    return {
      conditionalJudgment,
      basicDate: [],
      titleDeed,
      accessCard,
      landDeed,
      particularsData: {},
      files: [],
      kindOfRight: '',        // 权证类型判断
      beat: [],
      columns: [],
      mortgageInformation: [],
      amsOwnershipWarrantObligeeList: [],
      amsOwnershipWarrantMortgageList: [],
      allWidth: 'width: 214px',
      widthBox: 'width: 73.5%',
      newCard: '',
      show: false,
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      }
    }
  },
  computed: {
  },
  watch: {
    'kindOfRight' (val) {
      if (val === '1' || val === '3') {
        let arr = utils.deepClone(columns)
        this.columns = arr.splice(0, arr.length - 1)
        let opt = utils.deepClone(mortgageInformation)
        this.mortgageInformation = opt.splice(0, opt.length - 1)
        if (val === '1') {
          this.basicDate = titleDeed
        } else if (val === '3') {
          this.basicDate = landDeed
        }
      } else if (val === '2') {
        this.basicDate = accessCard
      }
    }
  },
  methods: {
    // 关闭弹窗
    handleCancel () {
      this.show = false
    },
    // 详情查询
    query (warrantNbr, id) {
      this.particularsData = {}
      this.show = true
      this.warrantNbr = warrantNbr
      this.$api.ownership.warrantDetail({warrantNbr: this.warrantNbr, organId: id}).then(res => {
        if (Number(res.data.code) === 0) {
        let data = res.data.data
        this.kindOfRight = String(data.amsOwnershipWarrant.kindOfRight)
        this.particularsData = data.amsOwnershipWarrant
        console.log(this.particularsData)
        let files = []
        if (data.amsAttachmentList && data.amsAttachmentList.length > 0) {
            data.amsAttachmentList.forEach(item => {
            files.push({
              url: item.attachmentPath,
              name: item.oldAttachmentName
            })
          })
        }
        this.files = files
        // 权属人信息
        data.amsOwnershipWarrantObligeeList.forEach((list, index) => {
          list.key = index
          list.obligeeId = list.obligeeName
          data.amsOwnershipWarrantObligeeList[index].percent = list.percent.toFixed(2)
        })
        this.amsOwnershipWarrantObligeeList = data.amsOwnershipWarrantObligeeList
        // 抵押信息
        data.amsOwnershipWarrantMortgageList.forEach((evl, index) => {
          evl.key = index
        })
        this.amsOwnershipWarrantMortgageList = data.amsOwnershipWarrantMortgageList
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.newCard {
  height: 500px;
  overflow-y: scroll;
  padding-bottom: 40px;
  .newCard-nav {
    padding: 40px 70px 0 70px;
    .tab-nav {
      margin: 24px 20px;
    }
  }
  .playground-row {
    margin: 23px 0 0 26px;
    .playground-col {
      // height: 40px;
      line-height: 40px;
      font-size: 12px;
    }
    .files-style {
      margin-bottom: 70px;
    }
  }
}
</style>
