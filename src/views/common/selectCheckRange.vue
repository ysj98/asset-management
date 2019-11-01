<!--选择查验范围-->
<!--
使用 <selectCheckRange :selectList="selectList" ref="selectCheckRange" communityId="67" communityName="优家园"/>
props:
  selectList Array 用于编辑时使用，回填
    selectList: [
        {positionEntityId: '211822', positionType: '9'},
        {positionEntityId: '67', positionType: '1'},
      ]
  communityId String 项目id
  communityName String 项目名称
methods:
  let list = this.$refs.selectCheckRange.getPostSelect()
  list Array 提交后台数据
-->
<template>
  <div class="check-range">
    <!-- 表格头部 -->
    <div class="range-item range-head">
      <div class="item-checkbox">位置类型</div>
      <div class="item-select"><span class="must-write">*</span> 具体位置</div>
    </div>
    <!-- 项目 -->
    <div class="range-item">
      <div class="item-checkbox">
        <SG-Checkbox @change="onChange($event, 'community')" :checked="community.checked">项目</SG-Checkbox>
      </div>
      <div class="item-select" v-if="community.checked">
        <a-select  v-model="community.select">
          <a-select-option :key="communityKey" :value="communityId">{{communityName}}</a-select-option>
        </a-select>
      </div>
    </div>
    <!-- 建筑物 -->
    <div class="range-item bg-position">
      <div class="item-checkbox">
        <SG-Checkbox @change="onChange($event, 'build')" :checked="build.checked">建筑物</SG-Checkbox>
      </div>
      <div class="item-select" v-if="build.checked">
        <a-icon class="item-select-icon" :class="[build.open&&'active']"  type="down" />
        <a-select
          @dropdownVisibleChange="dropdownVisibleChange($event, 'build')"
            mode="multiple"
            v-model="build.select"
            :showArrow="true"
        >
          <a-select-option :value="item.value" v-for="item in build.options" :key="item.value">
            {{item.name}}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <!-- 场地 -->
    <div class="range-item">
      <div class="item-checkbox">
        <SG-Checkbox @change="onChange($event, 'field')" :checked="field.checked">场地</SG-Checkbox>
      </div>
      <div class="item-select" v-if="field.checked">
       <a-icon class="item-select-icon" :class="[field.open&&'active']"  type="down" />
        <a-select
          @dropdownVisibleChange="dropdownVisibleChange($event, 'field')"
            mode="multiple"
            v-model="field.select"
            :showArrow="true"
        >
          <a-select-option :value="item.value" v-for="item in field.options" :key="item.value">
            {{item.name}}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <!-- 土地 -->
    <div class="range-item bg-position">
      <div class="item-checkbox">
        <SG-Checkbox @change="onChange($event, 'land')" :checked="land.checked">土地</SG-Checkbox>
      </div>
      <div class="item-select" v-if="land.checked">
        <a-icon class="item-select-icon" :class="[land.open&&'active']"  type="down" />
        <a-select
          @dropdownVisibleChange="dropdownVisibleChange($event, 'land')"
            mode="multiple"
            v-model="land.select"
            :showArrow="true"
        >
          <a-select-option :value="item.value" v-for="item in land.options" :key="item.value">
            {{item.name}}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <!-- 停车场 -->
    <div class="range-item">
      <div class="item-checkbox">
        <SG-Checkbox @change="onChange($event, 'parking')" :checked="parking.checked">停车场</SG-Checkbox>
      </div>
      <div class="item-select" v-if="parking.checked">
        <a-icon class="item-select-icon" :class="[parking.open&&'active']"  type="down" />
        <a-select
          @dropdownVisibleChange="dropdownVisibleChange($event, 'parking')"
            mode="multiple"
            v-model="parking.select"
            :showArrow="true"
        >
          <a-select-option :value="item.value" v-for="item in parking.options" :key="item.value">
            {{item.name}}
          </a-select-option>
        </a-select>
      </div>
    </div>
  </div>
