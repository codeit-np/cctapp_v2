<template lang="">
  <div class="container-fluid">
    <create v-model="openCreate" @success="fetchTerms" />
    <edit v-model="openEdit" :id="activeID" @success="fetchTerms" />
    <post-csv v-model="openLoad" path="terms/load" title="Load Terms"/>
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
             <el-popconfirm
              confirm-button-text='OK'
              cancel-button-text='No, Thanks'
              icon="el-icon-info"
              @confirm="handleDelete(term.id)"
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
import { doGet, doPost } from "../helpers/request";
import Create from "../components/sections/terms/CreateTerm.vue";
import Edit from "../components/sections/terms/EditTerm.vue";
import PostCsv from '../components/PostCsv.vue';


export default {
  data() {
    return {
      openCreate: false,
      openLoad:false,
      openEdit: false,
      activeID: null,
      terms: [],
      loading: false,
    };
  },
  components: {
    Create,
    Edit,
    PostCsv
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
    handleDelete: async function(id){
      try{
        const response = await doPost({method:'DELETE', path:`terms/${id}`});
        const data = await response.json();
        if(!response.ok){
          throw data;
        }
        this.$notify({
          title: "Success",
          message: data.message || "Action was successful",
          type: "success",
        });
        this.terms = this.terms.filter(term=> term.id !== id);

      }catch(err){
       this.$notify.error({
          title: "Error",
          message: err.message || "Something went Wrong.",
        });
      }
    },
  },
  mounted: function () {
    this.fetchTerms();
  },
};
</script>
<style scoped></style>
