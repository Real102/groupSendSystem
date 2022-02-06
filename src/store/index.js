import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import { getCountryList } from '@/api/sign.js'
import { getSendWayList } from '@/api/manager.js'
// import { getPriceList } from '@/api/custom.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allCountryList: [],
    swList: [], // 群发渠道列表
    // countryList: [],
    // countryListTotal: 0
    role: 1 // 用户角色
  },
  mutations: {
    SET_ALL_COUNTRY_LIST(state, payload) {
      state.allCountryList = payload
    },
    // SET_COUNTRY_LIST(state, payload) {
    //   state.countryList = payload.list
    //   state.countryListTotal = payload.total
    // }
    SET_SW_LIST(state, payload) {
      state.swList = payload
    },
    SET_ROLE(state, payload) {
      state.role = payload
    }
  },
  actions: {
    allCountryList({ commit }) {
      // 初始化所有国家-代码映射表
      getCountryList()
        .then(res => {
          commit('SET_ALL_COUNTRY_LIST', res.data || [])
        })
        .catch(err => {
          console.log(err)
        })
    },
    // countryList({ commit }) {
    //   // 这里是初始化可选配置的国家-代码列表
    //   getPriceList()
    //     .then(res => {
    //       commit('SET_COUNTRY_LIST', res.data)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
    getSwList({ commit }) {
      return new Promise((resolve, reject) => {
        getSendWayList()
          .then(res => {
            commit('SET_SW_LIST', res.data || [])
            resolve()
          })
          .catch(err => {
            reject(new Error(err))
          })
      })
    }
  },
  modules: {
    user
  }
})
