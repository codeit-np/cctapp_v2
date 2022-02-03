<template >
  <el-select
    v-model="faculty_id"
    placeholder="Select Faculty"
  >
    <el-option v-if="hasNull" label="All Faculties" :value="null"> </el-option>
    <el-option
      v-for="faculty in faculties"
      :key="faculty.id"
      :label="faculty.title"
      :value="faculty.id"
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
      faculties: [],
    };
  },
  methods: {
     fetchFaculties: async function () {
      try {
        this.$emit('update:loading',true)
        const response = await doGet({ path: "faculties" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }
        this.faculties = data.data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message,
          position: "bottom-right",
        });
      } finally {
        this.$emit('update:loading',false)
      }
    },
  },
  mounted() {
    this.fetchFaculties();
  },
  computed: {
    faculty_id: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
};
</script>
<style >
</style>