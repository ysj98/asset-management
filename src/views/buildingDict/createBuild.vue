<!--
 * @Date: 2019-11-09 16:13:11
 * @Author: chen han
 * @Description: 新建楼栋，编辑楼栋，删除楼栋
 -->
<template>
   <div class="createBuilding-page">
     <div class="form-box">
        <div class="title-box">
          <SG-Title noMargin :title="title" />
        </div>
        <!-- 表单部分 -->
        <div>
          <a-form :form="form" @submit="handleSave" layout="horizontal">
            <a-row>
                <a-col v-bind="formSpan">
                  <a-form-item label="楼栋名称" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['name', {initialValue: '' || undefined, rules: [{required: true, whitespace: true, message: '请输入楼栋名称'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="楼栋编码" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['code', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="房屋数量" v-bind="formItemLayout">
                    <a-input-number :max="99999" :style="allWidth" v-decorator="['houseNum', {initialValue: '' || undefined, rules: [{pattern: /^[0-9]*$/, message: '请输入整数'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="承建商" v-bind="formItemLayout">
                    <a-input :maxLength="30" :style="allWidth" v-decorator="['contractor', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="开发商" v-bind="formItemLayout">
                    <a-input :maxLength="30" :style="allWidth" v-decorator="['developer', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="楼高(m)" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['buildHeight', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="建筑面积(㎡)" v-bind="formItemLayout">
                    <a-input-number :max="999999.9999" :style="allWidth" v-decorator="['builtArea', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="楼栋类型" v-bind="formItemLayout">
                    <a-select
                      :style="allWidth"
                      :getCalendarContainer="getPopupContainer"
                        placeholder="请选择楼栋类型"
                        showSearch
                        optionFilterProp="children"
                        :options="buildTypeOpt"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                        v-decorator="['buildType', {rules: [{required: true, whitespace: true, message: '请选择楼栋类型'}]}]"
                      />
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="楼栋用途" v-bind="formItemLayout">
                    <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                        placeholder="请选择楼栋用途"
                        showSearch
                        optionFilterProp="children"
                        :options="useTypeOpt"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                        v-decorator="['useType', {rules: [{required: true, whitespace: true, message: '请选择楼栋用途'}]}]"
                      />
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="地上层高(m)" v-bind="formItemLayout">
                    <a-input-number :max="999.99" :style="allWidth" v-decorator="['upGroundHigh', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="地下层高(m)" v-bind="formItemLayout">
                    <a-input-number :max="999.99" :style="allWidth" v-decorator="['downGroundHigh', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
              <a-col v-bind="formSpan">
                  <a-form-item label="建筑结构" v-bind="formItemLayout">
                    <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                        placeholder="请选择建筑结构"
                        showSearch
                        optionFilterProp="children"
                        :options="buildStructOpt"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                        v-decorator="['buildStruct', {rules: [{required: true, message: '请选择楼栋建筑结构'}]}]"
                      />
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="总楼层" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['buildFloor', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="地上层数" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['upFloorNum', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="地下层数" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['downFloorNum', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="地理位置" v-bind="formItemLayout2">
                    <div class="address-box">
                      <a-select
                      :style="allWidth1"
                        placeholder="省"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        :options="provinceOpt"
                        :allowClear="false"
                        @change="cityOrRegionChange($event, 'province')"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                        v-decorator="['province', {initialValue: '' || undefined, rules: [{required: true, message: '请选择省'}, {validator: validateAddress}]}]"
                      />
                      <a-select
                      :style="allWidth1"
                        placeholder="市"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        :options="cityOpt"
                        v-model="city"
                        :allowClear="false"
                        @change="cityOrRegionChange($event, 'city')"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                      />
                      <a-select
                        :style="allWidth1"
                        placeholder="区/县"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        v-model="region"
                        @change="cityOrRegionChange($event, 'region')"
                        :options="regionOpt"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                      />
                      <a-input :maxLength="100" @input="getLL" v-model="address" :style="allWidth2" placeholder="详细地址"/>
                    </div>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="经纬度" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['lngAndlat', {initialValue: '' || undefined, rules: [{required: true, whitespace: true, message: '请选择或输入经纬度'}]}]">
                      <a-icon type="plus" @click="showSelectMap" class="pointer" slot="suffix"/>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="楼栋排序" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['seq', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="电梯数量" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['liftNum', {initialValue: '' || undefined, rules: [{pattern: /^[0-9]*$/, message: '请输入整数'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="丘地号" v-bind="formItemLayout">
                    <a-input :maxLength='40' :style="allWidth" v-decorator="['addressNo', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="建筑年代" v-bind="formItemLayout">
                    <a-input :maxLength='20' :style="allWidth" v-decorator="['builtAge', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="竣工日期" v-bind="formItemLayout">
                    <a-date-picker
                    :style="allWidth"
                    placeholder="请选择竣工日期"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['completionDate', {initialValue: '' || undefined}]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                    <!-- 文本框 -->
                    <a-form-item label="描述" v-bind="formItemLayout2">
                      <a-textarea v-decorator="['description', {initialValue: ''}]"/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="平面图" v-bind="formItemLayout2">
                      <SG-UploadFile v-model="picPath" :max="1"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item label="附件" v-bind="formItemLayout2">
                      <SG-UploadFile type="all" v-model="filepaths"/>
                    </a-form-item>
                  </a-col>
            </a-row>  
          </a-form>
        </div>
    </div>
     <FormFooter>
       <SG-Button v-if="hasUpdatePower" :class="[type==='edit'&&'mr10']" @click="handleSave" type="primary">保存</SG-Button>
       <SG-Button v-power="ASSET_MANAGEMENT.ASSET_BUILD_DELETE" v-if="type==='edit'" @click="handleCancel" type="danger" ghost>删除</SG-Button>
     </FormFooter>
     <selectLngAndLat :point="point" @change="bMapChange" ref="longitudeAndLatitud"/>
   </div>
</template>
<script>
import FormFooter from '@/components/FormFooter.vue'
import selectLngAndLat from '@/views/common/selectLngAndLat.vue'
import utils from '@/utils/utils'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
const allWidth = {width: '100%'}
const allWidth1 = {width: '100px', marginRight: '10px', flex: '0 0 120px'}
const allWidth2 = {width: '250px', flex: 1}
export default {
  components: {
    FormFooter,
    selectLngAndLat
  },
  props: {
    type: {
      default: 'create'
    },
    organId: {
      default: ''
    },
    objectData: {
      default: () => ({})
    }
  },
  watch: {
    // 监听楼栋编辑框变化
    type () {
      this.init()
    },
    // 监听id变化
    objectData () {
      this.init()
    }
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      hasUpdatePower: false,
      allWidth,
      allWidth1,
      allWidth2,
      formSpan: {
       xl: 8,
       sm: 12
      },
      loading: false,
      region: undefined, // 区/县
      city: undefined, // 市
      address: '', // 详细地址
      provinceOpt: [], // 省
      cityOpt: [], // 市
      regionOpt: [], // 区/县
      point: {  // 经纬度
        lng: '',
        lat: ''
      },
      picPath: [], // 平面图
      filepaths: [], // 附件
      buildTypeOpt: [], // 楼栋类型
      useTypeOpt: [], // 楼栋用途
      buildStructOpt: [], // 建筑结构
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 }
        }
      },
       formItemLayout2: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
    title () {
      return this.type === 'edit' ? '编辑楼栋' : '新增楼栋'
    }
  },
  mounted () {
    this.queryProvinceList()
    this.queryNodesByRootCode('30')
    this.queryNodesByRootCode('60')
    this.queryDictDataList()
    this.init()
    this.handleBtn()
  },
  methods: {
    init () {
      this.resetAll()
      if (this.type === 'edit') {
        this.queryBuildDetail(this.objectData.positionId)
      }
    },
    handleBtn () {
      if (this.type==='create') {
        this.hasUpdatePower = true
      }
      if (this.type==='edit' && this.$power.has(ASSET_MANAGEMENT.ASSET_BUILD_EDIT)) {
        this.hasUpdatePower = true
      }
    },
    handleSave () {
      this.form.validateFields((err, values) => {
        console.log('得到值=>', values)
        if (!err) {
          let data = {}
          utils.each(values, (value, key) => {
            data[key] = value || ''
          })
          // 处理时间类型
           if (data.completionDate) {
             data.completionDate = data.completionDate.format('YYYY-MM-DD')
           }
          // 处理经纬度
          let lngAnLatArr = data.lngAndlat.split('-')
          data.longitude = lngAnLatArr[0]
          data.latitude = lngAnLatArr[1]
          // 处理图片
          if (this.picPath.length > 0) {
            data.picPath = this.picPath[0].url
          }
          // 处理附件
          if (this.filepaths.length > 0) {
            data.filepaths = this.filepaths.map(item => item.url).join(',')
          }
          // 处理省市区的联动start
          data.city = this.city
          data.region = this.region
          data.address = this.address
          //删除多余字段
          delete data.lngAndlat
          // 新增楼栋
          if (this.type === 'create') {
            data.organId = this.organId
            data.upPositionId = this.objectData.positionId
            this.$api.building.addBuild(data).then(res => {
              if (res.data.code === '0') {
                this.$SG_Message.success('新增楼栋成功')
                this.$emit('success')
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
          // 编辑楼栋
          if (this.type === 'edit') {
            data.organId = this.organId
            data.buildId = this.objectData.positionId // 当前节点
            data.upPositionId = this.objectData.upPositionId // 上级节点
            this.$api.building.updateBuild(data).then(res => {
              if (res.data.code === '0') {
                this.$SG_Message.success('编辑楼栋成功')
                // this.$emit('success')
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        }
      })
    },
    handleCancel () {
      this.$SG_Modal.confirm({
          title: `确定删除该楼栋吗?`,
          okText: '确定',
          cancelText: '在想想',
          onOk: () => {
            let data = {
              buildId: this.objectData.positionId
            }
            this.$api.building.deleteBuild(data).then(res => {
              if (res.data.code === '0') {
               this.$SG_Message.success(`删除成功`)
               this.$emit('success')
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
    },
    queryBuildDetail (buildId) {
      let data = {
        buildId
      }
      this.loading = true
      this.$api.building.queryBuildDetail(data).then(res => {
        this.loading = false
        if (res.data.code === '0') {
          this.handleEdit({...res.data.data})
        } else {
          this.$message.error(res.data.message)
        }
      }, () => {
        this.loading = false
      })
    },
    // 处理编辑数据
    handleEdit (data) {
      // 处理时间类型
      if (data.completionDate) {
        data.completionDate = moment(data.completionDate, 'YYYY-MM-DD')
      }
      // 处理经纬度
      if (data.longitude) {
        data.lngAndlat = data.longitude + '-' + data.latitude
        this.point = {
          lng: data.longitude,
          lat: data.latitude
        }
      }
      // 处理图片
      if (data.picPath) {
        let picPath = [{url: data.picPath, name: ''}]
        this.picPath = picPath
      }
      // 处理附件
      if (data.filepaths) {
        let filepaths = data.filepaths.split(',')
        this.filepaths = filepaths.map(item => {
          return {url: item, name: ''}
        })
      }
      // 处理省市区的联动start
      this.city = data.city
      this.region = data.region
      this.address = data.address
      this.queryCityAndAreaList(data.province, 'province')
      this.queryCityAndAreaList(data.city, 'city')
      // end
      let o = this.form.getFieldsValue()
      console.log('表单数据=>', o)
      let values = {}
      utils.each(o, (value, key) => {
        if (data[key] && data[key] !== 0) {
          values[key] = data[key]
        }
      })
      console.log('得到值all=>', values)
      this.form.setFieldsValue(values)
    },
    // 重置所有数据
    resetAll () {
      this.form.resetFields()
      this.region = undefined // 区/县
      this.city = undefined // 市
      this.address = '' // 详细地址
      this.point = {  // 经纬度
        lng: '',
        lat: ''
      }
      this.picPath = [] // 平面图
      this.filepaths = [] // 附件
    },
    bMapChange (point) {
      console.log('经纬度改变=>', point)
      let lngAndlat = point.lng + '-' + point.lat
      this.form.setFieldsValue({lngAndlat})
      this.point = {...point}
    },
    // 显示百度地图
    showSelectMap () {
      this.$refs.longitudeAndLatitud.visible = true
    },
    /* 根据根节点业态code获取下面的业态类型 */
    queryNodesByRootCode (code) {
      /**
       * 30  楼栋类型
       * 60  楼栋用途
      */
      let data = {
        categoryCode: code
      }
      this.$api.basics.queryNodesByRootCode(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let resultArr = result.map(item => {
            return {
              label: item.typeName,
              value: item.typeId,
              ...item
            }
          })
          if (code === '30') {
            this.buildTypeOpt = [ ...resultArr]
          }
          if (code === '60') {
            this.useTypeOpt = [...resultArr]
          }
        }
      })
    },
    // 机构字典
    queryDictDataList () {
      let data = {
        dictCode: 'BUILD_STRUCT',
        groupId: this.organId
      }
      this.$api.basics.queryDictDataList(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let arr = []
          result.forEach(item => {
            if (String(item.dictStatus) === '1') {
              arr.push({label: item.dictName, value: item.dictValue, ...item})
            }
          })
          this.buildStructOpt = arr
        }
      })
    },
    // 请求省
    queryProvinceList () {
      return this.$api.basics.queryProvinceList().then(res => {
        if (res.data.code === '0') {
          let data = res.data.data || []
          this.provinceOpt = data.map(item => {
            return {label: item.name, value: item.regionId}
          })
        }
      })
    },
    // 请求市区
    queryCityAndAreaList (parentRegionId, type) {
      this.$api.basics.queryCityAndAreaList({parentRegionId}).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data || []
          let result = data.map(item => {
            return {label: item.name, value: item.regionId}
          })
          // 市
          if (type === 'province') {
            this.regionOpt = []
            this.cityOpt = result
          }
          // 区
          if (type === 'city') {
            this.regionOpt = result
          }
        }
      })
    },
    // 验证省市区
    validateAddress  (rule, value, callback) {
      console.log('ss', this.city)
      if (!value) {
        callback('请选择省份')
      } else if (!this.city) {
        callback('请选择市')
      } else if (!this.region) {
        callback('请选择区/县')
      } else {
        callback()
      }
    },
    cityOrRegionChange (e, type) {
      console.log('改变项', e, type)
      // 如果是区/县 请求经纬度
      if (type === 'region') {
        this.getLL()
      }
      // 市
      if (type === 'province') {
        this.region = undefined
        this.city = undefined
      }
      // 区
      if (type === 'city') {
        this.region = undefined
      }
      // 触发验证
      if (['region', 'city'].includes(type)) {
        this.form.validateFields(['province'], {force: true})
      }
      // 请求联动数据
      if (['province', 'city'].includes(type)) {
        this.queryCityAndAreaList(e, type)
      }
    },
    transformProvince () {
      let value = this.form.getFieldsValue().province
      let arr = this.provinceOpt.filter(item => String(item.value) === String(value))
      return arr[0].label
    },
    transformCity () {
      let value = this.city
      let arr = this.cityOpt.filter(item => String(item.value) === String(value))
      return arr[0].label
    },
    transformArea () {
      let value = this.region
      let arr = this.regionOpt.filter(item => String(item.value) === String(value))
      return arr[0].label
    },
    // 请求经纬度坐标
    getLL () {
      if (!BMap) return
      if (!this.region) return
      var myGeo = new BMap.Geocoder()
      let self = this
      let longitude = 0
      let latitude = 0
      let transformProvince = this.transformProvince()
      let transformCity = this.transformCity()
      let transformArea = this.transformArea()
      let address = this.address
      console.log('动态经纬度=>', transformProvince)
      if (transformProvince && transformCity && transformArea) {
        myGeo.getPoint(transformProvince + transformCity + transformArea + address, (point) => {
          if (point) {
            let lngAndlat = point.lng + '-' + point.lat
            this.form.setFieldsValue({lngAndlat})
          }
        })
      }
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getPopupContainer (e) {
      return e.parentElement
    }
  }
}
</script>
<style lang="less" scoped>
  .createBuilding-page{
    height: 100%;
    padding: 0px 3px 0 50px;
    position: relative;
    overflow: hidden;
  }
  .form-box{
     height: 100%;
     overflow: hidden;
     overflow-y: auto;
     padding-top: 36px;
     padding-bottom: 70px;
  }
  .title-box{
    margin-bottom: 40px;
  }
  .address-box{
    display: flex;
    margin-top: 7px;
  }
</style>
