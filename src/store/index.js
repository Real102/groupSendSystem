import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import { getCountryList } from '@/api/sign.js'
// import { getPriceList } from '@/api/custom.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allCountryList: []
    // countryList: [],
    // countryListTotal: 0
  },
  mutations: {
    SET_ALL_COUNTRY_LIST(state, payload) {
      state.allCountryList = payload
    }
    // SET_COUNTRY_LIST(state, payload) {
    //   state.countryList = payload.list
    //   state.countryListTotal = payload.total
    // }
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
    }
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
  },
  modules: {
    user
  }
})
