<template lang="">
   <el-dialog
    :title="title"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%">
      <input class="form-control" type="file" name="file" id="file" ref="file">
       <small class="text-danger" v-if="form.errors().has('term_id')">
            {{ form.errors().get("file") }}
          </small>

          <small class="text-danger">
            {{ errors.file }}
          </small>
      <el-button type="primary" class="my-2"  @click="handleSubmit" plain>Load</el-button>

</el-dialog>
</template>
<script>
import form from "vuejs-form";
import { doPostForm } from "../helpers/request";
export default {
  props: {
    value: Boolean,
    path: String,
    title: String,
  },
  data() {
    return {
      form: form({
        file: "",
      }),
      loading: false,
      errors: {},
    };
  },
  mounted() {
    this.form.file = null;
  },
  methods: {
    handleClose() {
      this.$emit("input", false);
    },
    handleSubmit: async function () {
      try {
        
        this.form.file = this.$refs.file.files[0];
        this.form.validate();
        
        if (this.form.errors().any()) {
          return;
        }
        this.loading = true;
        const response = await doPostForm({
          body: this.form.all(),
          path: this.path,
        });
        const data = await response.json();
        console.log(data);
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
  watch: {
    value() {
      this.form.file = null;
      this.form.errors().forget();
      this.errors = {};
    },
  },
};
</script>
<style scoped>
</style>