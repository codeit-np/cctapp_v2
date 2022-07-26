<template lang="">
  <div
  
  >
   <h3 class="py-1"> Subjects</h3>
    <el-card v-loading="metaLoading">
      <h5>Filters</h5>
      <div class="d-flex space-between justify-content-between flex-column flex-lg-row px-4">
        
        <el-select class="my-1" v-model="subject_type_id" placeholder="Select Subject Type">
          <el-option label="All Subject Types" :value="null"> </el-option>
          <el-option
            v-for="subject_type in subject_types"
            :key="subject_type.id"
            :label="subject_type.title"
            :value="subject_type.id"
          >
          </el-option>
        </el-select>

        <faculties-dropdown
          :loading.sync="metaLoading"
          v-model="faculty_id"
          :hasNull="true"
        />
        <terms-dropdown
          :loading.sync="metaLoading"
          v-model="term_id"
          :hasNull="true"
        />
        
      </div>
    </el-card>

    <el-card v-loading="loading">
      <el-button class="my-1" v-if="filteredSubjects({term_id,faculty_id,subject_type_id}).length>0" @click="selectAll" type="primary">Select All</el-button>
      <el-button class="my-1" v-if="filteredSubjects({term_id,faculty_id,subject_type_id}).length>0" @click="deselectAll" type="primary">Deselect All</el-button>
        <div class="container m-2">
            <div class="d-flex flex-wrap">
                <span class="d-block m-2 badge rounded-pill bg-light text-dark" v-for="subject in filteredSubjects({term_id,faculty_id,subject_type_id})" :key="subject.id">
                    <input type="checkbox" class="px-1" :id="subject.title" :value="subject.id" v-model="model">
                    <label :for="subject.title" class="px-1" >{{ subject.title }}</label>
                </span>
            </div>
        </div>
        
    </el-card>
  </div>
</template>
<script>
import { doGet } from "../../../helpers/request";
import FacultiesDropdown from "../../Dropdowns/FacultiesDropDown.vue";
import TermsDropdown from "../../Dropdowns/TermsDropdown.vue";
import {mapState,mapGetters,mapActions} from 'vuex'

export default {
  props: {
    value: Array,
  },
  components:{
    FacultiesDropdown,
    TermsDropdown
  },
  data() {
    return {
      genders: [],
      subject_types: [],
      subject_type_id: null,
      faculty_id: null,
      term_id: null,
      metaLoading: false,
      errors: {},
    };
  },
  mounted() {
    this.fetchSubjectTypes();
    this.load();
  },
  methods: {
    ...mapActions('subjects',[
      'load',
    ]),
    fetchSubjectTypes: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({ path: "subjecttypes" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.subject_types = data.data;
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
    selectAll: function(){
      const ids = this.filteredSubjects({term_id: this.term_id,faculty_id: this.faculty_id,subject_type_id: this.subject_type_id}).map(subject=>{
        return subject.id
      })
      this.$emit('input', ids)
    },
     deselectAll: function(){  
      this.$emit('input', [])
    }
  },
  computed: {
    model: {
      get() { return this.value },
      set(newValue) { this.$emit('input', newValue)}
    },
    ...mapState('subjects',{
      loading: state => state.loading
    }),
    ...mapGetters('subjects',[
        'filteredSubjects'
    ]),
  },
};
</script>
<style scoped></style>
