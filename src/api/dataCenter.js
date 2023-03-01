// 调用数据中心接口
import { axiosPost } from 'utils/axios';
import { dataCenter } from '@/config/config.url';

export function dataCacheTrans({ subUrl, form }) {
  let par = {
    subUrl,
    paramJson: JSON.stringify({
      appKey: null,
      requestTime: +new Date(),
      requestId: +new Date(),
      noncestr: +new Date(),
      apiVersion: '0.1',
      data: form,
    }),
  };
  return axiosPost(dataCenter.dataCenter, par);
}
