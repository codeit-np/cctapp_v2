<template lang="">
  <el-dialog
    title="Create Subject"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%"
  >
    <div class="row p-2">
      <div class="col-md-6">
        <el-input placeholder="Title" label="Title" v-model="form.title" />
        <div>
          <small class="text-danger" v-if="form.errors().has('title')">
            {{ form.errors().get("title") }}
          </small>

          <small class="text-danger">
            {{ errors.title }}
          </small>
        </div>
      </div>
        <div class="col-md-6">
        <el-input placeholder="Code" label="Code" v-model="form.code" />
        <div>
          <small class="text-danger" v-if="form.errors().has('code')">
            {{ form.errors().get("code") }}
          </small>

          <small class="text-danger">
            {{ errors.code }}
          </small>
        </div>
      </div>
    </div>

    <div class="row p-2 gy-2">
      <div class="col-md-3">
        <el-select
          class="my-1"
          v-model="form.subject_type_id"
          placeholder="Select Subject Type"
        >
          <el-option
            v-for="subject_type in subject_types"
            :key="subject_type.id"
            :label="subject_type.title"
            :value="subject_type.id"
          >
          </el-option>
        </el-select>

        <div>
          <small class="text-danger" v-if="form.errors().has('subject_type_id')">
            {{ form.errors().get("subject_type_id") }}
          </small>

          <small class="text-danger">
            {{ errors.subject_type_id }}
          </small>
        </div>
      </div>

      <div class="col-md-3">
        <el-select
          class="my-1"
          v-model="form.faculty_id"
          placeholder="Select Faculty"
        >
          <el-option
            v-for="faculty in faculties"
            :key="faculty.id"
            :label="faculty.title"
            :value="faculty.id"
          >
          </el-option>
        </el-select>
        <div>
          <small class="text-danger" v-if="form.errors().has('faculty_id')">
            {{ form.errors().get("faculty_id") }}
          </small>

          <small class="text-danger">
            {{ errors.faculty_id }}
          </small>
        </div>
      </div>
      <div class="col-md-3">
        <el-select
          class="my-1"
          v-model="form.term_id"
          placeholder="Select Term"
        >
          <el-option
            v-for="term in terms"
            :key="term.id"
            :label="term.title"
            :value="term.id"
          >
          </el-option>
        </el-select>
        <div>
          <small class="text-danger" v-if="form.errors().has('term_id')">
            {{ form.errors().get("term_id") }}
          </small>

          <small class="text-danger">
            {{ errors.term_id }}
          </small>
        </div>
      </div>
    </div>

    <el-button type="primary" class="my-2" @click="handleSubmit" plain
      >Add Subject</el-button
    >
  </el-dialog>
</template>
<script>
import form from "vuejs-form";
import { doGet, doPost } from "../../../helpers/request";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      form: form({
        title: "",
        code: "",
        subject_type_id: null,
        faculty_id: null,
        term_id: null,
      })
        .rules({
          title: "required",
          code: "required",
          subject_type_id: "required",
          faculty_id: "required",
          term_id: "required",
        })
        .messages({
          "subject_type_id.required": "Subject Type is required",
          "faculty_id.required": "Faculty is required",
          "term_id.required": "Term is required",
        }),
      terms: [],
      faculties: [],
      subject_types: [],
      loading: false,
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
          path: "subjects",
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

        this.$emit("success");
        this.handleClose();
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
        this.loading = true;
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
        this.loading = false;
      }
    },
    fetchFaculties: async function () {
      try {
        this.loading = true;
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
        this.loading = false;
      }
    },
    fetchTerms: async function () {
      try {
        this.loading = true;
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
        this.loading = false;
      }
    },
  },
  watch: {
    value() {
      this.form.title="",
      this.form.errors().forget();
      this.errors = {};
    },
  },
};
</script>
<style scoped></style>
