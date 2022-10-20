
<template>
  <div class="track-step">
    <!-- 左侧部分 -->
    <slot name="left">
      <div class="left">
        <div class="time-item" v-for="(item, index) in stepList" :key="index + 'time-item'">
          <div class="time">{{item.date.format('HH:mm')}}</div>
          <div class="date">{{item.date.format('YYYY-MM-DD')}}</div>
        </div> 
      </div>
    </slot>
    
    <!-- 中间轴部分 -->
    <div class="middle">
      <div class="line-item" v-for="(item, index) in stepList" :key="index + 'line-item'">
        <div class="circle" :class="{'active': item.isDone}"></div>
        <div class="line" :class="{'active': item.isDone, 'isLastItem': index === stepList.length - 1}"></div>
      </div>
    </div>

    <!-- 右边部分 -->
    <div class="right">
      <div class="detail-item" v-for="(item, index) in stepList" :key="index + 'detail-item'">
        <slot name="title">
          <div class="title">{{item.title}}</div>
        </slot>
        <div class="desc">
          <slot name="desc">
            <div class="content-desc" v-if="typeof item.desc === 'string'">{{item.desc}}</div>
            <div v-else class="content-desc">
              <template v-for="(descItem, i) in item.desc">
                <span :key="i" class="word">{{descItem}}</span>
                <span v-if="i < item.desc.length - 1" :key="i + 'line'" class="line"></span>
              </template>
            </div>
          </slot>
          <div class="operate" v-if="item.operation.length">
            <span 
              v-for="(operateItem, i) in item.operation" 
              :key="i"
              @click="handleClick(operateItem.funcName, operateItem)"
            > 
              <span :key="i + 'line'" class="line"></span>
              <template v-if="operateItem.iconOption">
                <SG-Icon 
                  :type="operateItem.iconOption.type"
                  :size="operateItem.iconOption.size"
                  :color="operateItem.iconOption.color"
                >
                </SG-Icon>
              </template>
              <em>{{operateItem.buttonName}}</em>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SG-TrackStep',
  props: {
    stepList: { // 时间轴的步骤列表
      required: true,
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    // 处理点击事件
    handleClick (funcName, item) {
      this.$emit(funcName, item)
    } 
  }
}
</script>

<style lang="less" scoped>
 /*
 * @Descripttion: 步骤
 * @Author: lronelove
 * @Date: 2020-01-02 14:54:43
 * @email: 657828543@qq.com
 */


 @default-font-size: 14px;

 .mb25 {
   margin-bottom: 25px;
 }
 
 .track-step {
   display: flex;
   line-height: 1;
 }
 
 .left {
   min-width: 72px;
   text-align: right;
 
   .time-item {
     height: 65px;
   }
 
   .time {
     height: 10px;
     font-size: 12px;
     font-family: PingFang SC;
     font-weight: bold;
     color: rgba(73,80,94,1);
     margin-bottom: 5px;
   }
 
   .date {
     height: 10px;
     font-size: 12px;
     font-family: PingFang SC;
     font-weight: 400;
     color: rgba(149,157,171,1);
   }
 }
 
 .middle {
   width: 40px;
   padding-top: 10px;
 
   .line-item {
     height: 65px;
     position: relative;
 
     .circle {
       box-sizing: content-box;
       width: 10px;
       height: 10px;
       margin: 0 auto;
       border-radius: 50%;
       border: 3px solid white;
       background: #E6EBF0;
     }
 
     .circle.active {
       border: 3px solid rgba(204, 230, 255, 1);  
       background: rgba(0, 132, 255, 1);
     }
 
     .line {
       width: 1px;
       height: 49px;
       background: #E6EBF0;
       position: absolute;
       left: 50%;
       top: 16px;
       transform: translateX(-50%);
     }
 
     .line.isLastItem {
       height: 0;
     }
 
     .line.active {
       background:rgba(0,132,255,1);
     }
   }
 }
 
 .right {
   .detail-item {
     padding-top: 8px;
     height: 65px;
   }
 
   .title {
     height: @default-font-size;
     font-size: @default-font-size;
     font-family: PingFang SC;
     font-weight: bold;
     color: rgba(73,80,94,1);
   }
 
   .desc {
     margin-top: 11px;
     display: flex;
   }
 
   .line {
     border-right: 1px solid #DCE1E6;
     padding-left: 20px;
     margin-right: 20px;
     display: inline-block;
     height: 12px;
   }
 
   .content-desc {
     font-size: @default-font-size;
     font-family: PingFang SC;
     font-weight: 400;
     text-align: left;
     padding: 0;
     color: rgba(109,117,133,1);
     margin-right: 30px;
   }
 
   .operate {
     > span {
         font-size: @default-font-size;
         padding: 0;
         font-family: PingFang SC;
         font-weight: 400;
         text-decoration: underline;
         color: rgba(0,132,255,1);
         margin-right: 10px;
         cursor: pointer;
         display: inline-block;
 
         em {
           font-style: normal;
           text-decoration: underline;
           font-size: @default-font-size;
           display: inline-block;
           line-height: 1;
           margin-left: 7px;
         }
     }
   }
 }
</style>