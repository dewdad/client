<template>
    <div style="width: 100%;">
        <transition name="fade">
            <!-- 失活的组件将会被缓存！-->
                <router-view />
        </transition>
    </div>
</template>
<script>
export default {
    name: 'Index',
    data() {
        return {};
    }
};
</script>
<style scoped>
</style>
