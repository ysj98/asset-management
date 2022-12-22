/**
 * 调用方式： this.$textReplace(), textReplace 工具函数已经挂在到vue prototype 上
 * 参数： organId 可选，如果传了organId，则获取配置的接口，将返回信息存到localStorage，没传，直接获取localStorage信息
 * 工作方式：通过获取存在货币单位，面积到位的dom，遍历dom，通过innerText拿到文本值通过replace去改变
 */
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
    "ownershipRegisterView", // 权属证件一览表
  ];
  if (routerList.indexOf(location.hash.split("/")[1]) !== -1) {
    return true;
  }
  return false;
};
// 项目信息设置 获取货币单位以及面积单位
let getResourceConfig = (organIds) => {
  return new Promise((resolve, reject) => {
    if (organIds) {
        // const {
        //   data: { code, data },
        // } = await this.$api.paramsConfig.getResourceConfig({ organIds: organIds });
      const data = {
        resourceConfigId: "1014",
        organId: "67",
        topOrganId: "",
        currencyId: "1",
        areaUnitId: "1",
        configFlowList: [],
      };
      if (organIds === "1000279") {
        data.currencyId = "2";
        data.areaUnitId = "2";
      }
      const { currencyId, areaUnitId } = data;
      const lang = {
        monetaryUnit: currencyId === "1" ? "元" : "港币",
        areaUnit: areaUnitId === "1" ? "m²" : "ft²",
      };
      localStorage.setItem("lang", JSON.stringify(lang));
      console.log("获取货币单位以及面积单位", organIds, lang);
      resolve();
    } else {
      console.log("直接改变货币单位以及面积单位");
      resolve();
    }
  });
};
let textReplace = (organIds) => {
  // 判断是不是改造范围
  if (!langType()) {
    console.log("非单位改造范围");
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
    // 表头 thead.ant-table-thead 基本信息 div.particulars 资产数量div.overview_num 弹框div.ant-modal-body
    let body = document.body;
    const domList = {
      ".ant-table-thead": ["span"],
      ".particulars": ["span"],
      ".overview_num": ["div"],
      ".ant-modal-body": ["label", "div"],
      ".page-detail-item": ["span"],
      ".createBuilding-page": ["label"],
      ".createHouse-page": ["label"],
      ".landInfo-create-page": ["label"],
      ".detailHouse-page": ["div"],
      ".detailLand-page": ["div"],
    };
    Object.keys(domList).forEach((node) => {
      let doms = body.querySelectorAll(node);
      console.log(doms, "doms");
      Array.from(doms).forEach((dom) => {
        domList[node].forEach((nodeType) => {
          let nodes = dom.querySelectorAll(nodeType);
          console.log(nodes, "nodes");
          Array.from(nodes).forEach((node) => {
            if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 && node.innerText.search(/单元/g) === -1 && node.innerText.search(/元|港币/g) !== -1) {
              console.log(node);
              node.innerText = node.innerText.replace(/元|港币/g, lang.monetaryUnit);
            }
            if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 && node.innerText.search(/m²|㎡|ft²/g) !== -1) {
              console.log(node);
              node.innerText = node.innerText.replace(/m²|㎡|ft²/g, lang.areaUnit);
            }
          });
        });
      });
    });
  });
};

export { textReplace };
