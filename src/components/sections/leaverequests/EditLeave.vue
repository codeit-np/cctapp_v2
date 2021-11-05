<template lang="">
  <el-dialog
    title="Leave Request"
    v-loading="loading"
    :visible="value"
    @close="handleClose"
    width="90%"
  >
    <div class="row p-2 gy-2">
      <div class="col-md-6">
        <el-input placeholder="Title" label="Title" v-model="form.title" />
        <div>
          <small class="text-danger" v-if="form.errors().has('title')">
            {{ form.errors().get("title") }}
          </small>

          <small class="text-danger">
            {{ errors.title }}
          </small>
        </div>
      </div>
      <div class="col-md-6">
            <span>
                Teacher: {{ teacher_name }}    
            </span>  
        </div>  
    </div>

    <div class="row py-2 gy-2">
        <div class="col-md-6">
        <span>
            From: 
            <el-date-picker
                v-model="form.from"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="Pick a day">
            </el-date-picker>
        </span>
        <div>
          <small class="text-danger" v-if="form.errors().has('from')">
            {{ form.errors().get("from") }}
          </small>

          <small class="text-danger">
            {{ errors.from }}
          </small>
        </div>
      </div>
      <div class="col-md-6">
        <span>
            To: 
            <el-date-picker
                v-model="form.to"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="Pick a day">
            </el-date-picker>
        </span>
        <div>
          <small class="text-danger" v-if="form.errors().has('to')">
            {{ form.errors().get("to") }}
          </small>

          <small class="text-danger">
            {{ errors.to }}
          </small>
        </div>
      </div>
    </div>
    <div class="row p-2 gy-2">
      <div class="col-md-6">
        Status:
        <el-select class="my-1" v-model="form.status" placeholder="Select Status">
          <el-option
            v-for="opt_status in statuses"
            :key="opt_status.label"
            :label="opt_status.label"
            :value="opt_status.value"
          >
          </el-option>
        </el-select>

        <div>
          <small class="text-danger" v-if="form.errors().has('status')">
            {{ form.errors().get("status") }}
          </small>

          <small class="text-danger">
            {{ errors.status }}
          </small>
        </div>
      </div>

    </div>

    <el-button type="primary" class="my-2" @click="handleSubmit" plain
      >Update Leave Request</el-button
    >
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
        from: Date.now(),
        to: Date.now(),
        status: null,
      }).rules({
        title: "required",
        from: "required",
        to: "required",
        status: "required",
      }),
      statuses: [],
      loading: false,
      teacher_name: "",
      errors: {},
    };
  },
  mounted() {
    this.fetchStatuses();
    this.fetchRequest();
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
          path: `leaveapplications/${this.id}`,
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
    fetchStatuses: async function () {
      try {
        this.loading = true;
        const response = await doGet({ path: "leavestatus" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.statuses = data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message,
          position: "bottom-right",
        });
      } finally {
        this.loading = false;
      }
    },
    fetchRequest: async function () {
      try {
        if (!this.value || this.id == null) {
          return;
        }

        this.loading = true;
        const response = await doGet({ path: `leaveapplications/${this.id}` });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.form.title = data.data.title;
        this.form.from = data.data.from;
        this.form.to = data.data.to;
        this.form.status = data.data.status;
        this.teacher_name = data.data.teacher.name;
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
  computed:{
    from: {
      get() {
        return this.form.from
      },
      set(newValue) {
        this.form.from = new Date(newValue).toISOString();
      },
    },
    to: {
      get() {
        return this.form.to
      },
      set(newValue) {
        this.form.to = new Date(newValue).toISOString();
      },
    },
  },
  watch: {
    value() {
      this.form.errors().forget();
      this.errors = {};
      this.fetchRequest();
    },
  },
};
</script>
<style scoped></style>
