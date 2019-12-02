<!--
 * @Date: 2019-12-02 16:44:30
 * @Author: chen han
 * @Description: 权证详情--含table
 -->
 <template>
   <SG-Modal
    @cancel="hiddeModal"
    title="导入数据"
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
            <span class="body-label">权利类型：</span>
            <span class="body-content">产权证</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">权证号码：</span>
            <span class="body-content">25564417712</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">丘地号：</span>
            <span class="body-content">sz524871</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">不动产单元号：</span>
            <span class="body-content">6355441225</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">坐落位置：</span>
            <span class="body-content">深圳市四格互联</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">登记时间：</span>
            <span class="body-content">2019-06-13</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">土地面积：</span>
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
            <span class="body-label">权属形式：</span>
            <span class="body-content">房屋</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">建筑面积：</span>
            <span class="body-content">1000㎡</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">专有建筑面积：</span>
            <span class="body-content">80.03</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">分摊面积：</span>
            <span class="body-content">1000㎡</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">总套数：</span>
            <span class="body-content">10</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">权利性质：</span>
            <span class="body-content">出让</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">使用期限：</span>
            <span class="body-content">2040-02-25</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">结构：</span>
            <span class="body-content">钢筋混凝土</span>
          </div>
        </div>
        <!-- 一项数据 -->
        <div class="body-item">
          <div class="body-item-left">
            <span class="body-label">交接日期：</span>
            <span class="body-content">2040-02-25</span>
          </div>
          <div class="body-item-right">
            <span class="body-label">备注：</span>
            <span class="body-content">该资产有部分项目需要继续核实，
              请相关人员 做好审核工作,对于接管的问题，需要具体核对。</span>
          </div>
        </div>
      </div>
      <!-- 权利人 -->
      <div class="mb20">
        <SG-Title noMargin title="基础信息" />
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

