import mitt from 'mitt'

export const emitter = mitt()
export const useEmitter = () => ({ emitter })