</template>
<script>
let getUuid = ((uuid = 1) => () => ++uuid)()
const varMap = {
  '1': 'community',
  '2': 'build',
  '7': 'field',
  '6': 'land',
  '9': 'parking'
}
// const keyMap = ['community', 'build', 'field', 'land', 'parking']
export default {
  props: {
    communityId: {
      default: ''
    },
    communityName: {
      default: ''
    },
    selectList: {
      type: [Array, Object],
      default: () => []
    }
  },
  data () {
    return {
      communityKey: getUuid(),
      community: {
        checked: false,
        select: '',
        open: false,
        positionType: '1'
      },
      build: {
        checked: false,
        select: [],
        options: [],
        open: false,
        positionType: '2'
      },
      field: {
        checked: false,
        select: [],
        options: [],
        open: false,
        positionType: '7'
      },
      land: {
        checked: false,
        select: [],
        options: [],
        open: false,
        positionType: '6'
      },
      parking: {
        checked: false,
        select: [],
        options: [],
        open: false,
        positionType: '9'
      }
    }
  },
  watch: {
    communityId (nv) {
      if (nv) {
        console.log('项目id', nv, '项目名称', this.communityName)
        this.init()
        this.communityKey = getUuid()
      }
    },
    selectList: {
      handler (nv) {
        console.log('value值改变=>', nv)
        if (Array.isArray(nv)) {
          let obj = {}
          nv.forEach(item => {
           let key = item.positionType
           if (obj[key]) {
             obj[key].select.push(String(item.positionEntityId))
             // 如果是项目， 项目是单选
             if (key === '1') {
               obj[key].select = String(item.positionEntityId)
             }
           } else {
             obj[key] = {}
             obj[key].select = [String(item.positionEntityId)]
             obj[key].checked = true
             // 如果是项目， 项目是单选
             if (key === '1') {
               obj[key].select = String(item.positionEntityId)
             }
           }
          })
          for (let i in varMap) {
            let valKey = varMap[i]
            // 如果有选择
            if (obj[i]) {
              this[valKey].select = obj[i].select
              this[valKey].checked = obj[i].checked
            } else {
              this[valKey].select = []
              this[valKey].checked = false
              // 如果是项目， 项目是单选
              if (i === '1') {
                this[valKey].select = ''
              }
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
  },
  mounted () {
    if (this.communityId) {
      this.init()
    }
  },
  methods: {
    init () {
      for (let key in varMap) {
        this[varMap[key]].checked = false
        this[varMap[key]].select = []
        this[varMap[key]].options = []
        if (key === '1') {
          this[varMap[key]].select = ''
        }
      }
      this.queryBuildInfoByCommId(this.communityId)
      this.queryBlankListByOpts(this.communityId)
      this.queryPubAreaListByOpts(this.communityId)
      this.queryParkingPlaceListByOpt(this.communityId)
    },
    onChange (e, type) {
      this[type].checked = e.target.checked
    },
    dropdownVisibleChange (open, type) {
      this[type].open = open
    },
    // 根据项目id查询楼栋
    queryBuildInfoByCommId (communityId) {
      return this.$api.undertake.queryBuildInfoByCommId({communityId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'build', // 楼栋
              value: String(item.buildId),
              name: item.name,
            }
          })
          this.build.options = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取值
    getPostSelect () {
      let arr = []
      for (let key in varMap) {
        console.log('kkkkk', this[varMap[key]])
        let flag = false
        if (Array.isArray(this[varMap[key]].select && this[varMap[key]].select.length) ) {
          flag = true
        } else if (String(this[varMap[key]].select).length) {
          flag = true
        }
        if (this[varMap[key]].checked && flag) {
          let select = this[varMap[key]].select
          // 如果是项目
          if (this[varMap[key]].positionType === '1') {
            arr.push({positionType: this[varMap[key]].positionType, positionEntityId: select})
          } else {
            select.forEach(item => {
              arr.push({positionType: this[varMap[key]].positionType, positionEntityId: item})
            })
          }
        }
      }
      return arr
    },
    // 请求土地
    queryBlankListByOpts (communityId, status = '1') {
      return this.$api.undertake.queryBlankListByOpts({communityId, status}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'land', // 车场
              value: String(item.blankId),
              name: item.blankName
            }
          })
          this.land.options = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 项目id请求公共区域列表
    queryPubAreaListByOpts (communityId) {
      return this.$api.undertake.queryPubAreaListByOpts({communityId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'field', // 公共区域
              value: String(item.pubAreaId),
              name: item.pubAreaName
            }
          })
          this.field.options = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 请求停车场
    queryParkingPlaceListByOpt (communityId) {
      return this.$api.undertake.queryParkingPlaceListByOpt({communityId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'parking', // 车场
              value: String(item.placeId),
              name: item.placeName
            }
          })
          this.parking.options = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
  .check-range{
    border: 1px solid rgba(230,234,239,1);
    border-bottom: none;
    .range-item{
      min-height: 39px;
      display: flex;
      border-bottom: 1px solid rgba(230,234,239,1);
      &.range-head{
        font-size: 14px;
        border-bottom: none;
        box-shadow:0px 2px 6px 0px rgba(66,155,255,0.2);
      }
      .item-checkbox{
        border-right: 1px solid rgba(230,234,239,1);
        display: flex;
        align-items: center;
        flex: 0 0 101px;
        padding-left: 22px;
      }
      .item-select{
        flex: 1 1;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .item-select-icon{
          position: absolute;
          right: 10px;
          top: 15px;
          z-index: 1;
          color:rgba(0, 0, 0, 0.25);
          transition: transform 0.3s;
          transform: rotate(0deg);
          &.active{
            transform: rotate(180deg)
          }
        }
      }
    }
  }
  .bg-position{
   background: rgba(249,251,253,1);
  }
</style>
<style lang="less">
  .check-range{
    .ant-select{
      width: 100%;
    }
    .ant-select-selection{
      border: none
    }
    .ant-select-open .ant-select-selection,
    .ant-select-focused .ant-select-selection, 
    .ant-select-selection:focus, 
    .ant-select-selection:active{
      box-shadow: none;
    }
  }
</style>
