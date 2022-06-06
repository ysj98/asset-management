<template>
  <div>
    <!--搜索条件-->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button
          type="primary"
        >新建</SG-Button>
      </div>
      <div slot="headerForm">
        <div style="width: 75%; float: right; margin-right: 8px; text-align: left">
          <a-row :gutter="8">
            <a-col :span="12">
              <organ-project-building v-model="organProjectBuildingValue" mode="multiple" :multiple="true" :isShowBuilding="false"/>
            </a-col>
            <a-col :span="6"><InsuranceCompany/></a-col>
            <a-col :span="6"><a-input placeholder="保险单号/投保人" v-model="insuranceCode"/></a-col>
          </a-row>
        </div>
      </div>
      <div slot="contentForm">
        <a-row :gutter="8">
          <a-col :span="12"></a-col>
          <a-col :span="5">
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="请选择保险公司"
              @change="handleChange"
              :options="optionStatus"
            >
            </a-select>
          </a-col>
          <a-col :span="5">
            <InsuranceType/>
          </a-col>
          <a-col :span="2">
            <SG-Button type="primary" @click="queryTableData()">查询</SG-Button>
          </a-col>
        </a-row>
      </div>
    </search-container>
  </div>
</template>

<script>
import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
import SearchContainer from 'src/views/common/SearchContainer'
import InsuranceType from './components/InsuranceType.vue'
import InsuranceCompany from './components/InsuranceCompany.vue'
export default {
  components: {
    OrganProjectBuilding,
    SearchContainer,
    InsuranceType,
    InsuranceCompany
  },
  data () {
    return {
      organProjectBuildingValue: {},
      fold: true,
      insuranceCode: '',
      optionStatus: [
        {
          value: '1',
          label: '待承保'
        },
        {
          value: '2',
          label: '有效'
        },
        {
          value: '3',
          label: '终止'
        },
      ]
    }
  },
  methods: {
    handleChange () {},
    queryTableData () {}
  }
}
</script>

<style>

</style>