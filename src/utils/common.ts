import { Object3D } from 'three'

export const getFileType = (fileName: string): string => {
  const fileArr: Array<any> = fileName.split('.')
  const fileExtension = fileArr.pop().toLowerCase()
  return fileExtension
}

export const traverseMeshChildren = (mesh: Object3D, callback: Function) => {
  mesh.children.forEach((child) => {
    callback(child)
    if (child instanceof THREE.Mesh) {
      traverseMeshChildren(child, callback)
    }
  })
}

export const traverseChildren = (mesh: Object3D, callback: Function) => {
  mesh.children.forEach((child) => {
    callback(child)
    if (child) {
      traverseChildren(child, callback)
    }
  })
}
