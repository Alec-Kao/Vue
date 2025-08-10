<template>
    <div class="index">
        <HeadNav></HeadNav>
        <LeftMenu></LeftMenu>
        <div class="rightContainer">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import HeadNav from "../components/HeadNav.vue"
import LeftMenu from "../components/LeftMenu.vue"
</script>

<style lang="scss">
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.index {
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  .rightContainer {
    position: relative;
    top: 0;
    left: 180px;
    width: calc(100% - 180px);
    height: calc(100% - 71px);
    overflow: auto;
    transition: all 0.3s ease;
    
    @include mobile {
      left: 60px;
      width: calc(100% - 60px);
    }
  }
}
</style>