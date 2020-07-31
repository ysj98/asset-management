<!--
 * @Date: 2020-07-16 15:29:25
 * @Description: 土地详情
--> 
 <template>
  <div class="detailHouse-page">
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
                <div class="item-content">{{routeQuery.organName || '-'}}</div>
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
                <div class="item-content">{{blankInfo.buildArea || '-'}}</div>
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
export default {
  data() {
    return {
      blankInfo: {},
      routeQuery: {},
      redMap: [], // 平面图
      filePath: [], // 附件
      landTypeOpt: [], // 土地类型
      landuseOpt: [], // 土地用途类型
      landusetypeOpt: [], // 土地用途分类
    };
  },
  mounted() {
    let { organId, blankId, organName } = this.$route.query;
    Object.assign(this.routeQuery, { organId, blankId, organName });
    Promise.all([this.queryLandType(), this.queryLandUseList(), this.queryLandUseTypeList()]).then(res => {
      this.blankApiDetail();
    })
  },
  methods: {
    // 请求土地详情
    blankApiDetail() {
      let data = {
        blankId: this.routeQuery.blankId
      };
      this.loading = true;
      this.$api.building.blankApiDetail(data).then(
        res => {
          this.loading = false;
          if (res.data.code === "0") {
            let data = res.data.data;
            // 处理图片
            this.blankInfo = data;
            // 处理字段
            let landType = this.landTypeOpt.find(item => item.value === data.landType)
            data.landTypeName = landType ? landType.label : ''

            let landuseType = this.landusetypeOpt.find(item => item.value === data.landuseType)
            data.landuseTypeName = landuseType ? landuseType.label : ''
            
            let landuse = this.landuseOpt.find(item => item.value === data.landuse)
            data.landuseName = landuse ? landuse.label : ''
            // 处理平面图
            if (data.redMap) {
              this.redMap = [{ url: data.redMap, name: "" }];
            }
            
            // 处理附件
            if (data.filePath) {
              let filePath = data.filePath.split(",");
              this.filePath = filePath.map(url => {
                return { url, name: url.substring(url.lastIndexOf("/") + 1) };
              });
            }
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.loading = false;
        }
      );
    },
    // 查询土地类别
    queryLandType() {
      let data = {
        dictCode: "OCM_LAND_TYPE",
        dictFlag: "1",
        groupId: this.routeQuery.organId
      };
      return this.$api.basics.queryDictDataList(data).then(res => {
        if (res.data.code === "0") {
          let data = res.data.data;
          this.landTypeOpt = data.map(item => {
            return {
              value: item["dictValue"],
              label: item["dictName"],
              id: item["dictId"]
            }
          });
        }
      });
    },
    // 取全部土地用途
    queryLandUseList() {
      let data = {
        dictCode: "OCM_LANDUSE",
        dictFlag: "1",
        groupId: this.routeQuery.organId
      };
      return this.$api.basics.queryDictDataList(data).then(res => {
        if (res.data.code === "0") {
          let data = res.data.data;
          this.landuseOpt = data.map(item => {
            return {
              value: item["dictValue"],
              label: item["dictName"],
              id: item["dictId"]
            }
          });
        }
      });
    },
    // 取全部土地用途
    queryLandUseTypeList() {
      let data = {
        dictCode: "OCM_LANDUSE_TYPE",
        dictFlag: "1",
        groupId: this.routeQuery.organId
      };
      return this.$api.basics.queryDictDataList(data).then(res => {
        if (res.data.code === "0") {
          let data = res.data.data;
          this.landusetypeOpt = data.map(item => {
            return {
              value: item["dictValue"],
              label: item["dictName"],
              id: item["dictId"]
            }
          });
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.detailHouse-page {
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
      flex: 0 0 85px;
      margin-right: 12px;
      text-align: right;
    }
    .item-content {
      flex: 1;
    }
  }
}
</style>

