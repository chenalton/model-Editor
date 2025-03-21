/*
 * @Author: cuizhaojian
 * @LastEditors: cuizhaojian
 * @LastEditTime: 2024-12-27 16:32:18
 * @Description: 
 */
import { useActiveModelStore } from '@/store/activeModel'
import { defineStore, storeToRefs } from 'pinia'
import { Mesh, Object3D } from 'three'
import { ref, watch } from 'vue'

const activeModelStore = useActiveModelStore()

export const useControlsModelStore = defineStore('controlsModel', () => {
  const isPickup = ref<boolean>(false)
  const isTransform = ref<boolean>(false)
  const { activeModel, activeMesh } = storeToRefs(activeModelStore)
  const transformMode = ref<'translate' | 'rotate' | 'scale'>('translate')

  const setPickup = (value: boolean) => {
    isPickup.value = value
    eulee.removeTransformControls()
  }

  const setTransform = (value: boolean, mode: 'translate' | 'rotate' | 'scale') => {
    transformMode.value = mode
    if (activeMesh.value) {
      isTransform.value = value
      eulee.addTransformControls(activeMesh.value as Mesh, transformMode.value)
    } else if (activeModel.value) {
      console.log(activeModel.value)
      if(activeModel.value.type === "Group"){
        eulee.addTransformControls(activeModel.value as Object3D, transformMode.value)
      }else{
        eulee.addTransformControls(activeModel.value.parent as Object3D, transformMode.value)
      }
      
    }
  }

  watch([activeMesh], () => {
    if (isTransform.value) {
      setTransform(true, transformMode.value)
    }
  })

  watch(isPickup, (value) => {
    if (value) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'default'
    }
  })

  return { isPickup, setPickup, setTransform }
})
