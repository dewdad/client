<template>
    <div class="main">
        <transition name="fade-transform">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'app',
    data() {
        return {};
    }
};
</script>
<style scoped>
.main {
    background: #fff;
    height: 100%;  
}
</style>
