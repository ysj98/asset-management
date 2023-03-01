/**
 * Created by DELL on 2017/2/23.
 */
/* 注意：与convertTime不同
1.导出的是函数，而非整体导出
2.dateToString，传入的参数不同
*/
/* 时间转字符串 */
export function dateToString(value, type = 'yyyy-mm-dd hh:mm:ss') {
  if (!value || value === undefined || !(value instanceof Date)) {
    return '';
  }
  const map = {
    'yyyy-mm-dd hh:mm:ss': `${value.getFullYear()}-${
      value.getMonth() + 1
    }-${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`.replace(/\b(\w)\b/g, '0$1'),
    'yyyy-mm-dd hh:mm': `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}`.replace(
      /\b(\w)\b/g,
      '0$1'
    ),
    'yyyy-mm-dd': `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`.replace(/\b(\w)\b/g, '0$1'),
    'hh:mm:ss': `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`.replace(/\b(\w)\b/g, '0$1'),
    'hh:mm': `${value.getHours()}:${value.getMinutes()}`.replace(/\b(\w)\b/g, '0$1'),
    'yyyy mm dd': `${value.getFullYear()} ${value.getMonth() + 1} ${value.getDate()}`.replace(/\b(\w)\b/g, '0$1'),
    'yyyy-mm': `${value.getFullYear()}-${value.getMonth() + 1}`.replace(/\b(\w)\b/g, '0$1'),
    yyyy: `${value.getFullYear()}}}`.replace(/\b(\w)\b/g, '0$1'),
    month: `${value.getMonth() + 1}}`.replace(/\b(\w)\b/g, '0$1'),
    mm: `${value.getMinutes()}`.replace(/\b(\w)\b/g, '0$1'),
    ss: `${value.getSeconds()}`.replace(/\b(\w)\b/g, '0$1'),
  };
  return map[type];
}

/* 时间戳转字符串 */
export function stampToString(stamp, type = 'yyyy-mm-dd hh:mm:ss') {
  if (!stamp || stamp === undefined || isNaN(stamp)) {
    return '';
  }
  let value = new Date(+stamp);
  const map = {
    'yyyy-mm-dd hh:mm:ss': `${value.getFullYear()}-${
      value.getMonth() + 1
    }-${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`.replace(/\b(\w)\b/g, '0$1'),
    'yyyy-mm-dd hh:mm': `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}`.replace(
      /\b(\w)\b/g,
      '0$1'
    ),
    'yyyy-mm-dd': `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`.replace(/\b(\w)\b/g, '0$1'),
    'hh:mm:ss': `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`.replace(/\b(\w)\b/g, '0$1'),
    'hh:mm': `${value.getHours()}:${value.getMinutes()}`.replace(/\b(\w)\b/g, '0$1'),
    'yyyy mm dd': `${value.getFullYear()} ${value.getMonth() + 1} ${value.getDate()}`.replace(/\b(\w)\b/g, '0$1'),
  };
  return map[type];
}

/* 时间戳转时间 */
export function stampToDate(stamp) {
  if (!stamp || stamp === undefined || isNaN(stamp)) {
    return '';
  }
  return new Date(+stamp);
}

/* 年份/月份上下翻页 */
export function prevYear(date) {
  date.setFullYear(date.getFullYear() - 1);
  return new Date(date);
}
export function prevMonth(date) {
  if (date.getMonth() === 0) {
    date.setFullYear(date.getFullYear() - 1);
    date.setMonth(11);
  } else {
    date.setMonth(date.getMonth() - 1);
  }
  return new Date(date);
}
export function nextMonth(date) {
  if (date.getMonth() + 1 > 11) {
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(0);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return new Date(date);
}
export function nextYear(date) {
  date.setFullYear(date.getFullYear() + 1);
  return new Date(date);
}

/* 比较时间,非时间类型时，返回‘’ */
export function compareTime(begin, end, type = 'time') {
  if (type === 'time') {
    return begin instanceof Date && end instanceof Date ? begin.getTime() - end.getTime() : '';
  } else if (type === 'date') {
    return begin instanceof Date && end instanceof Date
      ? +new Date(dateToString(begin, 'yyyy-mm-dd')) - +new Date(dateToString(end, 'yyyy-mm-dd'))
      : '';
  }
}

/* 时间段相关 */
// 6:15 => 6.25 ，字符串转小时
export function stringToHour(str) {
  let arr = str.split(':');
  return +arr[0] + +arr[1] / 60;
}
// 6.25 => 6:15 ，小时转字符串
export function hourToString(time) {
  let hour = parseInt(time);
  if (hour < 10) {
    hour = '0' + hour;
  }
  let minute = `${parseInt((time % 1) * 60)}`.replace(/\b(\w)\b/g, '0$1');
  return hour + ':' + minute;
}
// 根据beginTime,endTime,时间间隔(比如，15分钟),获取时间段数组[{name: '6:00', value: '6:00'}]
export function getTimeRange(beginTime, endTime, gap) {
  let arr = [];
  let len = (stringToHour(endTime) - stringToHour(beginTime)) * (60 / gap);
  for (let i = 0; i < len + 1; i++) {
    let time = hourToString(stringToHour(beginTime) + (i * gap) / 60);
    arr.push({ value: time, name: time });
  }
  return arr;
}

/* 判断是否是闰年 */
export function judgeLeapYear(year) {
  if (Number.isInteger(+year)) {
    let y = +year;
    if (y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0)) {
      return true;
    }
  }
  return false;
}

