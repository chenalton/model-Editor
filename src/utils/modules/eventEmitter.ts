class EventEmitter {
  public events: { [key: string]: Array<(...args: any[]) => void> }
  constructor() {
    this.events = {}
  }

  on(eventName: string, listener: (...args: any[]) => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(listener)
  }

  emit(eventName: string, ...args: any) {
    const listeners = this.events[eventName]
    if (listeners) {
      listeners.forEach((listener: Function) => {
        listener(...args)
      })
    }
  }
}

export default EventEmitter
