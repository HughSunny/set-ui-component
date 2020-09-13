// export function setLocalConfig(key, value) {
//     localStorage.setItem(key, value)
// }

// export function getLocalConfig(key) {
//     return localStorage.getItem(key)
// }
export function setLocalConfig(key, value) {
    window[key] = value
}

export function getLocalConfig(key) {
    return window[key]
}

let apiHost = null
let fileHost = null
let fileAction = null
let fileRequest = null
export function setUploadConfig ({apiHost, fileHost, fileAction, fileRequest}) {
    setLocalConfig('SET_API_Host', apiHost);
    setLocalConfig('SET_FILE_Host', fileHost);
    setLocalConfig('SET_FILE_ACTION', fileAction);
    setLocalConfig('SET_FILE_REQUEST', fileRequest)
}

export function getApiHost () {
    return getLocalConfig('SET_API_Host')
}
export function getFileHost () {
    return getLocalConfig('SET_FILE_Host')
}
export function getFileAction () {
    return getLocalConfig('SET_FILE_ACTION')
}
export function getFileRequest () {
    return getLocalConfig('SET_FILE_REQUEST')
}

export function isFileRequestExist () {
    return isExitsFunction('SET_FILE_REQUEST') && getFileRequest() !== null
}

export function isExitsFunction(funcName) {
    return window.hasOwnProperty(funcName)
    // try {
    //     if (typeof(eval(funcName)) == "function") {
    //         return true;
    //     }
    // } catch (e) {
    //     console.log(eval(funcName) + "+++++++++++++++++我异常了!!!!!!!!");
    // }
    // return false;
}