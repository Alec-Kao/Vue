<template>
    <div class="login">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">動漫線上查詢系統</span>
                <el-form :rules="rules" ref="loginForm" :model="loginUser" class="loginForm" label-width="80px">
                    <el-form-item label="電子郵件" prop="email">
                        <el-input v-model="loginUser.email" placeholder="請輸入email"></el-input>
                    </el-form-item>
                    <el-form-item label="密碼" prop="password">
                        <el-input type="password" v-model="loginUser.password" placeholder="請輸入密碼"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="submit_btn" @click="submitForm">登入</el-button>
                    </el-form-item>
                    <div class="tiparea">
                        <p>還沒有帳號? 現在<router-link to="/register">註冊</router-link></p>
                    </div>
                </el-form> 
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'
import axios from "axios";
import { ElMessage } from "element-plus"; 
import * as jwt_decode_module from "jwt-decode";

const store = useStore();
const router = useRouter();
const loginForm = ref<FormInstance>()

const loginUser = reactive({
  email: '',
  password: ''
})

const rules: FormRules = {
  email: [{ type: "email", required: true, message: "email格式不正確", trigger: "blur" }],
  password: [
    { required: true, message: "密碼不能為空", trigger: "blur" },
    { min: 6, max: 30, message: "長度在6~30個字", trigger: "blur" }
  ],
}

const submitForm = () => {
    if (!loginForm.value) return
    loginForm.value.validate((valid) => {
        if (valid) {
            axios.post("/api/users/login", loginUser).then(res => {
                const { token } = res.data;
                localStorage.setItem("eleToken", token)

                const decoded = jwt_decode_module.jwtDecode(token);

                store.dispatch("setAuthenticated", Boolean(decoded));
                store.dispatch("setUser", decoded);

                router.push("/index");
            })
            .catch(err => {
                // 顯示登入失敗訊息
                if (err.response && err.response.data && err.response.data.message) {
                    ElMessage.error(err.response.data.message);
                } else {
                    ElMessage.error("登入失敗，請確認帳號與密碼是否正確");
                }
            });
        } 
    })
}
</script>

<style scoped>
.login {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: cover;
}

.form_container {
    width: 90%;
    max-width: 370px;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    text-align: center;
}

.title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
}

@media (max-width: 600px) {
    .title {
        font-size: 20px;
    }
}

.loginForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #ccc;
}

.submit_btn {
    width: 100%;
    max-width: 300px;
}

.tiparea {
    text-align: right;
    font-size: 12px;
    color: #333;
}

.tiparea p a {
    color: #409eff;
}
</style>
