import {doGet} from '../helpers/request'
const terms= {
    namespaced: true,
    state: ()=>({
        terms: [],
        loading: false
    }),
    mutations:{
        setTerms(state,terms){
            state.terms = terms
        },
        setLoading(state,loading){
            state.loading = loading
        }
    },
    actions:{
        fetchTerms: async function ({commit}) {
            try {
              commit('setLoading',true)
              const response = await doGet({ path: "terms" });
              const data = await response.json();
              if (!response.ok) {
                throw data;
              }
      
              commit('setTerms',data.data);
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
            if(state.terms.length!==0 || state.loading) return;
            dispatch('fetchTerms'); 
        },
        reload({dispatch}){
            dispatch('fetchTerms'); 
        },
    }

}

export default terms