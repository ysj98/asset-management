<!--
 * @Author: L
 * @Date: 2020-11-03 14:17:56
 * @LastEditTime: 2020-11-18 11:47:54
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
            :options="unitOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <a-select
            placeholder="请选择楼层"
            showSearch
            :style="allStyle"
            :options="floorOpt"
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
            :options="houseOpt"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <a-select
            placeholder="请选择状态"
            showSearch
            :style="allStyle"
            :options="houseStatusOpt"
            v-model="queryCondition.houseStatus"
            :allowClear="false"
            :filterOption="filterOption"
            notFoundContent="没有查询到数据"
          />
          <!-- <a-input v-model="queryCondition.houseId" placeholder="房号" maxlength="40" :style="allStyle" /> -->
          <SG-Button type="primary" style="margin-left: 10px;" @click="query">查询</SG-Button>
        </div>
      </div>
      <div class="tab-nav">
        <div class="table-border table-layout-fixed">
        <a-table
          :scroll="{y: 450 }"
          :loading="loading"
          :columns="columns"
          :dataSource="tableData"
          class="custom-table td-pd10"
          :pagination="false"
          >
        </a-table>
        <no-data-tips v-show="tableData.length === 0"></no-data-tips>
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
    </div>
  </SG-Modal>
</template>

<script>
import noDataTips from '@/components/noDataTips'
import { utils } from "@/utils/utils";
const unitOpt = [{ label: "全部单元", value: "" }]
const floorOpt = [{ label: "全部楼层", value: "" }]
const houseOpt = [{ label: "全部房号", value: "" }];
const houseStatusOpt = [{ label: "全部房屋状态", value: "" }, { label: "有效", value: "1" }, { label: "无效", value: "0" }]
const columns = [
  // { title: '资产编码', dataIndex: 'assetCode' },
  // { title: '资产名称', dataIndex: 'assetName'},
  // { title: '资产形态', dataIndex: 'typeName'},
  // { title: '资产面积(㎡)', dataIndex: 'assetArea' },
  { title: '楼栋名称', dataIndex: 'buildName' },
  { title: '单元', dataIndex: 'unitName' },
  { title: '楼层', dataIndex: 'floorName' },
  { title: '房号', dataIndex: 'roomNo' },
  { title: '房间面积(㎡)', dataIndex: 'area' },
  { title: '房间状态', dataIndex: 'statusName' }
]
export default {
  components: {noDataTips},
  props: {
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
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
      this.loading = true
      let obj = {
        organId: this.record.organId,
        buildId: this.record.buildId,
        unitId: this.queryCondition.unitId,              // 单元ID
        floorId: this.queryCondition.floorId,            // 楼层ID
        status: this.queryCondition.houseStatus,         // 房屋状态
        houseId: this.queryCondition.houseId,             // 房号
        pageNo: this.queryCondition.pageNum,            // 当前页
        pageLength: this.queryCondition.pageSize           // 每页显示记录数
      }
      this.$api.building.queryHouseByPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
              item.statusName = +item.status === 0 ? '无效' : '有效'
            })
            this.tableData = data
            this.count = res.data.paginator.totalCount
          } else {
            this.tableData = []
            this.count = 0
          }
          this.loading = false
        } else {
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