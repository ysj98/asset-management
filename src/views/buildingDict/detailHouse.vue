<!--
 * @Date: 2019-11-08 09:52:48
 * @Author: chen han
 * @Description: 房间详情
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
                  <div class="item-content">{{houseInfo.organName || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">楼栋：</div>
                  <div class="item-content">{{houseInfo.buildName || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">单元：</div>
                  <div class="item-content">{{houseInfo.unitName || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">楼     层：</div>
                  <div class="item-content">{{houseInfo.floorName || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">房号：</div>
                  <div class="item-content">{{houseInfo.roomNo || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">公安门牌号：</div>
                  <div class="item-content">{{houseInfo.houseNumber || '-'}}</div>
                </div>
              </a-col>
            </a-row>
          </div>
       </div>
     </div>
     <!-- 面积信息 -->
     <div class="detail-page-item">
       <!-- 标题 -->
       <div class="detail-title-box">
         <div class="mb30">
              <SG-Title noMargin title="面积信息" />
          </div>
          <div class="detail-item-content">
            <a-row>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">建筑面积(㎡)：</div>
                  <div class="item-content">{{houseInfo.area || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">使用面积(㎡)：</div>
                  <div class="item-content">{{houseInfo.useArea || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">分摊面积(㎡)：</div>
                  <div class="item-content">{{houseInfo.shareArea || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">套内面积(㎡)：</div>
                  <div class="item-content">{{houseInfo.innerArea || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">阳台面积(㎡)：</div>
                  <div class="item-content">{{houseInfo.balconyArea || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">分摊土地面积(㎡)：</div>
                  <div class="item-content">{{houseInfo.landArea || '-'}}</div>
                </div>
              </a-col>
            </a-row>
          </div>
       </div>
     </div>
     <!-- 分类信息 -->
     <div class="detail-page-item">
       <!-- 标题 -->
       <div class="detail-title-box">
         <div class="mb30">
              <SG-Title noMargin title="分类信息" />
          </div>
          <div class="detail-item-content">
            <a-row>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">建筑形态：</div>
                  <div class="item-content">{{houseInfo.houseCategoryName || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">房间类型：</div>
                  <div class="item-content">{{houseInfo.houseTypeName || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">房间用途：</div>
                  <div class="item-content">{{houseInfo.resTypeName || '-'}}</div>
                </div>
              </a-col>
            </a-row>
          </div>
       </div>
     </div>
     <!-- 详情信息 -->
     <div class="detail-page-item">
       <!-- 标题 -->
       <div class="detail-title-box">
         <div class="mb30">
              <SG-Title noMargin title="分类信息" />
          </div>
          <div class="detail-item-content">
            <a-row>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">户型：</div>
                  <div class="item-content">{{houseInfo.houseMode || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">朝向：</div>
                  <div class="item-content">{{houseInfo.face || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">房间编码：</div>
                  <div class="item-content">{{houseInfo.code || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">交付日期：</div>
                  <div class="item-content">{{houseInfo.deliveryTime || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">保修到期时间：</div>
                  <div class="item-content">{{houseInfo.repairTime || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-item">
                  <div class="item-label">详细描述：</div>
                  <div class="item-content">{{houseInfo.description || '-'}}</div>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-item">
                  <div class="item-label">平面图：</div>
                  <div class="item-content">
                    <SG-UploadFile v-if="planeFigurePath.length" :show="true" v-model="planeFigurePath"/>
                    <span v-else>-</span>
                  </div>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-item">
                  <div class="item-label">图片：</div>
                  <div class="item-content">
                    <SG-UploadFile v-if="housePic.length" :show="true" v-model="housePic"/>
                    <span v-else>-</span>
                  </div>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-item">
                  <div class="item-label">附&nbsp;&nbsp;&nbsp;&nbsp;件：</div>
                  <div class="item-content">
                    <SG-UploadFile v-if="filepaths.length" :show="true" type="all" v-model="filepaths"/>
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
   data () {
     return {
       filepaths: [],
       planeFigurePath: [],
       housePic: [],
       houseInfo: {},
       houseId: '',
       organId: ''
     }
   },
   mounted () {
     this.houseId = this.$route.query.houseId || ''
     this.organId = this.$route.query.organId || ''
     this.queryHouseDetailById()
   },
   methods: {
     queryHouseDetailById () {
      let data = {
        houseId: this.houseId,
        organId: this.organId || ''
      }
      this.$api.building.queryHouseDetailById(data).then(res => {
        if (res.data.code === '0') {
          this.$textReplace(res.data.data.organId)
          this.handleEditData({...res.data.data})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 处理编辑数据
    handleEditData (data) {
      // 处理图片
      this.houseInfo = data
      // 处理平面图
      if (data.planeFigurePath) {
        this.planeFigurePath = [{url: data.planeFigurePath, name: ''}]
      }
      // 处理图片
      if (data.housePic) {
        let housePic = data.housePic.split(',')
        this.housePic = housePic.map(url => {
          return {url, name: url.substring(url.lastIndexOf('/')+1)}
        })
      }
      // 处理附件
      if (data.filepaths) {
        let filepaths = data.filepaths.split(',')
        this.filepaths = filepaths.map(url => {
          return {url, name: url.substring(url.lastIndexOf('/')+1)}
        })
      }
    },
   }
 }
 </script>
<style lang="less" scoped>
  .detailHouse-page{
    color: #49505E;
    padding: 42px 10px 0px 94px;
    .detail-page-item{
      margin-bottom: 53px;
    }
    .detail-item-content{
      margin-left: 44px;
    }
    .detail-item{
      display: flex;
      margin-bottom: 32px;
      .item-label{
        flex: 0 0 auto;
        margin-right: 12px;
      }
      .item-content{
        flex: 1
      }
    }
  }
</style>
