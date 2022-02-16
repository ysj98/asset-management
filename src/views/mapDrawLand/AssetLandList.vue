<template>
  <div class="asset-land-list-block">
    <!-- 资产项目、资产名称/资产编码 搜索条件 -->
    <div class="content-filter-block">
      <SG-Select
        class="select-layer"
        v-model="currentAssetProject"
        filterable
        multiple
        placeholder="全部资产项目"
        @visible-change="handleSelectProject"
      >
        <SG-Option
          v-for="project in assetProjectOptions"
          :key="project.value"
          :label="project.label"
          :value="project.value"
          :title="project.title"
        ></SG-Option>
      </SG-Select>
      <div class="input-layer">
        <a-input
          v-model="assetNameOrCode"
          placeholder="搜资产名称、资产编码"
          class="input right-block"
        >
        </a-input>
        <div @click="getAssetList" class="search-block">
          <a-icon :style="{ color: '#ffffff' }" type="search" />
        </div>
      </div>
      <div v-if="false" style="display: inline-block">
        <button @click="toggle">{{ listFlag ? "收起" : "展开" }}</button>
      </div>
    </div>
    <div v-show="listFlag" class="asset-land-list" ref="assetLandListRef">
      <a-spin :spinning="listLoadingFlag">
        <template #indicator>
          <a-icon type="loading" style="font-size: 24px" spin />
        </template>
        <div v-if="!assetList.length" style="text-align: center">暂无数据</div>
        <div v-else>
          <div
            ref="itemRef"
            v-for="item in assetList"
            :key="item.assetId"
            class="item-block"
            :class="{ 'activity-asset': item.assetId === currentAssetId }"
            :data-id="item.assetId"
          >
            <a-popover placement="right" overlayClassName="custom-popover">
              <template #content>
                <SimpleAssetLandInfo
                  :popupDataSource="popupDataSource"
                  :assetId="item.assetId"
                />
              </template>
              <div class="list-item">
                <div class="left" @click="handleDraw(item, 'text')">
                  <span class="title-name">
                    {{ item.landName }}
                  </span>
                  <span
                    class="color-block"
                    :style="{ backgroundColor: item.modeColour }"
                  >
                  </span>
                  <span
                    class="title-flag"
                    :class="{
                      'activity-asset': item.assetId === currentAssetId,
                    }"
                  >
                    {{ item.drawStatus ? "已绘制" : "未绘制" }}
                  </span>
                </div>
                <div @click="handleDraw(item, 'edit')">
                  <SG-Icon
                    :class="{
                      'activity-asset': item.assetId === currentAssetId,
                    }"
                    style="cursor: pointer"
                    color="#666"
                    size="15px"
                    type="icon-edit"
                  ></SG-Icon>
                </div>
              </div>
            </a-popover>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
/*
 * Resolve:上线前把 临时增加的展开/收起功能隐藏
 * */
import SimpleAssetLandInfo from "@/views/mapDrawLand/components/SimpleAssetLandInfo";

