<!--
 * @Date: 2019-11-01 09:42:51
 * @Author: chen han
 * @Description: 
 -->
<template>
  <div>    
    <a-card title="按钮权限：使用指令控制按钮显示">
      <p><SG-Button v-power="GLOBAL.ADMINISTRATIVE_PERMISSION">按钮权限</SG-Button></p>
      <p>使用 <code>v-power</code> 权限指令，传入权限编码控制元素显示。</p>
      <p>权限编码常量，存储于 <code>config/config.power.js</code> 文件中</p>
    </a-card>
    <br>
    <a-card title="操作权限：在程序中直接查询权限">
      <p><SG-Button @click="handlePower">点击时判断权限</SG-Button></p>
      <p>使用 <code>this.$power.has()</code>方法，传入权限编码判断是否拥有权限</p>
    </a-card>
    <br>
    <a-card title="操作权限：同时查询多个权限">
      <p><SG-Button @click="handlePower2">点击时判断权限</SG-Button></p>
      <p>使用 <code>this.$power.has(code1, code2)</code>方法，传入权限编码列表。全部同时满足时返回 true</p>
    </a-card>
  </div>
</template>

<script>
import { GLOBAL } from '@/config/config.power'
export default {
  data() {
    return {
      GLOBAL
    }
  },
  methods: {
    handlePower () {
      // 判断是否拥有某权限
      if (this.$power.has(GLOBAL.ADMINISTRATIVE_PERMISSION)) {
        this.$SG_Message.info('按行政区查找组织机构树的权限')
      } else {
        this.$SG_Message.info('没有该权限')
      }
    },
    handlePower2 () {
      if (this.$power.has('XQWZGL_QUERY', 'P_OCM_QUERY')) {
        this.$SG_Message.info('同时查询多个权限')
      }
    }
  }
}
</script>