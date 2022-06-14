import Vue from "vue";
import VueRouter from "vue-router";
import LandingPage from "../views/LandingPage.vue";
import Batches from "../views/Batches.vue";
import Terms from "../views/Terms.vue";
import SubjectTypes from "../views/SubjectTypes.vue";
import Faculties from "../views/Faculties.vue";
import Students from "../views/Students.vue";
import Subjects from "../views/Subjects.vue";
import Teachers from "../views/Teachers.vue";
import Sqcs from "../views/Sqcs.vue";
import PendingTeachers from "../views/PendingTeachers.vue";
import PendingSqcs from "../views/PendingSqcs.vue";
import Home from "../views/Home.vue";
import EditStudent from "../views/EditStudent.vue";
import EditSqc from "../views/EditSqc.vue";
import StudentSubject from "../views/StudentSubject.vue";
import Attendance from "../views/Attendance.vue";
import TeacherAttendance from "../views/TeacherAttendance.vue";
import TeacherReports from "../views/TeacherReports.vue";
import LeaveRequests from "../views/LeaveRequests.vue";
import store from "../store";
import getUser from "../helpers/getUser";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        name: "Landing",
        path: "/",
        component: LandingPage,
      },
      {
        name: "Batches",
        path: "/batches",
        component: Batches,
      },
      {
        name: "Terms",
        path: "/terms",
        component: Terms,
      },
      {
        name: "Faculties",
        path: "/faculties",
        component: Faculties,
      },
      {
        name: "Subject Types",
        path: "/subjecttypes",
        component: SubjectTypes,
      },
      {
        name: "Students",
        path: "/students",
        component: Students,
      },
      {
        name: "Student",
        path: "/student/:id",
        component: EditStudent,
      },
      {
        name: "Subjects",
        path: "/subjects",
        component: Subjects,
      },
      {
        name: "Teachers",
        path: "/teachers",
        component: Teachers,
      },
      {
        name: "Pending Teachers",
        path: "/teachers/pending",
        component: PendingTeachers,
      },
      {
        name: "SQCs",
        path: "/sqcs",
        component: Sqcs,
      },
      {
        name: "Pending SQCs",
        path: "/sqcs/pending",
        component: PendingSqcs,
      },
      {
        name: "SQC",
        path: "/sqc/:id",
        component: EditSqc,
      },
      {
        name: "Student Subject",
        path: "/student-subject-assign",
        component: StudentSubject,
      },
      {
        name: "Attendance",
        path: "/attendance",
        component: Attendance,
      },
      {
        name: "Teacher Attendance",
        path: "/teacher-attendance",
        component: TeacherAttendance,
      },
      {
        name: "Teacher Reports",
        path: "/teacher-reports",
        component: TeacherReports,
      },
      {
        name: "Leave Requests",
        path: "/leave-requests",
        component: LeaveRequests,
      },
      {
        path: "/term-increment",
        name: "Term Increment",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/TermIncrement.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: { requiresAuth: true },
  },
  
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/forgotpassword",
    name: "Forgot Password",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/ForgotPassword.vue"),
    meta: { guest: true },
  },
  {
    path: "/password-reset",
    name: "Password Reset",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/PasswordReset.vue"),
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "Register",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/Register.vue"),
    meta: { guest: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const checkUserIsAdmin = async () => {
    try{
      if (store.state.isAdmin) return true;
      if(store.state.token){
        store.commit("setLoading", true);
        const {err, user } = await getUser();
        if(err){
         return false;
        }
        if (!user) return false;
        store.commit("setUser", user || {});
        store.commit("setIsAdmin", user.is_admin || false);
        return store.state.isAdmin;
      }
    
      return false;
    }catch(err){
      console.log(err)
    }finally{
      store.commit("setLoading", false);

    }
};

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await checkUserIsAdmin()) {
      next();
    } else {
      next({
        path: "/login",
      });
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (!(await checkUserIsAdmin())) {
      next();
    } else {
      next({ name: "Home" });
    }
  } else {
    next();
  }
});

export default router;
