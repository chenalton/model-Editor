<script setup lang="ts">
import { useActiveModelStore } from '@/store/activeModel'
import { traverseMeshChildren } from '@/utils/common'
import EventBus from '@/utils/eventBus'
import { ElTree } from 'element-plus'
import { Mesh, Object3D } from 'three'
import { defineProps, nextTick, ref, watchEffect } from 'vue'
import { match } from 'pinyin-pro'

const props = defineProps({
  activeModel: Object3D
})

type modelListType = {
  name: string
  id: number
  children?: modelListType[]
}
const modelList = ref<modelListType[]>([])
const tzSearchKey = ref('')   //台账搜索关键字

EventBus.on('sceneChildrenChange', () => {
  getModelsList()
})

const getModelsList = () => {
  eulee.scene.children.forEach((item) => {
    console.info(item)
  })
}

const treeRef = ref<InstanceType<typeof ElTree>>()
watchEffect(() => {
  if (props.activeModel) {
    modelList.value = []
    modelList.value.push({
      name: props.activeModel.name as string,
      id: props.activeModel.id as number,
      children: []
    })
    const checks: any[] = []
    if (props.activeModel && props.activeModel.name === 'RootNode') {
      traverseMeshChildren(props.activeModel, (model: Object3D) => {
        modelList.value[0].children?.push({
          name: model?.name as string,
          id: model?.id as number
        })
        const object = eulee.scene.getObjectById(model.id)
        const mesh = object as Object3D || object?.children[0]
        if (mesh?.visible) {
          checks.push(model?.id)
        }
      })
    }
    nextTick(() => {
      treeRef.value!.setCheckedKeys(checks, true)
    })
  }
})

const defaultProps = {
  children: 'children',
  label: 'name'
}

const activeModelStore = useActiveModelStore()

const handleNodeClick = (data: modelListType) => {
  const object = eulee.scene.getObjectById(data.id)
  eulee.setModelHeightLight(object as Object3D)
  if (data.children?.length) {
    activeModelStore.setActiveMesh(null)
  } else {
    if (object?.children[0] instanceof Mesh) {
      activeModelStore.setActiveMesh(object.children[0])
    } else if (object instanceof Mesh) {
      activeModelStore.setActiveMesh(object)
    } else {
      activeModelStore.setActiveMesh(null)
    }
  }
}

const getCheckedNodes = (data: any, checked: any) => {
  console.info(data)
  if (modelList.value[0].children) {
    // modelList.value[0].children.forEach((item: modelListType) => {
    const object = eulee.scene.getObjectById(data.id)
    if (object?.children) {
      const mesh = object
      if (mesh) {
        mesh.visible = false
      }
    } else {
      const mesh = object
      if (mesh) {
        mesh.visible = false
      }
    }
    // })
  }
  const { checkedNodes } = checked
  checkedNodes.forEach((item: any) => {
    console.log(item)
    if (!item.children) {
      const object = eulee.scene.getObjectById(item.id)
      // eulee.scene.getObjectByName("RootNode")?.traverse((object: Object3D) => {
      //   object.visible = true;
      // })
      if (object?.children) {
        const mesh = object
        if (mesh) {
          mesh.visible = true
        }
      } else {
        const mesh = object
        if (mesh) {
          mesh.visible = true
        }
      }

    }else{
      eulee.scene.getObjectByName("RootNode")?.traverse((object: Object3D) => {
        object.visible = true;
      })
    }
  })
}

// const clearInput = () => {
//     tzSearchKey.value = ''
//     search('')
// }

const search = (e: any) => {
  treeRef.value!.filter(e)
}

const filterNode: any = (value: any, data: any) => {
  if (!value) return true
  return match(data.name, value)
}

</script>

<template>
  <div class="sources">
    <div class="title">
      <el-input v-model="tzSearchKey" @change="search" class="w-50 m-2" style="margin-top: 0;" placeholder="设备搜索"
        clearable />
    </div>
    <div>
      <el-tree ref="treeRef" :filter-node-method="filterNode"
        style="max-width: 600px;background:transparent;color:#fff;" :data="modelList" :props="defaultProps"
        default-expand-all :expand-on-click-node="false" show-checkbox @node-click="handleNodeClick"
        @check="getCheckedNodes" :default-checked-keys="[1]" node-key="id" />
    </div>
  </div>
</template>

<style scoped lang="less">
.sources {
  width: 300px;
  background-color: #292929;
  color: #fff;
  box-sizing: border-box;
  font-size: 17px;

  .title {
    padding: 10px;
    border-bottom: 1px solid #292929;
    background-color: #1f1f1f;
  }
}

.sources :deep(.el-input),
.sources :deep(.el-input__wrapper),
.sources :deep(.el-input__inner) {
  background-color: #292929 !important;
  color: #fff;
  box-shadow: none;
  border: none;
  border-radius: 4px;
}

.sources :deep(.is-focus) {
  border: none !important;
}

.sources :deep(.el-tree-node__content) {
  background-color: #292929 !important;
  height: 36px;
  display: flex;
  align-items: center;
}

.sources :deep(.is-current > .el-tree-node__content) {
  background-color: #0D867F !important;
}

.sources :deep(.el-tree-node) {
  font-family: Source Han Sans;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: -0.01px;
  color: #FFFFFF;
}

.sources :deep(.el-tree-node__content:hover) {
  background-color: #0D867F !important;
}
</style>
