<template lang="">
   <el-dialog
    title="Edit Term"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%">
         
        <el-input
        placeholder="Select Title"
        label="Title"
        v-model="form.title" />

        <div>
            <small class="text-danger" v-if="form.errors().has('title')">
                {{ form.errors().get('title') }}
            </small>
            <small class="text-danger">
            {{ errors.year }}
            </small>
        </div>

        <el-button type="primary" class="my-2" :disabled="form.empty()" @click="handleSubmit" plain>Update Term</el-button>

</el-dialog>
</template>
<script>
import form from "vuejs-form";
import { doGet, doPost } from "../../../helpers/request";
export default {
  props: {
    value: Boolean,
    id: Number,
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
          method: "PUT",
          body: this.form.all(),
          path: `terms/${this.id}`,
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          this.errors = data.errors;
          throw { message: data.message };
        }

        this.$notify({
          title: "Success",
          message: data.message || "Action Successful",
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
    fetchTerm: async function () {
      try {
        if(!this.value || this.id==null){
          return;
        }
        this.loading = true;
        const response = await doGet({ path: `terms/${this.id}` });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.form.title = data.data.title;
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
  mounted(){
      this.fetchTerm();
  },
  watch:{
      value(){
          this.fetchTerm();
          this.form.errors().forget();
          this.errors = {}
      }
  }
};
</script>
<style scoped>
</style>