<template>
    <div class="register">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">動漫線上查詢系統</span>
                <el-form :rules="rules" ref="registerForm" :model="registerUser" class="registerForm" label-width="80px">
                    <el-form-item label="帳號名稱" prop="name">
                        <el-input v-model="registerUser.name" placeholder="請輸入帳號"></el-input>
                    </el-form-item>
                    <el-form-item label="電子郵件" prop="email">
                        <el-input v-model="registerUser.email" placeholder="請輸入email"></el-input>
                    </el-form-item>
                    <el-form-item label="密碼" prop="password">
                        <el-input type="password" v-model="registerUser.password" placeholder="請輸入密碼"></el-input>
                    </el-form-item>
                    <el-form-item label="確認密碼" prop="password2">
                        <el-input type="password" v-model="registerUser.password2" placeholder="請再次輸入密碼"></el-input>
                    </el-form-item>
                    <el-form-item label="選擇身分" prop="identity">
                        <el-select v-model="registerUser.identity" placeholder="請選擇身分">
                            <el-option label="管理員" value="manager"></el-option>
                            <el-option label="會員" value="employee"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" class="submit_btn" @click="submitForm">註冊</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from "axios"; // vue 3
import { ElMessage, ElLoading } from "element-plus"; // vue 3
import { useRouter } from 'vue-router';

const router = useRouter();
// 這裡命名為 registerForm，對應 template 裡的 ref="registerForm"
const registerForm = ref<FormInstance>()

const registerUser = reactive({
  name: '',
  email: '',
  password: '',
  password2: '',
  identity: ''
})

const validatePass2 = (rule: any, value: string, callback: (error?: Error) => void) => {
  if (value !== registerUser.password) {
    callback(new Error("密碼不一致"))
  } else {
    callback()
  }
}

const rules: FormRules = {
  name: [
    { required: true, message: "帳號不能為空", trigger: "blur" },
    { min: 2, max: 30, message: "長度在2到30個字", trigger: "blur" }
  ],
  email: [
    { type: "email", required: true, message: "email格式不正確", trigger: "blur" }
  ],
  password: [
    { required: true, message: "密碼不能為空", trigger: "blur" },
    { min: 6, max: 30, message: "長度在6~30個字", trigger: "blur" }
  ],
  password2: [
    { required: true, message: "確認密碼不能為空", trigger: "blur" },
    { min: 6, max: 30, message: "長度在6~30個字", trigger: "blur" },
    { validator: validatePass2, trigger: "blur" }
  ],
  identity: [
    { required: true, message: "請選擇身分", trigger: "change" }
  ]
}

const submitForm = () => {
  if (!registerForm.value) return
  registerForm.value.validate((valid) => {
    if (valid) {
        // this.$axios.post("api/users/register");
        axios.post("/api/users/register", registerUser).then( res => {
            // 註冊成功
            // 以下為 Vue 2
            // this.$message({
            //     message: "帳號註冊成功",
            //     type: 'success' 
            // })
            ElMessage({
                message: '帳號註冊成功',
                type: 'success'
            });
        });
        
        router.push("/login");
    } 
  })
}
</script>

<style scoped>
.register {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: cover;
}


.form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    text-align: center;
}


.form_container .manage_tip .title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
}

.registerForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
    width: 100%;
}
</style>