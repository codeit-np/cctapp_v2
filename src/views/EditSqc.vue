<template lang="">
    <div class="container-fluid">
        <assign v-model="openAssign" :sqc_id="id" />
        <remove v-model="openRemove" :sqc_id="id" />

        <span class=" px-4 d-flex ">   
            <el-button
            @click="openAssign = true"
            style=" padding: 3px 0"
            type="text"
            >
            <i class="fa fa-plus" aria-hidden="true"></i> Assign Subject
            </el-button>

            <el-button
            @click="openRemove = true"
            style=" padding: 3px 0"
            type="text"
            class="text-danger"
            >
            <i class="fa fa-minus" aria-hidden="true"></i> Remove Subject
            </el-button>
        </span>
        <edit-sqc :id="id" />
    </div>
</template>
<script>
import EditSqc from "../components/sections/sqcs/EditSqc.vue";
import AssignSubject from "../components/sections/sqcs/AssignSubjects.vue";
import RemoveSubject from "../components/sections/sqcs/RemoveSubjects.vue";

export default {
  data() {
    return {
      id: this.$route.params.id,
      openRemove: false,
      openAssign: false,
    };
  },
  components: {
    EditSqc,
    assign: AssignSubject,
    remove: RemoveSubject,

  },
};
</script>
<style lang="">
</style>