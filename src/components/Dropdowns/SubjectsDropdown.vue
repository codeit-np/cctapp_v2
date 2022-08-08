<template >
  <el-select v-model="subject_id" filterable placeholder="Select Subject">
    <el-option v-if="hasNull" label="All Subjects" :value="null"> </el-option>
    <el-option
      v-for="subject in filteredSubjects({faculty_id,term_id})"
      :key="subject.id"
      :label="`${subject.title}- ${subject.term.title} - ${subject.faculty.title} - ${subject.subject_type.title}`"
      :value="subject.id"
    >
    </el-option>
  </el-select>
</template>
<script>
import {mapState,mapActions,mapGetters} from 'vuex'
export default {
  props: {
    value: Number,
    loading: Boolean,
    hasNull: Boolean,
    faculty_id:{
        type: Number,
        required: false,
        default: null
    },
    term_id:{
        type: Number,
        required: false,
        default: null
    },
  },
  data() {
    return {
      // subjects: [],
    };
  },
 
  methods: {
    ...mapActions('subjects',[
      'load'
    ]),
  },
  mounted() {
    this.load();
  },
  computed: {
    ...mapState('subjects',{
      data_loading: state => state.loading
    }),
    ...mapGetters('subjects',[
        'filteredSubjects'
    ]),
    subject_id: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  watch:{
    data_loading(newValue){
       this.$emit("update:loading", newValue);
    }
  }
};
</script>
<style >
</style>