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

        <div>
            <small class="text-danger" v-if="form.errors().has('year')">
                {{ form.errors().get('year') }}
            </small>
            <small class="text-danger">
            {{ errors.year }}
            </small>
        </div>

        <el-button type="primary" class="my-2" :disabled="form.empty()" @click="handleSubmit" plain>Update Batch</el-button>

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
        year: "",
      }).rules({
        year: "required|numeric",
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
          path: `batches/${this.id}`,
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          this.errors = data.errors;
          throw { message: data.message };
        }

        this.$notify({
          title: "Success",
          message: data.message || "Action was successful",
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
    fetchBatch: async function () {
      try {
        if(!this.value || this.id==null){
          return;
        }
        this.loading = true;
        const response = await doGet({ path: `batches/${this.id}` });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.form.year = data.data.year;
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
      this.fetchBatch();
  },
  watch:{
      value(){
          this.fetchBatch();
          this.form.errors().forget();
          this.errors = {}
      }
  }
};
</script>
<style scoped>
</style>