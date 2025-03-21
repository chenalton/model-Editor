import * as THREE from 'three'

class EObject extends THREE.Object3D {
  public obj: THREE.Object3D | undefined
  public type: 'eulee'
  constructor(option?: { object?: THREE.Object3D }) {
    super()
    this.obj = option?.object
    this.type = 'eulee'
    this.init()
  }

  init() {
    if (this.obj) {
      this.add(this.obj)
    }
  }

  setModelHeightLight() {}
}

export default EObject
