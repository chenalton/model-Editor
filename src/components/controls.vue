<script setup lang="ts">
import { useControlsModelStore } from '@/store/controlsModel'

const controlsModelStore = useControlsModelStore()
const pointHandle = () => {
  controlsModelStore.setPickup(true)
}

const translateHandle = (mode: 'translate' | 'rotate' | 'scale') => {
  controlsModelStore.setTransform(true, mode)
}
</script>

<template>
  <div class="controls">
    <el-icon size="24" color="#fff" @click="pointHandle">
      <Pointer />
    </el-icon>
    <el-icon size="24" color="#fff" @click="translateHandle('translate')">
      <Rank />
    </el-icon>
    <el-icon size="24" color="#fff" @click="translateHandle('rotate')">
      <RefreshLeft />
    </el-icon>
    <el-icon size="24" color="#fff" @click="translateHandle('scale')">
      <ZoomIn />
    </el-icon>
  </div>
</template>

<style scoped lang="less">
.controls {
  position: absolute;
  left: 50%;
  top:30px;
  transform: translate(-50%, -50%);
  z-index: 5;
  background: #1F1F1F;
  border-radius: 5px;
  padding: 5px;
  .el-icon {
    cursor: pointer;
    margin: 0 10px;
  }
}
</style>
