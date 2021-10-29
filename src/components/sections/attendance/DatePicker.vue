<template lang="">
  <el-date-picker
  v-model="date"
  type="daterange"
  align="right"
  unlink-panels
  range-separator="-"
  start-placeholder="Start date"
  end-placeholder="End date"
  :picker-options="pickerOptions">
  </el-date-picker>
</template>
<script>
export default {
  props:{
    from: Date,
    to: Date
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "Last week",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last month",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 3 months",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 4 months",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 120);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last 6 Months",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "Last Year",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      }
    };
  },
  computed:{
    date: {
      get() {
        return [this.from, this.to]
      },
      set(newValue) {
        this.$emit('update:from', new Date(newValue[0]))
        this.$emit('update:to', new Date(newValue[1]))
      },
    },
  }
};
</script>
<style lang="">
</style>