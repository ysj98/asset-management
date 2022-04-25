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


export async function initTableColumns({columns,detailColumns,funType}){
  // 利用js "传址" 特性,便利函数封装，使用者应注意函数副作用
  columns.splice(0,columns.length)
  // 暂不考虑固定表头顺序问题，目前只有操作列
  const res = await getTableHeaders({funType})
  res.customShow.forEach( ele =>{
    let mapRes = {}
    // 匹配用户预设表头，使用前端代码对应表头配置
    const temp = detailColumns.find(item=>[item.key,item.dataIndex].includes(ele.colCode))
    if (temp){
      mapRes = temp
    }else {
      mapRes =  {
        title: ele.colName,
        dataIndex: ele.colCode,
      }
    }
    columns.push(mapRes)
  })
  // 给每一列设置 ellipsis:true 保证 表头和数据对齐(都需要有宽度)
  columns.forEach(ele=>{
    ele.ellipsis = true
  })
  // 增加空白列 占用多余空间
  columns.push({title:'',dataIndex:''})
  // 特殊处理最后一列 删除 width 属性
  const lastColumn  = columns.pop()
  const resLastColumn = {
    ...lastColumn
  }
  delete resLastColumn.width
  columns.push(resLastColumn)
}