import * as apiAssets from "@/api/assets";
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
