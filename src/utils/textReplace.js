/**
 * 调用方式： this.$textReplace(), textReplace 工具函数已经挂在到vue prototype 上
 * 参数： organId 可选，如果传了organId，则获取配置的接口，将配置信息存到localStorage，没传，直接获取localStorage信息
 * 工作方式：通过获取存在货币单位，面积到位的dom，遍历dom，通过innerText拿到文本值通过replace去改变
 */
import * as paramsConfig from "@/api/paramsConfig";
// 判断是不是改造范围
let langType = () => {
  // 香港需求资本改造页面第一期范围
  let routerList = [
    "assetRegister", // 资产登记
    "authorityCardManagement", // 权证管理
    "ownershipSurvey", // 权属概况
    "ownershipRegistration", // 权属登记
    "assetChangeRegister", // 资产变更单
    "assetChangeView", // 资产变更一览表
    "buildingDict", // 楼盘字典
    "assetMap", // 资产地图
    "worthRegister", // 价值登记
    "assetView", // 房屋资产视图
    "landAssetsView", // 土地资产视图
    "assetCarPrakView", // 车场资产视图
    "ownershipCardList", // 权属证件一览表
  ];
  var flag = false;
  routerList.forEach((url) => {
    if (location.hash.split("/")[1].indexOf(url) !== -1) {
      flag = true;
    }
  });
  return flag;
};
// 项目信息设置 获取货币单位以及面积单位
let getResourceConfig = (organIds) => {
  return new Promise((resolve) => {
    if (organIds) {
      paramsConfig.getResourceConfig({ organIds: organIds }).then((result) => {
        const { code, data } = result.data;
        if (code === "0") {
          const { currencyId, areaUnitId } = data;
          const lang = {
            monetaryUnit: currencyId === 1 ? "元" : "港元",
            areaUnit: areaUnitId === 1 ? "m²" : "ft²",
          };
          localStorage.setItem("lang", JSON.stringify(lang));
          console.log("获取货币单位以及面积单位", "organIds", organIds, "lang", lang);
          resolve();
        }
      });
    } else {
      console.log("直接改变货币单位以及面积单位");
      resolve();
    }
  });
};
let textReplace = (organIds) => {
  // 判断是不是改造范围
  if (!langType()) {
    console.log("非本次改造范围");
    return;
  }
  getResourceConfig(organIds).then(() => {
    let lang = localStorage.getItem("lang") || {
      monetaryUnit: "元",
      areaUnit: "m²",
    };
    if (typeof lang === "string") {
      lang = JSON.parse(lang);
    }
    // 考虑到性能问题，对可能含有货币单位，面积单位的dom类型进行总结
    let body = document.body;
    const domList = {
      ".ant-table-thead": ["span"],
      ".ant-table-tbody": ["span"],
      ".particulars": ["span"],
      ".overview_num": ["div"],
      ".ant-modal-body": ["label", "div", "span"],
      ".page-detail-item": ["span"],
      ".createBuilding-page": ["label"],
      ".createHouse-page": ["label"],
      ".landInfo-create-page": ["label", "span"],
      ".detailHouse-page": ["div"],
      ".detailLand-page": ["div"],
      ".necessaryCaaessories": ["span"],
      ".valueToRegister": ["span"],
      ".basicDownload": ["label"],
      ".asset_view": ["span"],
    };
    Object.keys(domList).forEach((node) => {
      let doms = body.querySelectorAll(node);
      // console.log(doms, "doms");
      Array.from(doms).forEach((dom) => {
        domList[node].forEach((nodeType) => {
          let nodes = dom.querySelectorAll(nodeType);
          // console.log(nodes, "nodes");
          Array.from(nodes).forEach((node) => {
            if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 && node.innerText.search(/单元/g) === -1 && node.innerText.search(/元|港元/g) !== -1) {
              // console.log(node);
              node.innerText = node.innerText.replace(/元|港元/g, lang.monetaryUnit);
            }
            if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 && node.innerText.search(/m²|㎡|ft²/g) !== -1) {
              // console.log(node);
              node.innerText = node.innerText.replace(/m²|㎡|ft²/g, lang.areaUnit);
            }
          });
        });
      });
    });
    Array.from(document.querySelectorAll("input")).forEach((dom) => {
      if (dom.placeholder.search(/元|港元/g) !== -1) {
        dom.placeholder = dom.placeholder.replace(/元|港元/g, lang.monetaryUnit);
      }
      if (dom.placeholder.search(/m²|㎡|ft²/g) !== -1) {
        dom.placeholder = dom.placeholder.replace(/m²|㎡|ft²/g, lang.areaUnit);
      }
    });
  });
};

export { textReplace };
