<template lang="">
  <el-dialog
    title="Assign Subject to SQC"
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
        
        <el-button class="my-1" @click="fetchSubjects" type="primary">Search</el-button>
      </div>
    </el-card>

    <el-card v-loading="loading">
        <div class="container m-2">
            <div class="d-flex flex-wrap">
                <span class="d-block m-2 badge rounded-pill bg-light text-dark" v-for="subject in subjects" :key="subject.id">
                    <input type="checkbox" class="px-1" :id="subject.title" :value="subject.id" v-model="form.subject_ids">
                    <label :for="subject.title" class="px-1" >{{ subject.title }}</label>
                </span>
            </div>
        </div>
        <el-button class="my-1" @click="handleSubmit" type="primary">Assign Subjects</el-button>
    </el-card>
  </el-dialog>
</template>
<script>
import form from "vuejs-form";
import { doGet, doPost } from "../../../helpers/request";
export default {
  props: {
    value: Boolean,
    sqc_id:String,
  },
  data() {
    return {
      form: form({
        subject_ids: [],
      }),
      subjects: [],
      terms: [],
      genders: [],
      faculties: [],
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
    this.fetchFaculties();
    this.fetchSubjectTypes();
    this.fetchTerms();
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
          body: this.form.all(),
          path: `sqcs/${this.sqc_id}/subjects`,
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
    fetchSubjects: async function () {
      try {
        this.loading = true;
        this.form.subject_ids = [];
        const response = await doGet({
          path: "subjects",
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
