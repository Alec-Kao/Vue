<template>
    <div class="home">
        <div class="container">
            <h1 class="title">雋喆在縣</h1>
            <p class="lead"> 練習假設: 線上課程 </p>
        </div>
    </div>
</template>


<!-- <script>
import HeadNav from '@/components/HeadNav.vue';

export default {
    name: "index",
    components: {
        HeadNav
    }
};
</script> -->

<!-- <script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
</script> -->

<style scoped>
.home {
  width: 100%;
  height: 100%;
  background: url(../assets/showcase.png) no-repeat;
  background-size: 100% 100%;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
}
.title {
  font-size: 30px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
</style>