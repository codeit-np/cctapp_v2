<template lang="">
  <div>
    <assign v-model="openAssign" :student_id="id" />
    <remove v-model="openRemove" :student_id="id" />
    <!-- <el-skeleton v-if="loading" :rows="10" animated /> -->
    <el-main v-loading="loading">
      <h4>Edit Student</h4>
      <div class="row p-2 gy-2">
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

          <batches-drop-down class="my-1" v-model="form.batch_id" :loading.sync="loading" :hasNull="false" />
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
          <faculties-drop-down class="my-1" v-model="form.faculty_id" :loading.sync="loading" :hasNull="false" />
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
          <terms-drop-down class="my-1" v-model="form.term_id" :loading.sync="loading" :hasNull="false" />
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
          <div>Gender: </div>
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

        <div class="col-md-3">
          <el-select
            class="my-1"
            v-model="form.student_status"
            placeholder="Select Status"
          >
            <el-option
              v-for="status in statuses"
              :key="status.label"
              :label="status.label"
              :value="status.value"
            >
            </el-option>
          </el-select>
          <div>
            <small
              class="text-danger"
              v-if="form.errors().has('student_status')"
            >
              {{ form.errors().get("student_status") }}
            </small>

            <small class="text-danger">
              {{ errors.student_status }}
            </small>
          </div>
        </div>
      </div>

      <el-button type="primary" v-loading="submitting" class="m-2" @click="handleSubmit" plain
        >Update Student</el-button
      >

       <el-button
          @click="openAssign = true"
          style=" padding: 3px 0"
          type="text"
        >
          <i class="fa fa-plus" aria-hidden="true"></i> Assign Subject
        </el-button>

         <el-button
          @click="openRemove = true"
          style=" padding: 3px 0"
          type="text"
          class="text-danger"
        >
          <i class="fa fa-minus" aria-hidden="true"></i> Remove Subject
        </el-button>
    </el-main>
  </div>
</template>
<script>
import form from "vuejs-form";
import { doGet, doPost } from "../helpers/request";
import AssignSubject from "../components/sections/students/AssignSubject.vue"
import RemoveSubject from "../components/sections/students/RemoveSubject.vue"
import BatchesDropDown from '../components/Dropdowns/BatchesDropDown.vue'
import FacultiesDropDown from '../components/Dropdowns/FacultiesDropDown.vue'
import TermsDropDown from '../components/Dropdowns/TermsDropdown.vue'

export default {
  props: {
    value: Boolean,
  },
  components:{
    assign: AssignSubject,
    remove: RemoveSubject,
    BatchesDropDown,
    FacultiesDropDown,
    TermsDropDown,
  },
  data() {
    return {
      form: form({
        name: "",
        mobile: "",
        batch_id: null,
        faculty_id: null,
        roll_no: null,
        term_id: null,
        gender: null,
        student_status: null,
      })
        .rules({
          name: "required",
          roll_no: "required|numeric",
          //   mobile: ["digits:10",],
          batch_id: "required",
          faculty_id: "required",
          term_id: "required",
          gender: "required",
          student_status: "required",
        })
        .messages({
          "batch_id.required": "Batch is required",
          "faculty_id.required": "Faculty is required",
          "term_id.required": "Term is required",
          "student_status.required": "Student Status is required",
        }),
      genders: [],
      statuses: [],
      loading: false,
      submitting: false,
      errors: {},
      openAssign:false,
      openRemove: false,
      id: this.$route.params.id,
    };
  },
  mounted() {
    this.fetchStudent();
    this.fetchGenders();
    this.fetchStatuses();
  },
  methods: {
    handleSubmit: async function() {
      try {
        this.form.validate();
        if (this.form.errors().any()) {
          return;
        }
        this.submitting = true;
        const response = await doPost({
          method: "PUT",
          body: this.form.all(),
          path: `students/${this.id}`,
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

      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      } finally {
        this.submitting = false;
      }
    },
    fetchBatches: async function() {
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
    fetchFaculties: async function() {
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
    fetchTerms: async function() {
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
    fetchGenders: async function() {
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
    fetchStatuses: async function() {
      try {
        this.loading = true;
        const response = await doGet({ path: "studentstatus" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.statuses = data;

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
    fetchStudent: async function() {
      try {
        this.loading = true;
        const response = await doGet({ path: `students/${this.id}` });
        const data = await response.json();
       
        if (!response.ok) {
          throw data;
        }
        this.form.name = data.data.name;        
        this.form.mobile = data.data.mobile;        
        this.form.gender = data.data.gender;        
        this.form.student_status = data.data.student_status;        
        this.form.faculty_id = data.data.faculty.id;        
        this.form.batch_id = data.data.batch.id;        
        this.form.term_id = data.data.term.id; 
        this.form.roll_no = data.data.roll_no; 

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
  watch: {},
};
</script>
<style scoped></style>
