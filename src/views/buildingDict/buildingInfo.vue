<!--
 * @Date: 2019-11-05 16:16:20
 * @Author: chen han
 * @Description: 楼栋信息
 -->
<template>
  <div class="buildingInfo-page" ref="buildingInfo">
    <!-- 树结构部分 -->
    <div class="tree-box">
      <!-- 按钮控制 -->
     <div class="create-btn">
       <span class="create-title" >楼栋信息</span>
       <div>
         <SG-Button v-if="showCreateFloorBtn" @click="createPage('floor')" type="primary" class="fr tree-btn" weaken>新增楼层</SG-Button>
         <SG-Button v-if="showCreateUnitBtn" :class="[childNodeType==='0'&&'mr5']" @click="createPage('unit')" type="primary" class="fr tree-btn" weaken>新增单元</SG-Button>
         <SG-Button v-if="showCreateBuildBtn" @click="createPage('build')" type="primary" class="fr tree-btn" weaken>新增楼栋</SG-Button>
         <SG-Button v-if="showCreateBuildBtn" @click="openImportModal('build')" type="primary" class="fr tree-btn mr5" weaken>批量导入楼栋</SG-Button>
       </div>
     </div>
     <div class="tree-content">
       <positionTree @change="checkTreeChange" ref="positionTree" :organId="organId"/>
     </div>
    </div>
    <!-- 新增内容部分 -->
    <div class="create-content">
      <!-- 新建楼栋 -->
      <createBuild :type="pageType" @success="handleBuildSucc" :organId="organId" :objectData="activeItem"  v-if="showCreateBuild"/>
      <!-- 新建单元 -->
      <createUnit :type="pageType" @success="handleBuildSucc" :organId="organId" :objectData="activeItem" v-if="showCreateUnit"/>
      <!-- 新建楼层 -->
      <createFloor :type="pageType" @success="handleBuildSucc" :organId="organId" :objectData="activeItem" v-if="showCreateFloor"/>
      <!-- 无页面 -->
      <div v-if="!pageType" class="no_page">
        <div class="img-box"></div>
        <div class="mt10">点击左侧位置树，添加楼栋</div>
      </div>
    </div>
    <!-- 批量更新 -->
    <eportAndDownFile @upload="uploadModeFile" @down="downModeFile" ref="eportAndDownFile" title="批量导入楼栋"/>
  </div>
