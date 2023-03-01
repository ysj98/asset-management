import vueInstance from '@/main';
// 根据项目查询一级组织机构
export function queryTopOrganByOrganID({ nOrgId, nOrganId }) {
  return new Promise((resolve) => {
    if (!nOrgId || !nOrganId) {
      vueInstance.$message.error('请输入正确的入参');
      resolve(null);
      return null;
    }
    // 此处做处理，是因为组织机构会多选，多选时，只用传第一个organId即可
    if (Array.isArray(nOrgId) && nOrgId.length > 0) {
      nOrgId.split(',')[0];
    }
    if (Array.isArray(nOrganId) && nOrganId.length > 0) {
      nOrganId.split(',')[0];
    }
    let form = {
      subUrl: '/datacachesvr-api-netty/queryTopOrganByOrganID',
      form: {
        channel: 1,
        nOrgId: +nOrgId,
        nOrganId: +nOrganId,
      },
    };
    vueInstance.$api.dataCenter.dataCacheTrans(form).then((res) => {
      if (!res.data.data.organId) {
        vueInstance.$message.error(res.data.message || '获取组织机构失败');
      }
      let resultData = res.data.data;
      resultData.organId = String(resultData.organId);
      resolve(resultData);
    });
  });
}
export function sleepFn(time) {
  console.log('test');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time || 0);
  });
}
