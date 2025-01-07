<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="history-item">
    <div class="history-item-text">{{ text }} {{ src }}</div>

    <div class="history-item-btns">
      <button @click="push()">推送</button>
      <button @click="up()">上移</button>
      <button @click="down()">下移</button>
      <button @click="emitDelete">删除</button>
    </div>
  </div>
</template>

<script setup lang="ts" name="History">
import { defineProps, defineEmits } from 'vue'
// 定义props接收外部传入的文本内容
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  }
})

// 定义一个自定义事件，用于通知父组件
const emit = defineEmits(['delete', 'up', 'down', 'pushSrc'])

function emitDelete() {
  // 触发自定义事件，向父组件传递信号
  emit('delete')
}

// 覆盖推送功能
function push() {
  localStorage.setItem('setContents', `${props.text} (${props.src})`)
  // emit('pushSrc');
}

// 上移
function up() {
  emit('up')
}
// 下移
function down() {
  emit('down')
}
</script>

<style scoped>
.history-item {
  /* 水平排列 */
  display: flex;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
}

.history-item-text {
  width: 70%;
  font-size: 16px;
  text-align: left;
}

.history-item-btns {
  width: 30%;
  display: inline-block;
  text-align: right;
}
</style>
