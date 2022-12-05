import vueInstance from '@/main'
// 根据项目查询一级组织机构
export function queryTopOrganByOrganID({nOrgId, nOrganId}) {
  return new Promise((resolve) => {
    if (!nOrgId || !nOrganId) {
      vueInstance.$message.error( "请输入正确的入参");
      resolve(null)
      return null;
    }
    let form = {
      subUrl: "/datacachesvr-api-netty/queryTopOrganByOrganID",
      form: {
        channel: 1,
        nOrgId: +nOrgId.split(',')[0],
        nOrganId: +nOrganId.split(',')[0]
      }
    };
    vueInstance.$api.dataCenter.dataCacheTrans(form).then(res => {
      if (!res.data.data.organId) {
        vueInstance.$message.error(res.data.message || "获取组织机构失败");
      }
      let resultData = res.data.data
      resultData.organId = String(resultData.organId)
      resolve(resultData)
    });
  })
}
export function sleepFn(time) {
  console.log('test')
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time || 0)
  })
}
