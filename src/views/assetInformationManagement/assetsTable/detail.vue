<template>
    <div class="l-container">
        <div class="l-section">
            <SG-Title title="出库单信息" noMargin/>
            <div class="l-model">
                <div class="l-model-item">
                    <span class="lable">出库单ID：</span>
                    <span class="value">{{cleanupInfo.cleaningOrderId}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库单名称：</span>
                    <span class="value">{{cleanupInfo.cleaningOrderCode}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库单编号：</span>
                    <span class="value">{{cleanupInfo.cleaningOrderCode}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库单状态：</span>
                    <span class="value">{{cleanupInfo.approvalStatusName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">所属机构：</span>
                    <span class="value">{{cleanupInfo.organName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产项目名称：</span>
                    <span class="value">{{cleanupInfo.projectName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产类型：</span>
                    <span class="value">{{cleanupInfo.assetTypeName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库原因：</span>
                    <span class="value">{{cleanupInfo.cleanupTypeName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库人：</span>
                    <span class="value">{{cleanupInfo.createByName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库日期：</span>
                    <span class="value">{{cleanupInfo.createTime}}</span>
                </div>
                <div class="l-model-item-line">
                    <span class="lable">备注：</span>
                    <span class="value">{{cleanupInfo.remark}}</span>
                </div>
                <div class="l-model-item-line">
                    <span class="lable">附件：</span>
                    <SG-UploadFile
                            v-model="files"
                            :show="true"
                    />
                </div>
            </div>
        </div>
        <div class="l-section">
            <SG-Title title="基础信息" noMargin/>
            <div class="l-model">
                <div class="l-model-item">
                    <span class="lable">资产ID：</span>
                    <span class="value">{{assetInfo.assetId}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产名称：</span>
                    <span class="value">{{assetInfo.assetName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产编码：</span>
                    <span class="value">{{assetInfo.assetCode}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产类型：</span>
                    <span class="value">{{assetInfo.assetTypeName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产分类：</span>
                    <span class="value">{{assetInfo.objectTypeName}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable" v-if="assetType === 1 || assetType === 4">资产面积(㎡)：</span>
                    <span class="value">{{assetInfo.area ? assetInfo.area : '--'}}</span>
                </div>
                <div class="l-model-item" v-if="assetType === 1">
                    <span class="lable">楼栋名称：</span>
                    <span class="value">{{assetInfo.buildName ? assetInfo.buildName : '--'}}</span>
                </div>
                <div class="l-model-item" v-if="assetType === 4">
                    <span class="lable">土地名称：</span>
                    <span class="value">{{assetInfo.landName ? assetInfo.landName : '--'}}</span>
                </div>
                <div class="l-model-item" v-if="assetType === 1">
                    <span class="lable">房间名称：</span>
                    <span class="value">{{assetInfo.houseName ? assetInfo.houseName : '--'}}</span>
                </div>
                <div class="l-model-item" v-if="assetType === 4">
                    <span class="lable">土地编码：</span>
                    <span class="value">{{assetInfo.landCode ? assetInfo.landCode : '--'}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产位置：</span>
                    <span class="value">{{assetInfo.address}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">权属类型：</span>
                    <span class="value">{{assetInfo.kindOfRightName ? assetInfo.kindOfRightName : '--'}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">权属情况：</span>
                    <span class="value">{{assetInfo.ownershipStatusName ? assetInfo.ownershipStatusName : '--'}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">权证号：</span>
                    <span class="value">{{assetInfo.warrantNbr ? assetInfo.warrantNbr : '--'}}</span>
                </div>
                <div class="l-model-item" v-if="assetType === 1">
                    <span class="lable">装修情况：</span>
                    <span class="value">{{assetInfo.decorationSituation ? assetInfo.decorationSituation : '--'}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">债权金额(元)：</span>
                    <span class="value">{{assetInfo.creditorAmount ? assetInfo.creditorAmount : '--'}}</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">债务金额(元)：</span>
                    <span class="value">{{assetInfo.debtAmount ? assetInfo.debtAmount : '--'}}</span>
                </div>
            </div>
        </div>
        <div class="l-section">
            <SG-Title title="附属配套" noMargin/>
            <div class="l-table-container">
                <div class="l-table-all">
                    <div class="l-table-adll-item">
                        配套附属总数量：{{tableSta.number}}
                    </div>
                    <div class="l-table-adll-item">
                        总价值：{{tableSta.value}}
                    </div>
                </div>
                <div class="l-table">
                    <a-table
                            :columns="tableData.columns"
                            :dataSource="tableData.dataSource"
                            class="custom-table"
                            :pagination="false"
                    ></a-table>
                    <SG-FooterPagination
                            :pageLength="pageInfo.pageLength"
                            :totalCount="pageInfo.totalCount"
                            location="absolute"
                            :noPageTools="false"
                            v-model="pageInfo.pageNo"
                            @change="pageChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "detail",
        data() {
            return {
                assetId: '',
                assetType: '',
                cleaningOrderId: '',
                tableData: {
                    columns: [
                        {
                            title: '附属配套ID',
                            dataIndex: 'subsidiaryMatchingId',
                        },
                        {
                            title: '附属配套名称',
                            dataIndex: 'matchingName',
                        },
                        {
                            title: '附属配套编码',
                            dataIndex: 'matchingCode',
                        },
                        {
                            title: '类型',
                            dataIndex: 'matchingTypeName',
                        },
                        {
                            title: '规格型号',
                            dataIndex: 'specificationType',
                        },
                        {
                            title: '价值',
                            dataIndex: 'value',
                        },
                        {
                            title: '数量',
                            dataIndex: 'number',
                        },
                        {
                            title: '计量单位',
                            dataIndex: 'unitOfMeasurementName',
                        },
                        {
                            title: '是否接管前附属配套',
                            dataIndex: 'isBeforeName',
                        },
                        {
                            title: '备注',
                            dataIndex: 'remark',
                        },
                    ],
                    dataSource: []
                },
                pageInfo: {
                    pageLength: 10,
                    totalCount: 0,
                    pageNo: 1
                },
                cleanupInfo: {},
                assetInfo: {},
                tableSta: {},
                files: [
                    { url: '/doc/2019/07/23/8/2019/07/23/1563883528442.txt', name: '1563883528442.txt' },
                    { url: '/picture/2019/07/23/8/201907232005287916_700_375.JPEG', name: '201907232005287916_700_375.JPEG' },
                    { url: '/picture/2019/07/23/8/201907232005287916_700_375.JPEG', name: '201907232005287916_700_375.JPEG' }
                ]
            }
        },
        created() {
            this.assetId = this.$route.query.assetId
            this.cleaningOrderId = this.$route.query.cleaningOrderId
            this.assetType = Number(this.$route.query.assetType)
            this.getAll()
        },
        methods: {
            // 分页切换事件
            pageChange(obj){
                this.pageInfo.pageLength = obj.pageLength
                this.pageInfo.pageNo = obj.pageNo
                this.getTableList()
            },
            // 统一请求
            getAll(){
              this.getCleanupDetail()
              this.getAssetById()
              this.getTableList()
              this.getMatchingSta()
            },
            // 获取出库单详情
            getCleanupDetail(){
                const params = {
                    cleaningOrderId: this.cleaningOrderId
                }
                this.$api.assets.getCleanupDetail(params).then(res => {
                    if (Number(res.data.code) === 0) {
                        const data = res.data.data
                        this.cleanupInfo = {
                            cleaningOrderCode: data.cleaningOrderCode ? data.cleaningOrderCode : '--',
                            projectName: data.projectName ? data.projectName : '--',
                            cleanupTypeName: data.cleanupTypeName ? data.cleanupTypeName : '--',
                            assetTypeName: data.assetTypeName ? data.assetTypeName : '--',
                            organName: data.organName ? data.organName : '--',
                            remark: data.remark ? data.remark : '--',
                            createByName: data.createByName ? data.createByName : '--',
                            createTime: data.createTime ? data.createTime : '--',
                            cleaningOrderId: data.cleaningOrderId ? data.cleaningOrderId : '--',
                            approvalStatusName: data.approvalStatusName ? data.approvalStatusName : '--',
                        }
                        const fileList = data.attachment
                        this.files = fileList.map(item => {
                            return {
                                url: item.attachmentPath,
                                name: item.oldAttachmentName
                            }
                        })
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error(err.data.message);
                })
            },
            // 获取资产信息
            getAssetById(){
                const params = {
                    assetId: this.assetId
                }
                this.$api.subsidiary.getAssetById(params).then(res => {
                    if (Number(res.data.code) === 0) {
                        const data = res.data.data
                        const basicInfo = {
                            assetId: data.assetId,
                            assetName: data.assetName ? data.assetName : '--',
                            assetCode: data.assetCode ? data.assetCode : '--',
                            assetTypeName: data.assetTypeName ? data.assetTypeName : '--',
                            objectTypeName: data.objectTypeName ? data.objectTypeName : '--',
                            address: data.address ? data.address : '--',
                        }

                        let obj
                        if (this.assetType === 1) {
                            const houseData = data.assetHouse
                            obj = {
                                area: houseData.area,
                                buildName: houseData.buildName,
                                houseName: houseData.houseName,
                                kindOfRightName: houseData.kindOfRightName,
                                ownershipStatusName: houseData.ownershipStatusName,
                                warrantNbr: houseData.warrantNbr,
                                decorationSituation: houseData.decorationSituation,
                                creditorAmount: houseData.creditorAmount,
                                debtAmount: houseData.debtAmount,
                            }
                        } else if (this.assetType === 4){
                            const assetLand = data.assetLand
                            obj = {
                                area: assetLand.landArea,
                                landName: assetLand.landName,
                                landCode: assetLand.landCode,
                                kindOfRightName: assetLand.kindOfRightName,
                                ownershipStatusName: assetLand.ownershipStatusName,
                                warrantNbr: assetLand.warrantNbr,
                                creditorAmount: assetLand.creditorAmount,
                                debtAmount: assetLand.debtAmount,
                            }
                        }
                        this.assetInfo = {...basicInfo, ...obj}
                        console.log(this.assetInfo)
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error(err.data.message);
                })
            },
            // 获取附属清单列表
            getTableList(){
                const params = {
                    assetId: this.assetId,
                    pageNum: this.pageInfo.pageNo,
                    pageSize: this.pageInfo.pageLength
                }
                this.$api.subsidiary.getMatchingListByAssetIdPage(params).then(res => {
                    if (Number(res.data.code) === 0) {
                        const data = res.data.data
                        this.pageInfo.totalCount = data.count
                        const list = data.data
                        this.tableData.dataSource = list.map((item, index) => {
                            return {
                                key: item.subsidiaryMatchingId + index,
                                ...item
                            }
                        })
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error(err.data.message);
                })
            },
            // 获取附属清单统计
            getMatchingSta(){
                const params = {
                    assetId: this.assetId
                }
                this.$api.subsidiary.getMatchingSta(params).then(res => {
                    if (Number(res.data.code) === 0) {
                        const data = res.data.data
                        this.tableSta = data
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(err => {
                    this.$message.error(err.data.message);
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.l-container {
    padding: 20px 30px;
}
.l-model{
    display: flex;
    padding: 0 30px;
    margin: 20px 0;
    flex-wrap: wrap;
    .l-model-item{
        width: 33.33%;
        padding-right: 10px;
        box-sizing: border-box;
        margin-bottom: 20px;
        display: flex;
        line-height: 22px;
        .lable{
            display: block;
            color: rgba(0,0,0,.8);
            white-space: nowrap;
        }
        .value{
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:hover{
                overflow: visible;
                word-break: break-all;
                white-space: normal;
            }
        }
    }
    .l-model-item-line{
        width: 100%;
        padding-right: 10px;
        box-sizing: border-box;
        margin-bottom: 20px;
        display: flex;
        line-height: 22px;
        .lable{
            display: block;
            color: rgba(0,0,0,.8);
            white-space: nowrap;
        }
        .value{
            display: block;
        }
    }
}
.l-table-container{
    padding: 0 30px;
    margin: 20px 0;
}
.l-table-all{
    display: flex;
    align-items: center;
    .l-table-adll-item{
        margin-left: 20px;
    }
}
.l-table{
    margin-top: 20px;
    padding-bottom: 52px;
    position: relative;
}
.custom-table {
    /deep/ .ant-table-placeholder{
        display: block!important;
    }
}
</style>