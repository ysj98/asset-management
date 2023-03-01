<template>
  <div class="p-utils">
    <a-card title="公共方法：数学运算">
      <div class="item">
        <a-input v-model="add.l1" />
        <span>加</span>
        <a-input v-model="add.l2" />
        <span>等于：{{ calc.add(add.l1, add.l2) }}</span>
        <span>原生结果：{{ add.l1 + add.l2 }}</span>
      </div>
      <div class="item">
        <a-input v-model="minus.l1" />
        <span>减</span>
        <a-input v-model="minus.l2" />
        <span>等于：{{ calc.minus(minus.l1, minus.l2) }}</span>
        <span>原生结果：{{ minus.l1 - minus.l2 }}</span>
      </div>
      <div class="item">
        <a-input v-model="multiply.l1" />
        <span>乘</span>
        <a-input v-model="multiply.l2" />
        <span>等于：{{ calc.multiply(multiply.l1, multiply.l2) }}</span>
        <span>原生结果：{{ multiply.l1 * multiply.l2 }}</span>
      </div>
      <div class="item">
        <a-input v-model="divide.l1" />
        <span>除</span>
        <a-input v-model="divide.l2" />
        <span>等于：{{ calc.divide(divide.l1, divide.l2) }}</span>
        <span>原生结果：{{ divide.l1 / divide.l2 }}</span>
      </div>
    </a-card>
  </div>
</template>

<script>
import { calc } from './../../utils/utils';
export default {
  data() {
    return {
      calc,
      add: {
        l1: 0.1,
        l2: 0.2,
      },
      minus: {
        l1: 0.3,
        l2: 0.1,
      },
      multiply: {
        l1: 0.1,
        l2: 0.2,
      },
      divide: {
        l1: 0.3,
        l2: 0.1,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.p-utils {
  .item {
    margin-bottom: 10px;
    input {
      display: inline-block;
      width: 100px;
    }
    span {
      margin: 0 10px;
    }
  }
}
</style>
