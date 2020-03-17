<!--
 * @Date: 2019-11-08 09:50:07
 * @Author: chen han
 * @Description: 新增和编辑和复制房间
 -->
 <template>
   <div class="createHouse-page">
     <div class="create-form">
       <a-form :form="form" @submit="handleSave" layout="horizontal">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
              <SG-Title noMargin title="基础信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="公司名称" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    placeholder="请选择公司"
                    :disabled="type==='edit'"
                    showSearch
                    @change="watchOrganChange"
                    optionFilterProp="children"
                    :options="organOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['organId',
                      { rules: [{required: true, message: '请选择所属公司'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="楼栋" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    placeholder="请选择楼栋"
                    :disabled="type==='edit'"
                    @change="watchBuildChange"
                    @search="handleSearch"
                    showSearch
                    optionFilterProp="children"
                    :options="buildOpt"
                    :allowClear="false"
                    :filterOption="false"
                    notFoundContent="没有查询到数据"
                    v-decorator="['buildId',
                      { rules: [{required: true, message: '请选择楼栋'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="单元" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    :placeholder="type==='edit'?'--':'请选择单元'"
                    @change="watchUnitChange"
                    :disabled="type==='edit'"
                    showSearch
                    optionFilterProp="children"
                    :options="unitOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['unitId']"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="楼层" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    placeholder="请选择楼层"
                    showSearch
                    optionFilterProp="children"
                    :options="floorOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['floorId',
                      { rules: [{required: true, message: '请选择楼层'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="房号" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['roomNo', {initialValue: '' || undefined, rules: [{required: true, message: '请输入房号'}]}]"/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
        <!-- 面积信息 -->
        <div class="page-item">
          <div class="mb30">
              <SG-Title noMargin title="面积信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="建筑面积" v-bind="formItemLayout">
                  <a-input-number :style="allWidth" v-decorator="['area', {initialValue: '' || undefined, rules: [{required: true, message: '请输入建筑面积'}]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="分摊面积" v-bind="formItemLayout">
                  <a-input-number :style="allWidth" v-decorator="['shareArea', {initialValue: '' || undefined }]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="套内面积" v-bind="formItemLayout">
                  <a-input-number :style="allWidth" v-decorator="['innerArea', {initialValue: '' || undefined }]"/>
                </a-form-item>
              </a-col>
            </a-row>  
          </div>
        </div>
        <!-- 分类信息 -->
        <div class="page-item">
          <div class="mb30">
              <SG-Title noMargin title="分类信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="建筑形态" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    placeholder="请选择建筑形态"
                    showSearch
                    @change="watchHouseCategory"
                    optionFilterProp="children"
                    :options="houseCategoryOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['houseCategory',
                      { rules: [{required: true, message: '请选择建筑形态'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="房间类型" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    placeholder="请选择房间类型"
                    showSearch
                    optionFilterProp="children"
                    :options="houseTypeOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['houseType',
                      { rules: [{required: true, message: '请选择房间类型'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="房间用途" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    placeholder="请选择房间用途"
                    showSearch
                    optionFilterProp="children"
                    :options="resTypeOpt"
                    :allowClear="true"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['resType']"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
        <!-- 详细信息 -->
        <div class="page-item">
          <div class="mb30">
              <SG-Title noMargin title="详细信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="户型" v-bind="formItemLayout">
                  <a-input :maxLength="30"  :style="allWidth" v-decorator="['houseMode', {initialValue: '' || undefined}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="朝向" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['face', {initialValue: '' || undefined}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="房间编码" v-bind="formItemLayout">
                  <a-input :maxLength="30" :style="allWidth" v-decorator="['code', {initialValue: '' || undefined}]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="交付日期" v-bind="formItemLayout">
                   <a-date-picker :style="allWidth" v-decorator="['deliveryTime', {initialValue: '' || undefined}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="保修到期日期" v-bind="formItemLayout">
                  <a-date-picker :style="allWidth" v-decorator="['repairTime', {initialValue: '' || undefined}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="描述" v-bind="formItemLayout2">
                  <a-textarea v-decorator="['description', {initialValue: ''}]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="平面图" v-bind="formItemLayout2">
                  <SG-UploadFile :customDownload="customDownload" :customUpload="customUpload" :max="1" v-model="planeFigurePath"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="附件" v-bind="formItemLayout2">
                  <SG-UploadFile :customDownload="customDownload" :customUpload="customUpload" type="all" v-model="filepaths"/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
       </a-form>
     </div>
    <FormFooter style="border:none;">
      <SG-Button class="mr2" @click="handleSave" type="primary">提交</SG-Button>
      <SG-Button @click="handleCancel">取消</SG-Button>
    </FormFooter>
   </div>
 </template>
<script>
import FormFooter from '@/components/FormFooter.vue'
import {utils, debounce} from '@/utils/utils'
import dictMixin from './dictMixin.js'
import moment from 'moment'
let getUuid = ((uuid = 1) => () => ++uuid)()
const allWidth = {width: '100%'}
// 页面跳转
const operationTypes = {
  index: '/buildingDict'
}
export default {
  components: {
    FormFooter
  },
  mixins: [dictMixin],
  data () {
    return {
      bussType: 'houseMct',
      type: '',
      allWidth,
      organOpt: [],
      buildOpt: [],
      unitOpt: [],
      floorOpt: [],
      houseCategoryOpt: [],
      houseTypeOpt: [],
      resTypeOpt: [],
      planeFigurePath: [], // 平面图
      filepaths: [], // 附件
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
  mounted () {
    this.queryNodesByRootCode('20')
    this.queryNodesByRootCode('60')
    this.type = this.$route.query.type
    // 如果是新增
    if (this.type === 'create') {
      this.queryAllTopOrganByUser()
    }
    // 如果是编辑
    if (this.type === 'edit') {
      this.houseId = this.$route.query.houseId || ''
      this.organName = this.$route.query.organName || ''
      this.organId = this.$route.query.organId || ''
      this.queryHouseDetailById()
    }
    // 如果是复制
    if (this.type === 'copy') {
      this.organId = this.$route.query.organId || ''
      this.houseId = this.$route.query.houseId || ''
      this.searchBuildName = this.$route.query.searchBuildName || ''
      this.queryHouseDetailById()
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSave () {
      this.form.validateFields((err, values) => {
        console.log('得到值=>', values)
        if (!err) {
          let data = {}
          utils.each(values, (value, key) => {
            data[key] = value || ''
          })
          // 处理时间类型
          if (data.deliveryTime) {
            data.deliveryTime = data.deliveryTime.format('YYYY-MM-DD')
          }
          if (data.repairTime) {
            data.repairTime = data.repairTime.format('YYYY-MM-DD')
          }
          // 处理图片
          if (this.planeFigurePath.length) {
            data.planeFigurePath = this.planeFigurePath[0].url
          }
          // 处理附件
          if (this.filepaths.length) {
            data.filepaths = this.filepaths.map(item => item.url).join(',')
          }
          // 新增房间
          if (this.type === 'create' || this.type === 'copy') {
            // 新增时需用楼栋id 请求楼栋详情是否有项目id
            this.$api.building.queryBuildDetail({buildId: values.buildId}).then(resData => {
              if (resData.data.code !== '0') {
                this.$message.error(resData.data.message)
              }
              return resData.data.data.communityId
            }).then(communityId => {
              if (communityId && communityId !== '-1') {
                data.communityId = communityId
              }
              let loadingName = this.SG_Loding('新增中...')
              this.$api.building.addHouse(data).then(res => {
                this.DE_Loding(loadingName).then(() => {
                  if (res.data.code === '0') {
                    this.$SG_Message.success(`新增房间成功`)
                    this.goPage('index')
                  } else {
                    this.$message.error(res.data.message)
                  }
                })
              }, () => {
                this.DE_Loding(loadingName).then(res => {
                  this.$SG_Message.error('新增失败！')
                })
              })
            })
          }
          // 编辑房间
          if (this.type === 'edit') {
            data.houseId = this.houseId
            this.$api.building.queryBuildDetail({buildId: values.buildId}).then(resData => {
              if (resData.data.code !== '0') {
                this.$message.error(resData.data.message)
              }
              return resData.data.data.communityId
            }).then(communityId => {
              if (communityId && communityId !== '-1') {
                data.communityId = communityId
              }
              let loadingName = this.SG_Loding('编辑中...')
              this.$api.building.updateHouse(data).then(res => {
                this.DE_Loding(loadingName).then(() => {
                  if (res.data.code === '0') {
                    this.$SG_Message.success('编辑房间成功')
                    this.goPage('index')
                  } else {
                    this.$message.error(res.data.message)
                  }
                })
              },() => {
                this.DE_Loding(loadingName).then(res => {
                  this.$SG_Message.error('编辑失败！')
                })
              })
            })
          }
        }
      })
    },
    handleCancel () {
      this.goPage('index')
    },
    queryHouseDetailById () {
      let data = {
        houseId: this.houseId,
        organId: this.organId || ''
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
      // 处理时间
      if (data.repairTime) {
        data.repairTime = moment(data.repairTime, 'YYYY-MM-DD')
      }
      if (data.deliveryTime) {
        data.deliveryTime = moment(data.deliveryTime, 'YYYY-MM-DD')
      }
      this.form.setFieldsValue({
        organId: this.organId,
        buildId: data.buildId || undefined,
        unitId: data.unitId || undefined,
        floorId: data.floorId || undefined,
        roomNo: data.roomNo || undefined,
        area: data.area || undefined,
        shareArea: data.shareArea || undefined,
        innerArea: data.innerArea || undefined,
        houseCategory: data.houseCategory || undefined,
        houseType: data.houseType || undefined,
        resType: data.resType || undefined,
        houseMode: data.houseMode || undefined,
        face: data.face || undefined,
        description: data.description || undefined,
        code: data.code || undefined,
        deliveryTime: data.deliveryTime || undefined,
        repairTime: data.repairTime || undefined
      })
      // 处理图片
      if (data.planeFigurePath) {
        this.planeFigurePath = [{url: data.planeFigurePath, name: ''}]
      }
      // 处理附件
      if (data.filepaths) {
        let filepaths = data.filepaths.split(',')
        this.filepaths = filepaths.map(url => {
          return {url, name: url.substring(url.lastIndexOf('/')+1)}
        })
      }
      // 如果是编辑
      if (this.type === 'edit') {
        this.organOpt = [{label: data.organName, value: this.organId}]
        this.buildOpt = [{label: data.buildName, value: data.buildId}]
        this.unitOpt = [{label: data.unitName, value: data.unitId}]
      }
      // 处理请求
      if (this.type === 'copy') {
        this.queryAllTopOrganByUser() // 公司
        this.queryBuildList(this.organId, this.searchBuildName) // 请求楼栋
        this.getOptions('getUnitByBuildId', data.buildId) // 请求单元
      }
      // 如果有单元
      if (data.unitId) {
        this.queryAddFloorOptions(data.unitId, '1') // 单元请求楼层
      } else {
        this.queryAddFloorOptions(data.buildId, '0') // 楼栋请求楼层
      }
      this.queryChildNodesById(data.houseCategoryId) // 请求房间类型
    },
    // 监听一级物业改变
    watchOrganChange (organId) {
      this.form.setFieldsValue({
        buildId: undefined,
        unitId: undefined,
        floorId: undefined,
      })
      this.buildOpt = []
      this.unitOpt = []
      this.floorOpt = []
      if (!organId) {
        return
      }
      this.queryBuildList(organId)
    },
    // 监听楼栋改变
    watchBuildChange (buildId) {
      this.form.setFieldsValue({
        unitId: undefined,
        floorId: undefined,
      })
      this.unitOpt = []
      this.floorOpt = []
      if (!buildId) {
        return
      }
      // 请求单元
      this.getOptions('getUnitByBuildId', buildId)
      // 请求楼层
      this.queryAddFloorOptions(buildId, '0')
    },
    // 监听单元改变
    watchUnitChange (unitId) {
      this.form.setFieldsValue({
        floorId: undefined,
      })
      this.floorOpt = []
      if (!unitId) {
        return
      }
      // 请求楼层
      this.queryAddFloorOptions(unitId, '1')
    },
    // 监听建筑形态变化
    watchHouseCategory (typeCode) {
      console.log('建筑形态变化=>', typeCode)
      this.form.setFieldsValue({
        houseType: undefined,
      })
      this.houseTypeOpt = []
      if (!typeCode) {
        return
      }
      let typeId = this.houseCategoryOpt.filter(item => typeCode === item.typeCode)
      this.queryChildNodesById(typeId[0].typeId)
    },
    // 请求单元
    getOptions (type, value = '') {
      if (!type) {
        return
      }
      let PARAMS = ''
      let resetArr = []
      // 请求单元
      if (type === 'getUnitByBuildId') {
        PARAMS = '#BUILD_ID:' + value
        this.unitOpt = resetArr
      }
      let data = {
        SQL_CODE: type,
        PARAMS: PARAMS
      }
      this.$api.basics.getOptions(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          resetArr.push(...result.map(item => {
            return {
              label: item.C_TEXT,
              value: item.C_VALUE
            }
          }))
        }
      })
    },
    // 请求楼层
    queryAddFloorOptions (positionId, subPositionType) {
      // 新增时 subPositionType 0: 楼栋，1，单元
      this.$api.basics.queryFloorListByPosId({positionId, subPositionType}).then(res => {
        if (res.data.code === '0') {
          this.floorOpt = res.data.data.map(item => {
            return {label: item.floorName, value: item.floorId + '', key: item.floorId + ''}
          })
        }
      })
    },
    /* 根据根节点业态code获取下面的业态类型 */
    queryNodesByRootCode (code) {
      /**
       * 20  建筑形态
       * 60  房间用途
      */
      let data = {
        categoryCode: code
      }
      return this.$api.basics.queryNodesByRootCode(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let resultArr = result.map(item => {
            return {
              label: item.typeName,
              value: item.typeCode,
              ...item
            }
          })
          // 建筑类型
          if (code === '20') {
            this.houseCategoryOpt = [...resultArr]
          }
          // 房间用途
          if (code === '60') {
            this.resTypeOpt = [...resultArr]
          }
        }
      })
    },
    // 根据业态Id 获取下面的子节点 请求房间类型
    queryChildNodesById (typeId) {
      let data = {typeId}
      this.$api.basics.queryChildNodesById(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let resultArr = result.map(item => {
            return {
              label: item.typeName,
              value: item.typeCode,
              ...item
            }
          })
          this.houseTypeOpt = [...resultArr]
        }
      })
    },
    // 请求一级物业
    queryAllTopOrganByUser () {
      this.$api.basics.queryAllTopOrganByUser({}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.organOpt = result.map(item => {
            return {label: item.organName, value: item.organId}
          })
          console.log('一级组织机构=>', this.organOpt)
          // 默认选中第一个
          if (this.organOpt.length) {
            if (this.type !== 'copy') {
              this.form.setFieldsValue({organId: this.organOpt[0].value})
              this.queryBuildList(this.organOpt[0].value)
            }
          }
        }
      })
    },
    // 请求楼栋列表默认20条
    queryBuildList (organId, buildName) {
      this.$api.basics.queryBuildList({organId, buildName: buildName || ''}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.buildOpt = result.map(item => {
            return {label: item.buildName, value: item.buildId}
          })
        }
      })
    },
    // 页面跳转
    goPage (type) {
      let query = {}
      this.$router.push({path: operationTypes[type], query: query || {}})
    },
    // 楼栋搜索
    handleSearch (value) {
      this.searchBuildName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
      let organId = this.form.getFieldsValue(['organId'])
        this.queryBuildList(organId.organId || '', this.searchBuildName || '')
    }, 300),
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  }
}
</script>
<style lang="less" scoped>
  .page-item{
    margin-bottom: 18px;
  }
  .createHouse-page{
    position: relative;
    height: calc(100vh - 40px);
    overflow: hidden;
  }
  .create-form{
    padding: 42px 100px 70px 94px;
    position: relative;
    overflow: hidden;
    overflow-y: auto;
    height: 100%;
  }
</style>
<style lang="less">
  // 表单禁止框样式
.createHouse-page{
  .ant-select-disabled{
    color: rgba(0, 0, 0, 0.65);
    .ant-select-selection{
      border:none;
      background: #fff;
      .ant-select-arrow{display: none;}
    }
  }
  .ant-select-selection-selected-value{
    user-select: text;
    cursor: text;
  }
  .ant-select-selection__rendered{
    user-select: text;
    cursor: default;
  }
  .ant-select-disabled .ant-select-selection{
    cursor: default;
  }
}
</style>
