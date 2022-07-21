<template lang="">
  <div class="container-fluid">

    <create v-model="openCreate"  />
    <post-csv v-model="openLoad" path="students/load" title="Load Students"/>
    <el-card v-loading="metaLoading">
      <div class="d-flex space-between justify-content-between flex-column flex-lg-row px-4">
        
        <batches-drop-down v-model="batch_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>
        <faculties-drop-down v-model="faculty_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>
        <terms-drop-down v-model="term_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>

        <el-button class="my-1" @click="reload" type="primary">Search</el-button>
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
          <student-row  v-for="(student,index) in displayed_students" :student="student" :students.sync="displayed_students" :index="index" :key="student.id"/>
        </tbody>
      </table>
      </div>
    </el-card>
  </div>
</template>
<script>
import Create from "../components/sections/students/CreateStudent.vue";
import StudentRow from '../components/sections/students/StudentRow.vue'
import PostCsv from '../components/PostCsv.vue';
import BatchesDropDown from '../components/Dropdowns/BatchesDropDown.vue'
import FacultiesDropDown from '../components/Dropdowns/FacultiesDropDown.vue'
import TermsDropDown from '../components/Dropdowns/TermsDropdown.vue'
import {mapState, mapActions, mapMutations} from 'vuex';

export default {
  data() {
    return {
      openCreate: false,
      openEdit: false,
      openLoad:false,
      activeID: null,
      metaLoading: false,
     
    };
  },
  components: {
    Create,
    PostCsv,
    StudentRow,
    BatchesDropDown,
    FacultiesDropDown,
    TermsDropDown,
    // Edit,
  },
  methods: {
    ...mapActions('students',[
      'reload'
    ]),
    ...mapMutations('students',['setFaculty','setTerm','setBatch'])
  },
  mounted: function() {
      // this.fetchTerms();
      // this.fetchFaculties();
      // this.fetchBatches();
    // this.fetchStudents();
  },
  computed:{
    ...mapState('students',{
      active_faculty: state=>state.active_faculty,
      active_batch: state=>state.active_batch,
      active_term: state=>state.active_term,
      loading: state=>state.loading,
      students: state=>state.students
    }),
    displayed_students:{
      get(){
        return this.students
      }, 
      set(){

      }
    },
    batch_id:{
      get(){
        return this.active_batch
      },
      set(value){
        this.setBatch(value)
      }
    },
    faculty_id:{
      get(){
        return this.active_faculty
      },
      set(value){
        this.setFaculty(value)
      }
    },
    term_id:{
      get(){
        return this.active_term
      },
      set(value){
        this.setTerm(value)
      }
    },
  },

};
</script>
<style scoped></style>
