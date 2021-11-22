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

        <el-select class="my-1" v-model="subject_id" placeholder="Select Subjects">
          <el-option label="All Subjects" :value="null"> </el-option>
          <el-option
            v-for="subject in filteredSubjects"
            :key="subject.id"
            :label="`${subject.title}- ${subject.term.title} - ${subject.faculty.title}`"
            :value="subject.id"
          >
          </el-option>
        </el-select>

        <date-picker :from.sync="from" :to.sync="to"/> 

        <el-button class="my-1" v-loading="loading" @click="fetchAttendance" type="primary">Fetch Attendance</el-button>

      </div>
    </el-card> 
       
      <div  class="table-responsive">
          <datatable v-loading="loading" title="SQC Report" :rows="attendances" :columns="headers"> </datatable>
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
      students: [],
      topics: [],
      attendances: [],
      teachers: [],
      terms: [],
      faculties: [],
      subjects: [],
      headers: [
        {
          label: "Teacher Name",
          field: "teacher.name",
          numeric: false,
          html: false,
        },
        {
          label: "Faculty",
          field: "subject.faculty.title",
          numeric: false,
          html: false,
        },
        {
          label: "Term",
          field: "subject.term.title",
          numeric: false,
          html: false,
        },
        {
          label: "Subject",
          field: "subject.title",
          numeric: false,
          html: false,
        },
        {
          label: "SQC",
          field: "sqc.name",
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
      from: new Date(),
      to: new Date(),
    };
  },
  mounted() {
    this.fetchTerms();
    this.fetchFaculties();
    this.fetchTeachers();
    this.fetchSubjects();
  },
  computed: {
    filteredSubjects() {
      const subs = this.subjects.filter((subject) => {
        const termFilter = this.term_id
          ? subject.term.id == this.term_id
          : true;
        const facultyFilter = this.faculty_id
          ? subject.faculty.id == this.faculty_id
          : true;
        return termFilter && facultyFilter;
      });

      return subs;
    },
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
    fetchFaculties: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({ path: "faculties" });
        const data = await response.json();
        if (!response.ok) {
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
        if (!response.ok) {
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
    fetchSubjects: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({
          path: "subjects",
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
        this.metaLoading = false;
      }
    },
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
            start_date: this.from.toISOString(),
            end_date: this.to.toISOString(),
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.attendances = data.data;
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
