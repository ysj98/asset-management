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
                  <div class="item-label">项目名称：</div>
                  <div class="item-content">招商租赁项目</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">楼栋：</div>
                  <div class="item-content">25栋</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">单元：</div>
                  <div class="item-content">— —</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">楼     层：</div>
                  <div class="item-content">3层</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">房号：</div>
                  <div class="item-content">201室</div>
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
                  <div class="item-content">102</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">分摊面积(㎡)：</div>
                  <div class="item-content">7.02</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">套内面积(㎡)：</div>
                  <div class="item-content">69.23</div>
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
                  <div class="item-content">园区</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">房间类型：</div>
                  <div class="item-content">商铺</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">房间用途：</div>
                  <div class="item-content">出租</div>
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
                  <div class="item-content">1室</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">朝向：</div>
                  <div class="item-content">南</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">房间编码：</div>
                  <div class="item-content">1001</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">交付日期：</div>
                  <div class="item-content">2019-05-12</div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="detail-item">
                  <div class="item-label">保修到期时间：</div>
                  <div class="item-content">2020-10-15 12:02:12</div>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-item">
                  <div class="item-label">详细描述：</div>
                  <div class="item-content">无</div>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-item">
                  <div class="item-label">平面图：</div>
                  <div class="item-content">
                    <SG-UploadFile :show="true" v-model="planeFigurePath"/>
                  </div>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="detail-item">
                  <div class="item-label">附件：</div>
                  <div class="item-content">
                    <SG-UploadFile :show="true" type="all" v-model="filepaths"/>
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
       houseInfo: {},
     }
   },
   mounted () {
     this.houseId = this.$route.query.houseId || ''
     this.queryHouseDetailById()
   },
   methods: {
     queryHouseDetailById () {
      let data = {
        houseId: this.houseId
      }
      this.$api.building.queryHouseDetailById(data).then(res => {
        if (res.data.code === '0') {
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
      if (data.planeFigurePath) {
        // this.planeFigurePath = [data.planeFigurePath]
        this.planeFigurePath = [{ url: '/picture/2019/07/23/8/201907232005287916_700_375.JPEG', name: '201907232005287916_700_375.JPEG' }]
      }
      // 处理附件
      if (data.filepaths) {
        // this.filepaths = data.filepaths.split(',')
        this.filepaths = [
          { url: '/doc/2019/07/23/8/2019/07/23/1563883528442.txt', name: '1563883528442.txt' },
          { url: '/picture/2019/07/23/8/201907232005287916_700_375.JPEG', name: '201907232005287916_700_375.JPEG' }
        ]
      }
      // 处理请求
      // 房间类型请求
      // 楼层请求
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
