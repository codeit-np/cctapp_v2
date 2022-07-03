<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate"  />
    <post-csv v-model="openLoad" path="students/load" title="Load Students"/>
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

        <el-button class="my-1" @click="fetchStudents" type="primary">Search</el-button>
      </div>
    </el-card>
    <el-skeleton v-if="loading" :rows="10" animated />
    <el-card v-else>
      <div slot="header" class="clearfix">
        <span>Students</span>
        <el-button
          @click="openCreate = true"
          style="float: right; padding: 3px 0"
          type="text"
        >
          <i class="fa fa-plus" aria-hidden="true"></i> Add
        </el-button>

        <el-button
          @click="openLoad = true"
          style="float: right; padding: 3px 0"
          type="text"
        >
         <i class="fa fa-upload" aria-hidden="true"></i> Load
        </el-button>

      </div>
      <div class="table-responsive">
       
      <table class="table table-sm table-bordered">
        <thead>
          <tr>
            <th>
              #
            </th>
            <th class="text-center">
              Name
            </th>
            <th class="text-center">
              Mobile
            </th>
             <th class="text-center">
              Roll No
            </th>
            <th class="text-center">
              Gender
            </th>
            <th class="text-center">
              Status
            </th>
            <th class="text-center">
              Batch
            </th>
            <th class="text-center">
              Term
            </th>
            <th class="text-center">
              Faculty
            </th>
            <th>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <student-row  v-for="(student,index) in students" :student="student" :students.sync="students" :index="index" :key="student.id"/>
        </tbody>
      </table>
      </div>
    </el-card>
  </div>
</template>
<script>
import { doGet } from "../helpers/request";
import Create from "../components/sections/students/CreateStudent.vue";
import StudentRow from '../components/sections/students/StudentRow.vue'
import PostCsv from '../components/PostCsv.vue';

export default {
  data() {
    return {
      openCreate: false,
      openEdit: false,
      openLoad:false,
      activeID: null,
      students: [],
      batches: [],
      terms: [],
      faculties: [],
      batch_id: null,
      faculty_id: null,
      term_id: null,
      loading: false,
      metaLoading: false,
     
    };
  },
  components: {
    Create,
    PostCsv,
    StudentRow
    // Edit,
  },
  methods: {
    fetchStudents: async function() {
      try {
        this.loading = true;
        const response = await doGet({ path: "students",query:{faculty_id: this.faculty_id,term_id: this.term_id, batch_id: this.batch_id} });
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
        if(!response.ok){
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
        if(!response.ok){
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
        if(!response.ok){
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
    
  },
  mounted: function() {
      this.fetchTerms();
      this.fetchFaculties();
      this.fetchBatches();
    // this.fetchStudents();
  },
};
</script>
<style scoped></style>
