import {doGet} from '../helpers/request'
const subjects= {
    namespaced: true,
    state: ()=>({
        subjects: [],
        loading: false
    }),
    mutations:{
        setSubjects(state,subjects){
            state.subjects = subjects
        },
        setLoading(state,loading){
            state.loading = loading
        }
    },
    actions:{
        fetchSubjects: async function ({commit}) {
            try {
              commit('setLoading',true)
              const response = await doGet({ path: "subjects" });
              const data = await response.json();
              if (!response.ok) {
                throw data;
              }
      
              commit('setSubjects',data.data);
            } catch (err) {
            //   this.$notify.error({
            //     title: "Error",
            //     message: err.message || "Something went wrong",
            //     position: "bottom-right",
            //   });
            } finally {
                commit('setLoading',false)
            }
        },
        load({state,dispatch}){
            if(state.subjects.length!==0 || state.loading) return;
            dispatch('fetchSubjects'); 
        },
        reload({dispatch}){
            dispatch('fetchSubjects'); 
        },
    },
    getters:{
        filteredSubjects: (state) => ({faculty_id,term_id})=>{
            const subs = state.subjects.filter((subject) => {
                const termFilter = term_id
                  ? subject.term.id == term_id
                  : true;
                const facultyFilter = faculty_id
                  ? subject.faculty.id == faculty_id
                  : true;
                return termFilter && facultyFilter;
              });
              return subs;
        }
    }

}

export default subjects