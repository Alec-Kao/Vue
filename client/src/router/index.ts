import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/index.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/404.vue'
import Home from '../views/Home.vue'
import InfoShow from '../views/InfoShow.vue'
import AnimeSongList from '../views/AnimeSongList.vue'
import FavoritesList from '../views/FavoritesList.vue'
import { nextTick } from 'vue'

/// <reference types="vite/client" />

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    component: Index,
    children: [
      { path: "", component: Home },
      { path: "/home", name: "home", component: Home },
      { path: "/infoshow", name: "infoshow", component: InfoShow },
      { path: "/animesonglist", name: "animesonglist", component: AnimeSongList },
      { path: "/favoriteslist", name: "favoriteslist", component: FavoritesList }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)*',
    name: '/404',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const isLogin: boolean = localStorage.eleToken ? true : false;
  if(to.path == "/login" || to.path == '/register') {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
});

export default router 