<template>
    <span :class="klass"><i class="iconfont icon-grade_people"></i> {{text}}</span>
</template>

<script>
export default {
    props: {
        data: String
    },
    computed: {
        text() {
            // 0——暂可不修复，1——可延后修复，2——需尽快修复
            let data = this.data;
            if (data === '1') {
                return '低危';
            } else if (data === '2') {
                return '中危';
            } else if (data === '3') {
                return '高危';
            } else if (data === '4') {
                return '严重';
            }
            return data || '';
        },
        klass() {
            let data = this.data;
            if (data === '2') {
                return 'font12 color-warning';
            } else if (data === '3' || data === '4') {
                return 'font12 color-danger';
            }
            return 'font12';
        }
    }
};
</script>

<style>
</style>
