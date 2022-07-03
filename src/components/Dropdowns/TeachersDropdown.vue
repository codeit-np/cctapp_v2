<template>
  <el-select v-model="teacher_id" filterable placeholder="Select Teacher">
      <el-option v-if="hasNull" label="All Teachers" :value="null"> </el-option>
    <el-option
      v-for="teacher in teachers"
      :key="teacher.id"
      :label="teacher.name"
      :value="teacher.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import { doGet } from "../../helpers/request";
export default {
  props: {
    value: Number,
    loading: Boolean,
    hasNull: Boolean,
  },
  data() {
    return {
      teachers: [],
    };
  },
  computed: {
    teacher_id: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  mounted() {
    this.fetchTeachers();
  },
  methods: {
    fetchTeachers: async function () {
      try {
        this.$emit("update:loading", true);
        const response = await doGet({ path: "teachers" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.teachers = data.data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message,
          position: "bottom-right",
        });
      } finally {
        this.$emit("update:loading", true);
      }
    },
  },
};
</script>