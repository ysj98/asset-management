<!--维修详情-->
<template>
  <div class="repairDetail">
    <SG-Title title="基础信息" />
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>维修单编号： {{ repairInfo.maintainId }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>维修单名称： {{ repairInfo.maintainName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>维修单状态： {{ repairInfo.approvalStatusName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>所属组织机构： {{ repairInfo.organName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>资产项目： {{ repairInfo.projectName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>资产类型： {{ repairInfo.assetTypeName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>资产分类： {{ repairInfo.objectTypeName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>资产名称： {{ repairInfo.assetName }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>资产编码： {{ repairInfo.assetCode }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>资产位置： {{ repairInfo.address }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>维修人（单位）： {{ repairInfo.maintainUserId }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>维修费用（元）： {{ repairInfo.maintainCost }}元</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>开始日期： {{ repairInfo.startDate }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>完成日期： {{ repairInfo.completeDate }}</div>
      </a-col>
      <a-col :span="7" :offset="1">
        <div>提交人： {{ repairInfo.createByName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="6" :offset="2">
        <div>提交时间： {{ repairInfo.createTime }}</div>
      </a-col>
      <a-col :span="15" :offset="1">
        <div>维修说明： {{ repairInfo.remark }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="22" :offset="2">
        <div>
          附件：
          <SG-UploadFile
            type="all"
            v-model="uploadList"
            :show="true"
            class="mt20"
          />
        </div>
      </a-col>
    </a-row>
    <SG-Title title="付款计划" />
    <a-table
      class="ml50 mr50"
      style="margin-bottom: 74px"
      :columns="columns"
      :data-source="dataSource"
      bordered
      :pagination="false"
      size="middle"
    ></a-table>
    <!-- 页脚 -->
    <FormFooter style="border: none" location="fixed">
      <div>
        <SG-Button type="primary" @click="approval('')">审批通过</SG-Button>
        <SG-Button @click="approval('reject')">驳回</SG-Button>
      </div>
    </FormFooter>
  </div>
</template>

<script>
const columns = [
  {
    title: "编号",
    align: "center",
    customRender: (text, record, index) => `${index + 1}`,
    width: 70,
  },
  {
    title: "收款人（单位）",
    dataIndex: "payee",
    align: "center",
    width: "15%",
  },
  {
    title: "费用科目",
    dataIndex: "costName",
    align: "center",
    width: "13%",
  },
  {
    title: "付款金额（元）",
    dataIndex: "paymentAmount",
    align: "center",
    width: "13%",
  },
  {
    title: "付款时间",
    dataIndex: "paymentDate",
    align: "center",
    width: "13%",
  },
  {
    title: "跟进人",
    dataIndex: "followUpUser",
    align: "center",
    width: "10%",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },
];
import FormFooter from "@/components/FormFooter";
export default {
  data() {
    return {
      columns,
      dataSource: [],
      maintainId: "",
      uploadList: [],
      repairInfo: {},
    };
  },
  components: { FormFooter },
  methods: {
    getMaintainInfo() {
      if (this.maintainId) {
        this.$api.assetRent
          .getMaintainInfo({ maintainId: this.maintainId })
          .then((res) => {
            if (+res.data.code === 0) {
              this.repairInfo = res.data.data;
              this.dataSource = res.data.data.detailList;
              this.dataSource.forEach((item, index) => {
                item.key = item.costId;
              });
              // 附件列表处理
              let attachment = [];
              res.data.data.attachmentList.forEach((item) => {
                let obj = {
                  url: item.attachmentPath,
                  name: item.oldAttachmentName,
                };
                attachment.push(obj);
                this.uploadList = attachment;
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    // 审批/驳回请求
    approveMaintain(type) {
      let obj = {
        maintainId: this.maintainId,
        approvalStatus: type === "reject" ? 3 : 1,
      };
      this.$api.assetRent.approveMaintain(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          this.$message.success(
            `${type === "reject" ? "驳回成功！" : "审批通过！"}`
          );
          this.$router.push("/repairRegister");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 审批通过 / 驳回
    approval(type) {
      if (type === "") {
        this.approveMaintain(type);
      } else {
        this.approveMaintain(type);
      }
    },
  },
  created() {
    this.maintainId = this.$route.query.maintainId;
  },
  mounted() {
    // 获取详情
    this.getMaintainInfo();
  },
};
</script>

<style lang="less" scoped>
.repairDetail {
  padding: 0 45px 70px 70px;

  .a_row {
    margin-bottom: 26px;
  }
  /deep/.ant-table-thead {
    th div {
      text-align: center;
    }
  }
}
</style>