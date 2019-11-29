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
          <span class="detail-content">{{tranProgress | filterNum}}%</span>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="mb30">
          <SG-Title noMargin title="其他信息" />
      </div>
      <!-- 表格 -->
      <div class="detail-table-box" ref="table_box">
        <a-tabs @change="tabChange" v-model="showKey" :animated="false">
          <a-tab-pane :tab="noOwnershipCountText" key="noOwnership">
            <noCertOwnershipDetail :projectId="projectId" :type="type"/>
          </a-tab-pane>
          <a-tab-pane :tab="ownershipCountText" key="ownership">
            <hasCertOwnershipDetail :projectId="projectId" :type="type"/>
          </a-tab-pane>
          <a-tab-pane :tab="waitOwnershipCountText" key="waitOwnership">
            <waitCertOwnershipDetail :projectId="projectId" :type="type"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <FormFooter v-if="type==='set'" style="border:none;" location="fixed">
      <SG-Button class="mr2" @click="handleSave" type="primary">提交</SG-Button>
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
export default {
  components: {
    FormFooter,
    waitCertOwnershipDetail,
    noCertOwnershipDetail,
    hasCertOwnershipDetail
  },
  data () {
    return {
      type: '',
      projectId: '',
      scrollHeight: {y: 'auto'},
      showKey: 'noOwnership',
      noOwnershipCount: '',
      ownershipCount: '',
      waitOwnershipCount: '',
      projectName: '',
      tranProgress: '',
      assetCount: ''
    }
  },
  computed: {
    noOwnershipCountText () {
      return '无证(' + (this.noOwnershipCount || 0) + ')'
    },
    ownershipCountText () {
      return '有证(' + (this.ownershipCount || 0) + ')'
    },
    waitOwnershipCountText () {
      return '待办(' + (this.waitOwnershipCount || 0) + ')'
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
      }
      this.$api.basics.attrBase(data).then(res => {
        if (res.data.code === '0') {
          this.noOwnershipCount = res.data.noOwnershipCount
          this.ownershipCount = res.data.ownershipCount
          this.waitOwnershipCount = res.data.waitOwnershipCount
          this.projectName = res.data.projectName || '--'
          this.tranProgress = res.data.tranProgress
          this.assetCount = res.data.assetCount
          
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleSave () {},
    handleCancel () {},
  }
}
</script>
<style lang="less" scoped>
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
