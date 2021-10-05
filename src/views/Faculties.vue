<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate" @success="fetchFaculties" />
    <edit v-model="openEdit" :id="activeID" @success="fetchFaculties" />
    <el-skeleton v-if="loading" :rows="10" animated />
    <el-card v-else>
      <div slot="header" class="clearfix">
        <span>Faculties</span>
        <el-button
          @click="openCreate = true"
          style="float: right; padding: 3px 0"
          type="text"
        >
          <i class="fa fa-plus" aria-hidden="true"></i> Add
        </el-button>
      </div>
      <table class="table table-sm table-bordered">
        <thead>
          <tr>
            <th width="5%">
              #
            </th>
            <th width="80%" class="text-center">
              Fiscal Year
            </th>
            <th width="15%">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(faculty, index) in faculties" :key="faculty.id">
            <td>
              {{ ++index }}
            </td>
            <td class="text-center">
              {{ faculty.title }}
            </td>
            <td>
              <el-button
                type="primary"
                class="mx-1"
                @click="handleOpenEdit(faculty.id)"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-popconfirm
                confirm-button-text='OK'
                cancel-button-text='No, Thanks'
                icon="el-icon-info"
                @confirm="handleDelete(faculty.id)"
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
    </el-card>
  </div>
</template>
<script>
import { doGet, doPost } from "../helpers/request";
import Create from "../components/sections/faculties/CreateFaculty.vue";
import Edit from "../components/sections/faculties/EditFaculty.vue";

export default {
  data() {
    return {
      openCreate: false,
      openEdit: false,
      activeID: null,
      faculties: [],
      loading: false,
    };
  },
  components: {
    Create,
    Edit,
  },
  methods: {
    fetchFaculties: async function () {
      try {
        this.loading = true;
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
        this.loading = false;
      }
    },
    handleOpenEdit(id) {
      this.activeID = id;
      this.openEdit = true;
    },
    handleDelete: async function(id){
      try{
        const response = await doPost({method:'DELETE', path:`faculties/${id}`});
        const data = await response.json();
        if(!response.ok){
          throw data;
        }
        this.$notify({
          title: "Success",
          message: data.message || "Action was successful",
          type: "success",
        });
        this.faculties = this.faculties.filter(faculty=> faculty.id !== id);
      }catch(err){
       this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      }
    },
  },
  mounted: function () {
    this.fetchFaculties();
  },
};
</script>
<style scoped></style>
