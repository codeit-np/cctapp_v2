import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    user: null,
    isAdmin: false,
    loading: false
  },
  mutations: {
    setToken(state, token){
      state.token = token
      localStorage.setItem('token', token)
    },
    setUser(state, user){
      state.user = user
    },
    setIsAdmin(state, isAdmin){
      state.isAdmin = isAdmin
    },
    setLoading(state, loading){
      state.loading = loading
    },
  },
  actions: {
    
  },
  modules: {
  }
})
