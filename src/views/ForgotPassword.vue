<template lang="">
    <div class="content-wrapper d-flex dark-color text-center"  style="min-height: 100vh;">
        <div class="container-fluid my-auto mx-auto ">
            <img src="../assets/cctlogo.png" alt="Cetral Campus Of Technology, Dharan" class="logo">
            <el-card v-loading="loading" class="login-card mx-auto">
                <div slot="header">
                    <b>Forgot Password</b>
                </div>
                <el-input
                    placeholder="Email"
                    class="p-2"
                    suffix-icon="el-icon-user"
                    v-model="form.email"
                    type="email"
                />
                <small class="text-danger" v-if="form.errors().has('email')">
                    {{ form.errors().get('email') }}
                </small>
                <small class="text-danger">
                {{ errors.email }}
                </small>

                <div class="text-center px-2">
                 <router-link :to="{ name: 'Login'}">Back To Login</router-link>
                </div>
               
                 <el-button class="float-end m-2" type="primary" round @click="forgotPassword" :disabled="loading">
                     <span class="el-icon-mouse"></span>
                     Send Reset Token</el-button>
            </el-card>
        </div>
    </div>
</template>
<script>
import {doPost} from '../helpers/request'
import form from 'vuejs-form'
export default {
    data(){
        return {
            loading: false,
            errors: {},
            form: form({
                email: ""
            }).rules({
                email: ['email', 'required']
            })
        }
    }, 
    methods:{
        forgotPassword: async function(){
            try{
            this.loading = true;
            this.form.validate();
            if (this.form.errors().any()) {
            return;
            }
            const response = await doPost({
                path: 'forgotpassword',
                body: this.form.all()
            });

            const data = await response.json();
            
            if (!response.ok) {
                this.errors = data.errors;
                throw { message: data.message };
            }

            this.$notify({
                title: "Success",
                message: data.message || "Action Was Successful",
                type: "success",
            });

            this.$router.push({path:'/password-reset'});

            }
            catch(err){
                 this.$notify.error({
                    title: "Error",
                    message: err.message || "Something went Wrong.",
                });
            }finally{
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