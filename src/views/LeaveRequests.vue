<template lang="en">
   <div class="container-fluid">
    <h3 class="p-2">Leave Requests</h3>
     <edit-leave v-model="openEdit"  :id="request_id" />
      <el-card v-loading="metaLoading">
        <h5>Filters</h5>
      <div class="d-flex flex-wrap space-between justify-content-between flex-column flex-lg-row px-4">
        
        <el-select class="my-1" v-model="teacher_id" placeholder="Select Teacher">
          <el-option label="All Teachers" :value="null"> </el-option>
          <el-option
            v-for="teacher in teachers"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          >
          </el-option>
        </el-select>

        <el-select class="my-1" v-model="status" placeholder="Select Status">
          <el-option label="All" :value="null"> </el-option>
          <el-option
            v-for="opt_status in statuses"
            :key="opt_status.label"
            :label="opt_status.label"
            :value="opt_status.value"
          >
          </el-option>
        </el-select>

        <date-picker :from.sync="from" :to.sync="to"/> 

        <el-button class="my-1" v-loading="loading" @click="fetchRequests" type="primary">Fetch Requests</el-button>

      </div>
    </el-card> 
      <el-card>
        <div  class="table-responsive">
           <table class="table table-sm table-striped">
             <thead>
               <tr>
                 <th>
                   #
                 </th>
                 <th>
                   Name
                 </th>
                 <th>
                   From
                 </th>
                 <th>
                   To
                 </th>
                 <th>
                   Reason
                 </th>
                 <th>
                   Status
                 </th>
                 <th>
                   Requested Date
                 </th>
                 <th>
                   Actions
                 </th>
               </tr>
             </thead>
             <tbody>
               <tr v-for="(request, index) in requests" :key="request.id">
                 <td>
                   {{ ++index }}
                 </td>
                 <td>
                   {{ request.teacher.name }}
                 </td>
                 <td>
                   {{ request.from }}
                 </td>
                 <td>
                   {{ request.to }}
                 </td>
                 <td>
                   {{ request.title }}
                 </td>
                 <td>
                   {{ request.status }}
                 </td>
                 <td>
                   {{ request.date }}
                 </td>
                 <td>
                   <el-button
                    type="primary"
                    class="mx-1"
                    @click="handleOpenEdit(request.id)"
                    icon="el-icon-edit"
                    circle
                  ></el-button>
                 </td>
               </tr>
             </tbody>
           </table>
           <div v-if="nextLink" class="text-center w-100">
             <el-button class="my-1 " v-loading="loading" @click="fetchMore" type="text">
                  <i class="fa fa-arrow-down" aria-hidden="true"></i> More
              </el-button>
           </div>
        </div>
      </el-card>
    </div>
       

</template>
<script>
import DatePicker from "../components/sections/attendance/DatePicker.vue";
import { doFetch, doGet } from "../helpers/request";
import EditLeave from '../components/sections/leaverequests/EditLeave.vue'
export default {
  components: {
    DatePicker,
    EditLeave
  },
  data() {
    return {
      requests: [],
      teachers: [],
      statuses: [],
      request_id: null,
      openEdit: false,
      nextLink: null,
      loading: false,
      teacher_id: null,
      status: null,
      metaLoading: false,
      from: (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000) )).toISOString().split("T")[0],
      to:(new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000) )).toISOString().split("T")[0],
    };
  },
  mounted() {
    this.fetchTeachers();
    this.fetchStatus();
  },
  methods: {
    fetchTeachers: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({ path: "teachers" });
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
        this.metaLoading = false;
      }
    },
    fetchStatus: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({ path: "leavestatus" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.statuses = data;
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
    fetchRequests: async function () {
      try {
        this.loading = true;
        const response = await doGet({
          path: "leaveapplications",
          query: {
            teacher_id: this.teacher_id,
            status: this.status,
            start_date: this.from,
            end_date: this.to,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.requests = data.data;
        this.nextLink = data.links.next;
      } catch (err) {
        console.log(err);
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went wrong",
          position: "bottom-right",
        });
      } finally {
        this.loading = false;
      }
    },
    fetchMore: async function () {
      try {
        this.loading = true;
        const response = await doFetch({
          url: this.nextLink,
        });

        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.requests = [...this.requests, ...data.data]
        this.nextLink = data.links.next;

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
    handleOpenEdit(id){
      this.request_id = id;
      this.openEdit= true;
    }
  },
};
</script>
<style lang=""></style>
