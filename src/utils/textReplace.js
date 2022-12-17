let langType = () => {
  // 香港需求资本改造页面第一期范围
  let routerList = [
    "assetRegister",
    "buildingDict",
    "ownershipSurvey",
    "assetChangeRegister",
    "assetChangeView",
    "buildingDict",
    "assetMap",
    "worthRegister",
    "assetView",
    "landAssetsView",
    "assetCarPrakView",
    "ownershipRegisterView",
  ];
  if (routerList.indexOf(location.hash.split("/")[1]) !== -1) {
    return true;
  }
  return false;
};
let textReplace = () => {
  if (!langType()) {
    return;
  }
  let lang = localStorage.getItem("lang") || {
    monetaryUnit: "元",
    areaUnit: "m²",
  };
  if (typeof lang === "string") {
    lang = JSON.parse(lang);
  }
  // 考虑到性能问题，对可能含有货币单位，面积单位的dom类型进行总结
  // 表头 thead.ant-table-thead 基本信息 div.particulars
  let body = document.body;
  const domList = [".ant-table-thead", '.particulars', '.overview_num'];
  const childNodeList = ["span", 'div'];
  domList.forEach((node) => {
    let doms = body.querySelectorAll(node);
    console.log(doms, "doms");
    Array.from(doms).forEach((dom) => {
      childNodeList.forEach((nodeType) => {
        let childNode = dom.querySelectorAll(nodeType);
        console.log(childNode, "childNode");
        Array.from(childNode).forEach((node) => {
          // 如果span标签里面只有一个文本节点 并且包含了
          if (node.childNodes.length === 1 &&  node.innerText.search(/元|港币/g) !== -1) {
            console.log(node);
            node.innerText = node.innerText.replace(/元|港币/g, lang.monetaryUnit);
          }
          // 如果span标签里面只有一个文本节点 并且包含了
          if (node.childNodes.length === 1 &&  node.innerText.search(/m²|ft²/g) !== -1) {
            console.log(node);
            node.innerText = node.innerText.replace(/m²|ft²/g, lang.areaUnit);
          }
        });
      });
    });
  });
};

export { textReplace };
