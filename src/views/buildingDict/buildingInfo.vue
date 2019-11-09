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
         <SG-Button v-if="activeType==='0'" @click="createPage('unit')" type="primary" class="fr tree-btn" weaken>新增单元</SG-Button>
         <SG-Button v-if="activeType==='1'" @click="createPage('floor')" type="primary" class="fr tree-btn" weaken>新增楼层</SG-Button>
         <SG-Button v-if="activeType==='-2'" @click="createPage('build')" type="primary" class="fr tree-btn" weaken>新增楼栋</SG-Button>
       </div>
     </div>
     <div class="tree-content">
       <positionTree @change="checkTreeChange" :organId="organId"/>
     </div>
    </div>
    <!-- 新增内容部分 -->
    <div class="create-content">
      <!-- 新建楼栋 -->
      <createBuild v-if="activeType==='0' || (activeType==='-2'&&pageType==='create')"/>
      <!-- 新建单元 -->
      <createUnit v-if="activeType==='1' || (activeType==='0'&&pageType==='create')"/>
      <!-- 新建楼层 -->
      <createFloor v-if="activeType==='2' || (activeType==='1'&&pageType==='create')"/>
      <!-- 无页面 -->
      <div v-if="!pageType" class="no_page"></div>
    </div>
  </div>
</template>
<script>
import positionTree from '@/views/common/positionTree'
import {utils, debounce} from '@/utils/utils'
import createBuild from './createBuild'
import createFloor from './createFloor'
import createUnit from './createUnit'
export default {
  components: {
    positionTree,
    createBuild,
    createFloor,
    createUnit
  },
  props: {
    organId: {
      default: ''
    }
  },
  data () {
    return {
      activeType: '', // -2楼栋列表，0楼栋, 1单元, 2楼层
      pageType: '', // create新增， edit编辑，
      activeItem: {}
    }
  },
  mounted () {
    this.computedHeight()
    window.addEventListener('resize', () => {
      this.debounceMothed()
    })
  },
  methods: {
    // 点击新增按钮
    createPage (type) {
     this.pageType = 'create'
    },
    // 点击树节点改变
    checkTreeChange (item) {
      console.log('点击树节点改变=>', item)
      this.activeType = String(item.subPositionType)
      this.pageType = 'edit'
      this.activeItem = {...item}
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
    width: 320px;
    height: 230px;
    margin-left: -160px;
    margin-top: -115px;
    background-image: url('../../assets/image/undertake/init_no.png');
    background-size: 100% 100%;
  }
</style>
