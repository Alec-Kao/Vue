<template>
  <!--
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  -->
  <router-view></router-view>
</template>

<style lang="scss">
@import 'src/assets/scss/variables';
@import 'src/assets/scss/mixins';

html, body {
  width: max-content;
  height: 100%;
  min-width: 100%;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang TC', 'Microsoft JhengHei', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
}

nav {
  padding: $spacing-xl;
  
  a {
    font-weight: bold;
    color: $text-primary;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: $primary-color;
    }
    
    &.router-link-exact-active {
      color: $success-color;
    }
  }
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import * as jwt_decode_module from "jwt-decode";

const store = useStore()

const isEmpty = (value: any) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )
}

// 在組件掛載時執行（對應 Vue 2 的 created）
onMounted(() => {
  const token = localStorage.getItem('eleToken')
  if (token) {
    const decoded = jwt_decode_module.jwtDecode(token);
    store.dispatch('setAuthenticated', !isEmpty(decoded))  // ✅ 注意名稱正確
    store.dispatch('setUser', decoded)
  }
})
</script>
