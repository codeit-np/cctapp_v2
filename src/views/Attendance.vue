<template lang="en">
   <div class="container-fluid">
      <el-card v-loading="metaLoading">
      <div class="d-flex flex-wrap space-between justify-content-between flex-column flex-lg-row px-4">
        
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

        <el-button class="my-1" v-loading="loading" @click="fetchAttendance" type="primary">Show Attendance</el-button>

      </div>
    </el-card> 
       
      <div  class="table-responsive">
          <datatable v-if="!loading && headers.length>0" title="Attendances" :rows="attendances" :columns="headers"> </datatable>
      </div>

    </div>
       

</template>
<script>
import DatePicker from "../components/sections/attendance/DatePicker.vue";
import DataTable from "vue-materialize-datatable";
import { doGet } from "../helpers/request";
import {v4 as uuidv4} from 'uuid';

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
      batches: [],
      terms: [],
      faculties: [],
      subjects: [],
      headers: [],
      faculty_id: null,
      term_id: null,
      subject_id: null,
      loading: false,
      batch_id: null,
      metaLoading: false,
      from: (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000) )).toISOString().split("T")[0],
      to:(new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000) )).toISOString().split("T")[0],
    };
  },
  mounted() {
    this.fetchTerms();
    this.fetchFaculties();
    this.fetchBatches();
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
    fetchBatches: async function () {
      try {
        this.metaLoading = true;
        const response = await doGet({ path: "batches" });
        const data = await response.json();
        if (!response.ok) {
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
          path: "attendences",
          query: {
            batch_id: this.batch_id,
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

        const attendences = data.data;
        
        const attendanceSet = {};
        const topicsKeys = [];
        const studentKeys = [];
        attendences.forEach((attendance) => {
          if(!studentKeys.includes(attendance.student.id)){
            this.students.push(attendance.student);
            studentKeys.push(attendance.student.id)  
          }
          const topicKey = `${attendance.teacher.id}-${attendance.topic}-${attendance.subject.title}-${attendance.date}`
          if(!topicsKeys.includes(topicKey)){
            this.topics.push({
              teacher_id: attendance.teacher.id,
              teacher_name: attendance.teacher.name,
              topic: attendance.topic,
              subject: attendance.subject.title,
              date: attendance.date,
            });
            topicsKeys.push(topicKey)
          }
          if (!attendanceSet[`${attendance.student.id}`]) {
            attendanceSet[`${attendance.student.id}`] = {};
          }
          attendanceSet[`${attendance.student.id}`][
            `${attendance.teacher.id}-${attendance.date}-${attendance.topic}-${attendance.subject.title}`
          ] = attendance.present;
        });

        
        //Headers For Table

        this.headers = [];

        this.headers.push({
          label: "Name",
          field: "name",
          numeric: false,
          html: false,
        });

       
        this.topics.forEach((topic) => {
          topic.id = uuidv4();
          this.headers.push({
            label: `${topic.subject}-${topic.topic}-${topic.teacher_name}-${topic.date}`,
            field: topic.id, //Row Variable
          });
        });

        //Rows For Table
        this.attendances = []
        this.students.forEach((student) => {
          const attendance = {};
          attendance.name = student['name'];
          this.topics.forEach((topic) => {
            if(attendanceSet[`${student.id}`][
                `${topic.teacher_id}-${topic.date}-${topic.topic}-${topic.subject}`
              ]==undefined){
                 attendance[topic.id] = 'N/A'
                 return;
              }
            attendance[topic.id] =
              attendanceSet[`${student.id}`][
                `${topic.teacher_id}-${topic.date}-${topic.topic}-${topic.subject}`
              ]
                ? "Present"
                : "Absent";
          });
          this.attendances.push(attendance);
        });
          
          
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
