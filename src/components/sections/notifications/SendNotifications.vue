<template lang="">
  <el-dialog
    title="Send Notification"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%"
  >
    <el-input
        type="textarea"
        :rows="5"
        placeholder="Please input Message"
        v-model="form.message">
    </el-input>
    <el-button type="primary" class="my-2" @click="handleSubmit" plain
      >Send Message</el-button
    >
  </el-dialog>
</template>
<script>
import form from "vuejs-form";
import {  doPost } from "../../../helpers/request";
export default {
  props: {
    value: Boolean,
    user_ids: Array,
  },
  data() {
    return {
      form: form({
        message: "",
      })
        .rules({
          message: "required",
        }),
      loading: false,
      errors: {},
    };
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
        const response = await doPost({
          body: this.form.all(),
          path: "sendnotification",
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
      this.form.message="",
      this.form.errors().forget();
      this.errors = {};
    },
  },
};
</script>
<style scoped></style>
