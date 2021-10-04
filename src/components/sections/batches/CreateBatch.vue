<template lang="">
   <el-dialog
    title="Create Batch"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%">
         
        <el-input
        placeholder="Select Year"
        label="Year"
        v-model="form.year" />

        <small class="text-danger" v-if="form.errors().has('year')">
            {{ form.errors().get('year') }}
        </small>
        <small class="text-danger">
          {{ errors.year }}
        </small>

        <el-button type="primary" class="my-2" :disabled="form.empty()" @click="handleSubmit" plain>Add Batch</el-button>

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
        year: "",
      }).rules({
        year: "required|numeric",
      }),
      loading: false,
      errors: {},
    };
  },
  mounted(){
    this.form.year = "";
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
        const response = await doPost({ body: this.form.all(), path:'batches' });
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
          this.errors = data.errors;
          throw { message: data.message };
        }

        this.$notify({
          title: "Success",
          message: data.message || "Action was Successful",
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