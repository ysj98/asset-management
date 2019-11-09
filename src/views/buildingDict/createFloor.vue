<!--
 * @Date: 2019-11-09 16:15:34
 * @Author: chen han
 * @Description: 新建楼层，编辑楼层，删除楼层
 -->
<template>
   <div class="createBuilding-page">
     <div class="title-box">
       <SG-Title noMargin :title="title" />
     </div>
     <FormFooter>
       <SG-Button class="mr10" @click="handleSave" type="primary">保存</SG-Button>
       <SG-Button @click="handleCancel" type="danger" ghost>删除</SG-Button>
     </FormFooter>
   </div>
</template>
<script>
import FormFooter from '@/components/FormFooter.vue'
export default {
  components: {
    FormFooter
  },
  props: {
    type: {
      default: 'edit'
    }
  },
  data () {
    return {}
  },
  computed: {
    title () {
      return this.type === 'edit' ? '编辑楼层' : '新增楼层'
    }
  },
  methods: {
    handleSave () {},
    handleCancel () {},
  }
}
</script>
<style lang="less" scoped>
  .createBuilding-page{
    height: 100%;
    padding: 36px 10px 0 50px;
    padding-bottom: 70px;
    position: relative;
    overflow: hidden;
    overflow-y: auto;
    position: relative;
  }
  .title-box{
    margin-bottom: 40px;
  }
</style>

