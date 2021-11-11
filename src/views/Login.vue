<template lang="">
    <div class="content-wrapper d-flex dark-color text-center"  style="min-height: 100vh;">
        <div class="container-fluid my-auto mx-auto ">
            <img src="../assets/cctlogo.png" alt="Cetral Campus Of Technology, Dharan" class="logo">
            <el-card v-loading="loading" class="login-card mx-auto">
                <div slot="header">
                    <b>CCT Login</b>
                </div>
                <small v-if="error" class="text-danger">
                    {{ error }}
                </small>
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
                <div class="text-center px-2">
                 <router-link :to="{ name: 'Register'}">Register As A Teacher</router-link>

                </div>
               
                 <el-button class="float-end m-2" type="primary" round @click="login" :disabled="loading">
                     <span class="el-icon-mouse"></span>
                     Login</el-button>
            </el-card>
        </div>
    </div>
</template>
<script>
import {doPost} from '../helpers/request'
import getUser from '../helpers/getUser'
export default {
    data(){
        return {
            loading: false,
            email: '',
            password: '',
            error: ""
        }
    }, 
    methods:{
        login: async function(){
            try{
                this.loading = true;
            const response = await doPost({
                path: 'login',
                body: {
                    email: this.email,
                    password: this.password
                }
            });
            
            if(!response.ok){
                this.loading = false;
                const data = await response.json();
                this.error = data.message;
                return;
            }

            const data = await response.json();
            const token = data.token;
            this.$store.commit('setToken',token);
            const {err, user} = await getUser();
            if(err){
                this.$notify.error({
                    title: 'Error',
                    message: err,
                    position: 'bottom-right'
                });
                this.loading = false;
                return;
            }

            this.loading = false;
            this.$store.commit('setUser', user);
            this.$store.commit('setIsAdmin', user.is_admin || false);

            this.$router.push({path:'/'});
            }
            catch(err){
                 this.$notify.error({
                    title: 'Error',
                    message: "Something Went Wrong",
                    position: 'bottom-right'
                });
                this.loading = false;
            }
            
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
        max-width: 400px;
        min-width: 200px;
        width: 50%;
    }

    .dark-color{
        background-color:rgb(250, 250, 250);
    }
</style>