<template>
    <span :class="klass">{{text}}</span>
</template>

<script>
export default {
    props: {
        emergent: String
    },
    computed: {
        text() {
            // 0——暂可不修复，1——可延后修复，2——需尽快修复
            let emergent = this.emergent + '';
            if (emergent === '1') {
                return '暂可不修复';
            } else if (emergent === '2') {
                return '可延后修复';
            } else if (emergent === '3') {
                return '需尽快修复';
            }
            return emergent || '';
        },
        klass() {
            let emergent = this.emergent + '';
            if (emergent === '2') {
                return 'font12 color-warning';
            } else if (emergent === '3') {
                return 'font12 color-danger';
            }
            return 'font12';
        }
    }
};
</script>

<style>
</style>
