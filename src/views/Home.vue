<script setup lang="ts">
import Statistics from '@/components/Statistics.vue'
import Controls from '@/components/controls.vue'
import { useActiveModelStore } from '@/store/activeModel'
import { storeToRefs } from 'pinia'
import { Object3D } from 'three'
import { ref } from 'vue'
import Cavnas from './Cavnas.vue'
import Header from './Header.vue'
import Sources from './Manage/Sources.vue'
import Objects from './Options/Object.vue'

const activeModelStore = useActiveModelStore()
const { activeModel, activeMesh } = storeToRefs(activeModelStore)

const loading = ref<boolean>(false)
const initFinish = () => {
  loading.value = true
}
</script>

<template>
  <div class="container">
    <Header />
    <div class="body">
      <div class="faceplate" v-if="loading">
        <Sources v-if="activeModel" :activeModel="activeModel" />
        <Objects v-if="activeMesh" :activeModel="activeMesh as Object3D" />
        <Controls />
        <Statistics />
      </div>
      <Cavnas @init-finish="initFinish" />
    </div>
  </div>
</template>

<style scope lang="less">
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .body {
    display: flex;
    flex: 1;
    position: relative;
    .faceplate {
      width: 100%;
      height: 100%;
      pointer-events: none;
      position: absolute;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      & > div {
        pointer-events: auto;
      }
    }
  }
}
</style>
