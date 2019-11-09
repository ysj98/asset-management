<!--
 * @Date: 2019-11-07 17:14:17
 * @Author: chen han
 * @Description: 房间资料导入
 -->
<template>
   <a-modal
    @cancel="cancel"
    title="导入数据"
    v-model="visible"
    :width="543"
    :keyboard="false"
    :maskClosable="false"
    :footer="null"
    :bodyStyle="{ 'overflow-y': 'auto',padding: '0 0px'}"
    >
    <div class="export-box">
      <!-- 导入头部 -->
       <div class="export-head">
         <div>
           <SG-Button @click="downHouseSource" type="primary" weaken>下载房屋资料模板</SG-Button>
           <SG-Button @click="handleUpload" class="right-btn" type="primary" weaken>上传文件</SG-Button>
         </div>
         <div :style="inputStyple">
           <a-select
            showSearch
            placeholder="请输入项目名称"
            @search="handleSearch"
            v-model="communityId"
            optionFilterProp="children"
            :defaultActiveFirstOption="false"
            :dropdownMatchSelectWidth="true"
            :style="inputStyple"
            :options="communityOpt"
            :allowClear="false"
            :filterOption="false"
            notFoundContent="没有查询到数据"
            />
         </div>
       </div>
       <!-- 中间内容 -->
       <div class="data-box">
           <div class="not_data" v-if="!fileName">  
             <div class="not_data_img">
              </div>
              <div class="tip">
                暂无数据
              </div> 
           </div>
           <div class="data-item" v-else>
             <span>{{fileName}}</span>
             <a-icon type="close" class="delete-icon" @click="deleteFile"/>
           </div>
       </div>
      <!-- 底部按钮 -->
      <div class="footer">
        <SG-Button @click="handleSave"  type="primary" class="padd-lr-30 marg-r-12">
          导入
        </SG-Button>
        <SG-Button type="cancel" class="padd-lr-30" @click="cancel">
          取消
        </SG-Button>
      </div>
      <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
    </div>
    <importReulte :tipText="tipText" ref="importReulte" />
   </a-modal>
</template>
<script>
import * as api from '@/api/basicInfo.js'
import importReulte from './importReulte.vue'
import {Modal, Select, Button, Icon} from 'ant-design-vue'
import _ from 'lodash'
export default {
  components: {
    importReulte,
    AModal: Modal,
    ASelect: Select,
    AButton: Button,
    AIcon: Icon
  },
  data () {
    return {
      visible: false,
      searchCommunityName: '',
      communityOpt: [],
      communityId: '',
      inputStyple: {width: '165px'},
      fileName: '',
      formData: null,
      fileMaxSize: 10240,
      fileType: ['xls', 'xlsx'],
      tipText: ''
      // fileName: '培训分享计划跟踪表.png'
    }
  },
  watch: {
    visible (nv) {
      if (nv) {
        this.getOptions('getCommunityByName')
      }
    }
  },
  created () {
    // this.getOptions('getCommunityByName')
  },
  methods: {
    hiddeModal () {
      this.visible = false
      this.searchCommunityName = ''
      this.communityOpt = []
      this.communityId = ''
      this.fileName = ''
      this.formData = null
      this.$refs.fileUpload.value = ''
    },
    handleSave () {
      if (this.formData === null) {
        return this.$message.error('请先上传文件!')
      }
      let loadingName = this.$SG_Message.loading({content: '导入中...'})
      api.houseImport(this.formData, this.communityId).then(res => {
        this.$SG_Message.destroy(loadingName)
        if (res.data.code === '0') {
          this.$SG_Message.success('导入成功!')
          this.hideModal()
        } else {
          this.$SG_Message.destroy(loadingName)
          // this.$message.error(res.data.message, 4)
          this.$SG_Message.error('导入部分数据失败!')
          this.$refs.importReulte.visible = true
          this.tipText = res.data.message
        }
      }, () => {
        this.$SG_Message.destroy(loadingName)
        this.$SG_Message.error('导入失败!')
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
    change (files, e) {
      if (!files.length) {
        return
      }
      let fileData = new FormData()
      fileData.append('file', files[0])
      let validObj = this.checkFile(files[0].name, files[0].size)
      if (!validObj.type) {
        this.$message.error('上传文件类型错误!')
        return
      }
      if (!validObj.size) {
        this.$message.error(`文件大小超过${this.fileMaxSize}Kb`)
        return
      }
      this.fileName = files[0].name
      this.formData = fileData
    },
    // 上传文件
    handleUpload () {
      this.$refs.fileUpload.click()
    },
    // 下载文件
    downHouseSource () {
      if (!this.communityId) {
        return this.$message.error('请选择项目!')
      }
      let loadingName = this.$SG_Message.loading({content: '下载中...'})
      api.downloadHouseImport(this.communityId).then(res => {
        console.log('res', res)
        if (res.data.code === '0' && res.data.data) {
          let fileName = res.data.data
          api.downloadHouseImportModule(fileName).then(res => {
            this.$SG_Message.destroy(loadingName)
            let blob = new Blob([res.body])
            let a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = fileName
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
          }, rej => {
            this.$SG_Message.destroy(loadingName)
          })
        } else {
          this.$SG_Message.destroy(loadingName)
          this.$SG_Message.error('导出房间模板失败!')
        }
      }, () => {
        this.$SG_Message.destroy(loadingName)
      })
    },
    cancel () {
      this.hiddeModal()
      this.$emit('cancel')
    },
    deleteFile () {
      this.fileName = ''
      this.formData = null
      this.$refs.fileUpload.value = ''
    },
    handleSearch (value) {
      this.searchCommunityName = value
      this.updateOptions()
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
    }
  }
}
</script>
<style lang="less" scopes>
.export-box{
  padding: 0px 30px;
}
.footer{
  margin: 20px;
  text-align: center;
}
.export-head{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  border-bottom: 1px dashed rgba(237,240,244,1);
}
.right-btn{
  margin-left: 10px;
}
.data-box{
  color: #0084FF;
  font-size: 12px;
  min-height: 185px;
  .data-item{
    padding: 10px;
    color: #0084FF;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .delete-icon{
      color: #FD7474;
      display: none;
    }
    &:hover{
      background: rgba(240,248,255,1);
      .delete-icon{
        display: block;
        cursor: pointer;
      }
    }
  }
  .not_data{
    width:125px;
    margin: auto;
    padding-top: 30px;
    .not_data_img{
      height: 103px;
      background-image: url('../../../assets/image/house/house_no_data.png');
      background-size: 100% 100%;
    }
    .tip{
      text-align: center;
      color: #C4CBD4;
    }
  }
}
</style>
