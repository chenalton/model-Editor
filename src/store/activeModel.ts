import { defineStore } from 'pinia'
import { Mesh, Object3D } from 'three'
import { ref } from 'vue'

export const useActiveModelStore = defineStore('activeModel', () => {
  const activeModel = ref<Object3D | null>(null)

  const setActiveModel = (model: Object3D | null) => {
    activeModel.value = model
  }

  const activeMesh = ref<Mesh | null>(null)

  const setActiveMesh = (mesh: Mesh | null) => {
    activeMesh.value = mesh
  }

  const copingModel = ref<number | null>(null)

  const setCopyModel = (id: number | null) => {
    copingModel.value = id
  }

  return { activeModel, setActiveModel, activeMesh, setActiveMesh, copingModel, setCopyModel }
})
