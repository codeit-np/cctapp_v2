<template lang="">
  <section>
    <el-card v-loading="metaLoading">
      <div
        class="d-flex space-between justify-content-between flex-column flex-lg-row px-4"
      >
        <batches-dropdown
          :loading.sync="metaLoading"
          v-model="batch_id"
          :hasNull="true"
        />
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
       <div class="form-check">
         <label class="form-check-label">
           <input type="checkbox" class="form-check-input" v-model="all_students"  >
           include Past Students
         </label>
       </div>
        <el-button class="my-1" @click="fetchStudents" type="primary"
          >Search</el-button
        >
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
              :id="student.id"
              :value="student.id"
              v-model="student_ids"
            />
            <label :for="student.id" class="px-1">
              {{ student.name }} -
              {{ student.faculty.title }}
              - {{ student.term.title }} - {{ student.batch.year }}
              <span v-if="all_students">-{{student.status}}</span>
            </label>
          </span>
        </div>
      </div>
      <div class="container d-flex">
        <terms-dropdown
          :loading.sync="metaLoading"
          v-model="updated_term_id"
          :hasNull="true"
        />
        <el-select
          class="mx-4"
          v-model="student_status"
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
        <el-button type="primary" @click="updateTerm">
          Update
        </el-button>
      </div>
    </el-card>
  </section>
</template>

<script>
import BatchesDropdown from "../components/Dropdowns/BatchesDropDown.vue";
import FacultiesDropdown from "../components/Dropdowns/FacultiesDropDown.vue";
import TermsDropdown from "../components/Dropdowns/TermsDropdown.vue";
import { doGet, doPost} from "../helpers/request";

export default {
  components: {
    BatchesDropdown,
    FacultiesDropdown,
    TermsDropdown,
  },
  data() {
    return {
      all_students: false,
      updated_term_id: null,
      batch_id: null,
      faculty_id: null,
      term_id: null,
      metaLoading: false,
      loading: false,
      students: [],
      student_ids: [],
      student_status: null,
      statuses: [],
      actionLoading: false,
    };
  },
  mounted() {
    this.fetchStatuses();
  },
  methods: {
    fetchStudents: async function () {
      try {
        this.loading = true;
        const query = {
            faculty_id: this.faculty_id,
            term_id: this.term_id,
            batch_id: this.batch_id,
          }
          if(this.all_students){
            query['all_students'] = true
          }
          
        const response = await doGet({
          path: "students",
          query: query,
        });
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
    selectAll: function () {
      const ids = this.students.map((student) => {
        return student.id;
      });
      this.student_ids = ids;
    },
    deselectAll: function () {
      this.student_ids = [];
    },
    fetchStatuses: async function () {
      try {
        this.actionLoading = true;
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
        this.actionLoading = false;
      }
    },
    updateTerm: async function() {
      this.actionLoading = true;
      try {
        const response = await doPost({method:'PUT',path:'students/bulk-update' ,body:{
          student_ids: this.student_ids,
          term_id: this.updated_term_id,
          status: this.student_status
        }})
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.$notify({
          title: "Success",
          message: data.message || "Students Updated",
          type: "success",
        });
      } catch (error) {
         this.$notify.error({
          title: "Error",
          message: error.message || "Something went wrong",
          position: "bottom-right",
        });
      }finally{
        this.actionLoading= false;
      }
    }
  },
};
</script>
<style lang=""></style>
