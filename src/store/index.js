import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    user: null,
    isAdmin: false,
    loading: false
  },
  mutations: {
    setToken(state, token){
      state.token = token
      localStorage.setItem('token', token)
    },
    clearToken(state){
      state.token = null;
      localStorage.removeItem('token')
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
