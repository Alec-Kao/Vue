<template>
    <div class="notfound">
        <img src="../assets/404.gif" alt="">
    </div>
</template>

<script>
import HeadNav from '@/components/HeadNav.vue';

export default {
    name: "index",
    components: {
        HeadNav
    }
};
</script>

<style scoped>
.notfound {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.notfound img {
    width: 100%;
    height: 100%;
}
</style>