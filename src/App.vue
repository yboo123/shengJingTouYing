<template>
  <div>
    <!-- <button @click="openNewWindow()">打开投影页面</button> -->
    <button @click="openSetWindow()">打开设置</button>
  </div>
  <div>
    <SelectBible />
  </div>
  <Modal v-if="shouldShowModal" ref="modalRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SelectBible from './components/SelectBible.vue'
import Modal from './components/Modal.vue'

// function openNewWindow() {
//   window.open('newWindow.html', '_blank')
//   //延时3秒
//   setTimeout(() => {
//     initConfig()
//   }, 500)
// }

// function openNewWindow() {

// }

// function initConfig() {
//   console.info('initConfig event')
//   localStorage.setItem('initConfig', Date.now() + "");
// }
// function openSetWindow() {


const modalRef = ref<InstanceType<typeof Modal> | null>(null)


const openSetWindow = () => {
  if (modalRef.value !== null) {
    modalRef.value.openModal()
  } else {
    console.error('modalRef 还未被正确初始化')
    // 或者执行其他操作，例如在组件挂载后再尝试打开
  }
}

const shouldShowModal = ref(true) // 假设初始是显示的，可根据实际情况调整



</script>

<style scoped></style>
