<template lang="">
  <el-dialog
    title="Teacher"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Edit Teacher</span>
      </div>

      <div class="row gy-3">
        <div class="col-md-12">
          <el-input placeholder="Name" label="Name" v-model="form.name" />

          <small class="text-danger" v-if="form.errors().has('name')">
            {{ form.errors().get("name") }}
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
            v-model="form.email"
          />

          <small class="text-danger" v-if="form.errors().has('email')">
            {{ form.errors().get("email") }}
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
            v-model="form.mobile"
          />

          <small class="text-danger" v-if="form.errors().has('mobile')">
            {{ form.errors().get("mobile") }}
          </small>
          <small class="text-danger">
            {{ errors.mobile }}
          </small>
        </div>
        <div class="col-md-6">
          <el-switch
            style="display: block"
            v-model="form.is_admin"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="Admin"
            inactive-text="Regular"
          >
          </el-switch>
        </div>
         <div class="col-md-6">
          <el-switch
            style="display: block"
            v-model="form.verified"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="Verified"
            inactive-text="Pending"
          >
          </el-switch>
        </div>
      </div>

      <el-button type="primary" class="my-2" @click="handleSubmit" plain
        >Edit Teacher</el-button
      >
    </el-card>

    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>Update Password</span>
        </div>
        <div class="row gy-3 ">
            <div class="col-md-12">
          <el-input
            placeholder="Password"
            type="password"
            label="Password"
            v-model="form1.password"
          />

          <small class="text-danger" v-if="form1.errors().has('password')">
            {{ form1.errors().get("password") }}
          </small>
          <small class="text-danger">
            {{ errors.password }}
          </small>
        </div>

        <div class="col-md-12">
          <el-input
            placeholder="Conform Password"
            type="password"
            label="Conform Password"
            v-model="form1.password_confirmation"
          />

          <small
            class="text-danger"
            v-if="form1.errors().has('password_confirmation')"
          >
            {{ form1.errors().get("password_confirmation") }}
          </small>
          <small class="text-danger">
            {{ errors.password_confirmation }}
          </small>
        </div>
      </div>

      <el-button type="primary" class="my-2" @click="handleUpdatePassword" plain
        >Update Password</el-button
      >

    </el-card>
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
        name: "",
        email: "",
        mobile: "",
        is_admin: false,
        verified: false,
      }).rules({
        name: "required",
        email: ["email", "required"],
        mobile: ["numeric", "min:0"],
        is_admin: "boolean",
        verified: "boolean",
      }),

      form1: form({
        password: "",
        password_confirmation: "",
      })
        .rules({
          password: ["required", "min:6", "confirmed"],
        })
        .messages({
          "password.confirmed": "Whoops, Passwords doesn't match.",
        }),
      loading: false,
      errors: {},
    };
  },
  mounted(){
    this.fetchTeacher();
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
          path: `teachers/${this.id}`,
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
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      } finally {
        this.loading = false;
      }
    },

    handleUpdatePassword: async function () {
      try {
        this.form1.validate();
        if (this.form1.errors().any()) {
          return;
        }
        this.loading = true;
        const response = await doPost({
          method: "PUT",
          body: this.form1.all(),
          path: `teachers/${this.id}/changepassword`,
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
        this.form1.password = "";
        this.form1.password_confirmation = "";
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      } finally {
        this.loading = false;
      }
    },
    fetchTeacher: async function () {
      try {
        if (!this.value || this.id == null) {
          return;
        }
        this.loading = true;
        const response = await doGet({ path: `teachers/${this.id}` });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.form.name = data.data.name;
        this.form.email = data.data.email;
        this.form.mobile = data.data.mobile||"";
        this.form.is_admin = data.data.is_admin;
        this.form.verified = data.data.verified;

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
      this.fetchTeacher();
      this.form.errors().forget();
      this.form1.errors().forget();
      this.errors = {};
    },
  },
};
</script>
<style scoped></style>
