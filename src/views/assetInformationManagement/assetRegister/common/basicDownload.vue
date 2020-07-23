<!--
 * @Author: LW
 * @Date: 2020-07-10 17:32:58
 * @LastEditTime: 2020-07-23 16:46:27
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
        {{title}}：<a-select
        style="width: 300px"
        mode="multiple"
        :maxTagCount="4"
        showSearch
        :placeholder="`请选择${title}`"
        v-model="positionIds"
        @search="handleSearch"
        optionFilterProp="children"
        :options="positionNameData"
        :allowClear="true"
        :filterOption="false"
        notFoundContent="没有查询到数据"
        />
        <div class="modal-nav" v-if="checkboxAssetType === '1'">
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
    value: '4',
    name: '土地'
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
      positionNameData: [],
      organId: '',
      modalShow: false,
      positionIds: [],
      searchBuildName: '',
      title: ''
    }
  },
  computed: {
  },
  created () {
  },
  watch: {
    checkboxAssetType (val) {
      this.title = val === '1' ? '楼栋名称' : '土地名称'
    }
  },
  mounted () {
  },
  methods: {
    // 类型查询
    typesQueries (id, type) {
      this.organId = id
      if (type === '1') {
        this.checkboxAssetType = '1'
        this.positionApiList(id)
      } else {
        this.checkboxAssetType = '4'
        this.positionApiList(id)
      }
    },
    // 搜索
    handleSearch (value) {
      this.searchBuildName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
        this.positionApiList(this.organId, this.searchBuildName || '')
    }, 200),
    // 请求列表默认20条
    positionApiList (organId, aliasName) {
      this.$api.basics.positionApiList({organId, aliasName: aliasName || '', positionType: this.checkboxAssetType, subPositionType: ''}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.positionNameData = result.map(item => {
            return {name: item.aliasName, value: item.buildId, label: item.aliasName}
          })
        }
      })
    },
    // 下载模板确认
    commonFn () {
      // 房屋
      if (this.checkboxAssetType === '1') {
        if (!this.positionIds || this.positionIds.length === 0) {
          this.$message.info('请选择楼栋名称')
          return
        }
        if (this.scope.length < 0) {
          this.$message.info('请选择数据范围')
          return
        }
        if (this.scope.includes('1')) {
          this.checkBuildsObjectTypeFn('1')
        } else {
          this.confirmDownloadTemplate()
        }
      } else if (this.checkboxAssetType === '4') {
        if (!this.positionIds || this.positionIds.length === 0) {
          this.$message.info('请选择土地名称')
          return
        } else {
          this.checkBuildsObjectTypeFn('4')
        }
      }
    },
    // 下载模板
    downloadTemplate () {
      this.modalShow = true
    },
    // 资产登记-导出数据校验
    checkBuildsObjectTypeFn (val) {
      let obj = {
        buildIds: val === '1' ? this.positionIds : [],
        landIds: val === '4' ? this.positionIds : []
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
        registerOrderId: this.registerOrderId,  // 资产登记ID，修改时必填
        assetType: this.checkboxAssetType,      // 资产类型, 1房屋、2土地、3设备
        buildIds: this.checkboxAssetType === '1' ? this.positionIds : [],             // 楼栋id列表（房屋时必填）
        scope: this.checkboxAssetType === '1' ? this.scope.join(',') : '',            // 1楼栋 2房屋（房屋时必填）
        organId: this.organId,
        blankIdList: this.checkboxAssetType === '4' ? this.positionIds : []                         // 土地Id列表（土地时必填）
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