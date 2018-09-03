<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    beforeMount() {},
    computed: {
        ...mapState({
            theme: state => state.theme,
            routerLoading: state => state.routerLoading
        })
    },
    methods: {
    }
};
</script>
<style lang="scss">
#app {
    display: flex;
    flex-direction:column;
    min-height: 100%;
}
</style>
