/*
 * @Author: cuizhaojian
 * @LastEditors: cuizhaojian
 * @LastEditTime: 2024-12-12 10:49:11
 * @Description: 
 */
import { MessageParamsWithType } from 'element-plus'
import { Object3D } from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export type SetModelType = {
  filePath: string
  fileType: string
}

export const setModel = (modelFile: SetModelType): Promise<Object3D> => {
  const { filePath, fileType } = modelFile
  return new Promise((resolve) => {
    let loader
    if (['glb', 'gltf'].includes(fileType)) {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath(`draco/gltf/`)
      dracoLoader.setDecoderConfig({ type: 'js' })
      dracoLoader.preload()
      loader = new GLTFLoader().setDRACOLoader(dracoLoader)
    }
    loader?.load(filePath, (res: GLTF) => {
      console.log("res===>",res)
      eulee.scene.add(res.scene)
      res.scene.name = "RootNode"
      resolve(res.scene)
    })
  })
}

export const copyModel = (model: Object3D) => {
  const obj = getRootParent(model) as Object3D
  return obj.clone()
}

export const deleteModel = (model: Object3D) => {
  const child = eulee.scene.getObjectById(model.id)
  if (child) {
    // eulee.scene.remove(eulee.scene.getObjectById(model.id))
    const obj = getRootParent(child) as Object3D
    console.log(obj)
    eulee.scene.remove(obj)
  }
}

export const exportModel = (type: string) => {
  const exporter = new GLTFExporter()
  const options = {
    trs: true,
    binary: type == 'glb',
    embedImages: true,
    onlyVisible: true,
    includeCustomExtensions: true
  }
  exporter.parse(
    eulee.scene,
    (result) => {
      if (result instanceof ArrayBuffer) {
        // 将结果保存为GLB二进制文件
        saveArrayBuffer(result, `${new Date().toLocaleString()}.glb`)
      } else {
        // 将结果保存为GLTF JSON文件
        saveString(JSON.stringify(result), `${new Date().toLocaleString()}.gltf`)
      }
    },
    (err: MessageParamsWithType) => {
      console.error(err)
    },
    options
  )
}

const saveArrayBuffer = (buffer: ArrayBuffer, filename: string) => {
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const saveString = (text: string, filename: string) => {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const getRootParent = (object3d: Object3D) => {
  let currentParent
  if(object3d.parent && object3d.parent.type !== 'Scene'){
    currentParent = object3d.parent
  }else{
    currentParent = object3d
  }
  while (currentParent && currentParent.parent && currentParent.parent.type !== 'Scene') {
    currentParent = currentParent.parent
  }
  return currentParent
}
