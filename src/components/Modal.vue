<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <transition name="modal-fade">
    <div class="modal-mask" v-if="isVisible">
      <div class="modal-wrapper">
        <div class="modal-container">
          <slot></slot>
          <button @click="closeModal">关闭弹窗</button>
          <hr />
          <button @click="reduceFontSize()">字体-</button>
          <button @click="addFontSize()">字体+</button>
          <hr />
          <button @click="reduceKerning()">字间距-</button>
          <button @click="addKerning()">字间距+</button>
          <hr />
          <button @click="reduceLeading()">行间距-</button>
          <button @click="addLeading()">行间距+</button>
          <hr />
          字体颜色<color-picker v-model:pureColor="fontColor" format="hex6" shape="square" useType="both"></color-picker>
          <hr />
          背景颜色<color-picker v-model:pureColor="backgroundColor" format="hex6" shape="square"
            useType="both"></color-picker>
          <hr />
          <button @click="reduceMarginTop()">-</button>上边距
          <button @click="addMarginTop()">+</button>
          <hr />
          <button @click="reduceMarginDown()">-</button>下边距
          <button @click="addMarginDown()">+</button>
          <hr />
          <button @click="reduceMarginLeft()">-</button>左边距
          <button @click="addMarginLeft()">+</button>
          <hr />
          <button @click="reduceMarginRight()">-</button>右边距
          <button @click="addMarginRight()">+</button>
          <hr />
          <label for="myFileInput">设置背景图片</label>
          <input type="file" id="myFileInput" ref="fileInput" @change="handleFileUpload()" />
          <!-- <input type="file" ref="fileInput" @change="handleFileUpload" /> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts" name="Modal">
import { ref, watch } from 'vue'



const fontColor = ref('#ffeb3c')
const backgroundColor = ref('#164979')
watch(fontColor, (newValue, oldValue) => {
  console.log(`fontColor颜色值从${oldValue}变为${newValue}`)
  localStorage.setItem('fontColor', newValue)
})
watch(backgroundColor, (newValue, oldValue) => {
  console.log(`backgroundColor颜色值从${oldValue}变为${newValue}`)
  localStorage.setItem('backgroundColor', newValue)
})

// 控制弹窗是否可见
const isVisible = ref(false)

// 用于打开弹窗的方法
function openModal() {
  isVisible.value = true
}

// 用于关闭弹窗的方法
function closeModal() {
  isVisible.value = false
}

// 将方法暴露给父组件使用
defineExpose({
  openModal,
  closeModal,
})

function addFontSize() {
  localStorage.setItem('addFontSize', getFlag() + '')
}

function reduceFontSize() {
  localStorage.setItem('reduceFontSize', getFlag() + '')
}

// 字间距相关
function addKerning() {
  localStorage.setItem('addKerning', getFlag() + '')
}
function reduceKerning() {
  localStorage.setItem('reduceKerning', getFlag() + '')
}
// 行间距相关
function addLeading() {
  localStorage.setItem('addLeading', getFlag() + '')
}
function reduceLeading() {
  localStorage.setItem('reduceLeading', getFlag() + '')
}

function reduceMarginTop() {
  localStorage.setItem('reduceMarginTop', getFlag() + '')
}
function addMarginTop() {
  localStorage.setItem('addMarginTop', getFlag() + '')
}
function reduceMarginDown() {
  localStorage.setItem('reduceMarginDown', getFlag() + '')
}
function addMarginDown() {
  localStorage.setItem('addMarginDown', getFlag() + '')
}
function reduceMarginLeft() {
  localStorage.setItem('reduceMarginLeft', getFlag() + '')
}
function addMarginLeft() {
  localStorage.setItem('addMarginLeft', getFlag() + '')
}
function reduceMarginRight() {
  localStorage.setItem('reduceMarginRight', getFlag() + '')
}
function addMarginRight() {
  localStorage.setItem('addMarginRight', getFlag() + '')
}

// 无意义的函数，用于产生一个随机数,标识localStorage事件可以传递
function getFlag(): number {
  return Date.now()
}

const fileInput = ref<null | HTMLInputElement>(null)

function handleFileUpload() {
  if (!fileInput.value) {
    console.log('文件输入元素未正确初始化')
    return
  }
  if (fileInput.value.files) {
    if (fileInput.value && fileInput.value.files.length > 0) {
      const file = fileInput.value.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
      console.log('setBackgroundImage', `url(${e.target?.result})`)
        localStorage.setItem('setBackgroundImage', ``)
        localStorage.setItem('setBackgroundImage', `url(${e.target?.result})`)
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  position: fixed;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal-container {
  padding: 20px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
