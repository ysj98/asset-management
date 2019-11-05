<!-- 楼盘字典 -->
<template>
  <div>
    <SG-SearchContainer v-model="fold">
      <div slot="headBtns">
        <SG-Button icon="plus" type="primary">新增</SG-Button>
      </div>
      <div slot="btns">
        <SG-Button icon="plus">查询</SG-Button>
      </div>
      <div slot="form">
        <a-input placeholder="default size" />
      </div>
    </SG-SearchContainer>
    <SearchContainer v-model="toggle">
      <div slot="headerBtns">
        <SG-Button icon="plus" type="primary">新增</SG-Button>
        <SG-Button icon="plus" type="primary">新增</SG-Button>
        <SG-Button icon="plus" type="primary">新增</SG-Button>
        <SG-Button icon="plus" type="primary">新增</SG-Button>
      </div>
      <div slot="headerForm">
        <a-input placeholder="default size" />
        <a-input placeholder="default size" />
      </div>
    </SearchContainer>
  </div>
</template>
<script>
import SearchContainer from '@/views/common/SearchContainer'
export default {
  components: {
    SearchContainer,
  },
  data () {
    return {
      fold: false,
      toggle: true,
    }
  },
}
</script>
