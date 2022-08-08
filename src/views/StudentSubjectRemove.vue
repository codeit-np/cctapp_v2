<template>
  <div class="container-fluid">
    
    <select-students v-model="form.student_ids"></select-students>
    <br>
    <select-subjects v-model="form.subject_ids"></select-subjects>
    <br>
    <el-button @click="handleSubmit" type="primary"  class="m-2" v-loading="loading">
      <i class="fa fa-plus" aria-hidden="true"></i> Remove Subjects
    </el-button >
  </div>
</template>
<script>
import form from "vuejs-form";
import { doPost } from "../helpers/request";
import SelectStudents from "../components/sections/subjectstudent/SelectStudents.vue";
import SelectSubjects from "../components/sections/subjectstudent/SelectSubjects.vue";
export default {
  data() {
    return {
      form: form({
        subject_ids: [],
        student_ids: [],
      }),
      errors: {},
      loading: false,
    };
  },
  components: {
    SelectStudents,
    SelectSubjects,
  },
  methods: {
    handleSubmit: async function () {
      try {
        this.loading = true;
        console.log(this.form.all())
        const response = await doPost({
          method:'DELETE',
          body: this.form.all(),
          path: "studentassign",
        });
        
        const data = await response.json();

        if (!response.ok) {
          this.errors = data.errors;
          throw { message: data.message };
        }

        this.$notify({
          title: "Success",
          message: data.message || "Action Was Successful",
          type: "success",
        });
        this.form.subject_ids=[];
        this.form.student_ids=[];
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style></style>
