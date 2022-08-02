<script>
import './addAndEdit.less'
import createTransfer from "./createTransfer";
export default {
  extends: createTransfer,
};
</script>

<style lang="less" scoped>
/deep/ .ant-form-item-label{
  label{
    font-size: 13px;
    color: #959DAB;
    font-family: "Microsoft Yahei";
  }
}
/deep/ .ant-form-item-children{
  span, input, textarea{
    font-size: 15px;
    color: #49505E;
    font-family: "Microsoft Yahei";
  }
}
</style>

