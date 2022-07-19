<!--
 * @Date: 2019-11-09 16:14:42
 * @Author: chen han
 * @Description: 新建单元，编辑单元，删除单元
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
                  <a-form-item label="单元名称" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['unitName', {initialValue: '' || undefined, rules: [{required: true, whitespace: true, message: '请输入单元名称'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="地上楼层数" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['upFloorNum', {initialValue: '' || undefined, }]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="地下楼层数" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['downFloorNum', {initialValue: '' || undefined, }]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="电梯数量" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['liftNum', {initialValue: '' || undefined, rules: [{pattern: /^[0-9]*$/, message: '请输入整数'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="单元排序" v-bind="formItemLayout">
                    <a-input-number :style="allWidth" v-decorator="['seq', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col v-bind="formSpan">
                  <a-form-item label="单元编码" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['code', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                    <!-- 文本框 -->
                    <a-form-item label="描述" v-bind="formItemLayout2">
                      <a-textarea @input="(e)=>{ unitDescNum = e.target.value.length}" v-decorator="['unitDesc', {initialValue: ''}]" :maxLength="200" placeholder="请输入描述内容(200字内)" />
                      <div style="text-align: right">{{unitDescNum}}/200</div>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="图片" v-bind="formItemLayout2">
                    <SG-UploadFile :customDownload="customDownload" :customUpload="customUpload" v-model="picPath" :max="1"/>
                  </a-form-item>
                </a-col>
            </a-row>    
          </a-form>
         </div>    
     </div>
     <FormFooter>
       <SG-Button v-if="hasUpdatePower" :class="[type==='edit'&&'mr10']" @click="handleSave" type="primary">保存</SG-Button>
       <SG-Button v-power="ASSET_MANAGEMENT.ASSET_UNIT_DELETE" v-if="type==='edit'" @click="handleCancel" type="danger" ghost>删除</SG-Button>
     </FormFooter>
   </div>
</template>
<script>
import FormFooter from '@/components/FormFooter.vue'
import utils from '@/utils/utils'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import dictMixin from './dictMixin.js'
const allWidth = {width: '100%'}
const allWidth1 = {width: '100px', marginRight: '10px', flex: '0 0 120px'}
const allWidth2 = {width: '250px', flex: 1}
export default {
  components: {
    FormFooter
  },
  mixins: [dictMixin],
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
  data () {
    return {
      unitDescNum:0,
      bussType: 'unitDir',
      ASSET_MANAGEMENT,
      hasUpdatePower: false,
      allWidth,
      allWidth1,
      allWidth2,
      formSpan: {
       xl: 8,
       sm: 12
      },
      picPath: [], // 平面图
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
  watch: {
    type () {
      this.init()
    },
    // 监听id变化
    objectData () {
      this.init()
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
    title () {
      return this.type === 'edit' ? '编辑单元' : '新增单元'
    }
  },
  mounted () {
    this.init()
    this.handleBtn()
  },
  methods: {
    init () {
      this.resetAll()
      if (this.type === 'edit') {
        this.queryUnitDetail()
      }
      if (this.type === 'create') {
        this.getObjectSeq()
      }
    },
    //objectId type=1时，为项目ID，type=2为楼栋ID ，type=3时，根据isBuild 传楼栋ID或者单元ID
    getObjectSeq () {
      this.$api.building.getObjectSeq({objectId: this.objectData.positionId, type: '2', isBuild: '1'}).then(res => {
        if (+res.data.code === 0) {
          this.form.setFieldsValue({seq: +res.data.data + 1})
        }
      })
    },
    handleBtn () {
      if (this.type==='create') {
        this.hasUpdatePower = true
      }
      if (this.type==='edit' && this.$power.has(ASSET_MANAGEMENT.ASSET_UNIT_EDIT)) {
        this.hasUpdatePower = true
      }
    },
    queryUnitDetail () {
      let data = {
        sid: this.objectData.positionId
      }
      this.$api.building.queryUnitDetail(data).then(res => {
        if (res.data.code === '0') {
          this.handleEdit({...res.data.data})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 处理编辑数据
    handleEdit (data) {
      // 处理图片
      if (data.picPath) {
        this.picPath = [{url: data.picPath, name: ''}]
      }
      let o = this.form.getFieldsValue()
      console.log('表单数据=>', o, data)
      let values = {}
      utils.each(o, (value, key) => {
        if (data[key] && data[key] !== 0) {
          values[key] = data[key]
        }
      })
      console.log('得到值all=>', values)
      this.form.setFieldsValue(values)
      this.unitDescNum = values.unitDesc ? values.unitDesc.length : 0
    },
    // 重置所有数据
    resetAll () {
      this.form.resetFields()
      this.picPath = [] // 平面图
    },
    handleSave () {
      this.form.validateFields((err, values) => {
        console.log('得到值=>', values)
        if (!err) {
          let data = {}
          utils.each(values, (value, key) => {
            data[key] = value || ''
          })
          // 处理图片
          if (this.picPath.length) {
            data.picPath = this.picPath[0].url
          }
          // 新增单元
          if (this.type === 'create') {
            data.organId = this.organId
            data.upPositionId = this.objectData.positionId
            // 新增时需用楼栋id 请求楼栋详情是否有项目id
            this.$api.building.queryBuildDetail({buildId: this.objectData.buildingId}).then(resData => {
              if (resData.data.code !== '0') {
                this.$message.error(resData.data.message)
              }
              return resData.data.data.communityId
            }).then(communityId => {
              let loadingName = this.SG_Loding('新增中...')
              if (communityId && communityId !== '-1') {
                data.communityId = communityId
              }
              this.$api.building.addUnit(data).then(res => {
                this.DE_Loding(loadingName).then(() => {
                  if (res.data.code === '0') {
                    this.$SG_Message.success('新增单元成功')
                    this.resetAll()
                    this.$emit('success', 'create')
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
          // 编辑楼栋
          if (this.type === 'edit') {
            data.organId = this.organId
            data.sid = this.objectData.positionId
            data.upPositionId = this.objectData.upPositionId
            this.$api.building.queryBuildDetail({buildId: this.objectData.buildingId}).then(resData => {
              if (resData.data.code !== '0') {
                this.$message.error(resData.data.message)
              }
              return resData.data.data.communityId
            }).then(communityId => {
              if (communityId && communityId !== '-1') {
                data.communityId = communityId
              }
              let loadingName = this.SG_Loding('编辑中...')
              this.$api.building.updateUnit(data).then(res => {
                this.DE_Loding(loadingName).then(() => {
                  if (res.data.code === '0') {
                    this.$SG_Message.success('编辑单元成功')
                    this.$emit('success', 'edit')
                  } else {
                    this.$message.error(res.data.message)
                  }
                })
              }, () => {
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
      this.$SG_Modal.confirm({
        content: `确定删除该单元吗?`,
        okText: '确定',
        cancelText: '再想想',
        onOk: () => {
          let data = {
            sid: this.objectData.positionId
          }
          data.organId = this.organId
          this.$api.building.deleteUnit(data).then(res => {
            if (res.data.code === '0') {
              this.$SG_Message.success(`删除成功`)
              this.$emit('success', 'delete')
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
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
</style>

