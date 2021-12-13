import { axiosGet, axiosPost } from '../utils/axios'
import { User } from '../config/config.url'

/**
 *
 * @param {String} username 用户名
 * @param {String} password 密码
 */
export function login (username, password) {
    let para = {
        username,
        password
    }
    return axiosPost(User.login, para, false, true)
}

/* 获取用户资料 */
export function getUserData () {
    return axiosGet(User.getUserData)
}