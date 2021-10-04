<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate" @success="fetchBatches" />
    <edit v-model="openEdit" :id="activeID" @success="fetchBatches" />
    <el-skeleton v-if="loading" :rows="10" animated />
    <el-card v-else>
      <div slot="header" class="clearfix">
        <span>Batches</span>
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
              Fiscal Year
            </th>
            <th width="15%">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(batch, index) in batches" :key="batch.id">
            <td>
              {{ ++index }}
            </td>
            <td class="text-center">
              {{ batch.year }}
            </td>
            <td>
              <el-button
                type="primary"
                class="mx-1"
                @click="handleOpenEdit(batch.id)"
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
import Create from "../components/sections/batches/CreateBatch.vue";
import Edit from "../components/sections/batches/EditBatch.vue";

export default {
  data() {
    return {
      openCreate: false,
      openEdit: false,
      activeID: null,
      batches: [],
      loading: false,
    };
  },
  components: {
    Create,
    Edit,
  },
  methods: {
    fetchBatches: async function () {
      try {
        this.loading = true;
        const response = await doGet({ path: "batches" });
        const data = await response.json();
        if(!response.ok){
          throw data;
        }
        this.batches = data.data;
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
    handleOpenEdit(id) {
      this.activeID = id;
      this.openEdit = true;
    },
   
  },
  mounted: function () {
    this.fetchBatches();
  },
};
</script>
<style scoped></style>
