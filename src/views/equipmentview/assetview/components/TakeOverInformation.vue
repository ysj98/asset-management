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
  data() {
    return {
      infoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: "资产项目",
              key: "name",
            },
            {
              title: "来源方式",
              key: "name",
            },
            {
              title: "来源渠道",
              key: "name",
            },
          ],
          [
            {
              title: "管理机构",
              key: "name",
            },
            {
              title: "是否接管",
              key: "name",
            },
            {
              title: "接管日期",
              key: "name",
            },
          ],
          [
            {
              title: "上报基础情况表时间",
              key: "name",
            },
            {
              title: "设备设施核实时间",
              key: "name",
            },
            {
              title: "上报设备设施划转请示时间",
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
            },
            {
              title: "历史遗留问题",
              key: "name",
            },
          ],
        ],
      },
    };
  },
};
</script>

<style scoped></style>
