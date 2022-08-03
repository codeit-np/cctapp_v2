import {doGet} from '../helpers/request'
import {Notification} from 'element-ui'
const students= {
    namespaced: true,
    state: ()=>({
        students: [],
        active_batch:null,
        active_faculty: null,
        active_term: null,
        loading: false
    }),
    mutations:{
        setStudents(state,students){
            state.students = students
        },
        setFaculty(state,active_faculty){
            state.active_faculty = active_faculty
        },
        setBatch(state,active_batch){
            state.active_batch = active_batch
        },
        setTerm(state,active_term){
            state.active_term = active_term
        },
        setLoading(state,loading){
            state.loading = loading
        }
    },
    actions:{
        fetchStudents: async function ({state,commit}) {
            try {
              commit('setLoading',true)
              const response = await doGet({ path: "students",query:{faculty_id: state.active_faculty,term_id: state.active_term, batch_id: state.active_batch} });
              const data = await response.json();
              if (!response.ok) {
                throw data;
              }
      
              commit('setStudents',data.data);
            } catch (err) {
                Notification.error({
                title: "Error",
                message: err.message || "Something went wrong",
                position: "bottom-right",
              });
            } finally {
                commit('setLoading',false)
            }
        },
        load({state,dispatch}){
            if(state.students.length!==0 || state.loading) return;
            dispatch('fetchStudents'); 
        },
        reload({dispatch}){
            dispatch('fetchStudents'); 
        },
    },
    getters:{
        singleStudent: (state) => ({student_id})=>{
            return state.students.find(student=>student.id==student_id);
        }
    }
}

export default students