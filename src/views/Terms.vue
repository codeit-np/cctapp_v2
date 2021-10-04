<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate" @success="fetchTerms" />
    <edit v-model="openEdit" :id="activeID" @success="fetchTerms" />
    <el-skeleton v-if="loading" :rows="10" animated />
    <el-card v-else>
      <div slot="header" class="clearfix">
        <span>Terms</span>
        <el-button
          @click="openCreate = true"
          style="float: right; padding: 3px 0"
          type="text"
        >
          <i class="fa fa-plus" aria-hidden="true"></i> Add
        </el-button>
      </div>
      <table class="table table-sm table-bordered">
        <thead>
          <tr>
            <th width="5%">
              #
            </th>
            <th width="80%" class="text-center">
              Title
            </th>
            <th width="15%">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(term, index) in terms" :key="term.id">
            <td>
              {{ ++index }}
            </td>
            <td class="text-center">
              {{ term.title }}
            </td>
            <td>
              <el-button
                type="primary"
                class="mx-1"
                @click="handleOpenEdit(term.id)"
                icon="el-icon-edit"
                circle
              ></el-button>
             
            </td>
          </tr>
        </tbody>
      </table>
    </el-card>
  </div>
</template>
<script>
import { doGet } from "../helpers/request";
import Create from "../components/sections/terms/CreateTerm.vue";
import Edit from "../components/sections/terms/EditTerm.vue";

export default {
  data() {
    return {
      openCreate: false,
      openEdit: false,
      activeID: null,
      terms: [],
      loading: false,
    };
  },
  components: {
    Create,
    Edit,
  },
  methods: {
    fetchTerms: async function () {
      try {
        this.loading = true;
        const response = await doGet({ path: "terms" });
        const data = await response.json();
        if(!response.ok){
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
        this.loading = false;
      }
    },
    handleOpenEdit(id) {
      this.activeID = id;
      this.openEdit = true;
    },
   
  },
  mounted: function () {
    this.fetchTerms();
  },
};
</script>
<style scoped></style>
