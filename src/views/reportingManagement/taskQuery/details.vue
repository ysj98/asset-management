<!--
  任务管理查询详情
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">任务信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">任务名称：{{particularsData.taskName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属机构：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目：{{particularsData.projectName || '--'}}</a-col>
					<a-col class="playground-col" :span="8">
						表单名称：
						<a-select
							showSearch
							placeholder="请选择呈报表单"
							style="width: 200px"
							:defaultValue="particularsData.reportBillId"
							:options="chargePersonOpt"
							:filterOption="filterOption"
						>
						</a-select>
					</a-col>
          <a-col class="playground-col" :span="8">计划执行日期：{{particularsData.beginDate ? `${particularsData.beginDate} - ${particularsData.endDate}` : '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属计划：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">填报人：{{particularsData.reportByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">审核人：{{particularsData.auditByName || '--'}}</a-col>
					<a-col class="playground-col" :span="8">任务状态：{{particularsData.taskStatus || '--'}}</a-col>
          <a-col class="playground-col" :span="8">发布人：{{particularsData.createBy || '--'}}</a-col>
					<a-col class="playground-col" :span="8">发布时间：{{particularsData.realBeginDate ? `${particularsData.realBeginDate} - ${particularsData.realEndDate}` : '--'}}</a-col>
          <a-col class="playground-col" :span="8">任务类型：{{particularsData.taskTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
          <a-col class="playground-col" :span="24">附件： <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <SG-UploadFile
                v-model="files"
                type="all"
                :show="true"
              />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">填报数据信息</span>
      <div class="particulars-obj">
				<div class="form-choice">
					<div style="line-height: 40px;">
						填报结果：
						<a-radio-group name="填报结果" :disabled="true" v-model="particularsData.result">
							<a-radio :value="0">填报</a-radio>
							<a-radio :value="1">不填报</a-radio>
						</a-radio-group>
						<SG-Button style="float: right;" type="primary" @click="downloadFn">导出</SG-Button>
					</div>
					<div style="line-height: 40px;">
						填报说明：{{particularsData.resultRemark}}
					</div>
				</div>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const colu = [
  {
    title: "编号",
    dataIndex: "index"
  },
  {
    title: "字段名称",
    dataIndex: "index1"
  },
  {
    title: "字段编码",
    dataIndex: "index2"
  },
  {
    title: "字段类型",
    dataIndex: "index3"
  },
  {
    title: "字段格式",
    dataIndex: "index4"
  },
  {
    title: "字段长度",
    dataIndex: "index5"
  },
  {
    title: "字段值",
    dataIndex: "index6"
  },
  {
    title: "必填字段",
    dataIndex: "index7"
  }
]
const previewColumns = [
  {
    title: "所属机构",
    dataIndex: "index"
  },
  {
    title: "资产项目名称",
    dataIndex: "index1"
  },
  {
    title: "资产卡片名称",
    dataIndex: "index2"
  },
  {
    title: "资产卡片编码",
    dataIndex: "index3"
  },
  {
    title: "折旧月份",
    dataIndex: "index4"
  },
  {
    title: "本次折旧金额(月份)",
    dataIndex: "index5"
  },
  {
    title: "外部ID",
    dataIndex: "index6"
  }
]
export default {
  components: {},
  props: {},
  data () {
    return {
			chargePersonOpt: [
				{
					value: '',
					label: '测试'
				}
			],
      changeType: '',
      registerId: '',
      particularsData: {},
      files: [],
			columns: colu,
			previewColumns: previewColumns,
      loading: false,
      tableData: [],
      location: '',
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: ''
      }
    }
  },
  computed: {
  },
  methods: {
		// 导出
		downloadFn () {},
		filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 查询详情
    query () {
      let obj = {
        reportPlanId: this.reportPlanId
      }
      this.$api.reportManage.getTask(obj).then(res => {
        if (Number(res.data.code) === 0) {
          console.log(res)
          let data = res.data.data
          this.particularsData = data
          let files = []
          if (data.attachment && data.attachment.length > 0) {
              data.attachment.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName
              })
            })
          }
          this.files = files
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
    let arr = JSON.parse(this.$route.query.quersData)
    console.log(arr, '-=-=-=')
    this.reportPlanId = arr[0].reportPlanId
    this.query()
  }
}
</script>
<style lang="less" scoped>
.particulars {
  .particulars-nav{
      padding: 42px 126px 20px 70px;
      .particulars-obj {
				padding: 20px 0 20px 40px;
				.form-choice {
					overflow: hidden;
					margin: 10px 0;
					.form-right {
						float: right;
					}
				}
        .playground-row {
          .playground-col {
            // height: 40px;
            line-height: 40px;
            font-size: 12px;
          }
        }
      }
      .correspondingTask {
        margin:35px 40px 0 40px;
        border: 1px solid #F0F2F5;
      }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
}
</style>
