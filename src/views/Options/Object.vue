<script setup lang="ts">
import { Mesh, MeshStandardMaterial, Object3D, CubeTextureLoader } from 'three'
import { Ref, computed, onMounted, ref, toRef, watch, watchEffect } from 'vue'

const props = defineProps({
  activeModel: Object3D
})

const vertexCount = computed(
  () => eulee.getObject3DStatistics(props.activeModel as Object3D).vertexCount
)
const triangleCount = computed(
  () => eulee.getObject3DStatistics(props.activeModel as Object3D).triangleCount
)
let model: Ref<Object3D>
let mesh: Mesh
let material: MeshStandardMaterial
let name: Ref<string>
let visible: Ref<boolean>
let position: Ref<{ x: number; y: number; z: number }>
let rotation: Ref<{ x: number; y: number; z: number }>
let scale: Ref<{ x: number; y: number; z: number }>
let metalness: Ref<number>
let roughness: Ref<number>
let opacity: Ref<number>
let color = ref<string>('rgb(1, 1, 1)')
let imageUrl = ref<string | undefined>('')
let selectPane = ref<string | undefined>('1')
let skyboxType = ref<string>('default')

const skyboxOptions = [
  { label: '默认天空盒', value: 'default' },
  { label: '日落', value: 'sunset' },
  { label: '白天', value: 'day' },
  { label: '夜晚', value: 'night' }
]

const getModelMaps = (mesh: Mesh) => {
  let textureMapUrl
  const canvas = document.createElement('canvas')
  const material = mesh.material as MeshStandardMaterial
  if (material.map) {
    const { width, height } = material.map.image
    canvas.width = width
    canvas.height = height
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
    context?.drawImage(material.map.image, 0, 0)
    textureMapUrl = canvas.toDataURL('image/png', 0.5)
  }
  canvas.remove()
  return textureMapUrl
}
const handleAvatarSuccess = (file: any) => {
  imageUrl.value = URL.createObjectURL(file.raw!)
}

watchEffect(() => {
  if (props.activeModel) {
    model = toRef(props, 'activeModel') as Ref<Object3D>
    if (model.value) {
      mesh = model.value as Mesh
      material = mesh.material as MeshStandardMaterial
      console.info(material)
      material.transparent = true
      material.needsUpdate = true
      color.value = `rgb(${material.color.r},${material.color.g},${material.color.b})`
    }
    name = toRef(props.activeModel as Object3D, 'name')
    visible = toRef(props.activeModel as Object3D, 'visible')
    position = toRef(props.activeModel as Object3D, 'position')
    rotation = toRef(props.activeModel as Object3D, 'rotation')
    scale = toRef(props.activeModel as Object3D, 'scale')
    metalness = toRef((props.activeModel as Mesh).material as MeshStandardMaterial, 'metalness')
    roughness = toRef((props.activeModel as Mesh).material as MeshStandardMaterial, 'roughness')
    opacity = toRef((props.activeModel as Mesh).material as MeshStandardMaterial, 'opacity')
  }
})

watch(
  () => props.activeModel,
  (model) => {
    if (model) {
      imageUrl.value = getModelMaps(model as Mesh)
    }
  },
  {
    immediate: true
  }
)

watch(imageUrl, (url) => {
  const textureLoader = new THREE.TextureLoader()
  const newTexture = textureLoader.load(url)
  material.map = newTexture
  material.needsUpdate = true
})

watch(color, (v) => {
  const match = v.match(/rgb\((\d+), (\d+), (\d+)\)/)
  if (match) {
    const r = parseInt(match[1], 10)
    const g = parseInt(match[2], 10)
    const b = parseInt(match[3], 10)
    material.color.setRGB(r, g, b)
  }
})

//更改位置
const changePosition = (type: string, params: string) => {
    console.log(type, params, 'changePosition')
}

//更改缩放
const changeScale = (type: string, params: string) => {
    console.log(type, params, 'changeScale')
}

//更新旋转
const changeRotate = (type: string, params: string) => {
    console.log(type, params, 'changeRotate')
}

