<template>
  <el-card>
      <div class="d-flex justify-content-end w-100">
          <el-button id="no-print" class="px-2" @click="fetchAttendanceReport" v-loading="loading" type="primary"
               >Get Attendance Report</el-button
            >
         <el-button class="" v-print="'#printable'"  v-loading="loading" type="primary"
          >
          <i class="fa fa-print" aria-hidden="true"></i>
          Print</el-button
        >
      </div>
     <div id="printable">
         <div class="p-2" >
            <print-only />
            <div class="d-flex flex-column justify-content-start align-items-start">
            <div>Select Date Range:</div>
            <date-picker :from.sync="from" :to.sync="to" />
           
            </div>

            <chart :options="chartOptions" />
         </div>
     </div> 
  </el-card>
</template>
<script>
import { Chart } from "highcharts-vue";
import DatePicker from "./sections/attendance/DatePicker.vue";
import {doGet} from '../helpers/request'
import PrintOnly from './PrintOnly.vue';
export default {
  components: {
    Chart,
    DatePicker,
    PrintOnly,
  },
  data() {
    return {
      faculties: [],
      loading: false,
      from: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0],
      to: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0],
    };
  },
  methods:{
   fetchAttendanceReport: async function(){
      try{
         this.loading = true
         const response = await doGet({path:"attendences/report",
            query:{
               start_date: this.from,
               end_date: this.to
            }
         })
         if(!response.ok) {
            const error = await response.json()
            throw new Error(error.message)
         }
         const data = await response.json();
         this.faculties = data.data;
      }catch(error){
         this.$notify.error({
          title: "Error",
          message: error.message || "Something went wrong",
          position: "bottom-right",
        });
      }finally{
         this.loading = false
      }
   }
  },
  mounted(){
   this.fetchAttendanceReport()
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: "column",
          backgroundColor:"none"
        },
        title: {
          text: "Attendance Report Graph",
        },
        xAxis: {
          categories: this.faculties.map((faculty) => faculty.title),
          crosshair: true,
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: "Attendance %",
          },
        },
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f}%</b></td></tr>',
          footerFormat: "</table>",
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: "Present",
            color:"green",
            data: this.faculties.map((faculty) => {
              return (
                (faculty.present_attendances / faculty.total_attendances	) * 100
              );
            }),
          },
          {
            name: "Absent",
            color:"red",
            data: this.faculties.map((faculty) => {
              return (
                ((faculty.total_attendances - faculty.present_attendances) /
                  faculty.total_attendances) *
                100
              );
            }),
          },
        ],
      };
    },
  },
};
</script>
<style>
   @media print {
      #no-print{
         display: none;
      }
   }
</style>