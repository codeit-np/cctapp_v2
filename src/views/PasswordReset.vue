<template lang="">
  <div
    class="content-wrapper d-flex dark-color text-center"
    style="min-height: 100vh;"
  >
    <div class="container-fluid my-auto mx-auto ">
      <img
        src="../assets/cctlogo.png"
        alt="Cetral Campus Of Technology, Dharan"
        class="logo"
      />
      <el-card v-loading="loading" class="login-card mx-auto">
        <div slot="header">
          <b>Password Reset</b>
        </div>
        <div class="p-2">
          <el-input
            placeholder="Token"
            suffix-icon="el-icon-paperclip"
            v-model="form.token"
            type="text"
          />
          <small class="text-danger" v-if="form.errors().has('token')">
            {{ form.errors().get("token") }}
          </small>
          <small class="text-danger">
            {{ errors.token }}
          </small>
        </div>
        <div class="p-2">
          <el-input
            placeholder="Email"
            suffix-icon="el-icon-user"
            v-model="form.email"
            type="email"
          />
          <small class="text-danger" v-if="form.errors().has('email')">
            {{ form.errors().get("email") }}
          </small>
          <small class="text-danger">
            {{ errors.email }}
          </small>
        </div>

        <div class="p-2">
          <el-input
            placeholder="Password"
            :show-password="true"
            suffix-icon="el-icon-lock"
            v-model="form.password"
            type="password"
          />
          <small class="text-danger" v-if="form.errors().has('password')">
            {{ form.errors().get("password") }}
          </small>
          <small class="text-danger">
            {{ errors.password }}
          </small>
        </div>

        <div class="p-2">
          <el-input
            placeholder="Conform Password"
            type="password"
            label="Conform Password"
            v-model="form.password_confirmation"
          />

          <small
            class="text-danger"
            v-if="form.errors().has('password_confirmation')"
          >
            {{ form.errors().get("password_confirmation") }}
          </small>
          <small class="text-danger">
            {{ errors.password_confirmation }}
          </small>
        </div>

        <div class="text-center px-2">
          <router-link :to="{ name: 'Login' }">Back To Login</router-link>
        </div>

        <el-button
          class="float-end m-2"
          type="primary"
          round
          @click="forgotPassword"
          :disabled="loading"
        >
          <span class="el-icon-mouse"></span>
          Send Reset Token</el-button
        >
      </el-card>
    </div>
  </div>
</template>
<script>
import { doPost } from "../helpers/request";
import form from "vuejs-form";
export default {
  data() {
    return {
      loading: false,
      errors: {},
      form: form({
        token: this.$route.query.token,
        email: "",
        password: "",
        password_confirmation: "",
      }).rules({
        token: 'required',
        email: ["email", "required"],
        password: ["required", "min:6", "confirmed"],
      })
        .messages({
            "password.confirmed": "Whoops, Passwords doesn't match.",
        }),
    };
  },
  methods: {
    forgotPassword: async function() {
      try {
        this.loading = true;
        this.form.validate();
        if (this.form.errors().any()) {
          return;
        }
        const response = await doPost({
          path: `reset/${this.form.token}`,
          body: this.form.all(),
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

        this.$router.push({ path: "/login" });
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
<style lang="scss" scoped>
.login-card {
  max-width: 600px;
  min-width: 200px;
  width: 90%;
}

.logo {
  max-width: 400px;
  min-width: 200px;
  width: 50%;
}

.dark-color {
  background-color: rgb(250, 250, 250);
}
</style>
