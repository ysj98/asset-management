<!--
 * @Date: 2019-11-27 14:53:13
 * @Author: chen han
 * @Description: 资产项目权属详情
 -->
<template>
  <div class="projectOwnershipDetail pb70">
    <div class="ownership-detail">
      <div class="mb30">
          <SG-Title noMargin title="基础信息" />
      </div>
      <!-- 详细信息 -->
      <div class="detail-info-box">
        <div>
          <span class="detail-label">资产名称：</span>
          <span class="detail-content">{{projectName || '--'}}</span>
        </div>
        <div>
          <span class="detail-label">资产数量：</span>
          <span class="detail-content">{{assetCount | filterNum}}</span>
        </div>
        <div>
          <span class="detail-label">权属办理进度：</span>
          <span class="detail-content">{{tranProgress | filterNum}}</span>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="mb30">
          <SG-Title noMargin title="其他信息" />
      </div>
      <!-- 表格 -->
      <div class="detail-table-box" ref="table_box">
        <a-tabs @change="tabChange" v-model="showKey" :animated="false">
          <a-tab-pane :tab="'无证(' + (this.noOwnershipCount || 0) + ')'" key="noOwnership">
            <noCertOwnershipDetail  @change="handleChange" :projectId="projectId" :type="type" :assetTypes="assetTypes"/>
          </a-tab-pane>
          <a-tab-pane :tab="'有证(' + (this.ownershipCount || 0) + ')'" key="ownership" :assetTypes="assetTypes">
            <hasCertOwnershipDetail @change="handleChange" :projectId="projectId" :type="type"/>
          </a-tab-pane>
          <a-tab-pane :tab="'待办(' + (this.waitOwnershipCount || 0) + ')'" key="waitOwnership" :assetTypes="assetTypes">
            <waitCertOwnershipDetail :projectId="projectId" :type="type"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <FormFooter v-if="type==='set'" style="border:none;" location="fixed">
      <SG-Button class="mr2" @click="handleSave" type="primary">保存设置</SG-Button>
      <SG-Button @click="handleCancel">取消</SG-Button>
    </FormFooter>
  </div>
</template>
<script>
import FormFooter from '@/components/FormFooter.vue'
import {utils, debounce} from '@/utils/utils'
import hasCertOwnershipDetail from './child/hasCertOwnershipDetail.vue'
import noCertOwnershipDetail from './child/noCertOwnershipDetail.vue'
import waitCertOwnershipDetail from './child/waitCertOwnershipDetail.vue'
let getUuid = ((uuid = 1) => () => ++uuid)()
// 页面跳转
const operationTypes = {
  index: "/ownershipSurvey"
};
export default {
  components: {
    FormFooter,
    waitCertOwnershipDetail,
    noCertOwnershipDetail,
    hasCertOwnershipDetail
  },
  data () {
    return {
      assetTypes: '',
      type: '',
      projectId: '',
      scrollHeight: {y: 'auto'},
      showKey: 'noOwnership',
      noOwnershipCount: '',
      ownershipCount: '',
      waitOwnershipCount: '',
      projectName: '',
      tranProgress: '',
      assetCount: '',
      changeData: {},
    }
  },
  filters: {
    filterNum (v) {
      return (v || v===0) ? v : '--'
    }
  },
  created () {
    this.projectId = this.$route.query.projectId || ''
    this.type = this.$route.query.type
    this.assetTypes = this.$route.query.assetTypes
    this.attrBase()
  },
  mounted () {
  },
  methods: {
    tabChange (v) {
      console.log(v)
      this.showKey = v
    },
    // 基础信息
    attrBase () {
      let data = {
        projectId: this.projectId,
        assetTypes: this.assetTypes.length === 0 ? '' : this.assetTypes.join(',')
      }
      this.$api.basics.attrBase(data).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          this.noOwnershipCount = data.noOwnershipCount
          this.ownershipCount = data.ownershipCount
          this.waitOwnershipCount = data.waitOwnershipCount
          this.projectName = data.projectName || '--'
          this.tranProgress = data.tranProgress
          this.assetCount = data.assetCount
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 监听输入改变
    handleChange (o) {
      let {assetObjectId, settingMethod} = o
      // console.log('你好世界1=>', o, this.changeData)
      if (['2', '3'].includes(String(settingMethod))) {
        delete this.changeData[assetObjectId]
        return
      }
      this.changeData[String(assetObjectId)] = {...o}
    },
    handleSave () {
      let data = Object.values(this.changeData)
      if (data.length === 0) {
        this.$message.error('未改变权属办理设置或备注')
        return
      }
      let loadingName = this.SG_Loding('保存中...')
      this.$api.basics.attrSet(data).then(res => {
        this.DE_Loding(loadingName).then(() => {
          if (res.data.code === '0') {
            this.$SG_Message.success('保存设置成功')
            this.goPage('index')
          } else {
            this.$message.error(res.data.message)
          }
        })
        
      }, () => {
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error('保存失败！')
        })
      })
    },
    handleCancel () {
      this.goPage('index')
    },
    goPage(type, record) {
      let query = {
        refresh: true
      }
      this.$router.push({ path: operationTypes[type], query });
    },
  }
}
</script>
<style lang="less" scoped>
.detail-table-box{
  margin-left: 44px;
}
  .ownership-detail{
    padding: 42px 94px 61px 88px;
    min-height: 140px;
  }
  .detail-info-box{
    margin-left: 44px;
    margin-bottom: 40px;
    display: flex;
    color: #49505E;
    &>div{
      flex: 1 1 33.33%;
    }
  }
</style>
<style lang="less">
.projectOwnershipDetail{
  .ant-tabs-nav{
    margin-left: 14px;
    font-size: 14px;
  }
  .ant-tabs-bar{
    margin: 0 0 9px 0;
  }
  .ant-tabs-nav .ant-tabs-tab{
    margin: 0 48px 0 0;
    padding: 12px 0px;
  }
  .ant-tabs-ink-bar{
    height: 3px;
  }
}
  
</style>
