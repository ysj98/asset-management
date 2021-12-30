import { queryTopOrganByOrganID } from "@/views/buildingDict/publicFn";
import * as apiOperationParams from "@/api/operationParams";

export const baseColumns = [
  {
    title: "资产名称",
  },
  {
    title: "资产编码",
  },
  {
    title: "资产类型",
  },
  {
    title: "资产分类",
  },
  {
    title: "所在位置",
  },
  {
    title: "来源方式",
  },
];

export function generateColumnsByParamList(paramList, mapFn) {
  if (!Array.isArray(paramList)) {
    console.error(`错误入参${arguments}`);
    return null;
  }
  if (typeof mapFn === "function") {
    return paramList.map(mapFn);
  }
  return paramList.map((ele) => {
    return {
      dataIndex: ele.transferOperationCode,
      title: ele.transferOperationName,
    };
  });
}
export function generateParamForm() {}
export async function getColumns({ organId, assetType }, mapFn) {
  const errorArr = ["", undefined, null];
  if (errorArr.includes(organId) || errorArr.includes(assetType)) {
    console.error(arguments);
    return null;
  }
  const { organId: topOrganId } = await queryTopOrganByOrganID({
    nOrganId: organId,
    nOrgId: organId,
  });
  const req = {
    pageNum: 1,
    pageSize: 99999,
    status: 1,
    assetType,
    organId: topOrganId,
  };
  return new Promise((resolve, reject) => {
    apiOperationParams.getPage(req).then(
      (value) => {
        console.log("value", value);
        let result = value.data.data.data;
        if (typeof mapFn === "function") {
          result = result.map(mapFn);
        } else {
          result = result.map((ele) => {
            return {
              dataIndex: ele.transferOperationCode,
              title: ele.transferOperationName,
            };
          });
          resolve(result);
        }
      },
      (reason) => {
        reject(reason);
      }
    );
  });
}
