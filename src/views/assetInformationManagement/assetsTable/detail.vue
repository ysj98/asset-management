<template>
    <div class="l-container">
        <div class="l-section">
            <SG-Title title="出库单信息" noMargin/>
            <div class="l-model">
                <div class="l-model-item">
                    <span class="lable">出库单名称：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库单编号：</span>
                    <span class="value">10001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库单状态：</span>
                    <span class="value">待审核</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">所属机构：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产项目：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产类型：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">出库原因：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">创建人：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">创建日期：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item-line">
                    <span class="lable">备注：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item-line">
                    <span class="lable">附件：</span>
                    <span class="value">入库单001</span>
                </div>
            </div>
        </div>
        <div class="l-section">
            <SG-Title title="基础信息" noMargin/>
            <div class="l-model">
                <div class="l-model-item">
                    <span class="lable">资产ID：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产名称：</span>
                    <span class="value">10001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产编码：</span>
                    <span class="value">待审核</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产类型：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产分类：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable" v-if="assetType === 1 || assetType === 4">资产面积(㎡)：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item" v-if="assetType === 1">
                    <span class="lable">楼栋名称：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item" v-if="assetType === 4">
                    <span class="lable">土地名称：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item" v-if="assetType === 1">
                    <span class="lable">房间名称：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item" v-if="assetType === 4">
                    <span class="lable">土地编码：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">资产位置：</span>
                    <span class="value">广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳广东深圳</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">权属类型：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">权属情况：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">权证号：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item" v-if="assetType === 1">
                    <span class="lable">装修情况：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">债权金额(元)：</span>
                    <span class="value">入库单001</span>
                </div>
                <div class="l-model-item">
                    <span class="lable">债务金额(元)：</span>
                    <span class="value">入库单001</span>
                </div>
            </div>
        </div>
        <div class="l-section">
            <SG-Title title="附属配套" noMargin/>
            <div class="l-table-container">
                <div class="l-table-all">
                    <div class="l-table-adll-item">
                        配套附属总数量：100
                    </div>
                    <div class="l-table-adll-item">
                        总价值：20,000
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
                }
            }
        },
        created() {
            this.assetId = this.$route.query.assetId
            this.assetType = Number(this.$route.query.assetType)
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