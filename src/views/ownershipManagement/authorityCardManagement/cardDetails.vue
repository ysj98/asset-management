
<template>
  <SG-Modal
    class="assetBundlePopover"
    width="836px"
    v-model="show"
    title="选择权证"
    :footer="null"
  >
  <div class="newCard">
    <div class="newCard-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <div v-if="this.kindOfRight === '1'">
          <a-col class="playground-col" :span="12">权证号&nbsp;：{{particularsData.warrantNbr || '--'}}</a-col>
          <a-col class="playground-col" :span="12">权属形式：{{particularsData.ownerTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">权利类型：{{particularsData.kindOfRightName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">丘地号：{{particularsData.lotNo || '--'}}</a-col>
          <a-col class="playground-col" :span="12">坐落位置：{{particularsData.seatingPosition || '--'}}</a-col>
          <a-col class="playground-col" :span="12">土地面积(㎡)：{{particularsData.landArea || '--'}}</a-col>
          <a-col class="playground-col" :span="12">权属用途：{{particularsData.ownershipUseName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">结构：{{particularsData.structure || '--'}}</a-col>
          <a-col class="playground-col" :span="12">建筑面积(㎡)：{{particularsData.buildArea || '--'}}</a-col>
          <a-col class="playground-col" :span="12">专属建筑面积：{{particularsData.exclusiveBuildArea || '--'}}</a-col>
          <a-col class="playground-col" :span="12">分摊面积(㎡)：{{particularsData.apportionArea || '--'}}</a-col>
          <a-col class="playground-col" :span="12">总套数：{{particularsData.totalSuite || '--'}}</a-col>
          <a-col class="playground-col" :span="12">权利性质：{{particularsData.qualityOfRightName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">使用期限：{{particularsData.useLimitDate || '--'}}</a-col>
          <a-col class="playground-col" :span="12">登记日期：{{particularsData.rigisterDate || '--'}}</a-col>
          <a-col class="playground-col" :span="12">交接日期：{{particularsData.handoverDate || '--'}}</a-col>
        </div>
        <div v-if="this.kindOfRight === '2'">
          <a-col class="playground-col" :span="12">权证号&nbsp;：{{particularsData.warrantNbr || '--'}}</a-col>
          <a-col class="playground-col" :span="12">权属形式：{{particularsData.ownerTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">权利类型：{{particularsData.kindOfRightName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">房屋所有权人：{{particularsData.houseOwner || '--'}}</a-col>
          <a-col class="playground-col" :span="12">承租人：{{particularsData.tenant || '--'}}</a-col>
          <a-col class="playground-col" :span="12">委托管理单位：{{particularsData.entrustOrganization || '--'}}</a-col>
          <a-col class="playground-col" :span="12">建筑面积(㎡)：{{particularsData.buildArea || '--'}}</a-col>
          <a-col class="playground-col" :span="12">专有建筑面积(㎡)：{{particularsData.exclusiveBuildArea || '--'}}</a-col>
          <a-col class="playground-col" :span="12">分摊面积(㎡)：{{particularsData.apportionArea || '--'}}</a-col>
          <a-col class="playground-col" :span="12">坐落位置：{{particularsData.seatingPosition || '--'}}</a-col>
          <a-col class="playground-col" :span="12">用途：{{particularsData.ownershipUseName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">结构：{{particularsData.structure || '--'}}</a-col>
          <a-col class="playground-col" :span="12">总层数：{{particularsData.totalFloor || '--'}}</a-col>
          <a-col class="playground-col" :span="12">所在层：{{particularsData.placeFloor || '--'}}</a-col>
          <a-col class="playground-col" :span="12">房屋号：{{particularsData.houseNo || '--'}}</a-col>
          <a-col class="playground-col" :span="12">租金单价：{{particularsData.rentUnitPrice || '--'}}</a-col>
          <a-col class="playground-col" :span="12">租金总价：{{particularsData.rentTotalPrice || '--'}}</a-col>
          <a-col class="playground-col" :span="12">合同期限：{{particularsData.contractData || '--'}}</a-col>
          <a-col class="playground-col" :span="12">议价租金单价：{{particularsData.talkUnitPrice || '--'}}</a-col>
          <a-col class="playground-col" :span="12">议价租金总价：{{particularsData.talkTotalPrice || '--'}}</a-col>
          <a-col class="playground-col" :span="12">租金缴纳期限：{{particularsData.rentPayDate || '--'}}</a-col>
          <a-col class="playground-col" :span="12">产别：{{particularsData.antenatal || '--'}}</a-col>
          <a-col class="playground-col" :span="12">登记日期：{{particularsData.rigisterDate || '--'}}</a-col>
          <a-col class="playground-col" :span="12">交接日期：{{particularsData.handoverDate || '--'}}</a-col>
        </div>
        <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
        <a-col class="playground-col" :class="{'files-style': files.length > 0}" :span="24">附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 件： <span v-if="files.length === 0">无</span>
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
    <div class="newCard-nav" v-if="this.kindOfRight === '1'">
      <span class="section-title blue">权利人</span>
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
import Cephalosome from '@/components/Cephalosome'
import moment from 'moment'
import {debounce, utils} from '@/utils/utils'
import {accessCard, titleDeed, columns, mortgageInformation} from './beat'

export default {
  components: {Cephalosome},
  props: {
    // warrantId: {
    //   type: [String, Number],
    //   default: ''
    // }
  },
  data () {
    return {
      particularsData: {},
      files: [],
      kindOfRight: '',        // 权利类型判断
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
      if (val === '1') {
        let arr = utils.deepClone(columns)
        this.columns = arr.splice(0, arr.length - 1)
        let opt = utils.deepClone(mortgageInformation)
        this.mortgageInformation = opt.splice(0, opt.length - 1)
        this.beat = titleDeed
      } else if (val === '2') {
        this.beat = accessCard
      }
    }
  },
  methods: {
    // 关闭弹窗
    handleCancel () {
      this.show = false
    },
    // 详情查询
    query (warrantId) {
      this.show = true
      this.warrantId = warrantId
      this.$api.ownership.warrantDetail({warrantId: this.warrantId}).then(res => {
        if (Number(res.data.code) === 0) {
        let data = res.data.data
        this.kindOfRight = String(data.amsOwnershipWarrant.kindOfRight)
        this.particularsData = data.amsOwnershipWarrant
        console.log(this.particularsData, '-=-=')
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
  padding-bottom: 70px;
  .newCard-nav {
    padding: 16px 14px 0 14px;
    .tab-nav {
      margin: 24px 20px;
    }
  }
  .playground-row {
    margin: 23px 0 0 26px;
    .playground-col {
      height: 40px;
      line-height: 40px;
      font-size: 12px;
    }
    .files-style {
      margin-bottom: 70px;
    }
  }
}
</style>