<template >
  <el-select
    v-model="faculty_id"
    filterable
    placeholder="Select Faculty"
  >
    <el-option v-if="hasNull" label="All Faculties" :value="null"> </el-option>
    <el-option
      v-for="faculty in faculties"
      :key="faculty.id"
      :label="faculty.title"
      :value="faculty.id"
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
      // faculties: [],
    };
  },
  methods: {
     fetchFaculties: async function () {
      try {
        this.$emit('update:loading',true)
        const response = await doGet({ path: "faculties" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.faculties = data.data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message,
          position: "bottom-right",
        });
      } finally {
        this.$emit('update:loading',false)
      }
    },
    ...mapActions('faculties',[
      'load'
    ]),
  },
  mounted() {
   this.load();
  },
  computed: {
     ...mapState('faculties',{
      faculties: state=> state.faculties,
      data_loading: state => state.loading
    }),
    faculty_id: {
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
  }
};
</script>
<style >
</style>