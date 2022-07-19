import {doGet} from '../helpers/request'
const teachers= {
    namespaced: true,
    state: ()=>({
        teachers: [],
        loading: false
    }),
    mutations:{
        setTeachers(state,teachers){
            state.teachers = teachers
        },
        setLoading(state,loading){
            state.loading = loading
        }
    },
    actions:{
        fetchTeachers: async function ({commit}) {
            try {
              commit('setLoading',true)
              const response = await doGet({ path: "teachers" });
              const data = await response.json();
              if (!response.ok) {
                throw data;
              }
      
              commit('setTeachers',data.data);
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
            if(state.teachers.length!==0 || state.loading) return;
            dispatch('fetchTeachers'); 
        },
        reload({dispatch}){
            dispatch('fetchTeachers'); 
        },
    }

}

export default teachers