const state = {
  userInfo: {
    name: 'hello world',
    role: 1 // 用户角色
  }
}

const mutations = {
  SET_USERINFO(state, payload) {
    state.userInfo.name = payload.account
    state.userInfo.role = payload.role
    localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
