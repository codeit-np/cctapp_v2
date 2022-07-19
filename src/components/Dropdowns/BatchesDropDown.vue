<template >
  <el-select  v-model="batch_id"  filterable placeholder="Select Batch">
    <el-option v-if="hasNull" label="All Batches" :value="null"> </el-option>
    <el-option
      v-for="batch in batches"
      :key="batch.id"
      :label="batch.year"
      :value="batch.id"
    >
    </el-option>
  </el-select>
</template>
<script>
import { doGet } from "../../helpers/request";
import {mapState,mapActions} from 'vuex'
export default {
  props: {
    value: Number,
    loading: Boolean,
    hasNull: Boolean,
  },
  data() {
    return {
      // batches: [],
    };
  },
  methods: {
    fetchBatches: async function () {
      try {
        this.$emit("update:loading", true);
        const response = await doGet({ path: "batches" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.batches = data.data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message,
          position: "bottom-right",
        });
      } finally {
        this.$emit("update:loading", false);
      }
    },
    ...mapActions('batches',[
      'load'
    ]),
  },
  mounted() {
      this.load();
  },
  computed: {
     ...mapState('batches',{
      batches: state=> state.batches,
      data_loading: state => state.loading
    }),
    batch_id: {
      get() {
        return this.value;
      },
      set(newValue) {  
        this.$emit("input", newValue);
      },
    },
  },
  watch:{
    data_loading(newValue){
       this.$emit("update:loading", newValue);
    }
  },
};
</script>
<style >
</style>