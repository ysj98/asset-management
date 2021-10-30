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
  * */
  const keyArr = ["ids", "list"];
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
      list: "assetHouseList"
    },
    [ASSET_TYPE_CODE.LAND]: {
      ids: "blankIdList",
      list: "assetBlankList"
    },
    [ASSET_TYPE_CODE.EQUIPMENT]: {
      ids: "equipmentTypeList",
      list: "assetEquipList"
    },
    [ASSET_TYPE_CODE.YARD]: {
      ids: "yardIds",
      list: ""
    }
  };
  return options[assetType][keyStr];
}
