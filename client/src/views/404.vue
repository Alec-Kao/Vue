<template>
    <div class="notfound">
        <img src="../assets/404.gif" alt="">
    </div>
</template>

<script setup>
import HeadNav from '@/components/HeadNav.vue'
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.notfound {
  @include flex-center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, $background-base 0%, #f0f2f5 100%);
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: $border-radius-large;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    
    @include mobile {
      width: 90%;
      height: auto;
    }
  }
}
</style>