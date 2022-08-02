<template lang="">
  <el-dialog
    title="Remove Subject"
    :visible="value"
    @close="handleClose"
    width="90%"
  >
    <el-card v-loading="metaLoading">
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

        <faculties-drop-down v-model="faculty_id" :loading.sync="metaLoading"/>
       <terms-drop-down v-model="term_id" :loading.sync="metaLoading"/>
        
        
        <el-button class="my-1" @click="fetchSubjects" type="primary">Search</el-button>
      </div>
    </el-card>

    <el-card v-loading="loading">
        <div class="container m-2">
            <el-button class="my-1"  @click="selectAll" type="primary">Select All</el-button>
            <el-button class="my-1" @click="deselectAll" type="primary">Deselect All</el-button>
            <div class="d-flex flex-wrap">
                <span class="d-block m-2 badge rounded-pill bg-light text-dark" v-for="subject in subjects" :key="subject.id">
                    <input type="checkbox" class="px-1" :id="subject.title" :value="subject.id" v-model="form.subject_ids">
                    <label :for="subject.title" class="px-1" >{{ subject.title }}</label>
                </span>
            </div>
        </div>
        <el-button class="my-1" @click="handleSubmit" type="primary">Remove Subjects</el-button>
    </el-card>
  </el-dialog>
</template>
<script>
import form from "vuejs-form";
import { doGet, doPost } from "../../../helpers/request";
import FacultiesDropDown from '../../Dropdowns/FacultiesDropDown.vue'
import TermsDropDown from '../../Dropdowns/TermsDropdown.vue';
export default {
  props: {
    value: Boolean,
    student_id: String,
  },
   components:{
    FacultiesDropDown,
    TermsDropDown
  },
  data() {
    return {
      form: form({
        subject_ids: [],
      }),
      subjects: [],
      genders: [],
      subject_types: [],
      subject_type_id: null,
      faculty_id: null,
      term_id: null,
      loading: false,
      metaLoading: false,
      errors: {},
    };
  },
  mounted() {
    this.fetchSubjectTypes();
  },
  methods: {
    handleClose() {
      this.$emit("input", false);
    },
    handleSubmit: async function () {
      try {
        this.form.validate();
        if (this.form.errors().any()) {
          return;
        }
        this.loading = true;
        const response = await doPost({
          method: "DELETE",
          body: this.form.all(),
          path: `students/${this.student_id}/subjects`,
        });

        const data = await response.json();

        if (!response.ok) {
          this.errors = data.errors;
          throw { message: data.message };
        }

        this.$notify({
          title: "Success",
          message: data.message || "Action Was Successful",
          type: "success",
        });
        this.form.subject_ids = [];
        this.fetchSubjects();
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      } finally {
        this.loading = false;
      }
    },
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
    selectAll() {
      this.form.subject_ids = this.subjects.map((subject) => subject.id);
    },
    deselectAll() {
      this.form.subject_ids = [];
    },
    fetchSubjects: async function () {
      try {
        this.loading = true;
        this.form.subject_ids = [];
        const response = await doGet({
          path: `students/${this.student_id}/subjects`,
          query: {
            subject_type_id: this.subject_type_id,
            faculty_id: this.faculty_id,
            term_id: this.term_id,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.subjects = data.data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went wrong",
          position: "bottom-right",
        });
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    value() {
      this.form.subject_ids = [];
    },
  },
};
</script>
<style scoped></style>
