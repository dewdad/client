<template>
    <div class="Peerconn">
        <transition name="fade">
            <!-- 失活的组件将会被缓存！-->
            <keep-alive>
                <router-view />
            </keep-alive>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'Peerconn',
    data() {
        return {};
    }
};
</script>
<style scoped>
</style>
