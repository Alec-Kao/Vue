<template>
    <header class="head-nav">
        <el-row class="header-inner">
            <div class="logo-container">
                <img src="../assets/logo.png" class="logo" alt="">
                <span class="title">動漫線上查詢系統</span>
            </div>
            <div class="userinfo">
                <img :src="user.avatar || localUser.avatar" class="avatar" alt="">
                <div class="welcome">
                    <p class="name comename">歡迎</p>
                    <p class="name avatarname">{{ user.name || localUser.avatarname }}</p>
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

// 本地預設資料
const localUser = ref({
  avatar: avatarImg,
  comename: '歡迎',
  avatarname: 'Kao Alec'
})

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

<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.head-nav {
  width: 100%;
  height: 60px;
  min-width: 300px;
  padding: $spacing-xs;
  background: #324057; // 保持原設計顏色
  color: white;
  border-bottom: 1px solid darken(#324057, 10%);
  min-width: 380px; /* 最小顯示寬度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-inner {
  @include flex-between;
  width: 100%;
}

.logo-container {
  @include flex-between;
  margin-right: auto;
}

.logo {
  height: 50px;
  width: 50px;
  margin-right: $spacing-xs;
}

.title {
  font-size: $font-size-large + 4px;
  font-family: "Microsoft JhengHei", "Microsoft YaHei";
  letter-spacing: 3px;
  
  @include mobile {
    font-size: $font-size-large;
  }
}

.userinfo {
  @include flex-between;
  flex-shrink: 0;
  max-width: 250px;
  overflow: hidden;
  margin-right: $spacing-md;
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
  font-size: $font-size-base;
}

.comename {
  font-size: $font-size-extra-small;
}

.avatarname {
  color: $primary-color;
  font-weight: bold;
}

.el-dropdown {
  color: white;
}
</style>