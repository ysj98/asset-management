<!--
 * @Date: 2019-11-05 16:16:20
 * @Author: chen han
 * @Description: 楼栋信息
 -->
<template>
  <div class="buildingInfo-page" ref="buildingInfo">
    <!-- 树结构部分 -->
    <div class="tree-box">
      <div class="top">
        <span class="top-title top-title-left">组织机构树</span>
      </div>
      <div class="tree-content">
        <OrganTree @change="checkTreeChange" ref="positionTree" />
      </div>
    </div>
    <!-- 右边表格 -->
    <div class="right-wrapper">
      <div class="top">
        <div style="display: flex;align-items: center">
          <a-icon
            type="info-circle"
            style="color: #45a2ff;font-size: 16px"
            theme="filled"
          />
          <div style="width: 6px;"></div>
          <span class="top-title top-title-right">
            对应机构未开启个性化设置时，将使用机构树中最近节点上级组织的开启个性化设置
          </span>
        </div>
        <div style="justify-self: flex-end">
          <SG-Button @click="doSave" type="primary">保存</SG-Button>
        </div>
      </div>
      <div class="right-content">
        <a-tabs :default-active-key="1">
          <a-tab-pane v-for="item in tabArr" :key="item.key" :tab="item.title">
            <component
              :key="`${item.key}${organId}`"
              ref="tab"
              :is="item.component"
              :organId="organId"
            ></component>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import SystemSetting from "./SystemSetting";
import OrganTree from "./components/OrganTree";
import { ASSET_MANAGEMENT } from "@/config/config.power";
export default {
  name: "paramsConfig",
  components: {
    OrganTree,
    SystemSetting
  },
  props: {},
  data() {
    return {
      organId: "",
      tabArr: [
        {
          key: 1,
          title: "系统设置",
          component: SystemSetting
        }
      ],
      ASSET_MANAGEMENT,
      activeType: "", // -2楼栋列表，0楼栋, 1单元, 2楼层
      pageType: "", // create新增， edit编辑，
      createType: "", // unit新建单元，build新建楼栋，floor新建楼层
      activeItem: {},
      childNodeType: "", // 0可新建楼栋, 1单元， 2楼层
      upErrorInfo: ""
    };
  },
  mounted() {},
  methods: {
    doSave() {
      let req = {
        organId: "",
        paramList: []
      };
      let tempArr = [];
      // 每个 tab 都保存
      this.$refs.tab.forEach(ref => {
        tempArr.push(ref.sendData());
      });
      // 保证每一个子组件都通过校验并返回了数据
      if (tempArr.every(ele => ele)) {
        req.paramList = tempArr.flat();
      } else {
        return null;
      }
    },
    // 点击树节点改变
    checkTreeChange(value) {
      this.organId = value.organId;
      this.$refs.tab.forEach(ele => {
        ele.getTableData("test");
      });
    }
  }
};
</script>
<style lang="less" scoped>
.buildingInfo-page {
  border: 1px solid rgba(238, 242, 245, 1);
  border-radius: 0px 4px 4px 4px;
  border-top: none;
  display: flex;
  height: calc(100vh - 132px);
  background-color: #ebeff2;
  .tree-box {
    background-color: #fff;
    flex: 0 0 265px;
    height: 100%;
    border-right: 1px solid rgba(238, 242, 245, 1);
    .tree-content {
      height: calc(~"100% - 69px");
      overflow: auto;
      padding-left: 20px;
    }
    .tree-btn {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .right-wrapper {
    background-color: #fff;
    flex: 1;
    height: 100%;
    position: relative;
    margin-left: 6px;
  }
}
.top {
  height: 44px;
  padding-left: 12px;
  padding-right: 12px;
  border-bottom: 1px solid rgba(238, 242, 245, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .top-title {
    font-size: 14px;
    line-height: 44px;
  }
  .top-title-left {
    color: #324057;
  }
  .top-title-right {
    color: #687485;
  }
}
.right-content {
  padding: 6px;
  height: calc(100% - 44px);
  overflow: auto;
}
.no_page {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 214px;
  margin-left: -107px;
  margin-top: -77px;
  text-align: center;
  .img-box {
    height: 154px;
    //background-image: url('../../assets/image/undertake/init_no.png');
    background-size: 100% 100%;
  }
}
</style>
