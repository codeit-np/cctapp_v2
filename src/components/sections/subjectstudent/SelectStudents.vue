<template lang="">
  <div
  >
        <el-card v-loading="metaLoading">
      <div class="d-flex space-between justify-content-between flex-column flex-lg-row px-4">
        <el-select class="my-1" v-model="batch_id" placeholder="Select Batch">
          <el-option label="All Batches" :value="null"> </el-option>
          <el-option
            v-for="batch in batches"
            :key="batch.id"
            :label="batch.year"
            :value="batch.id"
          >
          </el-option>
        </el-select>

        <el-select class="my-1" v-model="faculty_id" placeholder="Select Faculty">
          <el-option label="All Faculties" :value="null"> </el-option>
          <el-option
            v-for="faculty in faculties"
            :key="faculty.id"
            :label="faculty.title"
            :value="faculty.id"
          >
          </el-option>
        </el-select>

        <el-select class="my-1" v-model="term_id" placeholder="Select Term">
          <el-option label="All Terms" :value="null"> </el-option>
          <el-option
            v-for="term in terms"
            :key="term.id"
            :label="term.title"
            :value="term.id"
          >
          </el-option>
        </el-select>

        <el-button class="my-1" @click="fetchStudents" type="primary">Search Students</el-button>
      </div>
    </el-card>
    
    <el-card v-loading="loading">
       <el-button class="my-1" v-if="students.length>0" @click="selectAll" type="primary">Select All</el-button>
      <el-button class="my-1" v-if="students.length>0" @click="deselectAll" type="primary">Deselect All</el-button>
        <div class="container m-2">
            <div class="d-flex flex-wrap">
                <span class="d-block m-2 badge rounded-pill bg-light text-dark" v-for="student in students" :key="student.id">
                    <input type="checkbox" class="px-1" :id="student.name" :value="student.id" v-model="model">
                    <label :for="student.name" class="px-1" > <span v-if="student.roll_no!==null && student.roll_no!==undefined "> {{student.roll_no}} -  </span> {{ student.name }}</label>
                </span>
            </div>
        </div>
        
    </el-card>
  </div>
</template>
<script>
import { doGet } from "../../../helpers/request";
export default {
  props: {
    value: Array,
  },
  data() {
    return {
      students: [],
      batches: [],
      terms: [],
      faculties: [],
      batch_id: null,
      faculty_id: null,
      term_id: null,
      loading: false,
      metaLoading: false,
      errors: {},
    };
  },
  mounted() {
    this.fetchTerms();
    this.fetchFaculties();
    this.fetchBatches();
  },
  methods: {
   
    fetchStudents: async function () {
      try {
        this.$emit('input',[]);
        this.loading = true;
        const response = await doGet({
          path: "students",
          query: {
            faculty_id: this.faculty_id,
            term_id: this.term_id,
            batch_id: this.batch_id,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.students = data.data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message,
          position: "bottom-right",
        });
      } finally {
        this.loading = false;
      }
    },
    fetchBatches: async function () {
      try {
        this.metaLoading = true;
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
        this.metaLoading = false;
      }
    },
    fetchFaculties: async function () {
      try {
        this.metaLoading = true;
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
        this.metaLoading = false;
      }
    },
    fetchTerms: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({ path: "terms" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.terms = data.data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went wrong",
          position: "bottom-right",
        });
      } finally {
        this.metaLoading = false;
      }
    },
    selectAll: function(){
      const ids = this.students.map(student=>{
        return student.id
      })
      this.$emit('input', ids)
    },
     deselectAll: function(){  
      this.$emit('input', [])
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
};
</script>
<style scoped></style>
