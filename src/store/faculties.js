import {doGet} from '../helpers/request'
const faculties= {
    namespaced: true,
    state: ()=>({
        faculties: [],
        loading: false
    }),
    mutations:{
        setFaculties(state,faculties){
            state.faculties = faculties
        },
        setLoading(state,loading){
            state.loading = loading
        }
    },
    actions:{
        fetchFaculties: async function ({commit}) {
            try {
              commit('setLoading',true)
              const response = await doGet({ path: "faculties" });
              const data = await response.json();
              if (!response.ok) {
                throw data;
              }
      
              commit('setFaculties',data.data);
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
            if(state.faculties.length!==0 || state.loading) return;
            dispatch('fetchFaculties'); 
        },
        reload({dispatch}){
            dispatch('fetchFaculties'); 
        },
    }

}

export default faculties