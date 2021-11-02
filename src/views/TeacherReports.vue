<template lang="en">
   <div class="container-fluid">
      <el-card v-loading="metaLoading">
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


        <date-picker :from.sync="from" :to.sync="to"/> 

        <el-button class="my-1" v-loading="loading" @click="fetchReports" type="primary">Fetch Reports</el-button>

      </div>
    </el-card> 
        <div  class="table-responsive">
            <datatable v-loading="loading" title="Teacher Reports" :rows="reports" :columns="headers"> </datatable>
        </div>

    </div>
       

</template>
<script>
import DatePicker from "../components/sections/attendance/DatePicker.vue";
import DataTable from "vue-materialize-datatable";
import { doGet } from "../helpers/request";

export default {
  components: {
    DatePicker,
    datatable: DataTable,
  },
  data() {
    return {
      reports: [],
      teachers: [],
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
      from: new Date(),
      to: new Date(),
    };
  },
  mounted() {
    this.fetchTeachers();
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
    fetchReports: async function () {
      try {
        this.loading = true;
        const response = await doGet({
          path: "teacherreports",
          query: {
            teacher_id: this.teacher_id,
            start_date: this.from.toISOString(),
            end_date: this.to.toISOString(),
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.reports = data.data;
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
