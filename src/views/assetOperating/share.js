import { queryTopOrganByOrganID } from "@/views/buildingDict/publicFn";
import * as apiOperationParams from "@/api/operationParams";
import * as apiToOperation from "@/api/toOperation";
import { message as $message } from "ant-design-vue";
export const baseColumns = [
  {
    title: "资产名称",
    dataIndex: "assetName",
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
  },
  {
    title: "资产分类",
    dataIndex: "objectTypeName",
  },
  {
    title: "所在位置",
    dataIndex: "address",
  },
  {
    title: "来源方式",
    dataIndex: "sourceModeName",
  },
];
export function generateColumnsByParamList({ paramList }, mapFn) {
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
        let result = value.data.data ? value.data.data.data : [];
        if (typeof mapFn === "function") {
          result = result.map(mapFn);
        } else {
          result = result.map((ele) => {
            return {
              dataIndex: ele.transferOperationCode,
              title: ele.transferOperationName,
            };
          });
        }
        resolve(result);
      },
      (reason) => {
        reject(reason);
      }
    );
  });
}

export function getBaseInfo({ assetOperationRegisterId }) {
  if (!assetOperationRegisterId) {
    console.error(arguments);
    return null;
  }
  return new Promise((resolve, reject) => {
    const req = {
      assetOperationRegisterId,
    };
    apiToOperation.getBasicMessage(req).then(
      ({ data: { code, message, data } }) => {
        if (code === "0") {
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

export function getOperationDetailListPage({
  assetOperationRegisterId,
  pageNum,
  pageSize,
}) {
  return new Promise((resolve, reject) => {
    if (!assetOperationRegisterId || !pageNum || !pageSize) {
      console.error(arguments);
      return null;
    }
    const req = {
      assetOperationRegisterId,
      pageNum,
      pageSize,
    };
    apiToOperation.getOperationDetailListPage(req).then(
      ({ data: { code, message, data } }) => {
        if (code === "0") {
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
export function flatTableDataSource({ dataSource },keyStr='paramList') {
  if (!Array.isArray(dataSource)) {
    console.error(arguments);
    return null;
  }
  return dataSource.map((ele) => {
    const res = {};
    ele[keyStr] &&
      ele[keyStr].forEach((ele) => {
        res[ele.transferOperationCode] = ele.transferOperationValue;
      });
    console.log('res',res)
    return {
      ...ele,
      ...res,
    };
  });
}
