<template>
  <div class="home" style="min-height:100vh">
    <el-container>
      <!-- <el-header>Header</el-header> -->
      <el-container>
        <el-aside width="80px">
          <sidebar />
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
export default {
  name: "Home",
  components: { Sidebar },
};
</script>

<style scoped>
.transition-box {
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  height: 100%;
  color: #fff;
  box-sizing: border-box;
}


 .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

.el-aside{
  width: min-content;
}
</style>
