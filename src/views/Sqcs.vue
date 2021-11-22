<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate" @success="fetchSQCs" />
    <send-notifications v-model="openNotification" :user_ids="user_ids" />
    <el-skeleton v-if="loading" :rows="10" animated />
    <el-card v-else>
      <div slot="header" class="clearfix">
        <span>SQCs</span>
        <el-button
          @click="openCreate = true"
          style="float: right; padding: 3px 0"
          type="text"
        >
          <i class="fa fa-plus" aria-hidden="true"></i> Add
        </el-button>
        <el-button
          @click="openNotification = true"
          :user_ids="user_ids"
          style="float: right; padding: 3px"
          class="mx-1"
          type="text"
        >
          <i class="fa fa-microphone" aria-hidden="true"></i> Notification
        </el-button>
        <el-button
          @click="$router.push({ name: 'Pending SQCs' })"
          style="float: right; padding: 3px "
          class="px-4"
          type="text"
        >
          <i class="fa fa-hourglass-start" aria-hidden="true"></i> Pending SQCs  
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
            <th>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sqc, index) in sqcs" :key="sqc.id">
            <td>
              {{ ++index }}
            </td>
            <td class="text-center">
              {{ sqc.name }}
            </td>
            <td class="text-center">
              {{ sqc.mobile }}
            </td>
            <td class="text-center">
              {{ sqc.email }}
            </td>
            <td class="text-center">
                <i class="fa fa-check-circle text-success" v-if="sqc.verified" aria-hidden="true"></i>
                <i class="fa fa-times-circle text-danger" v-else aria-hidden="true"></i>
            </td>

            <td>
              <el-button
                type="primary"
                class="mx-1"
                @click="handleOpenEdit(sqc.id)"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-popconfirm
                confirm-button-text="OK"
                cancel-button-text="No, Thanks"
                icon="el-icon-info"
                @confirm="handleDelete(sqc.id)"
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
import Create from "../components/sections/sqcs/CreateSqc.vue";
import SendNotifications from '../components/sections/notifications/SendNotifications.vue'
export default {
  data() {
    return {
      openCreate: false,
      openNotification:false,
      openEdit: false,
      activeID: null,
      sqcs: [],
      loading: false,
    };
  },
  components: {
    Create,
    SendNotifications
  },
  computed:{
    user_ids(){
      return this.sqcs.map((sqc)=>sqc.id)
    }
  },
  methods: {
    fetchSQCs: async function() {
      try {
        this.loading = true;
        const response = await doGet({ path: "sqcs"});
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.sqcs = data.data;
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
       this.$router.push({ name: 'SQC', params: { id: id } })
    },
    handleDelete: async function(id) {
      try {
        const response = await doPost({
          method: "DELETE",
          path: `sqcs/${id}`,
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
        this.sqcs = this.sqcs.filter((sqc) => sqc.id !== id);
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      }
    },
  },
  mounted: function() {
    this.fetchSQCs();
  },
};
</script>
<style scoped></style>
