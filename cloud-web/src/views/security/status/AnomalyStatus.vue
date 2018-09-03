<template>
    <span :class="klass">{{text}}</span>
</template>

<script>
// 0=>未处理，1=>封停，2=>解封，3=>误报，4=>删除误报
export default {
    props: {
        data: String
    },
    data() {
        return {
            list: {
                '1': '未处理',
                '2': '已处理'
            }
        };
    },
    computed: {
        text() {
            return this.list[this.data] || this.data;
        },
        klass() {
            let data = this.data;
            if (data === '1') {
                return 'font12 color-danger';
            } else if (data === '2') {
                return 'font12 color-success';
            }
            return 'font12';
        }
    }
};
</script>

<style>
</style>
