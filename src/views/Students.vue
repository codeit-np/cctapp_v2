<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate"  />
    <post-csv v-model="openLoad" path="students/load" title="Load Students"/>
    <el-card v-loading="metaLoading">
      <div class="d-flex space-between justify-content-between flex-column flex-lg-row px-4">
        <el-select class="my-1" v-model="batch_id" placeholder="Select Batch">
          <el-option label="All Batches" :value="null"> </el-option>
          <el-option
            v-for="batch in batches"
            :key="batch.id"
            :label="batch.year"
            :value="batch.id"
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

        <el-button class="my-1" @click="fetchStudents" type="primary">Search</el-button>
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
          <tr v-for="(student, index) in students" :key="student.id">
            <td>
              {{ ++index }}
            </td>
            <td class="text-center">
              {{ student.name }}
            </td>
            <td class="text-center">
              {{ student.mobile }}
            </td>
            <td class="text-center">
              {{ student.gender }}
            </td>
            <td class="text-center">
              {{ student.status }}
            </td>
            <td class="text-center">
              {{ student.batch.year }}
            </td>
            <td class="text-center">
              {{ student.term.title }}
            </td>
            <td class="text-center">
              {{ student.faculty.title }}
            </td>
            <td>
              <el-button
                type="primary"
                class="mx-1"
                @click="handleOpenEdit(student.id)"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-popconfirm
                confirm-button-text="OK"
                cancel-button-text="No, Thanks"
                icon="el-icon-info"
                @confirm="handleDelete(student.id)"
                icon-color="red"
                title="Are you sure to delete this?"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  class="mx-1"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-popconfirm>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </el-card>
  </div>
</template>
<script>
import { doGet, doPost } from "../helpers/request";
import Create from "../components/sections/students/CreateStudent.vue";
// import Edit from "../components/sections/batches/EditBatch.vue";
import PostCsv from '../components/PostCsv.vue';

export default {
  data() {
    return {
      openCreate: false,
      openEdit: false,
      openLoad:false,
      activeID: null,
      students: [],
      batches: [],
      terms: [],
      faculties: [],
      batch_id: null,
      faculty_id: null,
      term_id: null,
      loading: false,
      metaLoading: false,
     
    };
  },
  components: {
    Create,
    PostCsv
    // Edit,
  },
  methods: {
    fetchStudents: async function() {
      try {
        this.loading = true;
        const response = await doGet({ path: "students",query:{faculty_id: this.faculty_id,term_id: this.term_id, batch_id: this.batch_id} });
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
    fetchBatches: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({ path: "batches" });
        const data = await response.json();
        if(!response.ok){
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
        this.metaLoading = false;
      }
    },
    fetchFaculties: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({ path: "faculties" });
        const data = await response.json();
        if(!response.ok){
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
        if(!response.ok){
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
    handleOpenEdit(id) {
      this.$router.push({ name: 'Student', params: { id: id } })
    },
    handleDelete: async function(id) {
      try {
        const response = await doPost({
          method: "DELETE",
          path: `students/${id}`,
        });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.$notify({
          title: "Success",
          message: data.message || "Action was successful",
          type: "success",
        });
        this.students = this.students.filter((student) => student.id !== id);
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      }
    },
  },
  mounted: function() {
      this.fetchTerms();
      this.fetchFaculties();
      this.fetchBatches();
    // this.fetchStudents();
  },
};
</script>
<style scoped></style>
