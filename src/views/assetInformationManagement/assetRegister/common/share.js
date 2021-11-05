import store from "@/store/index";
export function handleAssetTypeField(assetType, keyStr) {
  const ASSET_TYPE_CODE = store.state.ASSET_TYPE_CODE;
  // 有的接口 不同业态 不同 字段名， keyArr 中的元素对应 接口中 不同字段名的 统一 key
  /*
   * ids
   *   - /registerOrder/checkBuildsObjectType
   * list
   *   - /ams/registerOrder/readExcelModel
   *   - /ams/registerOrder/readExcelModelV2
   *   - /ams/registerOrder/saveRegisterOrder
   * verificationList
   *   - 资产登记 导入模板所得数据进行数据校验
   * pageList
   *   - /ams/registerOrder/getRegisterOrderDetailsPageById
   * */
  const keyArr = ["ids", "list", "verificationList", "pageList"];
  if (!keyArr.includes(keyStr)) {
    console.trace();
    throw new Error(`keyStr must in ${keyArr}`);
  }
  /*
   * ids 下载模板 时 不同 assetType 入参不同
   * */
  const options = {
    [ASSET_TYPE_CODE.HOUSE]: {
      ids: "buildIds",
      list: "assetHouseList",
      pageList: "assetHoseList",
      verificationList: "houseVerificationList",
    },
    [ASSET_TYPE_CODE.LAND]: {
      ids: "blankIdList",
      list: "assetBlankList",
      pageList: "assetLandList",
      verificationList: "landVerificationList"
    },
    [ASSET_TYPE_CODE.EQUIPMENT]: {
      ids: "equipmentTypeList",
      list: "assetEquipList",
      pageList: "equipList",
      verificationList: "equipmentVerificationList"
    },
    [ASSET_TYPE_CODE.YARD]: {
      ids: "carParkIds",
      list: "assetCarParkList",
      pageList: "carParkList",
      verificationList: "yardVerificationList"
    }
  };
  return options[assetType][keyStr];
}

// 下载模板确认
export function commonFn() {
  // 房屋
  if (this.checkboxAssetType === this.ASSET_TYPE_CODE.HOUSE) {
    if (!this.positionIds || this.positionIds.length === 0) {
      this.$message.info("请选择楼栋名称");
      return;
    }
    if (this.scope.length < 0) {
      this.$message.info("请选择数据范围");
      return;
    }
    if (this.scope.includes("1")) {
      this.checkBuildsObjectTypeFn(this.ASSET_TYPE_CODE.HOUSE);
    } else {
      this.confirmDownloadTemplate();
    }
  } else if (this.checkboxAssetType === this.ASSET_TYPE_CODE.LAND) {
    if (!this.positionIds || this.positionIds.length === 0) {
      this.$message.info("请选择土地名称");
      return null;
    } else {
      this.checkBuildsObjectTypeFn(this.ASSET_TYPE_CODE.LAND);
    }
  } else if (this.checkboxAssetType === this.ASSET_TYPE_CODE.YARD) {
    if (!this.positionIds || this.positionIds.length === 0) {
      this.$message.info("请选择车场名称");
      return null;
    }
    if (this.scope.length < 0) {
      this.$message.info("请选择数据范围");
      return null;
    }
    if (this.scope.includes("1")) {
      this.checkBuildsObjectTypeFn("1");
    } else {
      this.confirmDownloadTemplate();
    }
  } else if (this.checkboxAssetType === this.ASSET_TYPE_CODE.EQUIPMENT) {
    if (!this.positionIds || this.positionIds.length === 0) {
      this.$message.info("请选择设备设施分类");
      return null;
    } else {
      this.checkBuildsObjectTypeFn(this.ASSET_TYPE_CODE.EQUIPMENT);
    }
  }
}
// 资产登记-导出数据校验
export function checkBuildsObjectTypeFn(val) {
  let ASSET_TYPE_IDS = handleAssetTypeField(val, "ids");
  let obj = {
    assetType: this.checkboxAssetType,
    [ASSET_TYPE_IDS]: this.positionIds
  };
  // 如果时 设备设施 必传 organId
  this.checkboxAssetType === this.ASSET_TYPE_CODE.EQUIPMENT &&
    (obj.organId = this.equipmentOrganId);
  this.$api.assets.checkBuildsObjectType(obj).then(res => {
    if (res.data.code === "0") {
      this.confirmDownloadTemplate();
    } else {
      this.$message.error(res.data.message);
    }
  });
}
// 模板下载
export function confirmDownloadTemplate(api, otherRequestData) {
  let ASSET_TYPE_IDS = handleAssetTypeField(this.checkboxAssetType, "ids");
  let requestData = {
    assetType: this.checkboxAssetType, // 资产类型, 1房屋、2土地、3设备
    scope:  [this.ASSET_TYPE_CODE.HOUSE,this.ASSET_TYPE_CODE.YARD].includes(this.checkboxAssetType) ? this.scope.join(",") : "",
    // 如果是 设备设施 类型 就取 设备设施 筛选所用  organId
    organId:
      this.checkboxAssetType === this.ASSET_TYPE_CODE.EQUIPMENT
        ? this.equipmentOrganId
        : this.organId,
    [ASSET_TYPE_IDS]: this.positionIds
  };
  Object.assign(requestData, otherRequestData);
  api(requestData).then(res => {
    let blob = new Blob([res.data]);
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "资产登记模板.xls";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    this.modalShow = false;
  });
}
