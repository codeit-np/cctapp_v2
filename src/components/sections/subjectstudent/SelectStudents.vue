<template lang="">
  <div>
      <h3 class="py-1">Students</h3>
      <el-card v-loading="metaLoading">
      <h5>Filters</h5>
      <div class="d-flex space-between justify-content-between flex-column flex-lg-row px-4">
        <batches-drop-down v-model="batch_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>
        <faculties-drop-down v-model="faculty_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>
        <terms-drop-down v-model="term_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>
        <el-button class="my-1" @click="reload" type="primary">Search</el-button>
      </div>
    </el-card>
    <el-card v-loading="loading">
      <el-button
        class="my-1"
        v-if="students.length > 0"
        @click="selectAll"
        type="primary"
        >Select All</el-button
      >
      <el-button
        class="my-1"
        v-if="students.length > 0"
        @click="deselectAll"
        type="primary"
        >Deselect All</el-button
      >
      <div class="container m-2">
        <div class="d-flex flex-wrap">
          <span
            class="d-block m-2 badge rounded-pill bg-light text-dark"
            v-for="student in students"
            :key="student.id"
          >
            <input
              type="checkbox"
              class="px-1"
              :id="student.name"
              :value="student.id"
              v-model="model"
            />
            <label :for="student.name" class="px-1">
              <span
                v-if="student.roll_no !== null && student.roll_no !== undefined"
              >
                {{ student.roll_no }} -
              </span>
              {{ student.name }}</label
            >
          </span>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
// import { doGet } from "../../../helpers/request";
import BatchesDropDown from '../../Dropdowns/BatchesDropDown.vue'
import FacultiesDropDown from '../../Dropdowns/FacultiesDropDown.vue'
import TermsDropDown from '../../Dropdowns/TermsDropdown.vue'
import {mapState,mapActions,mapMutations} from 'vuex'
export default {
  props: {
    value: Array,
  },
  data() {
    return {
      metaLoading: false,
      errors: {},
    };
  },
  components:{
    BatchesDropDown,
    FacultiesDropDown,
    TermsDropDown,
  },
  methods: {
     ...mapActions('students',[
      'reload'
    ]),
    ...mapMutations('students',['setFaculty','setTerm','setBatch']),
    selectAll: function () {
      const ids = this.students.map((student) => {
        return student.id;
      });
      this.$emit("input", ids);
    },
    deselectAll: function () {
      this.$emit("input", []);
    },
  },
  computed: {
    ...mapState('students',{
      active_faculty: state=>state.active_faculty,
      active_batch: state=>state.active_batch,
      active_term: state=>state.active_term,
      loading: state=>state.loading,
      students: state=>state.students
    }),
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