const changeSkybox = (type: string) => {
  const loader = new CubeTextureLoader()
  let urls: string[] = []
  
  switch(type) {
    case 'default':
      urls = [
        '/skybox/default/px.jpg', '/skybox/default/nx.jpg',
        '/skybox/default/py.jpg', '/skybox/default/ny.jpg',
        '/skybox/default/pz.jpg', '/skybox/default/nz.jpg'
      ]
      break
    case 'sunset':
      urls = [
        '/skybox/sunset/px.jpg', '/skybox/sunset/nx.jpg',
        '/skybox/sunset/py.jpg', '/skybox/sunset/ny.jpg',
        '/skybox/sunset/pz.jpg', '/skybox/sunset/nz.jpg'
      ]
      break
    case 'day':
      urls = [
        '/skybox/day/px.png', '/skybox/day/nx.png',
        '/skybox/day/py.png', '/skybox/day/ny.png',
        '/skybox/day/pz.png', '/skybox/day/nz.png'
      ]
      break
    case 'night':
      urls = [
        '/skybox/night/px.jpg', '/skybox/night/nx.jpg',
        '/skybox/night/py.jpg', '/skybox/night/ny.jpg',
        '/skybox/night/pz.jpg', '/skybox/night/nz.jpg'
      ]
      break
  }
  
  const textureCube = loader.load(urls)
  console.log(textureCube, 'textureCube')
  console.log(props.activeModel)
  if (props.activeModel && props.activeModel.parent && props.activeModel.parent.parent) {
    // 使用类型断言来避免 background 属性不存在的报错
    (props.activeModel.parent.parent as any).background = textureCube
  }
}

watch(skyboxType, (newType) => {
  if (newType) {
    changeSkybox(newType)
  }
})

</script>

