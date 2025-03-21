<script setup lang="ts">
import { useActiveModelStore } from '@/store/activeModel'
import { getFileType } from '@/utils/common'
import EventBus from '@/utils/eventBus'
import { copyModel, deleteModel, exportModel, setModel } from '@/utils/model'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const onUpload = (file: any) => {
  const filePath = URL.createObjectURL(file.raw)
  const model = {
    filePath,
    fileType: getFileType(file.name)
  }
  setModel(model)
  EventBus.emit('sceneChildrenChange')
}

const exportHandle = () => {
  exportModel('gltf')
}

const activeModelStore = useActiveModelStore()
const { activeModel } = storeToRefs(activeModelStore)
const copyHandle = () => {
  if (activeModel.value) {
    activeModelStore.setCopyModel(activeModel.value.id)
  } else {
    ElMessage('请先选择模型')
  }
}

const { copingModel } = storeToRefs(activeModelStore)
const pasteHandle = () => {
  if (copingModel.value) {
    const model = eulee.scene.getObjectById(copingModel.value)
    if (model) {
      const obj = copyModel(model)
      eulee.scene.add(obj)
      EventBus.emit('sceneChildrenChange')
    }
  } else {
    ElMessage('请先复制模型')
  }
}

const deleteHandle = () => {
  if (activeModel.value) {
    deleteModel(activeModel.value)
    activeModelStore.setActiveModel(null)
    activeModelStore.setActiveMesh(null)
    eulee.removeTransformControls()
    eulee.setModelHeightLight(null)
  }
}
onMounted(() => {
  console.log(window.location.href)
  let modelUrl = window.location.href.split("=")[1]
  // let modelType = modelUrl.split(".")[1]
  let lastIndex = modelUrl.lastIndexOf('.'); // 查找最后一个点的位置
  let modelType = modelUrl.substring(lastIndex + 1); // 截取最后一个点后面的部分
  let model = {
    filePath: "" + modelUrl,
    fileType: modelType
  }
  setModel(model)
})

</script>

<template>
  <div class="header">
    <div class="title">模型编辑器</div>
    <div class="btns">
      <div class="btn">
        <el-upload
          action=""
          accept=".glb,.obj,.gltf,.fbx,.stl"
          class="file-box"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUpload"
        >
        <el-tooltip
          class="box-item"
          effect="dark"
          content="导入"
          placement="bottom"
        > 
          <button>
            <el-icon size="20" color="#fff">
              <DocumentAdd />
          </el-icon>
          </button>
          </el-tooltip>
        </el-upload>
      </div>
      <div class="btn">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="导出"
          placement="bottom"
        > 
          <button  @click="exportHandle">
            <el-icon size="20" color="#fff">
              <Upload />
            </el-icon>
          </button>
        </el-tooltip>
      </div>
      <div class="btn">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="复制"
          placement="bottom"
        > 
          <button  @click="copyHandle">
            <el-icon size="20" color="#fff">
              <DocumentCopy />
            </el-icon>
          </button>
        </el-tooltip>
      </div>
      <div class="btn">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="粘贴"
          placement="bottom"
        > 
          <button  @click="pasteHandle">
            <el-icon size="20" color="#fff">
              <CopyDocument />
            </el-icon>
          </button>
        </el-tooltip>
      </div>
      <div class="btn">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="删除"
          placement="bottom"
        > 
          <button  @click="deleteHandle">
            <el-icon size="20" color="#fff">
              <DocumentDelete />
            </el-icon>
          </button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.header {
  width: calc(100% - 32px);
  height: 48px;
  display: flex;
  align-items: center;
  background: #1F1F1F;
  padding: 0 16px;
  color: #fff;
  .title {
    font-family: Source Han Sans;
    font-size: 16px;
    font-weight: normal;
    line-height: 16px;
    letter-spacing: 0em;
    font-feature-settings: "kern" on;
    color: #9E9E9E;
  }
  .btns {
    padding: 0 20px;
    display: flex;
    gap: 10px;
    .btn {
      el-button{
        background-color: transparent !important;
        border:none !important;
      }

      :deep(.el-tooltip__trigger){
        background-color: transparent !important;
        border:none !important;
      }
    }
  }
}
</style>
