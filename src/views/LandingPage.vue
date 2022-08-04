<template lang="">
    <div class="container-fluid mx-auto text-center">
      <div class="p-4">
        <!-- <img
          src="@/assets/cctlogo.png"
          alt="Cetral Campus Of Technology, Dharan"
          class="w-25"
        /> -->
        <attendance-report-graph />

        <div class="row gy-4 my-4">
          <h4>Reports</h4>

          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'Topic Reports' })">
            <el-card shadow="hover">Attendance Report</el-card>
          </div>

          <div class="col-lg-4 col-md-6"  @click="$router.push({ name: 'Teacher Attendance' })">
            <el-card shadow="hover">SQC Report</el-card>
          </div>

          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'Teacher Reports' })">
            <el-card shadow="hover">Teacher Report</el-card>
          </div>

          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'Leave Requests' })">
            <el-card shadow="hover">Leave Requests</el-card>
          </div>

          <div class="col-lg-4 col-md-6"  @click="$router.push({ name: 'Attendance' })">
            <el-card shadow="hover">Student Attendance</el-card>
          </div>

           
        </div>


         <div class="row gy-4 my-4">
          <h4>Manage</h4>
          
          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'Students' })">
            <el-card shadow="hover">Manage Students</el-card>
          </div>
          
          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'Subjects' })">
            <el-card shadow="hover">Manage Subjects</el-card>
          </div>

          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'Teachers' })">
            <el-card shadow="hover">Manage Teachers</el-card>
          </div>

          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'SQCs' })">
            <el-card shadow="hover">Manage SQC</el-card>
          </div>

          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'Student Subject' })">
            <el-card shadow="hover">Assign Subjects To Students</el-card>
          </div>

          <div class="col-lg-4 col-md-6" @click="$router.push({ name: 'Term Increment' })">
            <el-card shadow="hover">Student Promotion</el-card>
          </div>
        </div>

        <div class="row gy-4 my-4">
          <h4>Master Entry</h4>

          <div @click="$router.push({ name: 'Batches' })"  class="col-lg-3 col-md-6">
            <el-card  shadow="hover">Manage Batches</el-card>
          </div>

          <div class="col-lg-3 col-md-6" @click="$router.push({ name: 'Terms' })">
            <el-card shadow="hover">Manage Terms</el-card>
          </div>

          <div class="col-lg-3 col-md-6" @click="$router.push({ name: 'Faculties' })">
            <el-card shadow="hover">Manage Faculties</el-card>
          </div>
          
          <div class="col-lg-3 col-md-6" @click="$router.push({ name: 'Subject Types' })">
            <el-card shadow="hover">Manage Subject Types</el-card>
          </div>
        </div>


       
      </div>
    </div>
</template>
<script>
  import AttendanceReportGraph from '../components/AttendanceReportGraph.vue';
export default {
  components:{
    AttendanceReportGraph
  }
};
</script>
<style scoped>
</style>