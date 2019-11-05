<!--房间信息-->
<template>
  <div class="houseInfo-page">
    <SearchContainer v-model="toggle">
      <div slot="headerBtns">
        <SG-Button class="mr10" icon="plus" type="primary">新增</SG-Button>
        <SG-Button class="mr10"><segiIcon type="#icon-ziyuan10" class="icon-right"/>房间资料导出</SG-Button>
        <SG-Button class="mr10"><segiIcon type="#icon-ziyuan10" class="icon-right"/>房间导出</SG-Button>
        <SG-Button icon="sync">批量更新</SG-Button>
      </div>
      <div slot="contentForm">
        <div>
          
        </div>
        <div>

        </div>
      </div>
    </SearchContainer>
  </div>
</template>
<script>
import SearchContainer from '@/views/common/SearchContainer'
import segiIcon from '@/components/segiIcon.vue'
const allWidth = {width: '150px', 'margin-right': '10px'}
export default {
  components: {
    SearchContainer,
    segiIcon
  },
  data () {
    return {
      allWidth,
      toggle: true,
    }
  },
}
</script>
