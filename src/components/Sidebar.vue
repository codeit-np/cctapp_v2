<template lang="">
  <el-menu
    class="el-menu-vertical-demo pt-4"
    :collapse="isCollapse"
  >
    <el-menu-item @click="$router.push({ name: 'Landing' })" index="0">
       <i class="fas fa-home"></i> 
        <span slot="title">Home</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="fas fa-book-open"></i> 
        <span slot="title">Master Entry</span>
      </template>
      <el-menu-item @click="$router.push({ name: 'Batches' })" index="1-1">
         <i class="fas fa-user-graduate"></i>  
          Manage Batches
        </el-menu-item>
      <el-menu-item  @click="$router.push({ name: 'Terms' })" index="1-2">
          <i class="fas fa-school"></i>
          Manage Terms
        </el-menu-item>
      <el-menu-item index="1-3" @click="$router.push({ name: 'Faculties' })" >
          <i class="fas fa-users"></i>
          Manage Faculties
        </el-menu-item>
      <el-menu-item index="1-4" @click="$router.push({ name: 'Subject Types' })"  >
          <i class="fas fa-chalkboard"></i>
          Manage Subject Types
        </el-menu-item>
    </el-submenu>

    <el-menu-item index="2">
       <i class="fas fa-user"></i> 
        <span slot="title">Manage Students</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="fas fa-book"></i>
      <span slot="title">Manage Subjects</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="fas fa-chalkboard-teacher"></i>
      <span slot="title">Manage Teachers</span>
    </el-menu-item>
    <el-menu-item index="5">
      <i class="fas fa-user-check"></i>
      <span slot="title">Manage SQC</span>
    </el-menu-item>
    <el-menu-item index="6">
      <i class="fas fa-book-reader"></i>
      <span slot="title">Assign Subjects</span>
    </el-menu-item>
    <el-menu-item index="7">
      <i class="fas fa-bell"></i>
      <span slot="title">Manage Notifications</span>
    </el-menu-item> 
    <el-menu-item index="8" >
      <i class="fas fa-sign-out-alt text-danger"></i>
      <span slot="title">Logout</span>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: true,
    };
  },
};
</script>
<style lang="scss" scoped>

.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-width: 300px;
  max-width: 600px;
  width: 20%;
}

.el-menu-vertical-demo{
  min-height: 100%;

}
</style>
