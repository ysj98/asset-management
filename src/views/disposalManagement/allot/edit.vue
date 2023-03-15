<script>
import './addAndEdit.less';
import create from './create';
export default {
  extends: create,
};
</script>

<style lang="less" scoped>
/deep/ .ant-form-item-label {
  label {
    font-size: 13px;
    color: #959dab;
    font-family: 'Microsoft Yahei';
  }
}
/deep/ .ant-form-item-children {
  span,
  input,
  textarea {
    font-size: 15px;
    color: #49505e;
    font-family: 'Microsoft Yahei';
  }
}
</style>
