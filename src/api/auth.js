/**
 * 描述：认证服务入口
 * 作者：猪不乐意
 * 日期：2019年6月26日
 */

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

/* 获取导航栏菜单 权限 */
export function menus () {
  return axiosGet(User.menus)
}

/* 获取页面按钮 权限 */
export function popedomCode () {
  return axiosGet(User.popedomCode)
}
