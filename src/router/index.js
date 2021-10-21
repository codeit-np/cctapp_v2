import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Batches from '../views/Batches.vue'
import Terms from '../views/Terms.vue'
import SubjectTypes from '../views/SubjectTypes.vue'
import Faculties from '../views/Faculties.vue'
import Students from '../views/Students.vue'
import Subjects from '../views/Subjects.vue'
import Teachers from '../views/Teachers.vue'
import Sqcs from '../views/Sqcs.vue'
import PendingTeachers from '../views/PendingTeachers.vue'
import PendingSqcs from '../views/PendingSqcs.vue'
import Home from '../views/Home.vue'
import EditStudent from '../views/EditStudent.vue'
import EditSqc from '../views/EditSqc.vue'

import store from '../store'
import getUser from '../helpers/getUser'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        name: 'Landing',
        path: '/',
        component: LandingPage,
      },
      {
        name:'Batches',
        path: '/batches',
        component: Batches,
      },
      {
        name:'Terms',
        path: '/terms',
        component: Terms,
      },
      {
        name:'Faculties',
        path: '/faculties',
        component: Faculties,
      },
      {
        name:'Subject Types',
        path: '/subjecttypes',
        component: SubjectTypes,
      },
      {
        name:'Students',
        path: '/students',
        component: Students,
      },
      {
        name:'Student',
        path: '/student/:id',
        component: EditStudent,
      },
      {
        name:'Subjects',
        path: '/subjects',
        component: Subjects,
      },
      {
        name:'Teachers',
        path: '/teachers',
        component: Teachers,
      },
      {
        name:'Pending Teachers',
        path: '/teachers/pending',
        component: PendingTeachers,
      },
      {
        name:'SQCs',
        path: '/sqcs',
        component: Sqcs,
      },
      {
        name:'Pending SQCs',
        path: '/sqcs/pending',
        component: PendingSqcs,
      },
      {
        name:'SQC',
        path: '/sqc/:id',
        component: EditSqc,
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "auth" */ '../views/Login.vue'),
    meta: { guest: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const checkUserIsAdmin= async ()=>{
  if(store.state.isAdmin ) return true;

  if(store.state.token && !store.state.user){
    store.commit('setLoading', true);
    const {user} = await getUser();
    store.commit('setUser', user||{});
    store.commit('setIsAdmin', user.is_admin || false);
    store.commit('setLoading', false);
    return store.state.isAdmin
  }

  return false;
}


router.beforeResolve(async (to,from,next)=>{

  if(to.matched.some(record=> record.meta.requiresAuth)){
    if(await checkUserIsAdmin()){
      next();
    } else{
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } 
  }
  else if(to.matched.some(record=> record.meta.guest)){
    if(!await checkUserIsAdmin()){
      next();
    } else{
      next({ name: 'Home' });
    }
  } else{
    next();
  }
})

export default router
