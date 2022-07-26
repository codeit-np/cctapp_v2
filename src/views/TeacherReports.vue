<template lang="en">
   <div class="container-fluid">
    <h3 class="p-2">Teacher Reports</h3>
      <el-card v-loading="metaLoading">
        <h5>Filter</h5>
      <div class="d-flex flex-wrap space-between justify-content-between flex-column flex-lg-row px-4">
     
        <teachers-dropdown v-model="teacher_id" :loading.sync="metaLoading" :hasNull="true"/>
        <date-picker :from.sync="from" :to.sync="to"/> 

        <el-button class="my-1" v-loading="loading" @click="fetchReports" type="primary">Fetch Reports</el-button>

      </div>
    </el-card> 
        <div  class="table-responsive">
            <datatable v-loading="loading" v-if="reports.length>0" title="Teacher Reports" :rows="reports" :columns="headers"> </datatable>
            <div v-if="queried && reports.length===0" class="text-danger p-4"> Sorry No Data Available</div>
        </div>

    </div>
       

</template>
<script>
import DatePicker from "../components/sections/attendance/DatePicker.vue";
import DataTable from "vue-materialize-datatable";
import TeachersDropdown from "../components/Dropdowns/TeachersDropdown.vue";
import { doGet } from "../helpers/request";

export default {
  components: {
    DatePicker,
    datatable: DataTable,
    TeachersDropdown
  },
  data() {
    return {
      reports: [],
      queried: false,
      headers: [
        {
          label: "Teacher Name",
          field: "teacher.name",
          numeric: false,
          html: false,
        },
        {
          label: "Remarks",
          field: "remarks",
          numeric: false,
          html: false,
        },
        {
          label: "Date",
          field: "date",
          numeric: false,
          html: false,
        },
      ],
      loading: false,
      teacher_id: null,
      metaLoading: false,
      from: (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000) )).toISOString().split("T")[0],
      to:(new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000) )).toISOString().split("T")[0],
    };
  },
  mounted() {
    
  },
  methods: {
    
    fetchReports: async function () {
      try {
        this.loading = true;
        const response = await doGet({
          path: "teacherreports",
          query: {
            teacher_id: this.teacher_id,
            start_date: this.from,
            end_date: this.to,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.reports = data.data;
        this.queried = true;
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
  },
};
</script>
<style lang=""></style>
