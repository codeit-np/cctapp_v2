<template lang="">
  <el-dialog
    title="Create Student"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%"
  >
    <div class="row p-2">
      <div class="col-md-6">
        <el-input placeholder="Name" label="Name" v-model="form.name" />
        <div>
          <small class="text-danger" v-if="form.errors().has('name')">
            {{ form.errors().get("name") }}
          </small>

          <small class="text-danger">
            {{ errors.name }}
          </small>
        </div>
      </div>

      <div class="col-md-6">
        <el-input
          placeholder="Mobile"
          label="Mobile"
          type="tel"
          v-model="form.mobile"
        />
        <div>
          <small class="text-danger" v-if="form.errors().has('mobile')">
            {{ form.errors().get("mobile") }}
          </small>

          <small class="text-danger">
            {{ errors.mobile }}
          </small>
        </div>
      </div>
       <div class="col-md-6">
        <el-input
          placeholder="Roll No"
          label="Roll No"
          type="number"
          v-model="form.roll_no"
        />
        <div>
          <small class="text-danger" v-if="form.errors().has('roll_no')">
            {{ form.errors().get("roll_no") }}
          </small>

          <small class="text-danger">
            {{ errors.roll_no }}
          </small>
        </div>
      </div>

    </div>

    <div class="row p-2 gy-2">
      <div class="col-md-3">
        <el-select
          class="my-1"
          v-model="form.batch_id"
          placeholder="Select Batch"
        >
          <el-option
            v-for="batch in batches"
            :key="batch.id"
            :label="batch.year"
            :value="batch.id"
          >
          </el-option>
        </el-select>

        <div>
          <small class="text-danger" v-if="form.errors().has('batch_id')">
            {{ form.errors().get("batch_id") }}
          </small>

          <small class="text-danger">
            {{ errors.batch_id }}
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
      <div class="col-md-3">
        <el-radio-group v-model="form.gender">
          <el-radio
            v-for="gender in genders"
            :key="gender.label"
            :label="gender.label"
            :value="gender.value"
          ></el-radio>
        </el-radio-group>
        <div>
          <small class="text-danger" v-if="form.errors().has('gender')">
            {{ form.errors().get("gender") }}
          </small>

          <small class="text-danger">
            {{ errors.gender }}
          </small>
        </div>
      </div>
    </div>

    <el-button type="primary" class="my-2" @click="handleSubmit" plain
      >Add Student</el-button
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
        name: "",
        mobile: "",
        roll_no: null,
        batch_id: null,
        faculty_id: null,
        term_id: null,
        gender: null,
      })
        .rules({
          name: "required",
          roll_no: "required|numeric",
        //   mobile: ["digits:10",],
          batch_id: "required",
          faculty_id: "required",
          term_id: "required",
          gender: "required",
        })
        .messages({
          "batch_id.required": "Batch is required",
          "faculty_id.required": "Faculty is required",
          "term_id.required": "Term is required",
        }),
      terms: [],
      genders: [],
      faculties: [],
      batches: [],
      loading: false,
      errors: {},
    };
  },
  mounted() {
    this.fetchFaculties();
    this.fetchBatches();
    this.fetchTerms();
    this.fetchGenders();
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
          path: "students",
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
    fetchBatches: async function () {
      try {
        this.loading = true;
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
    fetchGenders: async function () {
      try {
        this.loading = true;
        const response = await doGet({ path: "genders" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.genders = data;
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
      this.form.name="",
      this.form.mobile="",  
      this.form.errors().forget();
      this.errors = {};
    },
  },
};
</script>
<style scoped></style>