<template>
  <div class="options">

    <el-tabs v-model="selectPane" tab-position="left" style="height:100%" class="demo-tabs">
        <el-tab-pane name="1" label="1" :lazy="true">
            <template #label>
                <div class="custom-tab-item" @click="() => { selectPane = '1' }">
                  基础属性
                </div>
            </template>
            <div class="demo-tabs-in">
                <div class="title">基础属性</div>
                <div class="item">
                  <span class="label">类型</span>
                  <span class="value">
                    <el-input :value="activeModel?.type" disabled style="width: 100%; height: 32px" />
                  </span>
                </div>
                <div class="item">
                  <span class="label">名称</span>
                  <span class="value">
                    <el-input v-model="name" style="width: 100%; height: 32px" />
                  </span>
                </div>
                <div class="item">
                  <span class="label">顶点数</span>
                  <span class="value">
                    <el-input :value="vertexCount" disabled style="width: 100%; height: 32px" />
                  </span>
                </div>
                <div class="item">
                  <span class="label">三角面</span>
                  <span class="value">
                    <el-input :value="triangleCount" disabled style="width: 100%; height: 32px" />
                  </span>
                </div>
                <div class="item">
                  <span class="label">可见性</span>
                  <span class="value">
                    <el-switch
                      v-model="visible"
                      style="--el-switch-on-color: #0D867F; --el-switch-off-color: #999999"
                    />
                  </span>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane name="2" label="2" :lazy="true">
            <template #label>
                <div class="custom-tab-item" @click="() => { selectPane = '2' }">
                形态变换
                </div>
            </template>
            <div class="demo-tabs-in">
              <div class="title">基础属性</div>
                <div class="scene-setting-panle">
                    <div class="scene-setting-panle-item auto-height">
                        <span class="label">位置</span>
                        <div class="rotate-panel">
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">X</span>
                                <el-input-number v-model="position.x" :step="0.1" controls-position="right" :min="-1000"
                                    :max="5000" @change="(e: any) => changePosition('X', e)" />
                            </div>
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">Y</span>
                                <el-input-number v-model="position.y" :step="0.1" controls-position="right" :min="-1000"
                                    :max="5000" @change="(e: any) => changePosition('Y', e)" />
                            </div>
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">Z</span>
                                <el-input-number v-model="position.z" :step="0.1" controls-position="right" :min="-1000"
                                    :max="5000" @change="(e: any) => changePosition('Z', e)" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scene-setting-panle">
                    <div class="scene-setting-panle-item auto-height">
                        <span class="label">缩放</span>
                        <div class="rotate-panel">
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">X</span>
                                <el-input-number v-model="scale.x" :step="0.1" controls-position="right" :min="0"
                                    :max="5000" @change="(e: any) => changeScale('X', e)" />
                            </div>
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">Y</span>
                                <el-input-number v-model="scale.y" :step="0.1" controls-position="right" :min="0"
                                    :max="5000" @change="(e: any) => changeScale('Y', e)" />
                            </div>
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">Z</span>
                                <el-input-number v-model="scale.z" :step="0.1" controls-position="right" :min="0"
                                    :max="5000" @change="(e: any) => changeScale('Z', e)" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scene-setting-panle">
                    <div class="scene-setting-panle-item auto-height">
                        <span class="label">旋转</span>
                        <div class="rotate-panel">
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">X</span>
                                <el-input-number v-model="rotation.x" :step="0.1" controls-position="right" :min="0"
                                    :max="6.5" @change="(e: any) => changeRotate('X', e)" />
                            </div>
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">Y</span>
                                <el-input-number v-model="rotation.y" :step="0.1" controls-position="right" :min="0"
                                    :max="6.5" @change="(e: any) => changeRotate('Y', e)" />
                            </div>
                            <div class="rotate-panel-item demo-tabs">
                                <span class="text">Z</span>
                                <el-input-number v-model="rotation.z" :step="0.1" controls-position="right" :min="0"
                                    :max="6.5" @change="(e: any) => changeRotate('Z', e)" />
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        </el-tab-pane>

        <el-tab-pane name="3" label="3" :lazy="true">
            <template #label>
                <div class="custom-tab-item" @click="() => { selectPane = '3' }">
                  材质
                </div>
            </template>
            <div class="demo-tabs-in">
              <div class="material">
                <div class="item">
                  <div class="label">颜色</div>
                  <div class="value">
                    <el-color-picker size="small" v-model="color" color-format="hex" />
                    <span class="label">{{ color }}</span>
                  </div>
                </div>
                <div class="item">
                  <div class="label">金属度</div>
                  <div class="value">
                    <el-slider v-model="metalness" :min="0" :max="1" :step="0.0001" />
                  </div>
                </div>
                <div class="item">
                  <div class="label">粗糙度</div>
                  <div class="value">
                    <el-slider v-model="roughness" :min="0" :max="1" :step="0.0001" />
                  </div>
                </div>
                <div class="item">
                  <div class="label">透明度</div>
                  <div class="value">
                    <el-slider v-model="opacity" :min="0" :max="1" :step="0.01" />
                  </div>
                </div>
                <div class="item" style="height: auto;">
                  <div class="label">贴图</div>
                  <div class="value">
                    <el-upload
                      action=""
                      class="avatar-uploader"
                      :show-file-list="false"
                      :auto-upload="false"
                      :on-change="handleAvatarSuccess"
                    >
                      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
        </el-tab-pane>

        <el-tab-pane name="4" label="4" :lazy="true">
            <template #label>
                <div class="custom-tab-item" @click="() => { selectPane = '4' }">
                  天空盒
                </div>
            </template>
            <div class="demo-tabs-in">
              <div class="title">天空盒</div>
              <div class="item">
                <span class="label">选择天空盒</span>
                <span class="value">
                  <el-select v-model="skyboxType" style="width: 100%">
                    <el-option
                      v-for="item in skyboxOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </span>
              </div>
            </div>
        </el-tab-pane>
   

    





    </el-tabs>



 
  </div>
</template>

