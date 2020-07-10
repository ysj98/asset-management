<!--
 * @Author: LW
 * @Date: 2020-07-10 17:32:58
 * @LastEditTime: 2020-07-10 18:17:07
 * @Description: 基本下载
--> 
<template>
  <div class="basicDownload">
    <SG-Modal
      width="500px"
      v-model="modalShow"
      okText="下载模板"
      title="下载模板"
      @ok="commonFn"
    >
      <div>
        <div class="modal-nav">
          <a-radio-group v-model="checkboxAssetType">
            资产类型：<a-radio v-for="(item, index) in checkboxData" :key="index" disabled :value="item.value">{{item.name}}</a-radio>
          </a-radio-group>
        </div>
        楼栋名称：<a-select
        style="width: 300px"
        mode="multiple"
        :maxTagCount="4"
        showSearch
        placeholder="请选择楼栋"
        v-model="buildIds"
        @search="handleSearch"
        optionFilterProp="children"
        :options="buildIdsData"
        :allowClear="true"
        :filterOption="false"
        notFoundContent="没有查询到数据"
        />
        <div class="modal-nav">
          <a-checkbox-group v-model="scope">
            数据范围：<a-checkbox v-for="(item, index) in scopeData" :key="index" :value="item.value">{{item.name}}</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import {debounce} from '@/utils/utils'
const checkboxData = [
  {
    value: '1',
    name: '房屋'
  }, {
    value: '2',
    name: '土地'
  }, {
    value: '3',
    name: '设备'
  }
]
const scopeData = [
  {
    value: '1',
    name: '楼栋'
  }, {
    value: '2',
    name: '房屋'
  }
]
export default {
  components: {},
  props: {},
  data () {
    return {
      checkboxData,
      scopeData,
      checkboxAssetType: '1',
      registerOrderId: '',
      scope: ['1', '2'],
      buildIdsData: [],
      organId: '',
      modalShow: false,
      buildIds: []
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
    // 楼栋搜索
    handleSearch (value) {
      this.searchBuildName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
        this.queryBuildList(this.organId, this.searchBuildName || '')
    }, 200),
    // 请求楼栋列表默认20条
    queryBuildList (organId, buildName) {
      this.$api.basics.queryBuildList({organId, buildName: buildName || ''}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.buildIdsData = result.map(item => {
            return {name: item.buildName, value: item.buildId, label: item.buildName}
          })
        }
      })
    },
    // 下载模板确认
    commonFn () {
      if (!this.buildIds || this.buildIds.length < 0) {
        this.$message.info('请选择楼栋名称')
        return
      }
      if (this.scope.length < 0) {
        this.$message.info('请选择数据范围')
        return
      }
      if (this.scope.includes('1')) {
        this.checkBuildsObjectTypeFn()
      } else {
        this.confirmDownloadTemplate()
      }
    },
    // 下载模板
    downloadTemplate () {
      this.modalShow = true
    },
    // 资产登记-导出数据校验
    checkBuildsObjectTypeFn () {
      let obj = {
        buildIds: this.buildIds,
      }
      this.$api.assets.checkBuildsObjectType(obj).then(res => {
        if (res.data.code === '0') {
          this.confirmDownloadTemplate()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 模板下载
    confirmDownloadTemplate () {
      let obj = {
        registerOrderId: this.registerOrderId,
        assetType: this.checkboxAssetType,
        buildIds: this.buildIds,
        scope: this.scope.join(','),
        organId: this.organId
      }
      this.$api.assets.downloadTemplate(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产登记模板.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
        this.modalShow = false
      })
    },
  }
}
</script>
<style lang="less" scoped>
.modal-nav {
  line-height: 60px;
}
</style>