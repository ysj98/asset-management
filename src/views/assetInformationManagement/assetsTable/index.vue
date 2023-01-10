<!--
  资产出库
-->
<template>
    <div class="assets-clear">
        <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
            <div slot="headBtns">
<!--                v-power="ASSET_MANAGEMENT.ASSET_IN_EXPORT"-->
                <SG-Button
                  @click="changeListSettingsModal(true)"
                  v-power="ASSET_MANAGEMENT.ASSET_IN_SET_TABLE_HEADER"
                >
                  列表设置
                </SG-Button>
                <SG-Button
                        icon="plus"
                        type="primary"
                        @click="newClearForm"
                        :loading="exportBtnLoading"
                        v-power="ASSET_MANAGEMENT.ASSET_IN_EXPORT"
                >导出</SG-Button>
                <div style="position:absolute;top: 20px;right: 76px;display:flex;">
                    <treeSelect
                            @changeTree="changeTree"
                            placeholder="请选择组织机构"
                            :allowClear="false"
                            :style="allStyle"
                            :showSearch='true'
                    ></treeSelect>
                    <a-select
                            showSearch
                            :maxTagCount="1"
                            placeholder="请选择资产项目"
                            mode="multiple"
                            :tokenSeparators="[',']"
                            :style="allStyle"
                            v-model="queryData.projectIdList"
                            :options="$addTitle(assetProjectOptions)"
                            @select="filterOption"
                    ></a-select>
                    <a-select
                            :maxTagCount="1"
                            mode="multiple"
                            :tokenSeparators="[',']"
                            placeholder="全部资产类型"
                            v-model="queryData.assetTypeList"
                            :options="$addTitle(assetTypeOptions)"
                            style="width: 190px; margin-right: 10px;"
                            @change="changeAssetType"
                    ></a-select>
                    <a-select
                            :maxTagCount="1"
                            :style="allStyle"
                            mode="multiple"
                            :tokenSeparators="[',']"
                            placeholder="全部状态"
                            v-model="queryData.approvalStatusList"
                            :options="$addTitle(approvalStatusData)"
                            @select="changeStatus"
                    ></a-select>
                    <a-input
                            v-model.trim="queryData.assetName"
                            style="width: 190px"
                            :max-Length="30"
                            placeholder="资产名称/编码"
                    />
                </div>
            </div>
            <div slot="btns">
                <SG-Button type="primary" @click="queryClick">查询</SG-Button>
            </div>
            <div slot="form" class="formCon">
                <a-select
                        showSearch
                        allowClear
                        placeholder="全部出库原因"
                        optionFilterProp="children"
                        :maxTagCount="1"
                        :style="allStyle"
                        mode="multiple"
                        v-model="queryData.cleanupTypeList"
                        :tokenSeparators="[',']"
                        :options="$addTitle(cleanupTypeData)"
                        @select="changeCleanupType"
                ></a-select>
                <EquipmentSelectTree
                        v-if="isSelectedEquipment"
                        style="width: 300px"
                        :top-organ-id="organId"
                        :multiple="true"
                        v-model="queryData.objectTypeList"
                        :options-data-format="(data)=>{
                          return [{label: '全部资产分类', value: '', isLeaf: true},...data]
                        }"
                        @select="assetClassifyDataFn($event,true)"
                />
                <a-select
                        v-else
                        showSearch
                        allowClear
                        placeholder="全部资产分类"
                        optionFilterProp="children"
                        :maxTagCount="1"
                        :style="allStyle"
                        mode="multiple"
                        v-model="queryData.objectTypeList"
                        :tokenSeparators="[',']"
                        :options="$addTitle(assetClassifyData)"
                        @select="assetClassifyDataFn"
                ></a-select>
                <SG-DatePicker
                        label="出库日期"
                        style="width: 232px;"
                        pickerType="RangePicker"
                        :defaultValue="defaultValue"
                        format="YYYY-MM-DD"
                        @change="onDateChange"
                ></SG-DatePicker>
                <a-input
                        v-model.trim="queryData.cleaningOrderCode"
                        style="width: 190px"
                        :max-Length="30"
                        placeholder="出库单名称/编号"
                />
                <div style="width:100%">
                  <ProvinceCityDistrict
                    class="city"
                    ref="ProvinceCityDistrict"
                    v-model="provinces"
                  ></ProvinceCityDistrict>
                </div>
            </div>
        </SG-SearchContainer>
        <!--数据概览信息-->
        <a-spin :spinning="overviewNumSpinning">
            <overview-number :numList="numList" />
        </a-spin>
        <div>
            <div class="table-layout-fixed">
                <a-table
                        :columns="columns"
                        :dataSource="dataSource"
                        class="custom-table td-pd10"
                        :pagination="false"
                >
                    <template slot="operation" slot-scope="text, record">
                        <div style="width: 50px;">
                            <a class="operation-btn" @click="handleOperation(record)">详情</a>
                        </div>
                    </template>
                </a-table>
            </div>
            <no-data-tips v-show="showNoDataTips"></no-data-tips>
        </div>
        <SG-FooterPagination
                :pageLength="queryData.pageSize"
                :totalCount="pageTotalCount"
                location="absolute"
                v-model="queryData.pageNum"
                @change="handlePageChange"
        />
        <TableHeaderSettings v-if="listSettingFlag" :funType="funType" @cancel="changeListSettingsModal(false)" @success="handleTableHeaderSuccess" />
    </div>
