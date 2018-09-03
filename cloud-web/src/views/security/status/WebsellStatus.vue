<template>
    <span :class="klass">{{text}}</span>
</template>

<script>
export default {
    props: {
        data: String
    },
    data() {
        return {
            list: {
                '0': '未处理',
                '1': '已隔离',
                '2': '已解封',
                '3': '误报',
                '4': '恢复'
            }
        };
    },
    computed: {
        text() {
            return this.list[this.data] || this.data;
        },
        klass() {
            let data = this.data;
            if (data === '0') {
                return 'font12 color-danger';
            } else if (data === '1' || data === '3') {
                //  || data === '2' || data === '3'
                return 'font12 color-success';
            }
            return 'font12';
        }
    }
};
</script>

<style>
</style>
