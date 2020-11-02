<!--
 * @Date: 2019-11-07 17:14:17
 * @Author: chen han
 * @Description: 房间导出
 -->
<template>
<SG-Modal
    @cancel="hiddeModal"
    title="导出房间信息"
    v-model="visible"
    :width="450"
    :maskClosable="false"
    :noPadding="true"
    :keyboard="false"
    :footer="null"
    :bodyStyle="{ 'overflow-y': 'auto',padding: '0 0px'}"
  >
   <div class="export-box">
     <div class="export-item">
     <a-select
        showSearch
        placeholder="请选择公司"
        v-model="organId"
        optionFilterProp="children"
        :defaultActiveFirstOption="false"
        :dropdownMatchSelectWidth="false"
        :style="inputStyple"
        :options="organOpt"
        :allowClear="false"
        :filterOption="filterOption"
        notFoundContent="没有查询到数据"
        />
       </div>
       <div class="export-item">
        <!-- 楼栋、 -->
        <a-select
        showSearch
        placeholder="请选择楼栋"
        v-model="buildId"
        @search="handleSearch"
        optionFilterProp="children"
        :style="inputStyple"
        :options="buildOpt"
        :allowClear="true"
        :filterOption="false"
        notFoundContent="没有查询到数据"
        />
        </div> 
        <div class="export-item">
        <!-- 单元 -->
        <a-select
        showSearch
        placeholder="请选择单元"
        v-model="unitId"
        optionFilterProp="children"
        :style="inputStyple"
        :options="unitOpt"
        :allowClear="true"
        :filterOption="filterOption"
        notFoundContent="没有查询到数据"
        />
        </div>
        <div class="clearfix">
          <a-button class="fr" @click="exportHouse" type="primary">导出</a-button>
        </div>
   </div>
</SG-Modal>
</template>
<script>
import {utils, debounce} from '@/utils/utils'
// let getUuid = ((uuid = 1) => () => ++uuid)()
let fintItem = (data, value) => {
  if (!value) {
    return {label: '', value: ''}
  }
  return data.find(item => item.value === value)
}
export default {
  props: {
    organIdCopy: {
      default: ''
    }
  },
  data () {
    return {
      // uuid: getUuid(),
      visible: false,
      inputStyple: {width: '100%'},
      organName: '',
      organId: undefined,
      buildId: undefined,
      unitId: undefined,
      organOpt: [],
      buildOpt: [],
      unitOpt: []
    }
  },
  watch: {
    organIdCopy (nv) {
      if (nv) {
        this.organId = nv
      }
    },
    visible (newVal) {
      if (!newVal) {
        this.hiddeModal()
      }
    },
    organId (newVal) {
      this.buildId = undefined
      this.unitId = undefined
      this.buildOpt = []
      this.unitOpt = []
      if (newVal) {
        this.queryBuildList(newVal)
      }
    },
    buildId (newVal) {
      this.unitId = undefined
      this.unitOpt = []
      if (newVal) {
        this.getOptions('getUnitByBuildId', newVal)
      }
    }
  },
  created () {
    if (this.organIdCopy) {
      console.log('ssss')
      this.organId = this.organIdCopy
    }
  },
  mounted () {
    this.queryAllTopOrganByUser()
  },
  methods: {
    // 隐藏弹窗
    hiddeModal () {
      this.buildId = undefined
      this.unitId = undefined
      this.unitOpt = []
    },
    // 请求一级物业
    queryAllTopOrganByUser () {
      this.$api.basics.queryAllTopOrganByUser({}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.organOpt = result.map(item => {
            return {label: item.organName, value: item.organId}
          })
          // 默认选中第一个
          if (this.organId) {
            return
          }
          if (this.organOpt.length) {
            this.organId = this.organOpt[0].value
          }
        }
      })
    },
    // 请求楼栋列表默认20条
    queryBuildList (organId, buildName) {
      this.$api.basics.queryBuildList({organId, buildName: buildName || ''}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.buildOpt = result.map(item => {
            return {label: item.buildName, value: item.buildId}
          })
        }
      })
    },
    // 请求单元楼层
    getOptions (type, value = '') {
      if (!type) {
        return
      }
      let PARAMS = ''
      let resetArr = []
      // 请求单元
      if (type === 'getUnitByBuildId') {
        PARAMS = '#BUILD_ID:' + value
        this.unitOpt = resetArr
      }
      let data = {
        SQL_CODE: type,
        PARAMS: PARAMS
      }
      this.$api.basics.getOptions(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          resetArr.push(...result.map(item => {
            return {
              label: item.C_TEXT,
              value: item.C_VALUE
            }
          }))
        }
      })
    },
    // 楼栋搜索
    handleSearch (value) {
      this.searchBuildName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
        this.queryBuildList(this.organId, this.searchBuildName || '')
    }, 200),
    exportHouse () {
      let data = {
        organId: this.organId || '',
        unitId: this.unitId || '',
        buildId: this.buildId || ''
      }
      let organName = fintItem(this.organOpt, data.organId).label
      let buildName = fintItem(this.buildOpt, data.buildId).label
      let unitName = fintItem(this.unitOpt, data.unitId).label
      let loadingName = this.SG_Loding('导出中...')
      this.$api.building.exportHouse(data).then(res => {
        this.DE_Loding(loadingName).then(() => {
          this.visible = false
          let blob = new Blob([res.data])
            let a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            // ${this.organName}
            a.download = `${organName + buildName + unitName}房间.xls`
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
        })
      }, () => {
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error('导出失败！')
        })
      })
    },
    closeModal () {
      this.$emit('close')
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
<style lang="less" scoped>
.export-box{
  text-align: center;
  padding: 20px;
  .export-item{
    margin-bottom: 20px;
  }
}
</style>

