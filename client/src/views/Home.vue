<template>
    <div class="home">
        <div class="container">
            <h1 class="title">動漫歌曲列表</h1>
            <p class="lead">聆聽觸動靈魂的旋律</p>
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

<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.home {
  width: 100%;
  height: 100%;
  background: url(../assets/showcase.png) no-repeat center center;
  background-size: cover;
  position: relative;
  
  .container {
    @include flex-column-center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 100px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    
    .title {
      font-size: $font-size-large + 12px;
      font-weight: bold;
      margin-bottom: $spacing-lg;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      
      @include mobile {
        font-size: $font-size-large + 4px;
      }
    }
    
    .lead {
      margin-top: $spacing-xl + 18px;
      font-size: $font-size-large + 4px;
      opacity: 0.9;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      
      @include mobile {
        font-size: $font-size-medium;
        margin-top: $spacing-lg;
      }
    }
  }
}
</style>