/* 得到上一个月的这个日期 返回的是Date值 */
export function getLastMonthDate(value) {
  if (value) {
    let date = new Date(value);
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    switch (date.getMonth() + 1) {
      case 1:
        m = 12;
        break;
      case 3:
        if (judgeLeapYear(date.getFullYear())) {
          if (d > 29) {
            d = 29;
          }
        } else {
          if (d > 28) {
            d = 28;
          }
        }
        break;
      case 5:
        if (d === 31) {
          d = 30;
        }
        break;
      case 7:
        if (d === 31) {
          d = 30;
        }
        break;
      case 10:
        if (d === 31) {
          d = 30;
        }
        break;
      case 12:
        if (d === 31) {
          d = 30;
        }
        break;
    }
    return new Date(y + '-' + m + '-' + d);
  } else {
    return null;
  }
}

/* 得到当天的n个月前的具体那天 */
export function getMonthsAgoDate(n) {
  let date = new Date(new Date().getTime() - n * 30 * 24 * 60 * 60 * 1000);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  if (m < 10) {
    m = '0' + m;
  }
  if (d < 10) {
    d = '0' + d;
  }
  return y + '-' + m + '-' + d;
}

/* 得到当天的三个月前的具体那天 */
export function getThreeMonthsAgoDate() {
  let date = new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  if (m < 10) {
    m = '0' + m;
  }
  if (d < 10) {
    d = '0' + d;
  }
  return y + '-' + m + '-' + d;
}

/* 得到当月的三个月前的具体月 */
export function getThreeMonthsAgoMonth() {
  let date = new Date();
  date.setMonth(date.getMonth() - 2);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  if (m < 10) {
    m = '0' + m;
  }
  return y + '-' + m;
}

/* 得到当月 */
export function getCurrentMonth() {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  if (m < 10) {
    m = '0' + m;
  }
  return y + '-' + m;
}

/* 得到这个月的第一天 */
export function getCurrentMonthFirst() {
  let date = new Date();
  date.setDate(1);
  let month = parseInt(date.getMonth() + 1);
  let day = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
}

/* 得到本月最后一天日期 */
export function getNowMonthDate() {
  let date = new Date();
  let year = date.getFullYear() + '';
  let month = date.getMonth() + 1 + '';
  let lastDateOfCurrentMonth = new Date(year, month, 0);
  let end = year + '-' + month + '-' + lastDateOfCurrentMonth.getDate();
  return end;
}
// 获取当前月份n个月前1号
export function getNMonthsAgoFirst(n) {
  let date1 = new Date();
  date1.setMonth(date1.getMonth() - n);
  date1.setDate(1);
  let sDate = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
  return sDate;
}

/* 得到今天并格式化日期 */
export function getCurrentDate() {
  let date = new Date(); // 前一天
  let month = parseInt(date.getMonth() + 1);
  let day = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
}

/* 得到昨天并格式化日期 */
export function getCurrentBeforeDate() {
  let date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); // 前一天
  let month = parseInt(date.getMonth() + 1);
  let day = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
}

/* 格式化日期 */
export function formatDate(str, format) {
  if (typeof str === 'string') {
    console.log('字符串类型');
    if (str.length === 10) {
      let date = new Date(str);
      let year = date.getFullYear();
      let month = parseInt(date.getMonth() + 1);
      let day = date.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      if (format.indexOf('-') > -1) {
        return year + '-' + month + '-' + day;
      } else if (format.indexOf('/') > -1) {
        return year + '/' + month + '/' + day;
      }
    }
  }
  return '';
}
