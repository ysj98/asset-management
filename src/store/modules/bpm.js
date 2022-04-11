import * as apiBpm from "@/api/bpm";
import {message as $message} from "ant-design-vue";

const state = {
  token:''
}

const mutations = {
  setToken (state, data) {
    state.token = data
  }
}

const actions = {
  getToken({ commit,state }) {
    return new Promise((resolve, reject) => {
      if (!state.token){
        apiBpm.getAuthorizeJwtToken().then(({data:{code,data,message}}) => {
          if (code === "0"){
            commit('setToken', data.jwt);
            resolve(data.jwt)
          }else {
            $message.error(message)
            reject(message)
          }
        });
      }else {
        resolve(state.token)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
