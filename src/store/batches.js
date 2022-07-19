import {doGet} from '../helpers/request'
const batches= {
    namespaced: true,
    state: ()=>({
        batches: [],
        loading: false
    }),
    mutations:{
        setBatches(state,batches){
            state.batches = batches
        },
        setLoading(state,loading){
            state.loading = loading
        }
    },
    actions:{
        fetchBatches: async function ({commit}) {
            try {
              commit('setLoading',true)
              const response = await doGet({ path: "batches" });
              const data = await response.json();
              if (!response.ok) {
                throw data;
              }
      
              commit('setBatches',data.data);
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
            if(state.batches.length!==0 || state.loading) return;
            dispatch('fetchBatches'); 
        },
        reload({dispatch}){
            dispatch('fetchBatches'); 
        },
        delete({state,commit},id){
            const newBatches = state.batches.filter(batch=> batch.id !== id);
            commit('setBatches',newBatches);
        }
    }

}

export default batches