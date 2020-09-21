<!--
 * @Date: 2019-12-02 13:53:35
 * @Author: chen han
 * @Description: 权证详情
 -->
 <template>
   <SG-Modal
    @cancel="hiddeModal"
    title="权证详情"
    v-model="visible"
    :width="881"
    @ok="handleSave"
    okText="导入"
    :maskClosable="false"
    :noPadding="true"
    :footer="null"
    :bodyStyle="{ 'overflow-y': 'auto',padding: '0 0px'}"
  >
   <div class="content-box">
     <div class="mb30">
        <SG-Title noMargin title="基础信息" />
      </div>
      <!-- 主体内容 -->
      <div class="main-body">
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">权利号：</span>
            <span class="body-content">36847512</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">权证形式：</span>
            <span class="body-content">房屋</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">权证类型：</span>
            <span class="body-content">使用权证</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">房屋所有权人：</span>
            <span class="body-content">赵刚</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">承租人：</span>
            <span class="body-content">孙权</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">委托管理单位：</span>
            <span class="body-content">四格互联有限公司</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">建筑面积：</span>
            <span class="body-content">1000㎡</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">专有建筑面积：</span>
            <span class="body-content">80.03㎡</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">分摊面积：</span>
            <span class="body-content">1000㎡</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">用途：</span>
            <span class="body-content">商用</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">权利号：</span>
            <span class="body-content">36847512</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">建筑结构：</span>
            <span class="body-content">钢筋混凝土</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">权利号：</span>
            <span class="body-content">36847512</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">总套数：</span>
            <span class="body-content">10</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">所在层：</span>
            <span class="body-content">4</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">房屋号：</span>
            <span class="body-content">419</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">租金单价：</span>
            <span class="body-content">6000元/月</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">租金总价：</span>
            <span class="body-content">200元/㎡/月</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">合同期限：</span>
            <span class="body-content">2040-02-25</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">议价租金单价：</span>
            <span class="body-content">200元/㎡/月</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">议价租金总价：</span>
            <span class="body-content">6000元/月</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">租金缴纳期限：</span>
            <span class="body-content">每月3号</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">产别：</span>
            <span class="body-content">— —</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">坐落位置：</span>
            <span class="body-content">深圳市四格互联</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">登记日期：</span>
            <span class="body-content">2040-02-25</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">交接日期：</span>
            <span class="body-content">2019-06-13</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">备注：</span>
            <span class="body-content">该资产有部分项目需要继续核实，请相关人员 
              做好审核工作,对于接管的问题，需要具体核对。</span>
          </div>
        </div>
      </div>
   </div>
   </SG-Modal>
 </template>
 <script>
 export default {
   data () {
     return {
       visible: false,
     }
   },
   watch: {
     visible (nv) {
        if (!nv) {
          this.hiddeModal()
        }
      },
   },
   
    methods: {
      hiddeModal () {
      },
      handleSave () {}
    }
 }
 </script>
 <style lang="less" scoped>
 .content-box{
   padding: 39px 82px 30px 71px;
   .main-body{
     margin-left: 30px;
   }
   .body-item{
     color: #282D5B;
     margin-bottom: 24px;
     display: flex;
     .body-item-left{
       padding-right: 106px;
       flex: 0 0 398px;
       display: flex;
       .body-label{
         display: inline-block;
         flex: 0 0 auto;
       }
     }
     .body-item-right{
       .body-label{
         display: inline-block;
         flex: 0 0 auto;
       }
     }
   }
 }
 </style>
