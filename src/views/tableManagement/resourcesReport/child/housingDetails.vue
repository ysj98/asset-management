<!--
 * @Author: L
 * @Date: 2020-11-03 14:17:56
 * @LastEditTime: 2022-06-27 17:15:09
 * @Description: 房屋名称
-->
<template>
  <SG-Modal
    width="1030px"
    v-model="status"
    title="房屋详情"
    :footer="null"
    :noPadding="true"
    @cancel="cancel"
  >
  <overview-number :numList="numList" />
    <div class="housingDetails m15">
      <div class="mt10 mb10">
        <div style="text-align: right;" v-if="this.record.type === 1">
          <a-select
            showSearch
            placeholder="请选择单元"
            @change="watchUnitChange"
            v-model="queryCondition.unitId"
            optionFilterProp="children"
            :style="allStyle"
            :options="$addTitle(unitOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <a-select
            placeholder="请选择楼层"
            showSearch
            :style="allStyle"
            :options="$addTitle(floorOpt)"
            v-model="queryCondition.floorId"
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
            :style="allStyle"
            :options="$addTitle(houseOpt)"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <a-select
            placeholder="请选择状态"
            showSearch
            :style="allStyle"
            :options="$addTitle(houseStatusOpt)"
            v-model="queryCondition.houseStatus"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- <a-input v-model="queryCondition.houseId" placeholder="房号" maxlength="40" :style="allStyle" /> -->
          <SG-Button type="primary" style="margin-left: 10px;" @click="doSearch">查询</SG-Button>
        </div>
      </div>
      <div class="tab-nav">
        <div class="table-border table-layout-fixed">
        <a-table
          :scroll="{y: 450,x:800 }"
          :loading="loading"
          :columns="columns"
          :dataSource="tableData"
          class="custom-table td-pd10"
          :pagination="false"
          >
        </a-table>
        <no-data-tips v-show="tableData.length === 0"></no-data-tips>
        <SG-FooterPagination
          v-if="!isHouse"
          :pageLength="queryCondition.pageSize"
          :totalCount="count"
          :location="location"
          :noPageTools="noPageTools"
          v-model="queryCondition.pageNum"
          @change="handleChange"
        />
      </div>
    </div>
    </div>
  </SG-Modal>
</template>

