<!--
 * @Author: cuizhaojian
 * @LastEditors: cuizhaojian
 * @LastEditTime: 2024-12-27 16:33:44
 * @Description: 
-->
<script setup lang="ts">
import { useActiveModelStore } from '@/store/activeModel'
import { useControlsModelStore } from '@/store/controlsModel'
import Eulee from '@/utils/eulee'
import { storeToRefs } from 'pinia'
import { Object3D } from 'three'
import { onMounted } from 'vue'

const emit = defineEmits(['init-finish'])

onMounted(() => {
  const eulee = new Eulee('canvas')
  window.eulee = eulee

  emit('init-finish')

  const activeModelStore = useActiveModelStore()

  const controlsModelStore = useControlsModelStore()
  const { isPickup } = storeToRefs(controlsModelStore)

  eulee.on('click', (object: Object3D) => {
    if (isPickup.value) {
      console.log(object.parent)
      if(object?.parent?.type === "Scene"){
        activeModelStore.setActiveModel(object)
        eulee.setModelHeightLight(object)
      }else{
        activeModelStore.setActiveModel(object.parent)
        eulee.setModelHeightLight(object.parent)
      }
      controlsModelStore.setPickup(false)
    }
  })

  eulee.on('keydown', (event) => {
    if (event.code === 'Escape') {
      activeModelStore.setActiveModel(null)
      activeModelStore.setActiveMesh(null)
      eulee.removeTransformControls()
      eulee.setModelHeightLight(null)
    }
  })
})
</script>

<template>
  <div id="canvas"></div>
</template>

<style scoped lang="less">
#canvas {
  width: 100%;
  height: 100%;
  background-color: #000;
  overflow: hidden;
}
</style>
