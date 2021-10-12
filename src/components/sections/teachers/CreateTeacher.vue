<template lang="">
   <el-dialog
    title="Add Teacher"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%">
         
       <div class="row gy-3">
           <div class="col-md-12">
                <el-input
                placeholder="Name"
                label="Name"
                v-model="form.name" />

                <small class="text-danger" v-if="form.errors().has('name')">
                    {{ form.errors().get('name') }}
                </small>
                <small class="text-danger">
                {{ errors.name }}
                </small>
           </div>

           <div class="col-md-6">
                <el-input
                placeholder="Email"
                type="email"
                label="Email"
                v-model="form.email" />

                <small class="text-danger" v-if="form.errors().has('email')">
                    {{ form.errors().get('email') }}
                </small>
                <small class="text-danger">
                {{ errors.email }}
                </small>
           </div>
           <div class="col-md-6">
               <el-input
                placeholder="Mobile Number"
                type="tel"
                label="Mobile Number"
                v-model="form.mobile" />

                <small class="text-danger" v-if="form.errors().has('mobile')">
                    {{ form.errors().get('mobile') }}
                </small>
                <small class="text-danger">
                {{ errors.mobile }}
                </small>
           </div>
           <div class="col-md-12">
               <el-switch
                style="display: block"
                v-model="form.is_admin"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="Admin"
                inactive-text="Regular">
                </el-switch>
           </div>

          <div class="col-md-6">
               <el-input
                placeholder="Password"
                type="password"
                label="Password"
                v-model="form.password" 
                />

                <small class="text-danger" v-if="form.errors().has('password')">
                    {{ form.errors().get('password') }}
                </small>
                <small class="text-danger">
                {{ errors.password }}
                </small>
           </div>

             <div class="col-md-6">
               <el-input
                placeholder="Conform Password"
                type="password"
                label="Conform Password"
                v-model="form.password_confirmation" 
                />

                <small class="text-danger" v-if="form.errors().has('password_confirmation')">
                    {{ form.errors().get('password_confirmation') }}
                </small>
                <small class="text-danger">
                {{ errors.password_confirmation }}
                </small>
           </div>
       </div>
        

        <el-button type="primary" class="my-2"  @click="handleSubmit" plain>Add Teacher</el-button>

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
        name: "",
        email: "",
        mobile: "",
        password: "",
        password_confirmation: "",
        is_admin: false,
      }).rules({
        name: "required",
        email: ['email','required'],
        mobile: ['numeric','min:0'],
        password: ['required','min:6','confirmed'],
        is_admin: 'boolean'
      }).messages({
        'password.confirmed': "Whoops, Passwords doesn't match.",
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
          path: "teachers",
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
        this.form .name= "";
        this.form.email= "";
        this.form.mobile= "";
        this.form.password= "";
        this.form.password_confirmation= "";
        this.form.is_admin= false;
        this.form.errors().forget();
        this.errors = {};
    },
  },
};
</script>
<style scoped>
</style>