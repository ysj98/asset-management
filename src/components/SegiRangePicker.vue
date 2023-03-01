<template>
  <div class="entering-date" @click="openDateModal">
    <div class="entering-date-border">
      <div class="entering-date-label">{{ label }}</div>
      <a-range-picker
        @change="onEnteringDateChange"
        :allowClear="allowClear"
        :placeholder="placeholder"
        :format="format"
        :mode="mode"
        :value="dateValue"
        :open="showDateModal"
        :disabledDate="disabledDate"
        @panelChange="handlePanelChange"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { DatePicker } from 'ant-design-vue';
export default {
  name: 'SegiRangePicker',
  components: {
    ARangePicker: DatePicker.RangePicker,
  },
  props: {
    label: {
      type: String,
      default: '起止时间',
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    allowClear: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: Array,
      default: function () {
        return ['开始日期', '结束日期'];
      },
    },
    defaultValue: {
      type: Array,
      default: function () {
        return [];
      },
    },
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    mode: {
      type: Array,
      default: function () {
        return ['date', 'date'];
      },
    },
    canSelectToday: {
      type: Boolean,
      default: false,
    },
    disabledDateType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showDateModal: false,
      dateValue: [],
    };
  },
  watch: {
    value(val) {
      this.dateValue = val;
    },
  },
  methods: {
    moment,
    disabledDate(current) {
      if (this.disabledDateType) {
        // Can not select days before today and today
        if (this.canSelectToday) {
          return current > moment().endOf('day');
        }
        let date = new Date(new Date() - 24 * 60 * 60 * 1000);
        return current > moment(date, 'YYYY-MM-DD');
      } else {
        return undefined;
      }
    },
    openDateModal() {
      this.showDateModal = true;
    },
    handlePanelChange(value, mode) {
      console.log(value);
      console.log(mode);
      this.dateValue = value;
      // this.mode = [
      //   mode[0] === 'date' ? 'month' : mode[0],
      //   mode[1] === 'date' ? 'month' : mode[1]
      // ]
      this.$emit('dateChange', value);
    },
    onEnteringDateChange(val, date) {
      console.log(date);
      let date1 = new Date(date[0]);
      let date2 = new Date(date[1]);
      date1.setFullYear(date1.getFullYear() + 3);
      if (date1 < date2) {
        this.showDateModal = false;
        this.$message.warning('时间范围跨度不能超过3年');
      } else {
        this.dateValue = val;
        let calendar = document.getElementsByClassName('entering-date-border')[0];
        let calenderInput = calendar.childNodes[1].childNodes[0];
        calenderInput.style.boxShadow = 'none';
        calendar.classList.add('focus-input');
        this.showDateModal = false;
        this.$emit('dateChange', date);
      }
    },
  },
  mounted() {
    this.dateValue = this.defaultValue;
    let calendar = document.getElementsByClassName('entering-date-border')[0];
    let self = this;
    document.onmousedown = function (event) {
      setTimeout(function () {
        let calendarPicker = document.getElementsByClassName('ant-calendar-picker-container')[0];
        // 如果不是点击日历输入框本身
        if (!calendar.contains(event.target)) {
          if (calendarPicker) {
            if (!calendarPicker.contains(event.target)) {
              calendar.classList.remove('focus-input');
              self.showDateModal = false;
            }
          } else {
            calendar.classList.remove('focus-input');
            self.showDateModal = false;
          }
        }
      }, 200);
    };
  },
};
</script>

<style lang="less" scoped>
.entering-date {
  display: inline-block;
  width: 272px;
  .entering-date-border {
    display: block;
    height: 32px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
    border-radius: 4px;
    &:hover {
      border: 1px solid #40a9ff;
    }
    .entering-date-label {
      float: left;
      width: 70px;
      text-align: center;
      color: #bfbfbf;
      height: 30px;
      line-height: 30px;
      border-right: 1px solid #d9d9d9;
    }
    & /deep/ .ant-calendar-picker {
      width: 200px;
      & /deep/ .ant-input {
        border: none;
        height: 30px;
      }
    }
  }
  .focus-input {
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    border: 1px solid #40a9ff;
  }
}
</style>
