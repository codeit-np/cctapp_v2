<template lang="">
    <div class="content-wrapper d-flex dark-color"  style="min-height: 100vh;">
        <div class="container-fluid my-auto mx-auto ">
            <img src="../assets/cctlogo.png" alt="Cetral Campus Of Technology, Dharan" class="logo">
            <el-card class="login-card mx-auto">
                <div slot="header">
                    <b>CCT Login</b>
                </div>

                <el-input
                    placeholder="Email"
                    class="p-2"
                    suffix-icon="el-icon-user"
                    v-model="email"
                    type="email"
                />
                
                 <el-input
                    placeholder="Password"
                    class="p-2"
                    :show-password="true"
                    suffix-icon="el-icon-lock"
                    v-model="password"
                    type="password"
                />

                 <el-button class="float-end m-2" type="primary" plain>
                     <span class="el-icon-mouse"></span>
                     Login</el-button>
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            email: '',
            password: ''
        }
    }
}
</script>
<style lang="scss" scoped>
    .login-card{
        max-width: 600px;
        min-width: 200px;
        width: 90%;
    }

    .logo{
        max-width: 300px;
        min-width: 150px;
        width: 30%;
    }

    .dark-color{
        background-color:rgb(250, 250, 250);
    }
</style>