<template>
  <div></div>
</template>

<script>
/*
 * busType
 *   - 1001 资产入库
 *   - 1002 资产出库
 *   - 1003 资产变更
 *   - 1004 资产转运营
 *   - 1005 价值登记
 *   - 1006 处置登记
 *
 * */
export default {
  /*
   * BPM内嵌审批 中转页面 （处理页面传参）
   * */
  name: "approve",
  methods: {
    /*
     * 获取页面入参
     * */
    getApprByServiceOrderId() {
      const instId = this.$route.query.instId;
      if (!instId) {
        console.error("bpm测没有对应参数，系统内部错误");
        return null;
      }
      return new Promise((resolve, reject) => {
        const req = {
          serviceOrderId: instId,
        };
        this.$api.approve.getApprByServiceOrderId(req).then(
          ({ data: { code, message, data } }) => {
            if (code === "0") {
              resolve(data);
            } else {
              reject(message);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    },
    /*
     * 价值登记
     * */
    async goAssetWorthRegister() {
      const res = await this.getApprByServiceOrderId();
      this.$router.push({
        params: {
          registerId: res.busId,
          type: "approval",
          fromBpmApprove: true,
          relatedOrganId: res.organId,
          organName: res.organName,
        },
      });
    },
    /*
     * 处置登记
     * */
    async goDisposalRegister() {
      const res = await this.getApprByServiceOrderId();
      this.$router.push({
        query: {
          type: "approval",
          relatedOrganId: res.organId,
          organId: res.organId,
          organName: res.organName,
          disposeRegisterOrderId: res.busId,
        },
      });
    },
  },
  created() {
    const busType = Number(this.$route.query.busType);
    if (busType) {
      switch (busType) {
        // 价值登记
        case 1005:
          this.goAssetWorthRegister();
          break;
        // 处置登记
        case 1006:
          this.goDisposalRegister();
          break;
      }
    } else {
      console.error("配置在线url错误");
    }
  },
};
</script>

<style scoped></style>
