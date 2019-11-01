<template>
  <a-locale-provider :locale="zhCN">
    <App />
  </a-locale-provider>
</template>
<script>
import { LocaleProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import App from './App.vue'

moment.locale('zh-cn')
export default {
  data () {
    return {
      zhCN
    }
  },
  components: {
    App,
    ALocaleProvider: LocaleProvider
  }
}
</script>
