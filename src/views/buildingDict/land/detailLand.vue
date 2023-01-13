<!--
 * @Date: 2020-07-16 15:29:25
 * @Description: 土地详情
-->
<template>
  <div class="detailLand-page">
    <!-- 基础信息 -->
    <div class="detail-page-item">
      <!-- 标题 -->
      <div class="detail-title-box">
        <div class="mb30">
          <SG-Title noMargin title="基础信息" />
        </div>
        <div class="detail-item-content">
          <a-row>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">所属机构：</div>
                <div class="item-content">{{organNameMain || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">土地名称：</div>
                <div class="item-content">{{blankInfo.blankName || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">土地编码：</div>
                <div class="item-content">{{blankInfo.blankCode || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">运营项目：</div>
                <div class="item-content">{{blankInfo.communityName || '无'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">土地面积(㎡)：</div>
                <div class="item-content">{{Number(blankInfo.buildArea).toFixed(4) || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">宗地号：</div>
                <div class="item-content">{{blankInfo.theNo || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">土地位置：</div>
                <div class="item-content">{{blankInfo.address || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">经纬度：</div>
                <div class="item-content">{{blankInfo.longitude || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">土地类型：</div>
                <div class="item-content">{{blankInfo.landTypeName || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">土地用途分类：</div>
                <div class="item-content">{{blankInfo.landuseTypeName || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">土地用途：</div>
                <div class="item-content">{{blankInfo.landuseName || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">批准日期：</div>
                <div class="item-content">{{blankInfo.approvalDate || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">计容面积(㎡)：</div>
                <div class="item-content">{{blankInfo.acreage || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">容积率：</div>
                <div class="item-content">{{blankInfo.landRate || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">使用年限：</div>
                <div class="item-content">{{blankInfo.serviceLife || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">开始日期：</div>
                <div class="item-content">{{blankInfo.startDate || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">结束日期：</div>
                <div class="item-content">{{blankInfo.endDate || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">红线面积(㎡)：</div>
                <div class="item-content">{{blankInfo.redlineArea || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">可出租土地面积(㎡)：</div>
                <div class="item-content">{{blankInfo.rentArea || '-'}}</div>
              </div>
            </a-col>
             <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">土地上盖建筑物面积(㎡)：</div>
                <div class="item-content">{{blankInfo.structureArea || '-'}}</div>
              </div>
            </a-col>
             <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">不可开发利用土地面积(㎡)：</div>
                <div class="item-content">{{blankInfo.unavailableArea || '-'}}</div>
              </div>
            </a-col>
             <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">其他土地面积(㎡)：</div>
                <div class="item-content">{{blankInfo.otherArea || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">该地块原用地性质：</div>
                <div class="item-content">{{blankInfo.landNature || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">该地块最新城市规划情况：</div>
                <div class="item-content">{{blankInfo.landPlanning || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">经营方式：</div>
                <div class="item-content">{{blankInfo.modeOper || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">有无围墙：</div>
                <div class="item-content">{{blankInfo.isEncloseWall || '-'}}</div>
              </div>
            </a-col>
            <!-- <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">是否抵押：</div>
                <div class="item-content"> {{ blankInfo.isPledge || "--"}}</div>
              </div>
            </a-col> -->
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">是否确权：</div>
                <div class="item-content"> {{ blankInfo.isRight || "--"}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">是否缴纳土地出让金：</div>
                <div class="item-content">{{ blankInfo.isSell || "--"}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">缴纳土地出让金时间：</div>
                <div class="item-content"> {{ blankInfo.payAssignmentTime || "--"}}</div>
              </div>
            </a-col>
            <a-col :span="8">
            <div class="detail-item">
                <div class="item-label">是否城市更新项目：</div>
                <div class="item-content"> {{ blankInfo.cityUpdate || "--"}}</div>
              </div>
            </a-col>
            <a-col :span="8">
            <div class="detail-item">
                <div class="item-label">三旧改造图编号：</div>
                <div class="item-content"> {{ blankInfo.transformDrawingNo || "--"}}</div>
              </div>
            </a-col>
            <a-col :span="8">
            <div class="detail-item">
                <div class="item-label">地块是否已签订土地交储协议：</div>
                <div class="item-content"> {{ blankInfo.isSign || "--"}}</div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">四至范围：</div>
                <div class="item-content">{{blankInfo.fourToRange || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="detail-item">
                <div class="item-label">围墙图片：</div>
                <div class="item-content">
                  <SG-UploadFile v-if="encloseWallPic.length" :show="true" v-model="encloseWallPic" />
                  <span v-else>-</span>
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">备注：</div>
                <div class="item-content">{{blankInfo.blankDesc || '-'}}</div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">用地红线图：</div>
                <div class="item-content">
                  <SG-UploadFile v-if="redMap.length" :show="true" v-model="redMap" />
                  <span v-else>-</span>
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">现状图片：</div>
                <div class="item-content">
                  <SG-UploadFile v-if="nowPic.length" :show="true" v-model="nowPic" />
                  <span v-else>-</span>
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">图片：</div>
                <div class="item-content">
                  <SG-UploadFile v-if="blankPic.length" :show="true" v-model="blankPic" />
                  <span v-else>-</span>
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="detail-item">
                <div class="item-label">附&nbsp;&nbsp;&nbsp;&nbsp;件：</div>
                <div class="item-content">
                  <SG-UploadFile v-if="filePath.length" :show="true" type="all" v-model="filePath" />
                  <span v-else>-</span>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>
 <script>
 import {yesOrNoOptions} from "@/views/buildingDict/land/dict";
 import {handleEnumerationConversion} from "utils/utils";
export default {
  data() {
    return {
      blankInfo: {},
      routeQuery: {},
      redMap: [], // 平面图
      encloseWallPic: [], // 围墙图片
      nowPic: [], // 现状图片
      blankPic:[], // 图片
      filePath: [], // 附件
      landTypeOpt: [], // 土地类型
      landuseOpt: [], // 土地用途类型
      landusetypeOpt: [], // 土地用途分类
      operationMode: [], // 经营方式
      organIdMain: '', // 所属机构 id
      organNameMain:'', // 所属机构
    };
  },
  mounted() {
    let {blankId, organId} = this.$route.query;
    Object.assign(this.routeQuery, {blankId});
    this.$nextTick(() => {
      this.$textReplace(organId)
    })
    this.init()
  },
  methods: {
    async initOptions() {
      return Promise.all([this.queryLandType(), this.queryLandUseList(), this.queryLandUseTypeList(), this.queryModeOperList()])
    },
    async init() {
      await this.blankApiDetail()
    },
    // 请求土地详情
    async blankApiDetail() {
      let data = {
        blankId: this.routeQuery.blankId,
      };
      this.loading = true;
      try {
        let res = await this.$api.building.blankApiDetail(data)
        this.loading = false;
        if (res.data.code === "0") {
          let data = res.data.data;
          // 处理图片
          this.blankInfo = data;
          this.blankInfo.isSell = handleEnumerationConversion(this.blankInfo.isSell, yesOrNoOptions, ['value', 'title']) || "--"
          this.blankInfo.isRight = handleEnumerationConversion(this.blankInfo.isRight, yesOrNoOptions, ['value', 'title']) || "--"
          this.blankInfo.cityUpdate = handleEnumerationConversion(this.blankInfo.cityUpdate, yesOrNoOptions, ['value', 'title']) || "--"
          this.blankInfo.isSign = handleEnumerationConversion(this.blankInfo.isSign, yesOrNoOptions, ['value', 'title']) || "--"
          // 处理所处机构
          this.organIdMain = data.organId
          this.organNameMain = data.organName
          // 下面几个查询需要 先获得 所属机构id
          await this.initOptions()
          // 处理字段
          let landType = this.landTypeOpt.find(
            (item) => item.value === data.landType
          );
          data.landTypeName = landType ? landType.label : "";
          let landuseType = this.landusetypeOpt.find(
            (item) => item.value === data.landuseType
          );
          data.landuseTypeName = landuseType ? landuseType.label : "";

          let landuse = this.landuseOpt.find(
            (item) => item.value === data.landuse
          );
          data.landuseName = landuse ? landuse.label : "";

          let modeOper = this.operationMode.find(
            (item) => item.value === data.modeOper);
          data.modeOper = modeOper ? modeOper.label : "" ;

          this.blankInfo.isEncloseWall = data.isEncloseWall === '1' ? '有围墙' : '无围墙';
          // 处理地址
          this.blankInfo.address = data.provinceName + data.cityName + data.regionName + data.address;
          // 处理平面图
          if (data.redMap) {
            this.redMap = [{url: data.redMap, name: ""}];
          }
          // 处理围墙图片
          if (data.encloseWallPic) {
            let arr = data.encloseWallPic.split(',')
            if (arr.length > 0) {
              arr.forEach(item => {
                this.encloseWallPic.push({url: item, name: ""})
              })
            }
          }
          // 处理现状图片
          if (data.nowPic) {
            let arr = data.nowPic.split(',')
            if (arr.length > 0) {
              arr.forEach(item => {
                this.nowPic.push({url: item, name: ""})
              })
            }
          }
          // 处理图片
          if (data.blankPic) {
            let arr = data.blankPic.split(',')
            if (arr.length > 0) {
              arr.forEach(item => {
                this.blankPic.push({url: item, name: ""})
              })
            }
          }
          // 处理附件
          if (data.filePath) {
            let filePath = data.filePath.split(",");
            this.filePath = filePath.map((url) => {
              return {url, name: url.substring(url.lastIndexOf("/") + 1)};
            });
          }
        } else {
          this.$message.error(res.data.message);
        }
        return Promise.resolve()
      }catch (error){
        this.loading = false;
        return Promise.reject()
      }
    },
    // 查询土地类别
    queryLandType() {
      let data = {
        dictCode: "OCM_LAND_TYPE",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_LAND_TYPE",
        organId: this.organIdMain,
      };
      return this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data;
          this.landTypeOpt = data.map((item) => {
            return {
              value: item["value"],
              label: item["name"],
            };
          });
        }
      });
    },
    // 取全部土地用途
    queryLandUseList() {
      let data = {
        dictCode: "OCM_LANDUSE",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_LANDUSE",
        organId: this.organIdMain,
      };
      return this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data;
          this.landuseOpt = data.map((item) => {
            return {
              value: item["value"],
              label: item["name"],
            };
          });
        }
      });
    },
    // 取全部土地用途
    queryLandUseTypeList() {
      let data = {
        dictCode: "OCM_LANDUSE_TYPE",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_LANDUSE_TYPE",
        organId: this.organIdMain,
      };
      return this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data;
          this.landusetypeOpt = data.map((item) => {
            return {
              value: item["value"],
              label: item["name"],
            };
          });
        }
      });
    },
    // 取全部经营方式
    queryModeOperList() {
      let data = {
        dictCode: "OCM_MODE_OPER",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_MODE_OPER",
        organId: this.organIdMain,
      }
      return this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data
          this.operationMode = data.map((item) => {
            return {
              value: item["value"],
              label: item["name"],
            }
          })
        }
      })
    }
  },
};
</script>
<style lang="less" scoped>
.detailLand-page {
  color: #49505e;
  padding: 42px 10px 0px 94px;
  .detail-page-item {
    margin-bottom: 53px;
  }
  .detail-item-content {
    margin-left: 44px;
  }
  .detail-item {
    display: flex;
    margin-bottom: 32px;
    .item-label {
      // flex: 0 0 125px;
      margin-right: 12px;
      text-align: right;
    }
    .item-content {
      flex: 1;
    }
  }
}
</style>

