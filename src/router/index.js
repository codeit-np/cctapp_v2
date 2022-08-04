import Vue from "vue";
import VueRouter from "vue-router";
import LandingPage from "../views/LandingPage.vue";
import Home from "../views/Home.vue";
import store from "../store";
import getUser from "../helpers/getUser";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        name: "Home",
        path: "/",
        component: LandingPage,
      },
      {
        name: "Batches",
        path: "/batches",
        component: () =>
          import(/* webpackChunkName: "batches" */ "../views/Batches.vue"),
      },
      {
        name: "Terms",
        path: "/terms",
        component: () =>
          import(/* webpackChunkName: "terms" */ "../views/Terms.vue"),
      },
      {
        name: "Faculties",
        path: "/faculties",
        component: () =>
          import(/* webpackChunkName: "faculties" */ "../views/Faculties.vue"),
      },
      {
        name: "Subject Types",
        path: "/subjecttypes",
        component: () =>
          import(/* webpackChunkName: "subject_types" */ "../views/SubjectTypes.vue"),
      },
      {
        name: "Students",
        path: "/students",
        component: () =>
          import(/* webpackChunkName: "students" */ "../views/Students.vue"),
      },
      {
        name: "Student",
        path: "/student/:id",
        props: true,
        component: () =>
          import(/* webpackChunkName: "edit_students" */ "../views/EditStudent.vue"),
      },
      {
        name: "Student Attendance Report",
        path: "/student/:id/attendance",
        component: () =>
          import(/* webpackChunkName: "students_attendance_report" */ "../views/StudentAttendanceReport.vue"),
      },
      {
        name: "Subjects",
        path: "/subjects",
        component: () =>
          import(/* webpackChunkName: "subjects" */ "../views/Subjects.vue"),
      },
      {
        name: "Teachers",
        path: "/teachers",
        component: () =>
          import(/* webpackChunkName: "teachers" */ "../views/Teachers.vue"),
      },
      {
        name: "Pending Teachers",
        path: "/teachers/pending",
        component: () =>
          import(/* webpackChunkName: "pending_teachers" */ "../views/PendingTeachers.vue"),
      },
      {
        name: "SQCs",
        path: "/sqcs",
        component: () =>
          import(/* webpackChunkName: "sqcs" */ "../views/Sqcs.vue"),
      },
      {
        name: "Pending SQCs",
        path: "/sqcs/pending",
        component: () =>
          import(/* webpackChunkName: "pending_sqcs" */ "../views/PendingSqcs.vue"),
      },
      {
        name: "SQC",
        path: "/sqc/:id",
        component: () =>
          import(/* webpackChunkName: "edit_sqc" */ "../views/EditSqc.vue"),
      },
      {
        name: "Student Subject",
        path: "/student-subject-assign",
        component: () =>
          import(/* webpackChunkName: "student_subject" */ "../views/StudentSubject.vue"),
      },
      {
        name: "Attendance",
        path: "/attendance",
        component: () =>
          import(/* webpackChunkName: "attendance" */ "../views/Attendance.vue"),
      },
      {
        name: "Teacher Attendance",
        path: "/teacher-attendance",
        component: () =>
        import(/* webpackChunkName: "teacher_attendance" */ "../views/TeacherAttendance.vue"),
      },
      {
        name: "Teacher Reports",
        path: "/teacher-reports",
        component: () =>
          import(/* webpackChunkName: "teacher_reports" */ "../views/TeacherReports.vue"),
      },
      {
        name: "Leave Requests",
        path: "/leave-requests",
        component: () =>
          import(/* webpackChunkName: "leave_requests" */ "../views/LeaveRequests.vue"),
      },
      {
        path: "/topic-reports",
        name: "Topic Reports",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "topic" */ "../views/TopicReports.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/term-increment",
        name: "Term Increment",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "term-increment" */ "../views/TermIncrement.vue"),
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
