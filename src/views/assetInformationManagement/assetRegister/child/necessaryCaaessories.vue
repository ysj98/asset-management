<!--
 * @Author: LW
 * @Date: 2020-07-13 17:56:01
 * @LastEditTime: 2020-07-15 10:50:44
 * @Description: 附属配套
--> 
<template>
  <div class="necessaryCaaessories">
    <div class="button-box">
      <div class="buytton-l">
        <span>配套附属总数量：{{statistics.num || '--'}}</span> <span class="p120">总价值：{{statistics.valueAmount || '--'}}</span>
      </div>
      <div class="buytton-nav">
        <SG-Button type="primary" weaken @click="newlyFn('new')">新增配套</SG-Button>
        <SG-Button class="ml20" type="primary" weaken @click="addTheAsset">批量导入</SG-Button>
      </div>
    </div>
    <div class="table-borders">
      <a-table
        class="table-boxs"
        :columns="columns"
        :loading="loading"
        :scroll="{y: 450, x: 2300}"
        :dataSource="tableData"
        :pagination="false"
        >
        <template slot="operation" slot-scope="text, record">
          <div class="tab-opt">
            <span @click="newlyFn('edit', record)">编辑</span>
            <span class="pl10 postAssignment-icon" @click="deleteFn(record)">删除</span>
          </div>
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        location="absolute"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <!-- 新增编辑 -->
    <completeSetNew @cancel="cancel" v-if="modalShow" ref="completeSetNew"></completeSetNew>
    <!-- 下载模板 -->
    <eportAndDownFile ref="eportAndDownFile" @upload="uploadModeFile" @down="down"></eportAndDownFile>
  </div>
</template>

<script>
import {auxiliary} from './../common/registerBasics'
import noDataTips from '@/components/noDataTips'
import completeSetNew from './../common/completeSetNew'
import eportAndDownFile from './.././../../common/eportAndDownFile'
export default {
  components: {noDataTips, completeSetNew, eportAndDownFile},
  props: {},
  data () {
    return {
      columns: auxiliary,
      tableData: [],
      count: '',            // 总页数
      loading: false,
      modalShow: false,
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        registerOrderId: '',   // 资产登记单Id
        assetType: ''          // 资产类型
      },
      statistics: {}          // 统计
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.query()
  },
  methods: {
    // 删除
    deleteFn (record) {
        this.$SG_Modal.confirm({
          title: `确定删除该附属配套吗?`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            let data = {
              subsidiaryMatchingId: record.subsidiaryMatchingId,
              status: '-1'
            }
            let loadingName = this.SG_Loding('提交中...')
            this.$api.subsidiary.updateStatusOrDelete(data).then(res => {
              if (res.data.code === '0') {
                this.DE_Loding(loadingName).then(() => {
                  this.$SG_Message.success('删除成功')
                  this.query()
                })
              } else {
                this.DE_Loding(loadingName).then(() => {
                  this.$message.error(res.data.message)
                })
              }
            })
          }
        })
    },
    // 新增
    newlyFn (str) {
      this.modalShow = true
      this.$nextTick(() => {
        this.$refs.completeSetNew.allMounted(str)
        this.$refs.completeSetNew.modalShow = true
      })
    },
    cancel () {
      console.log('0-0-0-')
      this.modalShow = false
    },
    // 导入
    addTheAsset () {
      this.$refs.eportAndDownFile.visible = true
    },
    // 上传文件
    uploadModeFile (file) {
      let fileData = new FormData()
      fileData.append('file', file)
      fileData.append('organId', this.organId)
      fileData.append('registerOrderId', this.registerOrderId)
      fileData.append('assetType', this.assetType)
      let loadingName = this.SG_Loding('导入中...')
      this.$api.subsidiary.batchImportByRgId(fileData).then(res => {
        if (res.data.code === '0') {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('导入成功！')
            this.query()
          }) 
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$refs.downErrorFile.visible = true
            this.upErrorInfo = res.data.message
          })
        }
      }, () => {
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error('导入失败！')
        })
      })
    },
    down () {
      let obj = {
        registerOrderId: '',      // 资产登记单
        assetType: ''             // 资产类型
      }
      this.$api.grid.downModle(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `附属配套.xls`
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
    // 查询
    query () {
      this.loading = true
      this.tableData = [
        {
          subsidiaryMatchingId: '1000',                //类型：String  必有字段  备注：附属配套ID
          assetId: '1000',                //类型：String  必有字段  备注：资产信息Id
          assetCode: '1000',                //类型：String  必有字段  备注：资产编码
          assetTypeName: '1000',                //类型：String  必有字段  备注：资产类型名称，fy
          assetName: '1000',                //类型：String  必有字段  备注：资产名称，fy
          matchingName: '1000',                //类型：String  必有字段  备注：附属配套名称
          matchingCode: '1000',                //类型：String  必有字段  备注：附属配套编码
          matchingType: '1000',                //类型：String  必有字段  备注：类型（附属配套）
          matchingTypeName: '1000',                //类型：String  必有字段  备注：类型名称（附属配套），fy
          specificationType: '1000',                //类型：String  必有字段  备注：规格型号
          status: '1000',                //类型：String  必有字段  备注：状态，用于状态操作
          statusName: '1000',                //类型：String  必有字段  备注：状态名称，fy
          value: '1000',                //类型：String  必有字段  备注：价值(元)
          number: '1000',                //类型：String  必有字段  备注：数量
          unitOfMeasurementName: '1000',                //类型：String  必有字段  备注：计量单位名称，fy
          isBeforeName: '1000',                //类型：String  必有字段  备注：是否接管前附属配套 1是 0否，fy
          remark: '1000'                //类型：String  必有字段  备注：备注
        }
      ]
      this.loading = false
      this.$api.assets.getListPageByRegisterOrderId(this.queryCondition).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.getMatchingListByAssetId()
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 统计
    getMatchingListByAssetId () {
      let obj = {
        registerOrderId: '',      // 资产登记单
        assetType: ''             // 资产类型
      }
      this.$api.assets.getMatchingListByAssetId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.statistics = res.data.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.necessaryCaaessories{
  .button-box {
    overflow: hidden;
    margin-bottom: 15px;
    line-height: 40px;
    display: flex;
    .button-l {
      flex: 1;
      text-align: left;
    }
    .buytton-nav {
      flex: 1;
      text-align: right;
    }
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084FF;
      cursor: pointer;
    }
    .postAssignment-icon {
      color: red;
    }
  }
}
</style>