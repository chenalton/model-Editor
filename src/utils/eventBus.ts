import mitt from 'mitt'
import { Object3D } from 'three'

type Events = {
  heightLight: Object3D | null
  transformControls: Object3D
  sceneChildrenChange: void
}

const EventBus = mitt<Events>()

export default EventBus
