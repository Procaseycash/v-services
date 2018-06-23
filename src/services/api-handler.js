import {from, throwError} from "rxjs";
import {retryWhen, map, catchError, mergeMap, delay, take} from "rxjs/operators";

import Vue from 'vue'
import VueResource from 'vue-resource'
import {userService} from './user.service'

Vue.use(VueResource)
// Vue.http.options.credentials = true;
Vue.http.interceptors.push((request, next) => {
    // modify request
    // console.log('cred=', userService.isLoggedIn(), userService.getToken())
    if (userService.isLoggedIn()) {
        // console.log('yesyesyyyyy')
        request.headers.set('Authorization', `JWT ${userService.getToken()}`)
        // console.log('headers=', request.headers)
    }
    // request.headers.set('API_KEY', '657etudfsfs76856ewr5wer587r57wer5r565we');
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('Accept', 'application/json')
    /* setTimeout(function() {
      AlertService.clear();
    }, 6000);
  */
    // continue to next interceptor
    next()
})

export const ApiHandler = ((api_default_url, unauthorizedCallBack) => {
    /**
     * This is used catch error
     * @param err
     */
     const errorHandler = (err) => {
        // console.log('error=', err)
        if (err.status === 401) {
            if (unauthorizedCallBack.constructor === Function) {
                unauthorizedCallBack();
            }
        }
        let message = 'No Internet Access';
        if (navigator.onLine) {
            message = 'Error was encountered, please try again';
        }
        if (err.status === 0) {
            err.body = {}
            Object.assign(err.body, {message})
        }
        return throwError(err || {message: 'Error was encountered, please try again'})
    };

    return {

        /**
         * This is used to pass post request
         * @param path
         * @param data
         * @returns {Observable<R>}
         */
        post: (path, data) => {
            const url = `${api_default_url}${path}`
            // console.log('data=', data)
            return from(Vue.http.post(url, data || {}))
                .pipe(retryWhen((errors) => errors.pipe(mergeMap((error) => errorHandler(error)), delay(1000), take(2))))
                .pipe(catchError(errorHandler), map((res) => (res.body)));
        },

        /**
         *
         * This is used to pass put request
         * @param path
         * @param data
         * @returns {Observable<R>}
         *
         */
        put: (path, data) => {
            const url = `${api_default_url}${path}`
            return from(Vue.http.put(url, data || {}))
                .pipe(retryWhen((errors) => errors.pipe(mergeMap((error) => errorHandler(error)), delay(1000), take(2))))
                .pipe(catchError(errorHandler), map((res) => (res.body)));
        },


        /**
         *
         * This is used to pass get request
         * @param path
         * @returns {Observable<R>}
         *
         */
        get: (path) => {
            const url = `${api_default_url}${path}`
            // console.log('The URL defined as::', url)
            return from(Vue.http.get(url))
                .pipe(retryWhen((errors) => errors.pipe(mergeMap((error) => errorHandler(error)), delay(1000), take(2))))
                .pipe(catchError(errorHandler), map((res) => (res.body)));
        },


        /**
         * This is used to pass delete request
         * @param path
         * @returns {Observable<R>}
         */
        delete: (path) => {
            let url = `${api_default_url}${path}`
            return from(Vue.http.delete(url))
                .pipe(retryWhen((errors) => errors.pipe(mergeMap((error) => errorHandler(error)), delay(1000), take(2))))
                .pipe(catchError(errorHandler), map((res) => (res.body)));

        },


        /**
         * This is used to make request to fro the apis.
         * @param method
         * @param path
         * @param options
         */
        callIn(method = 'POST', path = '', options = {}) {
            const url = `${api_default_url}${path}`;
            return from(Vue.http.request(method.toUpperCase(), url, options || {}))
                .pipe(retryWhen((errors) => errors.pipe(mergeMap((error) => errorHandler(error)), delay(1000), take(2))))
                .pipe(catchError(errorHandler), map((res) => (res)));
        },

        /**
         *
         * This is used to pass request directly to the specified url
         * @param method
         * @param url (with full url)
         * @param options
         *
         */
        callOut(method = 'POST', url = '', options = {}) {
            return from(Vue.http.request(method.toUpperCase(), url, options || {}))
                .pipe(retryWhen((errors) => errors.pipe(mergeMap((error) => errorHandler(error)), delay(1000), take(2))))
                .pipe(catchError(errorHandler), map((res) => (res)));
        }

    }
})();

export default ApiHandler;
