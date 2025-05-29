<template>
  <!--
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  -->
  <router-view></router-view>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  width: 100%;
  height: 100%;
}


nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
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
