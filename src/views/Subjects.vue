<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate" />
    <edit v-model="openEdit" :id="activeID" />
    <post-csv v-model="openLoad" path="subjects/load" title="Load Subjects"/>
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
        <el-button class="my-1" @click="fetchSubjects" type="primary">Search</el-button>
      </div>
    </el-card>

    <el-skeleton v-if="loading" :rows="10" animated />
    <el-card v-else>
      <div slot="header" class="clearfix">
        <span>Subjects</span>
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
              Code
            </th>
            <th class="text-center">
              Title
            </th>
            <th class="text-center">
              Subject Type
            </th>
            <th class="text-center">
              Faculty
            </th>
            <th class="text-center">
              Term
            </th>
            <th>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(subject, index) in subjects" :key="subject.id">
            <td>
              {{ ++index }}
            </td>
            <td class="text-center">
              {{ subject.code }}
            </td>
            <td class="text-center">
              {{ subject.title }}
            </td>
           
            <td class="text-center">
              {{ subject.subject_type.title }}
            </td>
            <td class="text-center">
              {{ subject.faculty.title }}
            </td>
            <td class="text-center">
              {{ subject.term.title }}
            </td>
            <td>
              <el-button
                type="primary"
                class="mx-1"
                @click="handleOpenEdit(subject.id)"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-popconfirm
                confirm-button-text="OK"
                cancel-button-text="No, Thanks"
                icon="el-icon-info"
                @confirm="handleDelete(subject.id)"
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
import Create from "../components/sections/subjects/CreateSubject.vue";
import Edit from "../components/sections/subjects/EditSubject.vue";
import PostCsv from '../components/PostCsv.vue';
import FacultiesDropdown from "../components/Dropdowns/FacultiesDropDown.vue";
import TermsDropdown from "../components/Dropdowns/TermsDropdown.vue";
export default {
  data() {
    return {
      openCreate: false,
      openLoad: false,
      openEdit: false,
      activeId: null,
      activeID: null,
      subjects: [],
      subject_types: [],
      subject_type_id: null,
      faculty_id: null,
      term_id: null,
      loading: false,
      metaLoading: false,
    };
  },
  components: {
    Create,
    Edit,
    PostCsv,
    FacultiesDropdown,
    TermsDropdown,
  },
  methods: {
    handleOpenEdit(id) {
      this.activeID = id;
      this.openEdit = true;
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
   
    fetchSubjects: async function () {
      try {
        this.loading = true;
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
    handleDelete: async function (id) {
      try {
        const response = await doPost({
          method: "DELETE",
          path: `subjects/${id}`,
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
        this.subjects = this.subjects.filter((subject) => subject.id !== id);
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      }
    },
  },
  mounted: function () {
    this.fetchSubjectTypes();
  },
};
</script>
<style scoped></style>
