<template>
    <div class="page-main accountMg" style="width: 100%">
        <transition name="fade">
            <router-view/>
        </transition>
    </div>
</template>
<script>
import { mapState } from 'vuex';

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
.accountMg{
    background: #ebeef3;
}
</style>