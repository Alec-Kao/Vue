<!-- element menu -->
<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#324057"
        text-color="#fff"
        active-text-color="#409eff"
        router
      >
        <!-- 首頁 -->
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>首頁</span>
        </el-menu-item>
       

        <!-- 動態子選單 -->
        <template v-for="item in items" :key="item.path">
          <el-sub-menu :index="'/' + item.path">
            <template #title>
              <el-icon><component :is="item.iconComponent" /></el-icon>
              <span>{{ item.name }}</span>
            </template>

            <el-menu-item
              v-for="(citem, cindex) in item.children"
              :key="cindex"
              :index="'/' + citem.path"
            >
              <span>{{ citem.name }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { House, User, Headset } from '@element-plus/icons-vue'

const items = ref([
  {
    icon: 'fa-music',
    name: '動漫歌曲管理',
    path: 'animesong',
    iconComponent: Headset,
    children: [
      { path: 'animesonglist', name: '動漫歌曲列表' },
      { path: 'favoriteslist', name: '收藏歌曲' }
    ]
  },
  {
    icon: 'fa-asterisk',
    name: '帳號管理',
    path: 'info',
    iconComponent: User,
    children: [
      { path: 'infoshow', name: '個人資訊' }
    ]
  }
])
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  @include mobile {
    width: 60px !important;
  }
}

::v-deep(.el-menu) {
  border: none;
  background-color: transparent;
}

.fa-margin {
  margin-right: $spacing-xs + 1px;
  color: rgba(white, 0.8);
}

::v-deep(.el-menu-vertical-demo) {
  &:not(.el-menu--collapse) {
    width: 180px;
    min-height: 400px;
    
    @include mobile {
      width: 60px !important;
    }
  }
  
  &.el-menu--collapse {
    width: 35px;
  }
}

::v-deep(.el-submenu .el-menu-item) {
  min-width: 180px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba($primary-color, 0.1) !important;
  }
  
  @include mobile {
    min-width: 120px;
  }
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}

a {
  text-decoration: none;
  color: inherit;
  
  &:hover {
    color: $primary-color;
  }
}

// 響應式導航欄改進
@include mobile {
  .menu_page {
    width: 60px !important;
  }
  
  ::v-deep(.el-menu-vertical-demo:not(.el-menu--collapse)) {
    width: 60px !important;
  }
  
  ::v-deep(.el-submenu .el-menu-item) {
    min-width: 120px;
  }
}
</style>