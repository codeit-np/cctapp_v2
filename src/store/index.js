import Vue from 'vue'
import Vuex from 'vuex'
import terms from './terms'
import faculties from './faculties'
import batches from './batches'
import teachers from './teachers'
import subjects from './subjects'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    terms: terms,
    faculties: faculties,
    batches: batches,
    teachers: teachers,
    subjects: subjects
  },
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
  
})
