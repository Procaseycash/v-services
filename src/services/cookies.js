/**
 * Created by Kazeem Olanipekun
 */

export const Cookies = {
    /**
     * This is used to setup cookie
     * @param key
     * @param data
     * @param expiresInDays
     */
    set: function (key, data, expiresInDays) {
        const encryptedUser = data // Encrypt.encrypt(data);
        const d = new Date()
        d.setTime(d.getTime() + (expiresInDays * 24 * 60 * 60 * 1000))
        const expires = `expires=${d.toUTCString()}`
        document.cookie = `${key}=${encryptedUser};${expires};path=/`
    },

    /**
     * This is used to expire a cookie
     * @param name
     */
    expire: function (name) {
        if (typeof (Storage) !== 'undefined') {
            const d = new Date()
            d.setTime(d.getTime() - (12 * 24 * 60 * 60 * 1000000))
            const expires = `expires=${d.toUTCString()}`
            document.cookie = `${name + '='}${undefined};${expires};path=/`
        }
    },

    /**
     * This is used to get a cookie by key
     * @param key
     * @returns {*}
     */
    get: function (key) {
        if (typeof (Storage) !== 'undefined') {
            const name = `${key}=`
            const decodedCookie = decodeURIComponent(document.cookie)
            const ca = decodedCookie.split(';')
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i]
                while (c.charAt(0) === ' ') {
                    c = c.substring(1)
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length) || null
                }
            }
            return null
        }
        return null
    },

    /**
     * This is used to decode JSON WEB TOKEN in cookie
     * @param token
     */
    jwtDecrypt(token) {
        if (!token) {
            return null
        }
        if (typeof (token) === 'object') {
            return token
        }
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace('-', '+').replace('_', '/')
        return (base64) ? JSON.parse(window.atob(base64)) : null;
    }

}

export default Cookies
