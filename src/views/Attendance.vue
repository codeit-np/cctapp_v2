<template lang="en">
   <div class="container-fluid">
      <el-card v-loading="metaLoading">
      <div class="d-flex flex-wrap space-between justify-content-between flex-column flex-lg-row px-4">
        
        <batches-drop-down v-model="batch_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>
        <faculties-drop-down v-model="faculty_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>
        <terms-drop-down v-model="term_id" :loading.sync="metaLoading" class="my-1" :hasNull="true"/>
        

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
          <datatable v-if="attendances.length>0" title="Attendances" :rows="attendances" :columns="headers"> </datatable>
          <div v-if="queried && attendances.length===0" class="text-danger p-4"> Sorry No Data Available</div>
      </div>

    </div>
       

</template>
<script>
import BatchesDropDown from '../components/Dropdowns/BatchesDropDown.vue'
import FacultiesDropDown from '../components/Dropdowns/FacultiesDropDown.vue'
import TermsDropDown from '../components/Dropdowns/TermsDropdown.vue'
import DatePicker from "../components/sections/attendance/DatePicker.vue";
import DataTable from "vue-materialize-datatable";
import { doGet } from "../helpers/request";
import {v4 as uuidv4} from 'uuid';

export default {
  components: {
    DatePicker,
    datatable: DataTable,
    BatchesDropDown,
    FacultiesDropDown,
    TermsDropDown
  },
  data() {
    return {
      students: [],
      queried: false,
      topics: [],
      attendances: [],
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

          // Get Unique Students
          if(!studentKeys.includes(attendance.student.id)){
            this.students.push(attendance.student);
            studentKeys.push(attendance.student.id)  
          }
          // Get Unique Topics
          const topicKey = `${attendance.teacher.id}-${attendance.topic}-${attendance.subject.title}-${attendance.date}`
          if(!topicsKeys.includes(topicKey)){
            this.topics.push({
              teacher_id: attendance.teacher.id,
              teacher_name: attendance.teacher.name,
              topic: attendance.topic,
              subject: attendance.subject.title,
              date: attendance.date,
              faculty: attendance.faculty.title,
              term: attendance.term.title 
            });
            topicsKeys.push(topicKey)
          }

          // Group Attendance By Student

            // Add Student record if not added already
          if (!attendanceSet[`${attendance.student.id}`]) {
            attendanceSet[`${attendance.student.id}`] = {};
          }
            // Add Students attendance per topic
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
          // Get Topic Data
          topic.id = uuidv4();
          this.headers.push({
            label: `${topic.faculty}-${topic.term}-${topic.subject}-${topic.topic}-${topic.teacher_name}-${topic.date}`,
            field: topic.id, //Row Variable
          });
        });

        //Rows For Table
        this.attendances = []
        // With All Student
        this.students.forEach((student) => {
          const attendance = {};
          attendance.name = student['name'];
          // With All Topic Taken By Student
          this.topics.forEach((topic) => {
            // Check if Student has attendacne of the topic

            // if Not Print N/A
            if(attendanceSet[`${student.id}`][
                `${topic.teacher_id}-${topic.date}-${topic.topic}-${topic.subject}`
              ]==undefined){
                 attendance[topic.id] = 'N/A'
                 return;
              }

            // Else show of they are absent or Present
            attendance[topic.id] =
              attendanceSet[`${student.id}`][
                `${topic.teacher_id}-${topic.date}-${topic.topic}-${topic.subject}`
              ]
                ? "Present"
                : "Absent";
          });
          // attendences stores each student's attendance list per topic
          // where each row is a student and its topicid is column data respective to the header
          // [topic1, topic2]
              //  student:{topic1: present, topic2:absent}
          this.attendances.push(attendance);

        });
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
