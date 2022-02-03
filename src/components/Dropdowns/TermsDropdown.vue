<template >
  <el-select v-model="term_id" placeholder="Select Term">
    <el-option v-if="hasNull" label="All Terms" :value="null"> </el-option>
    <el-option
      v-for="term in terms"
      :key="term.id"
      :label="term.title"
      :value="term.id"
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
      terms: [],
    };
  },
  methods: {
    fetchTerms: async function () {
      try {
        this.$emit("update:loading", true);
        const response = await doGet({ path: "terms" });
        const data = await response.json();
        if (!response.ok) {
          throw data;
        }

        this.terms = data.data;
      } catch (err) {
        this.$notify.error({
          title: "Error",
          message: err.message || "Something went wrong",
          position: "bottom-right",
        });
      } finally {
        this.$emit("update:loading", false);
      }
    },
  },
  mounted() {
    this.fetchTerms();
  },
  computed: {
    term_id: {
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