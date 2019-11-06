<!--房间信息-->
<template>
  <div class="houseInfo-page">
    <SearchContainer v-model="toggle">
      <div slot="headerBtns">
        <SG-Button class="mr10" icon="plus" type="primary">新增</SG-Button>
        <SG-Button class="mr10"><segiIcon type="#icon-ziyuan4" class="icon-right"/>房间资料导导入</SG-Button>
        <SG-Button class="mr10"><segiIcon type="#icon-ziyuan10" class="icon-right"/>房间导出</SG-Button>
        <SG-Button icon="sync">批量更新</SG-Button>
      </div>
      <div slot="contentForm">
        <div>
          <!-- 公司 -->
          <topOrganByUser @change="organIdChange" :formStyle="allWidth" v-model="queryCondition.organId" :hasAll="false" :selectFirst="true"/>
         <!-- 楼栋 -->
         <a-select
          showSearch
          placeholder="请选择楼栋"
          v-model="queryCondition.buildId"
          optionFilterProp="children"
          :style="allWidth"
          :options="buildOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
         />
         <!-- 单元 -->
         <a-select
          showSearch
          placeholder="请选择单元"
          v-model="queryCondition.unitId"
          optionFilterProp="children"
          :style="allWidth"
          :options="unitOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
         />
         <!-- 房号 -->
         <a-select
          showSearch
          placeholder="请选择房号"
          v-model="queryCondition.houseId"
          optionFilterProp="children"
          :style="allWidth"
          :options="houseOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
         />
         <SG-Button class="mr10" type="primary">查询</SG-Button>
         <SG-Button>清除</SG-Button>
        </div>
        <div class="two-row">
          <!-- 房屋建筑形态 -->
          <a-select
            showSearch
            placeholder="请选择建筑形态"
            v-model="queryCondition.houseCategory"
            optionFilterProp="children"
            :style="allWidth"
            :options="houseCategoryOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
            <!-- 房屋类型 -->
            <a-select
            showSearch
            placeholder="请选择房间类型"
            v-model="queryCondition.houseType"
            optionFilterProp="children"
            :style="allWidth"
            :options="houseTypeOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 房屋用途 -->
          <a-select
            showSearch
            placeholder="请选择房间用途"
            v-model="queryCondition.resType"
            optionFilterProp="children"
            :style="allWidth"
            :options="resTypeOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- 房屋状态 -->
          <a-select
            showSearch
            placeholder="请输入房间状态"
            v-model="queryCondition.houseStatus"
            optionFilterProp="children"
            :style="allWidth"
            :options="houseStatusOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
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
import topOrganByUser from '@/views/common/topOrganByUser'
const allWidth = {width: '170px', 'margin-right': '10px'}
let queryCondition = {
  organId: '',
  buildId: '',
  unitId: '',
  houseId: '',
  houseCategory: '', //建筑形态
  houseType: '', //房间类型
  resType: '', // 房间用途
  houseStatus: '', // 房间状态
}
export default {
  components: {
    SearchContainer,
    segiIcon,
    topOrganByUser
  },
  data () {
    return {
      allWidth,
      toggle: true,
      queryCondition: {...queryCondition},
      organIdOpt: [],
      buildOpt: [],
      unitOpt: [],
      houseOpt: [],
      houseCategoryOpt: [],
      houseTypeOpt: [],
      resTypeOpt: [],
      houseStatusOpt: [],
    }
  },
  methods: {
    query () {
      
    },
    // orangId改变
    organIdChange (o) {
      console.log('一级物业改变', o)
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  }
}
</script>
<style lang="less" scoped>
  .two-row{
    margin-top: 14px;
    text-align: right;
    padding-right: 190px;
  }
</style>
