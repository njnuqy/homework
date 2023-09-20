<template>
  <div style="height:100vh;justify-content: center; align-items: center;background-color: #0f9876;display: flex ;">
    <div style="display: flex;background-color: white;width: 50%;border-radius: 5px;overflow: hidden;">
      <div style="flex:1;">

      </div>
      <div style="flex:1;display: flex;align-items: center;justify-content: center;">
        <el-form :model="user" style="width: 80%;" :rules="rules" ref="registerRef">
          <div style="font-size:20px;font-weight: bold;text-align: center;margin-bottom: 15px;">欢迎注册</div>
          <el-form-item prop="phone">
            <el-input prefix-icon="el-icon-user" placeholder="请输入手机号" v-model="user.phone" size="medium"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="user.password" show-password></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div style="display: flex;">
              <el-input style="flex:1" prefix-icon="el-icon-circle-check" v-model="usercode"></el-input>
              <div style="flex:1">
                <valid-code @update:value="getCode"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%;" @click="register">注 册</el-button>
          </el-form-item>
          <div style="display:flex">
            <div style="flex:1">已有账号？请<span style="color:#0f9876;cursor:pointer;" @click="toLogin">登录</span></div>
          </div> 
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import ValidCode from "@/components/ValidCode.vue"
import request from '../utils/request'
export default {
    name:"Login_",
    components:{
      ValidCode
    },
    data(){
      //验证码校验
      const validateCode = (rule,value,callback) => {
        if(this.usercode === ''){
          callback(new Error('请输入验证码'))
        }else if(this.usercode.toLowerCase() != this.code){
          callback(new Error('验证码错误'))
        }else{
          callback()
        }
      }
      return{
        code:"",
        usercode:"",
        user:{
          phone:"",
          password:""
        },
        rules:{
          phone:[
            {required:true,message:'请输入手机号',trigger:"blur"}
          ],
          password:[
            {required:true,message:'请输入密码',trigger:"blur"}
          ],
          code:[
            {validator:validateCode,trigger:"blur"}
          ]
        }
      }
    },
    methods:{
      getCode(code){
        this.code = code.toLowerCase()
        console.log(this.code)
      },
      register(){
        this.$refs['registerRef'].validate((valid)=>{
          if(valid){
            request.post("/user/register").then(res=>{
          console.log(res)
        })}})},
        toLogin(){
          this.$router.push('/login')
        }
  }
}
</script>

<style>

</style>