<script>
import noDataTips from '@/components/noDataTips'
import OverviewNumber from 'src/views/common/OverviewNumber'
import { utils } from "@/utils/utils";
const unitOpt = [{ label: "全部单元", value: "" }]
const floorOpt = [{ label: "全部楼层", value: "" }]
const houseOpt = [{ label: "全部房号", value: "" }];
const houseStatusOpt = [{ label: "全部房屋状态", value: "" }, { label: "有效", value: "1" }, { label: "无效", value: "0" }]
const columns = [
  { title: '项目名称', dataIndex: 'communityName', width: 150 },
  { title: '楼栋名称', dataIndex: 'buildName', width: 150 },
  { title: '单元', dataIndex: 'unitName', width: 80 },
  { title: '楼层', dataIndex: 'floorName', width: 80 },
  { title: '房号', dataIndex: 'roomNo', width: 80 },
  { title: '房间面积(㎡)', dataIndex: 'area', width: 100 },
  { title: '资产构成', dataIndex: 'assetStructure', width: 100 },
  { title: '计租模式', dataIndex: 'billModeStr', width: 100 },
  { title: '可租面积(㎡)', dataIndex: 'rentableArea', width: 100 },
  { title: '租赁甲方', dataIndex: 'firstName', width: 100},
  { title: '使用方向', dataIndex: 'resTypeName', width: 100 },
  { title: '使用状态', dataIndex: 'busiStatus', width: 100},
  { title: '租赁用途', dataIndex: 'leaseUse', width: 100 },
  { title: '租户名称', dataIndex: 'lessee', width: 100 }
]
export default {
  components: {noDataTips, OverviewNumber},
  props: {
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      numList: [
        {title: '房间面积(㎡)', key: 'areaNum', value: 0, bgColor: '#FD7474'},
        {title: '可租面积(㎡)', key: 'rentableAreaNum', value: 0, bgColor: '#FE0974'}
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      allStyle: 'width: 170px; margin-left: 10px;',
      loading: false,
      status: false,
      columns,
      tableData: [],
      count: '',
      noPageTools: false,
      location: 'absolute',
      unitOpt: utils.deepClone(unitOpt),       // 单元数组
      floorOpt: utils.deepClone(floorOpt),     // 楼层数据
      houseOpt: utils.deepClone(houseOpt),
      houseStatusOpt: houseStatusOpt,          // 房屋状态
      queryCondition: {
        assetId: '',      // 资产ID
        unitId: '',       // 单元ID
        floorId: '',      // 楼层ID
        houseStatus: '',  // 房屋状态
        houseId: '',       // 房号
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  computed: {
    isHouse(){
      /*
      * type 1 楼栋
      * type 2 房屋
      * */
      return this.record.type === 2
    }
  },
  created () {
  },
  mounted () {
    this.queryCondition.assetId = this.record.assetId
    if (+this.record.type === 1) {
      // 根据楼栋请求单元
      this.getOptions('getUnitByBuildId', this.record.objectId)
    } else if (+this.record.type === 2) {
      this.queryCondition.houseId = this.record.objectId
    }
    this.query()
  },
  methods: {
    doSearch(){
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 选择框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 单元选择
    watchUnitChange () {
      this.queryAddFloorOptions(this.queryCondition.unitId, '1')
      this.getOptions("getHouseByUnitId", this.queryCondition.unitId);
    },
    // 请求楼层
    queryAddFloorOptions(positionId, subPositionType) {
      // 新增时 subPositionType 0: 楼栋，1，单元
      this.$api.basics.queryFloorListByPosId({ positionId, subPositionType }).then(res => {
        if (res.data.code === "0") {
          this.floorOpt.push(
            ...res.data.data.map(item => {
              return {
                label: item.floorName,
                value: item.floorId + "",
                key: item.floorId + ""
              }
            })
          )
        }
      })
    },
    query () {
      /*
      * type 1 楼栋
      * type 2 房屋
      * */
     console.log(this.record)
      let totalFn = this.$api.building.queryHouseStatisV2
      let apiFn = this.$api.building.queryHouseByPageV2
      if (this.isHouse){
        apiFn = this.$api.building.queryHouseByPageV3
        totalFn = this.$api.building.queryHouseStatisV3
      }
      this.loading = true
      let obj = {
        organId: this.record.organId,
        buildId: this.record.buildId,
        unitId: this.queryCondition.unitId,              // 单元ID
        floorId: this.queryCondition.floorId,            // 楼层ID
        status: this.queryCondition.houseStatus,         // 房屋状态
        houseId: this.queryCondition.houseId,             // 房号
        pageNum: this.queryCondition.pageNum,            // 当前页
        pageSize: this.queryCondition.pageSize           // 每页显示记录数
      }
      this.totalData = {areaNum: '', rentableAreaNum: ''}
      totalFn(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.numList[0].value = res.data.data.areaNum
          this.numList[1].value = res.data.data.rentableAreaNum
        }
      })
      apiFn(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = []
          if (!this.isHouse){
            data = res.data.data.data
          }else {
            data = res.data.data || []
          }
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
              item.statusName = +item.status === 0 ? '无效' : '有效'
            })
            this.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableData = []
            this.count = 0
          }
          this.loading = false
        } else {
          //this.tableData = this.tableData.length ? this.tableData.concat({...pageSum,projectName: '当前页-合计', key: Date.now()}, {...this.sumObj,projectName: '所有页-合计', key: Date.now()+100}) : []
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
   // 获取公司楼栋单元房号
    getOptions(type, value = "") {
      if (!type) {
        return;
      }
      let PARAMS = "";
      let resetArr = [];
      // 请求单元
      if (type === "getUnitByBuildId") {
        PARAMS = "#BUILD_ID:" + value;
        resetArr = utils.deepClone(unitOpt);
        this.unitOpt = resetArr;
      }
      // 以单元请求房号
      if (type === "getHouseByUnitId") {
        PARAMS = "#UNIT_ID:" + value;
        resetArr = utils.deepClone(houseOpt);
        this.houseOpt = resetArr;
      }
      // // 以楼栋请求房号
      // if (type === "getHouseByBuildId") {
      //   PARAMS = "#BUILD_ID:" + value;
      //   resetArr = utils.deepClone(houseOpt);
      //   this.houseOpt = resetArr;
      // }
      let data = {
        SQL_CODE: type,
        PARAMS: PARAMS
      }
      this.$api.basics.getOptions(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          resetArr.push(
            ...result.map(item => {
              return {
                label: item.C_TEXT,
                value: item.C_VALUE
              };
            })
          );
        }
      });
    },
    cancel () {
      this.status = false
      this.$emit('cancelFn')
    }
  }
}
</script>
<style lang="less" scoped>
.housingDetails {
  height: 600px;
  .tab-nav {
    height: 500px;
  }
}
</style>
