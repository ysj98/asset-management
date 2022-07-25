<!--
 * @Author: L
 * @Date: 2022-07-23 11:37:46
 * @LastEditTime: 2022-07-25 19:45:56
 * @Description: 明细表
-->
<template>
  <div class="schedule">
    <SearchContainer type="" v-model="toggle" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <SG-Button type="primary" @click="downloadFn">导出</SG-Button>
      </div>
      <div slot="headerForm" style="text-align: left; float: right">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
      </div>
      <div slot="contentForm" style="margin-top: 15px">
        <a-select
          v-model="queryCondition.projectId"
          :style="allStyle"
          :options="$addTitle(projectOptions)"
          placeholder="请选择资产项目"
          :filterOption="filterOption"
        ></a-select>
        <a-select :style="allStyle" placeholder="全部分类" v-model="queryCondition.objectType">
          <a-select-option :title="item.name" v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-input v-model.trim="queryCondition.assetNameOrCode" :style="allStyle" placeholder="资产名称"/>
        <a-input v-model.trim="queryCondition.resName" :style="allStyle" placeholder="资源名称"/>
        <SG-Button type="primary" style="margin-right: 10px;" @click="allQuery">查询</SG-Button>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed" :class="{'overflowX': tableData.length === 0}">
      <a-table
        bordered
        class="custom-total-one"
        :scroll="scroll"
        :loading="loading"
        :columns="columns"
        :dataSource="tableData"
        :pagination="false"
        >
      </a-table>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        :location="location"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import TreeSelect from '../common/treeSelect'
import SearchContainer from '@/views/common/SearchContainer'
import { getFormat } from "@/utils/utils";
import { scheduleOfList, scheduleTotalKeyArr } from './common.js'
export default {
  components: {TreeSelect,SearchContainer},
  props: {},
  data () {
    return {
      allStyle: 'width: 170px; margin-right: 10px;',
      scroll: {x: 3000, y: 'calc(100vh - 370px)'},
      toggle: true,
      loading: false,
      noPageTools: false,
      location: 'absolute',
      columns: scheduleOfList,
      count: '',
      tableData: [],
      queryCondition: {
        organId: '',
        projectId: '',
        assetType: '',
        objectType: '',
        assetNameOrCode: '',
        resName: '',
        pageSize: 10,
        pageNum:1
      },
      projectOptions: [],
      assetClassifyData: []
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    // this.queryCondition.type = this.$route.query.type
    this.queryCondition.assetType = this.$route.query.assetType
    // console.log(this.queryCondition, 'dsfdsfs')
  },
  methods: {
    // 查询
    allQuery (str) {
      this.queryCondition.pageNum = 1
      this.query(str)
    },
    query () {
      this.tableData = []
      this.$api.assetUsageList.queryYueXinReportByAssetDetail(this.queryCondition).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.assetId = +this.queryCondition.assetType === 1 ? item.assetHouseId :  item.assetLandId
              item.key = index
            })
            let tempArr = ['organId', 'projectId', 'assetId', 'assetCode'] // 前四列的合并行
            let map = {}
            tempArr.forEach((element) => {
              data.forEach(item => {
                if (item[element]) {
                  if (!map[item[element]]) {
                    map[item[element]] = {
                      item: item
                    }
                    item[element + 'Len'] = 1
                  } else {
                    item[element + 'Len'] = 0
                    map[item[element]].item[element + 'Len'] += 1
                  }
                } else {
                  item[element + 'Len'] = 1
                }
              })
            })
            this.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableData = []
            this.count = 0
          }
          this.loading = false
          this.assetViewTotal()
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 明细统计
    assetViewTotal () {
      this.overviewNumSpinning = true
      let obj = {
        ...this.queryCondition
      }
      this.$api.assetUsageList.queryYueXinReportByAssetDetailTotal(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || []
          data.key = 'sg-t'
          data.organName = '合计'
          this.tableData.push(data)
          this.handleNumber(this.tableData)
          this.overviewNumSpinning = false
        } else {
          this.$message.error(res.data.message)
          this.overviewNumSpinning = false
        }
      })
    },
    // 千分位展示
    handleNumber(dataSource){
      dataSource.forEach(ele=>{
        Object.keys(ele).forEach(keyStr=>{
          if (scheduleTotalKeyArr.includes(keyStr)){
            if (!isNaN(Number(ele[keyStr]))){
              ele[keyStr] = getFormat(ele[keyStr]) || "0"
            }
          }
        })
      })
    },
    downloadFn () {
      this.$api.assetUsageList.exportQueryYueXinReportByAssetDetail(this.queryCondition).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产使用明细表.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.projectId = ''
      this.queryCondition.objectType = ''
      this.projectFn()
      this.getListFn()
      this.allQuery()
    },
    projectFn () {
      this.$api.assets.getObjectKeyValueByOrganId({organId: this.queryCondition.organId}).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          this.projectOptions = (res.data || []).map(item => {
            return {
              key: item.projectId,
              title:item.projectName
            }
          })
          this.projectOptions = [{title: '全部资产项目', key: ''}, ...this.projectOptions]
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 选择框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 资产分类列表
    getListFn () {
      if (!this.queryCondition.organId) {
        return
      }
      let obj = {
        organId: this.queryCondition.organId,
        assetType: this.queryCondition.assetType 
      }
      this.$api.assets.getList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.professionName,
              value: item.professionCode
            })
          })
          this.assetClassifyData = [{name: '全部资产分类', value: ''}, ...arr]
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.schedule {
  /deep/.ant-table-tbody {
  tr:nth-last-child(1){
    border: 1px solid #ccc;
    position: sticky;
    bottom: 4px;
    background: #fff;
  }
  // tr:nth-last-child(2){
  //   position: sticky;
  //   bottom: 43px;
  //   background: #fff;
  // }
}
.landAssetsView {
  .from-second {
    padding-top: 14px;
  }
  .box {
    display: inline-block;
  }
  .box-left {
    margin-left: 10px;
  }
  .custom-table {
    padding-bottom: 70px;
  }
  .overflowX{
    /deep/ .ant-table-scroll {
      overflow-x: auto;
    }
    /deep/.ant-table-header {
      padding-bottom: 0px !important;
      margin-bottom: 0px !important;
    }
  }
  .city {
    float: right;
    margin-right: 8px;
    /deep/.ant-col-8 {width: 180px;}
    /deep/.province_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.city_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.district_style {
      width: 170px;
      margin: 14px 10px 0 0;
      flex: 1;
      margin-top: 14px;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.search-content-box{
  display: flex;
  justify-content: space-between;
  .search-from-box{
    flex: 1;
    flex-wrap: wrap;
    text-align: right;
  }
  .two-row-box{
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
.tab-red-color {
  color: red;
  cursor: pointer
}
.tab-text-decoration {
  text-decoration: underline;
}
}
</style>