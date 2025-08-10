<template>
    <div class="infoshow">
        <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="8">
                <div class="user">
                    <img :src="user.avatar || defaultAvatar" class="avatar" alt="">
                </div>
            </el-col>
            <el-col :span="16">
               <div class="userinfo">
                    <div class="user-item">
                        <i class="fa fa-user"></i>
                        <span>{{ user.name }}</span>
                    </div>
                    <div class="user-item">
                        <i class="fa fa-cog"></i>
                        <span>{{ user.identity == "manager" ? "管理員" : "一般會員" }}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import avatarImg from '@/assets/avatar.png';

const store = useStore();
const user = computed(() => store.getters.user);
const defaultAvatar = avatarImg;
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.infoshow {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  
  .row-bg {
    width: 100%;
    height: 100%;
  }
  
  .user {
    @include flex-column-center;
    position: relative;
    top: 30%;
    
    img {
      width: 150px;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
    
    span {
      display: block;
      text-align: center;
      margin-top: $spacing-lg;
      font-size: $font-size-large;
      font-weight: bold;
      color: $text-primary;
    }
  }
  
  .userinfo {
    height: 100%;
    background-color: $background-base;
    border-radius: $border-radius-large;
    
    .user-item {
      position: relative;
      top: 30%;
      padding: $spacing-lg;
      font-size: $font-size-large + 10px;
      color: $text-primary;
      @include flex-center;
      justify-content: flex-start;
      gap: $spacing-md;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
        border-radius: $border-radius-base;
        transform: translateX(10px);
      }
      
      i {
        color: $primary-color;
        font-size: $font-size-medium;
      }
    }
  }
}
</style>