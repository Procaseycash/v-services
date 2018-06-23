import { Subject, from} from 'rxjs'

export const EventsHandler = (function () {
  let listeners = {}
  let eventsSubject = null
  let events = null;

  (function () {
    listeners = {}
    eventsSubject = new Subject()
    // console.log('heeet')
    events = from(eventsSubject)

    events.subscribe(
      ({ name, args }) => {
        // // console.log(name, 'listenersData', listeners[name]);
        if (listeners[name]) {
          for (const listener of listeners[name]) {
            if (listeners[name]) {
              listener(...args)
              break
            }
          }
        }
      })
  }())

  return {
    /**
     * This is used to register event(s)
     * @param name
     * @param listener
     */
    on(name, listener) {
      if (name.constructor === String) {
        if (!listeners[name]) {
          listeners[name] = []
          listeners[name].push(listener)
          // console.log('register=', { name, listener })
        }
        if (listeners[name]) {
          listeners[name][0] = listener
        }
        return
      }

      if (name.constructor === Array) {
        name.forEach((key) => {
          if (!listeners[key]) {
            listeners[key] = []
            listeners[key].push(listener)
          }
          if (listeners[key]) {
            listeners[key][0] = listener
          }
        })
      }
    },

    /**
     * This is used to publish registered event(s)
     * @param name
     * @param args
     */
    broadcast(name, ...args) {
      // console.log({ listeners })
      // console.log({ eventsSubject })
      if (name.constructor === String) {
        this.next(name, args)
        return
      }
      if (name.constructor === Array) {
        // // console.log('I was here for Event Array');
        name.forEach((key) => {
          this.next(key, args)
        })
      }
    },

    /**
     * This is used to perform broadcast
     * @param key
     * @param args
     */
    next(key, args) {
      setTimeout(() => {
        // // console.log('I ws called in Events');
        eventsSubject.next({
          name: key,
          args
        })
      }, 200)
    }
  }
}())

export default EventsHandler;