export default {
  /*
   * 资产列表
   * */
  name: "AssetLandList",
  components: {
    SimpleAssetLandInfo,
  },
  props: {
    popupDataSource: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      listFlag: false,
      currentAssetId: "",
      organId: "",
      listLoadingFlag: true,
      assetNameOrCode: "",
      currentAssetProject: [],
      assetProjectOptions: [],
      assetList: [],
    };
  },
  methods: {
    toggle() {
      this.listFlag = !this.listFlag;
    },
    /*
     * ref调用
     * */
    initData({ layerSchemeId, organId }) {
      this.currentAssetProject = [];
      this.layerSchemeId = layerSchemeId;
      this.organId = organId;
      this.getAssetProjectOptions();
      this.getAssetList();
    },
    handleSelectProject(value) {
      if (!value) {
        this.getAssetList();
      }
    },
    // 获取资产项目 options
    async getAssetProjectOptions() {
      let form = {
        organId: this.organId,
      };
      this.$api.assets
        .getObjectKeyValueByOrganId(form)
        .then(({ data: { data, code, message } }) => {
          if (code === "0") {
            this.assetProjectOptions = data.map((ele) => {
              return {
                label: ele.projectName,
                value: ele.projectId,
                title: ele.projectName,
              };
            });
          } else {
            this.$message.error(message);
          }
        });
    },
    async getAssetList() {
      this.listLoadingFlag = true;
      const req = {
        layerSchemeId: this.layerSchemeId,
        assetNameOrCode: this.assetNameOrCode,
        projectIdList: this.currentAssetProject,
        organId: this.organId,
      };
      const {
        data: { data, code, message },
      } = await this.$api.drawMap.queryAssetOpMode(req);
      if (code === "0") {
        this.assetList = data;
        this.listLoadingFlag = false;
        this.$emit("initAssetLayers", data);
      } else {
        this.$SG_Message.error(message);
      }
    },
    /*
     * type: 'edit' | 'text'
     * */
    handleDraw(item, type) {
      this.currentAssetId = item.assetId;
      this.$emit("handleDraw", { assetItemInfo: item, type });
    },
    /*
     *  ref调用
     *  flag Boolean
     * */
    setAssetDrawFlag({ assetId, flag }) {
      if (!assetId || typeof flag !== "boolean") {
        console.error("数据出错,刷新后重试");
        return null;
      }
      const idx = this.assetList.findIndex((ele) => ele.assetId === assetId);
      if (idx !== -1) {
        this.$set(this.assetList[idx], "drawStatus", Number(flag));
      }
    },
    /*
     * ref调用
     * */
    setSelectAsset({ assetId }) {
      if (!assetId) {
        console.warn("setSelectAsset入参不合法");
        return null;
      }
      this.currentAssetId = assetId;
      // this.scrollToByAsset({ assetId });
    },
    scrollToByAsset({ assetId }) {
      // 容器高度
      // TODO:交互优化 待做
      const idx = this.$refs.itemRef.findIndex((ele) => {
        return String(ele.dataset.id) === String(assetId);
      });
      const assetLandListRefEle = this.$refs.assetLandListRef;
      console.log("assetLandListRefEle", assetLandListRefEle);
      console.log("item", this.$refs.itemRef[idx]);
      const height = 100;
      assetLandListRefEle.scrollTop = Math.max(height, idx * 40);
    },
  },
};
</script>

<style lang="less" scoped>
.asset-land-list-block {
  width: 0;
  // TODO:地图遮蔽区域优化
  //background-color: rgba(0, 0, 0, 0.1);
  .content-filter-block {
    .select-layer {
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      display: inline-block;
    }
    .input-layer {
      display: inline-block;
      position: relative;
      font-size: 14px;
      .input {
        font-size: inherit;
        width: 236px;
        background: #ffffff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        border-radius: 16px;
        padding-right: 59px;
      }
      .search-block {
        position: absolute;
        right: 0;
        top: 0;
        width: 48px;
        height: 32px;
        background: #0084ff;
        border-radius: 0 16px 16px 0;

        display: flex;
        justify-content: center;
        align-items: center;

        &:active {
          background: #0077ff;
        }
      }
    }
  }
  .asset-land-list {
    scroll-behavior: smooth;
    margin-top: 8px;

    background: #ffffff;
    box-shadow: 0 10px 40px 0 rgba(73, 80, 94, 0.3);
    border-radius: 8px;
    padding: 12px 0;
    max-width: 300px;
    min-width: 220px;
    max-height: 500px;
    min-height: 100px;
    overflow: auto;
    position: absolute;
    top: 35px;
    .item-block {
      .list-item {
        padding: 0 16px;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;

        display: flex;
        align-items: center;

        position: relative;
        .left {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title-name {
            flex: 1;
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .color-block {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .title-flag {
            font-size: 13px;
            color: #959dab;
            margin: 0 8px;
          }
        }
        &:hover {
          background: #e6f7ff;
        }
      }
    }
  }
}

.right-block {
  margin-left: 20px;
}
.activity-asset {
  color: #0084ff;
  background-color: #f5f7fa;
}
</style>
