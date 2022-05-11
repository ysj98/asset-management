<script>
import DetailPage from "./DetailPage.vue";
export default {
  name: "DetailPrintPage",
  extends: DetailPage,
  mounted() {
    // 处理打印表头
    this.tableObj.columns.forEach((ele) => {
      if (!ele.width) {
        ele.width = 200;
      }
    });
    this.tableObj.columns.splice(5);

    // 动态设置 页面高度
    const detailNode = document.querySelector(".detail_page");
    const allHeight = document.body.scrollHeight;
    detailNode.height = `${allHeight}px`;

    // 取消 table scroll 属性
    this.tableObj.scroll = {};
  },
  created() {
    this.$route.meta.noShowProBreadNav = true;
  },
};
</script>

<style lang="less" scoped>
.detail_page {
  padding: 0 70px 75px;
  & /deep/ .ant-table-placeholder {
    display: block;
    border-bottom: 1px solid #e8e8e8;
  }
}
.print {
  position: absolute;
  right: 20px;
  top: 20px;
}
</style>
<style lang="less" scoped>
@page {
  // 注释掉 纸张大小由用户选择
  //size: A4 portrait;
}

@page :first {
  //margin-left: 4cm;
}
@media print {
  // 设置页面宽度
  .detail_page {
    padding: 0;
    width: 80%;
  }
  // 隐藏打印按钮
  .print {
    display: none;
  }
  .table-print {
    //width: 26cm;
  }
  // 隐藏 占位元素
  .empty {
    display: none;
  }
  // 隐藏 审核意见
  .footer-advice {
    display: none;
  }
  // 隐藏 审核按钮
  .footer-action {
    display: none;
  }
  // 图片组件 覆盖最大宽度设置
  ::v-deep .sg-uploadFile {
    width: 100%;
    max-width: none;
  }
  // 覆盖 图片展示容器宽度
  ::v-deep .previewWrap {
    width: 100% !important;
  }
  // 隐藏 图片组件 翻页控件
  ::v-deep .previewPages {
    display: none !important;
  }
}
</style>
