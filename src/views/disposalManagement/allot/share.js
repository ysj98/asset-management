import * as apiAssets from '@/api/assets.js';
import * as allot from '@/api/allot';
import { message as $message } from 'ant-design-vue';
/*
 * 获取资产项目
 * */
export async function getObjectKeyValueByOrganIdFn({ organId }) {
  return new Promise((resolve, reject) => {
    let obj = {
      organId,
    };
    apiAssets.getObjectKeyValueByOrganId(obj).then(
      (res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || [];
          let result = data.map((item) => {
            return {
              label: item.projectName,
              value: item.projectId,
            };
          });
          resolve(result);
        } else {
          $message.error(res.data.message);
          reject(res.data.message);
        }
      },
      (reason) => {
        reject(reason);
      }
    );
  });
}

export async function getDetail({ id }) {
  return new Promise((resolve, reject) => {
    const req = {
      id: id,
    };
    allot.queryTransferDetail(req).then(
      ({ data: { code, message, data } }) => {
        if (code === '0') {
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
