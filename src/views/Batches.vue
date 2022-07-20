<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate" @success="reload" />
    <edit v-model="openEdit" :id="activeID" @success="reload" />
    <post-csv v-model="openLoad" path="batches/load" title="Load Batches"/>
    <el-skeleton v-if="data_loading" :rows="10" animated />
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

        <el-button
          @click="openLoad = true"
          style="float: right; padding: 3px 0"
          type="text"
        >
         <i class="fa fa-upload" aria-hidden="true"></i> Load
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
             <el-popconfirm
                confirm-button-text='OK'
                cancel-button-text='No, Thanks'
                icon="el-icon-info"
                @confirm="handleDelete(batch.id)"
                icon-color="red"
                title="Are you sure to delete this?"
              >
              <el-button
                slot="reference"
                type="danger"
                class="mx-1"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-popconfirm>
            </td>
          </tr>
        </tbody>
      </table>
    </el-card>
  </div>
</template>
<script>
import {  doPost } from "../helpers/request";
import Create from "../components/sections/batches/CreateBatch.vue";
import Edit from "../components/sections/batches/EditBatch.vue";
import PostCsv from '../components/PostCsv.vue';
import {mapState,mapActions} from 'vuex';

export default {
  data() {
    return {

      openCreate: false,
      openEdit: false,
      openLoad:false,
      activeID: null,
      // loading: false,
    };
  },
  components: {
    Create,
    Edit,
    PostCsv,
  },
  methods: {
     ...mapActions('batches',[
      'load','remove','reload'
    ]),
    handleOpenEdit(id) {
      this.activeID = id;
      this.openEdit = true;
    },
    handleDelete: async function(id){
    try{
      const response = await doPost({method:'DELETE', path:`batches/${id}`});
      const data = await response.json();
      if(!response.ok){
        throw data;
      }
      this.$notify({
        title: "Success",
        message: data.message || "Action was successful",
        type: "success",
      });
      this.delete(id);
    }catch(err){
      this.$notify.error({
        title: "Error",
        message: err.message || "Something went Wrong.",
      });
    }
    },
   
  },
  computed:{
     ...mapState('batches',{
      batches: state=> state.batches,
      data_loading: state => state.loading
    }),
  },
  mounted: function () {
    this.load();
  },
};
</script>
<style scoped></style>