</template>

<script>
    import TableHeaderSettings from "@/components/TableHeaderSettings";
    import ProvinceCityDistrict from '@/views/common/ProvinceCityDistrict'
    import {generateTableAreaByAssetTypeCode} from '@/utils/utils'
    import TreeSelect from "../../common/treeSelect";
    import noDataTips from "@/components/noDataTips";
    import moment from "moment";
    import { ASSET_MANAGEMENT } from "@/config/config.power";
    import OverviewNumber from "@/views/common/OverviewNumber";
    import EquipmentSelectTree from '@/views/common/EquipmentSelectTree'
    import {getTableHeaders} from "utils/share";
    // import {calc} from '@/utils/utils'
    // import {exportDataAsExcel} from 'src/views/common/commonQueryApi'


    const approvalStatusData = [
        {
            label: "全部状态",
            value: ""
        },
        {
            label: "草稿",
            value: "0"
        },
        {
            label: "待审批",
            value: "2"
        },
        {
            label: "已驳回",
            value: "3"
        },
        {
            label: "已审批",
            value: "1"
        },
        {
            label: "已取消",
            value: "4"
        }
    ];
    const detailColumns = [
      {
        title: "出库明细ID",
        dataIndex: "cleaningOrderDetailId",
        width: 90,
      },
      {
        title: "资产名称",
        dataIndex: "assetName",
        width: 70,
      },
      {
        title: "资产编码",
        dataIndex: "assetCode",
        width: 70,
      },
      {
        title: "资产类型",
        dataIndex: "assetTypeName",
        width: 70,
      },
      {
        title: "资产分类",
        dataIndex: "objectTypeName",
        width: 70,
      },
      {
        title: "管理机构",
        dataIndex: "organName",
        width: 70,
      },
      {
        title: "资产项目名称",
        dataIndex: "projectName",
        width: 80,
      },
      {
        title: "出库单编号",
        dataIndex: "cleaningOrderCode",
        width: 80,
      },
      {
        title: "出库原因",
        dataIndex: "cleanupTypeName",
        width: 80,
      },
      {
        title: "资产位置",
        dataIndex: "location",
        width: 120,
      },
      {
        title: "资产面积",
        key: "area",
        customRender(record){
          return generateTableAreaByAssetTypeCode({record,keyStr:'area',assetTypeCode:String(record.assetType)})
        },
        width: 70,
      },
      {
        title: "出库人",
        dataIndex: "creatUserName",
        width: 65,
      },
      {
        title: "出库日期",
        dataIndex: "createDate",
        width: 70,
      },
      {
        title: "状态",
        dataIndex: "approvalStatusName",
        width: 60,
      }
    ]
    const requiredColumn = [
      {
        title: "操作",
        width: 80,
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" }
      }
    ]
    export default {
        components: {
            TreeSelect,
            noDataTips,
            OverviewNumber,
            EquipmentSelectTree,
            ProvinceCityDistrict,
            TableHeaderSettings
        },
        data() {
            return {
                listSettingFlag: false,
                funType: 4,
                provinces: {
                  province: undefined,
                  city: undefined,
                  district: undefined
                },
                organName: "",
                organId: "",
                queryData: {
                    assetTypeList: [''], // 全部资产类型
                    objectTypeList: [''], // 资产分类
                    cleanupTypeList: [''], // 出库原因
                    approvalStatusList: [''], // 出库单状态
                    projectIdList: [''], // 资产项目
                    maxDate: '',
                    minDate: '',
                    assetName: '', // 资产名称/编码
                    cleaningOrderCode: '', // 出库单/编码
                    pageSize: 10,
                    pageNum: 1,
                },
                defaultValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
                pageTotalCount: 0,
                assetClassifyData: [
                    {
                        label: '全部资产分类',
                        value: ''
                    }
                ], // 全部资产分类
                cleanupTypeData: [
                    {
                        label: "全部出库原因",
                        value: ""
                    }
                ], // 资产出库原因
                assetProjectOptions: [ {
                    label: "全部资产项目",
                    value: ""
                }], // 资产项目
                assetTypeOptions: [
                    {
                        label: "全部资产类型",
                        value: ""
                    }
                ], // 资产类型
                approvalStatusData: [...approvalStatusData], // 状态
                numList: [
                    { title: "全部", key: "total", value: 0, fontColor: "#324057" },
                    { title: "草稿", key: "draftTotal", value: 0, bgColor: "#5b8ff9" },
                    { title: "待审批", key: "pendingTotal", value: 0, bgColor: "#d48265" },
                    { title: "已驳回", key: "approvedTotal", value: 0, bgColor: "#4BD288" },
                    {
                        title: "已审批",
                        key: "haveApprovedTotal",
                        value: 0,
                        bgColor: "#1890FF"
                    },
                    { title: "已取消", key: "cancelTotal", value: 0, bgColor: "#DD81E6" }
                ], // 统计数据
                ASSET_MANAGEMENT,
                allStyle: "width: 180px; margin-right: 10px;",
                columns:[],
                dataSource: [],
                exportBtnLoading: false, // 导出按钮loading

                toggle: false,
                showNoDataTips: false,
                overviewNumSpinning: false,

            };
        },
        computed:{
          isSelectedEquipment(){
            const assetTypeArr = this.queryData.assetTypeList
            return (assetTypeArr.length === 1) && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
          }
        },
        watch: {
            $route() {
                if (this.$route.path === "/assetClear" && this.$route.query.refresh) {
                    this.queryClick();
                }
            }
        },
        created() {
        },
        mounted() {
            this.initTableColumns()
            this.platformDict("asset_type");
            this.onDateChange(this.defaultValue)
        },
        methods: {
            moment,
          async initTableColumns(){
            // 暂不考虑固定表头顺序问题，目前只有操作列
            const res = await getTableHeaders({funType:this.funType})
            this.columns = res.customShow.map( ele =>{
              let mapRes = {}
              // 匹配用户预设表头，使用前端代码对应表头配置
              const temp = detailColumns.find(item=>[item.key,item.dataIndex].includes(ele.colCode))
              if (temp){
                mapRes = temp
              }else {
                mapRes =  {
                  title: ele.colName,
                  dataIndex: ele.colCode
                }
              }
              return mapRes
            })
            requiredColumn.forEach(ele=>{
              this.columns.splice(this.columns.length,0,ele)
            })
          },
          handleTableHeaderSuccess(){
            this.changeListSettingsModal(false)
            this.initTableColumns()
          },
          changeListSettingsModal(flag){
            this.listSettingFlag = flag
          },
            // 全部资产分类
            assetClassifyDataFn(value,isSelectedEquipment){
                this.$nextTick(() => {
                    const resOptions = isSelectedEquipment === true ? new Array(9999) : this.assetClassifyData
                    this.queryData.objectTypeList = this.handleMultipleSelectValue(
                        value,
                        this.queryData.objectTypeList,
                        resOptions
                    );
                });
            },
            // 状态发生变化
            changeStatus(value) {
                this.$nextTick(() => {
                    this.queryData.approvalStatusList = this.handleMultipleSelectValue(
                        value,
                        this.queryData.approvalStatusList,
                        this.approvalStatusData
                    );
                });
            },
            // 出库原因发生改变
            changeCleanupType(value) {
                this.$nextTick(function() {
                    this.queryData.cleanupTypeList = this.handleMultipleSelectValue(
                        value,
                        this.queryData.cleanupTypeList,
                        this.cleanupTypeData
                    );
                });
            },
            // 资产类型发生变化
            changeAssetType(value) {
                this.$nextTick(function() {
                    this.queryData.assetTypeList = this.handleMultipleSelectValue(
                value[value.length-1] || '' ,
                        this.queryData.assetTypeList,
                        this.assetTypeOptions
                    );
                    if (!this.queryData.assetTypeList[0] || this.queryData.assetTypeList.length > 1 ) {
                      this.assetClassifyData = [{label: '全部资产分类', value: ''}]
                      this.queryData.objectTypeList = ['']
                    }else {
                      this.getListFn()
                    }
                });
            },
            // 资产项目发生变化
            filterOption(value) {
                this.$nextTick(() => {
                    this.queryData.projectIdList = this.handleMultipleSelectValue(
                        value,
                        this.queryData.projectIdList,
                        this.assetProjectOptions
                    );
                });
            },
            // 处理多选下拉框有全选时的数组
            handleMultipleSelectValue(value, data, dataOptions) {
                // 如果选的是全部
                if (value === "") {
                    data = [""];
                } else {
                    let totalIndex = data.indexOf("");

                    if (totalIndex > -1) {
                        data.splice(totalIndex, 1);
                    } else {
                        // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
                        if (data.length === dataOptions.length - 1) {
                            data = [""];
                        }
                    }
                }
                return data;
            },
            // 起止日期发生变化
            onDateChange(val) {
                this.queryData.minDate = moment(val[0]).format('YYYY-MM-DD')
                this.queryData.maxDate = moment(val[1]).format('YYYY-MM-DD')
            },
            // 组织机构变化
            changeTree(value, label) {
                this.organName = label;
                this.organId = value;
                this.getAssetProjectOptions();
                this.organDict("asset_cleanup_type");
                this.getListFn()
                this.queryClick();
            },
            // 页码发生变化
            handlePageChange(page) {
                this.queryData.pageNum = page.pageNo;
                this.queryData.pageSize = page.pageLength;
                this.queryList();
            },
            // 导出
            newClearForm() {
                const req = this.handleSearchReq()
                this.$api.assets.getGeneralSurveyExportOut(req).then(res => {
                    this.exportBtnLoading = false
                    console.log(typeof res.data)
                    if (Number(res.data.code) === -1) {
                        this.$message.error('导出失败');
                        return
                    }
                    const blob = new Blob([res.data])
                    const fileName = '资产出库一览表.xls'
                    const link = document.createElement('a')
                    link.download = fileName
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    document.body.appendChild(link)
                    link.click()
                    URL.revokeObjectURL(link.href)
                    document.body.removeChild(link)
                })
            },
            // 点击查询
            queryClick() {
                this.queryData.pageNum = 1;
                this.queryList();
            },
            handleSearchReq(isTotal){
              const {queryData} = this
              let obj = {};
              ['assetTypeList', 'objectTypeList', 'cleanupTypeList', 'approvalStatusList', 'projectIdList'].forEach(key =>
                // 过滤空值
                obj[key] = queryData[key].filter(m => m)
              )
              const params = {
                ...queryData,
                ...obj,
                organId: this.organId
              }
              const params2 ={
                city: this.provinces.city ? this.provinces.city : '',               // 市
                province: this.provinces.province ? this.provinces.province : '',   // 省
                region: this.provinces.district ? this.provinces.district : '',     // 区
              }
              if (isTotal){
                return params
              }else {
                return {...params,...params2}
              }
            },
            // 调用接口 查询列表
            queryList() {
                this.assetCleanupGetCount(this.handleSearchReq(true))
                const req = this.handleSearchReq()
                this.$api.assets.getGeneralSurvey(req).then(res => {
                    if (Number(res.data.code) === 0) {
                        const data = res.data.data
                        this.pageTotalCount = data.count
                        const list = data.data
                        if (list.length) {
                            this.showNoDataTips = false
                            this.dataSource = list.map((item) => {
                                item.key = Math.floor(Math.random() * 10000000)
                                return item
                            })
                        } else {
                            this.dataSource = []
                            this.showNoDataTips = true
                        }
                    } else {
                        this.dataSource = []
                        this.showNoDataTips = true
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {
                    this.dataSource = []
                    this.showNoDataTips = true
                    this.$message.error(err.data.message);
                })
            },
            // 获取资产项目
            getAssetProjectOptions() {
                let form = {
                    organId: this.organId
                };
                this.$api.assets.getObjectKeyValueByOrganId(form).then(res => {
                    if (res.data.code === "0") {
                        // { label: "全部资产项目", value: "" }
                        let arr = [];
                        res.data.data.forEach(item => {
                            let obj = {
                                label: item.projectName,
                                value: item.projectId
                            };
                            arr.push(obj);
                        });
                        this.assetProjectOptions = arr;
                        this.assetProjectOptions.unshift(
                            {
                                label: "全部资产项目",
                                value: ""
                            }
                        )
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            },
            // 获取全部资产类型
            platformDict(code) {
                let form = {
                    code
                };
                this.$api.basics.platformDict(form).then(res => {
                    if (res.data.code === "0") {
                        let result = res.data.data || [];
                        let arr = result.map(item => {
                            return {
                                label: item.name,
                                value: item.value
                            };
                        });
                        // 出库原因
                        if (code === "asset_type") {
                            this.assetTypeOptions = [
                                {
                                    label: "全部资产类型",
                                    value: ""
                                },
                                ...arr
                            ];
                            this.getListFn()
                        }
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            },
            // 获取资产出库原因下拉列表
            organDict(code) {
                let form = {
                  code,
                  organId: this.organId
                };
                this.$api.basics.organDict(form).then(res => {
                    if (res.data.code === "0") {
                        let result = res.data.data || [];
                        let arr = result.map(item => {
                            return {
                                label: item.name,
                                value: item.value
                            };
                        });
                        // 出库原因
                        if (code === "asset_cleanup_type") {
                            this.cleanupTypeData = [
                                {
                                    label: "全部出库原因",
                                    value: ""
                                },
                                ...arr
                            ];
                        }
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            },
            // 获取资产分类列表
            getListFn () {
                if (!this.organId) {
                    return
                }
                this.queryData.objectTypeList = ['']
                let obj = {
                    organId: this.organId,
                    assetType: this.queryData.assetTypeList.length > 0 ? this.queryData.assetTypeList.join(',') : ''
                }
                this.$api.assets.getList(obj).then(res => {
                    if (Number(res.data.code) === 0) {
                        let data = res.data.data
                        let arr = []
                        data.forEach(item => {
                            arr.push({
                                label: item.professionName,
                                value: item.professionCode
                            })
                        })
                        this.assetClassifyData = [
                            {label: '全部资产分类', value: ''},
                            ...arr
                        ]
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(() => {
                    // this.$message.error('获取资产分类失败');
                    console.error('获取资产分类失败')
                })
            },
            // 查询统计列表
            assetCleanupGetCount(params) {
                this.overviewNumSpinning = true
                // const params =  {
                //     "cleanupType": this.queryData.cleanupTypeList.join(','),                //类型：String  必有字段  备注：清理类型
                //     "clearingName": `${this.queryData.assetName},${this.queryData.cleaningOrderCode}`, //类型：String  必有字段  备注：资产出库单/名称
                //     "currentOrganId": 1, //类型：Number  必有字段  备注：仅当前机构下资产清理单 0 否 1 是
                //     "endCreateDate": this.queryData.minDate, //类型：String  必有字段  备注：结束时间
                //     "multiApprovalStatus": this.queryData.approvalStatusList.join(','), //类型：String  必有字段  备注：审批状态
                //     "multiAssetType": this.queryData.assetTypeList.join(','), //类型：String  必有字段  备注：资产类型
                //     "organId": this.organId, //类型：Number  必有字段  备注：组织机构
                //     "pageNum": this.queryData.pageNum, //类型：Number  必有字段  备注：无
                //     "pageSize": this.queryData.pageSize, //类型：Number  必有字段  备注：无
                //     "projectId": this.queryData.projectIdList.join(','), //类型：String  必有字段  备注：资产项目id
                //     "startCreateDate": this.queryData.maxDate //类型：String  必有字段  备注：开始时间
                // }
                this.$api.assets.assetCleanupListTotal(params).then(res => {
                    if (Number(res.data.code) === 0) {
                        let data = res.data.data || {};
                        this.numList = this.numList.map(item => {
                            return {
                                ...item,
                                value: data[item.key] || '0'
                            };
                        });
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
                .finally(() => {
                    this.overviewNumSpinning = false;
                });
            },
            // 列表详情按钮
            handleOperation(record) {
                console.log(record)
                this.$router.push({
                    path: "/assetTable/detail",
                    query: {
                        assetId: record.assetId,
                        assetType: record.assetType,
                        cleaningOrderId: record.cleaningOrderId
                    }
                });
            },

            // @delete MOCK数据 s
            MOCKLIST(params){
                console.log(params)
                return new Promise(resolve => {
                  const list = []
                  for (let i = 0; i < 15; i++) {
                    const obj = {
                        "assetId": i,                //类型：Number  必有字段  备注：资产id
                        "cleaningOrderCode":"1abcd" + i,                //类型：String  必有字段  备注：出库单编号
                        "assetName":"剪刀" + i,                //类型：String  必有字段  备注：资产名称
                        "assetCode":"code2" + i,                //类型：String  必有字段  备注：资产编码
                        "assetType":3,                //类型：Number  必有字段  备注：资产类型
                        "assetTypeName":"设备" + i,                //类型：String  必有字段  备注：资产类型名称
                        "objectType":"1",                //类型：String  必有字段  备注：资产分类
                        "objectTypeName":"mock" + i,                //类型：String  必有字段  备注：资产分类名称
                        "organId":1300,                //类型：Number  必有字段  备注：管理机构
                        "organName":"四格运营",                //类型：String  必有字段  备注：管理机构名称
                        "projectId":1,                //类型：Number  必有字段  备注：项目id
                        "projectName":"不收费",                //类型：String  必有字段  备注：项目名称
                        "cleanupType":5,                //类型：Number  必有字段  备注：出库原因
                        "cleanupTypeName":"资产拆迁",                //类型：String  必有字段  备注： 出库原因名称
                        "area":"mixed",                //类型：Mixed  必有字段  备注：资产面积
                        "location":"mixed",                //类型：Mixed  必有字段  备注：资产位置
                        "createDate":"mixed",                //类型：Mixed  必有字段  备注：出库时间
                        "creatUserName":"周柏甫",                //类型：String  必有字段  备注：出库人名称
                        "approvalStatus":4,                //类型：Number  必有字段  备注：批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
                        "approvalStatusName":"已取消",               //类型：String  必有字段  备注：批状态名称
                        "cleaningOrderId":"mock" + i                //类型：String  必有字段  备注：清理单id
                    }
                      list.push(obj)
                  }
                  const res = {
                      data: {
                          code: 0,
                          "message":"操作成功",
                          "data": {                //类型：Object  必有字段  备注：无
                              "count":15,                //类型：Number  必有字段  备注：无
                              "pages":3,                //类型：Number  必有字段  备注：无
                              "data": list                //类型：Array  必有字段  备注：无
                          },
                      }
                  }
                  resolve(res)
                })
            },
            MOCKCOUNT(params){
                console.log(params)
                return new Promise(resolve => {
                    const res = {
                        data: {
                            "data": {                //类型：Object  必有字段  备注：无
                                "total":"11",                //类型：String  必有字段  备注：全部数量
                                "draftTotal":"20",                //类型：String  必有字段  备注：草稿数量
                                "pendingTotal":"30",                //类型：String  必有字段  备注：待审批数量
                                "approvedTotal":"40",                //类型：String  必有字段  备注：已驳回数量
                                "haveApprovedTotal":"51",                //类型：String  必有字段  备注：已审批数量
                                "cancelTotal":"60"                //类型：String  必有字段  备注：已取消数量
                            },
                            "code":"0",                //类型：String  必有字段  备注：无
                            "message":"操作成功"                //类型：String  必有字段  备注：无
                        }
                    }
                    resolve(res)
                })
            },
            // @delete MOCK数据 e

            // 高级搜索控制
            searchContainerFn(val) {
                this.toggle = val;
            },
        }
    };
</script>

<style lang="less" scoped>
  .city {
    float: right;
    margin-right: 8px;
    /deep/.ant-col-8 {width: 180px;}
    /deep/.province_style {
      width: 170px;
      flex: 1;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.city_style {
      width: 170px;
      flex: 1;
      display: inline-block;
      vertical-align: middle;
    }
    /deep/.district_style {
      width: 170px;
      flex: 1;
      display: inline-block;
      vertical-align: middle;
    }
  }
    .assets-clear {
        /deep/ .sg-search-container .bottom-fold-wrap .search-icon {
            display: none;
        }
    }

    .formCon {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        flex-wrap: wrap;
        > * {
            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;
            height: 32px;
        }
    }
    .operation-btn {
        color: #0084ff;
        margin-right: 10px;
    }
    .custom-table {
        padding-bottom: 50px;
    }
</style>
