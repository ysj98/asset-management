<!--
  详情: particulars
  审核: audit  一期暂时不做审核和审核轨迹
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">登记单名称：{{ particularsData.registerName || '' }}</a-col>
          <a-col class="playground-col" :span="8">登记类型：{{ particularsData.registerTypeName || '' }}</a-col>
          <a-col class="playground-col" :span="8"
            >登&nbsp;&nbsp;&nbsp;记&nbsp;&nbsp;单&nbsp;&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp;态：{{ particularsData.approvalStatusName || '' }}</a-col
          >
          <a-col class="playground-col" :span="8">资产项目：{{ particularsData.projectName || '' }}</a-col>
          <a-col class="playground-col" :span="8">资产类型：{{ particularsData.assetTypeName || '' }}</a-col>
          <!-- <a-col class="playground-col" :span="8">关联权属办理任务：{{particularsData.ownershipHandleName || '--'}}</a-col> -->
          <a-col class="playground-col" :span="8">创&nbsp;&nbsp;建&nbsp;&nbsp;人：{{ particularsData.createByName || '' }}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{ particularsData.createTime || '' }}</a-col>
          <a-col class="playground-col" :span="24">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：{{ particularsData.remark || '' }}</a-col>
          <a-col class="playground-col" :span="24"
            >附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件： <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <UploadFile v-model="files" type="all" :show="true" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">权属登记详情</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table :loading="loading" :columns="columns" :dataSource="tableData" size="middle" :pagination="false"> </a-table>
          <!-- <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="queryCondition.count"
            :location="location"
            :noPageTools="noPageTools"
            v-model="queryCondition.pageNum"
            @change="handleChange"
          /> -->
        </div>
      </div>
    </div>
    <div class="particulars-nav" v-if="type === 'approval'">
      <span class="section-title blue">审批轨迹</span>
      <div class="particulars-obj">
        <SG-TrackStep v-stepstyleplus v-if="stepList.length" :stepList="stepList" style="margin-left: 45px" />
        <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
      </div>
    </div>
    <div class="particulars-nav" style="margin-bottom: 50px" v-if="type === 'approval'">
      <span class="section-title blue">审核意见</span>
      <div class="particulars-obj">
        <a-textarea :rows="4" style="resize: none" placeholder="请输入审核意见" v-model="operOpinion" />
      </div>
    </div>
    <form-footer
      v-if="type === 'approval'"
      leftButtonName="审核通过"
      rightButtonName="驳回"
      rightButtonType="danger"
      @save="handleApprove(1)"
      @cancel="handleApprove(0)"
    >
    </form-footer>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter';
import { register } from './basics';
import { utils } from '@/utils/utils.js';
import moment from 'moment';
export default {
  components: { FormFooter },
  props: {},
  data() {
    return {
      type: 'particulars',
      operOpinion: '', // 审核意见
      stepList: [], // 审批轨迹
      apprId: '',
      changeType: '',
      registerId: '',
      particularsData: {},
      files: [],
      columns: [],
      loading: false,
      tableData: [],
      location: '',
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: '',
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 获取审批轨迹
    queryApprovalRecordByBus(busId, organId) {
      const req = { busType: 1008, busId, organId };
      this.$api.approve.queryApprovalRecordByBus(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          this.apprId = data.amsApprovalResDto.apprId;
          this.stepList = (data.approvalRecordResDtos || []).map((ele) => {
            return {
              date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
              title: ele.operOpinion,
              desc: '',
              isDone: false,
              operation: [],
            };
          });
          this.stepList.length && (this.stepList[0].isDone = true);
        } else {
          this.$message.error(message);
        }
      });
    },
    // 审批
    handleApprove(operResult) {
      if (operResult === 0) {
        if (!this.operOpinion) {
          this.$message.error('驳回必填审核意见');
          return null;
        }
      }
      const req = {
        apprId: this.apprId,
        operResult,
        operOpinion: this.operOpinion,
      };
      this.$api.approve
        .uniformSubmit(req)
        .then(({ data: res }) => {
          if (res && String(res.code) === '0') {
            this.$message.success('操作成功');
            // 刷新页面
            this.$router.push({ path: '/ownershipRegistration', query: { refresh: true } });
          } else {
            throw res.message;
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error('操作失败');
        });
    },
    // 查询详情
    query() {
      let obj = {
        registerId: this.registerId,
      };
      this.$api.ownership.shipDetail(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.particularsData = data.registerInfo;
          // 如果是审批，则获取审批轨迹
          if (this.type === 'approval') this.queryApprovalRecordByBus(data.registerInfo.registerId, data.registerInfo.organId);
          let files = [];
          if (data.amsAttachmentList && data.amsAttachmentList.length > 0) {
            data.amsAttachmentList.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName,
              });
            });
          }
          this.files = files;
          data.amsOwnershipRegisterDetailList.forEach((item, index) => {
            item.key = index;
            item.address = item.location;
            item.assetArea = item.area;
            item.serial = index + 1 + (this.queryCondition.pageNum - 1) * this.queryCondition.pageSize;
          });
          this.tableData = data.amsOwnershipRegisterDetailList;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
  },
  created() {},
  mounted() {
    const { registerId, type } = this.$route.query;
    this.registerId = registerId;
    this.type = type;
    let arr = [];
    arr = utils.deepClone(register);
    if (arr[0].dataIndex !== 'serial') {
      arr.unshift({
        title: '序号',
        dataIndex: 'serial',
        width: '8%',
      });
    }
    this.columns = arr.splice(0, arr.length - 1);
    this.query();
  },
};
</script>
<style lang="less" scoped>
.particulars {
  .particulars-nav {
    padding: 42px 126px 20px 70px;
    .particulars-obj {
      padding: 20px 0 20px 40px;
      .playground-row {
        .playground-col {
          // height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
      }
    }
    .correspondingTask {
      margin: 35px 40px 0 40px;
      border: 1px solid #f0f2f5;
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
