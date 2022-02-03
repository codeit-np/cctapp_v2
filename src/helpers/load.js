import {doGet} from './request'

let batches = []
export const fetchBatches = async (force=false) =>{
    try {
      if(batches.length>0 && !force) return {batches, err:null}   
      const response = await doGet({ path: "batches" });
      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      batches = data.data;
      return {batches: data.data, err: null}
    } catch (err) {
        return {batches: null, err: err}
    }
}