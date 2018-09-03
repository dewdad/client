<template>
    <component :is="type" @showResult="showResult"></component>
</template>
    
<script>
import {mapGetters} from 'vuex';
import Process from './Process';
import Start from './Start';
export default {
    data() {
        return {
            type: 'Start'
        };
    },
    created() {
        if (this.scanedTody) {
            this.type = 'process';
        }
    },
    computed: {
        ...mapGetters('security', ['scanedTody'])
    },
    methods: {
        onKeyScan() {},
        showResult() {
            this.type = 'process';
        }
    },
    components: {
        Process,
        Start
    }
};
</script>

<style lang="scss">
.detect-module {
    .actions {
        height: 100%;
        line-height: 120px;
    }
    .content {
        box-sizing: border-box;
        padding: 20px 30px;
        .desc a {
            text-decoration: underline;
        }
    }
}
</style>
