import {Encrypt} from './encrypt.js'

export const Cache = {
    /**
     * Set Data to session and local storage for auth user but default storage is local storage
     * @param key
     * @param data
     */
    set(key, data) {
        this.sset(key, data)
        this.lset(key, data)
    },

    /**
     * Set Data to session storage
     * @param key
     * @param data
     */
    sset(key, data) {
        const encryptedData = Encrypt.encrypt(data)
        sessionStorage.setItem(key, encryptedData)
    },


    /**
     * Set Data to local storage
     * @param key
     * @param data
     */
    lset(key, data) {
        const encryptedData = Encrypt.encrypt(data)
        localStorage.setItem(key, encryptedData)
    },

    /**
     * get Data to local storage
     * @param key
     */
    lget(key) {
        if (!localStorage.getItem(key)) {
            return null
        }
        return Encrypt.decrypt(localStorage.getItem(key))
    },

    /**
     * get Data to session storage
     * @param key
     */
    sget(key) {
        if (!sessionStorage.getItem(key)) {
            return null
        }
        return Encrypt.decrypt(sessionStorage.getItem(key))
    },

    /**
     * get data from local storage or session storage for auth user but default engine is local
     * @param key
     * @returns {any}
     */
    get(key) {
        return this.lget(key) || this.sget(key)
    },

    /**
     * Used to clear cache Data
     */
    clear() {
        sessionStorage.clear()
        localStorage.clear()
    },

    /**
     * This is used to remove a data by key
     * @param key
     */
    sremove(key) {
        sessionStorage.removeItem(key)
    },

    /**
     * This is used to remove a data by key
     * @param key
     */
    lremove(key) {
        localStorage.removeItem(key)
    },

    remove(key) {
        this.lremove(key);
        this.sremove(key)
    },

    /**
     * This is used to clear data in session
     */
    sclear() {
        sessionStorage.clear()
    },

    /**
     * This is used to clear data in local
     */
    lclear() {
        localStorage.clear()
    }

}

export default Cache