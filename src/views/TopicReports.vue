<template>
  <div>
    <h3 class="p-2">Attendance Report</h3>
    <el-card
        >
         <h5>Filters</h5>
      <div
        class="
          d-flex
          space-between
          justify-content-between
          flex-column flex-lg-row
          flex-wrap
          px-4
          gx-2
          gy-2
        "
      >
        <faculties-dropdown :hasNull="true"  :loading.sync="metaLoading" v-model="faculty_id"/>
        <terms-dropdown :hasNull="true"  :loading.sync="metaLoading" v-model="term_id"/>
        <teachers-dropdown :hasNull="true"  :loading.sync="metaLoading" v-model="teacher_id"/>
        <date-picker :from.sync="from" :to.sync="to"/> 
        <el-button class="my-1" v-loading="loading" @click="fetchTopics" type="primary">Show Lecture Topics</el-button>
      </div>
    </el-card>
    <el-skeleton v-if="loading" :rows="10" animated />
    <el-card v-else>
        <data-table v-if="topics.length>0" title="Topics" :rows="topics" :columns="headers"> </data-table>
    </el-card>   
  </div>
</template>

<script>
import FacultiesDropdown from "../components/Dropdowns/FacultiesDropDown.vue";
import TermsDropdown from "../components/Dropdowns/TermsDropdown.vue";
import TeachersDropdown from "../components/Dropdowns/TeachersDropdown.vue";
import DatePicker from '../components/sections/attendance/DatePicker.vue';
import { doGet } from "../helpers/request";
import DataTable from "vue-materialize-datatable";

export default {
  data() {
    return {
      faculty_id: null,
      from: (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000) )).toISOString().split("T")[0],
      to:(new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000) )).toISOString().split("T")[0],
      term_id: null,
      teacher_id: null,
      loading: false,
      metaLoading: false,
      topics: [],
      headers:[
        {
          label: "Date",
          field: "date",
          numeric: true,
          html: false,
        },
        {
          label: "Topic",
          field: "topic",
          numeric: false,
          html: false,
        },
        
        {
          label: "Teacher",
          field: "teacher.name",
          numeric: false,
          html: false,
        },
        {
          label: "Faculty",
          field: "faculty.title",
          numeric: false,
          html: false,
        },
        {
          label: "Term",
          field: "term.title",
          numeric: false,
          html: false,
        },
        {
          label: "Subject",
          field: "subject.title",
          numeric: false,
          html: false,
        },
       
        ]
    };
  },
  methods:{
    fetchTopics: async function() {
      try {
        this.loading = true;
        const response = await doGet({ path: "teachers/attendances",
            query:{
                faculty_id: this.faculty_id,
                term_id: this.term_id,
                // subject_id: this.subject_id,
                start_date: this.from,
                end_date: this.to,
                teacher_id: this.teacher_id
            }
        });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.topics = data.data;
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
  },
  components: {
    FacultiesDropdown,
    TermsDropdown,
    TeachersDropdown,
    DatePicker,
    DataTable,
  },
};
</script>

<style lang="scss" scoped>
</style>