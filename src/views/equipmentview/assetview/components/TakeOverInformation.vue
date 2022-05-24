<template>
  <div>
    <Information v-bind="infoOptions" />
  </div>
</template>

<script>
import Information from "@/components/Information";
export default {
  // 接管信息
  name: "TakeOverInformation",
  components: {
    Information,
  },
  props: {
    assetId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      infoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: "资产项目",
              key: "projectName",
            },
            {
              title: "来源方式",
              key: "sourceTypeName",
            },
            {
              title: "来源渠道",
              key: "sourceChannelType",
            },
          ],
          [
            {
              title: "管理机构",
              key: "organName",
            },
            // {
            //   title: "是否接管",
            //   // 暂时不展示
            //   key: "todo",
            // },
            {
              title: "接管日期",
              key: "takeOverDate",
            },
            {
              title: "上报基础情况表时间",
              key: "reportBasicInfoDate",
            },
          ],
          [
            {
              title: "设备设施核实时间",
              key: "houseVerificationDate",
            },
            {
              title: "上报设备设施划转请示时间",
              key: "reportHouseTransferReqDate",
            },
            {
              title: "上报核实报告时间",
              key: "reportingVerificationReportDate",
            },
          ],
          [
            {
              title: "划转批复下发时间",
              key: "transferApprovalDate",
            },
            {
              title: "协议签署时间",
              key: "agreementSignDate",
            },
          ],
          [
            {
              title: "权属办理中存在问题",
              key: "ownershipHandleProblems",
            },
            {
              title: "历史遗留问题",
              key: "houseTransferHisProblem",
            },
          ],
        ],
        colProps: { span: 8 },
      },
    };
  },
  methods: {
    queryAssetViewTakeOverDetail() {
      const req = {
        assetId: this.assetId,
      };
      console.log({ req });
      this.$api.assets
        .queryAssetViewTakeOverDetail(req)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            this.infoOptions.data = data;
          } else {
            this.$message.error(message);
          }
        });
    },
  },
  mounted() {
    this.queryAssetViewTakeOverDetail();
  },
};
</script>

<style scoped></style>