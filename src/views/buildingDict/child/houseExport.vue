<!--
 * @Date: 2019-11-07 17:14:17
 * @Author: chen han
 * @Description: 房间资料导出
 -->
<template>
  <a-modal
  @cancel="closeModal"
      :title="modal.title"
      v-model="modal.show"
      :width="450"
      :keyboard="false"
      :maskClosable="false"
      :footer="null"
      :bodyStyle="{ 'overflow-y': 'auto',padding: '0 0px'}"
  >
   <div class="export-box">
     <div class="export-item">
     <a-select
        showSearch
        placeholder="请选择项目"
        @search="handleSearch"
        v-model="communityId"
        optionFilterProp="children"
        :defaultActiveFirstOption="false"
        :dropdownMatchSelectWidth="false"
        :style="inputStyple"
        :options="communityOpt"
        :allowClear="false"
        :filterOption="false"
        notFoundContent="没有查询到数据"
        />
       </div>
       <div class="export-item">
        <!-- 楼栋、 -->
        <a-select
        showSearch
        placeholder="请选择楼栋"
        v-model="buildId"
        optionFilterProp="children"
        :style="inputStyple"
        :options="buildOpt"
        :allowClear="false"
        :filterOption="filterOption"
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
        :allowClear="false"
        :filterOption="filterOption"
        notFoundContent="没有查询到数据"
        />
        </div>
        <div class="clearfix">
          <a-button class="fr" @click="exportHouse" type="primary">下载模板</a-button>
        </div>
   </div>
  </a-modal>
</template>
<script>
import {Modal, Select, Button} from 'ant-design-vue'
import Utils from '@/api/utils'
import * as api from '@/api/basicInfo.js'
import _ from 'lodash'
let fintItem = (data, value) => {
  // console.log('chuangruid', value)
  // let flag = true
  // if (flag) {
  //   return {label: 'a+b+c+d', value: '2'}
  // }
  if (!value) {
    return {label: '', value: ''}
  }
  return data.find(item => item.value === value)
}
export default {
  components: {
    AModal: Modal,
    ASelect: Select,
    AButton: Button
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inputStyple: {width: '100%'},
      modal: {
        title: '下载房间信息',
        show: false
      },
      communityId: undefined,
      buildId: undefined,
      unitId: undefined,
      communityOpt: [],
      buildOpt: [],
      unitOpt: []
    }
  },
  watch: {
    show (newVal) {
      this.modal.show = this.show
      if (!newVal) {
        // this.communityId = this.communityOpt[0].value
        this.getOptions('getCommunityByName')
        this.buildId = undefined
        this.unitId = undefined
        this.unitOpt = []
      }
    },
    communityId (newVal) {
      this.buildId = undefined
      this.unitId = undefined
      this.buildOpt = []
      this.unitOpt = []
      if (newVal) {
        this.getOptions('getBuildByRealCommunityId', newVal)
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
  mounted () {
    this.getOptions('getCommunityByName')
  },
  methods: {
    // 获取项目楼栋单元房号
    getOptions (type, value = '') {
      if (!type) {
        return
      }
      let PARAMS = ''
      let resetArr = []
      // 请求项目
      if (type === 'getCommunityByName') {
        PARAMS = '#NAME:'
        resetArr = []
        this.communityOpt = resetArr
      }
      // 请求楼栋
      if (type === 'getBuildByRealCommunityId') {
        PARAMS = '#COMMUNITY_ID:' + value
        this.buildOpt = resetArr
      }
      // 请求单元
      if (type === 'getUnitByBuildId') {
        PARAMS = '#BUILD_ID:' + value
        this.unitOpt = resetArr
      }
      let data = {
        SQL_CODE: type,
        PARAMS: PARAMS
      }
      api.getOptions(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          resetArr.push(...result.map(item => {
            return {
              label: item.C_TEXT,
              value: item.C_VALUE
            }
          }))
          // 如果请求的是项目，默认展示第一个
          if (type === 'getCommunityByName' && resetArr.length) {
            this.communityId = resetArr[0]['value']
          }
        }
      })
    },
    // 搜索后端数据
    updateOptions: _.debounce(function () {
      let data = {
        SQL_CODE: 'getCommunityByName',
        PARAMS: '#NAME:' + (this.searchCommunityName || '')
      }
      api.getOptions(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.communityOpt = result.map(item => {
            return {
              label: item.C_TEXT,
              value: item.C_VALUE
            }
          })
        }
      })
    }, 300),
    handleSearch (value) {
      this.searchCommunityName = value
      this.updateOptions()
    },
    exportHouse () {
      let data = {
        communityId: this.communityId || '',
        unitId: this.unitId || '',
        buildId: this.buildId || ''
      }
      data.communityName = fintItem(this.communityOpt, data.communityId).label
      data.buildName = fintItem(this.buildOpt, data.buildId).label
      data.unitName = fintItem(this.unitOpt, data.unitId).label
      let fromData = new FormData()
      for (let key in data) {
        data[key] = data[key].replace(/\+/g, '%2B')
        fromData.append(key, data[key])
      }
      api.exportHouse(fromData).then(res => {
        if (+res.data.code === 0) {
          let fileName = res.data.msg
          let temp = window.open(Utils.paths.basicinfo.house.downLoadExcel + '?fileName=' + fileName)
          temp.location.reload()
        } else {
          this.$message.error(res.data.msg)
        }
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

