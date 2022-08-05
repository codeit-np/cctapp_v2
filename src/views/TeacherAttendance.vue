<template lang="en">
   <div class="container-fluid">
      <h3 class="p-2">SQC Reports</h3>
      <el-card v-loading="metaLoading">
       <h5> Filters
        </h5> 
      <div class="d-flex flex-wrap space-between justify-content-between flex-column flex-lg-row px-4">
 

        <teachers-drop-down  class="my-1" v-model="teacher_id" :loading.sync="metaLoading" :hasNull="true"/>
        <faculties-drop-down  class="my-1" v-model="faculty_id" :loading.sync="metaLoading" :hasNull="true"/>
        <terms-drop-down  class="my-1" v-model="term_id" :loading.sync="metaLoading" :hasNull="true"/>
        <subjects-drop-down  class="my-1" v-model="subject_id"  :faculty_id="faculty_id" :term_id="term_id" :loading.sync="metaLoading" :hasNull="true"/>
        
        <date-picker :from.sync="from" :to.sync="to"/> 

        <el-button class="my-1" v-loading="loading" @click="fetchAttendance" type="primary">Fetch Attendance</el-button>

      </div>
    </el-card> 
       
      <div  class="table-responsive py-3">
          <!-- <datatable v-loading="loading" v-if="attendances.length>0" title="SQC Report" :rows="attendances" :columns="headers"> </datatable> -->
          <custom-data-table
             v-if="attendances.length>0"
            :title="`SQC Report`"
            :headers="headers"
            :rows="rows"
          >  </custom-data-table /> 
          <div v-if="queried && attendances.length===0" class="text-danger p-4"> Sorry No Data Available</div>
      </div>

    </div>
       

</template>
<script>
import DatePicker from "../components/sections/attendance/DatePicker.vue";
// import DataTable from "vue-materialize-datatable";
import { doGet } from "../helpers/request";
import FacultiesDropDown from '../components/Dropdowns/FacultiesDropDown.vue'
import TeachersDropDown from '../components/Dropdowns/TeachersDropdown.vue'
import TermsDropDown from '../components/Dropdowns/TermsDropdown.vue'
import SubjectsDropDown from '../components/Dropdowns/SubjectsDropdown.vue'
import CustomDataTable from '../components/DataTable.vue'
export default {
  components: {
    DatePicker,
    // datatable: DataTable,
    FacultiesDropDown,
    TeachersDropDown,
    TermsDropDown,
    SubjectsDropDown,
    CustomDataTable
  },
  data() {
    return { 
      topics: [],
      attendances: [],
      queried: false,
      headers: [
        {
          label: "Teacher",
          field: "teacher",
          numeric: false,
          html: false,
        },
        {
          label: "Faculty",
          field: "faculty",
          numeric: false,
          html: false,
        },
        {
          label: "Term",
          field: "term",
          numeric: false,
          html: false,
        },
        {
          label: "Subject",
          field: "subject",
          numeric: false,
          html: false,
        },
        {
          label: "SQC",
          field: "sqc",
          numeric: false,
          html: false,
        },
        {
          label: "Date",
          field: "date",
          numeric: false,
          html: false,
        },
        {
          label: "Time",
          field: "time",
          numeric: false,
          html: false,
        },
        {
          label: "Duration",
          field: "duration",
          numeric: false,
          html: false,
        },
        {
          label: "Remarks",
          field: "remarks",
          numeric: false,
          html: false,
        },
      ],
      faculty_id: null,
      term_id: null,
      subject_id: null,
      loading: false,
      teacher_id: null,
      metaLoading: false,
      from: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0],
      to: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0],
    };
  },
  mounted() {
    // this.fetchTerms();
    // this.fetchFaculties();
    // this.fetchTeachers();
    // this.fetchSubjects();
  },
  computed: {
    rows(){
      return this.attendances.map(attendance=>{
        return {
          teacher: attendance.teacher.name,
          faculty: attendance.subject.faculty.title,
          term: attendance.subject.term.title,
          subject: attendance.subject.title,
          sqc: attendance.sqc.name,
          date: attendance.date,
          time: attendance.time,
          duration: attendance.duration,
          remarks: attendance.remarks,
        }
      })
    }
  },
  methods: {
    // fetchTeachers: async function () {
    //   try {
    //     this.metaLoading = true;
    //     const response = await doGet({ path: "teachers" });
    //     const data = await response.json();
    //     if (!response.ok) {
    //       throw data;
    //     }
    //     this.teachers = data.data;
    //   } catch (err) {
    //     this.$notify.error({
    //       title: "Error",
    //       message: err.message,
    //       position: "bottom-right",
    //     });
    //   } finally {
    //     this.metaLoading = false;
    //   }
    // },
    // fetchFaculties: async function () {
    //   try {
    //     this.metaLoading = true;
    //     const response = await doGet({ path: "faculties" });
    //     const data = await response.json();
    //     if (!response.ok) {
    //       throw data;
    //     }
    //     this.faculties = data.data;
    //   } catch (err) {
    //     this.$notify.error({
    //       title: "Error",
    //       message: err.message,
    //       position: "bottom-right",
    //     });
    //   } finally {
    //     this.metaLoading = false;
    //   }
    // },
    // fetchTerms: async function () {
    //   try {
    //     this.metaLoading = true;
    //     const response = await doGet({ path: "terms" });
    //     const data = await response.json();
    //     if (!response.ok) {
    //       throw data;
    //     }

    //     this.terms = data.data;
    //   } catch (err) {
    //     this.$notify.error({
    //       title: "Error",
    //       message: err.message || "Something went wrong",
    //       position: "bottom-right",
    //     });
    //   } finally {
    //     this.metaLoading = false;
    //   }
    // },
    // fetchSubjects: async function () {
    //   try {
    //     this.metaLoading = true;
    //     const response = await doGet({
    //       path: "subjects",
    //     });
    //     const data = await response.json();
    //     if (!response.ok) {
    //       throw data;
    //     }

    //     this.subjects = data.data;
    //   } catch (err) {
    //     this.$notify.error({
    //       title: "Error",
    //       message: err.message || "Something went wrong",
    //       position: "bottom-right",
    //     });
    //   } finally {
    //     this.metaLoading = false;
    //   }
    // },
    fetchAttendance: async function () {
      try {
        this.loading = true;
        const response = await doGet({
          path: "teacherattendence",
          query: {
            teacher_id: this.teacher_id,
            term_id: this.term_id,
            faculty_id: this.faculty_id,
            subject_id: this.subject_id,
            start_date: this.from,
            end_date: this.to,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.attendances = data.data;
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
