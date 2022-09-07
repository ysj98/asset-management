<!--
  权属人管理
-->
<template>
  <div>
    <SG-SearchContainer background="white">
      <div slot="headBtns">
        <SG-Button icon="import" style="margin-right: 8px" @click="openImportModal">导入</SG-Button>
        <SG-Button
          icon="export"
          @click="handleExport"
          :loading="exportBtnLoading"
          style="margin-right: 8px"
          v-power="ASSET_MANAGEMENT.PROPERTY_OWNER_EXPORT"
        >导出</SG-Button>
        <SG-Button icon="plus" type="primary" @click="newPropertyOwner" v-power="ASSET_MANAGEMENT.PROPERTY_OWNER_NEW">新建权属人</SG-Button>
      </div>
      <div slot="headRight" class="search-content-box">
        <topOrganByUser @change="organIdChange" :formStyle="allStyle" v-model="organId" :hasAll="false" :selectFirst="true"/>
        <a-input-search placeholder="权属人名称" :style="allStyle" v-model="ownerName" @search="queryClick" />
      </div>
    </SG-SearchContainer>
    <div class="pb20">
      <a-table
      :scroll="{ x:1200}"
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table td-pd10"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <!--<OperationPopover :operationData="record.operationData" :record="record" @operationFun="operationFun"></OperationPopover>-->
          <a class="operation-btn" @click="operationFun('edit', record)" v-power="ASSET_MANAGEMENT.PROPERTY_OWNER_EDIT">编辑</a>
          <a class="operation-btn" @click="operationFun('detail', record)">详情</a>
          <a class="operation-btn" @click="operationFun('delete', record)" v-power="ASSET_MANAGEMENT.PROPERTY_OWNER_DELETE">删除</a>
        </template>
      </a-table>
      <no-data-tips v-show="showNoDataTips"></no-data-tips>
    </div>
    <SG-FooterPagination
      :pageLength="paginator.pageLength"
      :totalCount="paginator.totalCount"
      location="absolute"
      v-model="paginator.pageNo"
      @change="handlePageChange"
    />
    <handle-property-owner ref="handlePropertyOwner" :modalType="modalType" :organId="organId" :organName="organName" :ownerId="ownerId"></handle-property-owner>
    <!--导入-->
    <batch-import @upload="uploadFile" @down="downTemplate" ref="batchImport" title="权属人批量导入"/>
  </div>
</template>

<script>
import topOrganByUser from '@/views/common/topOrganByUser'
import handlePropertyOwner from './handlePropertyOwner'
import noDataTips from '@/components/noDataTips'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import {exportDataAsExcel} from 'src/views/common/commonQueryApi'
import BatchImport from 'src/views/common/eportAndDownFile'

const columns = [
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: 160
  },
  {
    title: '权属人名称',
    dataIndex: 'obligeeName',
    width: 200
  },
  {
    title: '权属人类型',
    dataIndex: 'obligeeTypeName',
    width: 160
  },
  {
    title: '证件类型',
    dataIndex: 'certificateTypeName',
    width: 160
  },
  {
    title: '证件号码',
    dataIndex: 'certificateNo',
    width: 160
  },
  {
    title: '通讯地址',
    dataIndex: 'mailingAddress',
    width: 160
  },
  {
    title: '邮编',
    dataIndex: 'postalCode',
    width: 160
  },
  {
    title: '法定代表',
    dataIndex: 'legalAgent',
    width: 160
  },
  {
    title: '代理人（机构）',
    dataIndex: 'agent',
    width: 160
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  components: {
    topOrganByUser, handlePropertyOwner, noDataTips, BatchImport
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      allStyle: 'width: 150px; marginLeft: 10px;',
      organId: '',
      organName: '',
      ownerName: '', // 权属人名称
      columns,
      dataSource: [],
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
      modalType: 'new', // 弹窗类型
      ownerId: '', // 权属人id
      showNoDataTips: false,
      exportBtnLoading: false // 导出按钮loading
    }
  },
  methods: {
    organIdChange (value) {
      console.log(value)
      this.organName = value.name
      this.queryClick()
    },
    // 页码发生变化
    handlePageChange (page) {
      console.log(page, 'pagepagepage')
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.queryList()
    },
    // 操作回调
    operationFun (editType, record) {
      console.log(editType)
      console.log(record)
      switch (editType) {
        case 'edit': this.modalType = 'edit'
          this.ownerId = record.obligeeId
          this.$refs.handlePropertyOwner.modal.show = true
          break
        case 'detail': this.modalType = 'detail'
          this.ownerId = record.obligeeId
          this.$refs.handlePropertyOwner.modal.show = true
          break
        case 'delete': let self = this
          this.$confirm({
            title: '提示',
            content: '确认要删除该权属人吗？',
            onOk() {
              let form = {
                objectId: record.obligeeId
              }
              self.$api.assets.ownerDelete(form).then(res => {
                if (res.data.code === '0') {
                  self.$message.success('删除成功')
                  self.queryClick()
                } else {
                  self.$message.error(res.data.message)
                }
              })
            }
          })
          break
        default: return
      }
    },
    newPropertyOwner () {
      this.modalType = 'new'
      this.$refs.handlePropertyOwner.modal.show = true
    },
    // 点击查询
    queryClick () {
      this.paginator.pageNo = 1
      this.queryList()
    },
    // 查询列表
    queryList (type) {
      let form = {
        organId: this.organId,
        obligeeName: this.ownerName,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      if (type === 'export') { return form }
      this.$api.assets.list(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data
          if (data.length === 0) {
            this.showNoDataTips = true
          } else {
            this.showNoDataTips = false
          }
          data.forEach((item, index) => {
            item.key = index
            for (let key in item) {
              if (item[key] === '') {
                item[key] = '--'
              }
            }
          })
          this.dataSource = data
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    // 导出
    handleExport () {
      this.exportBtnLoading = true
      let data = this.queryList('export')
      exportDataAsExcel(data, this.$api.tableManage.exportObligeeExcel, '权属人管理列表.xlsx', this).then(() => {
        this.exportBtnLoading = false
      })
    },

    // 打开批量导入Modal
    openImportModal () {
      if (!this.organId) { return this.$message.info('请选择组织机构') }
      this.$refs.batchImport.visible = true
    },

    // 下载导入模板文件
    downTemplate () {
      exportDataAsExcel('import_template_qsr.xlsx', this.$api.tableManage.downloadTemplate, '权属人导入模板.xlsx', this)
    },

    // 批量导入
    uploadFile (file) {
      const { organId } = this
      let name = this.$SG_Message.loading({ duration: 0, content: '批量导入中' })
      let fileData = new FormData()
      fileData.append('file', file)
      let query = `?organId=${organId}`
      this.$api.tableManage.importOwnerData(query, fileData).then(r => {
        this.$SG_Message.destroy(name)
        let res = r.data
        if (res && String(res.code) === '0') {
          this.$SG_Message.success(res.message || '导入成功')
          this.$refs.batchImport.visible = false
          return this.queryClick()
        }
        throw res.message
      }).catch(err => {
        this.$SG_Message.destroy(name)
        this.$SG_Message.error(err || '批量导入失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .operation-btn {
    color: #0084FF;
    margin-right: 10px;
  }
  .custom-table {
    padding-bottom: 50px;
  }
  .search-content-box {
    div {
      display: inline-block;
    }
  }
</style>
