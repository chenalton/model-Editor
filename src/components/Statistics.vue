<script setup lang="ts">
import { onMounted, ref } from 'vue'

let objectCount = ref<number>(0)
let vertexCount = ref<number>(0)
let triangleCount = ref<number>(0)

onMounted(() => {
  eulee.on('updateSceneStatistics', (value) => {
    objectCount.value = value.objectCount
    vertexCount.value = value.vertexCount
    triangleCount.value = value.triangleCount
  })
})
</script>

<template>
  <div class="statistics">
    <div class="item">
      <span class="label">物体</span>
      <span class="value">{{ objectCount }}</span>
    </div>
    <div class="item">
      <span class="label">顶点</span>
      <span class="value">{{ vertexCount }}</span>
    </div>
    <div class="item">
      <span class="label">三角面</span>
      <span class="value">{{ triangleCount }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.statistics {
  position: fixed;
  z-index: 5;
  left: 312px;
  bottom: 10px;
  background-color: #868585e7;
  border-radius: 5px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap:8px;
  color: #fff;
  background-color: #46454588;
  justify-content: space-between;
  .item {
    display: flex;
    .label {
      width: 58px;
      height: 22px;
      opacity: 1;

      font-family: Source Han Sans;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      letter-spacing: 0em;

      /* 深色/文字/默认二级 */
      color: rgba(255, 255, 255, 0.7);
    }
    .value {
      width: 48px;
      height: 22px;
      opacity: 1;

      font-family: Source Han Sans;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      letter-spacing: 0em;

      /* 深色/文字/默认二级 */
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
