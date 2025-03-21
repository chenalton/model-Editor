import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import EventBus from './eventBus'
import EventEmitter from './modules/eventEmitter'

class Eulee extends EventEmitter {
  public scene: THREE.Scene
  public camera: THREE.Camera
  public orbitControls: OrbitControls
  public transformControls: TransformControls
  constructor(id: string) {
    super()
    const map = this.init(id)
    this.scene = map?.scene as THREE.Scene
    this.camera = map?.camera as THREE.Camera
    this.orbitControls = map?.orbitControls as OrbitControls
    this.transformControls = map?.transformControls as TransformControls
  }

  init(id: string) {
    window.THREE = THREE
    const dom = document.getElementById(id)
    if (dom) {
      const width = dom.clientWidth
      const height = dom.clientHeight

      const scene = new THREE.Scene()
      // scene.fog = new THREE.Fog(0x000000, 1000, 100)

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
      camera.position.set(-2.5417348562809297, 3.3165692150894435, 3.2883159130519872)

      const renderer = new THREE.WebGLRenderer({ alpha: true })
      renderer.setSize(width, height)

      const orbitControls = new OrbitControls(camera, renderer.domElement)

      const transformControls = new TransformControls(camera, renderer.domElement)

      this.initEvent(renderer, scene, camera)

      const composer = this.setModelComposer(width, height, renderer, scene, camera)

      dom.appendChild(renderer.domElement)

      const ambientLight = new THREE.AmbientLight('#fff', 3)
      scene.add(ambientLight)

      const dirLight = new THREE.DirectionalLight(0xffffff, 10)
      dirLight.position.set(0, 20, 1000)
      scene.add(dirLight)

      const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
				hemiLight.position.set( 0, 20, 0 );
				scene.add( hemiLight );


      scene.add(new THREE.GridHelper(5000, 5000))

      const animate = () => {
        requestAnimationFrame(animate)
        orbitControls.update()
        renderer.render(scene, camera)
        composer.render()
        this.updateSceneStatistics()
      }

      animate()

      window.addEventListener('resize', () => {
        const width = dom.clientWidth
        const height = dom.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        composer.render()
        renderer.setSize(width, height)
        orbitControls.update()
      })

      return { scene, camera, orbitControls, transformControls }
    }
  }

  initEvent(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    const raycaster = new THREE.Raycaster()

    renderer.domElement.addEventListener(
      'mousedown',
      (event) => {
        const mouse = new THREE.Vector2()
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        if (event.button === 0) {
          raycaster.setFromCamera(mouse, camera)

          const intersects = raycaster.intersectObjects(scene.children)

          if (intersects.length > 0) {
            const intersectedObject = intersects[0].object as THREE.Mesh
            if (
              intersectedObject.type === 'Mesh' &&
              (intersectedObject.parent?.type === 'Object3D' ||
                intersectedObject.parent?.type === 'Group') &&
              intersectedObject.geometry.type === 'BufferGeometry'
            ) {
              this.emit('click', intersectedObject.parent)
            }
          }
        } else if (event.button === 2) {
          this.removeTransformControls()
        }
      },
      false
    )

    window.addEventListener('keydown', (event) => {
      this.emit('keydown', event)
    })
  }

  addTransformControls(object: THREE.Object3D, mode: 'translate' | 'rotate' | 'scale') {
    if (this.transformControls) {
      this.removeTransformControls()
      this.transformControls.setMode(mode)
      this.transformControls.attach(object)
      this.scene.add(this.transformControls.getHelper())
      this.transformControls.addEventListener('dragging-changed', (event) => {
        if (this.orbitControls) {
          this.orbitControls.enabled = !event.value
        }
      })
      // EventBus.emit('heightLight', null)
    }
  }

  removeTransformControls() {
    if (this.transformControls) {
      this.transformControls.detach()
      this.scene.remove(this.transformControls.getHelper())
    }
  }

  setModelComposer(
    width: number,
    height: number,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) {
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera)
    outlinePass.visibleEdgeColor.set('#FFFF00') // 设置高亮颜色
    outlinePass.hiddenEdgeColor.set('#FFFF00')
    outlinePass.edgeStrength = 5 // 边框亮度
    outlinePass.edgeGlow = 0.5 // 光晕强度
    outlinePass.edgeThickness = 3 // 边缘宽度
    outlinePass.pulsePeriod = 2 // 呼吸闪烁速度
    outlinePass.renderToScreen = true // 渲染到屏幕
    composer.addPass(outlinePass)
    EventBus.on('heightLight', (obj?: THREE.Object3D | null) => {
      if (obj) {
        outlinePass.selectedObjects = [obj]
      } else {
        outlinePass.selectedObjects = []
      }
    })
    return composer
  }

  setModelHeightLight(obj: THREE.Object3D | null) {
    EventBus.emit('heightLight', obj)
  }

  updateSceneStatistics() {
    let objectCount = 0 // 物体数量
    let vertexCount = 0 // 顶点数量
    let triangleCount = 0 // 三角面数量

    if (this.scene) {
      this.scene.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
          objectCount++
          const geometry = object.geometry
          if (geometry instanceof THREE.BufferGeometry) {
            vertexCount += geometry.attributes.position.count
            if (geometry.index !== null) {
              triangleCount += geometry.index.count / 3
            } else {
              triangleCount += geometry.attributes.position.count / 3
            }
          }
        }
      })
    }

    this.emit('updateSceneStatistics', {
      objectCount,
      vertexCount,
      triangleCount
    })
  }

  getObject3DStatistics = (object3D: THREE.Object3D) => {
    let vertexCount = 0
    let triangleCount = 0

    object3D.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry
        vertexCount += geometry.attributes.position.count

        if (geometry.index !== null) {
          triangleCount += geometry.index.count / 3
        } else {
          triangleCount += geometry.attributes.position.count / 3
        }
      }
    })

    return {
      vertexCount,
      triangleCount
    }
  }
}

export default Eulee
