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
          <b>CCT Register</b>
        </div>
        <div class="p-2">
          <el-input placeholder="Name" label="Name" v-model="form.name" />
          <div>
            <small class="text-danger" v-if="form.errors().has('name')">
              {{ form.errors().get("name") }}
            </small>

            <small class="text-danger">
              {{ errors.name }}
            </small>
          </div>
        </div>
        <div class="p-2">
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

        <div class="p-2">
          <el-input
            placeholder="Password"
            type="password"
            label="Password"
            v-model="form.password"
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
         <router-link  :to="{ name: 'Login' }">Back To Login</router-link>

        </div>
        <el-button
          class="float-end m-2"
          type="primary"
          round
          @click="register"
          :disabled="loading"
        >
          <span class="el-icon-mouse"></span>
          Register
        </el-button>
      </el-card>
    </div>
  </div>
</template>
<script>
import form from "vuejs-form";
import { doPost } from "../helpers/request";
export default {
  data() {
    return {
      loading: false,
      form: form({
        name: "",
        email: "",
        mobile: "",
        password: "",
        password_confirmation: "",
      })
        .rules({
          name: "required",
          email: ["email", "required"],
          mobile: ["numeric", "min:0"],
          password: ["required", "min:6", "confirmed"],
        })
        .messages({
          "password.confirmed": "Whoops, Passwords doesn't match.",
        }),
      errors: {},
    };
  },
  methods: {
    register: async function() {
      try {
        this.form.validate();
        if (this.form.errors().any()) {
          return;
        }
        this.loading = true;

        const response = await doPost({
          path: "register",
          body: this.form.all(),
        });

        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.$notify({
          title: "Success",
          message: data.message || "Action Was Successful",
          type: "success",
        });
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something Went Wrong",
          position: "bottom-right",
        });
        this.loading = false;
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
