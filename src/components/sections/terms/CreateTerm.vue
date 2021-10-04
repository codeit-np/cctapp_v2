<template lang="">
   <el-dialog
    title="Create Term"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%">
         
        <el-input
        placeholder="Title"
        label="Title"
        v-model="form.title" />

        <small class="text-danger" v-if="form.errors().has('title')">
            {{ form.errors().get('title') }}
        </small>
        <small class="text-danger">
          {{ errors.title }}
        </small>

        <el-button type="primary" class="my-2" :disabled="form.empty()" @click="handleSubmit" plain>Add Term</el-button>

</el-dialog>
</template>
<script>
import form from "vuejs-form";
import { doPost } from "../../../helpers/request";
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      form: form({
        title: "",
      }).rules({
        title: "required",
      }),
      loading: false,
      errors: {},
    };
  },
  mounted(){
    this.form.title = "";
  },
  methods: {
    handleClose() {
      this.$emit("input", false);
    },
    handleSubmit: async function () {
      try {
        this.form.validate();
        if (this.form.errors().any()) {
          return;
        }
        this.loading = true;
        const response = await doPost({ body: this.form.all(), path:'terms' });
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
        
        this.$emit("success");
        this.handleClose();
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
<style scoped>
</style>