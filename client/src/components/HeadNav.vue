<template>
    <header class="head-nav">
        <el-row class="header-inner">
            <div class="logo-container">
                <img src="../assets/logo.png" class="logo" alt="">
                <span class="title">雋喆線上後台管理系統</span>
            </div>
            <div class="userinfo">
                <img :src="localUser.avatar" class="avatar" alt="">
                <!-- <img :src="user.avatar " class="avatar" alt=""> -->
                <div class="welcome">
                    <p class="name comename">歡迎</p>
                    <p class="name avatarname">{{ user.name }}</p>
                </div>
                <span class="username">
                    <!-- 下拉式選單 -->
                    <el-dropdown trigger="click" @command="setDialogInfo">
                      <span class="el-dropdown-link">
                        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="info">個人資訊</el-dropdown-item>
                          <el-dropdown-item command="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
              </span>
            </div>
            <!-- </el-col> -->
        </el-row>
    </header>
    
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import avatarImg from '@/assets/avatar.png';

// 本地預設資料（原先 const user）
const localUser = ref({
  avatar: avatarImg,
  comename: '歡迎',
  avatarname: 'Kao Alec'
})

// 取代原本 export default 裡的 computed user（避免與 localUser 衝突）
const store = useStore()
const router = useRouter()
const user = computed(() => store.getters.user)

const setDialogInfo = (cmdItem: string) => {
  // console.log(cmdItem);
  // ElMessage(`click on item ${cmdItem}`)
  switch(cmdItem) {
    case "info":
      showInfoList();
      break;
    case "logout":
      logout();
      break;
  }
}

const showInfoList = () => {
  // console.log("個人資訊");
  router.push("/infoshow");
}

const logout = () => {
  // console.log("退出");
  // 清除 token
  localStorage.removeItem("eleToken");
  // 設置 vuex store
  store.dispatch("clearCurrentState");
  // 跳轉
  router.push("./login");
}
</script>

<style scoped>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 300px;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
  min-width: 380px; /* 最小顯示寬度 */
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: auto;
}

.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
}

.title {
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}

.userinfo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  max-width: 250px;
  overflow: hidden;
  margin-right: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.welcome {
  padding: 0 5px;
}

.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}

.comename {
  font-size: 12px;
}

.avatarname {
  color: #409eff;
  font-weight: bold;
}

.el-dropdown {
  color: #fff;
}

/* 小型螢幕標題字體大小 */
@media (max-width: 600px) {
  .title {
    font-size: 18px;
  }
}
</style>