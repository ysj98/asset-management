<template>
  <div class="equipmentview-projectview-detail">
    <SG-Title title="基本信息" />
    <Information v-bind="basicInfoOptions" />
    <SG-Title title="其他信息" />
    <Information v-bind="otherInfoOptions" />
    <SG-Title title="权属概况" />
    <SG-Title title="资产状况" />
  </div>
</template>

<script>
import Information from "@/components/Information";
export default {
  name: "projectviewDetail",
  components: {
    Information,
  },
  data() {
    return {
      basicInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: "管理机构",
              key: "name",
            },
            {
              title: "资产项目名称",
              key: "name",
            },
            {
              title: "资产项目编码",
              key: "name",
            },
          ],
          [
            {
              title: "来源方式",
              key: "name",
            },
            {
              title: "来源渠道",
              key: "name",
            },
            {
              title: "是否接管",
              key: "name",
            },
          ],
          [
            {
              title: "接管时间",
              key: "apprStatusStr",
            },
            {
              title: "接管时资产状态",
              key: "applyId",
            },
            {
              title: "项目状态",
              key: "applyId",
            },
          ],
          [
            {
              title: "暂无",
              key: "apprStatusStr",
            },
          ],
          [
            {
              title: "附件",
              key: "applyId",
              colProps: {
                span: 24,
              },
            },
          ],
        ],
        colProps: { span: 8 },
      },
      otherInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: "上报基础情况表时间",
              key: "name",
            },
            {
              title: "房屋核实时间",
              key: "name",
            },
            {
              title: "上报房屋划转请示时间",
              key: "name",
            },
          ],
          [
            {
              title: "上报核实报告时间",
              key: "name",
            },
            {
              title: "划转批复下发时间",
              key: "name",
            },
            {
              title: "协议签署时间",
              key: "name",
            },
          ],
          [
            {
              title: "权属办理中存在问题",
              key: "name",
              colProps: {
                span: 24,
              },
            },
          ],
          [
            {
              title: "历史遗留问题",
              key: "name",
              colProps: {
                span: 24,
              },
            },
          ],
        ],
        colProps: { span: 8 },
      },
    };
  },
};
</script>

<style scoped>
.equipmentview-projectview-detail {
  padding: 20px 60px;
}
</style>
