<script>
import { chunk } from "lodash";
/*
 * 基本信息
 * */
export default {
  name: "Information",
  props: {
    titleWidth: {
      type: String,
    },
    data: {
      type: Object
    },
    BasicInfoList: {
      type: Array,
      default() {
        return [];
      }
    },
    formatBasicInfoList: {
      type: Array
    },
    rowProps: {
      type: Object,
      default() {
        return {
          gutter: 16
        };
      }
    },
    colProps: {
      type: Object,
      default() {
        return {
          span: 10
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    generateAColChildren(data) {
      const _h = this.$createElement;
      const resValue = this.data ? this.data[data.key] : data.value;
      // 如果 值为空或者undefined 就显示 --
      const children = [undefined, "", null].includes(resValue)
        ? "--"
        : (data.render && data.render(_h, data)) ||
          _h(
            "span",
            {
              class: "content"
            },
            [resValue]
          );

      return _h(
        "div",
        {
          class: "content"
        },
        [children]
      );
    },
    generateACol(data) {
      const _this = this;
      const _h = this.$createElement;
      const style = {
      }
      if (_this.titleWidth){
        style.flexBasis = _this.titleWidth
      }
      const title = _h(
        "span",
        {
          class: "title",
          style
        },
        [data.title]
      );
      const children = _h(
        "div",
        {
          class: "col-block"
        },
        [title, this.generateAColChildren(data)]
      );
      return _h(
        "a-col",
        {
          props: data.colProps || _this.colProps
        },
        [children]
      );
    },
    generateBasicInformation() {
      const _this = this;
      const _h = this.$createElement;
      let resArr = [];
      if (this.formatBasicInfoList) {
        resArr = this.formatBasicInfoList;
      } else {
        const resNum = Math.floor(24 / this.colProps.span);
        resArr = chunk(this.BasicInfoList, resNum);
      }
      const children = resArr.map(groupItem => {
        const rowChildren = groupItem.map(ele => this.generateACol(ele));
        return _h(
          "a-row",
          {
            props: _this.rowProps
          },
          rowChildren
        );
      });
      return _h(
        "div",
        {
          style: {
            lineHeight: "40px"
          }
        },
        children
      );
    }
  },
  render() {
    return this.generateBasicInformation();
  }
};
</script>

<style scoped lang="less">
.title {
  color: rgba(0, 0, 0, 0.8);
  //text-align: right;
  &::after {
    content: "：";
  }
}
.content {
  color: rgba(0, 0, 0, 0.65);
  flex: 1;
}
.col-block {
  display: flex;
  align-items: baseline;
}
</style>
