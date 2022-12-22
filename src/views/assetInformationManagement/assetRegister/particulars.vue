<!--
  详情: particulars
  审核: audit
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">登记单编号：{{particularsData.registerOrderId || '--'}}</a-col>
          <a-col class="playground-col" :span="8">登记单名称：{{particularsData.registerOrderName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属机构：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目名称：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产类型：{{particularsData.assetTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">有无经营权：{{particularsData.managementRightName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">状态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
          <a-col class="playground-col" :span="8">核实人：{{particularsData.verifierByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">核实日期：{{particularsData.verifierTime || '--'}}</a-col>
          <a-col class="playground-col" :span="8">入库人：{{particularsData.storageByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">入库日期：{{particularsData.storageTime || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
        </a-row>
        <div style="display: flex;">
          <span style="margin-right: 10px;">图片：</span>
          <div style="display: flex">
            <UploadFile
              :baseImgURL="configBase.hostImg1"
              v-model="imgFiles"
              :max="5"
              :show="true"
              :customDownload="
              (value) => {
                return customDownload(value, $api.ownership.downLoadAnnex);
              }
            "
            />
          </div>
        </div>
        <div style="display: flex;">
          <span style="margin-right: 10px;margin-top: 10px;">附件：</span>
          <div style="display: flex">
            <UploadFile
              :baseImgURL="configBase.hostImg1"
              v-model="filepaths"
              :max="5"
              :show="true"
              :customDownload="
              (value) => {
                return customDownload(value, $api.ownership.downLoadAnnex);
              }
            "
            />
          </div>
        </div>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">资产明细</span>
      <div class="particulars-obj">
        <selectTab :activeType="'fancyActive'" style="margin:20px 0;" class="staffCare-tab" v-model="selectTabValue" @change="selectTabChange" :list="list"></selectTab>
        <!-- 基础信息 -->
          <basic v-if="this.selectTabValue === '0'" ref="basicRef" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></basic>
        <!-- <keep-alive>
        </keep-alive> -->
        <!-- 附属配套 -->
        <keep-alive>
          <necessaryCaaessories v-if="this.selectTabValue === '1'" ref="necessaryCaaessories" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></necessaryCaaessories>
        </keep-alive>
        <!-- 价值信息 -->
        <keep-alive>
          <valueToRegister v-if="this.selectTabValue === '2'" ref="valueToRegister" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></valueToRegister>
        </keep-alive>
        <!-- 使用方向 -->
          <directionUse v-if="this.selectTabValue === '3'" ref="directionUse" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></directionUse>
        <!-- <keep-alive>
        </keep-alive> -->
        <!-- 相关费用 -->
        <keep-alive>
          <correlativeCharges v-if="this.selectTabValue === '4'" ref="correlativeCharges" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></correlativeCharges>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import configBase from "@/config/config.base";
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
import selectTab from '../../common/selectTab'
import basic from './child/basic'
import necessaryCaaessories from './child/necessaryCaaessories'
import valueToRegister from './child/valueToRegister'
import directionUse from './child/directionUse'
import correlativeCharges from './child/correlativeCharges'
export default {
  components: {selectTab, basic, necessaryCaaessories, valueToRegister, directionUse, correlativeCharges},
  props: {},
  mixins: [uploadAndDownLoadFIle],
  data () {
    return {
      configBase,
      filepaths:[],
      imgFiles:[],
      organId: '',
      record: '',
      registerOrderId: '',
      assetType: '',
      type: '',
      particularsData: {},
      selectTabValue: '0',
      list: [
        {
          label: '基础信息',
          value: '0'
        },
        {
          label: '附属配套',
          value: '1'
        },
        {
          label: '价值信息',
          value: '2'
        },
        {
          label: '使用方向',
          value: '3'
        },
        {
          label: '相关费用',
          value: '4'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    selectTabChange (val) {
      this.selectTabValue = val
      this.$nextTick(() => {
        this.$textReplace()
      })
    },
    // 查询详情
    query () {
      let obj = {
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data
          this.filepaths = data.otherAttachment.map(ele=>({url: ele.attachmentPath,name:ele.oldAttachmentName,attachmentId:ele.attachmentId}))
          this.imgFiles = data.imageAttachment.map(ele=>({url: ele.attachmentPath,name:ele.oldAttachmentName,attachmentId:ele.attachmentId}))
          let files = []
          if (data.attachment && data.attachment.length > 0) {
              data.attachment.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.attachmentPath.split('/').pop()
              })
            })
          }
          this.files = files
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  },
  created () {
    this.record = JSON.parse(this.$route.query.record)
    this.organId = this.record[0].organId
    this.registerOrderId = this.record[0].registerOrderId
    this.assetType = this.record[0].assetType
  },
  mounted () {
    this.query()
    this.$nextTick(()=>{
      this.$textReplace()
    })
  }
}
</script>
<style lang="less" scoped>
.particulars {
  // overflow: hidden;
  padding-bottom: 70px;
  .particulars-nav{
    padding: 42px 126px 20px 70px;
    .particulars-obj {
      padding: 20px 0 20px 40px;
      .playground-row {
        .playground-col {
          height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
      }
    }
  }
}
.playground-col {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
}
</style>
