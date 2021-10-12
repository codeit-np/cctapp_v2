<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate" @success="fetchTeachers" />
    <edit v-model="openEdit" :id="activeID" />

    <el-skeleton v-if="loading" :rows="10" animated />
    <el-card v-else>
      <div slot="header" class="clearfix">
        <span>Teachers</span>
        <el-button
          @click="openCreate = true"
          style="float: right; padding: 3px 0"
          type="text"
        >
          <i class="fa fa-plus" aria-hidden="true"></i> Add
        </el-button>
        <el-button
          @click="$router.push({ name: 'Pending Teachers' })"
          style="float: right; padding: 3px 0"
          class="px-4"
          type="text"
        >
          <i class="fa fa-hourglass-start" aria-hidden="true"></i> Pending Teachers  
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
              Email
            </th>
            <th class="text-center">
              Verified
            </th>
            <th class="text-center">
              Admin
            </th>
            <th>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(teacher, index) in teachers" :key="teacher.id">
            <td>
              {{ ++index }}
            </td>
            <td class="text-center">
              {{ teacher.name }}
            </td>
            <td class="text-center">
              {{ teacher.mobile }}
            </td>
            <td class="text-center">
              {{ teacher.email }}
            </td>
            <td class="text-center">
                <i class="fa fa-check-circle text-success" v-if="teacher.verified" aria-hidden="true"></i>
                <i class="fa fa-times-circle text-danger" v-else aria-hidden="true"></i>
            </td>
            <td class="text-center">
              <i class="fa fa-check-circle text-success" v-if="teacher.is_admin" aria-hidden="true"></i>
                <i class="fa fa-times-circle text-danger" v-else aria-hidden="true"></i>
            </td>
            
            <td>
              <el-button
                type="primary"
                class="mx-1"
                @click="handleOpenEdit(teacher.id)"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-popconfirm
                confirm-button-text="OK"
                cancel-button-text="No, Thanks"
                icon="el-icon-info"
                @confirm="handleDelete(teacher.id)"
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
import Create from "../components/sections/teachers/CreateTeacher.vue";
import Edit from "../components/sections/teachers/EditTeacher.vue";

export default {
  data() {
    return {
      openCreate: false,
      openEdit: false,
      activeID: null,
      teachers: [],
      loading: false,
    };
  },
  components: {
    Create,
    Edit,
  },
  methods: {
    fetchTeachers: async function() {
      try {
        this.loading = true;
        const response = await doGet({ path: "teachers"});
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.teachers = data.data;
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
    handleDelete: async function(id) {
      try {
        const response = await doPost({
          method: "DELETE",
          path: `teachers/${id}`,
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
        this.teachers = this.teachers.filter((teacher) => teacher.id !== id);
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      }
    },
  },
  mounted: function() {
    this.fetchTeachers();
  },
};
</script>
<style scoped></style>