</template>
<script>
import positionTree from '@/views/common/positionTree'
import {utils, debounce} from '@/utils/utils'
import createBuild from './createBuild'
import createFloor from './createFloor'
import createUnit from './createUnit'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import eportAndDownFile from '@/views/common/eportAndDownFile.vue'
export default {
  components: {
    positionTree,
    createBuild,
    createFloor,
    createUnit,
    eportAndDownFile
  },
  props: {
    organId: {
      default: ''
    }
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      activeType: '', // -2楼栋列表，0楼栋, 1单元, 2楼层
      pageType: '', // create新增， edit编辑，
      createType: '', // unit新建单元，build新建楼栋，floor新建楼层 
      activeItem: {},
      childNodeType: '', // 0可新建楼栋, 1单元， 2楼层
    }
  },
  watch: {
    organId (nv) {
      if (nv) {
        this.resetInit()
      }
    }
  },
  computed: {
    showCreateBuild () {
      return (this.activeType==='0' && this.createType === '') 
             || (this.activeType==='-2'&&this.createType==='build')
    },
    showCreateUnit () {
      return (this.activeType==='1' && this.createType === '') 
             || (this.activeType==='0' && this.createType==='unit')
    },
    showCreateFloor () {
      return (this.activeType==='2' && this.createType === '') 
             || (this.activeType==='0' && this.createType === 'floor')
             || (this.activeType==='1'&&this.createType === 'floor')
    },
    // 显示创建楼栋按钮
    showCreateBuildBtn () {
      return (this.activeType==='-2')&&this.$power.has(ASSET_MANAGEMENT.ASSET_BUILD_ADD)
    },
    // 显示创建单元按钮
    showCreateUnitBtn () {
      return (this.activeType==='0'&&['0', '1'].includes(this.childNodeType))&&this.$power.has(ASSET_MANAGEMENT.ASSET_UNIT_ADD)
    },
    // 显示楼层按钮
    showCreateFloorBtn () {
      return (this.activeType==='0'&&['0', '2'].includes(this.childNodeType) 
             || this.activeType==='1')&&this.$power.has(ASSET_MANAGEMENT.ASSET_FLOOR_ADD)
    }
  },
  mounted () {
    // this.computedHeight()
    // window.addEventListener('resize', () => {
    //   this.debounceMothed()
    // })
  },
  methods: {
    // 初始化数据
    resetInit () {
      if (this.activeType !== '-2') {
        this.activeType = '' // -2楼栋列表，0楼栋, 1单元, 2楼层
      }
      this.pageType = '' // create新增， edit编辑，
      this.createType = '' // unit新建单元，build新建楼栋，floor新建楼层 
      this.activeItem = {}
      this.childNodeType = '' // 0可新建楼栋, 1单元， 2楼层
    },
    handleBuildSucc (type) {
      if (type === 'delete') {
        this.resetInit()
      }
      this.$refs.positionTree.resetLoad()
    },
    // 点击新增按钮
    createPage (type) {
     this.pageType = 'create'
     this.createType = type
     console.log('点击新增=>', type)
    },
    // 点击树节点改变
    checkTreeChange (item) {
      this.activeType = String(item.subPositionType)
      this.pageType = this.activeType === '-2' ? '' :'edit'
      this.createType = ''
      this.activeItem = {...item}
      // 如果点击的是树结构
      if (this.activeType === '0') {
        this.$api.building.queryBellowPositionType({positionId: item.positionId}).then(res => {
          if (res.data.code === '0') {
            this.childNodeType = res.data.data
          }
        })
      } else {
        this.childNodeType = ''
      }
      console.log('点击树节点改变=>', item, this.activeType, this.pageType)
    },
    // 下载模板文件
    downModeFile () {
      let loadingName = this.SG_Loding('下载中...')
      this.$api.building.buildingDownLoadExcel().then(res => {
          this.$SG_Message.destroy(loadingName)
          let blob = new Blob([res.data])
          let a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          // ${this.organName}
          a.download = `导入楼栋模板.xls`
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
      }, () => {
        this.$SG_Message.destroy(loadingName)
        this.$SG_Message.error('附属配套模板!')
      })
    },
    // 上传文件
    uploadModeFile (file) {
      // this.$refs.eportAndDownFile.hideModal()
      console.log('批量更新', file)
      let fileData = new FormData()
      fileData.append('file', file)
      let loadingName = this.SG_Loding('导入中...')
      this.$api.building.buildImportExcel(this.organId, fileData).then(res => {
        if (res.data.code === '0') {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('导入成功！')
            this.$refs.positionTree.resetLoad()
          }) 
        } else {
          this.DE_Loding(loadingName).then(() => {
            // this.$refs.downErrorFile.visible = true
            // this.upErrorInfo = res.data.message
            this.$SG_Message.error(res.data.message || '导入失败！')
          })
        }
      }, () => {
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error('导入失败！')
        })
      })
    },
    // 显示导入弹窗
    openImportModal () {
      this.$refs.eportAndDownFile.visible = true
    },
    computedHeight () {
      let elem = this.$refs.buildingInfo
      if (!elem) {
        return
      }
      utils.AdjustHeight(elem)
    },
    // 防抖函数
    debounceMothed: debounce(function () {
      this.computedHeight()
    }, 200)
  }
}
</script>
<style lang="less" scoped>
  .buildingInfo-page{
    border:1px solid rgba(238,242,245,1);
    border-radius:0px 4px 4px 4px;
    border-top: none;
    margin: 30px;
    margin-top: 0;
    display: flex;
    height: calc(100vh - 132px);
    .tree-box{
      flex: 0 0 265px;
      height: 100%;
      border-right: 1px solid rgba(238,242,245,1);
      .tree-content{
        height: calc(~"100% - 69px");
        overflow: auto;
      }
      .tree-btn{
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .create-content{
      flex: 1;
      height: 100%;
      position: relative;
    }
  }
  .create-btn{
    height: 69px;
    padding-left: 20px;
    padding-right: 15px;
    border-bottom: 1px solid rgba(238,242,245,1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .create-title{
      color: #282D5B;
      font-size: 14px;
    }
  }
  .no_page{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 214px;
    margin-left: -107px;
    margin-top: -77px;
    text-align: center;
    .img-box{
      height: 154px;
      background-image: url('../../assets/image/undertake/init_no.png');
      background-size: 100% 100%;
    }
  }
</style>
