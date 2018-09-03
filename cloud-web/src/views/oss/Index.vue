<template>
    <div class="oss">
        <transition name="fade">
            <router-view  />
        </transition>
    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    name: 'Index',
    data() {
        return {};
    },
    computed: {
        ...mapState({
            pageLoading: state => state.pageLoading,
            pageLoadError: state => state.pageLoadError
        })
    }
};
</script>
<style scoped>
</style>
