import * as apiAssets from "@/api/assets";
import * as apiGlobal from "@/api/global";
import { message as $message } from "ant-design-vue";

export function getObjectKeyValueByOrganId({ organId, projectName }, cb) {
  if (!organId) {
    console.error("organId 必传");
    return null;
  }
  const req = {
    organId,
    projectName: projectName === "" ? "" : projectName,
  };
  return new Promise((resolve, reject) => {
    apiAssets
      .getObjectKeyValueByOrganId(req)
      .then(({ data: { code, data, message } }) => {
        if (code === "0") {
          let res = data;
          if (typeof cb === "function") {
            res = data.map(cb);
          }
          resolve(res);
        } else {
          this.$message.error(message);
          reject(message);
        }
      });
  });
}

export function getTableHeaders({ funType }) {
  return new Promise((resolve, reject) => {
    const req = {
      funType: funType,
    };
    apiGlobal.assetRolListV2(req).then(
      ({ data: { code, message, data } }) => {
        if (code === "0") {
          console.log(data);
          resolve(data);
        } else {
          $message.error(message);
          reject(message);
        }
      },
      (reason) => {
        reject(reason);
      }
    );
  });
}