<style scoped lang="less">
.options {
  width: 328px;
  background-color: #333333;
  color: #fff;

  .demo-tabs-in {
    height: 100%;
    padding: 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .title {
      width: 56px;
      height: 22px;
      opacity: 1;

      font-family: Source Han Sans;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      text-align: right;
      letter-spacing: 0em;

      font-variation-settings: "opsz" auto;
      color: #FFFFFF;
    }
    .item {
      display: flex;
      justify-content: flex-start;
      height: 32px;
      width: 100%;
      align-items: center;

      .label {
        width: 72px;
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
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;

        .el-input{
          background-color: transparent !important;
          box-shadow: none;
          border: none;
          color: #fff;

          :deep(.el-input__inner){
            color:#fff;
            box-shadow: none;
            border: none;
            border-radius: 4px;
          }
          :deep(.el-input__wrapper){
            background: rgba(250, 252, 255, 0.04) !important;
            box-shadow: none;
            border: none;
            color: #fff;
            border-radius: 4px;
          }
        }
        
        .el-slider :deep(.el-slider__bar){
          background-color: #0D867F;
        }
      
      }
      span {
        display: flex;
        align-items: center;
      }
      .col {
        flex: 1;
        display: flex;
        justify-content: space-between;
        &:first-child {
          padding-right: 10px;
        }
        &:last-child {
          padding-left: 10px;
        }
      }
    }
  }
  .shape {
    display: flex;
    flex-direction: column;
    padding: 10px;
    .label {
      margin-bottom: 20px;
    }
    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .cell {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .material {
    padding: 10px;
    .item {
      display: flex;
      align-items: center;
      min-height: 32px;
      margin-top: 10px;
      .label {
        width: 60px;
      }
      .value {
        max-width: 200px;
        flex: 1;
      }
      .avatar {
        width: 128px;
        height: 128px;
      }
    }
  }
}


.demo-tabs{
    background: #1F1F1F;
}

.demo-tabs :deep(.el-tabs__active-bar){
  background-color: transparent !important;
}

.demo-tabs :deep(.el-tabs__nav-scroll) {
    border-top: 1px solid rgba(255, 255, 255, 0.10);
    border-bottom: 1px solid rgba(255, 255, 255, 0.10);
    border-left: 1px solid rgba(255, 255, 255, 0.10);
}

.custom-tab-item {
    width: 32px;
    height: 88px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    text-align: center;
    background: rgba(255, 255, 255, 0.10);
    line-height: 32px;
    border-radius: 4px;
    color: #fff;
    margin-bottom: 16px;
}


.custom-tab-item:hover {
    border-radius: 4px;
    // border: 1px solid rgba(255, 255, 255, 0.10);
    background: rgba(255, 255, 255, 0.10);
    color: #0D867F;
}

.el-tabs__item.is-active .custom-tab-item {
    background: #0D867F;
    // border: 1px solid rgba(96, 158, 230, 0.21);
    color: #fff;
}


.demo-tabs {
    height: 100%;
}

.demo-tabs :deep(.el-card) {
    height: 100%;
}

.demo-tabs :deep(.is-left) {
    margin-right: 0;
}

.demo-tabs :deep(.el-tabs__item) {
    height: auto;
    padding: 0 4px;
}

.demo-tabs :deep(.el-tab-pane) {
    height: 100%;
    padding: 0px;
}


.demo-tabs-in{
  background: #333333;
  height: 100%;;
}

.scene-setting-panle {
    padding: 0;
}

.scene-setting-panle-item {
    padding-top: 8px;
    height: 36px;
    display: flex;
    justify-content: flex-start;
    gap: 16px;
    align-items: center;
}

.first {
    padding-top: 0px !important;
}

.scene-setting-panle-item>.label {
    color: var(---, rgba(240, 245, 255, 0.65));
    text-align: right;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    min-width: 32px;
}

// FIXME 2024/8/7
.scene-setting-panle-item>.auto-lable {
    width: 56px;
    height: 31px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.auto-height {
    height: auto;
    gap: 8px;
}

.scene-setting-panle-item>.rotate-panel {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: space-between;
}

.scene-setting-panle-item>.rotate-panel>.rotate-panel-item {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    height: 36px;
    background-color: #333333;
}

.scene-setting-panle-item>.rotate-panel>.rotate-panel-item>.text {
    color: var(---, rgba(240, 245, 255, 0.65));
    text-align: right;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    width: 20px;
    text-align: center;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

// FIXME 2024/8/7
.rotate-panel-item :deep(.el-textarea),
.rotate-panel-item :deep(.el-textarea__inner),
.rotate-panel-item :deep(.el-input),
.rotate-panel-item :deep(.el-input__wrapper),
.rotate-panel-item :deep(.el-input-number__decrease),
.rotate-panel-item :deep(.el-input-number__increase) {
    box-shadow: none;
    border: none;
    border-radius: 4px;
    color: #fff;
    background-color: rgba(250, 252, 255, 0.04) !important;
    
}

.rotate-panel-item :deep(.el-input__inner){
  color:#fff;
}

</style>
