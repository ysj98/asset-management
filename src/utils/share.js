import * as apiAssets from "@/api/assets";
import * as apiGlobal from "@/api/global";
import { message as $message } from "ant-design-vue";
import {math as $math} from '@/utils/math'
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

/*
* 初始化 表头
* columns 表头对象(注意函数副作用！)
* detailColumns 详细表头信息与后台返回的表格数据相结合用
* requiredColumn 类似 操作表头的表头
* funType 后台定义
* */
export async function initTableColumns({columns,detailColumns,requiredColumn,funType}){
  // 利用js "传址" 特性,便利函数封装，使用者应注意函数副作用
  columns.splice(0,columns.length)
  // 暂不考虑固定表头顺序问题，目前只有操作列
  const res = await getTableHeaders({funType})
  res.customShow.forEach( ele =>{
    let mapRes = {}
    // 匹配用户预设表头，使用前端代码对应表头配置
    const temp = detailColumns.find(item=>{return [item.key,item.dataIndex].includes(ele.colCode)})
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

  if(requiredColumn){
    console.log({requiredColumn})
    requiredColumn.forEach(ele=>{
      columns.splice(columns.length,0,ele)
    })
  }
  // 增加空白列 占用多余空间
  columns.push({title:'',dataIndex:''})

  // 最后一列添加空白列，所以不需要特殊处理最后一列的 width 属性了
  // 特殊处理最后一列 删除 width 属性
  // const lastColumn  = columns.pop()
  // const resLastColumn = {
  //   ...lastColumn
  // }
  // delete resLastColumn.width
  // columns.push(resLastColumn)
}
/*
* scroll 引用对象
* otherHeight 表格之外元素高度总和
* */
export  function handleTableScrollHeight(scroll,otherHeight = 500){
  // 除去表格元素 其他元素高度总计不超过 500
  scroll.y = Math.max(600, document.body.clientHeight - otherHeight)
}

export function handleTableHeaderScrollHeight(target){
  // -8px 参考 var.less 中的 @tableScrollHeight
  target.querySelector(".ant-table-header").style.marginBottom = "-8px"
}

/*
* 处理 合计行
* 引用对象
* 注意函数副作用
* totalKeyArr 需要统计合计的key <Array>
* */
export function handleTableTotalRow({ columns, dataSource, totalKeyArr,rowKey}){
  const currentPageTotalData = {
    // 保证 rowKey 有值
    [rowKey]: Math.random()
  }
  const allPageTotalData = {
    // 保证 rowKey 有值
    [rowKey]: Math.random()
  }
  columns.forEach((ele,index)=>{
    const keyStr = ele.dataIndex || ele.key
    if (totalKeyArr.includes(keyStr)){
      const data = dataSource.reduce((pre,cur)=>{
        return $math.simplify(`${pre}+${cur[keyStr]||0}`).toString()
      },0)
      currentPageTotalData[keyStr] = isNaN(data) ? "" : Number(data)
    }
    if (index === 0){
      currentPageTotalData[keyStr] = '当前页-合计'
      allPageTotalData[keyStr] = '所有页-合计'
    }
  })
  dataSource.push(
    currentPageTotalData,
    allPageTotalData
  )
}