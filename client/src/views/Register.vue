<template>
    <div class="register">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">動漫歌曲線上查詢系統</span>
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
                        <div class="button-row">
                            <el-button type="primary" class="submit_btn" @click="submitForm">註冊</el-button>
                            <el-button type="default" class="back_btn" @click="goToLogin">返回登入</el-button>
                        </div>
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

const goToLogin = () => {
  router.push("/login");
}

const submitForm = () => {
  if (!registerForm.value) return
  registerForm.value.validate((valid) => {
    if (valid) {
        // this.$axios.post("api/users/register");
        axios.post("/api/users/register", registerUser).then( res => {
            // 註冊成功
            ElMessage({
                message: '帳號註冊成功',
                type: 'success'
            });
            router.push("/login");
        }).catch(error => {
            // 處理註冊失敗的情況
            if (error.response && error.response.status === 400) {
                ElMessage({
                    message: error.response.data || '帳號已被註冊',
                    type: 'error'
                });
            } else {
                ElMessage({
                    message: '註冊失敗，請稍後再試',
                    type: 'error'
                });
            }
        });
    } 
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

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
    border-radius: $border-radius-base;
    text-align: center;
}

.manage_tip .title {
    font-family: "Microsoft JhengHei", "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: white;
}

.registerForm {
    @include card($spacing-lg);
    margin-top: $spacing-lg;
}

.button-row {
    display: flex;
    gap: $spacing-md;
    width: 100%;
}

.submit_btn {
    @include gradient-button($success-color, darken($success-color, 10%));
    flex: 1;
}

.back_btn {
    flex: 1;
    background-color: #6c757d;
    border-color: #6c757d;
    color: white;
    
    &:hover {
        background-color: #5a6268;
        border-color: #545b62;
    }
}
</style>