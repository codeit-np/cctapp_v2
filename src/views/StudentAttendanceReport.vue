<template lang="">
  <div id="print-area">
    <print-only />
    <el-card class="no-print">
      <div class="py-2" v-loading="metaLoading">
        <div class="d-flex justify-content-between">
          <span
            >Select Term:
            <terms-drop-down v-model="term_id" :loading.sync="metaLoading" />
          </span>
           <span
            >Select Subject:
            <subjects-drop-down v-model="subject_id" :term_id="term_id" :loading.sync="metaLoading" :hasNull="true"/>
          </span>
          <div>
            <el-button
              class=""
              v-print="'#print-area'"
              v-loading="loading"
              type="primary"
            >
              <i class="fa fa-print" aria-hidden="true"></i>
              Print</el-button
            >
            <el-button
              class="my-1"
              v-loading="loading"
              @click="fetchAttendance"
              :disabled="!term_id"
              type="primary"
              >Show Attendance Report</el-button
            >
          </div>
        </div>
      </div>
    </el-card>
    <el-card >
      <div class="d-flex justify-content-between">
      <address v-if="student">
        <div>Name: {{ student.name }}</div>
        <div>Faculty: {{ student.faculty.title }}</div>
        <div>Term: {{ student.term.title }}</div>
        <div>Batch: {{ student.batch.year }}</div>
      </address>
        <chart  v-if="total>0" :options="chartOptions"> </chart>
      </div>
    </el-card>
    <el-card class="py-2" v-if="attendances.length > 0 || total">
      <div class="row">
        <div class="col-lg-12 table-responsive">
          <table class="table table-sm table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Topic</th>

                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(attendance, index) in attendances" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ attendance.date }}
                </td>
                <td>
                  {{ attendance.topic }}
                </td>
                <td>
                  {{ attendance.subject.title }}
                </td>
                <td :class="{ 'text-danger': !attendance.present }">
                  {{ attendance.present ? "Present" : "Absent" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TermsDropDown from "../components/Dropdowns/TermsDropdown.vue";
import SubjectsDropDown from "../components/Dropdowns/SubjectsDropdown.vue";
import PrintOnly from "../components/PrintOnly.vue";
import { doGet } from "../helpers/request";
import { Chart } from "highcharts-vue";
export default {
  data() {
    return {
      term_id: null,
      subject_id:null,
      total: null,
      present: null,
      loading: false,
      metaLoading: false,
      attendances: [],
      id: this.$route.params.id,
    };
  },
  mounted() {
    const student = this.singleStudent({ student_id: this.id });
    this.term_id = student ? student.term.id : null;
    this.fetchAttendance();
  },
  methods: {
    fetchAttendanceDetailedReport: async function () {
      try {
        if (!this.term_id) return;
        this.loading = true;
        const response = await doGet({
          path: `students/${this.$route.params.id}/attendances`,
          query: {
            term_id: this.term_id,
            subject_id: this.subject_id
          },
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message);
        }
        const data = (await response.json()).data;
        this.total = data.total;
        this.present = (data.present / data.total) * 100;
      } catch (error) {
        this.$notify.error({
          title: "Error",
          message: error.message || "Something Went Wrong",
          position: "bottom-right",
        });
      } finally {
        this.loading = false;
      }
    },
    fetchAttendanceReport: async function () {
      try {
        if (!this.term_id) return;
        this.loading = true;
        const response = await doGet({
          path: `students/${this.$route.params.id}/attendances/detailed`,
          query: {
            term_id: this.term_id,
             subject_id: this.subject_id
          },
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message);
        }
        const data = (await response.json()).data;
        this.attendances = data;
      } catch (error) {
        this.$notify.error({
          title: "Error",
          message: error.message || "Something Went Wrong",
          position: "bottom-right",
        });
      } finally {
        this.loading = false;
      }
    },
    fetchAttendance: async function () {
      this.fetchAttendanceDetailedReport();
      this.fetchAttendanceReport();
    },
  },
  components: {
    TermsDropDown,
    Chart,
    PrintOnly,
    SubjectsDropDown,

  },
  computed: {
    ...mapGetters("students", ["singleStudent"]),
    chartOptions() {
      return {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          backgroundColor: "none",
        },
        title: {
          text: "",
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage:.2f} %",
            },
          },
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.2f}%</b>",
        },
        series: [
          {
            name: "Attendance",
            colorByPoint: true,
            data: [
              {
                name: "Absent",
                y: this.total ? 100 - this.present : 0,
                color: "red",
              },
              {
                name: "Present",
                y: this.present,
                color: "green",
                sliced: true,
                selected: true,
              },
            ],
          },
        ],
      };
    },
    student() {
      return this.singleStudent({ student_id: this.id });
    },
    faculty_id(){
      const student = this.student;
      return student?student.faculty.id : null;
    }
  },
};
</script>
<style>
.print-only {
  display: none;
}

@media print {
  header,
  footer,
  aside,
  nav,
  .menu,
  .hero,
  .adslot {
    display: none;
  }
  #print-area {
    display: block;
  }
  .print-only {
    display: block;
  }
  .no-print {
    display: none;
  }
}
</style>
