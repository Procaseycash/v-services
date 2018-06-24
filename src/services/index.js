import ApiHandler from "./api-handler";
import Cookies from "./cookies";
import Encrypt from "./encrypt";
import {EventsHandler} from "./event.handler";
import {Cache} from "./cache";

const VService = {
    install: (Vue, options) => {
        const keys = options.keys();
        if (keys.length === 0) {
            throw new Error('Please supply all keys, {api_default_url, unAuthorizedCallBackFn}')
        }
        Vue.apiHandler = Vue.prototype.$apiHandler = ApiHandler(options['api_default_url'], options['unAuthorizedCallBackFn']);
        Vue.cookies = Vue.prototype.$cookies = Cookies;
        Vue.cache = Vue.prototype.$cache = Cache;
        Vue.eventHandler = Vue.prototype.$eventHandler = EventsHandler;
        Vue.encryptHandler = Vue.prototype.$encryptHandler = Encrypt;
    }
};

export {
    ApiHandler,
    Cookies,
    Cache,
    EventsHandler,
    Encrypt
}

export default VService;

// Auto-install
const GlobalVue = (typeof window !== 'undefined') ? window.Vue : (typeof global !== 'undefined') ? global.Vue : null;
if (GlobalVue) {
    GlobalVue.use(VService)
}
