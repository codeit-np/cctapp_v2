<template lang="">
  <el-dialog
    title="Edit Subject"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%"
  >
    <div class="row p-2 gy-2">
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
        <faculties-dropdown
          :loading.sync="loading"
          v-model="form.faculty_id"
          :hasNull="true"
        />
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
        <terms-dropdown
          :loading.sync="loading"
          v-model="form.term_id"
          :hasNull="true"
        />
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
      >Update Subject</el-button
    >
  </el-dialog>
</template>
<script>
import form from "vuejs-form";
import { doGet, doPost } from "../../../helpers/request";
import FacultiesDropdown from "@/components/Dropdowns/FacultiesDropDown.vue";
import TermsDropdown from "@/components/Dropdowns/TermsDropdown.vue";

export default {
  props: {
    value: Boolean,
    id: Number,
  },
  components:{
    FacultiesDropdown,
    TermsDropdown
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
      subject_types: [],
      loading: false,
      errors: {},
    };
  },
  mounted() {
    this.fetchSubject();
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
          method:"PUT",  
          body: this.form.all(),
          path: `subjects/${this.id}`,
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
    fetchSubject: async function () {
      try {
          
        if(!this.value || this.id==null){
              return;
        }
        this.loading = true;
        const response = await doGet({ path: `subjects/${this.id}` });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.form.title = data.data.title;
        this.form.code = data.data.code;
        this.form.faculty_id = data.data.faculty.id;
        this.form.term_id = data.data.term.id;
        this.form.subject_type_id = data.data.subject_type.id;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    value() {
      this.form.errors().forget();
      this.errors = {};
      this.fetchSubject();
    },
  },
};
</script>
<style scoped></style>
